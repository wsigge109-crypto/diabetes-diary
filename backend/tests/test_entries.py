from datetime import datetime, timedelta, timezone


def test_create_and_list_entries(client, auth):
    r = client.post("/api/entries", json={"glucose": 5.64, "context": "fasting"}, headers=auth)
    assert r.status_code == 201
    e = r.json()
    assert e["glucose"] == 5.6
    assert e["context"] == "fasting"
    assert e["datetime"].endswith(("Z", "+00:00"))

    client.post("/api/entries", json={"glucose": 8.1, "context": "after_meal"}, headers=auth)
    r = client.get("/api/entries", headers=auth)
    assert [x["glucose"] for x in r.json()] == [8.1, 5.6]


def test_entry_validation(client, auth):
    assert client.post("/api/entries", json={"glucose": 0.5, "context": "fasting"}, headers=auth).status_code == 422
    assert client.post("/api/entries", json={"glucose": 36, "context": "fasting"}, headers=auth).status_code == 422
    assert client.post("/api/entries", json={"glucose": 5, "context": "lunch"}, headers=auth).status_code == 422


def test_entries_days_filter(client, auth):
    old = (datetime.now(timezone.utc) - timedelta(days=10)).isoformat()
    client.post("/api/entries", json={"glucose": 6, "context": "bedtime", "datetime": old}, headers=auth)
    client.post("/api/entries", json={"glucose": 7, "context": "bedtime"}, headers=auth)
    assert len(client.get("/api/entries", headers=auth).json()) == 2
    assert [x["glucose"] for x in client.get("/api/entries?days=7", headers=auth).json()] == [7]


def test_users_are_isolated(client, auth):
    entry_id = client.post("/api/entries", json={"glucose": 5, "context": "fasting"}, headers=auth).json()["id"]
    r = client.post("/api/auth/register", json={"name": "B", "email": "b@example.com", "password": "123456"})
    other = {"Authorization": f"Bearer {r.json()['access_token']}"}
    assert client.get("/api/entries", headers=other).json() == []
    assert client.delete(f"/api/entries/{entry_id}", headers=other).status_code == 404
    assert client.delete(f"/api/entries/{entry_id}", headers=auth).status_code == 204
    assert client.get("/api/entries", headers=auth).json() == []


def test_stats(client, auth):
    assert client.get("/api/stats", headers=auth).json() == {
        "current": None, "week_avg": None, "in_range_percent": None, "week_count": 0,
    }
    for g, ctx in [(5.0, "fasting"), (10.0, "after_meal"), (6.0, "before_meal"), (6.0, "bedtime")]:
        client.post("/api/entries", json={"glucose": g, "context": ctx}, headers=auth)
    s = client.get("/api/stats", headers=auth).json()
    assert s["current"] == 6.0
    assert s["week_avg"] == 6.8
    # before_meal has no range; fasting ok, after_meal out, bedtime ok -> 2/3
    assert s["in_range_percent"] == 67
    assert s["week_count"] == 4
