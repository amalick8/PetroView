from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import get_db
from app.core.config import settings
from app.models.datasets import Dataset
from app.models.forecasts import Forecast
from app.models.model_runs import ModelRun
from app.schemas.forecast import ForecastRead, ForecastRunRequest
from app.schemas.intelligence import ForecastBundle
from app.services.data_ingestion import fetch_oil_price_data
from app.services.forecast_service import run_forecast, run_forecast_bundle
from app.services import demo_service

router = APIRouter(prefix="/forecast", tags=["forecast"])


@router.post("/run", response_model=ForecastRead)
def run_forecast_route(
    request: ForecastRunRequest,
    session: Session = Depends(get_db),
) -> ForecastRead:
    if settings.demo_mode:
        demo = demo_service.create_forecast(
            dataset_id=request.dataset_id,
            horizon=request.horizon_days,
            analysis_id=request.analysis_id,
        )
        return ForecastRead(**demo)

    dataset = session.get(Dataset, request.dataset_id)
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    if dataset.source_name != "wti_prices":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Forecast requires WTI price dataset")

    if dataset.storage_path is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Dataset storage path missing")

    forecast_result = run_forecast(dataset.storage_path, request.horizon_days)
    model_name = forecast_result["horizons"][0]["model"]

    if dataset.id is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Dataset id missing")

    model_run = ModelRun(
        user_id=settings.public_user_id,
        dataset_id=dataset.id,
        analysis_id=request.analysis_id,
        model_name=model_name,
        model_version="1.0",
        parameters_payload={"horizon_days": request.horizon_days},
        metrics_payload={
            "mae": forecast_result.get("mae"),
            "rmse": forecast_result.get("rmse"),
        },
    )
    session.add(model_run)
    session.commit()
    session.refresh(model_run)

    if model_run.id is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Model run id missing")

    forecast = Forecast(
        user_id=settings.public_user_id,
        dataset_id=dataset.id,
        model_run_id=model_run.id,
        forecast_horizon=request.horizon_days,
        forecast_values_payload=forecast_result,
        confidence_interval_payload=None,
        narrative_summary="",
    )
    session.add(forecast)
    session.commit()
    session.refresh(forecast)

    return ForecastRead(**forecast.dict())


@router.get("/latest", response_model=ForecastBundle)
def latest_forecast() -> ForecastBundle:
    df_prices = fetch_oil_price_data()
    return ForecastBundle(**run_forecast_bundle(df_prices, horizons=[7, 30, 60]))


@router.get("/history")
def forecast_history() -> list[dict]:
    df_prices = fetch_oil_price_data()
    forecast = run_forecast_bundle(df_prices, horizons=[7, 30, 60])
    return [{"timestamp": "latest", "forecast": forecast}]


@router.get("/{forecast_id}", response_model=ForecastRead)
def get_forecast(
    forecast_id: int,
    session: Session = Depends(get_db),
) -> ForecastRead:
    if settings.demo_mode:
        demo = demo_service.get_forecast(forecast_id)
        if not demo:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Forecast not found")
        return ForecastRead(**demo)

    forecast = session.get(Forecast, forecast_id)
    if not forecast:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Forecast not found")
    return ForecastRead(**forecast.dict())
