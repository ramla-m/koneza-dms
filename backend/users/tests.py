from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from .models import User


LOGIN_URL = "/api/auth/login"
REFRESH_URL = "/api/auth/refresh"
ME_URL = "/api/auth/me"


def create_user(**kwargs):
    defaults = {
        "email": "test@example.com",
        "password": "StrongPass123!",
        "first_name": "Test",
        "last_name": "User",
    }
    defaults.update(kwargs)
    return User.objects.create_user(**defaults)


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = create_user()

    # ── Login ──────────────────────────────────────────────────────────────

    def test_login_valid_credentials_returns_200_and_tokens(self):
        res = self.client.post(
            LOGIN_URL,
            {"email": "test@example.com", "password": "StrongPass123!"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)
        self.assertIn("user", res.data)

    def test_login_wrong_password_returns_401(self):
        res = self.client.post(
            LOGIN_URL,
            {"email": "test@example.com", "password": "WrongPassword!"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_unknown_email_returns_401(self):
        res = self.client.post(
            LOGIN_URL,
            {"email": "nobody@example.com", "password": "SomePass123!"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_missing_fields_returns_400(self):
        # Missing password
        res = self.client.post(LOGIN_URL, {"email": "test@example.com"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", res.data)

        # Missing email
        res = self.client.post(LOGIN_URL, {"password": "StrongPass123!"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", res.data)

    def test_login_inactive_user_returns_403(self):
        inactive = create_user(
            email="inactive@example.com",
            password="StrongPass123!",
            is_active=False,
        )
        res = self.client.post(
            LOGIN_URL,
            {"email": "inactive@example.com", "password": "StrongPass123!"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    # ── /me ────────────────────────────────────────────────────────────────

    def test_me_with_valid_token_returns_user_data(self):
        # Get a token first
        login_res = self.client.post(
            LOGIN_URL,
            {"email": "test@example.com", "password": "StrongPass123!"},
            format="json",
        )
        token = login_res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        res = self.client.get(ME_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["email"], "test@example.com")
        self.assertEqual(res.data["first_name"], "Test")
        self.assertEqual(res.data["last_name"], "User")

    def test_me_with_no_token_returns_401(self):
        self.client.credentials()  # clear any existing creds
        res = self.client.get(ME_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── Refresh ────────────────────────────────────────────────────────────

    def test_refresh_with_valid_token_returns_new_access_token(self):
        login_res = self.client.post(
            LOGIN_URL,
            {"email": "test@example.com", "password": "StrongPass123!"},
            format="json",
        )
        refresh = login_res.data["refresh"]

        res = self.client.post(REFRESH_URL, {"refresh": refresh}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)

    def test_refresh_with_invalid_token_returns_401(self):
        res = self.client.post(
            REFRESH_URL, {"refresh": "this.is.not.valid"}, format="json"
        )
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
