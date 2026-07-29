# EET Electronics Product Development Library — Feature Inventory

> **Who this is for:** Ashraf (and anyone joining the project) who needs a single, honest map of what the product *actually ships today* — not the aspirational brief alone.  
> **Live URL:** [https://eet-electronics-product-dev-library.vercel.app](https://eet-electronics-product-dev-library.vercel.app)  
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
8. [Impact dashboard](#8-impact-dashboard)
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
| Data | Static JSON + TypeScript data modules (no backend) |
| Progress | Browser `localStorage` only |

**Canonical product name in UI / titles:** *EET Electronics Product Development Library*  
**Aspirational domain (not DNS-wired yet):** `learn.eduengteam.com` (shown in chrome; live traffic is still the Vercel URL).

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
| `/skills` | Skills index → jumps to `/tutorials?skill=…` |
| `/impact` | Local Impact dashboard |
| `/tools/shortcuts` | Keyboard shortcuts lab |
| `/tools/activebom` | ActiveBOM risk simulator (sample BOMs) |
| `/tools/drc` | DRC assistant (rule database) |
| `/tools/stackup` | Stackup inspector (presets) |
| `/notes` | Personal notes hub |
| `/glossary` | PCB / Altium glossary |
| `/about` | About + independence disclaimer |
| `/privacy` | Privacy policy |
| `/admin` | Read-only catalog status admin |
| `*` | Redirect → `/` |

**Query params that matter:**

- `/tutorials?product=Altium%20Designer` (or Develop)
- `/tutorials?skill=…`
- `/tutorials?path=…` / `?project=…` (path/project filter sync in catalog)

**Nav chrome:**

- Sticky navbar: primary tabs (Paths, Projects, Products, Roles, Skills, Tutorials, Impact) + **Tools** dropdown (shortcuts, ActiveBOM, DRC, stackup, notes, glossary)
- Global search overlay (`SearchOverlay`)
- Skill quiz entry (“Take Skill Quiz”)
- Completion / bookmark counts from local progress
- Footer: learning nav, product counts, Impact, About, Privacy, contact mailto

---

## 3. Homepage

Implemented in `Hero` + home route block in `App.tsx`.

**Hero sections (top → bottom):**

1. **Identity pill** — “Educational Engineering Team Catalog” with live counts (`{total} named videos · {playable} playable embeds`).
2. **H1 + positioning copy** — “Master Modern Electronics Product Development”; independence + honesty about audit-derived counts.
3. **Search** — jumps to catalog tab; popular chips (DRC, ESP32, ActiveBOM, SolidWorks).
4. **Primary CTAs** — Start a Learning Path; Browse by Engineering Role; product filter chips (Designer / Develop with live counts).
5. **Stat strip** — named videos, learning paths, project hubs, role hubs (all derived from data length, not hardcoded marketing numbers).
6. **Honest status line** — playable / playlist-only / missing; notes custom domain still manual.
7. **Choose your goal** — path / project / catalog.
8. **Browse by role / product** teasers.
9. **Projects + Impact teasers.**

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

### Tabs

| Tab | Behavior |
|-----|----------|
| Overview & Outcomes | Summary, skills, resources, thin-enrichment banner, Altium trial CTA, official docs CTA, related lessons |
| Chapters | Timestamp seek into player (or “enrichment pending”) |
| Transcript | Searchable lines when present |
| Commands | Shown only if `commands[]` exists |
| My Notes | Per-tutorial notes → `localStorage` |

### Enrichment states

| Status | Meaning in product |
|--------|--------------------|
| `hand_enriched` | Overlay from `curatedEnrichment.ts` (chapters / transcript / commands / richer copy) |
| `playable_candidate` | Sheet + oEmbed public; thin pedagogical depth until enriched |
| `url_recovered_unverified` | Recovered but not trusted for embed |
| `enrichment_pending` | Typically playlist-only / missing — no public embed |

**Current depth (runtime):** ~15 hand-enriched (chapters), ~6 with transcripts, ~9 with command lists — out of 201 rows.

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

### Skills — `/skills` (`SkillsIndexView`)

Thin index of **~55** skill tags derived from the catalog. Selecting a skill navigates to `/tutorials?skill=…` — catalog owns results rendering.

---

## 8. Impact dashboard

**Route:** `/impact` · `ImpactDashboardView`

**Be radically honest here:** this is **not** site-wide analytics. It reads **this browser’s** `localStorage`:

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
- Export JSON “Altium partnership report” — explicitly labeled as local-session only
- Partnership CTA links (Altium trial / site) with UTM tagging

**UI banner:** “Local engagement only — not site-wide analytics.”

If you clear site data, the “impact” story for that visitor resets. There is no multi-user truth until Phase 2.

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
- Third-party Altium destinations have their own policies
- Last updated label: January 2026
- Contact mailto

**Privacy honesty gap to watch:** If `VITE_GA_ID` / `VITE_POSTHOG_KEY` are set in production, third-party analytics scripts *do* load — update Privacy copy when those keys go live.

---

## 12. Admin

**Route:** `/admin` · `AdminView` (read-only)

- Optional gate via `VITE_ADMIN_PASSWORD` (`?key=` or password prompt → `sessionStorage`)
- If password unset → open in local/dev (intentional stub)
- Filters: all / public / pending / playlist_only
- Table: id, title, product, YouTube status, enrichment status, playable flag
- Shows import meta (source file, row counts)

**No mutations** — catalog changes happen via import/audit scripts, not the admin UI.

---

## 13. Analytics, UTMs & events

### Outbound UTMs (`utils/outbound.ts`)

Applied to **altium.com** destinations:

| Param | Value |
|-------|--------|
| `utm_source` | `eet_learning_hub` |
| `utm_medium` | `tutorial` |
| `utm_campaign` | `altium_develop_library` |
| `utm_content` | tutorial slug when available |

Non-Altium URLs pass through unchanged.

### Event stub (`utils/analytics.ts`)

Loads **only if env vars are set**:

- `VITE_POSTHOG_KEY` → PostHog
- `VITE_GA_ID` → gtag / GA4

Without keys: `trackEvent` / `trackPageView` are safe no-ops.

**Events fired in code today:**

| Event | When |
|-------|------|
| `page_view` | Every route change |
| `tutorial_start` | Opening a playable tutorial |
| `playback_milestone` | 25 / 50 / 75 / 100% |
| `cta_click` | Altium trial / docs / general outbound |
| `search` | Catalog search / some filter changes |
| `search_zero_results` | Empty search |

### Local logging (always on, browser-only)

- Outbound clicks → Impact + counter
- Search queries (≥2 chars) → Impact gap analysis

---

## 14. SEO

| Asset | Behavior |
|-------|----------|
| `index.html` | Base title + meta description + dark color-scheme + SVG favicon + fonts |
| `useDocumentTitle` | Per-route / per-tutorial titles: `{Page} · EET Electronics Product Development Library` |
| `public/robots.txt` | `Allow: /` + sitemap URL pointing at the Vercel host |
| `public/sitemap.xml` | Regenerated by `import:catalog` — home, hubs, and **per-tutorial** URLs |
| JSON-LD | Client-injected `VideoObject` for playable tutorials only |
| SPA caveat | Vercel rewrites all paths to `index.html` — crawlers get the shell; rich per-URL HTML is limited without SSR |

**Sitemap base URL:** `https://eet-electronics-product-dev-library.vercel.app` (hardcoded in import script).

---

## 15. Catalog import & YouTube audit pipeline

### Source of truth (precedence)

1. **`data/videos.csv`** (primary) — built from the channel Altium-search markdown dump via `data/parsed-from-md-report.json` / `npm run md:to-csv`. **Wins over xlsx** when present (Ashraf request).
2. **`Educational_Engineering_Team_Altium_Video_Catalog.xlsx`** — fallback only if CSV is absent.

Devil’s advocate: MD/CSV and xlsx overlap but are not identical (different row counts, ID numbering, some playlist-only xlsx rows). Do not merge silently — CSV from MD is authoritative for the live catalog.

### npm scripts (`package.json`)

| Command | What it does |
|---------|----------------|
| `npm run md:to-csv` | Parse report (or MD) → `data/videos.csv` |
| `npm run import:catalog` | Prefer CSV → oEmbed-validate → generated catalog + report + sitemap |
| `npm run import:catalog:fast` | Same, `--skip-oembed` |
| `npm run import:videos:csv` | Explicit CSV import (`import-catalog.mjs --csv`) |
| `npm run audit:youtube` | Re-oEmbed every ID; write Markdown + JSON report |
| `npm run audit:youtube:apply` | Audit + rewrite `catalog.generated.json` (retitle / demote weak matches) |
| `npm run lint` | `tsc --noEmit` |
| `npm run build` | Production build |

### Import outputs

- `src/data/catalog.generated.json` — catalog rows + `meta` (sourceKind, stats)
- `scripts/import-report.json` — counts + duplicate title pairs
- `public/sitemap.xml`

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

Derived from `catalogCounts` / post-audit meta after MD→CSV import (Jul 29, 2026):

| Metric | Count |
|--------|------:|
| Named catalog rows | **333** |
| With YouTube URL / ID | 333 |
| **Playable embeds (`public`)** | **332** |
| Unverified (embed withheld) | 1 |
| Playlist-only | 0 |
| Altium Designer | ~266 |
| Altium Develop | ~55 |
| Other / Adjacent (honest search-tail) | ~12 |
| Hand-enriched overlays | 15 |
| Enrichment goal | 333 |

**Channel meta (import):** Educational Engineering Team · `UCQfDCLyWEHMV3ERhD0au0Ug`

**Content hubs (not catalog rows):** 10 learning paths · 6 projects · 8 roles — tutorial IDs remapped to new `cat-*` via YouTube ID.

---
## 17. Design system & UX notes

**Visual language**

- Dark slate base (`slate-950` / `900`) with blue/cyan accents — “engineering console,” not light marketing SaaS.
- Fonts: **Space Grotesk** (display), **Inter** (UI), **JetBrains Mono** (meta, statuses, filters).
- Product badges: Designer = blue; Develop = cyan.
- Status honesty is a first-class UX pattern (amber enrichment banners, mono status chips).

**Component primitives** (`src/components/ui/`): Button, Card, Input, SearchInput, Badge, Breadcrumbs.

**Patterns that matter**

- Sticky nav + Tools dropdown keeps labs discoverable without crowding primary IA.
- Tutorial detail as modal + URL slug = shareable deep links without a separate page shell.
- Counts always derived from data (`catalogCounts`, `.length`) so marketing copy cannot drift from inventory.
- Confetti on complete is intentional delight; certificates intentionally demoted.

**A11y / polish gaps (real):** modal focus trap / scroll lock are basic; no dedicated keyboard help beyond the shortcuts lab; no account sync for progress.

---

## 18. What is NOT built yet / Phase 2

Call these out so nobody confuses roadmap with shipping:

| Item | Status |
|------|--------|
| **Supabase / Postgres backend** | Not started — no multi-user progress or server analytics |
| **Custom domain `learn.eduengteam.com`** | Branded in UI; DNS + Vercel attach still manual |
| **PostHog / GA4 keys in production** | Code stubs exist; no-op until `VITE_*` env set |
| **Full chapter/transcript enrichment for all 201** | Only ~15 hand-enriched |
| **Recover 33 playlist-only + 3 missing URLs** | Catalog-honest placeholders only |
| **SSR / prerender for SEO** | SPA rewrite only |
| **Certificate issuance in path UX** | Component file present, not primary flow |
| **Gemini / AI features** | `@google/genai` dependency + `.env.example` note — not productized |
| **Live distributor / ActiveBOM APIs** | Simulator uses sample data |
| **User accounts, sync, teams** | Explicitly deferred |
| **Admin mutations / CMS** | Read-only status table |
| **Official Altium partnership dashboard** | Local export JSON only |

---

## 19. Devil’s advocate — where trust can still break

1. **“201 tutorials” on the homepage can still mislead** if a visitor equates named rows with playable lessons. The UI tries to say “163 playable,” but skimmers will miss it. Lead with playable in partnership decks.
2. **Impact dashboard looks like growth metrics.** Without the amber disclaimer, a partner could screenshot localStorage numbers as platform KPIs. Treat export JSON as a *demo of instrumentation*, not proof of traffic.
3. **Tools feel “live.”** ActiveBOM / DRC / stackup are excellent teaching UX — and dangerous if someone quotes sample stock or impedance as fab truth.
4. **SPA SEO ceiling.** Sitemap + JSON-LD help, but Google mostly sees one shell. Custom domain + SSR is the real SEO unlock, not more meta tags.
5. **Privacy copy vs future analytics.** Shipping GA/PostHog without updating Privacy is a self-inflicted trust bug.
6. **Admin with empty password** is fine for local; catastrophic if that builds to prod. Always set `VITE_ADMIN_PASSWORD` on Vercel.
7. **Enrichment asymmetry.** Hand-enriched lessons feel like a premium product; thin audit rows feel like a spreadsheet dump. The product story should be “honest inventory + deepening enrichment,” not “finished academy.”

**Stronger long-term approach:** keep the honesty gates (status, oEmbed, demote-over-fake), instrument real analytics only when Privacy and Impact UI stop implying browser-local = global, and treat the 33+3 recovery queue as content ops with the same audit script — not as a frontend feature.

---

## Quick reference — key source files

| Area | Path |
|------|------|
| Routes | `src/routes.ts`, `src/App.tsx` |
| Catalog runtime | `src/data/catalog.ts`, `catalog.generated.json`, `curatedEnrichment.ts` |
| Paths / projects / roles | `src/data/learningPaths.ts`, `projects.ts`, `roles.ts` |
| Storage | `src/utils/storage.ts` |
| Search | `src/utils/search.ts` |
| Analytics / UTM / JSON-LD | `src/utils/analytics.ts`, `outbound.ts`, `jsonld.ts` |
| Import / audit | `scripts/import-catalog.mjs`, `scripts/audit-youtube-embeds.mjs` |
| Deploy | `vercel.json`, `.env.example` |
| Narrative sister doc | `FORAshraf.md` |

---

*Generated from the codebase as of the Jul 29, 2026 catalog import + YouTube embed audit. When inventory numbers change, re-run `npm run import:catalog` / `audit:youtube` and update §16.*
