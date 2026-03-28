from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.analysis import router as analysis_router
from app.api.routes.datasets import router as datasets_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.forecast import router as forecast_router
from app.api.routes.notebooks import router as notebooks_router
from app.api.routes.health import router as health_router
from app.core.config import settings
from app.db.session import init_db


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router, prefix=settings.api_v1_prefix)
    app.include_router(datasets_router, prefix=settings.api_v1_prefix)
    app.include_router(analysis_router, prefix=settings.api_v1_prefix)
    app.include_router(forecast_router, prefix=settings.api_v1_prefix)
    app.include_router(dashboard_router, prefix=settings.api_v1_prefix)
    app.include_router(notebooks_router, prefix=settings.api_v1_prefix)

    @app.on_event("startup")
    def on_startup() -> None:
        init_db()

    return app


app = create_app()
