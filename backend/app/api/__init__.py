"""
API package initialization.
"""

from app.api.ai import router as ai_router
from app.api.algorithms import router as algorithms_router
from app.api.auth import router as auth_router
from app.api.emi import router as emi_router
from app.api.entertainment import router as entertainment_router
from app.api.expenses import router as expenses_router
from app.api.goals import router as goals_router
from app.api.household import router as household_router
from app.api.income import router as income_router
from app.api.investments import router as investments_router
from app.api.salary_plan import router as salary_plan_router
from app.api.savings import router as savings_router
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(income_router)
api_router.include_router(emi_router)
api_router.include_router(household_router)
api_router.include_router(expenses_router)
api_router.include_router(savings_router)
api_router.include_router(investments_router)
api_router.include_router(entertainment_router)
api_router.include_router(goals_router)
api_router.include_router(salary_plan_router)
api_router.include_router(algorithms_router)
api_router.include_router(ai_router)

__all__ = ["api_router"]
