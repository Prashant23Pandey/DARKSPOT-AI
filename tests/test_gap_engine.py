from __future__ import annotations

import json

from backend.gap_engine import (
    GapEngineResponse,
    analyze_sources_with_gemini,
    prepare_source_payload,
)

DEMO_TEXTS = [
    (
        "Scholarship Office Bulletin: Eligibility requires a minimum 3.5 cumulative "
        "GPA and full-time enrollment. Award covers $5,000 disbursed per semester. "
        "Verification requires official 2024 Federal Tax Returns by June 1."
    ),
    (
        "Financial Aid FAQ: To qualify for the merit award, recipients must maintain "
        "a 3.5 GPA. Applicants must submit official 2025 W-2 wage statements."
    ),
    (
        "Archived Application Portal: Application cycle 2023-2024 has closed. All "
        "submissions must have been completed prior to March 15, 2023."
    ),
]


def _demo_sources() -> list[dict[str, str]]:
    return prepare_source_payload(urls=[], raw_texts=DEMO_TEXTS)


def test_mock_analysis_returns_full_blueprint_schema() -> None:
    response = analyze_sources_with_gemini(_demo_sources(), api_key=None)

    assert isinstance(response, GapEngineResponse)
    payload = response.model_dump()
    assert set(payload) == {
        "structured_summary",
        "information_gaps",
        "conflicts",
        "outdated_warnings",
        "verification_checklist",
    }
    assert payload["structured_summary"]
    assert payload["information_gaps"]
    assert payload["conflicts"]
    assert payload["outdated_warnings"]
    assert payload["verification_checklist"]


def test_mock_mode_is_deterministic_and_serializable() -> None:
    first = analyze_sources_with_gemini(_demo_sources(), api_key=None).model_dump()
    second = analyze_sources_with_gemini(_demo_sources(), api_key=None).model_dump()

    assert first == second
    assert json.loads(json.dumps(first)) == first


def test_blank_texts_are_ignored() -> None:
    sources = prepare_source_payload(
        urls=[],
        raw_texts=["  ", "\n\t", DEMO_TEXTS[0]],
    )

    assert len(sources) == 1
    assert sources[0]["type"] == "TEXT"
    assert "3.5 cumulative GPA" in sources[0]["content"]


def test_empty_input_returns_empty_payload() -> None:
    assert prepare_source_payload(urls=[], raw_texts=[]) == []


def test_mock_analysis_cites_existing_source_ids() -> None:
    sources = _demo_sources()
    payload = analyze_sources_with_gemini(sources, api_key=None).model_dump()
    valid_ids = {source["id"] for source in sources}

    for fact in payload["structured_summary"]:
        assert set(fact["sources"]) <= valid_ids
    for conflict in payload["conflicts"]:
        assert set(conflict["sources"]) <= valid_ids
    for warning in payload["outdated_warnings"]:
        assert warning["source"] in valid_ids
