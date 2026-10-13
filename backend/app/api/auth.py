"""
Authentication API Router.
Provides backend user registration verification and auth health endpoints.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field

router = APIRouter(prefix="/auth", tags=["Authentication"])


class UserRegisterSchema(BaseModel):
    full_name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)


@router.post("/verify-registration")
async def verify_registration(data: UserRegisterSchema):
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")
    return {
        "status": "valid",
        "message": "Registration data validated successfully.",
        "email": data.email,
        "full_name": data.full_name,
    }
