"""
Strategy Design Pattern interface for Salary Allocation and Goal Planning.
"""

from abc import ABC, abstractmethod
from typing import Any


class SalaryAllocationStrategy(ABC):
    """
    Abstract Strategy for allocating salary based on different optimization principles.
    """

    @abstractmethod
    def allocate(self, income: float, financial_data: dict[str, Any]) -> dict[str, Any]:
        """
        Executes the allocation strategy on user financial inputs.
        """
