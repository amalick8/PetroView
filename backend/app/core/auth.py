from fastapi import Header, HTTPException, status

from app.core.config import settings
from app.core.security import AuthError, extract_user_id, verify_clerk_jwt
from app.schemas.auth import CurrentUser


def get_bearer_token(authorization: str) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    return authorization.replace("Bearer ", "", 1).strip()


def require_authenticated_user(authorization: str = Header(default="")) -> CurrentUser:
    if settings.demo_mode or settings.dev_auth_bypass:
        return CurrentUser(user_id="dev-user", email=None, claims={})

    token = get_bearer_token(authorization)
    try:
        payload = verify_clerk_jwt(token)
        user_id = extract_user_id(payload)
    except AuthError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=exc.message) from exc

    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    return CurrentUser(user_id=user_id, email=payload.get("email"), claims=payload)
