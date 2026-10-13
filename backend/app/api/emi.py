"""
EMI CRUD API Endpoints with Deterministic Math.
"""

from app.api.deps import get_current_user_id
from app.models.domain import EMI
from app.repositories.firestore_repository import FirestoreRepository
from app.schemas.financial import EMICreate, EMIResponse
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/emi", tags=["EMI"])
repo = FirestoreRepository()


@router.get("", response_model=list[EMIResponse])
async def get_emis(user_id: str = Depends(get_current_user_id)):
    items = await repo.get_all("emi", user_id)
    responses = []
    for item in items:
        emi_obj = EMI(
            id=item["id"],
            user_id=user_id,
            amount=float(item.get("amount", 0.0)),
            loan_name=item.get("loan_name", "Loan"),
            loan_type=item.get("loan_type", "Personal Loan"),
            principal=float(item.get("principal", 0.0)),
            outstanding_amount=float(item.get("outstanding_amount", 0.0)),
            annual_interest_rate=float(item.get("annual_interest_rate", 0.0)),
            remaining_months=int(item.get("remaining_months", 1)),
            date=item.get("date", ""),
        )
        responses.append(EMIResponse(**emi_obj.to_dict()))
    return responses


@router.post("", response_model=EMIResponse, status_code=status.HTTP_201_CREATED)
async def create_emi(data: EMICreate, user_id: str = Depends(get_current_user_id)):
    emi_obj = EMI(
        id=None,
        user_id=user_id,
        amount=0.0,
        loan_name=data.loan_name,
        loan_type=data.loan_type,
        principal=data.principal,
        outstanding_amount=data.outstanding_amount,
        annual_interest_rate=data.annual_interest_rate,
        remaining_months=data.remaining_months,
        date=data.date or "",
    )
    res = await repo.create("emi", user_id, emi_obj.to_dict())
    return EMIResponse(**res)


@router.put("/{record_id}", response_model=EMIResponse)
async def update_emi(
    record_id: str, data: EMICreate, user_id: str = Depends(get_current_user_id)
):
    existing = await repo.get_by_id("emi", user_id, record_id)
    if not existing:
        raise HTTPException(status_code=404, detail="EMI record not found")

    emi_obj = EMI(
        id=record_id,
        user_id=user_id,
        amount=0.0,
        loan_name=data.loan_name,
        loan_type=data.loan_type,
        principal=data.principal,
        outstanding_amount=data.outstanding_amount,
        annual_interest_rate=data.annual_interest_rate,
        remaining_months=data.remaining_months,
        date=data.date or existing.get("date", ""),
    )
    res = await repo.update("emi", user_id, record_id, emi_obj.to_dict())
    return EMIResponse(**res)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_emi(record_id: str, user_id: str = Depends(get_current_user_id)):
    success = await repo.delete("emi", user_id, record_id)
    if not success:
        raise HTTPException(status_code=404, detail="EMI record not found")
