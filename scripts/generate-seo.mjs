#!/usr/bin/env node
/**
 * Regenerate public/sitemap.xml + public/robots.txt for the canonical host.
 *
 * Site URL precedence:
 *   1. VITE_SITE_URL / SITE_URL / APP_URL env
 *   2. https://learn.eduengteam.com (canonical default)
 *
 * Vercel fallback (docs only): https://eet-electronics-product-dev-library.vercel.app
 *
 * Usage:
 *   node scripts/generate-seo.mjs
 *   VITE_SITE_URL=https://example.com node scripts/generate-seo.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEFAULT_SITE = 'https://learn.eduengteam.com';
const SITE_BASE = (
  process.env.VITE_SITE_URL ||
  process.env.SITE_URL ||
  process.env.APP_URL ||
  DEFAULT_SITE
).replace(/\/+$/, '');

const CATALOG_JSON = path.join(ROOT, 'src/data/catalog.generated.json');
const OUT_SITEMAP = path.join(ROOT, 'public/sitemap.xml');
const OUT_ROBOTS = path.join(ROOT, 'public/robots.txt');

const staticPaths = [
  '/',
  '/tutorials',
  '/learning-paths',
  '/projects',
  '/roles',
  '/personas',
  '/products',
  '/my-activity',
  '/insights',
  '/about',
  '/privacy',
  '/changelog',
  '/skills',
  '/glossary',
  '/notes',
  '/altium-develop',
  '/workflow',
  '/compare-workflows',
  '/case-studies/esp32-product',
  '/tools/shortcuts',
  '/tools/activebom',
  '/tools/drc',
  '/tools/stackup',
];

function loadTutorialSlugs() {
  if (!fs.existsSync(CATALOG_JSON)) return [];
  const raw = JSON.parse(fs.readFileSync(CATALOG_JSON, 'utf8'));
  const tutorials = Array.isArray(raw) ? raw : raw.tutorials || [];
  return tutorials
    .map((t) => t?.slug)
    .filter((s) => typeof s === 'string' && s.length > 0);
}

const slugs = loadTutorialSlugs();
const urls = [
  ...staticPaths.map((p) => ({
    loc: p === '/' ? `${SITE_BASE}/` : `${SITE_BASE}${p}`,
    priority: p === '/' ? '1.0' : '0.7',
  })),
  ...slugs.map((slug) => ({
    loc: `${SITE_BASE}/tutorials/${slug}`,
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

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_BASE}/sitemap.xml
`;

fs.mkdirSync(path.dirname(OUT_SITEMAP), { recursive: true });
fs.writeFileSync(OUT_SITEMAP, sitemap);
fs.writeFileSync(OUT_ROBOTS, robots);

console.log(`SEO assets written for ${SITE_BASE}`);
console.log(`  ${OUT_SITEMAP} (${urls.length} URLs)`);
console.log(`  ${OUT_ROBOTS}`);
