from typing import Optional

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel

from app.models.base import TimestampMixin


class Analysis(TimestampMixin, SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    dataset_id: int = Field(index=True)
    title: str
    summary: Optional[str] = None
    insight_payload: Optional[dict] = Field(default=None, sa_column=Column(JSONB))
    shock_events_payload: Optional[dict] = Field(default=None, sa_column=Column(JSONB))
    metrics_payload: Optional[dict] = Field(default=None, sa_column=Column(JSONB))
