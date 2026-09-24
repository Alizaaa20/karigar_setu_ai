# Karigar Setu — SIH 26090 MVP

AI-driven market linkage & smart cataloging app for marginalized artisans.
5-day internal-demo build: React + Tailwind frontend (styled as a mobile
app), Node/Express backend, Groq-hosted Llama-3 for catalog generation.

## What's real vs. mocked (know this cold for Q&A)

| Module | Status | Notes |
|---|---|---|
| B — Voice-to-Catalog | **Real** | Native browser Web Speech API captures speech client-side; transcript is sent to a real backend endpoint. |
| C — RAG Pricing + Listing Gen | **Real** | Backend does keyword retrieval over a mock cost DB, then calls Groq's Llama-3.3-70B with that baseline injected into the prompt to stop price hallucination. Swap the mock DB for a real vector store (Chroma/Pinecone) later without touching the prompt logic. |
| A — Edge AI background removal | **Mocked** | Fake device-check log + 2s delay + placeholder "cleaned" image. No on-device model runs. Documented in code as a clearly-labeled stand-in (`ImageUploadMock.jsx`). |
| D — SMS/Twilio offline fallback | **Mocked** | Toggling "Offline Mode" and submitting shows a toast; no SMS is actually sent, no backend call is made. |

Being upfront about this split is a strength, not a weakness — a jury at
an internal demo will trust a team more if they can clearly say "this part
is a real working pipeline, this part is a UX mock we'll build out next"
rather than pretending everything is production-ready.

## Architecture

```
Browser (Web Speech API)
      │  transcript
      ▼
POST /api/generate-listing  ──▶  keyword match against MOCK_VECTOR_DB (Module C retrieval)
      │                                   │
      │                          baseline_cost, category
      ▼                                   │
Groq API (Llama-3.3-70B) ◀────────────────┘   (baseline injected into prompt to anchor price)
      │  { title, seo_description, suggested_price, category }
      ▼
Catalog Card rendered in the app
```

If the Groq call fails or `GROQ_API_KEY` isn't set, the backend silently
falls back to a deterministic rule-based generator (`generateFallbackListing`
in `server.js`) so a flaky venue wifi or an exhausted free-tier quota can
never break the live demo — you just lose the "real AI" polish for that
one request. Keep this for the demo; strip it for production.

## Setup

Requires **Node.js ≥ 18** (for native `fetch` in the backend).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and paste a free key from https://console.groq.com/keys
npm run dev      # or: npm start
```

Runs on `http://localhost:5000`. Sanity check: `GET /api/health` should
return `{ status: "ok", groqConfigured: true }`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # only needed if your backend isn't on localhost:5000
npm run dev
```

Runs on `http://localhost:5173`. Open it in **Chrome or Edge** — the Web
Speech API isn't supported in Firefox/Safari, and the mic button will
gracefully disable itself with a note telling the presenter to type instead.

> **Mic permission note:** browsers only allow microphone access on
> `localhost` or `https://` origins. If you deploy the frontend for the
> demo (e.g. Vercel/Netlify), it'll work fine since those are HTTPS. Don't
> serve it over plain `http://` on a LAN IP or the mic button will silently
> fail permission checks.

## Suggested demo script (~90 seconds)

1. Tap **Tap to Speak**, say the Hindi/English example line, watch the
   transcript box fill in live — call out that it's editable if the mic
   mishears something.
2. Tap **Upload Product Photo**, narrate the fake system log as it scrolls
   ("this is where our on-device Edge AI model will run — for the demo
   we're showing the target UX"), point at the before/after thumbnails.
3. Tap **Submit & Generate Listing** — while it loads, explain the RAG
   anchoring: "the AI isn't guessing the price out of thin air, it's
   constrained to a verified baseline cost we retrieved for pashmina."
4. Point at the generated card's price-anchoring line (`Anchored to
   verified baseline: ₹400`) as the anti-hallucination proof point.
5. Flip **Offline Mode** on, tap Submit again, show the SMS-fallback toast
   — "and if there's no connectivity at all, the same payload gets queued
   for an SMS webhook instead of failing silently."

## Post-MVP roadmap (good slide for "future scope")

- Replace `MOCK_VECTOR_DB` with a real embeddings store populated from
  actual artisan cooperative cost sheets.
- Replace the Module A mock with an on-device TFLite/ONNX background-removal
  model (or a lightweight server-side one behind the same UI contract).
- Wire Module D to a real Twilio SMS webhook and a queue/retry worker.
- Add multi-language UI (the current copy is English; artisans speak
  Hindi/regional languages — consider `react-i18next`).
- Persist listings to a database (Mongo, given this is a MERN brief) instead
  of holding the result only in frontend state.
