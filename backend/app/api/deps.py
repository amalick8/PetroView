from typing import Generator, cast

from fastapi import Depends
from sqlmodel import Session

from app.db.session import get_session
from app.core.config import settings
from app.schemas.auth import CurrentUser


def get_db() -> Generator[Session, None, None]:
    if settings.demo_mode:
        yield cast(Session, None)
        return
    with get_session() as session:
        yield session


def get_current_user() -> CurrentUser:
    return CurrentUser(user_id=settings.public_user_id, email=None, claims={})
