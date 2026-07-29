import React, { useMemo, useState } from 'react';
import { ALL_TUTORIALS, catalogCounts, CATALOG_IMPORT_META } from '../data/catalog';
import { isPlayableTutorial } from '../data/catalog';
import { useDocumentTitle } from '../utils/documentTitle';

/**
 * Read-only admin stub. Requires VITE_ADMIN_PASSWORD.
 * In production, unset password → admin is blocked (no empty-password access).
 * Local/dev may remain open when the env var is unset for convenience.
 */
export const AdminView: React.FC = () => {
  useDocumentTitle('Admin · Catalog status');
  const expected = ((import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || '').trim();
  const isProd = import.meta.env.PROD;
  const passwordConfigured = expected.length > 0;

  const [authed, setAuthed] = useState(() => {
    if (!passwordConfigured) return !isProd;
    const params = new URLSearchParams(window.location.search);
    return params.get('key') === expected || sessionStorage.getItem('eet_admin') === '1';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'public' | 'pending' | 'playlist_only'>('all');

  const rows = useMemo(() => {
    return ALL_TUTORIALS.filter((t) => {
      if (filter === 'public') return t.youtubeStatus === 'public';
      if (filter === 'playlist_only') return t.youtubeStatus === 'playlist_only';
      if (filter === 'pending') {
        return t.youtubeStatus !== 'public' && t.youtubeStatus !== 'playlist_only';
      }
      return true;
    });
  }, [filter]);

  if (!passwordConfigured && isProd) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 space-y-4 text-slate-100">
        <h1 className="text-xl font-bold text-white">Admin blocked</h1>
        <p className="text-sm text-slate-400">
          <code className="text-cyan-400">VITE_ADMIN_PASSWORD</code> is not set on this production
          build. Empty-password admin access is disabled.
        </p>
        <div className="text-xs text-slate-400 space-y-2 border border-slate-800 rounded-xl p-4 bg-slate-950">
          <p className="font-semibold text-slate-200">Set it on Vercel</p>
          <ol className="list-decimal list-inside space-y-1 font-mono text-[11px] text-slate-400">
            <li>Vercel → Project → Settings → Environment Variables</li>
            <li>
              Add <span className="text-cyan-400">VITE_ADMIN_PASSWORD</span> (Production + Preview)
            </li>
            <li>Redeploy so Vite can bake the value into the client bundle</li>
          </ol>
          <p className="text-[11px] text-amber-300/90">
            Note: Vite prefixes mean this is an access gate, not a server secret — still required so
            production never ships an open /admin.
          </p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-4">
        <h1 className="text-xl font-bold text-white">Admin access</h1>
        <p className="text-xs text-slate-400">
          Enter the admin password from <code className="text-cyan-400">VITE_ADMIN_PASSWORD</code>.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && password === expected) {
              sessionStorage.setItem('eet_admin', '1');
              setAuthed(true);
            } else if (e.key === 'Enter') {
              setError('Incorrect password');
            }
          }}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
          placeholder="Password"
          autoComplete="current-password"
        />
        {error && <p className="text-xs text-amber-400">{error}</p>}
        <button
          type="button"
          onClick={() => {
            if (password === expected) {
              sessionStorage.setItem('eet_admin', '1');
              setAuthed(true);
            } else {
              setError('Incorrect password');
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
        >
          Unlock
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-slate-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-white">Catalog admin (read-only)</h1>
        <p className="text-xs text-slate-400 font-mono">
          Imported {CATALOG_IMPORT_META?.stats?.totalRows ?? catalogCounts.total} rows · playable{' '}
          {catalogCounts.playable} · enriched {catalogCounts.enriched}
          {catalogCounts.developEnriched != null ? ` (${catalogCounts.developEnriched} Develop)` : ''} · source{' '}
          {CATALOG_IMPORT_META?.source || 'catalog.generated.json'}
          {CATALOG_IMPORT_META?.sourceKind ? ` (${CATALOG_IMPORT_META.sourceKind})` : ''}
          {CATALOG_IMPORT_META?.sourcePrecedence ? ` · ${CATALOG_IMPORT_META.sourcePrecedence}` : ''}
          {!passwordConfigured ? ' · open (dev, password unset)' : ''}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {(['all', 'public', 'pending', 'playlist_only'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg border font-mono ${
              filter === f
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-950 text-slate-400 font-mono uppercase">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">YT status</th>
              <th className="px-3 py-2">Enrichment</th>
              <th className="px-3 py-2">Playable</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-t border-slate-800 hover:bg-slate-900/60">
                <td className="px-3 py-2 font-mono text-cyan-400 whitespace-nowrap">{t.id}</td>
                <td className="px-3 py-2 text-slate-200 max-w-md truncate">{t.title}</td>
                <td className="px-3 py-2 text-slate-400">{t.product}</td>
                <td className="px-3 py-2 font-mono">{t.youtubeStatus || '—'}</td>
                <td className="px-3 py-2 font-mono">{t.enrichmentStatus || '—'}</td>
                <td className="px-3 py-2">{isPlayableTutorial(t) ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
