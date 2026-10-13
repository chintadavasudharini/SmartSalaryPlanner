"""
Benchmark script to measure dynamic execution times for core CTP algorithms:
- Greedy Salary Allocation
- Dynamic Programming Goal Optimization
- Divide & Conquer Merge Sort vs QuickSort
- Backtracking Search
- Branch & Bound Deficit Reduction
"""

import time
import random
from app.algorithms.greedy import calculate_greedy_salary_plan
from app.algorithms.dynamic_programming import optimize_goals_dp
from app.algorithms.divide_conquer import merge_sort_records
from app.algorithms.sorting import quick_sort_records
from app.algorithms.backtracking import backtrack_expense_combinations
from app.algorithms.branch_bound import branch_bound_deficit_reduction


def run_benchmarks():
    print("==================================================")
    print("  SMART SALARY PLANNER — ALGORITHM BENCHMARKS     ")
    print("==================================================")

    # 1. Greedy Allocation Benchmark
    financial_data = {
        "emi": 15000.0, "household": 20000.0, "expenses": 8000.0,
        "savings": 10000.0, "goals": 10000.0, "investments": 10000.0, "entertainment": 5000.0
    }
    t0 = time.perf_counter()
    res_greedy = calculate_greedy_salary_plan(80000.0, financial_data)
    t1 = time.perf_counter()
    print(f"[1] Greedy Allocation (Fixed Priority): {((t1 - t0) * 1000):.4f} ms")

    # 2. DP Goal Optimization Benchmark
    goals = [
        {"name": f"Goal {i}", "required_monthly_contribution": random.randint(1000, 10000), "priority": random.randint(1, 5)}
        for i in range(25)
    ]
    t0 = time.perf_counter()
    res_dp = optimize_goals_dp(goals, available_budget=35000.0)
    t1 = time.perf_counter()
    print(f"[2] Dynamic Programming 0-1 Knapsack (25 goals): {((t1 - t0) * 1000):.4f} ms")

    # 3. Divide & Conquer Merge Sort vs QuickSort (1,000 records)
    records = [{"id": str(i), "amount": random.uniform(10.0, 5000.0)} for i in range(1000)]

    t0 = time.perf_counter()
    sorted_ms = merge_sort_records(records, key="amount", reverse=True)
    t1 = time.perf_counter()
    ms_time = (t1 - t0) * 1000.0

    t0 = time.perf_counter()
    sorted_qs = quick_sort_records(records, key="amount", reverse=True)
    t1 = time.perf_counter()
    qs_time = (t1 - t0) * 1000.0

    print(f"[3] Divide & Conquer Merge Sort (1000 items): {ms_time:.4f} ms")
    print(f"[4] QuickSort (1000 items): {qs_time:.4f} ms")

    # 4. Backtracking Combination Search Benchmark
    optional = [{"name": f"Item {i}", "amount": random.randint(500, 3000)} for i in range(12)]
    t0 = time.perf_counter()
    res_bt = backtrack_expense_combinations(optional, budget_limit=5000.0)
    t1 = time.perf_counter()
    print(f"[5] Backtracking Search (12 items): {((t1 - t0) * 1000):.4f} ms (Explored: {res_bt['nodes_explored']} nodes)")

    # 5. Branch & Bound Deficit Reduction Benchmark
    discretionary = [{"name": f"Disc {i}", "amount": random.randint(1000, 8000)} for i in range(15)]
    t0 = time.perf_counter()
    res_bb = branch_bound_deficit_reduction(discretionary, required_deficit=12000.0)
    t1 = time.perf_counter()
    print(f"[6] Branch & Bound Deficit Reduction (15 items): {((t1 - t0) * 1000):.4f} ms (Pruned: {res_bb['branches_pruned']} branches)")
    print("==================================================")


if __name__ == "__main__":
    run_benchmarks()
