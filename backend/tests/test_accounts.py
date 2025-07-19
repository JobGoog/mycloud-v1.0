import pytest
from django.urls import reverse
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_signup_and_login():
    client = APIClient()
    # --- регистрация ---
    resp = client.post(
        reverse("signup"),     # 1
        {"username": "test1", "full_name": "Tester",
         "email": "a@a.com", "password": "Qwerty1!"}
    )
    assert resp.status_code == 201
    # --- логин ---
    resp = client.post(
        reverse("login"),
        {"username": "test1", "password": "Qwerty1!"},
    )
    assert resp.status_code == 200
