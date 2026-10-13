"""
Divide and Conquer Algorithm: Recursive Merge Sort and Category Aggregation.
Implements:
1. Merge Sort for financial expense records ranked by amount or date.
2. Recursive category aggregation tree.

Recurrence Relation:
T(n) = 2T(n/2) + O(n)

Master Theorem Solution:
Time Complexity: O(n log n)
Space Complexity: O(n) (auxiliary arrays during merge)
"""

from typing import Any


def merge_sort_records(
    records: list[dict[str, Any]], key: str = "amount", reverse: bool = True
) -> list[dict[str, Any]]:
    """
    Divide and Conquer Merge Sort for financial records.

    :param records: List of record dictionaries.
    :param key: Dict key to sort by (e.g. 'amount', 'date').
    :param reverse: True for descending order (highest expense first).
    :return: Sorted list of records.
    """
    if len(records) <= 1:
        return list(records)

    # 1. DIVIDE
    mid = len(records) // 2
    left = merge_sort_records(records[:mid], key=key, reverse=reverse)
    right = merge_sort_records(records[mid:], key=key, reverse=reverse)

    # 2. CONQUER / COMBINE
    return _merge(left, right, key=key, reverse=reverse)


def _merge(
    left: list[dict[str, Any]], right: list[dict[str, Any]], key: str, reverse: bool
) -> list[dict[str, Any]]:
    """
    Helper function to combine two sorted sublists.
    """
    merged: list[dict[str, Any]] = []
    i = j = 0

    while i < len(left) and j < len(right):
        val_left = left[i].get(key, 0)
        val_right = right[j].get(key, 0)

        # Comparison based on direction
        condition = (val_left >= val_right) if reverse else (val_left <= val_right)

        if condition:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1

    # Append remaining elements
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged


def recursive_category_aggregation(records: list[dict[str, Any]]) -> dict[str, float]:
    """
    Divide and Conquer recursive aggregation of expenses by category.
    Splits records into halves, recursively calculates category sums, and merges dicts.
    """
    if not records:
        return {}
    if len(records) == 1:
        cat = records[0].get("category", records[0].get("item_name", "Other"))
        amt = float(records[0].get("amount", 0.0))
        return {cat: round(amt, 2)}

    # Divide
    mid = len(records) // 2
    left_totals = recursive_category_aggregation(records[:mid])
    right_totals = recursive_category_aggregation(records[mid:])

    # Combine
    combined = dict(left_totals)
    for cat, amt in right_totals.items():
        combined[cat] = round(combined.get(cat, 0.0) + amt, 2)

    return combined
