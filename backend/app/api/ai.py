"""
AI Salary Manager API Router.
Integrates Gemini API service layer.
"""

from app.ai.gemini_service import GeminiAIService
from app.algorithms.dynamic_programming import optimize_goals_dp
from app.algorithms.greedy import calculate_greedy_salary_plan
from app.api.deps import get_current_user_id
from app.repositories.firestore_repository import FirestoreRepository
from app.schemas.financial import AIChatRequest, AIChatResponse
from app.services.financial_service import FinancialService
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/ai", tags=["AI Salary Manager"])
repo = FirestoreRepository()
service = FinancialService(repo)
ai_service = GeminiAIService()


@router.get("/recommendations")
async def get_ai_recommendations(user_id: str = Depends(get_current_user_id)):
    summary = await service.get_user_financial_summary(user_id)
    financial_data = {
        "emi": summary["total_emi"],
        "household": summary["total_household"],
        "expenses": summary["total_expenses"],
        "savings": summary["total_savings"],
        "goals": summary["total_goal_contributions"],
        "investments": summary["total_investments"],
        "entertainment": summary["total_entertainment"],
    }
    greedy = calculate_greedy_salary_plan(summary["total_income"], financial_data)
    goals = await repo.get_all("goals", user_id)
    dp_goals = optimize_goals_dp(
        goals, summary["total_savings"] + summary["total_goal_contributions"]
    )

    recommendations = ai_service.generate_personalized_recommendations(
        summary, greedy, dp_goals
    )
    return recommendations


@router.post("/chat", response_model=AIChatResponse)
async def chat_with_ai(
    data: AIChatRequest, user_id: str = Depends(get_current_user_id)
):
    summary = await service.get_user_financial_summary(user_id)
    reply = ai_service.answer_financial_question(data.message, summary)

    suggestions = [
        "How can I cut expenses to save more?",
        "Is my EMI burden safe relative to my salary?",
        "How should I prioritize my emergency fund vs investments?",
    ]
    return AIChatResponse(reply=reply, suggestions=suggestions)
