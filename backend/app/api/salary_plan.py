"""
Salary Plan and Summary API Router.
"""

from app.api.deps import get_current_user_id
from app.repositories.firestore_repository import FirestoreRepository
from app.schemas.financial import FinancialSummaryResponse
from app.services.financial_service import FinancialService
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/salary-plan", tags=["Salary Plan"])
repo = FirestoreRepository()
service = FinancialService(repo)


@router.get("/summary", response_model=FinancialSummaryResponse)
async def get_financial_summary(user_id: str = Depends(get_current_user_id)):
    summary = await service.get_user_financial_summary(user_id)
    return FinancialSummaryResponse(**summary)
