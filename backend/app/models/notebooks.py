from typing import Optional

from sqlmodel import Field, SQLModel

from app.models.base import TimestampMixin


class Notebook(TimestampMixin, SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    dataset_id: int = Field(index=True)
    analysis_id: int = Field(index=True)
    notebook_path: str
    notebook_title: str
