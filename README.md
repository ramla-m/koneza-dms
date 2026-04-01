# Koneza DMS — Week 1: Authentication System

## Summary

Built the full authentication system for Koneza DMS.

**Backend:**
- Custom User model with email login, ADMIN/STAFF roles, tenant_id
- JWT endpoints: `/api/auth/login`, `/api/auth/refresh`, `/api/auth/me`
- Token settings: 15min access, 7 day refresh, Bearer header
- 9 automated tests, all passing

**Frontend:**
- Vite + React + TypeScript + Ant Design
- Redux auth slice — token never stored in localStorage
- Protected `/dashboard` route, public `/login` route
- Login form with loading state, error alert, validation

**Extra :**
- Admin User Management UI — create, edit, activate/deactivate and delete users directly from the browser. No terminal needed after setup.

---

## How to run

**Requirements:** Docker Desktop installed and running. Nothing else needed.

```bash
# 1. Clone the repo
git clone <repo-url>
cd koneza-dms

# 2. Create your .env file
cp .env.example .env

# 3. Start all services
docker compose up --build
```

Wait until you see both:
```
backend-1  | Starting development server at http://0.0.0.0:8000/
frontend-1 | VITE ready in ...ms
```

**4. Create the first admin user** (one-time, in a second terminal):
```bash
docker compose exec backend python manage.py createsuperuser
```

**5. Open the app:** http://localhost:5173

---

## How to test

### Automated test suite
```bash
docker compose exec backend python manage.py test users
```

### Postman
Import `koneza-dms-postman-collection.json` from the repo root into Postman.
1. Run **Login - valid credentials** first — tokens are auto-saved to collection variables.
2. Run remaining requests in order.
3. All requests include automated assertions.

---

## Test results

```
Found 9 test(s).
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
.........
----------------------------------------------------------------------
Ran 9 tests in 9.287s
OK
Destroying test database for alias 'default'...
```

---

## Known issues

- Access token is not auto-refreshed on expiry (15 min) — user must re-login. Planned for Week 2.
- No email notification when an admin creates a staff account. Password must be shared manually.
