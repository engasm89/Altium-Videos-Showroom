# FORAshraf.md

## Introduction

Imagine you rebuilt a university library overnight, then discovered half the shelves were cardboard cutouts with "Book Goes Here" printed on the spine. That is the story of this repo in miniature.

**EET Electronics Product Development Library** (`learn.eduengteam.com`) is a **partnership-revival asset** for Altium: an independent, structured library of **Altium Designer** and **Altium Develop** tutorials that proves EET invests in Altium education — organized topic hubs, a handful of strong outcome paths, and honest measurable interest. It is *not* a generic electronics academy, LMS, marketplace, Altium-branded product, or official docs site.

Correct scope (narrower than the big "learning platform for everyone" brief): Designer CAD topics + Develop collaboration topics + 5–7 primary paths + tutorial pages with tracked CTAs + My Activity (local only) / Insights (real analytics). Catalog truth comes from `data/videos.csv`.

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

## Custom domain — LIVE (`learn.eduengteam.com`)

**Status (Jul 29, 2026):** DNS + Vercel domain + SSL are **LIVE**.

| Piece | Value |
|-------|--------|
| Live URL | https://learn.eduengteam.com |
| Cloudflare zone | `eduengteam.com` |
| DNS | CNAME `learn` → `cname.vercel-dns.com` (**DNS-only / grey cloud**) |
| Ownership TXT | `_vercel` → `vc-domain-verify=learn.eduengteam.com,…` (alongside mentor verify) |
| Vercel project | `eet-electronics-product-dev-library` — domain **verified** |
| TLS | Let’s Encrypt via Vercel — `CN=learn.eduengteam.com` |
| Env | Production `VITE_SITE_URL=https://learn.eduengteam.com` |

Replaced the old A record `learn` → `34.235.6.209` (AWS/nginx leftover). Keep proxy **off** unless you intentionally put Cloudflare in front (then SSL mode Full/Strict).

**Share with Altium:** `https://learn.eduengteam.com/altium-develop` (not the homepage). Vercel alias remains a backup.

---

## Partner-facing story additions (Jul 29 evening)

Three “strong additions” that make `/altium-develop` feel like an adoption narrative, not a video dump:

1. **ESP32 case study** (`/case-studies/esp32-product`) — one product walk from requirements → PCB → sourcing → review → manufacturing, with stakeholder entry points and real catalog lesson links. Analogy: a guided museum tour of one exhibit, not a warehouse inventory.
2. **Workflow comparison** (`/compare-workflows` + embed on the Develop landing) — disconnected practices vs Develop collaboration. Deliberately process-vs-process, never brand-vs-brand.
3. **Content freshness chips** on tutorial detail — recorded / last verified / version / still-current **only where we have data**. Inventing “still current” for 333 videos would be the fastest way to lose Altium’s trust.

**Lesson:** partner decks ask “is this accurate?” before “is this pretty?” Honesty gates beat decorative confidence.

---

## Production readiness checklist (Jul 29, 2026)

| Item | Status | Notes |
|------|--------|-------|
| `/admin` + `/feedback-inbox` block without password in prod | **SET (code)** | `AdminView` / `FeedbackInboxView` refuse empty-password access when `import.meta.env.PROD` |
| `VITE_ADMIN_PASSWORD` on Vercel | **SET** | Production + Preview + Development. Value is **not** in git. Ashraf has it from the agent chat summary — **rotate in Vercel if this chat is shared**, then redeploy so Vite rebakes the client bundle. |
| `VITE_SITE_URL` | **SET** | Production + Preview → `https://learn.eduengteam.com` |
| `VITE_POSTHOG_KEY` / `VITE_GA_ID` | **Ashraf must set** | No tokens existed in Vercel env. Until set, analytics helpers no-op; `/insights` shows “not configured”. |
| `api/feedback.ts` deploys | **SET (live)** | `GET https://learn.eduengteam.com/api/feedback` → 200 (`configured: false` until delivery secrets exist) |
| Feedback delivery secrets | **Ashraf must set** | At least one of: `FEEDBACK_WEBHOOK_URL`, or `RESEND_API_KEY` + `FEEDBACK_TO_EMAIL`, or `GITHUB_TOKEN` + `GITHUB_FEEDBACK_REPO`. Optional: `VITE_FEEDBACK_ENDPOINT`, `VITE_FEEDBACK_INBOX_URL` |
| My Activity vs Site Insights labels | **SET** | `/my-activity` = browser localStorage only; `/insights` = PostHog/GA4 status (no fake KPIs); `/impact` redirects |
| `npm run smoke:deeplinks` | **PASS** | 333/333 public; admin block asserted; activity/insights routes asserted |

### How to set remaining env (Vercel CLI)

