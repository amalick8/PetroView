from typing import Optional

from pydantic import BaseModel


class ReportRead(BaseModel):
    id: int
    title: str
    path: str
    created_at: Optional[str] = None
