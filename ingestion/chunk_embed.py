"""Chunk text into ~500-token pieces with overlap, then embed via OpenAI."""

import os
import tiktoken

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


def embed_texts(texts: list[str], client) -> list[list[float]]:
    """Embed a list of texts using OpenAI text-embedding-3-small."""
    # Process in batches of 100 to stay within API limits
    all_embeddings = []
    for i in range(0, len(texts), 100):
        batch = texts[i : i + 100]
        response = client.embeddings.create(
            model="text-embedding-3-small", input=batch
        )
        all_embeddings.extend([e.embedding for e in response.data])
    return all_embeddings
