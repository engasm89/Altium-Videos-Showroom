import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  GitCompareArrows,
  Layers,
  Shield,
  Sparkles,
} from 'lucide-react';
import { ALL_TUTORIALS, catalogCounts } from '../data/catalog';
import { PERSONA_JOURNEYS } from '../data/personas';
import { Tutorial } from '../types';
import { landingAltiumTrialUrl } from '../utils/outbound';
import { WorkflowComparisonTable } from './WorkflowComparisonTable';
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
 * Persona journeys deep-link to `/personas/:slug`.
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
              to="/personas"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-white text-sm font-semibold transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Persona journeys
              <ArrowRight className="w-4 h-4" />
            </Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 pb-16">
        <WorkflowMapEmbed
          onSelectTutorial={onSelectTutorial}
          onOpenAltiumLink={onOpenAltiumLink}
          initialStageSlug="concept"
        />

        <section className="space-y-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white">I am a…</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Six audience journeys beyond catalog role hubs — Develop outcomes, starting path, tutorials,
              one workflow example, and a relevant tool.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PERSONA_JOURNEYS.map((persona) => (
              <Link
                key={persona.id}
                to={`/personas/${persona.slug}`}
                className="text-left bg-slate-900 border border-slate-800 hover:border-cyan-700/70 rounded-xl p-4 space-y-2 transition-colors group block"
              >
                <p className="text-[11px] font-mono text-cyan-400">I am a {persona.selectorLabel}</p>
                <h3 className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors">
                  {persona.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {persona.developOutcomes[0]}
                </p>
                <span className="inline-flex items-center text-[11px] font-mono text-cyan-400">
                  Open journey <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </Link>
            ))}
          </div>
          <Link
            to="/personas"
            className="text-xs font-mono text-cyan-300 hover:underline inline-flex items-center gap-1"
          >
            Browse all persona journeys <ArrowRight className="w-3 h-3" />
          </Link>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <GitCompareArrows className="w-5 h-5 text-cyan-400" />
              Disconnected vs Altium Develop process
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              A process comparison — not a brand attack. See how intent, reviews, sourcing, and DFM stay connected.
            </p>
          </div>
          <WorkflowComparisonTable compact />
          <Link
            to="/compare-workflows"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Open full comparison page
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              ESP32 multidisciplinary case study
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Requirements → PCB → sourcing → review → manufacturing, with stakeholder entry points at each stage —
              one coherent product story instead of dozens of unrelated clips.
            </p>
          </div>
          <Link
            to="/case-studies/esp32-product"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-sm font-bold transition-colors"
          >
            Start the ESP32 case study
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
};
