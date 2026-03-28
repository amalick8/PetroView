from typing import Optional

from sqlmodel import Field, SQLModel

from app.models.base import TimestampMixin


class UserProfile(TimestampMixin, SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, unique=True)
    full_name: Optional[str] = None
    organization: Optional[str] = None
