"""
Pydantic Schemas for API validation and serialization.
"""

from pydantic import BaseModel, Field


# Income Schemas
class IncomeCreate(BaseModel):
    source: str = Field(..., min_length=1)
    amount: float = Field(..., gt=0)
    date: str | None = Field(None)
    income_type: str = Field("Salary")


class IncomeResponse(IncomeCreate):
    id: str
    user_id: str


# EMI Schemas
class EMICreate(BaseModel):
    loan_name: str = Field(..., min_length=1)
    loan_type: str = Field("Personal Loan")
    principal: float = Field(0.0, ge=0)
    outstanding_amount: float = Field(..., ge=0)
    annual_interest_rate: float = Field(..., ge=0)
    remaining_months: int = Field(..., gt=0)
    date: str | None = None


class EMIResponse(EMICreate):
    id: str
    user_id: str
    monthly_emi: float
    total_payment: float
    total_interest: float


# Household Expense Schemas
class HouseholdCreate(BaseModel):
    item_name: str = Field(..., min_length=1)
    category: str = Field("Groceries")
    amount: float = Field(..., gt=0)
    date: str | None = None


class HouseholdResponse(HouseholdCreate):
    id: str
    user_id: str


# Expense Schemas
class ExpenseCreate(BaseModel):
    expense_name: str = Field(..., min_length=1)
    category: str = Field("Shopping")
    amount: float = Field(..., gt=0)
    date: str | None = None


class ExpenseResponse(ExpenseCreate):
    id: str
    user_id: str


# Savings Schemas
class SavingsCreate(BaseModel):
    savings_goal: str = Field(..., min_length=1)
    target_amount: float = Field(..., gt=0)
    current_amount: float = Field(0.0, ge=0)
    monthly_contribution: float = Field(..., ge=0)
    target_date: str = Field(...)


class SavingsResponse(SavingsCreate):
    id: str
    user_id: str
    remaining_amount: float
    progress_percentage: float


# Investment Schemas
class InvestmentCreate(BaseModel):
    investment_name: str = Field(..., min_length=1)
    investment_type: str = Field("SIP")
    amount_invested: float = Field(0.0, ge=0)
    monthly_contribution: float = Field(..., ge=0)
    start_date: str | None = None


class InvestmentResponse(InvestmentCreate):
    id: str
    user_id: str


# Entertainment Schemas
class EntertainmentCreate(BaseModel):
    name: str = Field(..., min_length=1)
    category: str = Field("Subscriptions")
    amount: float = Field(..., gt=0)
    date: str | None = None


class EntertainmentResponse(EntertainmentCreate):
    id: str
    user_id: str


# Goal Schemas
class GoalCreate(BaseModel):
    goal_name: str = Field(..., min_length=1)
    goal_type: str = Field("Laptop")
    target_amount: float = Field(..., gt=0)
    current_amount: float = Field(0.0, ge=0)
    deadline: str = Field(...)
    monthly_contribution: float = Field(..., ge=0)
    priority: int = Field(1, ge=1, le=5)


class GoalResponse(GoalCreate):
    id: str
    user_id: str
    remaining_amount: float
    progress_percentage: float
    remaining_months: int
    required_monthly_contribution: float
    is_sufficient: bool


# Summary & Planner Schemas
class FinancialSummaryResponse(BaseModel):
    total_income: float
    total_emi: float
    total_household: float
    total_expenses: float
    total_savings: float
    total_investments: float
    total_entertainment: float
    total_goal_contributions: float
    total_allocated: float
    remaining_buffer: float
    financial_health_score: float
    financial_health_status: str


# AI Schemas
class AIChatRequest(BaseModel):
    message: str = Field(..., min_length=1)


class AIChatResponse(BaseModel):
    reply: str
    suggestions: list[str] = []
