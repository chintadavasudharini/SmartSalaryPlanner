"""
Non-Household Expense CRUD API Endpoints.
"""

from app.api.deps import get_current_user_id
from app.models.domain import Expense
from app.repositories.firestore_repository import FirestoreRepository
from app.schemas.financial import ExpenseCreate, ExpenseResponse
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/expenses", tags=["Expenses"])
repo = FirestoreRepository()


@router.get("", response_model=list[ExpenseResponse])
async def get_expenses(user_id: str = Depends(get_current_user_id)):
    items = await repo.get_all("expenses", user_id)
    return [
        ExpenseResponse(
            id=item["id"],
            user_id=user_id,
            expense_name=item.get("expense_name", "Expense"),
            category=item.get("category", "Other"),
            amount=float(item.get("amount", 0.0)),
            date=item.get("date"),
        )
        for item in items
    ]


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    data: ExpenseCreate, user_id: str = Depends(get_current_user_id)
):
    model = Expense(
        id=None,
        user_id=user_id,
        amount=data.amount,
        expense_name=data.expense_name,
        category=data.category,
        date=data.date or "",
    )
    res = await repo.create("expenses", user_id, model.to_dict())
    return ExpenseResponse(**res)


@router.put("/{record_id}", response_model=ExpenseResponse)
async def update_expense(
    record_id: str, data: ExpenseCreate, user_id: str = Depends(get_current_user_id)
):
    existing = await repo.get_by_id("expenses", user_id, record_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Expense record not found")

    model = Expense(
        id=record_id,
        user_id=user_id,
        amount=data.amount,
        expense_name=data.expense_name,
        category=data.category,
        date=data.date or existing.get("date", ""),
    )
    res = await repo.update("expenses", user_id, record_id, model.to_dict())
    return ExpenseResponse(**res)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(record_id: str, user_id: str = Depends(get_current_user_id)):
    success = await repo.delete("expenses", user_id, record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Expense record not found")
