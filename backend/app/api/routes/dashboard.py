from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import get_current_user_id, get_db
from app.models.analysis import Analysis
from app.schemas.dashboard import DashboardOverview

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/overview", response_model=DashboardOverview)
def dashboard_overview(
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_db),
) -> DashboardOverview:
    analysis = (
        session.query(Analysis)
        .filter(Analysis.user_id == user_id)
        .order_by(Analysis.created_at.desc())
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
