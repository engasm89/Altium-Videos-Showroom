# EET Electronics Product Development Library — Feature Inventory

> **Who this is for:** Ashraf (and anyone joining the project) who needs a single, honest map of what the product *actually ships today* — not the aspirational brief alone.  
> **Live URL:** [https://learn.eduengteam.com](https://learn.eduengteam.com) (Cloudflare DNS + Vercel SSL **LIVE** as of Jul 29, 2026)  
> **Vercel alias:** [https://eet-electronics-product-dev-library.vercel.app](https://eet-electronics-product-dev-library.vercel.app)  
> **Repo root file:** `FEATURES.md` (this document)  
> **Numbers below** reflect the catalog after the Jul 29, 2026 MD→CSV import + YouTube embed audit (`catalogCounts` / `scripts/import-report.json`). Primary source: `data/videos.csv` (wins over xlsx).

---

## Table of contents

1. [Overview & positioning](#1-overview--positioning)
2. [Information architecture & routes](#2-information-architecture--routes)
3. [Homepage](#3-homepage)
4. [Catalog, search & filters](#4-catalog-search--filters)
5. [Tutorial detail experience](#5-tutorial-detail-experience)
6. [Learning paths](#6-learning-paths)
7. [Projects, products, roles & skills](#7-projects-products-roles--skills)
8. [My Activity](#8-my-activity)
9. [Tools & labs](#9-tools--labs)
10. [Notes, glossary & skill quiz](#10-notes-glossary--skill-quiz)
11. [Legal & about](#11-legal--about)
12. [Admin](#12-admin)
13. [Analytics, UTMs & events](#13-analytics-utms--events)
14. [SEO](#14-seo)
15. [Catalog import & YouTube audit pipeline](#15-catalog-import--youtube-audit-pipeline)
16. [Catalog stats (current)](#16-catalog-stats-current)
17. [Design system & UX notes](#17-design-system--ux-notes)
18. [What is NOT built yet / Phase 2](#18-what-is-not-built-yet--phase-2)
19. [Devil’s advocate — where trust can still break](#19-devils-advocate--where-trust-can-still-break)
20. [Partner launch gate](#20-partner-launch-gate-jul-29-2026)

---

## 1. Overview & positioning

**What it is:** An independent Educational Engineering Team (EET) learning hub for practical **Altium Designer** and **Altium Develop** electronics product-development workflows — tutorials, outcome paths, roles, projects, and lightweight CAD labs.

**What it is not:** Not an Altium product, support channel, or official docs site. The UI and legal pages say this repeatedly (navbar strip, About, Footer).

**Stack (what exists in repo):**

| Layer | Choice |
|--------|--------|
| UI | React 19 + Vite 6 SPA |
| Routing | `react-router-dom` v7 (`BrowserRouter`) |
| Styling | Tailwind CSS 4 + custom CSS tokens |
| Video | `react-player` → YouTube embeds (only when status is `public`) |
| Motion / delight | `motion`, `canvas-confetti` on “mark completed” |
| Hosting | Vercel (`vercel.json` SPA rewrite → `index.html`) |
| Data | Static JSON + TypeScript data modules; optional `api/feedback.ts` on Vercel |
| Progress | Browser `localStorage` only |
| Tutorial feedback | Central (webhook / Resend / GitHub Issues / `VITE_FEEDBACK_ENDPOINT`) |

**Canonical product name in UI / titles:** *EET Electronics Product Development Library*  
**Canonical host:** `https://learn.eduengteam.com` (LIVE — Cloudflare CNAME DNS-only → `cname.vercel-dns.com`; Let’s Encrypt via Vercel)  
**Vercel alias (still valid):** `https://eet-electronics-product-dev-library.vercel.app`

---

## 2. Information architecture & routes

Central map: `src/routes.ts` (`TAB_PATHS`) ↔ `src/App.tsx` (`<Routes>`).

| Path | View / behavior |
|------|------------------|
| `/` | Homepage: Hero + featured paths + embedded catalog strip |
| `/tutorials` | Full catalog with search/filters |
| `/tutorials/:slug` | Catalog behind a **tutorial detail modal**; deep-linkable |
| `/learning-paths` | All learning paths |
| `/learning-paths/:slug` | Same view, expands matching path |
| `/projects` | Hardware project hubs |
| `/projects/:slug` | Deep-link to a project |
| `/products` | Product catalog (Designer / Develop hubs) |
| `/products/:slug` | Deep-link to a product hub |
| `/roles` | Engineering roles |
| `/roles/:slug` | Deep-link to a role |
| `/personas` | Develop persona journeys (“I am a…”) |
| `/personas/:slug` | Deep-link to a persona journey |
| `/altium-develop` | Partner-facing Altium Develop landing (embeds workflow map; links to personas) |
| `/workflow` | **Flagship** interactive product-development workflow map (8 stages) |
| `/workflow/:stageSlug` | Deep-link into a workflow stage (concept…verification) |
| `/skills` | Skills index → jumps to `/tutorials?skill=…` |
| `/my-activity` | My Activity — **this browser only** (localStorage) |
| `/impact` | Redirect → `/my-activity` |
| `/insights` | Site Insights status page (PostHog/GA4 required — no fake aggregates) |
| `/tools/shortcuts` | Keyboard shortcuts lab |
| `/tools/activebom` | ActiveBOM risk simulator (sample BOMs) |
| `/tools/drc` | DRC assistant (rule database) |
| `/tools/stackup` | Stackup inspector (presets) |
| `/notes` | Personal notes hub |
| `/glossary` | PCB / Altium glossary |
| `/about` | About + independence disclaimer |
| `/privacy` | Privacy policy |
| `/changelog` | Public release notes (Beta / version) |
| `/altium-develop` | Partner-facing Altium Develop landing (independent EET hub) |
| `/workflow` · `/workflow/:stageSlug` | Interactive product-development workflow map |
| `/personas` · `/personas/:slug` | Develop persona journeys |
| `/compare-workflows` | Disconnected vs Develop process comparison |
| `/case-studies/esp32-product` | ESP32 guided multidisciplinary case study |
| `/feedback-inbox` | Operator stub: probes feedback backend status (password-gated like admin) |
| `/admin` | Read-only catalog status admin |
| `*` | NotFoundView (no silent redirect to home) |

**Query params that matter:**

- `/tutorials?product=Altium%20Designer` (or Develop)
- `/tutorials?skill=…`
- `/tutorials?path=…` / `?project=…` (path/project filter sync in catalog)

**Nav chrome:**

- Sticky navbar: EET brand first + secondary cyan **Develop Hub** chip (`/altium-develop`) + primary tabs (Paths, Projects, Products, Roles, Skills, Tutorials, My Activity) + **Tools** dropdown
- Global search overlay (`SearchOverlay`)
- Skill quiz entry (“Take Skill Quiz”)
- Completion / bookmark counts from local progress
- Footer: learning nav, product counts, Altium Develop Learning Hub, My Activity, Site Insights, About, Privacy, contact mailto

---

## 3. Homepage

Implemented in `Hero` + home route block in `App.tsx`.

**Hero sections (top → bottom):**

1. **Identity pill** — “Educational Engineering Team Catalog” with live counts (`{total} named videos · {playable} playable embeds`).
2. **H1 + positioning copy** — “Master Modern Electronics Product Development”; independence + honesty about audit-derived counts.
3. **Search** — jumps to catalog tab; popular chips (DRC, ESP32, ActiveBOM, SolidWorks).
4. **Primary CTAs** — Start a Learning Path; Browse by Engineering Role; product filter chips (Designer / Develop with live counts).
5. **Stat strip** — named videos, learning paths, project hubs, role hubs (all derived from data length, not hardcoded marketing numbers).
6. **Honest status line** — playable / playlist-only / missing; branded host is live.
7. **Choose your goal** — path / project / catalog.
8. **Browse by role / product** teasers.
9. **Projects + My Activity teasers.**

**Below the fold on `/`:**

- **Featured Outcome Learning Paths** — first 3 of `LEARNING_PATHS` with role, hours, lesson count.
- **Catalog strip** — `CatalogView` with filters cleared (browse without inheriting hero search).

---

## 4. Catalog, search & filters

**Source of truth:** `ALL_TUTORIALS` from `src/data/catalog.ts` (generated rows + curated enrichment overlay).

**Catalog UI (`CatalogView`):**

- Header with live totals (named, playable, playlist-only, hand-enriched).
- Full-text search box.
- Toggles: **Completed only**, **Bookmarked only**.
- Filters: Product, Engineering Role, Difficulty, Skill, Learning Path, Project, Duration range, Sort.
- Grid / list view modes.
- Reset filters (also clears deep-link query / slug when needed).
- Cards (`TutorialCard`) open `/tutorials/:slug`.

**Search engine (`utils/search.ts`):**

- Searches title, short/full summaries, skills, product, role, chapter titles, transcript text, command shortcuts.
- **Synonym expansion** (e.g. “rule check” ↔ DRC; “parts list” ↔ BOM / ActiveBOM; “mechanical collaboration” ↔ ECAD-MCAD / SolidWorks).
- Logs queries to localStorage + fires analytics events (`search`, `search_zero_results`).

**Playability gate (critical honesty rule):**

```text
isPlayableTutorial = valid 11-char YouTube ID AND youtubeStatus === 'public'
```

Unverified / playlist-only / missing IDs never get a live embed, even if an ID string exists.

**Unknown slug UX:** Amber banner on catalog when `/tutorials/:bad-slug` does not match — browse still available.

---

## 5. Tutorial detail experience

**Presentation:** Full-screen modal (`TutorialDetailModal`) over catalog when a tutorial is selected; URL stays `/tutorials/:slug`.

### Player

- **Playable:** autoplay YouTube via `react-player`; progress milestones at 25 / 50 / 75 / 100% → `playback_milestone` events.
- **Not playable:** Placeholder with status-specific copy:
  - `playlist_only` — playlist recovered, no individual URL yet
  - `unverified` — ID present but embed withheld
  - otherwise enrichment / recovery pending
- Chapters / notes / docs still available when authored.

### Header actions

- Bookmark toggle
- Mark completed (confetti on first complete)
- Close → `/tutorials`
- Prev / next adjacent tutorials in catalog order

### Content freshness indicators

Shown on tutorial detail **only when data exists** (never invented for the bulk catalog):

- Recorded date (explicit or accompanying richer freshness)
- Last verified date
- Software version
- Feature availability note
- “Still current” / needs re-verification badge

Hand-verified overlays live in `src/utils/contentFreshness.ts` (keyed by YouTube ID). Enriched lessons with `softwareVersion` also surface the version chip.

### Tabs

| Tab | Behavior |
|-----|----------|
| Overview & Outcomes | Summary, learning outcomes, prerequisites, role, workflow stage, next recommended lesson, skills, resources, thin-enrichment banner, Altium CTA, official docs links, related lessons |
| Chapters | Timestamp seek into player (or “enrichment pending”) |
| Transcript | Searchable lines when present; outline-labeled when `transcriptKind=outline` |
| Steps | Procedural steps + commands when authored |
| My Notes | Per-tutorial notes → `localStorage` |
| Feedback | Structured curriculum feedback → central store via `/api/feedback` (or `VITE_FEEDBACK_ENDPOINT`); not localStorage |

### Enrichment states

| Status | Meaning in product |
|--------|--------------------|
| `enriched` | Strategic Develop overlay from `developEnrichment.overlay.json` (full pedagogy fields) |
| `hand_enriched` | Legacy overlay from `curatedEnrichment.ts` (chapters / transcript / commands / richer copy) |
| `playable_candidate` | Sheet + oEmbed public; thin pedagogical depth until enriched |
| `url_recovered_unverified` | Recovered but not trusted for embed |
| `enrichment_pending` | Typically playlist-only / missing — no public embed |

**Current depth (runtime):** ~29 Develop `enriched` + legacy `hand_enriched` Designer overlays — still a strategic subset of **333** (`CATALOG_ENRICHMENT_GOAL = 333`). Develop overlay covers workspace setup through manufacturing/verification/management; transcripts are honest **outlines**, not verbatim captions.

### CTAs & outbound

- “Try in Altium” → free-trial URL with EET UTMs (`withEetUtm` / `defaultAltiumTrialUrl`)
- Optional official docs link
- Related lessons (same product / shared skills / shared paths), max 4

### SEO side-effect

Opening a playable tutorial injects **JSON-LD `VideoObject`** (`utils/jsonld.ts`); removed on close.

---

## 6. Learning paths

**Data:** `src/data/learningPaths.ts` — **10** curated paths.

Examples of path themes:

1. Altium Designer Foundations  
2. Component Library Development  
3. PCB Layout & Interactive Routing  
4. Complete Arduino UNO Hardware Project  
5. Power Electronics & Buck Converter Design  
6. Altium Develop Foundations  
7. Multidisciplinary Product Co-Creation  
8. BOM & Supply-Chain Risk Management  
9. Requirements to Verification & Compliance  
10. Engineering Management & Project Visibility  

**UI (`LearningPathView`):**

- Expand/collapse paths; deep-link by slug expands the match.
- Modules with tutorial lists resolved via `findTutorialById` (supports legacy `tut-*` → `cat-*` map).
- Progress against completed tutorial IDs in localStorage.
- Clicking a lesson opens the tutorial modal.

**Limitation:** Paths are curated overlays on the imported catalog — not every catalog row is on a path. Certificate UI (`CertificateModal.tsx`) exists in the tree but is **not wired** into primary path UX.

---

## 7. Projects, products, roles & skills

### Projects — `/projects` (`ProjectHubView`)

**6** hubs in `src/data/projects.ts`:

- Arduino UNO Rev3 Hardware Clone  
- ESP32 IoT Wireless Dev Board  
- High-Efficiency DC-DC Buck Regulator  
- Industrial 4-Channel Optoisolated Relay Board  
- Professional PCB Manufacturing Release  
- Altium Develop Team Workspace Walkthrough  

Each hub describes difficulty, estimated time, schematic/PCB/BOM status strings, and linked tutorial IDs. Download/GitHub fields are optional and only shown when present (no fake 404s).

### Products — `/products` (`ProductCatalogView`)

Hubs for **Altium Designer** and **Altium Develop** with counts and hand-off into catalog filters (`?product=`).

### Roles — `/roles` (`RoleView`)

**8** engineering roles in `src/data/roles.ts` (Hardware & PCB, Procurement, Manufacturing & Quality, Embedded & Systems, Engineering Manager & CTO, Regulatory & Compliance, Component Library Architect, Field Applications / Customer Success).

Each role: responsibilities, workflows, recommended path, tutorial IDs, icon. Can jump to a learning path.

### Interactive workflow map — `/workflow` (`WorkflowMapView`)

**Flagship** eight-stage product-development map in `src/data/workflowStages.ts`:

Concept → Requirements → System Design → PCB Design → Sourcing → Review → Manufacturing → Verification

Click a stage for: responsible roles, common problems, Altium Develop capability, Develop-preferring catalog tutorials, linked learning path, and **Try this workflow in Altium** CTA (UTM `utm_content=workflow_*`). Same interactive panel embeds on `/altium-develop` via `WorkflowMapEmbed`. Mobile: horizontal scrollable stage strip + full detail panel.

### Personas — `/personas` (`PersonaJourneyView`)

**6** Develop-focused audience journeys in `src/data/personas.ts` — distinct from Roles (Roles = catalog taxonomy; Personas = “what Develop solves for my job”):

1. PCB Designer — hardware design & engineering  
2. Procurement Manager — BOM & supply chain  
3. Manufacturing Engineer — manufacturing, testing, QA  
4. Applications / Product Engineer — apps, technical marketing, product  
5. Engineering Manager — leadership & strategy  
6. Compliance Engineer — compliance & sustainability  

Each journey: Develop business outcomes, recommended starting path, 3–6 tutorials, one realistic workflow example, one relevant tool, and a Try Altium Develop CTA with landing UTMs (`utm_content=persona-…`). Entry points from `/altium-develop` and the footer.

### Skills — `/skills` (`SkillsIndexView`)

Thin index of **~55** skill tags derived from the catalog. Selecting a skill navigates to `/tutorials?skill=…` — catalog owns results rendering.

---

## 8. My Activity (formerly Impact)

**Route:** `/my-activity` · `MyActivityView`  
**Legacy:** `/impact` redirects here.

**Be radically honest here:** this is **YOUR browser only** — not site-wide analytics. It reads **this browser’s** `localStorage`:

| Metric source | Key / content |
|---------------|----------------|
| Completions, bookmarks, notes, outbound click counter | `eet_user_progress_v1` |
| Outbound click log (last 50) | `eet_outbound_click_logs_v1` |
| Search query log (last 100) | `eet_search_query_logs_v1` |

**What the page shows:**

- Catalog inventory counts (playable, enriched, Designer/Develop split, paths, projects)
- This-browser completions / bookmarks / outbound clicks
- Recent UTM-tagged outbound logs
- Search gap analysis (including zero-result queries)
- Export JSON — explicitly labeled as this-browser only
- Partnership CTA links (Altium trial / site) with UTM tagging

**UI banner:** “YOUR browser only — not site-wide analytics.”

**Site Insights** (`/insights` · `InsightsView`) explains that real aggregates require PostHog/GA4 env keys and never invents traffic numbers from localStorage.

If you clear site data, My Activity for that visitor resets. Multi-user truth lives in PostHog/GA4 after keys are enabled — not in this SPA.

---

## 9. Tools & labs

Accessible from the Navbar **Tools** dropdown. These are **educational simulators / references**, not live Altium cloud integrations.

| Tool | Path | What it does |
|------|------|----------------|
| Shortcuts | `/tools/shortcuts` | Searchable Altium hotkey list (~44 entries); filter by Schematic / PCB / Develop / General; copy key; export Markdown cheat sheet |
| ActiveBOM simulator | `/tools/activebom` | Sample BOMs (Arduino UNO, ESP32, buck) with lifecycle, stock, lead time, risk score, cost rollup; links related tutorials |
| DRC assistant | `/tools/drc` | Curated violation database (clearance, high-speed, manufacturing, etc.) with IPC notes, step-by-step fixes, shortcuts; links tutorials |
| Stackup inspector | `/tools/stackup` | 4-layer and 6-layer FR-4 presets, thickness sum, example impedance widths; copper oz control; related tutorials |

**Caveat:** Sample BOM / DRC / stackup numbers are teaching fixtures. Do not treat them as live distributor or fab data.

---

## 10. Notes, glossary & skill quiz

| Feature | Path / trigger | Notes |
|---------|----------------|-------|
| Notes Hub | `/notes` | Aggregates per-tutorial notes from localStorage; search; open lesson; edit/clear |
| Glossary | `/glossary` | 15 sorted PCB/Altium terms with local search |
| Skill Quiz | Navbar “Take Skill Quiz” → `QuizModal` | 5 multiple-choice hardware/Altium questions; score + explanations; not persisted to a server |

---

## 11. Legal & about

### About — `/about`

- Mission copy for the EET library
- **Independence & trademark disclosure** (not affiliated with Altium LLC)
- Live stats cards (tutorials / paths / roles)
- “What this is (and isn’t)” bullets — free, no account, local progress
- Contact: `contact@eduengteam.com`
- Outbound to Altium.com (UTM-tagged)

### Privacy — `/privacy`

- No account, no ad trackers claimed for the library itself
- Explains localStorage for progress, notes, searches, outbound logs
- Documents **optional tutorial feedback** sent to a central backend (`/api/feedback` or `VITE_FEEDBACK_ENDPOINT`) — not localStorage
- Third-party Altium destinations have their own policies
- Last updated label: **July 29, 2026**
- Contact mailto

### Changelog — `/changelog`

- Public release notes; Beta / version label matches nav + footer
- Catalog honesty milestones and launch-trust / SEO prep called out

**Privacy honesty gap to watch:** If `VITE_GA_ID` / `VITE_POSTHOG_KEY` are set in production, third-party analytics scripts *do* load — update Privacy copy when those keys go live.

---

## 12. Admin

**Route:** `/admin` · `AdminView` (read-only)

- **Requires** `VITE_ADMIN_PASSWORD` in production — if unset on a production build, `/admin` is **blocked** (no empty-password access). Documented in `.env.example` (Vercel env + redeploy).
- Local/dev may omit the password (open stub for convenience)
- Gate via `?key=` or password prompt → `sessionStorage`
- Filters: all / public / pending / playlist_only
- Table: id, title, product, YouTube status, enrichment status, playable flag
- Shows import meta (source file, row counts)

**No mutations** — catalog changes happen via import/audit scripts, not the admin UI.

### Feedback inbox — `/feedback-inbox` · `FeedbackInboxView`

- Same password gate as admin
- Probes `GET /api/feedback` for backend configuration (webhook / Resend / GitHub)
- Does **not** list message bodies inside the SPA — operators read the configured store
- Optional `VITE_FEEDBACK_INBOX_URL` deep-link

### Tutorial feedback API — `api/feedback.ts`

- Vercel Edge function; SPA rewrite excludes `/api/*`
- Fields: useful, workflowWorked, unclear, nextWorkflow, role, altiumProduct (+ tutorial id/slug/title)
- Backends (any one): `FEEDBACK_WEBHOOK_URL`, Resend (`RESEND_API_KEY` + `FEEDBACK_TO_EMAIL`), or GitHub Issues (`GITHUB_TOKEN` + `GITHUB_FEEDBACK_REPO`)
- Client override: `VITE_FEEDBACK_ENDPOINT` (Formspree / Getform)
- Documented in `.env.example`

---

## 13. Analytics, UTMs & events

### Outbound UTMs (`utils/outbound.ts`)

Applied to **altium.com** destinations from tutorials:

| Param | Value |
|-------|--------|
| `utm_source` | `eet_learning_hub` |
| `utm_medium` | `tutorial` |
| `utm_campaign` | `altium_develop_library` |
| `utm_content` | tutorial slug when available |

**Partner landing CTAs** (`landingAltiumTrialUrl` on `/altium-develop`):

| Param | Value |
|-------|--------|
| `utm_source` | `eet_learning_hub` |
| `utm_medium` | `landing` |
| `utm_campaign` | `altium_develop` |
| `utm_content` | `hero` (or section-specific) |

Non-Altium URLs pass through unchanged.

### Analytics (`utils/analytics.ts`)

Loads **only if env vars are set** (documented in `.env.example`):

- `VITE_POSTHOG_KEY` → PostHog
- `VITE_GA_ID` → gtag / GA4

Without keys: `trackEvent` / `trackPageView` are safe no-ops (no scripts loaded).

Every event is enriched with anonymous `session_id` + first-touch traffic attribution (`utm_*` / referrer) when available.

**Events fired in code today:**

| Event | When |
|-------|------|
| `page_view` | Every route change |
| `tutorial_start` | Opening a playable tutorial |
| `playback_milestone` / `playback_25`…`100` | Playback 25 / 50 / 75 / 100% |
| `tutorial_complete` | Marking a lesson complete |
| `path_progression` | Completing a lesson that belongs to a learning path |
| `persona_selected` | Selecting a Develop persona journey |
| `cta_click` / `altium_cta_click` | Altium trial / docs / general outbound |
| `search` | Catalog search |
| `search_zero_results` | Empty search |
| `tutorial_feedback_submit` | Successful central feedback submit |
| `tutorial_feedback_error` | Failed feedback submit |

### Local logging (always on, browser-only)

- Outbound clicks → My Activity + counter
- Search queries (≥2 chars) → My Activity gap analysis

Site-wide aggregates: PostHog / GA4 consoles (see `/insights`). **Never** fabricated in the SPA.

## 14. SEO

| Asset | Behavior |
|-------|----------|
| `index.html` | Base title + meta description + OG/Twitter tags + canonical + favicon SVG + apple-touch-icon + fonts |
| `public/og-image.png` | Default social share image (`1200×630`-class) |
| `useDocumentTitle` / `applyPageMeta` | Per-route title + description + canonical + OG/Twitter updates |
| `VITE_SITE_URL` | Canonical base (default `https://learn.eduengteam.com`); also accepted as `SITE_URL` / `APP_URL` in Node SEO scripts |
| `public/robots.txt` | `Allow: /` + sitemap URL for the canonical host |
| `public/sitemap.xml` | Regenerated by `import:catalog` or `npm run seo:generate` — hubs + per-tutorial URLs |
| JSON-LD | Client-injected `VideoObject` for playable tutorials only |
| SPA caveat | Vercel rewrites all paths to `index.html` — crawlers get the shell; rich per-URL HTML is limited without SSR |

**Sitemap / robots base URL:** `https://learn.eduengteam.com` (Production `VITE_SITE_URL` set on Vercel). Alias: `https://eet-electronics-product-dev-library.vercel.app`.

---

## 15. Catalog import & YouTube audit pipeline

### Source of truth (precedence)

1. **`data/videos.csv`** (primary) — **wins over xlsx** whenever the file exists (Ashraf request). Live catalog `meta.sourceKind` is `"csv"`.
2. **`Educational_Engineering_Team_Altium_Video_Catalog.xlsx`** — **fallback only** if CSV is absent (`import-catalog.mjs`). Do not treat xlsx as the current inventory.

Devil’s advocate: MD/CSV and the older xlsx overlap but are not identical (different row counts, ID numbering, historical playlist-only / missing rows on xlsx). Do not merge silently — CSV from MD is authoritative for the live catalog.

### MD → CSV → catalog flow

```text
get me each video title and link __in a list and c.md
        │
        ▼  (parse once → structured report)
data/parsed-from-md-report.json     ← 333 unique YouTube IDs
        │                              (MD claimed 332; +1 CSV-only title
        │                               “Altium Designer Interface Introduction”)
        ▼  npm run md:to-csv
data/videos.csv                     ← primary import input
data/md-to-csv-report.json          ← designer / develop / adjacent counts
        │
        ▼  npm run import:catalog   (or import:videos:csv)
src/data/catalog.generated.json
scripts/import-report.json
public/sitemap.xml
        │
        ▼  npm run audit:youtube:apply   (optional honesty pass)
catalog.generated.json rewritten    ← retitle / demote weak matches
```

**Product tagging in CSV build (`md-to-csv.mjs`):**

| Product | How it is assigned |
|---------|--------------------|
| `Altium Designer` | Title / field inference (default for Altium-branded channel hits) |
| `Altium Develop` | Title / field mentions Develop |
| `Other / Adjacent` | Honest search-tail: non-Altium adjacent uploads kept, not sold as Designer/Develop lessons |

### npm scripts (`package.json`)

| Command | What it does |
|---------|----------------|
| `npm run md:to-csv` | Prefer `data/parsed-from-md-report.json` (else re-parse MD) → `data/videos.csv` + `data/md-to-csv-report.json` |
| `npm run import:catalog` | **CSV-first** when `data/videos.csv` exists → oEmbed-validate → generated catalog + report + sitemap + robots |
| `npm run import:catalog:fast` | Same, `--skip-oembed` |
| `npm run import:videos:csv` | Explicit CSV import (`import-catalog.mjs --csv`) — fails if CSV missing |
| `npm run seo:generate` | Regenerate `sitemap.xml` + `robots.txt` only (reads `catalog.generated.json`) |
| `npm run audit:youtube` | Re-oEmbed every ID; write Markdown + JSON report (no catalog rewrite) |
| `npm run audit:youtube:apply` | Audit + rewrite `catalog.generated.json` (retitle / Develop→Designer fixes / demote weak matches) |
| `npm run lint` | `tsc --noEmit` |
| `npm run build` | Production build |

### Import / parse artifacts

| Path | Role |
|------|------|
| `get me each video title and link __in a list and c.md` | Human-facing channel Altium-search dump (source list) |
| `data/parsed-from-md-report.json` | Deduped parse of that MD (333 unique IDs + edge-case notes) |
| `data/videos.csv` | **Primary catalog source** for import |
| `data/md-to-csv-report.json` | CSV build summary (product split, precedence note) |
| `src/data/catalog.generated.json` | Runtime catalog rows + `meta` (`sourceKind`, post-audit public/unverified) |
| `scripts/import-report.json` | Import-time counts + duplicate title pairs |
| `public/sitemap.xml` | Regenerated from tutorial slugs |

### Audit outputs

- `scripts/youtube-embed-audit-report.md`
- `scripts/youtube-embed-audit-report.json`

### Runtime merge (`catalog.ts`)

1. Load generated rows → `Tutorial[]`
2. Overlay `CURATED_ENRICHMENT` (match by verified YouTube ID or topic fallback for pending IDs)
3. Build `LEGACY_TUTORIAL_ID_MAP` so paths/roles/projects still resolve old `tut-*` ids
4. Export `catalogCounts`, `PLAYABLE_TUTORIALS`, helpers

### Honesty rules the pipeline enforces

- Format-valid IDs alone are **not** playable — UI requires `youtubeStatus === 'public'`
- Prefer demoting a weak title/topic match over shipping the wrong lesson
- Prefer oEmbed title alignment over marketing titles
- No synthetic view counts; no invented YouTube IDs; search-tail non-Altium uploads tagged `Other / Adjacent`

---

## 16. Catalog stats (current)

Derived from runtime `catalogCounts` after MD→CSV import + YouTube embed audit (Jul 29, 2026). Source of truth for numbers: `src/data/catalog.ts` over live `catalog.generated.json` (post-`audit:youtube:apply`).

| Metric | Count |
|--------|------:|
| Named catalog rows | **333** |
| With YouTube URL / ID | 333 |
| **Playable embeds (`public`)** | **333** |
| Unverified (embed withheld) | **0** |
| Playlist-only | 0 |
| Missing / invalid | 0 |
| Altium Designer | **266** |
| Altium Develop | **55** |
| Other / Adjacent (honest search-tail) | **12** |
| Hand-enriched overlays | 15 |
| Enrichment goal | 333 |

**Parse note:** MD document claimed 332; parse kept **333** unique IDs (extra: *Altium Designer Interface Introduction*, `V0X7poEedTs`) — see `data/parsed-from-md-report.json` → `count_vs_document_note`.

**Channel meta (import):** Educational Engineering Team · `UCQfDCLyWEHMV3ERhD0au0Ug`

**Content hubs (not catalog rows):** 10 learning paths · 6 projects · 8 roles — tutorial IDs remapped to new `cat-*` via YouTube ID.

---
## 17. Design system & UX notes

**Visual language**

- Dark slate base (`slate-950` / `900`) with blue/cyan accents — “engineering console,” not light marketing SaaS.
- Fonts: **Space Grotesk** (display), **Inter** (UI), **JetBrains Mono** (meta, statuses, filters).
- Product badges: Designer = blue; Develop = cyan; Other / Adjacent filtered distinctly in catalog (not sold as Designer/Develop).
- Status honesty is a first-class UX pattern (amber enrichment banners, mono status chips).

**Component primitives** (`src/components/ui/`): Button, Card, Input, SearchInput, Badge, Breadcrumbs.

**Patterns that matter**

- Sticky nav + Tools dropdown keeps labs discoverable without crowding primary IA.
- Tutorial detail as modal + URL slug = shareable deep links without a separate page shell.
- Counts always derived from data (`catalogCounts`, `.length`) so marketing copy cannot drift from inventory.
- Confetti on complete is intentional delight; certificates intentionally demoted.

**A11y / polish:** modal focus trap, body scroll lock, and Escape-to-close ship via `useModalA11y` (tutorial / quiz / search / report dialogs). Skip link + Ctrl/⌘K search. No account sync for progress.

---

## 18. What is NOT built yet / Phase 2

Call these out so nobody confuses roadmap with shipping:

| Item | Status |
|------|--------|
| **Supabase / Postgres backend** | Not started — no multi-user progress or server analytics (tutorial feedback uses webhook/Resend/GitHub instead) |
| **Custom domain `learn.eduengteam.com`** | **LIVE** — Cloudflare CNAME `learn` → `cname.vercel-dns.com` (DNS-only); Vercel domain verified; SSL Let’s Encrypt issued; Production `VITE_SITE_URL` set |
| **PostHog / GA4 keys in production** | Code stubs exist; no-op until `VITE_*` env set |
| **Full chapter/transcript enrichment for all 333** | ~39 pedagogically enriched today (incl. ~29 strategic Develop `enriched` overlays); rest still thin |
| **Resolve the 1 unverified embed** | Done — `cat-104` re-verified (EET oEmbed author + title match); hard-demote list cleared |
| **SSR / prerender for SEO** | SPA rewrite only — meta/sitemap help; HTML still one shell |
| **Certificate issuance in path UX** | Component file present, not primary flow |
| **Gemini / AI features** | `@google/genai` dependency + `.env.example` note — not productized |
| **Live distributor / ActiveBOM APIs** | Simulator uses sample data |
| **User accounts, sync, teams** | Explicitly deferred |
| **Admin mutations / CMS** | Read-only status table |
| **Official Altium partnership dashboard** | Local export JSON only |

> **Historical note:** The old xlsx-era “33 playlist-only + 3 missing” recovery queue does **not** apply to the current MD→CSV catalog (0 playlist-only, 0 missing). Keep that language out of partnership decks.

---

## 19. Devil’s advocate — where trust can still break

1. **“333 tutorials” on the homepage can still mislead** if a visitor equates named rows with playable lessons. The UI reports **333 playable** after `cat-104` re-verify, but skimmers may still miss that 12 rows are honestly tagged `Other / Adjacent` — not Designer/Develop curriculum.
2. **My Activity looks like growth metrics.** Without the disclaimer, a partner could screenshot localStorage numbers as platform KPIs. Treat export JSON as a *demo of instrumentation*, not proof of traffic. Use `/insights` + PostHog/GA4 for real aggregates.
3. **Tools feel “live.”** ActiveBOM / DRC / stackup are excellent teaching UX — and dangerous if someone quotes sample stock or impedance as fab truth.
4. **SPA SEO ceiling.** Sitemap + JSON-LD help, but Google mostly sees one shell. Custom domain + SSR is the real SEO unlock, not more meta tags.
5. **Privacy copy vs production analytics.** Shipping GA/PostHog without updating Privacy is a self-inflicted trust bug — Privacy now branches on whether keys are enabled.
6. **Admin password is a Vite client gate.** Production **blocks** `/admin` (and `/feedback-inbox`) when `VITE_ADMIN_PASSWORD` is unset — set it on Vercel and redeploy. It is still not a server secret; do not treat it as one.
7. **Enrichment asymmetry.** ~39 pedagogically enriched lessons (including a Develop strategic set) feel premium; the other ~290 thin audit rows still feel like a spreadsheet dump. The product story should stay “honest inventory + deepening enrichment,” not “finished academy.”
8. **CSV vs xlsx confusion.** If someone re-imports from xlsx “because the spreadsheet is familiar,” they silently shrink / reshape the live catalog. Guardrail: keep `data/videos.csv` present; document CSV-first in every ops runbook.

**Stronger long-term approach:** keep the honesty gates (status, oEmbed, demote-over-fake), keep My Activity clearly browser-local while PostHog/GA4 own site-wide truth, deepen enrichment toward the 333 goal as content ops (same audit script), and keep content-report + tutorial feedback wired to `/api/feedback`.

---

## 20. Partner launch gate (Jul 29, 2026)

**Share URL with Altium (not the homepage):** `https://learn.eduengteam.com/altium-develop`  
**Vercel alias (backup):** `https://eet-electronics-product-dev-library.vercel.app/altium-develop`

| # | Gate item | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Dedicated `/altium-develop` landing | **Pass** | Independence, value prop, workflow embed, personas, CSV Develop tutorials, paths, tools, compare + ESP32 links, CTA UTMs, feedback control |
| 2 | Interactive workflow map | **Pass** | `/workflow` + `/workflow/:stageSlug`, 8 stages, all tutorial IDs = Altium Develop from `data/videos.csv`; embed on landing |
| 3 | Six persona journeys | **Pass** | `/personas` + `/personas/:slug`; all `tutorialIds` resolve to Develop catalog rows (Designer IDs removed) |
| 4 | Real analytics + My Activity rename | **Pass (code) / Partial (keys)** | `/my-activity` = browser-local only; `/impact` → redirect; `/insights` refuses fake KPIs; events instrumented; needs `VITE_POSTHOG_KEY` / `VITE_GA_ID` |
| 5 | 20–30 enriched Develop tutorials | **Pass** | 29 overlays in `developEnrichment.overlay.json` (`9effc07`) |
| 6 | Central feedback collection | **Pass (code) / Partial (env)** | Tutorial Feedback → `api/feedback.ts` (webhook/Resend/GitHub); `/feedback-inbox` stub; needs server delivery env |
| 7 | Custom domain + launch trust | **Pass** | Canonical/OG/sitemap/robots/favicons/Beta/`/changelog` (`efb6be7`); `learn.eduengteam.com` DNS+SSL **LIVE** (Jul 29, 2026) |
| 8 | Security / a11y trust | **Pass** | 333/333 playable; admin blocked without password in prod; `VITE_ADMIN_PASSWORD` set on Vercel (redeploy to bake); modal a11y; ErrorBoundary; 404; report control; smoke deeplinks |
| — | Strong additions | **Pass** | ESP32 case study, compare-workflows, freshness chips (`92b0616`) |

**Phase 2 still forbidden / deferred:** accounts, certificates as primary UX, full Supabase, AI chat, enrich all 333, Arabic, paid.

**Ashraf manual before Altium review:** see FORAshraf.md → “Ashraf must do manually.”

---

## Quick reference — key source files

| Area | Path |
|------|------|
| Routes | `src/routes.ts`, `src/App.tsx` |
| Partner hub | `src/components/AltiumDevelopLandingView.tsx` |
| Catalog runtime | `src/data/catalog.ts`, `catalog.generated.json`, `curatedEnrichment.ts`, `developEnrichment.overlay.json` |
| Catalog source (primary) | `data/videos.csv` ← `npm run md:to-csv` ← `data/parsed-from-md-report.json` / MD list |
| Paths / projects / roles / personas / workflow | `learningPaths.ts`, `projects.ts`, `roles.ts`, `personas.ts`, `workflowStages.ts` |
| Feedback API | `api/feedback.ts`, `src/utils/feedback.ts` |
| Storage | `src/utils/storage.ts` |
| Search | `src/utils/search.ts` |
| Analytics / UTM / JSON-LD / site | `analytics.ts`, `outbound.ts`, `jsonld.ts`, `siteConfig.ts` |
| Import / audit / SEO | `scripts/md-to-csv.mjs`, `import-catalog.mjs`, `audit-youtube-embeds.mjs`, `generate-seo.mjs`, `smoke-deep-links.mjs` |
| Deploy | `vercel.json`, `.env.example` |
| Narrative sister doc | `FORAshraf.md` |

---

*Partner launch gate documented Jul 29, 2026 (`92b0616` lineage). When inventory numbers change, re-run `npm run md:to-csv` → `import:catalog` → `audit:youtube:apply` and update §16.*
