"use client";

import { use, useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const DOMAIN_LABELS: Record<string, string> = {
  "1.0": "Mobile Devices",
  "2.0": "Networking",
  "3.0": "Hardware",
  "4.0": "Virtualization & Cloud Computing",
  "5.0": "Hardware & Network Troubleshooting",
  "6.0": "Operating Systems",
  "7.0": "Security",
  "8.0": "Software Troubleshooting",
  "9.0": "Operational Procedures",
};

interface Props {
  searchParamsPromise: Promise<{ domain?: string }>;
}

export default function LectureTheatre({ searchParamsPromise }: Props) {
  const { domain } = use(searchParamsPromise);
  const [lecture, setLecture] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!domain) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLecture(null);
    setError(null);
    setLoading(true);

    fetch("/api/lecture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: DOMAIN_LABELS[domain] ?? domain }),
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
  }, [domain]);

  if (!domain) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
        Select a domain from the sidebar.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        {DOMAIN_LABELS[domain] ?? domain}
      </h2>

      {loading && (
        <div className="space-y-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-zinc-800 rounded"
              style={{ width: `${70 + Math.random() * 30}%` }}
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
