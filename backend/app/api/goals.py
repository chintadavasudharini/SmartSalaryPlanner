"""
Goals CRUD API Endpoints.
"""

from app.api.deps import get_current_user_id
from app.models.domain import FinancialGoal
from app.repositories.firestore_repository import FirestoreRepository
from app.schemas.financial import GoalCreate, GoalResponse
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/goals", tags=["Goals"])
repo = FirestoreRepository()


@router.get("", response_model=list[GoalResponse])
async def get_goals(user_id: str = Depends(get_current_user_id)):
    items = await repo.get_all("goals", user_id)
    responses = []
    for item in items:
        obj = FinancialGoal(
            id=item["id"],
            user_id=user_id,
            amount=float(item.get("monthly_contribution", 0.0)),
            goal_name=item.get("goal_name", "Goal"),
            goal_type=item.get("goal_type", "Other"),
            target_amount=float(item.get("target_amount", 0.0)),
            current_amount=float(item.get("current_amount", 0.0)),
            deadline=item.get("deadline", ""),
            monthly_contribution=float(item.get("monthly_contribution", 0.0)),
            priority=int(item.get("priority", 1)),
        )
        responses.append(GoalResponse(**obj.to_dict()))
    return responses


@router.post("", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
async def create_goal(data: GoalCreate, user_id: str = Depends(get_current_user_id)):
    obj = FinancialGoal(
        id=None,
        user_id=user_id,
        amount=data.monthly_contribution,
        goal_name=data.goal_name,
        goal_type=data.goal_type,
        target_amount=data.target_amount,
        current_amount=data.current_amount,
        deadline=data.deadline,
        monthly_contribution=data.monthly_contribution,
        priority=data.priority,
    )
    res = await repo.create("goals", user_id, obj.to_dict())
    return GoalResponse(**res)


@router.put("/{record_id}", response_model=GoalResponse)
async def update_goal(
    record_id: str, data: GoalCreate, user_id: str = Depends(get_current_user_id)
):
    existing = await repo.get_by_id("goals", user_id, record_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Goal record not found")

    obj = FinancialGoal(
        id=record_id,
        user_id=user_id,
        amount=data.monthly_contribution,
        goal_name=data.goal_name,
        goal_type=data.goal_type,
        target_amount=data.target_amount,
        current_amount=data.current_amount,
        deadline=data.deadline,
        monthly_contribution=data.monthly_contribution,
        priority=data.priority,
    )
    res = await repo.update("goals", user_id, record_id, obj.to_dict())
    return GoalResponse(**res)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(record_id: str, user_id: str = Depends(get_current_user_id)):
    success = await repo.delete("goals", user_id, record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Goal record not found")
