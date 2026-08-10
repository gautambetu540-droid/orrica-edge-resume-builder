# Orrica Edge Resume Builder

An AI-powered resume builder: Next.js 14 (App Router) + TypeScript + Tailwind + shadcn-style UI + Supabase (auth/db) + OpenAI (server-side only) + Puppeteer PDF export.

> **Note on where this was built:** this codebase was written in a sandbox with no network access, so dependencies were never `npm install`ed or run here. The code is complete and internally consistent, but you should expect the very first `npm install && npm run dev` to surface a small number of normal integration issues (a missing peer dep, a version bump, a typo) — treat this as a strong, real starting point rather than a guaranteed zero-error build.

## 1. Install

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API (keep secret, not currently used client-side) |
| `OPENAI_API_KEY` | platform.openai.com → API keys |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally |

## 2. Database

In the Supabase SQL editor, run `supabase/migrations/0001_init.sql`. This creates `profiles`, `resumes`, `resume_versions`, indexes, RLS policies, and the trigger that auto-creates a profile row on signup.

In Supabase Auth settings, enable **Email** and **Google** providers, and add `http://localhost:3000/auth/callback` (and your production URL equivalent) as a redirect URL.

## 3. Run

```bash
npm run dev
```

## 4. PDF generation (important)

`/api/resume/[id]/pdf` uses `puppeteer-core` + `@sparticuz/chromium` to render `/resume/[id]/print` headlessly and produce a real PDF.

- **Local dev:** serverless Chromium binaries don't always run cleanly on a dev machine. Set `CHROME_EXECUTABLE_PATH` in `.env.local` to a local Chrome/Chromium install (e.g. `/usr/bin/chromium` or the path from `which google-chrome`) to use that instead.
- **Deploying to Vercel:** `@sparticuz/chromium` is designed for this — no extra config needed beyond enough function memory/timeout (this route sets `maxDuration = 60`; on Vercel Pro+ you can raise it further if resumes are very long).
- **Deploying to a normal Node server:** either set `CHROME_EXECUTABLE_PATH` to a system Chrome, or swap to full `puppeteer` (which bundles Chromium) instead of `puppeteer-core`.

## 5. What's implemented

Every button in this build is wired to real functionality — no "Coming soon" placeholders:

- Landing page, template gallery, wizard onboarding (with local-draft-before-signup), full split-view editor (desktop) / tabbed editor (mobile), live preview with zoom/fit, drag-and-drop section manager, typography/spacing/color customization, autosave, dashboard (create/duplicate/delete/download), Supabase auth (Google + email), 6 resume templates (2 distinct layout engines: single-column and sidebar two-column, each with 6 distinct typographic presets), all 6 AI endpoints (generate-resume, improve-section, generate-summary, generate-bullets, job-match, suggest-skills) with rate limiting + no-fabrication system prompts, and real PDF/print export.

## 6. Extending templates

Each template is a `(layout, preset)` pair defined in `lib/templates/presets.ts`. To add a genuinely new visual layout (not just a new color/typography preset), create a new component in `components/templates/layouts/`, wire it into `components/templates/ResumeDocument.tsx`, and add a `layout` value to `TemplateLayout`.

## 7. Branding

The Orrica Edge logo (background removed, `public/logo-orricaedge.png`) is used in the site header/footer (`components/landing/SiteHeader.tsx`, dashboard/settings headers) and as a small "Made with Orrica Edge" credit at the bottom of the resume document only (`components/templates/BrandFooter.tsx`) — it does not appear inside the app's own editor chrome.

## Orrica Edge account persistence, My Activity & daily limit

- Accounts use Supabase Auth. Once a user signs in, the Supabase SSR session cookie keeps them signed in across visits until they sign out or the session expires.
- `/activity` shows every saved resume, completion percentage, status, next section, and last saved time.
- New resume creation is limited server-side to 2 per India calendar day (Asia/Kolkata), including duplication.
- Apply `supabase/migrations/0002_daily_resume_quota.sql` in the Supabase SQL editor (or run your normal Supabase migration flow) before deploying the updated app.
