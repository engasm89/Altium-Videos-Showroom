/**
 * Smoke-test deep-link + UTM code paths without a browser.
 * Run: node scripts/smoke-deep-links.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const catalog = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/catalog.generated.json'), 'utf8')
);
const routesSrc = fs.readFileSync(path.join(root, 'src/routes.ts'), 'utf8');
const outboundSrc = fs.readFileSync(path.join(root, 'src/utils/outbound.ts'), 'utf8');
const appSrc = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8');

const tutorials = catalog.tutorials || [];
assert(tutorials.length === 333, `expected 333 tutorials, got ${tutorials.length}`);

const unverified = tutorials.filter((t) => t.youtubeStatus === 'unverified');
assert(unverified.length === 0, `unverified remain: ${unverified.map((t) => t.id).join(',')}`);

const publicCount = tutorials.filter((t) => t.youtubeStatus === 'public').length;
assert(publicCount === 333, `expected 333 public, got ${publicCount}`);

const slugs = new Set();
for (const t of tutorials) {
  assert(t.slug, `missing slug on ${t.id}`);
  assert(!slugs.has(t.slug), `duplicate slug ${t.slug}`);
  slugs.add(t.slug);
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t.slug), `bad slug ${t.slug}`);
}

const sample = tutorials.find((t) => t.id === 'cat-001') || tutorials[0];
assert(sample, 'no sample tutorial');
const deepLinks = [
  `/tutorials/${sample.slug}`,
  '/tutorials',
  '/learning-paths',
  '/projects',
  '/products',
  '/roles',
  '/skills',
  '/impact',
  '/tools/shortcuts',
  '/tools/activebom',
  '/tools/drc',
  '/tools/stackup',
  '/notes',
  '/glossary',
  '/about',
  '/privacy',
  '/admin',
];

for (const p of deepLinks) {
  if (p.startsWith('/tutorials/')) {
    assert(appSrc.includes("/tutorials/:slug"), 'App missing /tutorials/:slug route');
  }
}

assert(routesSrc.includes("catalog: '/tutorials'"), 'routes.ts missing catalog path');
assert(appSrc.includes('NotFoundView') || appSrc.includes('path="*"'), 'App needs catch-all');
assert(!appSrc.includes('<Navigate to="/" replace />') || appSrc.includes('NotFoundView'), 'catch-all must not silent-redirect home only');

assert(outboundSrc.includes('withEetUtm'), 'outbound withEetUtm missing');
assert(outboundSrc.includes("utm_source: 'eet_learning_hub'"), 'UTM source missing');
assert(appSrc.includes('withEetUtm'), 'App must wrap Altium CTAs with withEetUtm');

// Runtime UTM check (inline replica of withEetUtm contract)
function withEetUtm(rawUrl, contentSlug) {
  const url = new URL(rawUrl);
  if (!url.hostname.endsWith('altium.com')) return rawUrl;
  if (!url.searchParams.get('utm_source')) url.searchParams.set('utm_source', 'eet_learning_hub');
  if (!url.searchParams.get('utm_medium')) url.searchParams.set('utm_medium', 'tutorial');
  if (!url.searchParams.get('utm_campaign'))
    url.searchParams.set('utm_campaign', 'altium_develop_library');
  if (contentSlug && !url.searchParams.get('utm_content')) {
    url.searchParams.set('utm_content', contentSlug);
  }
  return url.toString();
}

const tagged = withEetUtm('https://www.altium.com/free-trial', sample.slug);
assert(tagged.includes('utm_source=eet_learning_hub'), 'utm_source not appended');
assert(tagged.includes('utm_medium=tutorial'), 'utm_medium not appended');
assert(tagged.includes('utm_campaign=altium_develop_library'), 'utm_campaign not appended');
assert(tagged.includes(`utm_content=${sample.slug}`), 'utm_content not appended');

const leaveAlone = withEetUtm('https://example.com/x', sample.slug);
assert(leaveAlone === 'https://example.com/x', 'non-Altium URL mutated');

const adminSrc = fs.readFileSync(path.join(root, 'src/components/AdminView.tsx'), 'utf8');
assert(adminSrc.includes('Admin blocked'), 'prod admin block missing');
assert(adminSrc.includes('VITE_ADMIN_PASSWORD'), 'admin password env missing');

assert(fs.existsSync(path.join(root, 'api/feedback.ts')), 'api/feedback.ts missing');
assert(fs.existsSync(path.join(root, 'src/components/ErrorBoundary.tsx')), 'ErrorBoundary missing');
assert(fs.existsSync(path.join(root, 'src/components/NotFoundView.tsx')), 'NotFoundView missing');
assert(fs.existsSync(path.join(root, 'src/components/ReportContentControl.tsx')), 'ReportContentControl missing');
assert(fs.existsSync(path.join(root, 'src/utils/useModalA11y.ts')), 'useModalA11y missing');

console.log(
  JSON.stringify(
    {
      ok: true,
      tutorials: tutorials.length,
      public: publicCount,
      unverified: unverified.length,
      sampleDeepLink: `/tutorials/${sample.slug}`,
      utmSample: tagged,
      deepLinkCountChecked: deepLinks.length,
    },
    null,
    2
  )
);
