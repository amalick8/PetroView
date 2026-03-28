from typing import Dict

from app.notebooks.generator import build_notebook_report


def generate_notebook(summary_payload: Dict, output_path: str) -> str:
    return build_notebook_report(summary_payload, output_path)
