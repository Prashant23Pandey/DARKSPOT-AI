"""Scrape the bundled sample scholarship pages and write a JSON report."""

from __future__ import annotations

import functools
import json
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.gap_engine import prepare_source_payload
from backend.scraper import fetch_url_content

SITE_DIR = Path(__file__).resolve().parents[1] / "tests" / "fixtures" / "sample_site"
OUTPUT = Path(__file__).resolve().parents[1] / "artifacts" / "scrape_report.json"
PAGES = ("stem-2024.html", "financial-aid-faq.html", "archived-portal.html")


class _QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args: object) -> None:
        pass


def main() -> int:
    handler = functools.partial(_QuietHandler, directory=str(SITE_DIR))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    try:
        host, port = server.server_address
        base_url = f"http://{host}:{port}"
        urls = [f"{base_url}/{page}" for page in PAGES]
        results = [fetch_url_content(url) for url in urls]
        sources = prepare_source_payload(urls=urls, raw_texts=[])
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)

    report = {
        "sample_site": str(SITE_DIR),
        "urls": urls,
        "scraped": [
            {
                "url": result["url"],
                "success": result["success"],
                "title": result["title"],
                "chars": len(result["content"]),
                "preview": result["content"][:240],
                "error": result["error"],
            }
            for result in results
        ],
        "source_ids": [source["id"] for source in sources],
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    for item in report["scraped"]:
        status = "OK" if item["success"] else "FAIL"
        print(f"[{status}] {item['title']} ({item['chars']} chars) <- {item['url']}")
    print(f"report: {OUTPUT}")
    return 0 if all(item["success"] for item in report["scraped"]) else 1


if __name__ == "__main__":
    raise SystemExit(main())
