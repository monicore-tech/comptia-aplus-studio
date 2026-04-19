"""Extract text from Mike Meyers EPUB, chapter by chapter."""

import re
from pathlib import Path
from ebooklib import epub, ITEM_DOCUMENT
from bs4 import BeautifulSoup


def extract_epub(epub_path: str) -> list[dict]:
    """Return list of {title, content} dicts, one per chapter."""
    book = epub.read_epub(epub_path)
    chapters = []

    for item in book.get_items_of_type(ITEM_DOCUMENT):
        soup = BeautifulSoup(item.get_content(), "html.parser")
        title_tag = soup.find(["h1", "h2"])
        title = title_tag.get_text(strip=True) if title_tag else item.get_name()
        text = soup.get_text(separator="\n", strip=True)
        text = re.sub(r"\n{3,}", "\n\n", text)
        if len(text) > 200:
            chapters.append({"title": title, "content": text, "source": "meyers-book"})

    return chapters


if __name__ == "__main__":
    import sys, json

    path = sys.argv[1] if len(sys.argv) > 1 else "../data/meyers.epub"
    chapters = extract_epub(path)
    print(f"Extracted {len(chapters)} chapters")
    print(json.dumps(chapters[0], indent=2)[:500])
