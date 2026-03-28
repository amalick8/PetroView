from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import get_current_user, get_db
from app.models.datasets import Dataset
from app.models.forecasts import Forecast
from app.models.model_runs import ModelRun
from app.schemas.auth import CurrentUser
from app.schemas.forecast import ForecastRead, ForecastRunRequest
from app.services.forecast_service import run_forecast

router = APIRouter(prefix="/forecast", tags=["forecast"])


@router.post("/run", response_model=ForecastRead)
def run_forecast_route(
    request: ForecastRunRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_db),
) -> ForecastRead:
    dataset = session.get(Dataset, request.dataset_id)
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    if dataset.user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    if dataset.source_name != "wti_prices":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Forecast requires WTI price dataset")

    forecast_result = run_forecast(dataset.storage_path, request.horizon_days)
    model_name = forecast_result["forecast"]["model"]

    model_run = ModelRun(
        user_id=current_user.user_id,
        dataset_id=dataset.id,
        analysis_id=request.analysis_id,
        model_name=model_name,
        model_version="1.0",
        parameters_payload={"horizon_days": request.horizon_days},
        metrics_payload=forecast_result["metrics"],
    )
    session.add(model_run)
    session.commit()
    session.refresh(model_run)

    forecast = Forecast(
        user_id=current_user.user_id,
        dataset_id=dataset.id,
        model_run_id=model_run.id,
        forecast_horizon=request.horizon_days,
        forecast_values_payload=forecast_result["forecast"],
        confidence_interval_payload=forecast_result["confidence"],
        narrative_summary="",
    )
    session.add(forecast)
    session.commit()
    session.refresh(forecast)

    return forecast


@router.get("/{forecast_id}", response_model=ForecastRead)
def get_forecast(
    forecast_id: int,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_db),
) -> ForecastRead:
    forecast = session.get(Forecast, forecast_id)
    if not forecast:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Forecast not found")
    if forecast.user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return forecast
