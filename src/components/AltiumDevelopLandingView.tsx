import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Layers,
  Shield,
} from 'lucide-react';
import { ALL_TUTORIALS, catalogCounts } from '../data/catalog';
import { Tutorial } from '../types';
import { landingAltiumTrialUrl } from '../utils/outbound';
import { WorkflowMapEmbed } from './WorkflowMapView';

interface AltiumDevelopLandingViewProps {
  onSelectTutorial: (tutorial: Tutorial) => void;
  onOpenAltiumLink: (title: string, url: string) => void;
  setActiveTab?: (tab: string) => void;
  onNavigate?: (path: string) => void;
}

/**
 * Partner-facing Altium Develop hub — the URL Ashraf should send to Altium.
 * Embeds the flagship interactive workflow map; full map also lives at /workflow.
 */
export const AltiumDevelopLandingView: React.FC<AltiumDevelopLandingViewProps> = ({
  onSelectTutorial,
  onOpenAltiumLink,
}) => {
  const developCount = ALL_TUTORIALS.filter((t) => t.product === 'Altium Develop').length;
  const trialUrl = landingAltiumTrialUrl('hero');

  return (
    <div className="text-slate-100">
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-6">
          <p className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-300/90 bg-cyan-950/50 border border-cyan-800/60 px-3 py-1.5 rounded-lg">
            <Shield className="w-3.5 h-3.5" />
            Independent learning experience created by Educational Engineering Team
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl">
            Learn Altium Develop as multidisciplinary product development
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Not merely PCB CAD — electrical, mechanical, software, sourcing, manufacturing, requirements, and
            management collaborating in one connected workflow. {developCount} Develop-tagged lessons in a catalog of{' '}
            {catalogCounts.total} ({catalogCounts.playable} playable).
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenAltiumLink('Try Altium Develop', trialUrl)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold transition-colors"
            >
              Try Altium Develop
              <ExternalLink className="w-4 h-4" />
            </button>
            <Link
              to="/workflow"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-white text-sm font-semibold transition-colors"
            >
              <Layers className="w-4 h-4" />
              Interactive workflow map
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/tutorials?product=Altium%20Develop"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-cyan-200 hover:text-white text-sm font-semibold transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Browse Develop tutorials
            </Link>
          </div>
          <div className="bg-slate-950/70 border border-amber-900/50 rounded-xl p-4 flex gap-3 max-w-3xl">
            <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-amber-300">Independence & trademark notice</p>
              <p>
                This is an independent Educational Engineering Team publication. It is not affiliated with,
                authorized, sponsored, or otherwise approved by Altium LLC. Altium Develop and related marks are
                trademarks of Altium LLC or its affiliates.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-16">
        <WorkflowMapEmbed
          onSelectTutorial={onSelectTutorial}
          onOpenAltiumLink={onOpenAltiumLink}
          initialStageSlug="concept"
        />
      </div>
    </div>
  );
};
