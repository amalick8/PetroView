from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.core.config import settings
from app.schemas.auth import CurrentUser, MeResponse

router = APIRouter(tags=["auth"])


@router.get("/me", response_model=MeResponse)
def read_me(current_user: CurrentUser = Depends(get_current_user)) -> MeResponse:
    return MeResponse(
        user_id=current_user.user_id,
        email=current_user.email,
        app_name=settings.app_name,
        environment=settings.environment,
    )
