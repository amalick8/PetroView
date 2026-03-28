from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import get_current_user_id, get_db
from app.models.analysis import Analysis
from app.models.datasets import Dataset
from app.models.notebooks import Notebook
from app.services.notebook_service import generate_notebook

router = APIRouter(prefix="/notebooks", tags=["notebooks"])


@router.post("/generate")
def generate_report(
    analysis_id: int,
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_db),
) -> dict:
    analysis = session.get(Analysis, analysis_id)
    if not analysis or analysis.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")

    dataset = session.get(Dataset, analysis.dataset_id)
    if not dataset or dataset.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")

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
        user_id=user_id,
        dataset_id=dataset.id,
        analysis_id=analysis.id,
        notebook_path=notebook_path,
        notebook_title=f"PetroView Report {analysis.id}",
    )
    session.add(notebook)
    session.commit()
    session.refresh(notebook)

    return {"status": "ok", "notebook_id": notebook.id, "path": notebook.notebook_path}
