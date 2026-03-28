from typing import Optional

from sqlmodel import Field, SQLModel

from app.models.base import TimestampMixin


class CachedMarketData(TimestampMixin, SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    source_name: str = Field(index=True)
    source_key: str = Field(index=True)
    payload_reference: str
    fetched_at: str
    status: str
