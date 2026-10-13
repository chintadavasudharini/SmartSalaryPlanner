"""
Gemini AI Financial Assistant Service Layer.
Integrates Gemini API via backend service layer.
NEVER exposes API keys to frontend.
"""

import logging
import os
from typing import Any

from app.core.config import settings

logger = logging.getLogger(__name__)


class GeminiAIService:
    """
    Service class for interacting with Gemini API for financial planning assistant.
    """

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        self.client = None

        if self.api_key:
            try:
                from google import genai

                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:  # noqa: BLE001
                logger.warning("Failed to initialize Google GenAI client: %s", e)
                self.client = None

    def generate_personalized_recommendations(
        self,
        summary: dict[str, Any],
        greedy_analysis: dict[str, Any],
        goal_analysis: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Generates personalized AI financial recommendations using Gemini API based strictly on user's actual data.
        """
        income = summary.get("total_income", 0.0)
        emi = summary.get("total_emi", 0.0)
        household = summary.get("total_household", 0.0)
        expenses = summary.get("total_expenses", 0.0)
        savings = summary.get("total_savings", 0.0)
        investments = summary.get("total_investments", 0.0)
        entertainment = summary.get("total_entertainment", 0.0)
        goals = summary.get("total_goal_contributions", 0.0)
        buffer = summary.get("remaining_buffer", 0.0)

        prompt = f"""
        You are an expert AI Salary Planner and Personalized Financial Planning Assistant.
        Analyze the user's real monthly financial situation:
        - Monthly Income: ₹{income}
        - Total EMI Payments: ₹{emi} ({round(emi / income * 100, 1) if income > 0 else 0}%)
        - Household Essentials: ₹{household}
        - General Expenses: ₹{expenses}
        - Savings Contributions: ₹{savings}
        - Investment Contributions: ₹{investments}
        - Entertainment Spending: ₹{entertainment}
        - Goal Contributions: ₹{goals}
        - Net Remaining Balance / Surplus Buffer: ₹{buffer}
        - Financial Health Score: {summary.get("financial_health_score")}/100 ({summary.get("financial_health_status")})

        Provide:
        1. A clear overview of their monthly salary allocation.
        2. Specific spending reduction suggestions (focusing on entertainment or high expense areas if in deficit).
        3. EMI observations and debt optimization advice.
        4. Savings and financial goal acceleration strategies.
        5. Actionable next steps for financial security.

        Do NOT invent financial numbers. Base recommendations strictly on the provided real user metrics.
        Do NOT guarantee investment returns or act as a regulated broker.
        """

        if self.client:
            try:
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                )
                if response and response.text:
                    return {
                        "recommendations_text": response.text.strip(),
                        "ai_powered": True,
                        "key_takeaways": self._extract_key_takeaways(summary),
                    }
            except Exception as e:  # noqa: BLE001
                logger.warning("Gemini recommendation generation failed, using fallback: %s", e)

        # Deterministic, rule-based fallback if API key is not set or network fails
        return self._generate_rule_based_fallback(summary)

    def answer_financial_question(self, question: str, summary: dict[str, Any]) -> str:
        """
        Answers user natural language question in context of user's actual salary data.
        """
        income = summary.get("total_income", 0.0)
        emi = summary.get("total_emi", 0.0)
        buffer = summary.get("remaining_buffer", 0.0)
        savings = summary.get("total_savings", 0.0)
        entertainment = summary.get("total_entertainment", 0.0)

        prompt = f"""
        User Question: "{question}"
        User's Actual Financial Metrics:
        - Income: ₹{income}
        - Total EMI: ₹{emi}
        - Current Monthly Savings: ₹{savings}
        - Monthly Entertainment Spend: ₹{entertainment}
        - Remaining Buffer: ₹{buffer}

        Answer the user's question directly, practically, and empathetically using their actual numbers.
        """

        if self.client:
            try:
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:  # noqa: BLE001
                logger.warning("Gemini question answering failed, using fallback: %s", e)

        # Fallback question response
        return (
            f"Based on your current monthly income of ₹{income:.2f} and total commitments, your remaining surplus buffer is ₹{buffer:.2f}. "
            f"Your current monthly EMI burden is ₹{emi:.2f} and discretionary spending is ₹{entertainment:.2f}. "
            f"To achieve your goals faster, consider allocating part of your ₹{buffer:.2f} surplus buffer toward savings or high-interest EMI repayment."
        )

    def _generate_rule_based_fallback(self, summary: dict[str, Any]) -> dict[str, Any]:
        income = summary.get("total_income", 0.0)
        emi = summary.get("total_emi", 0.0)
        buffer = summary.get("remaining_buffer", 0.0)
        entertainment = summary.get("total_entertainment", 0.0)
        savings = summary.get("total_savings", 0.0)

        lines = []
        lines.append(
            f"### Financial Analysis Summary (Health Score: {summary.get('financial_health_score')}/100)"
        )

        if buffer < 0:
            lines.append(
                f"⚠️ **Deficit Warning**: Your total planned commitments exceed your income by ₹{abs(buffer):.2f}. We recommend trimming discretionary entertainment spending (currently ₹{entertainment:.2f}) or lower priority non-household expenses."
            )
        else:
            lines.append(
                f"✅ **Surplus Buffer**: You have a healthy remaining buffer of ₹{buffer:.2f} after all monthly commitments."
            )

        if emi > 0 and income > 0:
            emi_pct = (emi / income) * 100
            if emi_pct > 30:
                lines.append(
                    f"⚠️ **High EMI Ratio**: EMI takes up {emi_pct:.1f}% of your monthly salary. Aim to keep total EMIs under 30% to prevent financial strain."
                )
            else:
                lines.append(
                    f"👍 **Managed EMI Burden**: Your EMI is {emi_pct:.1f}% of your income, which is within recommended bounds."
                )

        if savings == 0:
            lines.append(
                "💡 **Savings Action Item**: You have not set a dedicated monthly savings contribution yet. Start with at least 10-20% of income for emergency preparedness."
            )

        return {
            "recommendations_text": "\n\n".join(lines),
            "ai_powered": False,
            "key_takeaways": self._extract_key_takeaways(summary),
        }

    @staticmethod
    def _extract_key_takeaways(summary: dict[str, Any]) -> list[str]:
        takeaways = []
        if summary.get("remaining_buffer", 0) < 0:
            takeaways.append(
                "Reduce discretionary entertainment & non-essential expenses to eliminate monthly deficit."
            )
        else:
            takeaways.append(
                "Surplus budget available — consider boosting high-priority goal contributions."
            )
        if summary.get("total_emi", 0) > 0:
            takeaways.append("Focus on prepaying high-interest debt first.")
        takeaways.append(
            "Maintain an emergency fund covering at least 3 to 6 months of essential household expenses."
        )
        return takeaways
