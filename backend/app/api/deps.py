from typing import Generator

from fastapi import Depends
from sqlmodel import Session

from app.core.auth import require_authenticated_user
from app.db.session import get_session
from app.schemas.auth import CurrentUser


def get_db() -> Generator[Session, None, None]:
    with get_session() as session:
        yield session


def get_current_user(current_user: CurrentUser = Depends(require_authenticated_user)) -> CurrentUser:
    return current_user


def get_current_user_id(current_user: CurrentUser = Depends(get_current_user)) -> str:
    return current_user.user_id
