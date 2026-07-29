#!/usr/bin/env node
/**
 * Re-audit every catalog YouTube ID via oEmbed and write a report.
 *
 * Usage:
 *   node scripts/audit-youtube-embeds.mjs
 *   node scripts/audit-youtube-embeds.mjs --apply   # also rewrite catalog.generated.json
 *
 * Outputs:
 *   scripts/youtube-embed-audit-report.json
 *   scripts/youtube-embed-audit-report.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'src/data/catalog.generated.json');
const REPORT_JSON = path.join(ROOT, 'scripts/youtube-embed-audit-report.json');
const REPORT_MD = path.join(ROOT, 'scripts/youtube-embed-audit-report.md');
const APPLY = process.argv.includes('--apply');

const YT_RE = /^[A-Za-z0-9_-]{11}$/;
const EXPECTED_CHANNEL = /educational engineering/i;
const STOP = new Set([
  'the','a','an','and','or','of','in','on','for','to','with','using','by','from','how',
  'your','you','altium','designer','develop','tutorial','lecture','bonus','video','course',
  'part','episode','guide','step','steps','explained',
]);

/** Titles too divergent to trust without a human watch — demote rather than invent a match. */
/** Hard-demote list for IDs that pass oEmbed but fail human topic review. Empty after cat-104 re-verify. */
const DEMOTE_IDS = new Set([]);

function tokens(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((t) => t && t.length > 1 && !STOP.has(t) && !/^\d+$/.test(t));
}

function containment(a, b) {
  const A = tokens(a);
  const B = new Set(tokens(b));
  if (!A.length) return 0;
  let hit = 0;
  for (const t of A) if (B.has(t)) hit++;
  return hit / A.length;
}

function jaccard(a, b) {
  const A = new Set(tokens(a));
  const B = new Set(tokens(b));
  if (!A.size && !B.size) return 1;
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / new Set([...A, ...B]).size;
}

function cleanDisplayTitle(ytTitle) {
  return String(ytTitle || '')
    .replace(/^[\s\d|.:_-]+/, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchOembed(id) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(12000),
      headers: { 'User-Agent': 'EET-Catalog-Audit/1.0' },
    });
    if (res.status === 404 || res.status === 401) {
      return { ok: false, error: 'unavailable', status: res.status };
    }
    if (!res.ok) return { ok: false, error: `http_${res.status}`, status: res.status };
    const data = await res.json();
    return { ok: true, title: data.title, author: data.author_name };
  } catch (err) {
    return { ok: false, error: err?.name === 'TimeoutError' ? 'timeout' : String(err.message || err) };
  }
}

