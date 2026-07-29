#!/usr/bin/env node
/**
 * Import Educational_Engineering_Team_Altium_Video_Catalog.xlsx → structured JSON.
 *
 * Usage:
 *   node scripts/import-catalog.mjs
 *   node scripts/import-catalog.mjs --skip-oembed   # faster, format-only validation
 *   node scripts/import-catalog.mjs --xlsx path/to/file.xlsx
 *
 * Outputs:
 *   src/data/catalog.generated.json
 *   scripts/import-report.json
 *   public/sitemap.xml
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const skipOembed = args.includes('--skip-oembed');
const xlsxIdx = args.indexOf('--xlsx');
const XLSX_PATH =
  xlsxIdx >= 0 && args[xlsxIdx + 1]
    ? path.resolve(args[xlsxIdx + 1])
    : path.join(ROOT, 'Educational_Engineering_Team_Altium_Video_Catalog.xlsx');

const OUT_JSON = path.join(ROOT, 'src/data/catalog.generated.json');
const OUT_REPORT = path.join(ROOT, 'scripts/import-report.json');
const OUT_SITEMAP = path.join(ROOT, 'public/sitemap.xml');
const SITE_BASE = 'https://eet-electronics-product-dev-library.vercel.app';

const YT_ID_RE = /^[A-Za-z0-9_-]{11}$/;

function slugify(title, fallbackId) {
  const base = String(title || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || `video-${fallbackId}`;
}

function extractYoutubeId(rawId, rawUrl) {
  if (rawId && YT_ID_RE.test(String(rawId).trim())) return String(rawId).trim();
  const url = String(rawUrl || '');
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function normalizeProduct(raw) {
  const p = String(raw || '').trim();
  if (/develop/i.test(p)) return 'Altium Develop';
  if (/365/i.test(p)) return 'Altium 365';
  if (/circuit\s*maker/i.test(p)) return 'CircuitMaker';
  return 'Altium Designer';
}

function inferDifficulty(title, product) {
  const t = title.toLowerCase();
  if (/advanced|high.?speed|rf |signal integrity|ddr|emc|multi.?board|thermal/.test(t)) {
    return 'Advanced';
  }
  if (/intro|getting started|install|basics|beginner|overview|workspace tutorial/.test(t)) {
    return 'Beginner';
  }
  if (product === 'Altium Develop') return 'Intermediate';
  return 'Intermediate';
}

function inferRole(title, product) {
  const t = title.toLowerCase();
  if (/bom|activebom|procurement|supplier|component library|footprint|symbol|mpn|lifecycle/.test(t)) {
    return 'Procurement & Components';
  }
  if (/gerber|manufactur|assembly|dfm|pick.?&.?place|outjob|draftsman|fab/.test(t)) {
    return 'Manufacturing & Quality';
  }
  if (/requirement|compliance|rohs|reach|emc|fcc|ce /.test(t)) {
    return 'Compliance & Sustainability';
  }
  if (/review|collaboration|team|management|version|history|markup|develop workspace/.test(t) || product === 'Altium Develop') {
    return 'Engineering Leadership';
  }
  if (/arduino|esp32|firmware|embedded|iot|microcontroller|pin/.test(t)) {
    return 'Product & Applications';
  }
  return 'Hardware & PCB Engineering';
}

function inferSkills(title, product) {
  const t = title.toLowerCase();
  const skills = new Set();
  const rules = [
    [/schematic/, 'Schematic Capture'],
    [/footprint|ipc/, 'PCB Footprints'],
    [/symbol|library/, 'Component Libraries'],
    [/rout(e|ing)|trace/, 'Interactive Routing'],
    [/drc|design rule/, 'Design Rule Checks'],
    [/gerber|manufactur|outjob|pick.?&.?place/, 'Manufacturing Release'],
    [/bom|activebom/, 'BOM & Supply Chain'],
    [/stackup|layer/, 'Layer Stackup'],
    [/3d|step|mcad|solidworks/, 'ECAD-MCAD'],
    [/power|buck|regulator/, 'Power Electronics'],
    [/rf|antenna|wifi|bluetooth/, 'RF Layout'],
    [/develop|workspace|collaboration|review/, 'Cloud Collaboration'],
    [/install|license|setup|getting started/, 'Environment Setup'],
    [/arduino|esp32|microcontroller/, 'Embedded Hardware'],
    [/search/, 'Search & Navigation'],
  ];
  for (const [re, skill] of rules) {
    if (re.test(t)) skills.add(skill);
  }
  if (skills.size === 0) {
    skills.add(product === 'Altium Develop' ? 'Altium Develop Workflows' : 'Altium Designer Workflows');
  }
  return [...skills].slice(0, 5);
}

function inferPublishedDate(yearEra, month) {
  const yearMatch = String(yearEra || '').match(/(20\d{2})/);
  const year = yearMatch ? yearMatch[1] : '2024';
  const m = String(month || '').toLowerCase();
  const monthMap = {
    january: '01',
    february: '02',
    march: '03',
    april: '04',
    may: '05',
    june: '06',
    july: '07',
    august: '08',
    september: '09',
    october: '10',
    november: '11',
    december: '12',
  };
  let mm = '06';
  for (const [name, num] of Object.entries(monthMap)) {
    if (m.includes(name)) {
      mm = num;
      break;
    }
  }
  return `${year}-${mm}-15`;
}

function inferProjectId(title) {
  const t = title.toLowerCase();
  if (/arduino/.test(t)) return 'proj-arduino';
  if (/esp32/.test(t)) return 'proj-esp32';
  if (/buck|regulator|dc.?dc|power supply/.test(t)) return 'proj-buck';
  if (/relay/.test(t)) return 'proj-relay';
  return undefined;
}

function inferLearningPathIds(title, product, role) {
  const t = title.toLowerCase();
  const ids = new Set();
  if (/install|getting started|interface|project|schematic|symbol|environment/.test(t) && product === 'Altium Designer') {
    ids.add('path-001');
  }
  if (/footprint|symbol|library|ipc|component/.test(t)) ids.add('path-002');
  if (/rout(e|ing)|placement|layout|polygon|copper|drc/.test(t)) ids.add('path-003');
  if (/arduino/.test(t)) ids.add('path-004');
  if (/buck|power|regulator|thermal/.test(t)) ids.add('path-005');
  if (product === 'Altium Develop' || /develop|workspace|cloud/.test(t)) ids.add('path-006');
  if (/mcad|solidworks|collaboration|multidisciplinary|requirement/.test(t)) ids.add('path-007');
  if (/bom|activebom|supply|lifecycle|procurement/.test(t)) ids.add('path-008');
  if (/requirement|compliance|verification/.test(t)) ids.add('path-009');
  if (role === 'Engineering Leadership' || /review|management|version|history/.test(t)) {
    ids.add('path-010');
  }
  if (ids.size === 0) {
    ids.add(product === 'Altium Develop' ? 'path-006' : 'path-001');
  }
  return [...ids];
}

function shortDescriptionFrom(title, series, notes) {
  const base = notes || series || `Educational Engineering Team tutorial: ${title}`;
  return String(base).replace(/\s+/g, ' ').trim().slice(0, 220);
}

async function checkOembed(youtubeId) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${youtubeId}`)}&format=json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json();
      return { ok: true, title: data.title || null, author: data.author_name || null };
    }
    if (res.status === 404 || res.status === 401) return { ok: false, reason: `http_${res.status}` };
    return { ok: false, reason: `http_${res.status}` };
  } catch (err) {
    return { ok: false, reason: err?.name === 'TimeoutError' ? 'timeout' : 'network_error' };
  }
}

async function mapPool(items, concurrency, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

function ensureUniqueSlugs(rows) {
  const seen = new Map();
  for (const row of rows) {
    let slug = row.slug;
    if (!seen.has(slug)) {
      seen.set(slug, 1);
      continue;
    }
    const n = seen.get(slug) + 1;
    seen.set(slug, n);
    row.slug = `${slug}-${n}`;
  }
}

console.log(`Reading ${XLSX_PATH}`);
if (!fs.existsSync(XLSX_PATH)) {
  console.error('Catalog xlsx not found.');
  process.exit(1);
}

const workbook = XLSX.readFile(XLSX_PATH, { cellDates: true });
const sheet = workbook.Sheets['Catalog'] || workbook.Sheets[workbook.SheetNames[0]];
const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: null, range: 3 }); // header row is Excel row 4 (0-index 3)

const tutorials = [];
const titleIndex = new Map();
const idIndex = new Map();
const duplicates = [];

for (const raw of rawRows) {
  const num = Number(raw['#']);
  if (!Number.isFinite(num)) continue;

  const title = String(raw['Video Title'] || '').trim();
  if (!title) continue;

  const youtubeId = extractYoutubeId(raw['Video ID'], raw['YouTube URL']);
  const urlType = String(raw['URL Type'] || '').trim();
  const youtubeUrl = raw['YouTube URL'] ? String(raw['YouTube URL']).trim() : null;
  const product = normalizeProduct(raw['Product']);
  const id = `cat-${String(num).padStart(3, '0')}`;
  const slug = slugify(title, num);

  let youtubeStatus = 'missing';
  if (urlType.toLowerCase().includes('playlist') && !youtubeId) {
    youtubeStatus = 'playlist_only';
  } else if (youtubeId && YT_ID_RE.test(youtubeId)) {
    youtubeStatus = 'id_present'; // refined after oEmbed
  } else if (youtubeUrl && !youtubeId) {
    youtubeStatus = 'invalid';
  }

  const publishedDate = inferPublishedDate(raw['Year / Era'], raw['Month']);
  const role = inferRole(title, product);
  const difficulty = inferDifficulty(title, product);
  const skills = inferSkills(title, product);
  const learningPathIds = inferLearningPathIds(title, product, role);
  const projectId = inferProjectId(title);
  const notes = raw['Notes'] ? String(raw['Notes']).trim() : '';
  const series = raw['Series / Playlist'] ? String(raw['Series / Playlist']).trim() : '';
  const liveStatus = raw['Live Status'] ? String(raw['Live Status']).trim() : '';
  const evidenceClass = raw['Evidence Class'] ? String(raw['Evidence Class']).trim() : '';

  const enrichmentStatus =
    youtubeStatus === 'id_present' ? 'url_recovered' : 'enrichment_pending';

  const shortDescription = shortDescriptionFrom(title, series, notes);
  const fullSummary =
    notes ||
    `${title}. Recovered from the Educational Engineering Team Altium video audit (${evidenceClass || 'archive'}). Live status note: ${liveStatus || 'not independently re-verified at import time'}.`;

  const tutorial = {
    id,
    catalogNumber: num,
    youtubeId: youtubeId || `eet_pending_${String(num).padStart(3, '0')}`,
    youtubeUrl,
    youtubeStatus,
    enrichmentStatus,
    urlType,
    title,
    slug,
    shortDescription,
    fullSummary,
    durationSeconds: 0,
    durationFormatted: '—',
    publishedDate,
    product,
    difficulty,
    role,
    skills,
    projectId,
    learningPathIds,
    chapters: [],
    transcript: undefined,
    commands: undefined,
    resources: undefined,
    officialDocUrl: 'https://www.altium.com/documentation',
    altiumTrialUrl:
      'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library',
    featured: num <= 12 || product === 'Altium Develop' && num >= 180,
    series,
    evidenceClass,
    liveStatus,
    sourceNotes: notes,
    yearEra: raw['Year / Era'] ? String(raw['Year / Era']) : '',
    month: raw['Month'] ? String(raw['Month']) : '',
  };

  const normTitle = title.toLowerCase().replace(/\s+/g, ' ').trim();
  if (titleIndex.has(normTitle)) {
    duplicates.push({ type: 'title', a: titleIndex.get(normTitle), b: id, title });
  } else {
    titleIndex.set(normTitle, id);
  }
  if (youtubeId) {
    if (idIndex.has(youtubeId)) {
      duplicates.push({ type: 'youtubeId', a: idIndex.get(youtubeId), b: id, youtubeId });
    } else {
      idIndex.set(youtubeId, id);
    }
  }

  tutorials.push(tutorial);
}

ensureUniqueSlugs(tutorials);

const withIds = tutorials.filter((t) => YT_ID_RE.test(t.youtubeId) && !t.youtubeId.startsWith('eet_'));
console.log(`Parsed ${tutorials.length} tutorials (${withIds.length} with YouTube IDs)`);

if (!skipOembed && withIds.length > 0) {
  console.log('Validating YouTube IDs via oEmbed (concurrency 8)…');
  const checks = await mapPool(withIds, 8, async (t) => {
    const result = await checkOembed(t.youtubeId);
    return { id: t.id, youtubeId: t.youtubeId, ...result };
  });
  const byId = new Map(checks.map((c) => [c.id, c]));
  for (const t of tutorials) {
    const check = byId.get(t.id);
    if (!check) {
      if (t.youtubeStatus === 'id_present') t.youtubeStatus = 'missing';
      continue;
    }
    if (check.ok) {
      t.youtubeStatus = 'public';
      t.enrichmentStatus = 'playable_candidate';
      t.oembedTitle = check.title;
      t.oembedAuthor = check.author;
    } else {
      t.youtubeStatus = check.reason === 'http_404' || check.reason === 'http_401' ? 'unavailable' : 'unverified';
      t.enrichmentStatus = 'url_recovered_unverified';
      t.oembedError = check.reason;
    }
  }
} else if (skipOembed) {
  console.log('Skipping oEmbed (--skip-oembed). Marking ID-present rows as unverified.');
  for (const t of tutorials) {
    if (t.youtubeStatus === 'id_present') {
      t.youtubeStatus = 'unverified';
      t.enrichmentStatus = 'url_recovered_unverified';
    }
  }
}

const stats = {
  totalRows: tutorials.length,
  withYoutubeUrl: tutorials.filter((t) => !!t.youtubeUrl).length,
  withYoutubeId: withIds.length,
  public: tutorials.filter((t) => t.youtubeStatus === 'public').length,
  unverified: tutorials.filter((t) => t.youtubeStatus === 'unverified').length,
  unavailable: tutorials.filter((t) => t.youtubeStatus === 'unavailable').length,
  playlistOnly: tutorials.filter((t) => t.youtubeStatus === 'playlist_only').length,
  missing: tutorials.filter((t) => t.youtubeStatus === 'missing').length,
  invalid: tutorials.filter((t) => t.youtubeStatus === 'invalid').length,
  designer: tutorials.filter((t) => t.product === 'Altium Designer').length,
  develop: tutorials.filter((t) => t.product === 'Altium Develop').length,
  duplicates,
  importedAt: new Date().toISOString(),
  sourceFile: path.basename(XLSX_PATH),
  oembedSkipped: skipOembed,
};

const payload = {
  meta: {
    source: path.basename(XLSX_PATH),
    importedAt: stats.importedAt,
    channelId: 'UCQfDCLyWEHMV3ERhD0au0Ug',
    channelUrl: 'https://www.youtube.com/channel/UCQfDCLyWEHMV3ERhD0au0Ug',
    stats,
  },
  tutorials,
};

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.mkdirSync(path.dirname(OUT_SITEMAP), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));
fs.writeFileSync(OUT_REPORT, JSON.stringify(stats, null, 2));

const staticPaths = [
  '/',
  '/tutorials',
  '/learning-paths',
  '/projects',
  '/roles',
  '/products',
  '/impact',
  '/about',
  '/privacy',
  '/skills',
  '/glossary',
  '/notes',
  '/tools/shortcuts',
  '/tools/activebom',
  '/tools/drc',
  '/tools/stackup',
];
const urls = [
  ...staticPaths.map((p) => ({ loc: `${SITE_BASE}${p}`, priority: p === '/' ? '1.0' : '0.7' })),
  ...tutorials.map((t) => ({
    loc: `${SITE_BASE}/tutorials/${t.slug}`,
    priority: '0.6',
  })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(OUT_SITEMAP, sitemap);

console.log('\nImport complete:');
console.log(JSON.stringify(stats, null, 2));
console.log(`\nWrote ${OUT_JSON}`);
console.log(`Wrote ${OUT_REPORT}`);
console.log(`Wrote ${OUT_SITEMAP}`);
