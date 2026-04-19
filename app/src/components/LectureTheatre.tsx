"use client";

import { use, useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  searchParamsPromise: Promise<{ topic?: string }>;
}

export default function LectureTheatre({ searchParamsPromise }: Props) {
  const { topic } = use(searchParamsPromise);
  const [lecture, setLecture] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!topic) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLecture(null);
    setError(null);
    setLoading(true);

    fetch("/api/lecture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
      signal: ctrl.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to generate lecture");
        const data = await res.json();
        setLecture(data.lecture);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [topic]);

  if (!topic) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
        Select a topic from the sidebar to begin.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">{topic}</h2>

      {loading && (
        <div className="space-y-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-zinc-800 rounded"
              style={{ width: `${70 + (i * 7) % 30}%` }}
            />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-950 border border-red-800 text-red-300 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {lecture && (
        <article className="prose prose-invert prose-zinc max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{lecture}</ReactMarkdown>
        </article>
      )}
    </div>
  );
}
