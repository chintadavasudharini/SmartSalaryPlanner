"""
Entertainment CRUD API Endpoints.
"""

from app.api.deps import get_current_user_id
from app.models.domain import Entertainment
from app.repositories.firestore_repository import FirestoreRepository
from app.schemas.financial import EntertainmentCreate, EntertainmentResponse
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/entertainment", tags=["Entertainment"])
repo = FirestoreRepository()


@router.get("", response_model=list[EntertainmentResponse])
async def get_entertainment(user_id: str = Depends(get_current_user_id)):
    items = await repo.get_all("entertainment", user_id)
    return [
        EntertainmentResponse(
            id=item["id"],
            user_id=user_id,
            name=item.get("name", "Entertainment"),
            category=item.get("category", "Other"),
            amount=float(item.get("amount", 0.0)),
            date=item.get("date"),
        )
        for item in items
    ]


@router.post(
    "", response_model=EntertainmentResponse, status_code=status.HTTP_201_CREATED
)
async def create_entertainment(
    data: EntertainmentCreate, user_id: str = Depends(get_current_user_id)
):
    obj = Entertainment(
        id=None,
        user_id=user_id,
        amount=data.amount,
        name=data.name,
        category=data.category,
        date=data.date or "",
    )
    res = await repo.create("entertainment", user_id, obj.to_dict())
    return EntertainmentResponse(**res)


@router.put("/{record_id}", response_model=EntertainmentResponse)
async def update_entertainment(
    record_id: str,
    data: EntertainmentCreate,
    user_id: str = Depends(get_current_user_id),
):
    existing = await repo.get_by_id("entertainment", user_id, record_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Entertainment record not found")

    obj = Entertainment(
        id=record_id,
        user_id=user_id,
        amount=data.amount,
        name=data.name,
        category=data.category,
        date=data.date or existing.get("date", ""),
    )
    res = await repo.update("entertainment", user_id, record_id, obj.to_dict())
    return EntertainmentResponse(**res)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entertainment(
    record_id: str, user_id: str = Depends(get_current_user_id)
):
    success = await repo.delete("entertainment", user_id, record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Entertainment record not found")
