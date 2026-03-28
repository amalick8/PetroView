from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.models.notebooks import Notebook
from app.schemas.auth import CurrentUser
from app.schemas.reports import ReportRead
from app.services import demo_service

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/{report_id}", response_model=ReportRead)
def get_report(
    report_id: int,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_db),
) -> ReportRead:
    if settings.demo_mode:
        report = demo_service.get_report(report_id)
        if not report:
            report = demo_service.create_report(report_id, current_user.user_id)
        return ReportRead(
            id=report["id"],
            title=report["title"],
            path=report["path"],
            created_at=report.get("created_at"),
        )

    notebook = session.get(Notebook, report_id)
    if not notebook:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    if notebook.user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    if notebook.id is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Report id missing")

    return ReportRead(
        id=notebook.id,
        title=notebook.notebook_title,
        path=notebook.notebook_path,
        created_at=notebook.created_at.isoformat() if notebook.created_at else None,
    )
