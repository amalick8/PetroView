from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, col

from app.api.deps import get_db
from app.core.config import settings
from app.models.notebooks import Notebook
from app.schemas.reports import ReportRead
from app.services import demo_service

router = APIRouter(prefix="/report", tags=["report"])


@router.get("/latest", response_model=ReportRead)
def latest_report(session: Session = Depends(get_db)) -> ReportRead:
    if settings.demo_mode:
        report = demo_service.get_latest_report()
        return ReportRead(
            id=report["id"],
            title=report["title"],
            path=report["path"],
            created_at=report.get("created_at"),
        )

    notebook = session.query(Notebook).order_by(col(Notebook.created_at).desc()).first()
    if not notebook:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    if notebook.id is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Report id missing")

    return ReportRead(
        id=notebook.id,
        title=notebook.notebook_title,
        path=notebook.notebook_path,
        created_at=notebook.created_at.isoformat() if notebook.created_at else None,
    )
