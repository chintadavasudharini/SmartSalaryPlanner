"""
Property-Based Testing using Hypothesis.
Verifies invariants over generated input spaces.
"""

from hypothesis import given, strategies as st
from app.models.domain import EMI, SalaryPlan
from app.algorithms.greedy import calculate_greedy_salary_plan
from app.algorithms.sorting import quick_sort_records


@given(
    income=st.floats(min_value=0.0, max_value=1e7, allow_nan=False, allow_infinity=False),
    emi=st.floats(min_value=0.0, max_value=1e6, allow_nan=False, allow_infinity=False),
    household=st.floats(min_value=0.0, max_value=1e6, allow_nan=False, allow_infinity=False),
    expenses=st.floats(min_value=0.0, max_value=1e6, allow_nan=False, allow_infinity=False),
    savings=st.floats(min_value=0.0, max_value=1e6, allow_nan=False, allow_infinity=False),
    investments=st.floats(min_value=0.0, max_value=1e6, allow_nan=False, allow_infinity=False),
    entertainment=st.floats(min_value=0.0, max_value=1e6, allow_nan=False, allow_infinity=False),
    goals=st.floats(min_value=0.0, max_value=1e6, allow_nan=False, allow_infinity=False),
)
def test_salary_plan_invariants(income, emi, household, expenses, savings, investments, entertainment, goals):
    plan = SalaryPlan(
        income=income,
        emi=emi,
        household=household,
        expenses=expenses,
        savings=savings,
        investments=investments,
        entertainment=entertainment,
        goal_contributions=goals
    )
    # Invariant 1: Total allocated is sum of non-negative allocations
    assert plan.total_allocated >= 0.0
    # Invariant 2: Remaining buffer equals income minus total allocated (with 2-decimal float precision tolerance)
    expected_buffer = round(round(income, 2) - plan.total_allocated, 2)
    assert abs(plan.remaining_buffer - expected_buffer) <= 0.02


@given(
    principal=st.floats(min_value=0.0, max_value=1e7, allow_nan=False, allow_infinity=False),
    rate=st.floats(min_value=0.0, max_value=50.0, allow_nan=False, allow_infinity=False),
    months=st.integers(min_value=1, max_value=360),
)
def test_emi_non_negative(principal, rate, months):
    emi_obj = EMI(
        id="prop_emi",
        user_id="u",
        principal=principal,
        outstanding_amount=principal,
        annual_interest_rate=rate,
        remaining_months=months
    )
    # Invariant: EMI calculation must be non-negative
    emi = emi_obj.calculate_monthly_emi()
    assert emi >= 0.0
    assert emi_obj.calculate_total_payment() >= 0.0


@given(
    amounts=st.lists(st.floats(min_value=-1e5, max_value=1e5, allow_nan=False, allow_infinity=False))
)
def test_sorting_preserves_length_and_order(amounts):
    records = [{"id": str(i), "amount": val} for i, val in enumerate(amounts)]
    sorted_recs = quick_sort_records(records, key="amount", reverse=False)
    
    # Invariant 1: Length preserved
    assert len(sorted_recs) == len(records)
    
    # Invariant 2: Output is monotonically non-decreasing
    for i in range(len(sorted_recs) - 1):
        assert sorted_recs[i]["amount"] <= sorted_recs[i + 1]["amount"]
