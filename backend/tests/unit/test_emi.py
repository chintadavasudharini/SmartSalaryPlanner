"""
Unit tests for EMI calculation logic.
Formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
"""

import pytest
from app.models.domain import EMI


def test_emi_calculation_standard():
    # Principal: 100,000, Interest Rate: 12% per annum, 12 months
    emi_obj = EMI(
        id="emi_1",
        user_id="test_user",
        loan_name="Personal Loan",
        principal=100000.0,
        outstanding_amount=100000.0,
        annual_interest_rate=12.0,
        remaining_months=12
    )
    # Expected EMI for 100k @ 12% for 12 months is approx 8884.88
    emi = emi_obj.calculate_monthly_emi()
    assert 8880 <= emi <= 8890
    assert emi_obj.calculate_total_payment() > 100000.0
    assert emi_obj.calculate_total_interest() > 0.0


def test_emi_calculation_zero_interest():
    # Interest rate 0%
    emi_obj = EMI(
        id="emi_2",
        user_id="test_user",
        loan_name="Zero Interest Loan",
        principal=60000.0,
        outstanding_amount=60000.0,
        annual_interest_rate=0.0,
        remaining_months=12
    )
    assert emi_obj.calculate_monthly_emi() == 5000.0
    assert emi_obj.calculate_total_payment() == 60000.0
    assert emi_obj.calculate_total_interest() == 0.0


def test_emi_zero_principal():
    emi_obj = EMI(
        id="emi_3",
        user_id="test_user",
        principal=0.0,
        outstanding_amount=0.0,
        annual_interest_rate=10.0,
        remaining_months=12
    )
    assert emi_obj.calculate_monthly_emi() == 0.0
