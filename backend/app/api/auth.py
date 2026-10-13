"""
Authentication API Router.
Provides backend user registration verification and auth health endpoints.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator

router = APIRouter(prefix="/auth", tags=["Authentication"])


class UserRegisterSchema(BaseModel):
    full_name: str = Field(..., min_length=2)
    email: str = Field(..., min_length=5)
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        v_clean = v.strip().lower()
        if "@" not in v_clean or "." not in v_clean.split("@")[-1]:
            raise ValueError("Invalid email format.")
        return v_clean


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