function verdictFor(catalogTitle, product, oe) {
  if (!oe.ok) return { verdict: oe.error === 'unavailable' ? 'unavailable' : 'fetch_error', score: 0, cont: 0 };
  if (!EXPECTED_CHANNEL.test(oe.author || '')) {
    return { verdict: 'wrong_channel', score: 0, cont: 0 };
  }
  const jac = jaccard(catalogTitle, oe.title);
  const cont = containment(catalogTitle, oe.title);
  const score = Math.max(jac, cont);
  const ytDesignerOnly =
    /\bdesigner\b/i.test(oe.title) &&
    !/\bdevelop\b/i.test(oe.title) &&
    !/\bco-designer\b/i.test(oe.title);
  const productConflict = product === 'Altium Develop' && ytDesignerOnly;
  if (score >= 0.4 || (cont >= 0.5 && jac >= 0.25)) {
    return { verdict: productConflict ? 'match_product_conflict' : 'match', score, cont, jac, productConflict };
  }
  if (score >= 0.22 || cont >= 0.35) {
    return { verdict: productConflict ? 'weak_product_conflict' : 'weak_match', score, cont, jac, productConflict };
  }
  return { verdict: 'mismatch', score, cont, jac, productConflict };
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
const withIds = catalog.tutorials.filter((t) => YT_RE.test(t.youtubeId));
console.log(`Auditing ${withIds.length} YouTube IDs (apply=${APPLY})…`);

const live = [];
for (let i = 0; i < withIds.length; i++) {
  const t = withIds[i];
  const oe = await fetchOembed(t.youtubeId);
  const v = verdictFor(t.title, t.product, oe);
  live.push({
    id: t.id,
    slug: t.slug,
    youtubeId: t.youtubeId,
    catalogTitle: t.title,
    catalogProduct: t.product,
    youtubeStatus: t.youtubeStatus,
    oembedTitle: oe.title || null,
    oembedAuthor: oe.author || null,
    error: oe.error || null,
    ...v,
  });
  if ((i + 1) % 20 === 0 || i === withIds.length - 1) console.log(`  ${i + 1}/${withIds.length}`);
  await sleep(100);
}

const counts = {
  verified_match_unchanged: 0,
  retitled: 0,
  retitled_and_product_fixed: 0,
  demoted_to_unverified: 0,
  already_unverified: 0,
  playlist_only: catalog.tutorials.filter((t) => t.youtubeStatus === 'playlist_only').length,
  missing: catalog.tutorials.filter((t) => t.youtubeStatus === 'missing' || t.youtubeStatus === 'invalid').length,
};

const reportRows = [];
const byLive = new Map(live.map((r) => [r.id, r]));

for (const t of catalog.tutorials) {
  if (!YT_RE.test(t.youtubeId)) {
    reportRows.push({
      id: t.id,
      slug: t.slug,
      youtubeId: t.youtubeId,
      catalogTitle: t.title,
      youtubeTitle: null,
      author: null,
      status: t.youtubeStatus,
      action: t.youtubeStatus === 'playlist_only' ? 'playlist_only_no_embed' : 'missing_no_id',
    });
    continue;
  }

  const r = byLive.get(t.id);
  if (!r?.oembedTitle) {
    const prev = t.youtubeStatus;
    if (APPLY) {
      t.youtubeStatus = 'unverified';
      t.enrichmentStatus = 'url_recovered_unverified';
      delete t.oembedTitle;
      delete t.oembedAuthor;
      t.oembedError = r?.error || 'oembed_unavailable';
      t.liveStatus = 'YouTube oEmbed unavailable at audit time; embed withheld until re-verified';
    }
    const action = prev === 'unverified' ? 'kept_unverified' : 'demoted_to_unverified';
    if (action === 'kept_unverified') counts.already_unverified++;
    else counts.demoted_to_unverified++;
    reportRows.push({
      id: t.id,
      slug: t.slug,
      youtubeId: t.youtubeId,
      catalogTitle: t.title,
      youtubeTitle: null,
      author: null,
      status: 'unverified',
      action,
      note: r?.error || 'unavailable',
    });
    continue;
  }

  if (APPLY) {
    t.oembedTitle = r.oembedTitle;
    t.oembedAuthor = r.oembedAuthor;
    delete t.oembedError;
  }

  const titleBefore = t.title;
  const productBefore = t.product;
  const displayTitle = cleanDisplayTitle(r.oembedTitle);
  const cont = r.cont ?? containment(t.title, r.oembedTitle);
  const ytDesignerOnly =
    /\bdesigner\b/i.test(r.oembedTitle) &&
    !/\bdevelop\b/i.test(r.oembedTitle) &&
    !/\bco-designer\b/i.test(r.oembedTitle);

  if (DEMOTE_IDS.has(t.id)) {
    if (APPLY) {
      t.youtubeStatus = 'unverified';
      t.enrichmentStatus = 'url_recovered_unverified';
      t.liveStatus =
        'Catalog title and YouTube title diverge too far; embed withheld pending human confirmation';
    }
    counts.demoted_to_unverified++;
    reportRows.push({
      id: t.id,
      slug: t.slug,
      youtubeId: t.youtubeId,
      catalogTitle: t.title,
      youtubeTitle: r.oembedTitle,
      author: r.oembedAuthor,
      status: 'unverified',
      action: 'demoted_to_unverified_weak_topic_match',
      note: `containment=${cont.toFixed(2)}`,
    });
    continue;
  }

  let action = 'verified_match';
  const shouldRetitle =
    cont < 0.55 || r.verdict !== 'match' || (t.product === 'Altium Develop' && ytDesignerOnly);

  if (APPLY && shouldRetitle && displayTitle && displayTitle.toLowerCase() !== t.title.toLowerCase()) {
    t.title = displayTitle;
    const note = `Title aligned to YouTube oEmbed (was: ${titleBefore}).`;
    t.sourceNotes = t.sourceNotes ? `${t.sourceNotes} ${note}` : note;
    t.shortDescription = `Educational Engineering Team YouTube tutorial: ${displayTitle}`.slice(0, 220);
    t.fullSummary = `${displayTitle}. Verified against YouTube oEmbed (author: ${r.oembedAuthor}). Prior catalog title: ${titleBefore}.`;
    action = 'retitled_to_match_youtube';
    counts.retitled++;
  } else if (!APPLY && shouldRetitle && displayTitle && displayTitle.toLowerCase() !== t.title.toLowerCase()) {
    action = 'would_retitle_to_match_youtube';
    counts.retitled++;
  }

  if (t.product === 'Altium Develop' && ytDesignerOnly) {
    if (APPLY) {
      t.product = 'Altium Designer';
      const paths = new Set(t.learningPathIds || []);
      paths.add('path-001');
      t.learningPathIds = [...paths];
      t.skills = [
        ...(t.skills || []).filter((s) => s !== 'Altium Develop Workflows' && s !== 'Cloud Collaboration'),
        'Altium Designer Workflows',
      ].slice(0, 5);
    }
    action =
      action.includes('retitle')
        ? 'retitled_and_product_fixed_to_designer'
        : APPLY
          ? 'product_fixed_to_designer'
          : 'would_fix_product_to_designer';
    if (action.includes('product')) {
      if (action.includes('retitle')) {
        counts.retitled_and_product_fixed++;
        counts.retitled = Math.max(0, counts.retitled - 1);
      } else {
        counts.retitled_and_product_fixed++;
      }
    }
  }

  if (action === 'verified_match') counts.verified_match_unchanged++;

  if (APPLY && t.youtubeStatus !== 'unverified') {
    t.youtubeStatus = 'public';
    if (t.enrichmentStatus === 'url_recovered_unverified') t.enrichmentStatus = 'url_recovered';
  }

  reportRows.push({
    id: t.id,
    slug: t.slug,
    youtubeId: t.youtubeId,
    catalogTitleBefore: titleBefore,
    catalogTitle: APPLY ? t.title : titleBefore,
    youtubeTitle: r.oembedTitle,
    author: r.oembedAuthor,
    productBefore,
    product: APPLY ? t.product : productBefore,
    status: APPLY ? t.youtubeStatus : r.youtubeStatus,
    score: Number((r.score || 0).toFixed(3)),
    containment: Number(cont.toFixed(3)),
    action,
  });
}

if (APPLY) {
  catalog.meta = {
    ...catalog.meta,
    lastYoutubeAuditAt: new Date().toISOString(),
    youtubeAuditNote:
      'Full oEmbed re-audit; titles aligned to YouTube; Develop→Designer product corrections; weak matches demoted',
    public: catalog.tutorials.filter((t) => t.youtubeStatus === 'public').length,
    unverified: catalog.tutorials.filter((t) => t.youtubeStatus === 'unverified').length,
    playlistOnly: catalog.tutorials.filter((t) => t.youtubeStatus === 'playlist_only').length,
    missing: catalog.tutorials.filter((t) => t.youtubeStatus === 'missing' || t.youtubeStatus === 'invalid').length,
    designer: catalog.tutorials.filter((t) => t.product === 'Altium Designer').length,
    develop: catalog.tutorials.filter((t) => t.product === 'Altium Develop').length,
  };
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n');
}

const summary = {
  auditedAt: new Date().toISOString(),
  apply: APPLY,
  totalCatalog: catalog.tutorials.length,
  withYoutubeId: withIds.length,
  verdictHistogram: live.reduce((a, r) => {
    a[r.verdict] = (a[r.verdict] || 0) + 1;
    return a;
  }, {}),
  counts: {
    ...counts,
    public_after: catalog.tutorials.filter((t) => t.youtubeStatus === 'public').length,
    unverified_after: catalog.tutorials.filter((t) => t.youtubeStatus === 'unverified').length,
  },
};

fs.writeFileSync(REPORT_JSON, JSON.stringify({ summary, rows: reportRows }, null, 2) + '\n');

const changed = reportRows.filter(
  (r) => r.action && !['verified_match', 'playlist_only_no_embed', 'missing_no_id'].includes(r.action)
);
const lines = [
  '# YouTube Embed Audit Report',
  '',
  `Audited: ${summary.auditedAt}`,
  `Apply mode: ${APPLY}`,
  '',
  '## Summary counts',
  '',
  `- Verified match (unchanged): **${counts.verified_match_unchanged}**`,
  `- Retitled to match YouTube: **${counts.retitled}**`,
  `- Retitled + product fixed (Develop→Designer): **${counts.retitled_and_product_fixed}**`,
  `- Demoted / kept unverified: **${counts.demoted_to_unverified + counts.already_unverified}**`,
  `- Playlist-only: **${counts.playlist_only}**`,
  `- Missing ID: **${counts.missing}**`,
  `- Public embeds: **${summary.counts.public_after}**`,
  '',
  '## Actions taken (non-match / changed)',
  '',
  '| id | youtubeId | catalog title | YouTube title | status | action |',
  '|---|---|---|---|---|---|',
];
const esc = (s) => String(s || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
for (const r of changed.sort((a, b) => a.id.localeCompare(b.id))) {
  lines.push(
    `| ${r.id} | ${r.youtubeId} | ${esc(r.catalogTitle)} | ${esc(r.youtubeTitle)} | ${r.status} | ${esc(r.action)} |`
  );
}
lines.push('', '## Full inventory (YouTube IDs)', '', '| id | youtubeId | catalog title | YouTube title | status | action |', '|---|---|---|---|---|---|');
for (const r of reportRows.filter((row) => YT_RE.test(row.youtubeId)).sort((a, b) => a.id.localeCompare(b.id))) {
  lines.push(
    `| ${r.id} | ${r.youtubeId} | ${esc(r.catalogTitle)} | ${esc(r.youtubeTitle)} | ${r.status} | ${esc(r.action)} |`
  );
}
fs.writeFileSync(REPORT_MD, lines.join('\n') + '\n');

console.log(JSON.stringify(summary, null, 2));
console.log(`Wrote ${REPORT_JSON}`);
console.log(`Wrote ${REPORT_MD}`);
