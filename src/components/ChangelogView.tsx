import React from 'react';
import { GitBranch, Rocket } from 'lucide-react';
import { Breadcrumbs } from './ui';
import { APP_STAGE_LABEL, APP_VERSION, SITE_URL, VERCEL_SITE_URL } from '../utils/siteConfig';
import { useDocumentTitle } from '../utils/documentTitle';

interface ChangelogViewProps {
  setActiveTab: (tab: string) => void;
}

interface ChangeEntry {
  date: string;
  version?: string;
  title: string;
  items: string[];
}

const ENTRIES: ChangeEntry[] = [
  {
    date: '2026-07-29',
    version: '0.1.0',
    title: 'Launch trust — custom domain prep & SEO polish',
    items: [
      `Canonical base URL defaults to ${SITE_URL} via VITE_SITE_URL (Vercel fallback documented: ${VERCEL_SITE_URL}).`,
      'Regenerated sitemap.xml + robots.txt for the canonical host; added /changelog to the sitemap.',
      'Open Graph + Twitter meta in index.html, with per-route updates via document title / page meta helpers.',
      'Favicon SVG, apple-touch icon, and og-image.png for link previews.',
      'Visible Beta / version label in nav and footer.',
      'Privacy policy last-updated date refreshed; public /changelog page shipped.',
    ],
  },
  {
    date: '2026-07-29',
    title: 'Catalog honesty — MD→CSV primary source',
    items: [
      'data/videos.csv becomes the winning catalog source (333 named videos); xlsx is fallback only.',
      'YouTube oEmbed audit: 332 public embeds, 1 demoted unverified.',
      'FEATURES.md + FORAshraf.md aligned to live inventory numbers.',
    ],
  },
  {
    date: '2026-07',
    title: 'MVP learning library',
    items: [
      'Vite + React SPA with learning paths, roles, projects, tools labs, and localStorage progress.',
      'Independent EET positioning, About / Privacy pages, My Activity (browser-local only).',
    ],
  },
];

export const ChangelogView: React.FC<ChangelogViewProps> = ({ setActiveTab }) => {
  useDocumentTitle(
    'Changelog',
    'What shipped in the EET Electronics Product Development Library — versions, catalog honesty, and launch prep.',
    '/changelog'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => setActiveTab('home') },
          { label: 'Changelog' },
        ]}
      />

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Changelog
          </h1>
          <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-amber-700/80 bg-amber-950/50 text-amber-300">
            {APP_STAGE_LABEL} · v{APP_VERSION}
          </span>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
          Public release notes for this library. We ship honesty first — catalog counts, embed status,
          and domain prep are called out when they change.
        </p>
      </div>

      <ol className="space-y-6">
        {ENTRIES.map((entry) => (
          <li
            key={`${entry.date}-${entry.title}`}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-cyan-300">
                <Rocket className="w-3.5 h-3.5" />
                {entry.date}
              </span>
              {entry.version && (
                <span className="inline-flex items-center gap-1.5 text-slate-300">
                  <GitBranch className="w-3.5 h-3.5" />
                  v{entry.version}
                </span>
              )}
            </div>
            <h2 className="text-lg font-display font-bold text-white">{entry.title}</h2>
            <ul className="space-y-2 text-sm text-slate-300 leading-relaxed list-disc list-inside">
              {entry.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
};
