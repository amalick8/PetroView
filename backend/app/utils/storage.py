from pathlib import Path
from typing import Optional

from app.core.config import settings


def ensure_data_dir() -> Path:
    data_dir = Path(settings.data_dir)
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir


def write_text(content: str, filename: str) -> Path:
    data_dir = ensure_data_dir()
    path = data_dir / filename
    path.write_text(content, encoding="utf-8")
    return path


def read_text(filename: str) -> Optional[str]:
    path = Path(settings.data_dir) / filename
    if not path.exists():
        return None
    return path.read_text(encoding="utf-8")
