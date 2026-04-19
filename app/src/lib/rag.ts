import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServerSupabaseClient } from "./supabase-server";


const LECTURE_SYSTEM_PROMPT = `You are an expert CompTIA A+ instructor creating engaging study lectures.
You receive relevant excerpts from the Mike Meyers CompTIA A+ book and official CompTIA objectives.
Your task: write a clear, thorough, and engaging lecture on the requested topic.

Rules:
- Ground EVERY claim in the provided source excerpts. Never invent details.
- Use plain English. Explain acronyms on first use.
- Structure with ## headings, bullet points, and code blocks where relevant.
- End with a "Key Takeaways" section (3–5 bullets).
- Tone: knowledgeable but approachable — like a great teacher, not a textbook.`;

async function embedQuery(text: string): Promise<number[]> {
  const res = await fetch("https://api-atlas.nomic.ai/v1/embedding/text", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NOMIC_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "nomic-embed-text-v1.5", texts: [text] }),
  });
  if (!res.ok) throw new Error(`Nomic embed failed: ${res.statusText}`);
  const data = await res.json();
  return data.embeddings[0];
}

export async function generateLecture(topic: string): Promise<string> {
  const supabase = await createServerSupabaseClient();
  const queryEmbedding = await embedQuery(topic);

  const { data: docs, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: 8,
  });

  if (error) throw new Error(`Vector search failed: ${error.message}`);

  const context = (docs ?? [])
    .map((d: { content: string }) => d.content)
    .join("\n\n---\n\n");

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const response = await model.generateContent(
    `${LECTURE_SYSTEM_PROMPT}\n\nTopic: ${topic}\n\nSource excerpts:\n\n${context}`
  );

  return response.response.text();
}
