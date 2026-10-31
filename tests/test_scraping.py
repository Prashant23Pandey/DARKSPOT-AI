from __future__ import annotations

import pytest

from backend.gap_engine import prepare_source_payload
from backend.scraper import clean_html, fetch_url_content

SAMPLE_PAGES = [
    ("stem-2024.html", "STEM Scholarship Bulletin 2024", "3.5 cumulative GPA"),
    ("financial-aid-faq.html", "Financial Aid FAQ", "2025 W-2 wage statements"),
    ("archived-portal.html", "Archived Application Portal", "2023-2024"),
]


def test_clean_html_strips_boilerplate() -> None:
    html = (
        "<html><head><title>Scholarship</title></head><body>"
        "<nav>menu</nav><main><h1>Scholarship Details</h1>"
        "<p>Award amount is $5,000 per semester for eligible students.</p></main>"
        "<script>alert('x')</script><footer>footer</footer></body></html>"
    )
    parsed = clean_html(html)
    assert parsed["title"] == "Scholarship"
    assert "Award amount is $5,000" in parsed["content"]
    assert "menu" not in parsed["content"]
    assert "alert" not in parsed["content"]
    assert "footer" not in parsed["content"]


@pytest.mark.parametrize("page,title,keyword", SAMPLE_PAGES)
def test_fetch_url_content_scrapes_sample_scholarship_url(
    sample_site_server: str, page: str, title: str, keyword: str
) -> None:
    result = fetch_url_content(f"{sample_site_server}/{page}")

    assert result["success"] is True
    assert result["title"] == title
    assert keyword in result["content"]
    assert result["error"] is None


def test_prepare_source_payload_combines_urls_and_text(
    sample_site_server: str,
) -> None:
    sources = prepare_source_payload(
        urls=[f"{sample_site_server}/stem-2024.html"],
        raw_texts=["Pasted note: the application deadline is June 1."],
    )

    assert [source["id"] for source in sources] == ["Source 1", "Source 2"]
    assert sources[0]["type"] == "URL"
    assert sources[0]["origin"].endswith("/stem-2024.html")
    assert "STEM Excellence Scholarship" in sources[0]["content"]
    assert sources[1]["type"] == "TEXT"
    assert sources[1]["origin"] == "User Raw Input"


def test_prepare_source_payload_reports_failed_url(sample_site_server: str) -> None:
    sources = prepare_source_payload(
        urls=[f"{sample_site_server}/does-not-exist.html"],
    )

    assert len(sources) == 1
    assert sources[0]["id"] == "Source 1"
    assert sources[0]["type"] == "URL_ERROR"
    assert "Fetch Failed" in sources[0]["content"]
