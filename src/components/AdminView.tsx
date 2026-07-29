import React, { useMemo, useState } from 'react';
import { ALL_TUTORIALS, catalogCounts, CATALOG_IMPORT_META } from '../data/catalog';
import { isPlayableTutorial } from '../data/catalog';
import { useDocumentTitle } from '../utils/documentTitle';

/**
 * Read-only admin stub. Gate with VITE_ADMIN_PASSWORD (query ?key= or prompt).
 * Lists youtube / enrichment status for catalog ops — no mutations.
 */
export const AdminView: React.FC = () => {
  useDocumentTitle('Admin · Catalog status');
  const expected = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || '';
  const [authed, setAuthed] = useState(() => {
    if (!expected) return true; // open stub when password unset (dev)
    const params = new URLSearchParams(window.location.search);
    return params.get('key') === expected || sessionStorage.getItem('eet_admin') === '1';
  });
  const [password, setPassword] = useState('');
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
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
          placeholder="Password"
        />
        <button
          type="button"
          onClick={() => {
            if (password === expected) {
              sessionStorage.setItem('eet_admin', '1');
              setAuthed(true);
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
          {catalogCounts.playable} · hand-enriched {catalogCounts.enriched} · source{' '}
          {CATALOG_IMPORT_META?.source || 'catalog.generated.json'}
          {CATALOG_IMPORT_META?.sourceKind ? ` (${CATALOG_IMPORT_META.sourceKind})` : ''}
          {CATALOG_IMPORT_META?.sourcePrecedence ? ` · ${CATALOG_IMPORT_META.sourcePrecedence}` : ''}
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
