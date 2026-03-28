from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


@router.get("/version")
def version() -> dict:
    return {"version": "0.1.0"}
