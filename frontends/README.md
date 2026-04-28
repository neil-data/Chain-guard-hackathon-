# ChainGuard Frontend

This Next.js app now contains the full deployable stack for Vercel:

- frontend UI
- server-side route analysis engine
- server-side LLM briefing endpoint

## Environment

Create `.env.local` from `.env.example`.

Required for live LLM briefings:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Without `GROQ_API_KEY`, the app still works and returns a deterministic fallback captain briefing.

## Local run

```bash
npm install
npm run dev
```

## Vercel deploy

Deploy the repository to Vercel. The root `vercel.json` is configured to build the Next app from `frontends/`, so no separate Python backend is required.
