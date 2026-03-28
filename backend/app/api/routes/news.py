from fastapi import APIRouter

from app.schemas.intelligence import NewsSignals
from app.services.news_ingestion_service import fetch_recent_news, score_news

router = APIRouter(prefix="/news", tags=["news"])


@router.get("/latest", response_model=NewsSignals)
def latest_news() -> NewsSignals:
    headlines = fetch_recent_news()
    return NewsSignals(**score_news(headlines))
