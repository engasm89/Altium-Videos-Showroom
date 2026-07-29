import React from 'react';
import { Lock, Database, Mail, MessageSquare, Radio } from 'lucide-react';
import { Breadcrumbs } from './ui';
import { isAnalyticsEnabled, getAnalyticsProviders } from '../utils/analytics';

interface PrivacyViewProps {
  setActiveTab: (tab: string) => void;
}

const LAST_UPDATED = 'July 29, 2026';

export const PrivacyView: React.FC<PrivacyViewProps> = ({ setActiveTab }) => {
  const analyticsOn = isAnalyticsEnabled();
  const providers = getAnalyticsProviders();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">

      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => setActiveTab('home') },
          { label: 'Privacy Policy' },
        ]}
      />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-slate-400">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center space-x-2 text-blue-400 font-semibold text-sm">
          <Lock className="w-4 h-4" />
          <span>Short version</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          This library does not require an account and does not sell personal data. Progress, bookmarks, notes,
          and local search/outbound logs stay in your browser via{' '}
          <code className="font-mono text-xs bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">localStorage</code>
          {' '}(see{' '}
          <button type="button" onClick={() => setActiveTab('myActivity')} className="text-cyan-400 hover:underline">
            My Activity
          </button>
          ). Optional tutorial feedback is sent to our feedback inbox when you submit it.
          {analyticsOn
            ? ' This deployment also sends anonymous product-analytics events to configured third-party tools (details below).'
            : ' Production analytics scripts load only when the site operator enables PostHog and/or GA4 environment keys.'}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>What is stored locally in your browser</span>
        </h2>
        <ul className="space-y-2 text-sm text-slate-300 leading-relaxed list-disc list-inside">
          <li>Completed tutorials, bookmarks, and personal notes — local storage only.</li>
          <li>
            Recent search queries and outbound Altium link clicks — local storage, shown on My Activity
            (this browser only; not site-wide traffic).
          </li>
          <li>
            An anonymous session identifier and first-touch campaign/referrer attribution — used to join events
            when production analytics is enabled.
          </li>
          <li>Clearing this site&apos;s browser data removes local progress and local activity logs.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
          <Radio className="w-4 h-4 text-amber-400" />
          <span>Production analytics (PostHog / Google Analytics 4)</span>
        </h2>
        {analyticsOn ? (
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              This build has production analytics enabled
              {providers.posthog ? ' (PostHog)' : ''}
              {providers.posthog && providers.ga4 ? ' and' : ''}
              {providers.ga4 ? ' (Google Analytics 4)' : ''}.
              We send anonymous product events such as page views, search queries (including zero-result searches),
              tutorial start / playback milestones (25% / 50% / 75% / 100%), tutorial completion, learning-path
              progression, Develop persona selection, and Altium CTA clicks. Events include an anonymous
              session id and traffic-source/campaign parameters when present — not your name or email.
            </p>
            <p>
              Those providers may set their own cookies or identifiers under their privacy policies. We do not use
              them for third-party advertising networks. Site-wide aggregates live in PostHog/GA4 dashboards
              (see Insights) — My Activity never invents global visitor counts.
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-300 leading-relaxed">
            Production analytics are <strong className="text-white font-semibold">not enabled</strong> in this build
            (<code className="font-mono text-xs bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">VITE_POSTHOG_KEY</code>
            {' '}/{' '}
            <code className="font-mono text-xs bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">VITE_GA_ID</code>
            {' '}unset). No PostHog or gtag scripts are loaded, and event helpers are no-ops. If an operator enables
            those keys later, this section describes the events above and the &quot;Last updated&quot; date will change.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>Optional tutorial feedback</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Each tutorial includes an optional Feedback tab. If you submit it, we collect structured answers such as:
          whether the lesson was useful, whether the demonstrated workflow worked, what was unclear, which Altium
          Develop workflow to cover next, your role, and whether you use Altium Designer, Altium 365, and/or Altium
          Develop. Free-text fields may include whatever you choose to write.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          Submissions are POSTed to our Vercel <code className="font-mono text-xs bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">/api/feedback</code>{' '}
          function (or an alternate form endpoint configured by the site operators) and stored on a central backend
          we control or configure (for example a webhook destination, email via Resend, or a private GitHub Issues
          list). We use this only to improve tutorials and prioritize curriculum. We do not sell feedback data.
          Please avoid putting passwords, secrets, or sensitive personal data in free-text answers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-display font-bold text-white">Third-party links</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Tutorials link out to Altium&apos;s official website and documentation for evaluation downloads and reference
          material. Once you leave this site, Altium&apos;s own privacy policy and data practices apply — we don&apos;t
          control those destinations beyond recording that a CTA was clicked (locally, and to analytics when enabled).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-display font-bold text-white">Changes to this policy</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          If how we handle data changes materially, we&apos;ll update this page and the &quot;Last updated&quot; date above.
        </p>
      </section>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-400">Questions about this policy?</p>
        <a
          href="mailto:contact@eduengteam.com"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-brand hover:bg-brand-strong text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span>contact@eduengteam.com</span>
        </a>
      </div>

    </div>
  );
};
