def test_register_login_me(client):
    r = client.post("/api/auth/register", json={"name": " Иван ", "email": "Ivan@Example.com", "password": "123456"})
    assert r.status_code == 201
    assert r.json()["user"] == {"id": 1, "name": "Иван", "email": "ivan@example.com"}

    r = client.post("/api/auth/login", json={"email": "ivan@example.com", "password": "123456"})
    assert r.status_code == 200
    token = r.json()["access_token"]

    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["email"] == "ivan@example.com"


def test_register_duplicate_email(client, auth):
    r = client.post("/api/auth/register", json={"name": "X", "email": "ANNA@example.com", "password": "123456"})
    assert r.status_code == 409


def test_register_short_password(client):
    r = client.post("/api/auth/register", json={"name": "X", "email": "x@example.com", "password": "123"})
    assert r.status_code == 422


def test_login_wrong_password(client, auth):
    r = client.post("/api/auth/login", json={"email": "anna@example.com", "password": "wrong-pass"})
    assert r.status_code == 401


def test_protected_requires_token(client):
    assert client.get("/api/entries").status_code == 401
    assert client.get("/api/entries", headers={"Authorization": "Bearer garbage"}).status_code == 401


def test_forgot_does_not_leak_existence(client, auth):
    a = client.post("/api/auth/forgot", json={"email": "anna@example.com"})
    b = client.post("/api/auth/forgot", json={"email": "nobody@example.com"})
    assert a.status_code == b.status_code == 200
    assert a.json() == b.json()


def test_password_is_hashed(client, auth):
    from app.models import User
    from app.database import get_db
    from app.main import app

    db = next(app.dependency_overrides[get_db]())
    user = db.query(User).one()
    assert user.password_hash != "secret1"
    assert user.password_hash.startswith("$2")
