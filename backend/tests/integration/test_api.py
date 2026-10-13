"""
Integration tests for FastAPI REST API endpoints using TestClient.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
TEST_HEADERS = {"X-User-ID": "test_integration_user"}


def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "online"


def test_empty_financial_summary():
    res = client.get("/api/salary-plan/summary", headers={"X-User-ID": "new_empty_user"})
    assert res.status_code == 200
    data = res.json()
    assert data["total_income"] == 0.0
    assert data["remaining_buffer"] == 0.0


def test_crud_income_flow():
    # 1. Create Income
    create_res = client.post(
        "/api/income",
        json={"source": "Primary Job", "amount": 75000.0, "income_type": "Salary"},
        headers=TEST_HEADERS
    )
    assert create_res.status_code == 201
    created_id = create_res.json()["id"]

    # 2. Get Incomes
    get_res = client.get("/api/income", headers=TEST_HEADERS)
    assert get_res.status_code == 200
    assert len(get_res.json()) >= 1

    # 3. Update Income
    update_res = client.put(
        f"/api/income/{created_id}",
        json={"source": "Primary Job Promoted", "amount": 85000.0, "income_type": "Salary"},
        headers=TEST_HEADERS
    )
    assert update_res.status_code == 200
    assert update_res.json()["amount"] == 85000.0

    # 4. Delete Income
    del_res = client.delete(f"/api/income/{created_id}", headers=TEST_HEADERS)
    assert del_res.status_code == 204


def test_algorithms_endpoints():
    res_greedy = client.get("/api/algorithms/greedy", headers=TEST_HEADERS)
    assert res_greedy.status_code == 200
    assert "algorithm" in res_greedy.json()

    res_dp = client.get("/api/algorithms/dp-goals", headers=TEST_HEADERS)
    assert res_dp.status_code == 200

    res_bench = client.get("/api/algorithms/benchmark", headers=TEST_HEADERS)
    assert res_bench.status_code == 200
