import React, { useEffect, useState } from 'react';
import { Inbox, Lock, ExternalLink, RefreshCw } from 'lucide-react';
import { Breadcrumbs } from './ui';
import { useDocumentTitle } from '../utils/documentTitle';
import { probeFeedbackBackend } from '../utils/feedback';

interface FeedbackInboxViewProps {
  setActiveTab: (tab: string) => void;
}

/**
 * Password-gated stub for operators. Live listing requires the configured backend
 * (GitHub Issues / Resend mailbox / webhook destination) — this page only probes /api/feedback.
 */
export const FeedbackInboxView: React.FC<FeedbackInboxViewProps> = ({ setActiveTab }) => {
  useDocumentTitle('Feedback inbox');

  const expected = ((import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || '').trim();
  const inboxUrl = (import.meta.env.VITE_FEEDBACK_INBOX_URL as string | undefined)?.trim();
  const externalEndpoint = (import.meta.env.VITE_FEEDBACK_ENDPOINT as string | undefined)?.trim();
  const isProd = import.meta.env.PROD;
  const passwordConfigured = expected.length > 0;

  const [authed, setAuthed] = useState(() => {
    if (!passwordConfigured) return !isProd;
    const params = new URLSearchParams(window.location.search);
    return params.get('key') === expected || sessionStorage.getItem('eet_admin') === '1';
  });
  const [password, setPassword] = useState('');
  const [probe, setProbe] = useState<{
    configured: boolean;
    backends?: { webhook: boolean; resend: boolean; github: boolean };
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const result = await probeFeedbackBackend();
    setProbe(result);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) void refresh();
  }, [authed]);

  if (!passwordConfigured && isProd) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 space-y-4 text-slate-100">
        <h1 className="text-xl font-bold text-white">Feedback inbox blocked</h1>
        <p className="text-sm text-slate-400">
          <code className="text-cyan-400">VITE_ADMIN_PASSWORD</code> is not set on this production
          build. Empty-password operator access is disabled.
        </p>
        <p className="text-xs text-slate-500">
          Set it in Vercel → Project → Settings → Environment Variables, then redeploy.
        </p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-400" />
          Feedback inbox
        </h1>
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => setActiveTab('home') },
          { label: 'Feedback inbox' },
        ]}
      />

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight flex items-center gap-2">
          <Inbox className="w-7 h-7 text-cyan-400" />
          Feedback inbox
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Tutorial feedback is stored on a central backend (webhook, Resend email, or GitHub Issues) —
          not in visitor browsers. This page is an operator stub: it does not mirror the full message
          store inside the SPA.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">Backend status</h2>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {probe == null ? (
          <p className="text-xs text-slate-500 font-mono">Checking /api/feedback…</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              Configured:{' '}
              <span className={probe.configured ? 'text-emerald-400' : 'text-amber-400'}>
                {probe.configured ? 'yes' : 'no'}
              </span>
            </li>
            {externalEndpoint && (
              <li className="text-xs text-slate-400 font-mono break-all">
                Client override: VITE_FEEDBACK_ENDPOINT = {externalEndpoint}
              </li>
            )}
            {probe.backends && (
              <li className="text-xs font-mono text-slate-400">
                webhook={String(probe.backends.webhook)} · resend={String(probe.backends.resend)} ·
                github={String(probe.backends.github)}
              </li>
            )}
            {probe.error && <li className="text-xs text-rose-300">{probe.error}</li>}
            {!probe.configured && !externalEndpoint && (
              <li className="text-xs text-amber-200/90 leading-relaxed">
                Set <code className="text-cyan-400">FEEDBACK_WEBHOOK_URL</code>, or{' '}
                <code className="text-cyan-400">RESEND_API_KEY</code> +{' '}
                <code className="text-cyan-400">FEEDBACK_TO_EMAIL</code>, or{' '}
                <code className="text-cyan-400">GITHUB_TOKEN</code> +{' '}
                <code className="text-cyan-400">GITHUB_FEEDBACK_REPO</code> on Vercel. Or point{' '}
                <code className="text-cyan-400">VITE_FEEDBACK_ENDPOINT</code> at Formspree / Getform.
              </li>
            )}
          </ul>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">Where to read submissions</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300 leading-relaxed">
          <li>Webhook destination (JSONBin / Zapier / Make / n8n) if FEEDBACK_WEBHOOK_URL is set.</li>
          <li>Mailbox for FEEDBACK_TO_EMAIL when Resend is configured.</li>
          <li>
            GitHub Issues labeled <code className="text-xs text-cyan-400">tutorial-feedback</code> when
            GITHUB_FEEDBACK_REPO is configured.
          </li>
        </ol>
        {inboxUrl ? (
          <a
            href={inboxUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-brand-bright hover:underline"
          >
            Open configured inbox
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <p className="text-xs text-slate-500">
            Optional: set <code className="text-cyan-400">VITE_FEEDBACK_INBOX_URL</code> to deep-link
            your Issues list or email filter here.
          </p>
        )}
      </div>
    </div>
  );
};
