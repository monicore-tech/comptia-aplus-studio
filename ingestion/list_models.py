"""Quick script to list available embedding models on this API key."""
import os
from dotenv import load_dotenv
from google import genai

load_dotenv("../app/.env.local")
client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

print("Available embedding models:")
for m in client.models.list():
    if "embed" in m.name.lower():
        print(" ", m.name)
