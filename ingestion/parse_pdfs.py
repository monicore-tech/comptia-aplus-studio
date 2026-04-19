"""Extract text from CompTIA exam objective PDFs using pypdf."""

import re
from pathlib import Path
from pypdf import PdfReader


def extract_pdf(pdf_path: str, source_label: str) -> list[dict]:
    """Return list of {title, content, source} dicts, one per section."""
    reader = PdfReader(pdf_path)
    sections = []
    current_title = Path(pdf_path).stem
    current_lines: list[str] = []

    for page in reader.pages:
        text = page.extract_text() or ""
        for line in text.split("\n"):
            stripped = line.strip()
            if not stripped:
                continue
            if re.match(r"^\d+\.\d+\s", stripped) and len(stripped) < 120:
                if current_lines:
                    sections.append({
                        "title": current_title,
                        "content": "\n".join(current_lines),
                        "source": source_label,
                    })
                current_title = stripped
                current_lines = []
            else:
                current_lines.append(stripped)

    if current_lines:
        sections.append({
            "title": current_title,
            "content": "\n".join(current_lines),
            "source": source_label,
        })

    return [s for s in sections if len(s["content"]) > 100]


if __name__ == "__main__":
    import sys, json
    path = sys.argv[1] if len(sys.argv) > 1 else "../data/core1.pdf"
    sections = extract_pdf(path, "comptia-objectives")
    print(f"Extracted {len(sections)} sections")
    print(json.dumps(sections[0], indent=2)[:500])
