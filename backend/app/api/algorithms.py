"""
Algorithms Analysis API Router.
Exposes algorithmic endpoints for Greedy, DP, Divide & Conquer, Backtracking, Branch & Bound, and Benchmarks.
"""

from app.algorithms.backtracking import backtrack_expense_combinations
from app.algorithms.branch_bound import branch_bound_deficit_reduction
from app.algorithms.divide_conquer import (
    merge_sort_records,
    recursive_category_aggregation,
)
from app.algorithms.dynamic_programming import optimize_goals_dp
from app.algorithms.greedy import calculate_greedy_salary_plan
from app.api.deps import get_current_user_id
from app.concurrency.multi_processing import run_parallel_algorithm_analysis
from app.repositories.firestore_repository import FirestoreRepository
from app.services.financial_service import FinancialService
from fastapi import APIRouter, Depends, Query

router = APIRouter(prefix="/algorithms", tags=["Algorithms Analysis"])
repo = FirestoreRepository()
service = FinancialService(repo)


@router.get("/greedy")
async def run_greedy_analysis(user_id: str = Depends(get_current_user_id)):
    summary = await service.get_user_financial_summary(user_id)
    financial_data = {
        "emi": summary["total_emi"],
        "household": summary["total_household"],
        "expenses": summary["total_expenses"],
        "savings": summary["total_savings"],
        "goals": summary["total_goal_contributions"],
        "investments": summary["total_investments"],
        "entertainment": summary["total_entertainment"],
    }
    res = calculate_greedy_salary_plan(summary["total_income"], financial_data)
    return res


@router.get("/dp-goals")
async def run_dp_goal_analysis(user_id: str = Depends(get_current_user_id)):
    summary = await service.get_user_financial_summary(user_id)
    goals = await repo.get_all("goals", user_id)
    available_budget = (
        summary["total_savings"]
        + summary["total_goal_contributions"]
        + max(0.0, summary["remaining_buffer"])
    )
    res = optimize_goals_dp(goals, available_budget)
    return res


@router.get("/divide-conquer-sort")
async def run_divide_conquer_sort(
    by: str = Query("amount", enum=["amount", "date"]),
    reverse: bool = Query(True),
    user_id: str = Depends(get_current_user_id),
):
    expenses = await repo.get_all("expenses", user_id)
    household = await repo.get_all("household", user_id)
    all_spending = expenses + household

    sorted_items = merge_sort_records(all_spending, key=by, reverse=reverse)
    cat_tree = recursive_category_aggregation(all_spending)

    return {
        "algorithm": "Divide and Conquer Merge Sort & Recursive Aggregation",
        "sorted_count": len(sorted_items),
        "sorted_records": sorted_items,
        "category_totals": cat_tree,
    }


@router.get("/backtracking")
async def run_backtracking_search(
    budget_limit: float | None = None, user_id: str = Depends(get_current_user_id)
):
    summary = await service.get_user_financial_summary(user_id)
    entertainment = await repo.get_all("entertainment", user_id)
    expenses = await repo.get_all("expenses", user_id)

    discretionary = entertainment + [
        ex for ex in expenses if ex.get("category") in ["Shopping", "Travel", "Other"]
    ]
    limit = (
        budget_limit
        if budget_limit is not None
        else (summary["total_entertainment"] + summary["total_expenses"] * 0.5)
    )

    res = backtrack_expense_combinations(discretionary, limit)
    return res


@router.get("/branch-bound")
async def run_branch_bound_deficit(user_id: str = Depends(get_current_user_id)):
    summary = await service.get_user_financial_summary(user_id)
    deficit = (
        abs(summary["remaining_buffer"]) if summary["remaining_buffer"] < 0 else 0.0
    )

    entertainment = await repo.get_all("entertainment", user_id)
    expenses = await repo.get_all("expenses", user_id)
    discretionary = entertainment + [
        ex
        for ex in expenses
        if ex.get("category") in ["Shopping", "Travel", "Personal Care", "Other"]
    ]

    res = branch_bound_deficit_reduction(discretionary, deficit)
    return res


@router.get("/benchmark")
async def run_algorithm_benchmark(user_id: str = Depends(get_current_user_id)):
    summary = await service.get_user_financial_summary(user_id)
    goals = await repo.get_all("goals", user_id)
    entertainment = await repo.get_all("entertainment", user_id)

    financial_data = {
        "emi": summary["total_emi"],
        "household": summary["total_household"],
        "expenses": summary["total_expenses"],
        "savings": summary["total_savings"],
        "goals": summary["total_goal_contributions"],
        "investments": summary["total_investments"],
        "entertainment": summary["total_entertainment"],
    }
    deficit = (
        abs(summary["remaining_buffer"]) if summary["remaining_buffer"] < 0 else 0.0
    )

    parallel_results = run_parallel_algorithm_analysis(
        income=summary["total_income"],
        financial_data=financial_data,
        goals=goals,
        discretionary=entertainment,
        deficit=deficit,
    )

    return {
        "benchmark_mode": "Multiprocessing ProcessPoolExecutor Parallel Execution",
        "user_id": user_id,
        "summary": summary,
        "results": parallel_results,
    }
