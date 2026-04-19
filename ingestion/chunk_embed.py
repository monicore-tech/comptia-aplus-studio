"""Chunk text into ~500-token pieces with overlap, then embed via Google Gemini."""

import time
import tiktoken
from google import genai
from google.genai import errors

ENCODING = tiktoken.get_encoding("cl100k_base")
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50


def chunk_text(text: str) -> list[str]:
    tokens = ENCODING.encode(text)
    chunks = []
    start = 0
    while start < len(tokens):
        end = min(start + CHUNK_SIZE, len(tokens))
        chunks.append(ENCODING.decode(tokens[start:end]))
        start += CHUNK_SIZE - CHUNK_OVERLAP
    return chunks


def embed_single(client, text: str) -> list[float]:
    delay = 1.0
    for attempt in range(6):
        try:
            result = client.models.embed_content(
                model="models/gemini-embedding-001",
                contents=text,
            )
            return result.embeddings[0].values
        except errors.ClientError as e:
            if "429" in str(e) and attempt < 5:
                print(f"\n  Rate limited — waiting {delay:.0f}s…")
                time.sleep(delay)
                delay *= 2
            else:
                raise


def embed_texts(texts: list[str], api_key: str) -> list[list[float]]:
    """Embed texts via Gemini (768-dim, matches query-time embeddings in rag.ts)."""
    client = genai.Client(api_key=api_key)
    all_embeddings = []
    for text in texts:
        all_embeddings.append(embed_single(client, text))
        time.sleep(0.65)  # ~92 req/min — safely under 100 req/min free tier limit
    return all_embeddings
