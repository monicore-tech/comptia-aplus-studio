import { NextResponse } from "next/server";
import { generateLecture } from "@/lib/rag";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let topic: string;
  try {
    const body = await request.json();
    topic = body.topic;
    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "topic is required" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const lecture = await generateLecture(topic.trim());
    return NextResponse.json({ lecture });
  } catch (err) {
    console.error("[/api/lecture]", err);
    return NextResponse.json(
      { error: "Failed to generate lecture" },
      { status: 500 }
    );
  }
}
