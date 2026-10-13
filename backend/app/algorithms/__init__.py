"""
Algorithms module initialization.
"""

from app.algorithms.backtracking import backtrack_expense_combinations
from app.algorithms.branch_bound import branch_bound_deficit_reduction
from app.algorithms.divide_conquer import (
    merge_sort_records,
    recursive_category_aggregation,
)
from app.algorithms.dynamic_programming import optimize_goals_dp
from app.algorithms.greedy import GreedySalaryStrategy, calculate_greedy_salary_plan
from app.algorithms.searching import (
    binary_search_by_amount,
    get_unique_categories,
    search_records,
)
from app.algorithms.sorting import quick_sort_records, sort_financial_records

__all__ = [
    "GreedySalaryStrategy",
    "backtrack_expense_combinations",
    "binary_search_by_amount",
    "branch_bound_deficit_reduction",
    "calculate_greedy_salary_plan",
    "get_unique_categories",
    "merge_sort_records",
    "optimize_goals_dp",
    "quick_sort_records",
    "recursive_category_aggregation",
    "search_records",
    "sort_financial_records",
]
