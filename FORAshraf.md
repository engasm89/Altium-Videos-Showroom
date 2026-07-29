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
  ├─ localStorage      →  your notebook (progress, notes, click/search logs)
  └─ /api/feedback     →  optional central tutorial feedback (webhook / Resend / GitHub)
```

Progress, bookmarks, outbound click logs, and search logs still live in the visitor's browser. **Tutorial feedback is the exception:** it POSTs to a Vercel function (or `VITE_FEEDBACK_ENDPOINT`) so curriculum signal is not trapped in one laptop's localStorage.

**Data flow for a lesson open**

1. User lands on `/tutorials` or deep-links `/tutorials/:slug`.
2. Catalog / modal resolve the tutorial from `ALL_TUTORIALS`.
3. `isPlayableYoutubeId()` decides whether ReactPlayer embeds YouTube or shows an "enrichment pending" panel.
4. Completions / notes write through `utils/storage.ts` into `localStorage`.

**Deploy shape**

- Vite builds static assets into `dist/`.
- `vercel.json` rewrites SPA paths to `index.html` (excluding `/api/*`) so deep links work after refresh.
- Optional secrets for feedback backends; learning UX still works without them (submit shows a clear error until configured).

---

## Codebase Structure

| Path | Role |
|---|---|
| `src/main.tsx` | React root + `BrowserRouter` |
| `src/App.tsx` | Shell: Navbar/Footer, `Routes`, tutorial modal, progress handlers |
| `src/routes.ts` | Tab key ↔ public path map |
| `src/data/catalog.ts` + `catalog.generated.json` | Imported MD→CSV catalog (333 rows) + enrichment overlays + honest counts |
| `src/data/developEnrichment.overlay.json` | Strategic ~29 Altium Develop enrichments (`enrichment_status=enriched`) with outcomes, chapters, outline transcripts, steps, docs, next-lesson links |
| `src/data/curatedEnrichment.ts` | Legacy hand-authored Designer/Develop overlays (merge before Develop JSON so Develop wins on shared IDs) |
| `src/data/learningPaths.ts` / `roles.ts` / `personas.ts` / `projects.ts` / `shortcuts.ts` / `workflowStages.ts` | Curriculum taxonomy + Develop persona journeys + flagship workflow map stages |
| `src/components/WorkflowMapView.tsx` | Interactive `/workflow` map (+ `WorkflowMapEmbed` on `/altium-develop`) |
| `src/utils/youtube.ts` | Playable-ID gate (rejects `eet_*` synthetics) |
| `src/utils/storage.ts` | localStorage progress + real-only logs |
| `src/utils/feedback.ts` | Client submit helper for tutorial feedback |
| `src/components/TutorialFeedbackForm.tsx` | Feedback tab UI + success/error states |
| `src/components/FeedbackInboxView.tsx` | `/feedback-inbox` operator stub |
| `api/feedback.ts` | Vercel Edge function → webhook / Resend / GitHub Issues |
| `src/utils/search.ts` | Catalog search/filter (+ logs queries) |
| `src/components/*` | Views + UI primitives (`components/ui/`) |
| `vercel.json` | SPA fallback (skips `/api/*`) |
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

### 3. My Activity = local evidence, not theater
**Context:** Seeded outbound clicks, fake search gaps, and pre-filled completion counts looked like traction.  
**Decision:** Empty defaults. **My Activity** (`/my-activity`, legacy `/impact` redirect) labels metrics as *YOUR browser only*. Export JSON says the same. Invented countries/visitors are banned. Site-wide aggregates require PostHog/GA4 (`/insights` explains this — does not invent numbers).

### 3b. Real analytics only via env keys
**Decision:** `VITE_POSTHOG_KEY` / `VITE_GA_ID` load scripts; otherwise track helpers no-op. Events carry anonymous `session_id` + first-touch UTMs. Privacy copy branches on whether keys are enabled.

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
Some curated `youtubeId` values *look* like valid 11-character YouTube IDs but may not resolve to real EET videos. Format validation is necessary but not sufficient. **Mitigation shipped:** full oEmbed audit + title/product alignment; remaining weak IDs stay `unverified` with embeds withheld.

### Invoice Titles ≠ YouTube Titles
Sponsored/invoice archives often name a deliverable (“Partners Ecosystem playbook”, “Forget Version Control Headaches”) while the public upload uses a different title. If you show the invoice name next to the YouTube player, users assume the site is wrong — even when the ID is correct. Always align the visible catalog title to oEmbed, and demote when topical overlap is too thin to defend.

### Full QA pass (Jul 2026)
oEmbed proved **14/15** original catalog IDs dead or wrong — including `L_LUpnjgPso` resolving to unrelated fireplace ambient video while still embedding. Synthetic regex correctly blocked tut-009–015 on `e43ebfd`, but tut-001–008 still looked “Watchable.” Fix: wire only verified Educational Engineering Team uploads where topic alignment is strong; mark the rest `eet_pending_*`. Also corrected inflated `tutorialCount` (claimed 14 vs 6 real lessons), removed invented `viewsCount`, killed 404 resource/project/trial URLs, and append UTM on Altium outbound clicks.

### How good engineers think here
- Prefer **boring honesty** over impressive fiction.
- Keep diffs reviewable when many agents touch one repo.
- Document the goal number; do not fake the inventory.
- **Never trust format-valid media IDs** — verify with oEmbed before calling a lesson playable.

---

## Best Practices & Patterns

1. **One composition for hero, one job per section** — keep marketing surfaces from turning into dashboards of invented KPIs.
2. **Centralize path maps** (`routes.ts`) so nav labels and URLs cannot drift.
3. **Gate media with a helper** (`isPlayableYoutubeId`) instead of scattering `startsWith('eet')` checks.
4. **Derive counts from data** (`catalogCounts`, `LEARNING_PATHS.length`) — never hardcode `201` / `96` / `105` in UI copy.
5. **Deploy checklist:** `npm run build` → commit → push → `npx vercel --yes` / `--prod` with SPA rewrite present. After DNS is live, set Vercel env `VITE_SITE_URL=https://learn.eduengteam.com` (already the code default).
6. **Secrets:** `.env*` gitignored; `.env.example` documents optional `VITE_SITE_URL` / analytics / Gemini without requiring them for static deploy.

---

## Custom domain — Ashraf DNS checklist (`learn.eduengteam.com`)

The app is **code-ready** for the custom host. Agents cannot finish DNS without your Cloudflare access. Do this once:

1. **Vercel → Project → Settings → Domains**
   - Add `learn.eduengteam.com` (and optionally `www.learn.eduengteam.com` → redirect to apex or vice versa).
   - Copy the DNS records Vercel shows (usually a `CNAME` to `cname.vercel-dns.com`, or A records for apex).

2. **Cloudflare → DNS for `eduengteam.com`**
   - Create the record Vercel requested for `learn` (CNAME or A/AAAA).
   - **Proxy status:** start with **DNS only** (grey cloud) until the certificate issues; then you can try orange-cloud proxy if you want Cloudflare in front (may need SSL mode Full/Strict).
   - Do **not** create conflicting `learn` records.

3. **Wait for TLS**
   - Vercel Domains UI should flip to Valid once DNS propagates.
   - Hit `https://learn.eduengteam.com` and confirm the SPA loads (deep link e.g. `/tutorials` after refresh).

4. **Env (optional but clean)**
   - In Vercel Production env: `VITE_SITE_URL=https://learn.eduengteam.com`
   - Redeploy so client builds bake the same base (default already matches).

5. **Post-cutover**
   - `npm run seo:generate` (already points sitemap/robots at the canonical host).
   - Submit `https://learn.eduengteam.com/sitemap.xml` in Google Search Console when you own the property.
   - Keep the Vercel URL as a fallback; it can redirect to the custom domain later if desired.

**Until DNS is done:** live traffic stays on `https://eet-electronics-product-dev-library.vercel.app`. Chrome already brands `learn.eduengteam.com`; OG/canonical tags already prefer that host — expect a short mismatch window until DNS resolves.

---

## Remaining Gaps (call these out, do not hide them)

- Hand-enrich chapters/transcripts beyond the current overlay set.
- Wire PostHog/GA4 keys in Vercel env (`VITE_POSTHOG_KEY` / `VITE_GA_ID`) — instrumentation is live but no-op without keys; aggregates live in those consoles, not `/my-activity`.
- Custom domain `learn.eduengteam.com` — **Ashraf DNS steps above**; code/SEO prep is done.
- Phase 2: Supabase/Postgres backend when partnership analytics need multi-user truth beyond PostHog/GA4.

If you remember one sentence: **this library earns trust by refusing to pretend.**

---

## Catalog Import Reality (Jul 29, 2026)

**Source precedence:** `data/videos.csv` (from the channel Altium-search MD dump) **wins** over `Educational_Engineering_Team_Altium_Video_Catalog.xlsx`. Xlsx is fallback only when CSV is absent.

**How to re-import**

```bash
npm run md:to-csv               # parse report / MD → data/videos.csv
npm run import:catalog          # prefers CSV; oEmbed validates IDs
npm run import:catalog:fast     # format-only (skip network)
npm run import:videos:csv       # explicit --csv import
npm run audit:youtube:apply     # honesty audit + rewrite catalog
```

Outputs:
- `src/data/catalog.generated.json` — 333 rows with `youtubeStatus` / `enrichmentStatus`
- `scripts/import-report.json` — counts + duplicates
- `public/sitemap.xml` + `public/robots.txt` — regenerated for `VITE_SITE_URL` (default `https://learn.eduengteam.com`)
- Or run SEO alone: `npm run seo:generate`

**Import stats (MD→CSV + oEmbed audit)**
- 333 named videos (332 numbered + 1 CSV-only)
- 333 direct YouTube IDs (no invented IDs; deduped by video_id)
- 333 oEmbed-`public` embeds (cat-104 re-verified; hard-demote list cleared)
- Designer **266** / Develop **55** / Other·Adjacent **12** (honest search-tail tags)
- Learning paths / projects / roles remapped to new `cat-*` via YouTube ID
- Persona journeys (`/personas`) sit beside Roles: outcome-led Develop audiences (PCB, procurement, manufacturing, applications, management, compliance) with UTM CTAs from `/altium-develop`
- Partner landing `/altium-develop` is the shareable Altium-facing hub (not the homepage): independence statement, multidisciplinary value prop, workflow-map embed, persona selector, Develop-filtered tutorials, Develop paths, tools teaser, Try Develop CTA with `utm_medium=landing` / `utm_campaign=altium_develop` / `utm_content=hero`, feedback/contact — no Altium logo

**Honesty rules that still apply**
- Format-valid IDs alone are **not** playable — UI requires `youtubeStatus === 'public'`.
- Prefer demoting a weak title/topic match over shipping the wrong lesson.
- Prefer oEmbed title alignment over marketing titles.
- No synthetic view counts; CSV from MD wins when it duplicates xlsx.

**Full embed re-audit**
Re-run with `npm run audit:youtube` / `npm run audit:youtube:apply`. Report: `scripts/youtube-embed-audit-report.md`.
- Channel match is necessary but not sufficient — catalog title must also reflect the actual upload.
- Prefer demoting a dubious embed over shipping the wrong lesson.
- Hand-enriched chapters/transcripts from the prior 15 curated lessons overlay onto matching imported rows (by verified YouTube ID or topic fallback). Paths/roles/projects remapped to `cat-*` IDs.
- Certificates removed from primary path UX (component file may remain unused).
- No synthetic views / fake padding.

**Phase 2 (explicitly deferred)**
- Supabase/Postgres — optional JSON schema types can mirror brief tables later; do not block Vite SPA.
- Custom domain `learn.eduengteam.com` — DNS checklist above (Cloudflare + Vercel); code defaults already use that host.
- Full transcript/chapter enrichment for all 333 rows (15 hand-enriched today).
