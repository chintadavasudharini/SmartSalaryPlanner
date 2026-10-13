"""
Core module initialization.
"""

from app.core.config import settings
from app.core.context_managers import PerformanceTimer
from app.core.decorators import measure_execution_time, validate_positive_income
from app.core.generators import chunked_record_iterator, financial_record_generator

__all__ = [
    "PerformanceTimer",
    "chunked_record_iterator",
    "financial_record_generator",
    "measure_execution_time",
    "settings",
    "validate_positive_income",
]
