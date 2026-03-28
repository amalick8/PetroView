from typing import Optional

import httpx
from jose import jwt
from jose.exceptions import JWTError

from app.core.config import settings


class AuthError(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


def _get_jwks() -> dict:
    if not settings.clerk_jwks_url:
        raise AuthError("Missing Clerk JWKS URL")
    response = httpx.get(settings.clerk_jwks_url, timeout=10.0)
    response.raise_for_status()
    return response.json()


def verify_clerk_jwt(token: str) -> dict:
    jwks = _get_jwks()
    unverified_header = jwt.get_unverified_header(token)
    key_id = unverified_header.get("kid")
    keys = jwks.get("keys", [])
    key = next((k for k in keys if k.get("kid") == key_id), None)
    if not key:
        raise AuthError("Invalid token key")
    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=settings.clerk_audience or None,
            issuer=settings.clerk_issuer or None,
            options={"verify_aud": bool(settings.clerk_audience)},
        )
    except JWTError as exc:
        raise AuthError("Invalid token") from exc
    return payload


def extract_user_id(payload: dict) -> Optional[str]:
    return payload.get("sub")
