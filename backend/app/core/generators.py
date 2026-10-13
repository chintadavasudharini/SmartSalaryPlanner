"""
Python Generators and Iterators for memory-efficient financial stream processing.
"""

from collections.abc import Generator, Iterable
from typing import Any


def financial_record_generator(
    records: Iterable[dict[str, Any]],
) -> Generator[dict[str, Any], None, None]:
    """
    Lazy generator that yields validated financial records one by one
    without loading entire datasets into memory.
    """
    for record in records:
        if record and float(record.get("amount", 0.0)) >= 0:
            yield {
                "id": record.get("id"),
                "user_id": record.get("user_id"),
                "name": record.get(
                    "name", record.get("expense_name", record.get("source", "Record"))
                ),
                "amount": float(record.get("amount", 0.0)),
                "category": record.get("category", "General"),
                "date": record.get("date"),
            }


def chunked_record_iterator(
    records: list[dict[str, Any]], chunk_size: int = 50
) -> Generator[list[dict[str, Any]], None, None]:
    """
    Generator yielding chunks of records for batch processing.
    """
    for i in range(0, len(records), chunk_size):
        yield records[i : i + chunk_size]
