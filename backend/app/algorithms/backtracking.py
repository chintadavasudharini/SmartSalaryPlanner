"""
Backtracking Algorithm for Discretionary Expense Combination Search.
Explores combinations of optional/discretionary expenses (entertainment, shopping, subscriptions, dining out)
that stay strictly within a target discretionary budget limit.

State Space Search:
- Decision Tree Node: Include or exclude item 'i'.
- Pruning Condition: If current_sum > budget_limit, prune branch immediately (bounding).
- Base Case: All items evaluated or budget reached.

Complexity:
- Time Complexity: O(2^N) worst-case without pruning, significantly pruned in practice.
- Space Complexity: O(N) maximum recursion stack depth.
"""

from typing import Any


def backtrack_expense_combinations(
    optional_expenses: list[dict[str, Any]], budget_limit: float, max_results: int = 10
) -> dict[str, Any]:
    """
    Finds combinations of optional expenses that can be afforded within budget_limit using Backtracking.

    :param optional_expenses: List of optional expense items (each with 'name' and 'amount').
    :param budget_limit: Maximum allowed budget for discretionary spending.
    :param max_results: Cap on total feasible combinations returned.
    :return: Dict with feasible combinations and exploration metrics.
    """
    budget_limit = max(0.0, float(budget_limit))
    valid_expenses = [
        item for item in optional_expenses if float(item.get("amount", 0.0)) > 0
    ]

    feasible_combinations: list[dict[str, Any]] = []
    nodes_explored = 0
    branches_pruned = 0

    def backtrack(index: int, current_combo: list[dict[str, Any]], current_sum: float):
        nonlocal nodes_explored, branches_pruned

        nodes_explored += 1

        # Pruning check: If current sum exceeds budget, stop exploring this branch
        if current_sum > budget_limit:
            branches_pruned += 1
            return

        # Found a valid partial/full combination
        if current_combo:
            combo_details = {
                "items": [
                    item.get("name", item.get("expense_name", "Item"))
                    for item in current_combo
                ],
                "total_cost": round(current_sum, 2),
                "remaining_budget": round(budget_limit - current_sum, 2),
                "item_count": len(current_combo),
            }
            # Only add distinct non-empty combos
            if (
                combo_details not in feasible_combinations
                and len(feasible_combinations) < max_results
            ):
                feasible_combinations.append(combo_details)

        if index >= len(valid_expenses) or len(feasible_combinations) >= max_results:
            return

        # Option 1: Include item at index
        item = valid_expenses[index]
        cost = float(item.get("amount", 0.0))

        current_combo.append(item)
        backtrack(index + 1, current_combo, current_sum + cost)
        current_combo.pop()  # Backtrack

        # Option 2: Exclude item at index
        backtrack(index + 1, current_combo, current_sum)

    # Execute backtracking search
    backtrack(0, [], 0.0)

    # Sort combinations by total_cost descending (closest to target budget limit first)
    feasible_combinations.sort(key=lambda x: x["total_cost"], reverse=True)

    return {
        "algorithm": "Backtracking Discretionary Combination Search",
        "budget_limit": round(budget_limit, 2),
        "input_items_count": len(valid_expenses),
        "nodes_explored": nodes_explored,
        "branches_pruned": branches_pruned,
        "feasible_combinations_count": len(feasible_combinations),
        "combinations": feasible_combinations,
    }
