"""
Greedy Algorithm for Salary Allocation.
Allocates monthly income according to prioritized financial obligations:
1. EMI (Fixed Loan Payments)
2. Household Essentials
3. Other Essential Expenses
4. Savings
5. Financial Goals
6. Investments
7. Entertainment / Discretionary
8. Surplus / Emergency Buffer

Complexity:
- Time Complexity: O(1) fixed categories, O(N log N) if sorting items by urgency.
- Space Complexity: O(1).
"""

from typing import Any

from app.algorithms.base import SalaryAllocationStrategy


class GreedySalaryStrategy(SalaryAllocationStrategy):
    """
    Greedy allocation strategy: Fulfills higher priority financial buckets first.
    If income is insufficient, lower priority buckets receive partial or zero allocation.
    """

    def allocate(self, income: float, financial_data: dict[str, Any]) -> dict[str, Any]:
        """
        Executes greedy salary allocation.
        """
        income = max(0.0, float(income))

        # Priority amounts requested
        req_emi = max(0.0, float(financial_data.get("emi", 0.0)))
        req_household = max(0.0, float(financial_data.get("household", 0.0)))
        req_expenses = max(0.0, float(financial_data.get("expenses", 0.0)))
        req_savings = max(0.0, float(financial_data.get("savings", 0.0)))
        req_goals = max(0.0, float(financial_data.get("goals", 0.0)))
        req_investments = max(0.0, float(financial_data.get("investments", 0.0)))
        req_entertainment = max(0.0, float(financial_data.get("entertainment", 0.0)))

        remaining_cash = income

        allocations: dict[str, dict[str, Any]] = {}

        priorities = [
            ("1_emi", "EMI Payments", req_emi),
            ("2_household", "Household Essentials", req_household),
            ("3_expenses", "Other Expenses", req_expenses),
            ("4_savings", "Savings", req_savings),
            ("5_goals", "Financial Goals", req_goals),
            ("6_investments", "Investments", req_investments),
            ("7_entertainment", "Entertainment", req_entertainment),
        ]

        total_allocated = 0.0
        deficit_amount = 0.0

        for key, label, requested in priorities:
            if remaining_cash >= requested:
                allocated = requested
                remaining_cash -= requested
                status = "FULLY_FUNDED"
            elif remaining_cash > 0:
                allocated = remaining_cash
                deficit_amount += requested - remaining_cash
                remaining_cash = 0.0
                status = "PARTIALLY_FUNDED"
            else:
                allocated = 0.0
                deficit_amount += requested
                status = "UNFUNDED"

            pct_of_income = (
                round((allocated / income * 100.0), 2) if income > 0 else 0.0
            )
            total_allocated += allocated

            allocations[key] = {
                "label": label,
                "requested": round(requested, 2),
                "allocated": round(allocated, 2),
                "percentage": pct_of_income,
                "status": status,
            }

        surplus = round(remaining_cash, 2)
        total_allocated = round(total_allocated, 2)
        deficit = round(deficit_amount, 2)

        return {
            "algorithm": "Greedy Salary Allocation Strategy",
            "income": round(income, 2),
            "total_allocated": total_allocated,
            "surplus_buffer": surplus,
            "total_deficit": deficit,
            "is_feasible": deficit == 0.0,
            "allocations": allocations,
        }


def calculate_greedy_salary_plan(
    income: float, financial_data: dict[str, Any]
) -> dict[str, Any]:
    """
    Functional wrapper for Greedy Salary Allocation.
    """
    strategy = GreedySalaryStrategy()
    return strategy.allocate(income, financial_data)
