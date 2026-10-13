"""
API Dependency Utilities: User Authentication Injection.
Extracts authenticated user ID from Authorization header or fallback header for API calls.
"""

import logging

from fastapi import Header

logger = logging.getLogger(__name__)


def get_current_user_id(
    authorization: str | None = Header(None), x_user_id: str | None = Header(None)
) -> str:
    """
    Dependency to obtain authenticated user ID.
    Supports Firebase Auth Token parsing or X-User-ID header for client requests.
    """
    if x_user_id and x_user_id.strip():
        return x_user_id.strip()

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1].strip()
        if token:
            # In production, Firebase Admin verifies token.
            # If token is passed, extract uid or use token string directly
            try:
                from firebase_admin import auth

                decoded = auth.verify_id_token(token)
                return decoded.get("uid", token)
            except Exception as e:  # noqa: BLE001
                logger.debug("Firebase auth verify failed, using token string directly: %s", e)
                return token

    # Default fallback user ID if not provided (ensures API usability in client session)
    return "guest_user"
