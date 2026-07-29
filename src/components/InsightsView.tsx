import React from 'react';
import { BarChart3, ExternalLink, ShieldAlert, Activity, Radio } from 'lucide-react';
import {
  getAnalyticsProviders,
  isAnalyticsEnabled,
  getTrafficAttribution,
  getSessionId,
} from '../utils/analytics';
import { useDocumentTitle } from '../utils/documentTitle';
import { Breadcrumbs } from './ui';

interface InsightsViewProps {
  setActiveTab: (tab: string) => void;
}

/**
 * Aggregate / partnership insights entry point.
 * Does NOT invent site-wide metrics. Real aggregates live in PostHog / GA4.
 */
export const InsightsView: React.FC<InsightsViewProps> = ({ setActiveTab }) => {
  useDocumentTitle('Insights');
  const providers = getAnalyticsProviders();
  const enabled = isAnalyticsEnabled();
  const traffic = getTrafficAttribution();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => setActiveTab('home') },
          { label: 'Insights' },
        ]}
      />

      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-mono bg-amber-950 text-amber-200 border border-amber-800 px-3 py-1 rounded-full">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Requires PostHog / GA4 — not localStorage</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
          Site Insights
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
          Site-wide engagement (search demand, playback funnels, CTA conversion, path progression)
          is measured only when production analytics keys are configured. This page never fabricates
          visitor counts, geo charts, or partnership KPIs from browser storage.
        </p>
      </div>

      <div
        className={`rounded-2xl border p-6 space-y-3 ${
          enabled
            ? 'bg-emerald-950/40 border-emerald-800'
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex items-center space-x-2 text-sm font-semibold">
          <Radio className={`w-4 h-4 ${enabled ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span className={enabled ? 'text-emerald-200' : 'text-slate-200'}>
            {enabled ? 'Production analytics enabled for this build' : 'Production analytics not configured'}
          </span>
        </div>
        <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
          <li>PostHog ({providers.posthog ? 'on' : 'off'}) — set <code className="text-cyan-300">VITE_POSTHOG_KEY</code></li>
          <li>GA4 ({providers.ga4 ? 'on' : 'off'}) — set <code className="text-cyan-300">VITE_GA_ID</code></li>
        </ul>
        {!enabled && (
          <p className="text-xs text-slate-400 leading-relaxed">
            Until those env vars are set on the host (e.g. Vercel), <code className="font-mono text-slate-300">trackEvent</code> is a
            no-op. Open PostHog or Google Analytics after enabling keys — aggregates are not mirrored into this SPA.
          </p>
        )}
        {enabled && (
          <p className="text-xs text-slate-300 leading-relaxed">
            Events are streaming to the configured provider(s). Review funnels and cohorts in the PostHog / GA4
            consoles — not on this page, and not on My Activity.
          </p>
        )}
      </div>

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>Instrumented events (when keys are set)</span>
        </h2>
        <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300 font-mono">
          {[
            'anonymous session_id',
            'traffic source / UTM campaign',
            'search + search_zero_results',
            'tutorial_start',
            'playback_25 / 50 / 75 / 100',
            'tutorial_complete',
            'path_progression',
            'altium_cta_click / cta_click',
            'persona_selected',
            'page_view',
          ].map((label) => (
            <li key={label} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
              {label}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-bold text-white">This browser (not site-wide)</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Anonymous session id and first-touch attribution are stored locally so events can be joined when
          analytics is on. They are not site-wide KPIs.
        </p>
        <dl className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <dt className="text-slate-500 mb-1">session_id</dt>
            <dd className="text-slate-200 break-all">{getSessionId()}</dd>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <dt className="text-slate-500 mb-1">first-touch attribution</dt>
            <dd className="text-slate-200">
              {traffic.utm_source || traffic.referrer
                ? [
                    traffic.utm_source && `source=${traffic.utm_source}`,
                    traffic.utm_medium && `medium=${traffic.utm_medium}`,
                    traffic.utm_campaign && `campaign=${traffic.utm_campaign}`,
                    traffic.referrer && `ref=${traffic.referrer}`,
                  ]
                    .filter(Boolean)
                    .join(' · ')
                : 'none captured yet'}
            </dd>
          </div>
        </dl>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('myActivity')}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-sm font-bold rounded-xl transition-colors"
        >
          <Activity className="w-4 h-4" />
          <span>Open My Activity (this browser only)</span>
        </button>
        <a
          href="https://us.posthog.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-medium rounded-xl border border-slate-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>PostHog console</span>
        </a>
        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-medium rounded-xl border border-slate-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>GA4 console</span>
        </a>
      </div>
    </div>
  );
};
