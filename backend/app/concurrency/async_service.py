"""
Asyncio Service Module for handling asynchronous I/O operations.
Demonstrates non-blocking concurrency for external services and Firestore data access.
"""

import asyncio
from collections.abc import Awaitable
from typing import Any


async def fetch_parallel_async(tasks: list[Awaitable[Any]]) -> list[Any]:
    """
    Executes multiple I/O bound coroutines concurrently using asyncio.gather.
    """
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return list(results)


async def simulate_async_db_fetch(
    collection_name: str, user_id: str, delay_s: float = 0.01
) -> list[dict[str, Any]]:
    """
    Simulates async Firestore fetch.
    """
    await asyncio.sleep(delay_s)
    return []
