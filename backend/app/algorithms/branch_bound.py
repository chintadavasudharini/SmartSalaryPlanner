"""
Branch and Bound Algorithm for Deficit Reduction Optimization.
When total planned financial commitments exceed income (Deficit > 0), this algorithm finds the minimum set of
discretionary expense reductions required to bring remaining balance back to non-negative (Surplus >= 0) while
minimizing unnecessary financial cutbacks.

Formulation:
- State Node: (current_index, current_cut_amount, list_of_cuts, lower_bound)
- Branching: At item 'i', Branch 1 = Cut item 'i', Branch 2 = Keep item 'i'.
- Lower Bound (LB): current_cut_amount + sum of remaining available cuts.
  If LB < required_deficit, this branch CANNOT eliminate the deficit -> PRUNE.
- Upper Bound (UB): Best (minimum) valid cut amount found so far that satisfies total_cut >= required_deficit.
  If current_cut_amount >= Best_UB, PRUNE (cannot improve best solution).

Complexity:
- Time Complexity: O(2^N) worst case, O(N log N) average with aggressive bound pruning.
- Space Complexity: O(2^N) maximum priority queue / search tree nodes.
"""

import heapq
from typing import Any


class Node:
    def __init__(
        self,
        index: int,
        current_cut: float,
        selected_cuts: list[dict[str, Any]],
        max_possible_cut: float,
    ):
        self.index = index
        self.current_cut = current_cut
        self.selected_cuts = list(selected_cuts)
        self.max_possible_cut = max_possible_cut

    def __lt__(self, other: "Node"):
        # Min-heap priority by current_cut (prefer smaller cut total to avoid over-cutting)
        return self.current_cut < other.current_cut


def branch_bound_deficit_reduction(
    discretionary_items: list[dict[str, Any]], required_deficit: float
) -> dict[str, Any]:
    """
    Executes Branch and Bound optimization to eliminate salary deficit with minimal expense reductions.

    :param discretionary_items: List of optional expense dicts (each with 'name', 'amount', 'category').
    :param required_deficit: Amount of salary deficit to cover (positive float).
    :return: Dict containing optimal cut items, total reduced amount, new balance, and algorithm metrics.
    """
    required_deficit = max(0.0, float(required_deficit))

    if required_deficit == 0.0 or not discretionary_items:
        return {
            "algorithm": "Branch and Bound Deficit Reduction",
            "required_deficit": 0.0,
            "total_reduced_amount": 0.0,
            "remaining_deficit_after_cuts": 0.0,
            "optimal_cuts": [],
            "nodes_explored": 0,
            "branches_pruned": 0,
            "is_deficit_resolved": True,
        }

    # Clean items and filter items with amount > 0
    items = [
        {
            "name": item.get(
                "name", item.get("expense_name", item.get("category", "Expense"))
            ),
            "amount": max(0.0, float(item.get("amount", 0.0))),
            "category": item.get("category", "Other"),
            "original": item,
        }
        for item in discretionary_items
        if float(item.get("amount", 0.0)) > 0
    ]

    # Calculate total available potential cuts
    total_potential_cuts = sum(item["amount"] for item in items)

    if total_potential_cuts < required_deficit:
        # Cannot cover full deficit even if all discretionary items are cut completely
        all_cuts = [item for item in items]
        return {
            "algorithm": "Branch and Bound Deficit Reduction",
            "required_deficit": round(required_deficit, 2),
            "total_reduced_amount": round(total_potential_cuts, 2),
            "remaining_deficit_after_cuts": round(
                required_deficit - total_potential_cuts, 2
            ),
            "optimal_cuts": all_cuts,
            "nodes_explored": len(items),
            "branches_pruned": 0,
            "is_deficit_resolved": False,
            "warning": "Discretionary spending is less than total deficit. Fixed costs (EMI/Household) must also be reduced.",
        }

    # Best upper bound for valid total cut (initialize with cutting all items)
    best_upper_bound = total_potential_cuts
    best_solution_cuts: list[dict[str, Any]] = list(items)

    # Priority Queue for Best-First Search
    pq: list[Node] = []
    root = Node(
        index=0,
        current_cut=0.0,
        selected_cuts=[],
        max_possible_cut=total_potential_cuts,
    )
    heapq.heappush(pq, root)

    nodes_explored = 0
    branches_pruned = 0

    while pq:
        node = heapq.heappop(pq)
        nodes_explored += 1

        # Check if current node satisfies requirement
        if node.current_cut >= required_deficit:
            if node.current_cut < best_upper_bound:
                best_upper_bound = node.current_cut
                best_solution_cuts = node.selected_cuts
            # No need to expand node that already satisfies required deficit
            continue

        # BOUND 1: If even cutting ALL remaining items cannot reach required_deficit -> PRUNE
        if node.max_possible_cut < required_deficit:
            branches_pruned += 1
            continue

        # BOUND 2: If current cut is already >= best_upper_bound found so far -> PRUNE
        if node.current_cut >= best_upper_bound:
            branches_pruned += 1
            continue

        if node.index >= len(items):
            continue

        current_item = items[node.index]

        # Branch 1: CUT current_item
        cut_node = Node(
            index=node.index + 1,
            current_cut=node.current_cut + current_item["amount"],
            selected_cuts=node.selected_cuts + [current_item],
            max_possible_cut=node.max_possible_cut,
        )
        heapq.heappush(pq, cut_node)

        # Branch 2: KEEP current_item (do NOT cut it)
        keep_node = Node(
            index=node.index + 1,
            current_cut=node.current_cut,
            selected_cuts=node.selected_cuts,
            max_possible_cut=node.max_possible_cut - current_item["amount"],
        )
        heapq.heappush(pq, keep_node)

    return {
        "algorithm": "Branch and Bound Deficit Reduction Optimization",
        "required_deficit": round(required_deficit, 2),
        "total_reduced_amount": round(best_upper_bound, 2),
        "remaining_deficit_after_cuts": round(
            max(0.0, required_deficit - best_upper_bound), 2
        ),
        "optimal_cuts": best_solution_cuts,
        "nodes_explored": nodes_explored,
        "branches_pruned": branches_pruned,
        "is_deficit_resolved": best_upper_bound >= required_deficit,
    }
