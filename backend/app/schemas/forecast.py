from typing import Optional

from pydantic import BaseModel, Field


class ForecastRunRequest(BaseModel):
    dataset_id: int
    analysis_id: Optional[int] = None
    horizon_days: int = Field(default=30, ge=7, le=120)


class ForecastRead(BaseModel):
    id: int
    dataset_id: int
    model_run_id: int
    forecast_horizon: int
    forecast_values_payload: Optional[dict]
    confidence_interval_payload: Optional[dict]
    narrative_summary: Optional[str]
