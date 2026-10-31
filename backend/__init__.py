"""
Digital Dark Spot Backend Package
"""

from .scraper import fetch_url_content, clean_html, DEFAULT_HEADERS
from .gap_engine import (
    SummaryFact,
    InformationGap,
    ConflictItem,
    OutdatedWarning,
    ChecklistItem,
    GapEngineResponse,
    prepare_source_payload,
    analyze_sources_with_gemini,
)

__all__ = [
    "fetch_url_content",
    "clean_html",
    "DEFAULT_HEADERS",
    "SummaryFact",
    "InformationGap",
    "ConflictItem",
    "OutdatedWarning",
    "ChecklistItem",
    "GapEngineResponse",
    "prepare_source_payload",
    "analyze_sources_with_gemini",
]
