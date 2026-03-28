from typing import Optional

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel

from app.models.base import TimestampMixin


class Forecast(TimestampMixin, SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    dataset_id: int = Field(index=True)
    model_run_id: int = Field(index=True)
    forecast_horizon: int
    forecast_values_payload: Optional[dict] = Field(default=None, sa_column=Column(JSONB))
    confidence_interval_payload: Optional[dict] = Field(default=None, sa_column=Column(JSONB))
    narrative_summary: Optional[str] = None
