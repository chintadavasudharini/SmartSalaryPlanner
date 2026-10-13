"""
Sorting Algorithms for Financial Records.
Implements:
- QuickSort for financial transactions
- MergeSort (from divide_conquer)
- Functional sort utilities
"""

from typing import Any

from app.algorithms.divide_conquer import merge_sort_records


def quick_sort_records(
    records: list[dict[str, Any]], key: str = "amount", reverse: bool = False
) -> list[dict[str, Any]]:
    """
    In-place or functional QuickSort implementation for list of financial records.

    Time Complexity:
    - Best / Average: O(N log N)
    - Worst Case: O(N^2)
    Space Complexity: O(log N) stack depth
    """
    if len(records) <= 1:
        return list(records)

    pivot = records[len(records) // 2]
    pivot_val = pivot.get(key, 0)

    if not reverse:
        left = [x for x in records if x.get(key, 0) < pivot_val]
        middle = [x for x in records if x.get(key, 0) == pivot_val]
        right = [x for x in records if x.get(key, 0) > pivot_val]
    else:
        left = [x for x in records if x.get(key, 0) > pivot_val]
        middle = [x for x in records if x.get(key, 0) == pivot_val]
        right = [x for x in records if x.get(key, 0) < pivot_val]

    return (
        quick_sort_records(left, key=key, reverse=reverse)
        + middle
        + quick_sort_records(right, key=key, reverse=reverse)
    )


def sort_financial_records(
    records: list[dict[str, Any]],
    by: str = "amount",
    algorithm: str = "quicksort",
    descending: bool = True,
) -> list[dict[str, Any]]:
    """
    Unified sorting entry point with algorithm selection.
    """
    if algorithm.lower() == "mergesort":
        return merge_sort_records(records, key=by, reverse=descending)
    else:
        return quick_sort_records(records, key=by, reverse=descending)
