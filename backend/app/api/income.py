"""
Income CRUD API Endpoints.
"""

from app.api.deps import get_current_user_id
from app.models.domain import Income
from app.repositories.firestore_repository import FirestoreRepository
from app.schemas.financial import IncomeCreate, IncomeResponse
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/income", tags=["Income"])
repo = FirestoreRepository()


@router.get("", response_model=list[IncomeResponse])
async def get_incomes(user_id: str = Depends(get_current_user_id)):
    items = await repo.get_all("income", user_id)
    return [
        IncomeResponse(
            id=item["id"],
            user_id=user_id,
            source=item.get("source", "Salary"),
            amount=float(item.get("amount", 0.0)),
            date=item.get("date"),
            income_type=item.get("income_type", "Salary"),
        )
        for item in items
    ]


@router.post("", response_model=IncomeResponse, status_code=status.HTTP_201_CREATED)
async def create_income(
    data: IncomeCreate, user_id: str = Depends(get_current_user_id)
):
    model = Income(
        id=None,
        user_id=user_id,
        amount=data.amount,
        source=data.source,
        income_type=data.income_type,
        date=data.date or "",
    )
    res = await repo.create("income", user_id, model.to_dict())
    return IncomeResponse(**res)


@router.put("/{record_id}", response_model=IncomeResponse)
async def update_income(
    record_id: str, data: IncomeCreate, user_id: str = Depends(get_current_user_id)
):
    existing = await repo.get_by_id("income", user_id, record_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Income record not found")

    model = Income(
        id=record_id,
        user_id=user_id,
        amount=data.amount,
        source=data.source,
        income_type=data.income_type,
        date=data.date or existing.get("date", ""),
    )
    res = await repo.update("income", user_id, record_id, model.to_dict())
    return IncomeResponse(**res)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_income(record_id: str, user_id: str = Depends(get_current_user_id)):
    success = await repo.delete("income", user_id, record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Income record not found")
