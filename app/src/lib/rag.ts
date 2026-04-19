import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
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
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY,
  });
  return embeddings.embedQuery(text);
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

  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.4,
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await llm.invoke([
    { role: "system", content: LECTURE_SYSTEM_PROMPT },
    {
      role: "user",
      content: `Topic: ${topic}\n\nSource excerpts:\n\n${context}`,
    },
  ]);

  return response.content as string;
}
