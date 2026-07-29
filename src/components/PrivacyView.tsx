import React from 'react';
import { Lock, Database, Mail } from 'lucide-react';
import { Breadcrumbs } from './ui';

interface PrivacyViewProps {
  setActiveTab: (tab: string) => void;
}

const LAST_UPDATED = 'January 2026';

export const PrivacyView: React.FC<PrivacyViewProps> = ({ setActiveTab }) => {
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
          This library does not require an account, does not sell personal data, and does not run third-party
          advertising trackers. The small amount of activity we keep (completed lessons, bookmarks, notes, and
          search history) is stored locally in your browser using <code className="font-mono text-xs bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">localStorage</code>,
          not on a server we control.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>What is stored, and where</span>
        </h2>
        <ul className="space-y-2 text-sm text-slate-300 leading-relaxed list-disc list-inside">
          <li>Completed tutorials, bookmarks, and personal notes — saved to your browser's local storage only.</li>
          <li>Recent search queries and outbound link clicks to Altium's site — also kept in local storage, used to power the on-site Impact dashboard.</li>
          <li>No cookies, no account, and no personal identifiers (name, email, IP address) are collected by this library itself.</li>
          <li>Clearing your browser's site data for this domain removes all locally stored progress.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-display font-bold text-white">Third-party links</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Tutorials link out to Altium's official website and documentation for evaluation downloads and reference
          material. Once you leave this site, Altium's own privacy policy and data practices apply — we don't
          control or receive data from those destinations beyond knowing that a link was clicked.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-display font-bold text-white">Changes to this policy</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          If how we handle data changes materially, we'll update this page and the "Last updated" date above.
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
