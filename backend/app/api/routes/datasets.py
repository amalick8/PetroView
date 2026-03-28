from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import get_db
from app.models.datasets import Dataset
from app.schemas.datasets import DatasetRead, DatasetRefreshRequest
from app.services.ingestion_service import ingest_sources
from app.core.config import settings

router = APIRouter(prefix="/datasets", tags=["datasets"])


@router.get("", response_model=list[DatasetRead])
def list_datasets(
    session: Session = Depends(get_db),
) -> list[DatasetRead]:
    datasets = session.query(Dataset).all()
    return datasets


@router.post("/refresh")
def refresh_datasets(
    request: DatasetRefreshRequest,
    session: Session = Depends(get_db),
) -> dict:
    results = ingest_sources()
    if request.source_name not in results:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unknown source")

    payload = results[request.source_name]
    dataset = Dataset(
        user_id=settings.public_user_id,
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
