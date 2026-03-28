from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, col

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.models.analysis import Analysis
from app.schemas.auth import CurrentUser
from app.schemas.dashboard import (
    DashboardOverview,
    DashboardRecentResponse,
    DashboardTrendsResponse,
)
from app.services import demo_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/overview", response_model=DashboardOverview)
def dashboard_overview(
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_db),
) -> DashboardOverview:
    if settings.demo_mode:
        return DashboardOverview(**demo_service.dashboard_overview())

    analysis = (
        session.query(Analysis)
        .filter(col(Analysis.user_id) == current_user.user_id)
        .order_by(col(Analysis.created_at).desc())
        .first()
    )

    if not analysis or not analysis.metrics_payload:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No analysis found")

    price = analysis.metrics_payload.get("price", {})
    supply = analysis.metrics_payload.get("supply_concentration", {})

    return DashboardOverview(
        latest_price=analysis.insight_payload.get("latest_price", 0.0),
        price_change_pct_30d=price.get("price_change_pct_30d", 0.0),
        volatility_30d=price.get("volatility_30d", 0.0),
        top_supply_country=supply.get("top_country", "Unknown"),
        supply_concentration_hhi=supply.get("hhi", 0.0),
    )


@router.get("/trends", response_model=DashboardTrendsResponse)
def dashboard_trends(
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_db),
) -> DashboardTrendsResponse:
    if settings.demo_mode:
        return DashboardTrendsResponse(**demo_service.dashboard_trends())

    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Trends endpoint not implemented")


@router.get("/recent", response_model=DashboardRecentResponse)
def dashboard_recent(
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_db),
) -> DashboardRecentResponse:
    if settings.demo_mode:
        return DashboardRecentResponse(**demo_service.dashboard_recent())

    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Recent endpoint not implemented")
