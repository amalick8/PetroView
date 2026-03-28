from pathlib import Path
from typing import Dict

import nbformat as nbf


def build_notebook_report(payload: Dict, output_path: str) -> str:
    nb = nbf.v4.new_notebook()

    nb.cells = [
        nbf.v4.new_markdown_cell("# PetroView Market Intelligence Report"),
        nbf.v4.new_markdown_cell("## Executive Summary\n" + payload.get("summary", "")),
        nbf.v4.new_markdown_cell("## Data Sources and Methodology\n" + payload.get("methodology", "")),
        nbf.v4.new_markdown_cell("## Exploratory Analysis\n" + payload.get("eda_summary", "")),
        nbf.v4.new_markdown_cell("## Supply Structure\n" + payload.get("supply_summary", "")),
        nbf.v4.new_markdown_cell("## Price Dynamics\n" + payload.get("price_summary", "")),
        nbf.v4.new_markdown_cell("## Supply Shock Detection\n" + payload.get("shock_summary", "")),
        nbf.v4.new_markdown_cell("## Forecast Results\n" + payload.get("forecast_summary", "")),
        nbf.v4.new_markdown_cell("## Risk Notes and Limitations\n" + payload.get("risk_notes", "")),
        nbf.v4.new_markdown_cell("## Final Takeaways\n" + payload.get("takeaways", "")),
    ]

    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        nbf.write(nb, f)

    return str(path)
