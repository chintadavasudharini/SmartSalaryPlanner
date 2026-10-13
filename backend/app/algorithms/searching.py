"""
Searching Algorithms for Financial Data.
Implements:
- Binary Search (on sorted records)
- Linear Filter & Search (by category, name, or amount range)
- Category Set extraction
"""

from typing import Any

from app.algorithms.sorting import quick_sort_records


def binary_search_by_amount(
    records: list[dict[str, Any]], target_amount: float
) -> dict[str, Any] | None:
    """
    Binary Search to find a record with exact target_amount in a sorted array.
    Time Complexity: O(log N)
    Space Complexity: O(1)
    """
    sorted_recs = quick_sort_records(records, key="amount", reverse=False)
    low = 0
    high = len(sorted_recs) - 1

    while low <= high:
        mid = (low + high) // 2
        mid_val = float(sorted_recs[mid].get("amount", 0.0))

        if abs(mid_val - target_amount) < 0.01:
            return sorted_recs[mid]
        elif mid_val < target_amount:
            low = mid + 1
        else:
            high = mid - 1

    return None


def search_records(
    records: list[dict[str, Any]],
    query: str | None = None,
    category: str | None = None,
    min_amount: float | None = None,
    max_amount: float | None = None,
) -> list[dict[str, Any]]:
    """
    Linear Search and filtering over financial records.
    Time Complexity: O(N)
    Space Complexity: O(N)
    """
    results = list(records)

    if query:
        q = query.strip().lower()
        results = [
            r
            for r in results
            if q in str(r.get("name", "")).lower()
            or q in str(r.get("expense_name", "")).lower()
            or q in str(r.get("item_name", "")).lower()
            or q in str(r.get("source", "")).lower()
            or q in str(r.get("savings_goal", "")).lower()
            or q in str(r.get("goal_name", "")).lower()
            or q in str(r.get("loan_name", "")).lower()
            or q in str(r.get("category", "")).lower()
        ]

    if category and category.lower() != "all":
        cat = category.strip().lower()
        results = [r for r in results if str(r.get("category", "")).lower() == cat]

    if min_amount is not None:
        results = [r for r in results if float(r.get("amount", 0.0)) >= min_amount]

    if max_amount is not None:
        results = [r for r in results if float(r.get("amount", 0.0)) <= max_amount]

    return results


def get_unique_categories(records: list[dict[str, Any]]) -> list[str]:
    """
    Uses Python set comprehension to extract unique categories.
    """
    categories = {
        str(r.get("category", "Other"))
        for r in records
        if "category" in r or "item_name" in r
    }
    return sorted(categories)
