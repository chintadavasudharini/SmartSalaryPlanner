"""
Multiprocessing Concurrency for CPU-Bound Algorithm Performance Benchmark Analysis.
Demonstrates bypassing the Python GIL for heavy CPU-bound algorithmic computation.
"""

import logging
import time
from concurrent.futures import ProcessPoolExecutor
from typing import Any

from app.algorithms.branch_bound import branch_bound_deficit_reduction
from app.algorithms.dynamic_programming import optimize_goals_dp
from app.algorithms.greedy import calculate_greedy_salary_plan

logger = logging.getLogger(__name__)


def _run_single_analysis(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Worker function executed in separate process.
    """
    task_type = payload.get("task_type")
    income = payload.get("income", 0.0)
    financial_data = payload.get("financial_data", {})
    goals = payload.get("goals", [])
    budget = payload.get("budget", 0.0)
    deficit = payload.get("deficit", 0.0)
    discretionary = payload.get("discretionary", [])

    start = time.perf_counter()

    if task_type == "greedy":
        res = calculate_greedy_salary_plan(income, financial_data)
    elif task_type == "dp":
        res = optimize_goals_dp(goals, budget)
    elif task_type == "branch_bound":
        res = branch_bound_deficit_reduction(discretionary, deficit)
    else:
        res = {"status": "unknown"}

    elapsed_ms = (time.perf_counter() - start) * 1000.0
    res["multiprocess_execution_time_ms"] = round(elapsed_ms, 4)
    return res


def run_parallel_algorithm_analysis(
    income: float,
    financial_data: dict[str, Any],
    goals: list[dict[str, Any]],
    discretionary: list[dict[str, Any]],
    deficit: float = 0.0,
) -> dict[str, Any]:
    """
    Executes CPU-bound algorithmic analysis across multiple CPU cores in parallel using Multiprocessing.
    """
    payloads = [
        {"task_type": "greedy", "income": income, "financial_data": financial_data},
        {
            "task_type": "dp",
            "goals": goals,
            "budget": financial_data.get("savings", 0.0)
            + financial_data.get("goals", 0.0),
        },
        {
            "task_type": "branch_bound",
            "discretionary": discretionary,
            "deficit": deficit,
        },
    ]

    results = {}

    try:
        with ProcessPoolExecutor(max_workers=3) as executor:
            futures = [executor.submit(_run_single_analysis, p) for p in payloads]
            completed = [f.result() for f in futures]

            results = {
                "greedy_analysis": completed[0],
                "dp_goal_analysis": completed[1],
                "branch_bound_analysis": completed[2],
            }
    except Exception as e:  # noqa: BLE001
        logger.warning("ProcessPool analysis failed, falling back to sequential: %s", e)
        # Fallback to sequential execution if ProcessPool is restricted by environment
        results = {
            "greedy_analysis": _run_single_analysis(payloads[0]),
            "dp_goal_analysis": _run_single_analysis(payloads[1]),
            "branch_bound_analysis": _run_single_analysis(payloads[2]),
        }

    return results
