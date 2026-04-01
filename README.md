# Koneza DMS — Week 1: Authentication System

## Summary

Built the full authentication system for Koneza DMS including:
- Custom Django User model (email-based login, ADMIN/STAFF roles)
- JWT authentication with 15-minute access tokens and 7-day refresh tokens
- Three API endpoints: `/api/auth/login`, `/api/auth/refresh`, `/api/auth/me`
- React/TypeScript frontend with Ant Design, Redux Toolkit, and protected routing
- Full Docker setup: PostgreSQL + Django + Vite in three containers

**Decisions not in the spec:**
- Added a User Management UI (ADMIN-only) so managers can create and manage staff accounts through the browser without needing terminal access.
- Added `management_urls.py` to keep user CRUD routes separate from auth routes.

---

## How to run (from a fresh clone)

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

Wait for both of these lines to appear:
```
backend-1  | Starting development server at http://0.0.0.0:8000/
frontend-1 | VITE ready in ...ms
```

**4. Create the first admin user** (one-time setup, in a second terminal):
```bash
docker compose exec backend python manage.py createsuperuser
```

**5. Open the app:** http://localhost:5173

---

## How to test

### Run the automated test suite

```bash
docker compose exec backend python manage.py test users
```

### Postman

Import `koneza-dms-postman-collection.json` from the repo root into Postman.

1. Run **Login - valid credentials** first — the collection auto-saves your tokens.
2. Run remaining requests in order.
3. All requests include automated test assertions.

---

## Test results

<!-- 
  Run: docker compose exec backend python manage.py test users
  Then paste the output here before submitting the PR.

  Expected output:
  .........
  Ran 9 tests in 0.XXXs
  OK
-->

```
PASTE OUTPUT HERE
```

---

## Known issues

- Access token is not automatically refreshed when it expires (15 min). The user will need to log in again. Token refresh interceptor is planned for Week 2.
- No email notification when an admin creates a staff account. Password must be shared manually.
