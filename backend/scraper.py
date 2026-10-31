"""
backend/scraper.py

Scraper module using requests and BeautifulSoup for resilient URL text and metadata extraction.
"""

import logging
from typing import Dict, Any, Optional
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

logger = logging.getLogger("scraper")

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

def clean_html(html_text: str, max_chars: int = 15000) -> Dict[str, str]:
    """
    Parses HTML, strips boilerplate/navigation/script elements,
    and returns a clean title and readable text block.
    """
    soup = BeautifulSoup(html_text, "html.parser")
    
    # Strip irrelevant DOM elements
    for element in soup(["script", "style", "nav", "footer", "header", "noscript", "svg", "form", "aside"]):
        element.decompose()
        
    page_title = soup.title.string.strip() if soup.title and soup.title.string else "Untitled Document"
    
    # Extract structural textual elements
    blocks = []
    for tag in soup.find_all(["h1", "h2", "h3", "h4", "p", "li", "article", "section"]):
        text = tag.get_text(separator=" ", strip=True)
        if len(text) > 20:
            blocks.append(text)
            
    if blocks:
        combined_text = "\n".join(blocks)
    else:
        combined_text = soup.get_text(separator="\n", strip=True)

    # Normalize excessive newlines and whitespace
    lines = [line.strip() for line in combined_text.splitlines() if line.strip()]
    cleaned_content = "\n".join(lines)[:max_chars]

    return {
        "title": page_title,
        "content": cleaned_content
    }


def fetch_url_content(url: str, timeout: int = 12, max_chars: int = 15000) -> Dict[str, Any]:
    """
    Safely fetches a web page and extracts its textual content.
    """
    cleaned_url = url.strip()
    if not cleaned_url.startswith(("http://", "https://")):
        cleaned_url = f"https://{cleaned_url}"

    try:
        response = requests.get(cleaned_url, headers=DEFAULT_HEADERS, timeout=timeout)
        response.raise_for_status()
        
        parsed = clean_html(response.text, max_chars=max_chars)
        title = parsed["title"]
        if title == "Untitled Document" or not title:
            title = urlparse(cleaned_url).netloc
            
        return {
            "success": True,
            "title": title,
            "url": cleaned_url,
            "content": parsed["content"],
            "error": None
        }
    except Exception as e:
        logger.warning(f"Failed to fetch content from {cleaned_url}: {e}")
        return {
            "success": False,
            "title": urlparse(cleaned_url).netloc or cleaned_url,
            "url": cleaned_url,
            "content": "",
            "error": str(e)
        }


if __name__ == "__main__":
    test_url = "https://example.com"
    print(f"Testing scraper on {test_url}...")
    res = fetch_url_content(test_url)
    print(f"Success: {res['success']}")
    print(f"Title: {res['title']}")
    print(f"Content Preview: {res['content'][:150]}...")
