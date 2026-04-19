"""
Main ingestion script. Parses source files, chunks, embeds, and upserts to Supabase pgvector.

Usage:
    python build_index.py --epub "../data/meyers.epub" --pdfs "../data/core1.pdf" "../data/core2.pdf"
"""

import argparse
import os
import uuid
from dotenv import load_dotenv
from supabase import create_client
from tqdm import tqdm

from parse_epub import extract_epub
from parse_pdfs import extract_pdf
from chunk_embed import chunk_text, embed_texts

load_dotenv("../app/.env.local")

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_KEY = os.environ["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
GOOGLE_API_KEY = os.environ["GOOGLE_API_KEY"]


def upsert_documents(docs: list[dict], supabase) -> None:
    rows = []
    for doc in tqdm(docs, desc="Chunking & embedding"):
        chunks = chunk_text(doc["content"])
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
        batch = rows[i : i + 50]
        supabase.table("documents").upsert(batch).execute()
        print(f"  {min(i + 50, len(rows))}/{len(rows)}")

    print("Done.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build Supabase vector index")
    parser.add_argument("--epub", type=str, help="Path to Mike Meyers EPUB")
    parser.add_argument("--pdfs", nargs="+", help="Paths to CompTIA PDF files")
    args = parser.parse_args()

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    all_docs: list[dict] = []

    if args.epub:
        print(f"Parsing EPUB: {args.epub}")
        all_docs.extend(extract_epub(args.epub))

    if args.pdfs:
        for pdf_path in args.pdfs:
            label = "comptia-core1" if "1101" in pdf_path else "comptia-core2"
            print(f"Parsing PDF: {pdf_path} ({label})")
            all_docs.extend(extract_pdf(pdf_path, label))

    if not all_docs:
        print("No documents to process. Pass --epub and/or --pdfs.")
        return

    print(f"Total documents: {len(all_docs)}")
    upsert_documents(all_docs, supabase)


if __name__ == "__main__":
    main()
