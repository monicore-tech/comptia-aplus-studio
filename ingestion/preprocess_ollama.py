"""Use local Ollama to clean and compress raw PDF text before embedding."""

import ollama

SYSTEM_PROMPT = (
    "You are preprocessing CompTIA A+ study material. "
    "Extract and structure the key technical concepts, facts, specifications, and procedures. "
    "Remove page numbers, headers, footers, copyright notices, and any non-educational noise. "
    "Output concise, clean educational content. Keep all technical terms and exam-relevant details."
)


def clean_doc(content: str, model: str = "llama3.2:3b") -> str:
    """Clean and compress a raw PDF section using a local Ollama model."""
    if len(content.strip()) < 80:
        return content

    response = ollama.chat(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": content[:3500]},
        ],
        options={"num_ctx": 4096},
    )
    return response["message"]["content"]
