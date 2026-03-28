from typing import Any, Dict, Optional

from pydantic import BaseModel


class CurrentUser(BaseModel):
    user_id: str
    email: Optional[str]
    claims: Dict[str, Any]


class MeResponse(BaseModel):
    user_id: str
    email: Optional[str]
    app_name: str
    environment: str
