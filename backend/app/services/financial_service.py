"""
Financial Service Layer.
Encapsulates domain logic, financial aggregations, deterministic EMI math, and summary calculation.
"""

from typing import Any

from app.models.domain import EMI, SalaryPlan
from app.repositories.base import BaseRepository


class FinancialService:
    def __init__(self, repository: BaseRepository):
        self.repo = repository

    async def get_user_financial_summary(self, user_id: str) -> dict[str, Any]:
        """
        Calculates complete financial summary from logged in user's actual data.
        Returns 0 amounts if user has no data yet (Empty State).
        """
        incomes = await self.repo.get_all("income", user_id)
        emis = await self.repo.get_all("emi", user_id)
        household = await self.repo.get_all("household", user_id)
        expenses = await self.repo.get_all("expenses", user_id)
        savings = await self.repo.get_all("savings", user_id)
        investments = await self.repo.get_all("investments", user_id)
        entertainment = await self.repo.get_all("entertainment", user_id)
        goals = await self.repo.get_all("goals", user_id)

        # Pure Functional Aggregations using list comprehensions & sum
        total_income = round(sum(float(i.get("amount", 0.0)) for i in incomes), 2)

        # EMI calculated using deterministic loan formula
        total_emi = round(
            sum(
                EMI(
                    id=e.get("id"),
                    user_id=user_id,
                    amount=float(e.get("amount", 0.0)),
                    principal=float(e.get("principal", 0.0)),
                    outstanding_amount=float(e.get("outstanding_amount", 0.0)),
                    annual_interest_rate=float(e.get("annual_interest_rate", 0.0)),
                    remaining_months=int(e.get("remaining_months", 1)),
                ).calculate_monthly_emi()
                for e in emis
            ),
            2,
        )

        total_household = round(sum(float(h.get("amount", 0.0)) for h in household), 2)
        total_expenses = round(sum(float(ex.get("amount", 0.0)) for ex in expenses), 2)
        total_savings = round(
            sum(
                float(s.get("monthly_contribution", s.get("amount", 0.0)))
                for s in savings
            ),
            2,
        )
        total_investments = round(
            sum(
                float(inv.get("monthly_contribution", inv.get("amount", 0.0)))
                for inv in investments
            ),
            2,
        )
        total_entertainment = round(
            sum(float(ent.get("amount", 0.0)) for ent in entertainment), 2
        )
        total_goal_contributions = round(
            sum(
                float(g.get("monthly_contribution", g.get("amount", 0.0)))
                for g in goals
            ),
            2,
        )

        plan = SalaryPlan(
            income=total_income,
            emi=total_emi,
            household=total_household,
            expenses=total_expenses,
            savings=total_savings,
            investments=total_investments,
            entertainment=total_entertainment,
            goal_contributions=total_goal_contributions,
        )

        score, status = self.calculate_health_score(plan)

        return {
            "total_income": total_income,
            "total_emi": total_emi,
            "total_household": total_household,
            "total_expenses": total_expenses,
            "total_savings": total_savings,
            "total_investments": total_investments,
            "total_entertainment": total_entertainment,
            "total_goal_contributions": total_goal_contributions,
            "total_allocated": plan.total_allocated,
            "remaining_buffer": plan.remaining_buffer,
            "financial_health_score": score,
            "financial_health_status": status,
            "has_data": any(
                [
                    incomes,
                    emis,
                    household,
                    expenses,
                    savings,
                    investments,
                    entertainment,
                    goals,
                ]
            ),
        }

    @staticmethod
    def calculate_health_score(plan: SalaryPlan) -> tuple[float, str]:
        """
        Calculates a deterministic Financial Health Score (0 - 100).
        - Savings Ratio (20% weight)
        - EMI Ratio (30% weight)
        - Surplus Buffer (30% weight)
        - Investment Ratio (20% weight)
        """
        if plan.income <= 0:
            return 0.0, "No Income Data"

        score = 100.0

        # EMI Burden Check: Ideally EMI <= 30% of income
        emi_ratio = plan.emi / plan.income
        if emi_ratio > 0.5:
            score -= 30.0
        elif emi_ratio > 0.3:
            score -= 15.0

        # Deficit Penalty
        if plan.remaining_buffer < 0:
            score -= 40.0
        elif plan.remaining_buffer < (plan.income * 0.1):
            score -= 10.0

        # Savings / Investment Check: Ideally >= 20% total savings + investments
        total_savings_inv = plan.savings + plan.investments + plan.goal_contributions
        savings_ratio = total_savings_inv / plan.income
        if savings_ratio < 0.1:
            score -= 20.0
        elif savings_ratio < 0.2:
            score -= 10.0

        score = max(0.0, min(100.0, round(score, 1)))

        if score >= 80:
            status = "Excellent"
        elif score >= 60:
            status = "Good"
        elif score >= 40:
            status = "Fair"
        else:
            status = "Critical"

        return score, status
