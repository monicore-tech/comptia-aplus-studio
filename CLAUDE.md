# CompTIA A+ AI Studio — CLAUDE.md

## What this project is
An AI-powered CompTIA A+ study platform. Users log in, pick a domain from the sidebar, and get a RAG-generated lecture sourced from the Mike Meyers EPUB and CompTIA objective PDFs. Built as a portfolio piece and real study tool.

## Repo structure
```
/
  app/              # Next.js 16 App Router — frontend + API routes (deployed to Vercel)
  ingestion/        # Python scripts — parse EPUB/PDFs and upsert to Supabase pgvector
  docs/             # Objective mapping notes
  vercel.json       # Vercel build config (root dir set to app/ in Vercel dashboard)
```

## Stack
- **Frontend/API**: Next.js 16 App Router, TypeScript strict, Tailwind v4
- **Auth + DB**: Supabase (Auth + Postgres + pgvector)
- **Embeddings**: Google Gemini `gemini-embedding-001` (768-dim, free tier)
- **Generation**: Google Gemini `gemini-1.5-flash` (free tier)
- **Ingestion**: Python — `ebooklib`, `pypdf`, `google-genai`, `supabase`
- **Deployment**: Vercel (auto-deploy on push to master)

## Key files
| File | Purpose |
|---|---|
| `app/src/lib/rag.ts` | RAG pipeline — embed query → Supabase vector search → Gemini generation |
| `app/src/lib/supabase.ts` | Browser Supabase client |
| `app/src/lib/supabase-server.ts` | Server Supabase client (uses next/headers) |
| `app/src/lib/database.types.ts` | TypeScript types for Supabase schema |
| `app/src/proxy.ts` | Next.js 16 auth guard (replaces middleware.ts) |
| `app/src/app/api/lecture/route.ts` | POST /api/lecture — requires auth |
| `app/src/components/Sidebar.tsx` | Domain navigation (Core 1 + Core 2) |
| `app/src/components/LectureTheatre.tsx` | Markdown lecture renderer |
| `ingestion/build_index.py` | Main ingestion entrypoint |
| `ingestion/chunk_embed.py` | Chunking + Gemini embedding (0.65s delay for free tier) |

## Environment variables
Stored in `app/.env.local` (local) and Vercel dashboard (production):
```
GOOGLE_API_KEY                   # Google AI Studio — embeddings + generation
NEXT_PUBLIC_SUPABASE_URL         # https://bmbztprsxonpbjwvyuwc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY    # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY        # Not yet captured (eye icon bug) — not needed for Part 1
```

## Supabase schema
```sql
-- Auth: managed by Supabase
-- Vector search
documents (id, content, title, source, embedding vector(768))
-- User data
user_progress (id, user_id, domain, attempts, correct, mastery_pct, updated_at)
user_notes    (id, user_id, topic, content, updated_at)
-- RPC
match_documents(query_embedding vector(768), match_count int) → similarity search
```

## Running ingestion (one-time, run locally)
```powershell
cd ingestion
python build_index.py `
  --epub "../_OceanofPDF.com_CompTIA_A_Certification_All-in-One_Exam_Guide_Eleventh_Edition_-_Mike_Meyer.epub" `
  --pdfs "../CompTIA-A-220-1101-Exam-Objectives-3.0-1.pdf" "../CompTIA-A-220-1102-Exam-Objectives.pdf"
```
Rate limit: 100 req/min free tier → script sleeps 0.65s between embeds (~4 min total).

## Next.js 16 gotchas
- `middleware.ts` is **deprecated** — use `proxy.ts` with named `proxy` export
- Tailwind v4 uses `@plugin` in CSS, not `tailwind.config.ts`
- Always read `node_modules/next/dist/docs/` before assuming API behaviour

---

## Project roadmap

### Part 1 — Foundation ✅ COMPLETE
- [x] Monorepo scaffold (Next.js 16 + Tailwind v4 + TypeScript strict)
- [x] Supabase Auth — login/signup pages + proxy route protection
- [x] Supabase pgvector schema (documents, user_progress, user_notes)
- [x] RAG pipeline (Gemini embeddings + gemini-1.5-flash generation)
- [x] `/api/lecture` endpoint (auth-protected)
- [x] Sidebar + LectureTheatre dark-mode UI
- [x] Python ingestion scripts (EPUB + PDF → pgvector)
- [x] Deployed to Vercel at https://comptia-aplus-studio.vercel.app
- [ ] Ingestion run completed (in progress — rate limit tuning)

### Part 2 — Study Core (next)
- [ ] `JottingSidebar.tsx` — rich text notes saved to `user_notes` (Supabase)
- [ ] `POST /api/quiz` — Gemini-generated MCQs from retrieved chunks
- [ ] `QuizModal.tsx` — question/answer UI with instant feedback
- [ ] Write quiz results to `user_progress`
- [ ] `ProgressDashboard.tsx` — domain mastery bars
- [ ] `POST /api/flashcards` + flashcard review UI

### Part 3 — Export & Polish
- [ ] `POST /api/export/pdf` — lecture → PDF download
- [ ] `POST /api/export/csv` — flashcards → Anki CSV
- [ ] Framer Motion animations
- [ ] User menu (avatar + logout in header)
- [ ] Mobile-responsive layout pass
- [ ] Loading skeletons + error states

### Part 4 — 3D Hardware (last)
- [ ] React Three Fiber PC/motherboard scene
- [ ] Hover-triggered flashcard hotspots
- [ ] Click-to-Identify quiz mode on 3D scene
