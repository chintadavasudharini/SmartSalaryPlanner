"""
Unit tests for core CTP algorithms:
- Greedy Algorithm
- Dynamic Programming
- Divide and Conquer
- Backtracking
- Branch and Bound
- Sorting and Searching
"""

import pytest
from app.algorithms.greedy import calculate_greedy_salary_plan
from app.algorithms.dynamic_programming import optimize_goals_dp
from app.algorithms.divide_conquer import merge_sort_records, recursive_category_aggregation
from app.algorithms.backtracking import backtrack_expense_combinations
from app.algorithms.branch_bound import branch_bound_deficit_reduction
from app.algorithms.sorting import quick_sort_records, sort_financial_records
from app.algorithms.searching import binary_search_by_amount, search_records, get_unique_categories


def test_greedy_algorithm_surplus():
    financial_data = {
        "emi": 10000.0,
        "household": 15000.0,
        "expenses": 5000.0,
        "savings": 10000.0,
        "goals": 5000.0,
        "investments": 5000.0,
        "entertainment": 3000.0,
    }
    result = calculate_greedy_salary_plan(60000.0, financial_data)
    assert result["surplus_buffer"] == 7000.0
    assert result["total_allocated"] == 53000.0
    assert result["is_feasible"] is True


def test_greedy_algorithm_deficit():
    financial_data = {
        "emi": 20000.0,
        "household": 25000.0,
        "expenses": 10000.0,
        "savings": 5000.0,
        "goals": 5000.0,
        "investments": 5000.0,
        "entertainment": 5000.0,
    }
    result = calculate_greedy_salary_plan(50000.0, financial_data)
    assert result["total_deficit"] > 0
    assert result["is_feasible"] is False


def test_dp_goal_optimization():
    goals = [
        {"name": "Emergency Fund", "required_monthly_contribution": 5000.0, "priority": 1},
        {"name": "Laptop", "required_monthly_contribution": 4000.0, "priority": 2},
        {"name": "Vacation", "required_monthly_contribution": 3000.0, "priority": 4},
    ]
    # Budget of 6000 allows Emergency Fund (5000) or Laptop + Vacation (7000 - too high)
    result = optimize_goals_dp(goals, 6000.0)
    assert len(result["funded_goals"]) >= 1
    assert result["total_allocated"] <= 6000.0


def test_divide_conquer_merge_sort():
    expenses = [
        {"name": "A", "amount": 300.0},
        {"name": "B", "amount": 100.0},
        {"name": "C", "amount": 500.0},
    ]
    sorted_items = merge_sort_records(expenses, key="amount", reverse=True)
    assert [x["amount"] for x in sorted_items] == [500.0, 300.0, 100.0]


def test_divide_conquer_aggregation():
    expenses = [
        {"category": "Food", "amount": 100.0},
        {"category": "Food", "amount": 200.0},
        {"category": "Travel", "amount": 150.0},
    ]
    totals = recursive_category_aggregation(expenses)
    assert totals["Food"] == 300.0
    assert totals["Travel"] == 150.0


def test_backtracking_combinations():
    optional = [
        {"name": "Netflix", "amount": 500.0},
        {"name": "Dining", "amount": 1500.0},
        {"name": "Shopping", "amount": 2000.0},
    ]
    res = backtrack_expense_combinations(optional, budget_limit=2500.0)
    assert res["feasible_combinations_count"] > 0
    for combo in res["combinations"]:
        assert combo["total_cost"] <= 2500.0


def test_branch_bound_deficit_reduction():
    discretionary = [
        {"name": "OTT", "amount": 1000.0},
        {"name": "Trips", "amount": 4000.0},
        {"name": "Games", "amount": 2000.0},
    ]
    # Deficit of 3000
    res = branch_bound_deficit_reduction(discretionary, required_deficit=3000.0)
    assert res["is_deficit_resolved"] is True
    assert res["total_reduced_amount"] >= 3000.0


def test_sorting_and_searching():
    items = [
        {"name": "Item A", "amount": 50.0, "category": "Food"},
        {"name": "Item B", "amount": 200.0, "category": "Tech"},
        {"name": "Item C", "amount": 100.0, "category": "Food"},
    ]
    qs = quick_sort_records(items, key="amount", reverse=False)
    assert [x["amount"] for x in qs] == [50.0, 100.0, 200.0]

    found = binary_search_by_amount(items, 100.0)
    assert found is not None
    assert found["name"] == "Item C"

    filtered = search_records(items, category="Food")
    assert len(filtered) == 2

    cats = get_unique_categories(items)
    assert cats == ["Food", "Tech"]
