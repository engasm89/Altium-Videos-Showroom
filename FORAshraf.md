# FORAshraf.md

## Introduction

Imagine you rebuilt a university library overnight, then discovered half the shelves were cardboard cutouts with "Book Goes Here" printed on the spine. That is the story of this repo in miniature.

**EET Electronics Product Development Library** (`learn.eduengteam.com` intent) is an independent learning SPA for electronics product development workflows around Altium Designer and Altium Develop. It is *not* an Altium-branded product, *not* official documentation, and *not* a bare YouTube dump. The point is structured paths, roles, projects, and honest usage signals you can eventually take into a partnership conversation.

This file is the "coffee chat" version of how the system works, why we made the choices we did, and which landmines we already stepped on so you do not have to.

---

## Technical Architecture

Think of the app as a **museum with a front desk, galleries, and a visitor notebook**:

```
Browser (Vite SPA)
  ├─ react-router-dom  →  URL = which gallery you're in
  ├─ Views (Hero, Catalog, Paths, Roles, Tools…)
  ├─ Data modules (catalog, paths, roles, projects, shortcuts)
  └─ localStorage      →  your notebook (progress, notes, click/search logs)
```

There is **no backend** in the current MVP. Progress, bookmarks, outbound click logs, and search logs live in the visitor's browser. That is deliberate: ship a credible learning UX first; bolt on real analytics later without inventing numbers today.

**Data flow for a lesson open**

1. User lands on `/tutorials` or deep-links `/tutorials/:slug`.
2. Catalog / modal resolve the tutorial from `ALL_TUTORIALS`.
3. `isPlayableYoutubeId()` decides whether ReactPlayer embeds YouTube or shows an "enrichment pending" panel.
4. Completions / notes write through `utils/storage.ts` into `localStorage`.

**Deploy shape**

- Vite builds static assets into `dist/`.
- `vercel.json` rewrites all paths to `index.html` so deep links work after refresh.
- No secrets required for the static learning UX.

---

## Codebase Structure

| Path | Role |
|---|---|
| `src/main.tsx` | React root + `BrowserRouter` |
| `src/App.tsx` | Shell: Navbar/Footer, `Routes`, tutorial modal, progress handlers |
| `src/routes.ts` | Tab key ↔ public path map |
| `src/data/catalog.ts` | Hand-enriched tutorials + honest count helpers |
| `src/data/learningPaths.ts` / `roles.ts` / `projects.ts` / `shortcuts.ts` | Curriculum taxonomy |
| `src/utils/youtube.ts` | Playable-ID gate (rejects `eet_*` synthetics) |
| `src/utils/storage.ts` | localStorage progress + real-only logs |
| `src/utils/search.ts` | Catalog search/filter (+ logs queries) |
| `src/components/*` | Views + UI primitives (`components/ui/`) |
| `vercel.json` | SPA fallback |
| `FORAshraf.md` | You are here |

Entry flow: `index.html` → `main.tsx` → `App` routes → view components.

---

## Technologies Used

| Tech | Why |
|---|---|
| **Vite 6 + React 19 + TypeScript** | Already in the scaffold; fast SPA iteration. Rewriting to Next.js would have discarded working views for little MVP gain. |
| **Tailwind CSS v4** | Utility-first styling already wired via `@tailwindcss/vite`. |
| **react-router-dom** | Real URLs for shareable deep links and Vercel refreshes. |
| **react-player** | YouTube embeds only when IDs pass the honesty gate. |
| **lucide-react** | Icon set already used across nav/tools. |
| **localStorage** | Zero-ops progress until a real analytics stack exists. |
| **Vercel** | Static hosting + SPA rewrite. |

Optional leftovers from the AI Studio scaffold (`@google/genai`, Express, etc.) are not required for the current catalog UX.

---

## Technical Decisions

### 1. Stay on Vite instead of migrating to Next.js
**Context:** Early briefs mentioned App Router. Exploration showed a complete Vite SPA already existed.  
**Trade-off:** Less SSR/SEO out of the box vs. weeks of rewrite risk mid multi-agent scramble.  
**Decision:** Keep Vite; add client routing + honest content. Revisit SSR when content and analytics are real.

### 2. Catalog honesty over "feel big"
**Context:** `buildFull201Catalog()` synthesized ~186 fake tutorials with `eet_rec_*` youtubeIds so the UI could shout "201".  
**Trade-off:** Smaller looking catalog vs. credibility.  
**Decision:** Ship only hand-enriched entries (`ALL_TUTORIALS = TUTORIALS_CATALOG`). Keep `CATALOG_ENRICHMENT_GOAL = 201` as an explicit goal label, not a fake inventory. Players refuse non-YouTube / `eet_*` IDs.

### 3. Impact = local evidence, not theater
**Context:** Seeded outbound clicks, fake search gaps, and pre-filled completion counts looked like traction.  
**Decision:** Empty defaults. Impact dashboard labels metrics as *this browser only*. Export JSON says the same. Invented countries/visitors are banned.

### 4. Tab API preserved behind URLs
Navbar/Footer still call `setActiveTab('catalog')`. App maps that to `navigate('/tutorials')`. Less churn across many view files; URLs still work.

---

## Lessons Learned

### The Synthetic Catalog Trap
Padding to 201 with fake YouTube IDs is the fastest way to undermine the strategy "usage data is the argument." If you walk into Altium with a demo full of broken embeds, you do not look serious — you look like a prototype that lies. **Fix:** delete the synthesizer from the live path; gate playback; talk about enrichment progress openly.

### Multi-Agent Quota Burn
Several parallel agents stalled on API usage limits before finishing. Lesson: fewer, clearer ownership slices beat ten agents fighting the same files. Also: design-system work landing first was the right sequencing; routing/honesty/deploy needed a single owner.

### Deep Links Without SPA Fallback
Client routes without `vercel.json` rewrites produce 404s on refresh. Always add the catch-all rewrite the same day you add react-router.

### Seed Data Is Still a Debt
Some curated `youtubeId` values *look* like valid 11-character YouTube IDs but may not resolve to real EET videos. Format validation is necessary but not sufficient. **Next enrichment pass:** verify each ID against the actual channel / replace with confirmed URLs or mark `enrichment-pending` explicitly.

### How good engineers think here
- Prefer **boring honesty** over impressive fiction.
- Keep diffs reviewable when many agents touch one repo.
- Document the goal number; do not fake the inventory.

---

## Best Practices & Patterns

1. **One composition for hero, one job per section** — keep marketing surfaces from turning into dashboards of invented KPIs.
2. **Centralize path maps** (`routes.ts`) so nav labels and URLs cannot drift.
3. **Gate media with a helper** (`isPlayableYoutubeId`) instead of scattering `startsWith('eet')` checks.
4. **Derive counts from data** (`catalogCounts`, `LEARNING_PATHS.length`) — never hardcode `201` / `96` / `105` in UI copy.
5. **Deploy checklist:** `npm run build` → commit → push → `npx vercel --yes` / `--prod` with SPA rewrite present.
6. **Secrets:** `.env*` gitignored; `.env.example` documents optional `APP_URL` / Gemini without requiring them for static deploy.

---

## Remaining Gaps (call these out, do not hide them)

- Recover and verify real YouTube IDs / transcripts for the enrichment goal of 201.
- Replace localStorage-only Impact with privacy-respecting real analytics when traffic exists.
- Optional: SSR/meta tags per tutorial for SEO.
- Wire custom domain `learn.eduengteam.com` in Vercel + DNS.

If you remember one sentence: **this library earns trust by refusing to pretend.**
