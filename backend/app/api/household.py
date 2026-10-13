"""
Household Expense CRUD API Endpoints.
"""

from app.api.deps import get_current_user_id
from app.models.domain import HouseholdExpense
from app.repositories.firestore_repository import FirestoreRepository
from app.schemas.financial import HouseholdCreate, HouseholdResponse
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/household", tags=["Household"])
repo = FirestoreRepository()


@router.get("", response_model=list[HouseholdResponse])
async def get_household_expenses(user_id: str = Depends(get_current_user_id)):
    items = await repo.get_all("household", user_id)
    return [
        HouseholdResponse(
            id=item["id"],
            user_id=user_id,
            item_name=item.get("item_name", "Household Item"),
            category=item.get("category", "Groceries"),
            amount=float(item.get("amount", 0.0)),
            date=item.get("date"),
        )
        for item in items
    ]


@router.post("", response_model=HouseholdResponse, status_code=status.HTTP_201_CREATED)
async def create_household(
    data: HouseholdCreate, user_id: str = Depends(get_current_user_id)
):
    model = HouseholdExpense(
        id=None,
        user_id=user_id,
        amount=data.amount,
        item_name=data.item_name,
        category=data.category,
        date=data.date or "",
    )
    res = await repo.create("household", user_id, model.to_dict())
    return HouseholdResponse(**res)


@router.put("/{record_id}", response_model=HouseholdResponse)
async def update_household(
    record_id: str, data: HouseholdCreate, user_id: str = Depends(get_current_user_id)
):
    existing = await repo.get_by_id("household", user_id, record_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Household record not found")

    model = HouseholdExpense(
        id=record_id,
        user_id=user_id,
        amount=data.amount,
        item_name=data.item_name,
        category=data.category,
        date=data.date or existing.get("date", ""),
    )
    res = await repo.update("household", user_id, record_id, model.to_dict())
    return HouseholdResponse(**res)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_household(record_id: str, user_id: str = Depends(get_current_user_id)):
    success = await repo.delete("household", user_id, record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Household record not found")
