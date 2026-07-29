#!/usr/bin/env node
/**
 * Build data/videos.csv from the sibling MD parse report (preferred) or re-parse MD.
 *
 * Usage:
 *   node scripts/md-to-csv.mjs
 *   npm run md:to-csv
 *
 * Preference order:
 *   1. data/parsed-from-md-report.json (333 unique, already deduped)
 *   2. Fallback: re-parse "get me each video title and link*.md"
 *
 * CSV wins over xlsx at import time (Ashraf request). Does NOT invent YouTube IDs.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPORT_PATH = path.join(ROOT, 'data/parsed-from-md-report.json');
const OUT_CSV = path.join(ROOT, 'data/videos.csv');
const OUT_REPORT = path.join(ROOT, 'data/md-to-csv-report.json');

const YT_ID_RE = /^[A-Za-z0-9_-]{11}$/;
const URL_ID_RE =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/;

const CSV_COLUMNS = [
  'id',
  'slug',
  'title',
  'youtube_url',
  'youtube_video_id',
  'youtube_status',
  'product',
  'difficulty',
  'short_description',
  'duration_seconds',
  'published_at',
  'playlist',
  'source_notes',
  'enrichment_status',
];

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

function extractYoutubeId(url) {
  const m = String(url || '').match(URL_ID_RE);
  return m && YT_ID_RE.test(m[1]) ? m[1] : null;
}

function normalizeProduct(raw, title) {
  if (raw && /develop/i.test(raw)) return 'Altium Develop';
  if (raw && /365/i.test(raw)) return 'Altium 365';
  if (raw && /circuit\s*maker/i.test(raw)) return 'CircuitMaker';
  if (raw && /designer/i.test(raw)) return 'Altium Designer';
  const t = String(title || '');
  if (/altium\s*develop/i.test(t)) return 'Altium Develop';
  if (/altium\s*365/i.test(t)) return 'Altium 365';
  if (/circuit\s*maker/i.test(t)) return 'CircuitMaker';
  if (/altium|atium\s*designer/i.test(t)) return 'Altium Designer';
  // Channel Altium-search hits often omit the brand in the title — default Designer.
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

/** Honest tag only for clear off-topic / search-tail non-Altium uploads. */
function isNonAltiumAdjacent(title, listIndex) {
  const t = String(title || '');
  if (/altium|atium/i.test(t)) return false;
  if (
    /arduino\s*pro\s*ide|easyeda|raspberry\s*pi|octopart marketing|embedded systems programming|project share: the best way/i.test(
      t
    )
  ) {
    return true;
  }
  // Remaining search-tail rows without Altium in the title (321–332 zone)
  if (listIndex != null && listIndex >= 321) return true;
  return false;
}

function csvEscape(value) {
  const s = String(value ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
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

function recordsFromParseReport(report) {
  const records = report.records || [];
  return records
    .map((r) => {
      const videoId = r.video_id && YT_ID_RE.test(r.video_id) ? r.video_id : extractYoutubeId(r.url);
      if (!videoId || !r.title) return null;
      return {
        title: String(r.title).trim(),
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
        youtubeId: videoId,
        productRaw: r.product,
        seriesHint: r.series_hint || '',
        listIndex: r.list_index == null ? null : Number(r.list_index),
        batch: r.batch,
        channel: r.channel || 'Educational Engineering Team',
        titleVariants: r.title_variants || [],
        sources: r.sources || [],
      };
    })
    .filter(Boolean);
}

function findSourceMd() {
  const files = fs.readdirSync(ROOT).filter((f) =>
    /^get me each video title and link.*\.md$/i.test(f)
  );
  if (!files.length) return null;
  files.sort();
  return path.join(ROOT, files[0]);
}

function parseNumberedLists(text) {
  const rows = [];
  const re =
    /^(\d+)\.\s+(.+?)\s+[—–-]\s+(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/\S+)/gm;
  let m;
  while ((m = re.exec(text)) !== null) {
    const listIndex = Number(m[1]);
    const title = m[2].trim().replace(/^["']|["']$/g, '');
    const url = m[3].trim().replace(/[)\].,;]+$/, '');
    const id = extractYoutubeId(url);
    if (!id || !title) continue;
    rows.push({
      title,
      youtubeUrl: `https://www.youtube.com/watch?v=${id}`,
      youtubeId: id,
      productRaw: null,
      seriesHint: '',
      listIndex,
      batch: null,
      channel: 'Educational Engineering Team',
      titleVariants: [],
      sources: [{ format: 'numbered_list_fallback' }],
    });
  }
  return rows;
}

function parseCsvFences(text) {
  const rows = [];
  const fenceRe = /```csv\s*([\s\S]*?)```/gi;
  let fence;
  while ((fence = fenceRe.exec(text)) !== null) {
    const lines = fence[1].split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (/^(title|video title|"video title"|"title")/i.test(line)) continue;
      let m = line.match(/^"([^"]*)"\s*,\s*"?(https?:\/\/[^",\s]+)"?\s*$/);
      if (!m) m = line.match(/^"?([^",]+)"?\s*,\s*"?(https?:\/\/[^",\s]+)"?\s*$/);
      if (!m) continue;
      const title = m[1].trim();
      const id = extractYoutubeId(m[2].trim().replace(/[)\].,;]+$/, ''));
      if (!id || !title || title.length < 3) continue;
      if (/https?$/i.test(title) || title.endsWith(' for PCB Sm')) continue;
      rows.push({
        title,
        youtubeUrl: `https://www.youtube.com/watch?v=${id}`,
        youtubeId: id,
        productRaw: null,
        seriesHint: '',
        listIndex: null,
        batch: null,
        channel: 'Educational Engineering Team',
        titleVariants: [],
        sources: [{ format: 'csv_fence_fallback' }],
      });
    }
  }
  return rows;
}

