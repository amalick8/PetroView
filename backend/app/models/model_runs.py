from typing import Optional

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel

from app.models.base import TimestampMixin


class ModelRun(TimestampMixin, SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    dataset_id: int = Field(index=True)
    analysis_id: Optional[int] = Field(default=None, index=True, foreign_key="analyses.id")
    model_name: str
    model_version: str
    parameters_payload: Optional[dict] = Field(default=None, sa_column=Column(JSONB))
    training_start: Optional[str] = None
    training_end: Optional[str] = None
    metrics_payload: Optional[dict] = Field(default=None, sa_column=Column(JSONB))
