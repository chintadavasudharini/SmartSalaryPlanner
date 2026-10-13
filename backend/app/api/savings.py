"""
Savings CRUD API Endpoints.
"""

from app.api.deps import get_current_user_id
from app.models.domain import Saving
from app.repositories.firestore_repository import FirestoreRepository
from app.schemas.financial import SavingsCreate, SavingsResponse
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/savings", tags=["Savings"])
repo = FirestoreRepository()


@router.get("", response_model=list[SavingsResponse])
async def get_savings(user_id: str = Depends(get_current_user_id)):
    items = await repo.get_all("savings", user_id)
    responses = []
    for item in items:
        obj = Saving(
            id=item["id"],
            user_id=user_id,
            amount=float(item.get("monthly_contribution", item.get("amount", 0.0))),
            savings_goal=item.get("savings_goal", "Savings Goal"),
            target_amount=float(item.get("target_amount", 0.0)),
            current_amount=float(item.get("current_amount", 0.0)),
            monthly_contribution=float(item.get("monthly_contribution", 0.0)),
            target_date=item.get("target_date", ""),
        )
        responses.append(SavingsResponse(**obj.to_dict()))
    return responses


@router.post("", response_model=SavingsResponse, status_code=status.HTTP_201_CREATED)
async def create_saving(
    data: SavingsCreate, user_id: str = Depends(get_current_user_id)
):
    obj = Saving(
        id=None,
        user_id=user_id,
        amount=data.monthly_contribution,
        savings_goal=data.savings_goal,
        target_amount=data.target_amount,
        current_amount=data.current_amount,
        monthly_contribution=data.monthly_contribution,
        target_date=data.target_date,
    )
    res = await repo.create("savings", user_id, obj.to_dict())
    return SavingsResponse(**res)


@router.put("/{record_id}", response_model=SavingsResponse)
async def update_saving(
    record_id: str, data: SavingsCreate, user_id: str = Depends(get_current_user_id)
):
    existing = await repo.get_by_id("savings", user_id, record_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Savings record not found")

    obj = Saving(
        id=record_id,
        user_id=user_id,
        amount=data.monthly_contribution,
        savings_goal=data.savings_goal,
        target_amount=data.target_amount,
        current_amount=data.current_amount,
        monthly_contribution=data.monthly_contribution,
        target_date=data.target_date,
    )
    res = await repo.update("savings", user_id, record_id, obj.to_dict())
    return SavingsResponse(**res)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_saving(record_id: str, user_id: str = Depends(get_current_user_id)):
    success = await repo.delete("savings", user_id, record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Savings record not found")
