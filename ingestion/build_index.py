"""
Main ingestion script. Parses PDFs, cleans via Ollama, embeds via Gemini, upserts to Supabase.

Pipeline:
    PDF → pypdf extracts text → Ollama cleans/compresses → Gemini embeds → Supabase pgvector

Usage:
    python build_index.py --pdfs "../data/core1.pdf" "../data/core2.pdf"
"""

import argparse
import os
import uuid
from dotenv import load_dotenv
from supabase import create_client
from tqdm import tqdm

from parse_pdfs import extract_pdf
from preprocess_ollama import clean_doc
from chunk_embed import chunk_text, embed_texts

load_dotenv("../app/.env.local")

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_KEY = os.environ["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
GOOGLE_API_KEY = os.environ["GOOGLE_API_KEY"]


def upsert_documents(docs: list[dict], supabase) -> None:
    rows = []
    for doc in tqdm(docs, desc="Cleaning → Embedding"):
        cleaned = clean_doc(doc["content"])
        chunks = chunk_text(cleaned)
        embeddings = embed_texts(chunks, GOOGLE_API_KEY)
        for chunk, embedding in zip(chunks, embeddings):
            rows.append({
                "id": str(uuid.uuid4()),
                "content": chunk,
                "title": doc["title"],
                "source": doc["source"],
                "embedding": embedding,
            })

    print(f"Upserting {len(rows)} chunks to Supabase…")
    for i in range(0, len(rows), 50):
        batch = rows[i: i + 50]
        supabase.table("documents").upsert(batch).execute()
        print(f"  {min(i + 50, len(rows))}/{len(rows)}")

    print("Done.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build Supabase vector index")
    parser.add_argument("--pdfs", nargs="+", help="Paths to PDF files")
    args = parser.parse_args()

    if not args.pdfs:
        print("No documents to process. Pass --pdfs.")
        return

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    all_docs: list[dict] = []

    for pdf_path in args.pdfs:
        if "1101" in pdf_path:
            label = "comptia-core1"
        elif "1102" in pdf_path:
            label = "comptia-core2"
        elif "1201" in pdf_path:
            label = "messer-core1"
        elif "1202" in pdf_path:
            label = "messer-core2"
        else:
            label = "meyers-textbook"
        print(f"Parsing PDF: {pdf_path} ({label})")
        all_docs.extend(extract_pdf(pdf_path, label))

    print(f"Total sections: {len(all_docs)}")
    upsert_documents(all_docs, supabase)


if __name__ == "__main__":
    main()
