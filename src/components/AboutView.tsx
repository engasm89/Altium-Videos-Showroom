import React from 'react';
import { Shield, Target, Mail, ExternalLink, BookOpen, Compass, Users } from 'lucide-react';
import { ALL_TUTORIALS, catalogCounts } from '../data/catalog';
import { LEARNING_PATHS } from '../data/learningPaths';
import { ENGINEERING_ROLES } from '../data/roles';
import { Breadcrumbs } from './ui';

interface AboutViewProps {
  setActiveTab: (tab: string) => void;
  onOpenAltiumLink: (title: string, url: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setActiveTab, onOpenAltiumLink }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">

      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => setActiveTab('home') },
          { label: 'About' },
        ]}
      />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
          About the EET Electronics Product Development Library
        </h1>
        <p className="text-slate-300 leading-relaxed">
          The Educational Engineering Team (EET) built this library to give electronics product development teams a
          single, structured place to learn the practical workflows behind schematic capture, PCB layout, component
          management, manufacturing release, and cross-discipline collaboration.
        </p>
      </div>

      {/* Required Independent Disclaimer — restated prominently on this page */}
      <div className="bg-slate-900/60 border border-amber-900/50 rounded-2xl p-6 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
          <Shield className="w-4 h-4 shrink-0" />
          <span>Independence & Trademark Disclosure</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">
          The EET Electronics Product Development Library is an independent educational publication and is not
          affiliated with, authorized, sponsored, or otherwise approved by Altium LLC.
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Altium, Altium Designer, Altium 365, and Altium Develop are trademarks or registered trademarks of Altium
          LLC or its affiliates in the United States and other countries. Tutorials reference these products for
          educational purposes only; all other product names, logos, and brands are property of their respective
          owners.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <div className="text-2xl font-display font-bold text-white">{ALL_TUTORIALS.length}</div>
          <p className="text-xs text-slate-400">
            Imported catalog ({catalogCounts.playable} playable)
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <Compass className="w-5 h-5 text-emerald-400" />
          <div className="text-2xl font-display font-bold text-white">{LEARNING_PATHS.length}</div>
          <p className="text-xs text-slate-400">Curated learning paths</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <div className="text-2xl font-display font-bold text-white">{ENGINEERING_ROLES.length}</div>
          <p className="text-xs text-slate-400">Engineering role taxonomies</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-display font-bold text-white flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-400" />
          <span>What this library is (and isn't)</span>
        </h2>
        <ul className="space-y-2 text-sm text-slate-300 leading-relaxed list-disc list-inside">
          <li>An independently written and maintained learning resource, organized by outcome, role, and skill.</li>
          <li>Free to use, with no account required — your progress is stored locally in your own browser.</li>
          <li>Not an official Altium product, support channel, or documentation source.</li>
          <li>Not a replacement for Altium's own documentation, licensing, or customer support.</li>
        </ul>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Contact & Corrections</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Found something inaccurate, or have a suggestion for the library? We want to hear from you.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:contact@eduengteam.com"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-brand hover:bg-brand-strong text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>contact@eduengteam.com</span>
          </a>
          <button
            onClick={() => onOpenAltiumLink('Altium Official Site', 'https://www.altium.com')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            <span>Visit Altium's official site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
