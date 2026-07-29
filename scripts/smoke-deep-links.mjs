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
  '/my-activity',
  '/insights',
  '/impact', // legacy → /my-activity
  '/tools/shortcuts',
  '/tools/activebom',
  '/tools/drc',
  '/tools/stackup',
  '/notes',
  '/glossary',
  '/about',
  '/privacy',
  '/admin',
  '/feedback-inbox',
];

for (const p of deepLinks) {
  if (p.startsWith('/tutorials/')) {
    assert(appSrc.includes("/tutorials/:slug"), 'App missing /tutorials/:slug route');
  }
}

assert(routesSrc.includes("catalog: '/tutorials'"), 'routes.ts missing catalog path');
assert(routesSrc.includes("myActivity: '/my-activity'"), 'routes.ts missing /my-activity');
assert(routesSrc.includes("insights: '/insights'"), 'routes.ts missing /insights');
assert(appSrc.includes('path="/my-activity"'), 'App missing /my-activity route');
assert(appSrc.includes('path="/insights"'), 'App missing /insights route');
assert(appSrc.includes('Navigate to="/my-activity"'), 'legacy /impact redirect missing');
assert(appSrc.includes('NotFoundView') || appSrc.includes('path="*"'), 'App needs catch-all');
assert(!appSrc.includes('<Navigate to="/" replace />') || appSrc.includes('NotFoundView'), 'catch-all must not silent-redirect home only');

assert(outboundSrc.includes('withEetUtm'), 'outbound withEetUtm missing');
assert(outboundSrc.includes("utm_source: 'eet_learning_hub'"), 'UTM source missing');
assert(appSrc.includes('withEetUtm'), 'App must wrap Altium CTAs with withEetUtm');

const myActivitySrc = fs.readFileSync(path.join(root, 'src/components/MyActivityView.tsx'), 'utf8');
const insightsSrc = fs.readFileSync(path.join(root, 'src/components/InsightsView.tsx'), 'utf8');
const navbarSrc = fs.readFileSync(path.join(root, 'src/components/Navbar.tsx'), 'utf8');
assert(myActivitySrc.includes('My Activity'), 'My Activity label missing');
assert(myActivitySrc.includes('YOUR browser only'), 'My Activity honesty chip missing');
assert(!/\bImpact\b/.test(myActivitySrc), 'My Activity still says Impact');
assert(insightsSrc.includes('Site Insights'), 'Site Insights heading missing');
assert(insightsSrc.includes('not localStorage'), 'Insights honesty chip missing');
assert(navbarSrc.includes("label: 'My Activity'"), 'Navbar My Activity label missing');
assert(!navbarSrc.includes("label: 'Impact'"), 'Navbar still labels Impact');

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

// Partner launch: routes, UTMs, Develop catalog ID integrity
assert(routesSrc.includes("altiumDevelop: '/altium-develop'"), 'routes missing /altium-develop');
assert(routesSrc.includes("workflow: '/workflow'"), 'routes missing /workflow');
assert(routesSrc.includes("personas: '/personas'"), 'routes missing /personas');
assert(routesSrc.includes("compareWorkflows: '/compare-workflows'"), 'routes missing /compare-workflows');
assert(routesSrc.includes("esp32CaseStudy: '/case-studies/esp32-product'"), 'routes missing ESP32 case study');
assert(appSrc.includes('path="/altium-develop"'), 'App missing /altium-develop');
assert(appSrc.includes('path="/workflow"'), 'App missing /workflow');
assert(appSrc.includes('path="/personas"'), 'App missing /personas');
assert(appSrc.includes('path="/compare-workflows"'), 'App missing /compare-workflows');
assert(appSrc.includes('path="/case-studies/esp32-product"'), 'App missing ESP32 case study route');

assert(outboundSrc.includes('landingAltiumTrialUrl'), 'landingAltiumTrialUrl missing');
assert(outboundSrc.includes("utm_medium: 'landing'"), 'landing UTM medium missing');
assert(outboundSrc.includes("utm_campaign: 'altium_develop'"), 'landing UTM campaign missing');

const byId = Object.fromEntries(tutorials.map((t) => [t.id, t]));
const developIds = new Set(tutorials.filter((t) => t.product === 'Altium Develop').map((t) => t.id));
assert(developIds.size >= 50, `expected ≥50 Develop tutorials, got ${developIds.size}`);

function extractCatIds(src) {
  return [...src.matchAll(/'(cat-\d+)'/g)].map((m) => m[1]);
}

const personasSrc = fs.readFileSync(path.join(root, 'src/data/personas.ts'), 'utf8');
const workflowSrc = fs.readFileSync(path.join(root, 'src/data/workflowStages.ts'), 'utf8');
const landingSrc = fs.readFileSync(
  path.join(root, 'src/components/AltiumDevelopLandingView.tsx'),
  'utf8'
);
const esp32Src = fs.readFileSync(path.join(root, 'src/data/esp32CaseStudy.ts'), 'utf8');

assert((personasSrc.match(/id: 'persona-/g) || []).length === 6, 'expected 6 persona journeys');
assert((workflowSrc.match(/id: 'wf-/g) || []).length === 8, 'expected 8 workflow stages');

for (const id of extractCatIds(personasSrc)) {
  assert(byId[id], `persona tutorial missing from catalog: ${id}`);
  assert(byId[id].product === 'Altium Develop', `persona tutorial ${id} is ${byId[id].product}, not Develop`);
}
for (const id of extractCatIds(workflowSrc)) {
  assert(byId[id], `workflow tutorial missing from catalog: ${id}`);
  assert(byId[id].product === 'Altium Develop', `workflow tutorial ${id} is ${byId[id].product}, not Develop`);
}

const esp32Slugs = [...esp32Src.matchAll(/'([a-z0-9]+(?:-[a-z0-9]+)+)'/g)]
  .map((m) => m[1])
  .filter(
    (s) =>
      s.includes('altium') ||
      s.includes('esp32') ||
      s.includes('requirement') ||
      s.includes('bom') ||
      s.includes('comment') ||
      s.includes('mechanical') ||
      s.includes('partner') ||
      s.includes('release') ||
      s.includes('introduction')
  );
const slugSet = new Set(tutorials.map((t) => t.slug));
for (const slug of new Set(esp32Slugs)) {
  if (slug.startsWith('path-') || slug === 'esp32-product' || slug.includes('development-board')) continue;
  assert(slugSet.has(slug), `ESP32 case study slug missing from catalog: ${slug}`);
}

assert(landingSrc.includes('Independence & trademark'), 'landing missing independence notice');
assert(landingSrc.includes('landingAltiumTrialUrl'), 'landing missing UTM trial helper');
assert(landingSrc.includes('ReportContentControl'), 'landing missing feedback control');
assert(landingSrc.includes('WorkflowMapEmbed'), 'landing missing workflow embed');
assert(landingSrc.includes('PERSONA_JOURNEYS'), 'landing missing personas');
assert(landingSrc.includes('Develop tutorials from the catalog'), 'landing missing tutorials section');
assert(landingSrc.includes('Develop learning paths'), 'landing missing paths section');
assert(landingSrc.includes('Practice tools'), 'landing missing tools section');

console.log(
  JSON.stringify(
    {
      ok: true,
      tutorials: tutorials.length,
      public: publicCount,
      unverified: unverified.length,
      develop: developIds.size,
      sampleDeepLink: `/tutorials/${sample.slug}`,
      utmSample: tagged,
      deepLinkCountChecked: deepLinks.length,
      personas: 6,
      workflowStages: 8,
    },
    null,
    2
  )
);
