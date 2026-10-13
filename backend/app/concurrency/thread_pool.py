"""
ThreadPoolExecutor Concurrency for Parallel Data Retrieval.
Ideal for concurrent I/O-bound module retrieval (Income, EMI, Household, Expenses, Savings, Investments, Goals).
"""

import logging
from collections.abc import Callable
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Any

logger = logging.getLogger(__name__)


def parallel_module_retrieval(
    fetch_functions: dict[str, Callable[[], list[dict[str, Any]]]],
) -> dict[str, list[dict[str, Any]]]:
    """
    Executes multiple module fetch calls concurrently using a ThreadPoolExecutor.

    :param fetch_functions: Dictionary mapping module names to fetch callable functions.
    :return: Dictionary mapping module names to fetched record lists.
    """
    results: dict[str, list[dict[str, Any]]] = {}

    with ThreadPoolExecutor(max_workers=min(len(fetch_functions) or 1, 8)) as executor:
        future_to_module = {
            executor.submit(func): module_name
            for module_name, func in fetch_functions.items()
        }

        for future in as_completed(future_to_module):
            module_name = future_to_module[future]
            try:
                data = future.result()
                results[module_name] = data
            except Exception as e:  # noqa: BLE001
                logger.warning("Parallel fetch failed for module %s: %s", module_name, e)
                results[module_name] = []

    return results
