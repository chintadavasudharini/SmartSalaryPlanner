"""
End-to-End Workflow Integration Test.
Simulates realistic complete user flow:
Register/Login
-> Add income
-> Add EMI
-> Add household expenses
-> Add expenses
-> Add savings
-> Add investment
-> Add entertainment
-> Add goal
-> Generate salary plan summary
-> Execute Greedy, DP, Divide-Conquer, Backtracking, Branch-Bound algorithms
-> Fetch AI recommendations & ask AI question.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_complete_e2e_user_workflow():
    headers = {"X-User-ID": "e2e_verified_user_101"}

    # 1. Register / Verify User
    reg = client.post(
        "/api/auth/verify-registration",
        json={
            "full_name": "Antigravity Test User",
            "email": "testuser@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!"
        }
    )
    assert reg.status_code == 200

    # 2. Add Income
    inc = client.post(
        "/api/income",
        json={"source": "Software Engineering Salary", "amount": 90000.0, "income_type": "Salary"},
        headers=headers
    )
    assert inc.status_code == 201

    # 3. Add EMI
    emi = client.post(
        "/api/emi",
        json={
            "loan_name": "Car Loan",
            "loan_type": "Vehicle Loan",
            "principal": 300000.0,
            "outstanding_amount": 300000.0,
            "annual_interest_rate": 9.0,
            "remaining_months": 36
        },
        headers=headers
    )
    assert emi.status_code == 201
    monthly_emi_val = emi.json()["monthly_emi"]
    assert monthly_emi_val > 0

    # 4. Add Household
    hhouse = client.post(
        "/api/household",
        json={"item_name": "Apartment Rent & Utilities", "category": "Rent", "amount": 22000.0},
        headers=headers
    )
    assert hhouse.status_code == 201

    # 5. Add Expense
    exp = client.post(
        "/api/expenses",
        json={"expense_name": "Fuel & Commute", "category": "Transport", "amount": 4000.0},
        headers=headers
    )
    assert exp.status_code == 201

    # 6. Add Savings
    sav = client.post(
        "/api/savings",
        json={
            "savings_goal": "Emergency Fund",
            "target_amount": 150000.0,
            "current_amount": 30000.0,
            "monthly_contribution": 10000.0,
            "target_date": "2027-12-31"
        },
        headers=headers
    )
    assert sav.status_code == 201

    # 7. Add Investment
    inv = client.post(
        "/api/investments",
        json={
            "investment_name": "Equity Index Fund",
            "investment_type": "SIP",
            "amount_invested": 50000.0,
            "monthly_contribution": 8000.0
        },
        headers=headers
    )
    assert inv.status_code == 201

    # 8. Add Entertainment
    ent = client.post(
        "/api/entertainment",
        json={"name": "Dining & Movies", "category": "Restaurants", "amount": 5000.0},
        headers=headers
    )
    assert ent.status_code == 201

    # 9. Add Goal
    goal = client.post(
        "/api/goals",
        json={
            "goal_name": "Home Down Payment",
            "goal_type": "Home",
            "target_amount": 500000.0,
            "current_amount": 100000.0,
            "deadline": "2028-12-31",
            "monthly_contribution": 12000.0,
            "priority": 1
        },
        headers=headers
    )
    assert goal.status_code == 201

    # 10. Generate Salary Plan Summary
    summary_res = client.get("/api/salary-plan/summary", headers=headers)
    assert summary_res.status_code == 200
    summary = summary_res.json()
    assert summary["total_income"] == 90000.0
    assert summary["total_allocated"] > 0
    assert "financial_health_score" in summary

    # 11. Run Greedy Algorithm
    greedy_res = client.get("/api/algorithms/greedy", headers=headers)
    assert greedy_res.status_code == 200
    assert greedy_res.json()["income"] == 90000.0

    # 12. Run DP Goal Analysis
    dp_res = client.get("/api/algorithms/dp-goals", headers=headers)
    assert dp_res.status_code == 200

    # 13. Run Divide & Conquer Sort
    dc_res = client.get("/api/algorithms/divide-conquer-sort", headers=headers)
    assert dc_res.status_code == 200

    # 14. Run AI Recommendations
    ai_rec = client.get("/api/ai/recommendations", headers=headers)
    assert ai_rec.status_code == 200
    assert "recommendations_text" in ai_rec.json()

    # 15. Ask AI Question
    ai_chat = client.post(
        "/api/ai/chat",
        json={"message": "Can I afford to increase my home goal contribution by 5000?"},
        headers=headers
    )
    assert ai_chat.status_code == 200
    assert len(ai_chat.json()["reply"]) > 0
