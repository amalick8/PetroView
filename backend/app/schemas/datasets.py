from datetime import date
from typing import Optional

from pydantic import BaseModel


class DatasetCreate(BaseModel):
    source_name: str
    source_type: str
    dataset_name: str
    description: Optional[str] = None


class DatasetRead(BaseModel):
    id: int
    source_name: str
    source_type: str
    dataset_name: str
    description: Optional[str]
    storage_path: Optional[str]
    row_count: Optional[int]
    start_date: Optional[date]
    end_date: Optional[date]


class DatasetRefreshRequest(BaseModel):
    source_name: str
