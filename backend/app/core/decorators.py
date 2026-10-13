"""
Python Decorators demonstrating Pythonic metaprogramming and timing analysis.
"""

import functools
import logging
import time
from collections.abc import Callable
from typing import Any

logger = logging.getLogger("smart_salary_planner")


def measure_execution_time(func: Callable[..., Any]) -> Callable[..., Any]:
    """
    Decorator to measure and return function execution time in milliseconds.
    Attaches '_execution_time_ms' metric to dictionary return values if applicable.
    """

    @functools.wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        execution_time_ms = round((end_time - start_time) * 1000.0, 4)

        if isinstance(result, dict):
            result["_execution_time_ms"] = execution_time_ms

        logger.info(f"Function '{func.__name__}' executed in {execution_time_ms} ms")
        return result

    return wrapper


def validate_positive_income(func: Callable[..., Any]) -> Callable[..., Any]:
    """
    Decorator to validate income is non-negative before executing calculation.
    """

    @functools.wraps(func)
    def wrapper(income: float, *args: Any, **kwargs: Any) -> Any:
        if income < 0:
            raise ValueError("Income must be a non-negative number.")
        return func(income, *args, **kwargs)

    return wrapper
