from pydantic import BaseModel


class NotebookGenerateRequest(BaseModel):
    analysis_id: int


class NotebookGenerateResponse(BaseModel):
    status: str
    notebook_id: int
    path: str
