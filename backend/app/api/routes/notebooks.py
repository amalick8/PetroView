from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import get_current_user, get_db
from app.models.analysis import Analysis
from app.models.datasets import Dataset
from app.models.notebooks import Notebook
from app.schemas.auth import CurrentUser
from app.schemas.notebooks import NotebookGenerateRequest, NotebookGenerateResponse
from app.services.notebook_service import generate_notebook

router = APIRouter(prefix="/notebooks", tags=["notebooks"])


@router.post("/generate", response_model=NotebookGenerateResponse)
def generate_report(
    request: NotebookGenerateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_db),
) -> NotebookGenerateResponse:
    analysis = session.get(Analysis, request.analysis_id)
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")
    if analysis.user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    dataset = session.get(Dataset, analysis.dataset_id)
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    if dataset.user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    payload = {
        "summary": analysis.summary or "",
        "methodology": "Public data sources (FRED, OWID) with validation and normalization.",
        "eda_summary": "Missing value rates, descriptive stats, and rolling metrics computed.",
        "supply_summary": "Supply concentration and top producers derived from latest OWID data.",
        "price_summary": "Rolling 30d volatility and trend metrics based on WTI spot prices.",
        "shock_summary": "Supply shock events flagged by percent-drop thresholds.",
        "forecast_summary": "Multi-model comparison with ARIMA as baseline.",
        "risk_notes": "Forecasts are sensitive to geopolitical disruptions and regime changes.",
        "takeaways": "Monitor volatility and concentration indicators for early risk signals.",
    }

    output_path = f"./data/reports/analysis_{analysis.id}.ipynb"
    notebook_path = generate_notebook(payload, output_path)

    notebook = Notebook(
        user_id=current_user.user_id,
        dataset_id=dataset.id,
        analysis_id=analysis.id,
        notebook_path=notebook_path,
        notebook_title=f"PetroView Report {analysis.id}",
    )
    session.add(notebook)
    session.commit()
    session.refresh(notebook)

    return NotebookGenerateResponse(
        status="ok",
        notebook_id=notebook.id,
        path=notebook.notebook_path,
    )
