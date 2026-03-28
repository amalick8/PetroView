from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import get_current_user, get_db
from app.models.analysis import Analysis
from app.models.datasets import Dataset
from app.schemas.auth import CurrentUser
from app.schemas.analysis import AnalysisRead, AnalysisRunRequest
from app.services.analysis_service import build_analysis
from app.services.ai_insight_service import build_insight_summary

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("/run", response_model=AnalysisRead)
def run_analysis(
    request: AnalysisRunRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_db),
) -> AnalysisRead:
    dataset = session.get(Dataset, request.dataset_id)
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    if dataset.user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    # Expect both WTI and OWID datasets to exist.
    datasets = session.query(Dataset).filter(Dataset.user_id == current_user.user_id).all()
    price_path = next((d.storage_path for d in datasets if d.source_name == "wti_prices"), None)
    supply_path = next((d.storage_path for d in datasets if d.source_name == "owid_energy"), None)

    if not price_path or not supply_path:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing required datasets")

    insight_payload, shocks_payload, metrics_payload = build_analysis(price_path, supply_path)
    summary = build_insight_summary(metrics_payload)

    analysis = Analysis(
        user_id=current_user.user_id,
        dataset_id=dataset.id,
        title=request.title,
        summary=summary,
        insight_payload=insight_payload,
        shock_events_payload=shocks_payload,
        metrics_payload=metrics_payload,
    )

    session.add(analysis)
    session.commit()
    session.refresh(analysis)

    return analysis


@router.get("/{analysis_id}", response_model=AnalysisRead)
def get_analysis(
    analysis_id: int,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_db),
) -> AnalysisRead:
    analysis = session.get(Analysis, analysis_id)
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")
    if analysis.user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return analysis
