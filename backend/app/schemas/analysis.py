from typing import Optional

from pydantic import BaseModel


class AnalysisRunRequest(BaseModel):
    dataset_id: int
    title: str


class AnalysisRead(BaseModel):
    id: int
    dataset_id: int
    title: str
    summary: Optional[str]
    insight_payload: Optional[dict]
    shock_events_payload: Optional[dict]
    metrics_payload: Optional[dict]
