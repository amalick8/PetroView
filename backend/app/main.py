import logging
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes.analysis import router as analysis_router
from app.api.routes.datasets import router as datasets_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.forecast import router as forecast_router
from app.api.routes.intelligence import router as intelligence_router
from app.api.routes.news import router as news_router
from app.api.routes.notebooks import router as notebooks_router
from app.api.routes.public_report import router as public_report_router
from app.api.routes.reports import router as reports_router
from app.api.routes.signals import router as signals_router
from app.api.routes.volatility import router as volatility_router
from app.api.routes.health import router as health_router
from app.core.config import settings
from app.db.session import init_db


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)

    logger = logging.getLogger(__name__)

    def error_response(
        status_code: int,
        message: str,
        error_type: str,
        details: object | None = None,
    ) -> JSONResponse:
        payload: Dict[str, Any] = {"error": {"type": error_type, "message": message}}
        if details is not None:
            payload["error"]["details"] = details
        return JSONResponse(status_code=status_code, content=payload)

    @app.exception_handler(HTTPException)
    async def http_exception_handler(
        request: Request,
        exc: HTTPException,
    ) -> JSONResponse:
        if exc.status_code == status.HTTP_401_UNAUTHORIZED:
            error_type = "unauthorized"
        elif exc.status_code == status.HTTP_403_FORBIDDEN:
            error_type = "forbidden"
        elif exc.status_code == status.HTTP_404_NOT_FOUND:
            error_type = "not_found"
        elif exc.status_code == status.HTTP_400_BAD_REQUEST:
            error_type = "bad_request"
        else:
            error_type = "http_error"

        message = exc.detail if isinstance(exc.detail, str) else "Request failed"
        return error_response(exc.status_code, message, error_type)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        return error_response(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Validation error",
            "validation_error",
            exc.errors(),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request,
        exc: Exception,
    ) -> JSONResponse:
        logger.exception("Unhandled error", exc_info=exc)
        return error_response(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Internal server error",
            "internal_error",
        )

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
    app.include_router(intelligence_router, prefix=settings.api_v1_prefix)
    app.include_router(news_router, prefix=settings.api_v1_prefix)
    app.include_router(dashboard_router, prefix=settings.api_v1_prefix)
    app.include_router(notebooks_router, prefix=settings.api_v1_prefix)
    app.include_router(public_report_router, prefix=settings.api_v1_prefix)
    app.include_router(reports_router, prefix=settings.api_v1_prefix)
    app.include_router(signals_router, prefix=settings.api_v1_prefix)
    app.include_router(volatility_router, prefix=settings.api_v1_prefix)

    @app.on_event("startup")
    def on_startup() -> None:
        init_db()

    return app


app = create_app()
