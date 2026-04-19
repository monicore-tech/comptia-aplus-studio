"""Chunk text into ~500-token pieces with overlap, then embed via Google Gemini."""

import tiktoken
import google.generativeai as genai
import time

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


def embed_texts(texts: list[str], api_key: str) -> list[list[float]]:
    """Embed a list of texts using Gemini text-embedding-004 (768 dims)."""
    genai.configure(api_key=api_key)
    all_embeddings = []
    # Free tier: 100 requests/min — embed one at a time with small delay
    for text in texts:
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document",
        )
        all_embeddings.append(result["embedding"])
        time.sleep(0.1)  # stay within free tier rate limits
    return all_embeddings
