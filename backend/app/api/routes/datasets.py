from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import get_current_user, get_db
from app.models.datasets import Dataset
from app.schemas.auth import CurrentUser
from app.schemas.datasets import DatasetRead, DatasetRefreshRequest
from app.services.ingestion_service import ingest_sources

router = APIRouter(prefix="/datasets", tags=["datasets"])


@router.get("", response_model=list[DatasetRead])
def list_datasets(
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_db),
) -> list[DatasetRead]:
    datasets = session.query(Dataset).filter(Dataset.user_id == current_user.user_id).all()
    return datasets


@router.post("/refresh")
def refresh_datasets(
    request: DatasetRefreshRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_db),
) -> dict:
    results = ingest_sources()
    if request.source_name not in results:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unknown source")

    payload = results[request.source_name]
    dataset = Dataset(
        user_id=current_user.user_id,
        source_name=request.source_name,
        source_type="public",
        dataset_name=request.source_name.replace("_", " ").title(),
        storage_path=payload["path"],
        row_count=int(payload["rows"]),
    )
    session.add(dataset)
    session.commit()
    session.refresh(dataset)

    return {"status": "ok", "dataset_id": dataset.id}
