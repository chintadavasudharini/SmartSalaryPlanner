"""
Dynamic Programming Algorithm for Financial Goal Allocation.
Solves the 0-1 Bounded Goal Optimization Knapsack Problem:
Given a limited monthly goal budget (capacity) and multiple financial goals (each with required monthly contribution as weight and priority/urgency value as utility),
determines the optimal subset of goals to fund fully to maximize total financial goal utility.

DP Formulation:
- State: DP[i][w] = Maximum total priority score achievable considering first 'i' goals with total monthly contribution <= 'w'.
- Base Cases: DP[0][w] = 0 for all w; DP[i][0] = 0 for all i.
- Recurrence / Transition:
    DP[i][w] = DP[i-1][w] if w < cost[i]
    DP[i][w] = max(DP[i-1][w], DP[i-1][w - cost[i]] + value[i]) if w >= cost[i]

Time Complexity: O(N * Budget_Units) where N is number of goals and Budget_Units = Budget / Scale.
Space Complexity: O(N * Budget_Units) (retains backtracking table for solution reconstruction).
"""

from typing import Any


def optimize_goals_dp(
    goals: list[dict[str, Any]], available_budget: float, scale_factor: float = 100.0
) -> dict[str, Any]:
    """
    Optimizes monthly allocation across goals using Dynamic Programming.

    :param goals: List of goal dictionaries (each with 'name', 'required_monthly_contribution', 'priority').
    :param available_budget: Total monthly surplus budget available for goals.
    :param scale_factor: Scaling factor to convert floats to integers for DP grid indexing (default 100 for cents/paisa).
    :return: Dict containing optimal goal selection, total contribution, total utility score, and execution details.
    """
    if not goals or available_budget <= 0:
        return {
            "algorithm": "Dynamic Programming Goal Optimization",
            "available_budget": round(available_budget, 2),
            "total_allocated": 0.0,
            "total_utility_score": 0.0,
            "funded_goals": [],
            "unfunded_goals": goals,
            "dp_table_size": [0, 0],
        }

    # Clean inputs and scale weights & values
    # Higher priority (e.g. 1) gets higher utility value (e.g. 10 - priority)
    valid_items: list[dict[str, Any]] = []
    for g in goals:
        cost = max(
            1.0,
            float(
                g.get(
                    "required_monthly_contribution", g.get("monthly_contribution", 0.0)
                )
            ),
        )
        prio = int(g.get("priority", 1))
        # Utility score: Emergency Fund / High priority gets high utility weight
        value = max(1, 10 - prio) * 10
        scaled_cost = (
            max(1, round(cost / (scale_factor / 100.0))) if cost > 0 else 1
        )
        valid_items.append(
            {"original": g, "cost": cost, "scaled_cost": scaled_cost, "value": value}
        )

    capacity = round(available_budget / (scale_factor / 100.0))
    N = len(valid_items)

    # Initialize DP matrix: (N + 1) x (capacity + 1)
    dp = [[0] * (capacity + 1) for _ in range(N + 1)]

    # Fill DP matrix
    for i in range(1, N + 1):
        item = valid_items[i - 1]
        w = int(item["scaled_cost"])
        v = int(item["value"])
        for c in range(capacity + 1):
            if w <= c:
                dp[i][c] = max(dp[i - 1][c], dp[i - 1][c - w] + v)
            else:
                dp[i][c] = dp[i - 1][c]

    # Backtrack to find selected items
    funded_goals = []
    unfunded_goals = []
    c = capacity

    for i in range(N, 0, -1):
        item = valid_items[i - 1]
        w = int(item["scaled_cost"])
        if dp[i][c] != dp[i - 1][c]:
            funded_goals.append(item["original"])
            c -= w
        else:
            unfunded_goals.append(item["original"])

    funded_goals.reverse()
    total_allocated = 0.0
    for g in funded_goals:
        if isinstance(g, dict):
            val = g.get("required_monthly_contribution", g.get("monthly_contribution", 0.0))
            total_allocated += float(val or 0.0)

    return {
        "algorithm": "Dynamic Programming Goal Optimization (0-1 Knapsack)",
        "available_budget": round(available_budget, 2),
        "total_allocated": round(total_allocated, 2),
        "total_utility_score": dp[N][capacity],
        "funded_goals": funded_goals,
        "unfunded_goals": unfunded_goals,
        "dp_table_size": [N + 1, capacity + 1],
        "complexity": {"time": f"O({N} * {capacity})", "space": f"O({N} * {capacity})"},
    }
