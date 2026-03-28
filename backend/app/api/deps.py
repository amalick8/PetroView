from typing import Generator

from fastapi import Depends, Header, HTTPException, status
from sqlmodel import Session

from app.core.config import settings
from app.core.security import AuthError, extract_user_id, verify_clerk_jwt
from app.db.session import get_session


def get_db() -> Generator[Session, None, None]:
    with get_session() as session:
        yield session


def get_current_user_id(authorization: str = Header(default="")) -> str:
    if settings.dev_auth_bypass:
        return "dev-user"

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    token = authorization.replace("Bearer ", "", 1).strip()
    try:
        payload = verify_clerk_jwt(token)
        user_id = extract_user_id(payload)
    except AuthError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=exc.message) from exc

    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    return user_id