```bash
# Analytics (pick one or both) — then redeploy
vercel env add VITE_POSTHOG_KEY production --value 'phc_…' --yes
vercel env add VITE_GA_ID production --value 'G-…' --yes

# Feedback delivery (server-only; pick one backend)
vercel env add FEEDBACK_WEBHOOK_URL production --value 'https://…' --yes --sensitive
# or:
vercel env add RESEND_API_KEY production --value 're_…' --yes --sensitive
vercel env add FEEDBACK_TO_EMAIL production --value 'learn@eduengteam.com' --yes
# or:
vercel env add GITHUB_TOKEN production --value 'ghp_…' --yes --sensitive
vercel env add GITHUB_FEEDBACK_REPO production --value 'owner/repo' --yes

vercel --prod   # or push to main so Production rebuilds with new VITE_* values
```

**Devil’s advocate:** `VITE_ADMIN_PASSWORD` is an access gate, not server auth — anyone can extract it from the JS bundle after deploy. It still matters so production never ships an *open* `/admin`. Treat feedback webhooks / Resend / GitHub tokens as the real secrets.

---

## Ashraf must still do (before Altium review)

1. **PostHog and/or GA4 keys (Vercel Production)** — set `VITE_POSTHOG_KEY` and/or `VITE_GA_ID`, redeploy, confirm events in the vendor console (not on `/my-activity`).
2. **Confirm admin unlock after redeploy** — open `/admin` on production; should prompt for password (not “Admin blocked”). Password was set on Vercel (all envs) and shared once in chat — **rotate if the chat is shared**.
3. **Feedback delivery backends** — configure at least one server secret above so tutorial feedback / content reports actually store somewhere.
4. **Optional:** Search Console property + sitemap submit for `learn.eduengteam.com` (DNS already **LIVE**).

---

## Partner launch gate snapshot

| Gate | Status |
|------|--------|
| 1 `/altium-develop` | Pass |
| 2 Workflow map | Pass |
| 3 Personas | Pass |
| 4 Analytics / My Activity | Pass code / **Partial keys** (Ashraf sets PostHog/GA4) |
| 5 Develop enrichment (29) | Pass |
| 6 Central feedback | Pass code + API live / **Partial env** (delivery secrets) |
| 7 Domain + SEO | **Pass (LIVE)** |
| 8 Security / a11y | **Pass** (admin password set on Vercel; redeploy to bake in) |
| Strong additions (case study / compare / freshness) | Pass |

---

## Remaining Gaps (call these out, do not hide them)

- Hand-enrich chapters/transcripts beyond the current ~29 Develop + prior curated overlay set.
- Wire PostHog/GA4 keys in Vercel env (`VITE_POSTHOG_KEY` / `VITE_GA_ID`) — instrumentation is live but no-op without keys; aggregates live in those consoles, not `/my-activity`.
- Wire feedback delivery secrets — API is live (`configured: false` until you add them).
- Custom domain `learn.eduengteam.com` — **LIVE** (Cloudflare CNAME DNS-only + Vercel SSL).
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
- Partner landing `/altium-develop` is the shareable Altium-facing hub (not the homepage): independence statement, multidisciplinary value prop, workflow-map embed, persona selector, Develop tutorials from `data/videos.csv`, Develop paths, practice tools, compare + ESP32 case study links, Try Develop CTAs with `utm_medium=landing` / `utm_campaign=altium_develop`, and hub feedback via `ReportContentControl` — no Altium logo
- Persona + workflow tutorial IDs are smoke-tested to be real **Altium Develop** rows (not Designer fallthroughs). `npm run smoke:deeplinks` fails the build story if a persona points at the wrong product.

**Honesty rules that still apply**
- Format-valid IDs alone are **not** playable — UI requires `youtubeStatus === 'public'`.
- Prefer demoting a weak title/topic match over shipping the wrong lesson.
- Prefer oEmbed title alignment over marketing titles.
- No synthetic view counts; CSV from MD wins when it duplicates xlsx.

**Full embed re-audit**
Re-run with `npm run audit:youtube` / `npm run audit:youtube:apply`. Report: `scripts/youtube-embed-audit-report.md`.
- Channel match is necessary but not sufficient — catalog title must also reflect the actual upload.
- Prefer demoting a dubious embed over shipping the wrong lesson.
- Hand-enriched chapters/transcripts: prior curated overlays + **29 strategic Develop** overlays (`developEnrichment.overlay.json`) merge by verified YouTube ID / topic. Paths/roles/projects remapped to `cat-*` IDs.
- Certificates removed from primary path UX (component file may remain unused).
- No synthetic views / fake padding.

**Phase 2 (explicitly deferred)**
- Supabase/Postgres — optional JSON schema types can mirror brief tables later; do not block Vite SPA.
- Custom domain `learn.eduengteam.com` — **LIVE** (see status table above).
- Full transcript/chapter enrichment for all 333 rows (strategic Develop subset done; rest still thin).
- User accounts, certificates-as-primary-UX, AI chat, Arabic, paid — do not block Altium review.
