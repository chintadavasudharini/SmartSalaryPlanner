"""
Investment CRUD API Endpoints.
"""

from app.api.deps import get_current_user_id
from app.models.domain import Investment
from app.repositories.firestore_repository import FirestoreRepository
from app.schemas.financial import InvestmentCreate, InvestmentResponse
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/investments", tags=["Investments"])
repo = FirestoreRepository()


@router.get("", response_model=list[InvestmentResponse])
async def get_investments(user_id: str = Depends(get_current_user_id)):
    items = await repo.get_all("investments", user_id)
    return [
        InvestmentResponse(
            id=item["id"],
            user_id=user_id,
            investment_name=item.get("investment_name", "Investment"),
            investment_type=item.get("investment_type", "SIP"),
            amount_invested=float(item.get("amount_invested", 0.0)),
            monthly_contribution=float(item.get("monthly_contribution", 0.0)),
            start_date=item.get("start_date"),
        )
        for item in items
    ]


@router.post("", response_model=InvestmentResponse, status_code=status.HTTP_201_CREATED)
async def create_investment(
    data: InvestmentCreate, user_id: str = Depends(get_current_user_id)
):
    obj = Investment(
        id=None,
        user_id=user_id,
        amount=data.monthly_contribution,
        investment_name=data.investment_name,
        investment_type=data.investment_type,
        amount_invested=data.amount_invested,
        monthly_contribution=data.monthly_contribution,
        start_date=data.start_date or "",
    )
    res = await repo.create("investments", user_id, obj.to_dict())
    return InvestmentResponse(**res)


@router.put("/{record_id}", response_model=InvestmentResponse)
async def update_investment(
    record_id: str, data: InvestmentCreate, user_id: str = Depends(get_current_user_id)
):
    existing = await repo.get_by_id("investments", user_id, record_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Investment record not found")

    obj = Investment(
        id=record_id,
        user_id=user_id,
        amount=data.monthly_contribution,
        investment_name=data.investment_name,
        investment_type=data.investment_type,
        amount_invested=data.amount_invested,
        monthly_contribution=data.monthly_contribution,
        start_date=data.start_date or existing.get("start_date", ""),
    )
    res = await repo.update("investments", user_id, record_id, obj.to_dict())
    return InvestmentResponse(**res)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_investment(
    record_id: str, user_id: str = Depends(get_current_user_id)
):
    success = await repo.delete("investments", user_id, record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Investment record not found")
