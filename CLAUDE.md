# CompTIA A+ AI Studio

## What this is
AI-powered CompTIA A+ study platform that generates RAG-based lectures from the Mike Meyers textbook and official CompTIA objectives, with user auth and progress tracking.

## Stack
- Next.js 16 App Router, TypeScript strict, Tailwind v4
- Supabase (Auth + Postgres + pgvector for vector search)
- Google Gemini (`gemini-embedding-001` for embeddings, `gemini-1.5-flash` for generation)
- Python ingestion pipeline (`ebooklib`, `pypdf`, `google-genai`, `supabase`)
- Deployed on Vercel (auto-deploy on push to master)

## Key files
- `app/src/lib/rag.ts` — RAG pipeline: embed query → pgvector search → Gemini generation
- `app/src/lib/supabase.ts` — browser Supabase client
- `app/src/lib/supabase-server.ts` — server Supabase client (uses `next/headers`)
- `app/src/lib/database.types.ts` — TypeScript types for all Supabase tables and RPCs
- `app/src/proxy.ts` — auth guard (Next.js 16 replacement for `middleware.ts`)
- `app/src/app/api/lecture/route.ts` — `POST /api/lecture`, auth-protected
- `app/src/components/Sidebar.tsx` — domain navigation (Core 1 + Core 2)
- `app/src/components/LectureTheatre.tsx` — markdown lecture renderer
- `ingestion/build_index.py` — main ingestion entrypoint
- `ingestion/chunk_embed.py` — chunking + Gemini embeddings (0.65s delay for free tier)

## Current state
- Part 1 complete and live at https://comptia-aplus-studio.vercel.app
- Auth (login/signup), RAG endpoint, sidebar, and lecture UI all working
- Ingestion in progress — rate limit tuning for Gemini free tier (100 req/min)
- Parts 2–4 (quizzes, notes, export, 3D hardware) not yet started

## Conventions
- `proxy.ts` not `middleware.ts` — Next.js 16 renamed middleware to proxy
- Tailwind v4 uses `@plugin` in CSS files, there is no `tailwind.config.ts`
- Split Supabase clients: `supabase.ts` for client components, `supabase-server.ts` for server
- Embeddings are 768-dim (gemini-embedding-001) — Supabase `documents` table must match
- Ingestion reads env from `app/.env.local`, not `.env.local` at root
- Always read `node_modules/next/dist/docs/` before assuming Next.js API behaviour
