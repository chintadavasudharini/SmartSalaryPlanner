"""
Python Context Managers for resource management and benchmarking.
"""

import time
from typing import Literal, Self


class PerformanceTimer:
    """
    Context Manager to safely measure execution block latency.
    Demonstrates __enter__ and __exit__ protocol.
    """

    def __init__(self, block_name: str = "Code Block"):
        self.block_name = block_name
        self.start_time: float = 0.0
        self.elapsed_time_ms: float = 0.0

    def __enter__(self) -> Self:
        self.start_time = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> Literal[False]:
        end_time = time.perf_counter()
        self.elapsed_time_ms = round((end_time - self.start_time) * 1000.0, 4)
        return False
