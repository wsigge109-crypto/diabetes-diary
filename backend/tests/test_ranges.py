def test_default_ranges(client, auth):
    r = client.get("/api/ranges", headers=auth).json()
    assert r["fasting"] == {"hint": "Утренние измерения", "min": 4.0, "max": 7.0}
    assert r["after_meal"]["min"] is None
    assert set(r) == {"fasting", "after_meal", "bedtime"}


def test_save_ranges(client, auth):
    body = {"fasting": {"min": 4.5, "max": 6.5}, "after_meal": {"min": None, "max": 8.0}, "bedtime": {"min": 5, "max": 7}}
    r = client.put("/api/ranges", json=body, headers=auth)
    assert r.status_code == 200
    assert r.json()["fasting"] == {"hint": "Утренние измерения", "min": 4.5, "max": 6.5}
    assert client.get("/api/ranges", headers=auth).json()["bedtime"]["max"] == 7.0

    client.put("/api/ranges", json={"fasting": {"min": 4.0, "max": 6.0}}, headers=auth)
    r = client.get("/api/ranges", headers=auth).json()
    assert r["fasting"]["max"] == 6.0
    assert r["bedtime"]["max"] == 7.0


def test_invalid_ranges(client, auth):
    assert client.put("/api/ranges", json={"fasting": {"min": 7, "max": 4}}, headers=auth).status_code == 422
    assert client.put("/api/ranges", json={"fasting": {"min": None, "max": None}}, headers=auth).status_code == 422
    assert client.put("/api/ranges", json={"before_meal": {"min": 4, "max": 7}}, headers=auth).status_code == 422
