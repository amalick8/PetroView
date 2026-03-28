import httpx


def get_json(url: str) -> dict:
    response = httpx.get(url, timeout=30.0)
    response.raise_for_status()
    return response.json()


def get_text(url: str) -> str:
    response = httpx.get(url, timeout=30.0)
    response.raise_for_status()
    return response.text
