from datetime import date
from typing import Optional

from sqlmodel import Field, SQLModel

from app.models.base import TimestampMixin


class Dataset(TimestampMixin, SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    source_name: str
    source_type: str
    dataset_name: str
    description: Optional[str] = None
    storage_path: Optional[str] = None
    row_count: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
