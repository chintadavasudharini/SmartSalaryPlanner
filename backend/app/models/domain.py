"""
Domain Models for Smart Salary Planner.
Demonstrates Object-Oriented Programming (OOP) principles:
- Abstraction
- Encapsulation
- Inheritance
- Polymorphism
- Composition
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any


@dataclass
class FinancialRecord(ABC):
    """
    Abstract Base Class representing a generic financial record.
    Provides encapsulation for common record fields and abstract methods for value computation.
    """

    id: str | None = None
    user_id: str = ""
    amount: float = 0.0
    date: str = field(
        default_factory=lambda: datetime.now(UTC).strftime("%Y-%m-%d")
    )

    @abstractmethod
    def get_monthly_value(self) -> float:
        """Returns the effective monthly value of the financial record."""

    @abstractmethod
    def to_dict(self) -> dict[str, Any]:
        """Converts the record to a dictionary representation."""


@dataclass
class Income(FinancialRecord):
    """
    Income record domain model.
    Types: Salary, Freelance, Bonus, Other.
    """

    source: str = "Salary"
    income_type: str = "Salary"  # Salary, Freelance, Bonus, Other

    def get_monthly_value(self) -> float:
        return max(0.0, float(self.amount))

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "source": self.source,
            "amount": self.amount,
            "date": self.date,
            "income_type": self.income_type,
        }


@dataclass
class EMI(FinancialRecord):
    """
    EMI (Equated Monthly Installment) domain model.
    Implements deterministic Python EMI calculations.
    Formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    """

    loan_name: str = "Loan"
    loan_type: str = "Personal Loan"  # Home Loan, Personal Loan, Education Loan, Vehicle Loan, Credit Card, Other
    principal: float = 0.0
    outstanding_amount: float = 0.0
    annual_interest_rate: float = 0.0  # Percentage e.g. 10.5 for 10.5%
    remaining_months: int = 1

    def get_monthly_value(self) -> float:
        return self.calculate_monthly_emi()

    def calculate_monthly_emi(self) -> float:
        """
        Calculates monthly EMI using compound interest formula.
        If interest rate is 0, EMI is simply principal / remaining_months.
        """
        P = max(
            0.0,
            float(
                self.outstanding_amount
                if self.outstanding_amount > 0
                else self.principal
            ),
        )
        n = max(1, int(self.remaining_months))
        r = (self.annual_interest_rate / 100.0) / 12.0

        if P == 0:
            return 0.0

        if r <= 1e-9:
            return round(P / n, 2)

        denom = ((1 + r) ** n) - 1
        if denom <= 0:
            return round(P / n, 2)

        emi = P * r * ((1 + r) ** n) / denom
        return round(float(emi), 2)

    def calculate_total_payment(self) -> float:
        return round(self.calculate_monthly_emi() * max(1, self.remaining_months), 2)

    def calculate_total_interest(self) -> float:
        P = max(
            0.0,
            float(
                self.outstanding_amount
                if self.outstanding_amount > 0
                else self.principal
            ),
        )
        return round(max(0.0, self.calculate_total_payment() - P), 2)

    def to_dict(self) -> dict[str, Any]:
        monthly_emi = self.calculate_monthly_emi()
        return {
            "id": self.id,
            "user_id": self.user_id,
            "loan_name": self.loan_name,
            "loan_type": self.loan_type,
            "principal": self.principal,
            "outstanding_amount": self.outstanding_amount,
            "annual_interest_rate": self.annual_interest_rate,
            "monthly_emi": monthly_emi,
            "remaining_months": self.remaining_months,
            "total_payment": self.calculate_total_payment(),
            "total_interest": self.calculate_total_interest(),
            "date": self.date,
            "amount": monthly_emi,
        }


@dataclass
class HouseholdExpense(FinancialRecord):
    """
    Household Expense domain model.
    Categories: Rent, Electricity, Water, Gas, Groceries, Vegetables, Fruits, Milk, Internet, Mobile, Household Items, Domestic Help, Other.
    """

    category: str = "Groceries"
    item_name: str = "Household Expense"

    def get_monthly_value(self) -> float:
        return max(0.0, float(self.amount))

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "item_name": self.item_name,
            "category": self.category,
            "amount": self.amount,
            "date": self.date,
        }


@dataclass
class Expense(FinancialRecord):
    """
    General / Non-Household Expense domain model.
    Categories: Transport, Shopping, Medical, Education, Personal Care, Travel, Other.
    """

    expense_name: str = "Expense"
    category: str = "Other"

    def get_monthly_value(self) -> float:
        return max(0.0, float(self.amount))

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "expense_name": self.expense_name,
            "category": self.category,
            "amount": self.amount,
            "date": self.date,
        }


@dataclass
class Saving(FinancialRecord):
    """
    Savings Goal record domain model.
    Calculates remaining amount, progress %, required monthly contribution.
    """

    savings_goal: str = "Savings"
    target_amount: float = 0.0
    current_amount: float = 0.0
    monthly_contribution: float = 0.0
    target_date: str = field(
        default_factory=lambda: datetime.now(UTC).strftime("%Y-%m-%d")
    )

    def get_monthly_value(self) -> float:
        return max(0.0, float(self.monthly_contribution))

    @property
    def remaining_amount(self) -> float:
        return max(0.0, round(self.target_amount - self.current_amount, 2))

    @property
    def progress_percentage(self) -> float:
        if self.target_amount <= 0:
            return 100.0 if self.current_amount > 0 else 0.0
        return round(min(100.0, (self.current_amount / self.target_amount) * 100.0), 2)

    def calculate_required_monthly_contribution(self, remaining_months: int) -> float:
        if remaining_months <= 0 or self.remaining_amount <= 0:
            return 0.0
        return round(self.remaining_amount / remaining_months, 2)

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "savings_goal": self.savings_goal,
            "target_amount": self.target_amount,
            "current_amount": self.current_amount,
            "monthly_contribution": self.monthly_contribution,
            "target_date": self.target_date,
            "remaining_amount": self.remaining_amount,
            "progress_percentage": self.progress_percentage,
            "amount": self.monthly_contribution,
            "date": self.date,
        }


@dataclass
class Investment(FinancialRecord):
    """
    Investment record domain model.
    Types: SIP, Mutual Fund, FD, RD, Stocks, Gold, Other.
    """

    investment_name: str = "Investment"
    investment_type: str = "SIP"
    amount_invested: float = 0.0
    monthly_contribution: float = 0.0
    start_date: str = field(
        default_factory=lambda: datetime.now(UTC).strftime("%Y-%m-%d")
    )

    def get_monthly_value(self) -> float:
        return max(0.0, float(self.monthly_contribution))

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "investment_name": self.investment_name,
            "investment_type": self.investment_type,
            "amount_invested": self.amount_invested,
            "monthly_contribution": self.monthly_contribution,
            "start_date": self.start_date,
            "amount": self.monthly_contribution,
            "date": self.date,
        }


@dataclass
class Entertainment(FinancialRecord):
    """
    Entertainment / Discretionary Spending domain model.
    Categories: Movies, Restaurants, OTT, Games, Shopping, Hobbies, Subscriptions, Trips, Other.
    """

    name: str = "Entertainment"
    category: str = "Other"

    def get_monthly_value(self) -> float:
        return max(0.0, float(self.amount))

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "category": self.category,
            "amount": self.amount,
            "date": self.date,
        }


@dataclass
class FinancialGoal(FinancialRecord):
    """
    Financial Goal domain model.
    Goal Types: Emergency Fund, Education, Travel, Car, Home, Laptop, Wedding, Other.
    Calculates progress, remaining months, required contribution, sufficiency check.
    """

    goal_name: str = "Goal"
    goal_type: str = "Other"
    target_amount: float = 0.0
    current_amount: float = 0.0
    deadline: str = field(
        default_factory=lambda: datetime.now(UTC).strftime("%Y-%m-%d")
    )
    monthly_contribution: float = 0.0
    priority: int = 1  # 1 = Highest, 5 = Lowest

    def get_monthly_value(self) -> float:
        return max(0.0, float(self.monthly_contribution))

    @property
    def remaining_amount(self) -> float:
        return max(0.0, round(self.target_amount - self.current_amount, 2))

    @property
    def progress_percentage(self) -> float:
        if self.target_amount <= 0:
            return 100.0 if self.current_amount > 0 else 0.0
        return round(min(100.0, (self.current_amount / self.target_amount) * 100.0), 2)

    def calculate_remaining_months(self) -> int:
        try:
            deadline_dt = datetime.strptime(self.deadline, "%Y-%m-%d").replace(
                tzinfo=UTC
            )
            today = datetime.now(UTC)
            months = (deadline_dt.year - today.year) * 12 + (
                deadline_dt.month - today.month
            )
            return max(1, months)
        except (ValueError, TypeError):
            return 12

    def calculate_required_monthly_contribution(self) -> float:
        months = self.calculate_remaining_months()
        if months <= 0 or self.remaining_amount <= 0:
            return 0.0
        return round(self.remaining_amount / months, 2)

    @property
    def is_contribution_sufficient(self) -> bool:
        required = self.calculate_required_monthly_contribution()
        return self.monthly_contribution >= required

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "goal_name": self.goal_name,
            "goal_type": self.goal_type,
            "target_amount": self.target_amount,
            "current_amount": self.current_amount,
            "deadline": self.deadline,
            "monthly_contribution": self.monthly_contribution,
            "priority": self.priority,
            "remaining_amount": self.remaining_amount,
            "progress_percentage": self.progress_percentage,
            "remaining_months": self.calculate_remaining_months(),
            "required_monthly_contribution": self.calculate_required_monthly_contribution(),
            "is_sufficient": self.is_contribution_sufficient,
            "amount": self.monthly_contribution,
            "date": self.date,
        }


@dataclass
class SalaryPlan:
    """
    Salary Plan domain model summarizing allocations and balance.
    """

    income: float
    emi: float
    household: float
    expenses: float
    savings: float
    investments: float
    entertainment: float
    goal_contributions: float

    @property
    def total_allocated(self) -> float:
        return round(
            self.emi
            + self.household
            + self.expenses
            + self.savings
            + self.investments
            + self.entertainment
            + self.goal_contributions,
            2,
        )

    @property
    def remaining_buffer(self) -> float:
        return round(self.income - self.total_allocated, 2)

    @property
    def is_surplus(self) -> bool:
        return self.remaining_buffer >= 0

    def to_dict(self) -> dict[str, Any]:
        return {
            "income": self.income,
            "emi": self.emi,
            "household": self.household,
            "expenses": self.expenses,
            "savings": self.savings,
            "investments": self.investments,
            "entertainment": self.entertainment,
            "goal_contributions": self.goal_contributions,
            "total_allocated": self.total_allocated,
            "remaining_buffer": self.remaining_buffer,
            "is_surplus": self.is_surplus,
        }