function dedupe(rows) {
  const byId = new Map();
  let dropped = 0;
  const sorted = [...rows].sort((a, b) => {
    const ai = a.listIndex == null ? 1e9 : a.listIndex;
    const bi = b.listIndex == null ? 1e9 : b.listIndex;
    return ai - bi;
  });
  for (const row of sorted) {
    if (byId.has(row.youtubeId)) {
      dropped++;
      const prev = byId.get(row.youtubeId);
      if (row.title !== prev.title) {
        prev.titleVariants = prev.titleVariants || [];
        if (!prev.titleVariants.includes(row.title)) prev.titleVariants.push(row.title);
      }
      continue;
    }
    byId.set(row.youtubeId, row);
  }
  return { unique: [...byId.values()], dropped };
}

let sourceMode = 'parse_report';
let unique;

if (fs.existsSync(REPORT_PATH)) {
  const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
  unique = recordsFromParseReport(report);
  console.log(`Using parse report: ${REPORT_PATH} (${unique.length} records)`);
} else {
  sourceMode = 'md_fallback';
  const mdPath = findSourceMd();
  if (!mdPath) {
    console.error('No parse report and no source markdown found.');
    process.exit(1);
  }
  const text = fs.readFileSync(mdPath, 'utf8');
  const { unique: u, dropped } = dedupe([...parseNumberedLists(text), ...parseCsvFences(text)]);
  unique = u;
  console.log(`Fallback MD parse: ${mdPath} (${unique.length} unique, ${dropped} dups dropped)`);
}

unique.sort((a, b) => {
  const ai = a.listIndex == null ? 1e9 : a.listIndex;
  const bi = b.listIndex == null ? 1e9 : b.listIndex;
  if (ai !== bi) return ai - bi;
  return a.title.localeCompare(b.title);
});

const outRows = unique.map((row, idx) => {
  const num = idx + 1;
  const id = `cat-${String(num).padStart(3, '0')}`;
  let product = normalizeProduct(row.productRaw, row.title);
  const nonAlt = isNonAltiumAdjacent(row.title, row.listIndex);
  if (nonAlt) product = 'Other / Adjacent';

  const difficulty = inferDifficulty(row.title, product);
  const playlist = row.seriesHint || '';
  const noteParts = [
    `Source: MD channel Altium search dump via ${sourceMode}`,
    row.listIndex != null ? `list#${row.listIndex}` : 'csv-only (no list_index)',
    row.batch?.batch_range ? `batch ${row.batch.batch_range}` : null,
    row.channel ? `channel=${row.channel}` : null,
    nonAlt
      ? 'HONEST: non-Altium / adjacent upload kept from search-tail; not an Altium Designer/Develop lesson'
      : null,
    row.titleVariants?.length ? `alt titles: ${row.titleVariants.join(' | ')}` : null,
  ].filter(Boolean);

  return {
    id,
    slug: slugify(row.title, num),
    title: row.title,
    youtube_url: row.youtubeUrl,
    youtube_video_id: row.youtubeId,
    youtube_status: 'id_present',
    product,
    difficulty,
    short_description: `Educational Engineering Team tutorial: ${row.title}`.slice(0, 220),
    duration_seconds: 0,
    published_at: '',
    playlist,
    source_notes: noteParts.join('; '),
    enrichment_status: 'url_recovered',
  };
});

ensureUniqueSlugs(outRows);

fs.mkdirSync(path.dirname(OUT_CSV), { recursive: true });
const header = CSV_COLUMNS.join(',');
const body = outRows.map((r) => CSV_COLUMNS.map((c) => csvEscape(r[c])).join(',')).join('\n');
fs.writeFileSync(OUT_CSV, `${header}\n${body}\n`);

const adjacent = outRows.filter((r) => r.product === 'Other / Adjacent').length;
const summary = {
  sourceMode,
  parseReport: sourceMode === 'parse_report' ? path.basename(REPORT_PATH) : null,
  uniqueRows: outRows.length,
  adjacentOrNonAltium: adjacent,
  designer: outRows.filter((r) => r.product === 'Altium Designer').length,
  develop: outRows.filter((r) => r.product === 'Altium Develop').length,
  precedence:
    'CSV built from MD parse wins over Educational_Engineering_Team_Altium_Video_Catalog.xlsx at import.',
  outCsv: path.relative(ROOT, OUT_CSV),
  generatedAt: new Date().toISOString(),
};
fs.writeFileSync(OUT_REPORT, JSON.stringify(summary, null, 2));

console.log(JSON.stringify(summary, null, 2));
console.log(`\nWrote ${OUT_CSV}`);
