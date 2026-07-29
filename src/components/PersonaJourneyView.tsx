import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  Clock,
  Cpu,
  ExternalLink,
  Play,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react';
import { PERSONA_JOURNEYS, findPersonaBySlug } from '../data/personas';
import { LEARNING_PATHS } from '../data/learningPaths';
import { ALL_TUTORIALS, findTutorialById } from '../data/catalog';
import { PersonaJourney, Tutorial } from '../types';
import { landingAltiumTrialUrl } from '../utils/outbound';
import { trackPersonaSelected } from '../utils/analytics';
import { useDocumentTitle } from '../utils/documentTitle';
import { Breadcrumbs } from './ui/Breadcrumbs';

interface PersonaJourneyViewProps {
  initialPersonaSlug?: string;
  onSelectTutorial: (tutorial: Tutorial) => void;
  onSelectPath: (pathId: string) => void;
  onOpenTool: (tab: string) => void;
  onOpenAltiumLink: (title: string, url: string) => void;
  onNavigate: (path: string) => void;
}

function personaIcon(iconName: string, className = 'w-5 h-5') {
  switch (iconName) {
    case 'Cpu':
      return <Cpu className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    default:
      return <Users className={className} />;
  }
}

function resolveTutorials(persona: PersonaJourney): Tutorial[] {
  return persona.tutorialIds
    .map((id) => findTutorialById(id) || ALL_TUTORIALS.find((t) => t.id === id))
    .filter((t): t is Tutorial => Boolean(t));
}

export const PersonaJourneyView: React.FC<PersonaJourneyViewProps> = ({
  initialPersonaSlug,
  onSelectTutorial,
  onSelectPath,
  onOpenTool,
  onOpenAltiumLink,
  onNavigate,
}) => {
  const matched = initialPersonaSlug ? findPersonaBySlug(initialPersonaSlug) : undefined;
  const [selectedSlug, setSelectedSlug] = useState<string>(
    matched?.slug || PERSONA_JOURNEYS[0].slug
  );

  useEffect(() => {
    if (!initialPersonaSlug) return;
    const found = findPersonaBySlug(initialPersonaSlug);
    if (found) setSelectedSlug(found.slug);
  }, [initialPersonaSlug]);

  const persona = findPersonaBySlug(selectedSlug) || PERSONA_JOURNEYS[0];
  const path = LEARNING_PATHS.find((p) => p.id === persona.recommendedPathId);
  const tutorials = resolveTutorials(persona);

  useDocumentTitle(persona.title);

  useEffect(() => {
    trackPersonaSelected(persona.id, persona.title);
  }, [persona.id, persona.title]);

  const selectPersona = (slug: string) => {
    setSelectedSlug(slug);
    onNavigate(`/personas/${slug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: 'Personas', onClick: () => onNavigate('/personas') },
          { label: persona.selectorLabel },
        ]}
      />

      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Altium Develop persona journeys</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Start from your job — not a feature list
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Six audience journeys for Altium Develop: business outcomes, a recommended starting path,
          curated tutorials, one realistic workflow, and a relevant lab tool. Distinct from{' '}
          <button
            type="button"
            onClick={() => onNavigate('/roles')}
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
          >
            Engineering Role hubs
          </button>
          , which map catalog categories.
        </p>
      </div>

      {/* “I am a …” selector */}
      <div className="space-y-3">
        <label htmlFor="persona-selector" className="block text-sm font-bold text-white">
          I am a…
        </label>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <select
            id="persona-selector"
            value={persona.slug}
            onChange={(e) => selectPersona(e.target.value)}
            className="w-full sm:max-w-md bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {PERSONA_JOURNEYS.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.selectorLabel}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 font-mono">
            PCB Designer / Procurement Manager / Manufacturing Engineer / Engineering Manager /
            Compliance Engineer / …
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PERSONA_JOURNEYS.map((p) => {
            const active = p.slug === persona.slug;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPersona(p.slug)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  active
                    ? 'bg-cyan-950/80 border-cyan-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div
                  className={`p-2 rounded-lg w-fit mb-2 ${
                    active ? 'bg-cyan-600 text-slate-950' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  {personaIcon(p.iconName, 'w-4 h-4')}
                </div>
                <span className="text-[11px] font-bold leading-snug block">{p.selectorLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Journey pane */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-cyan-950 border border-cyan-800 rounded-xl text-cyan-300">
                {personaIcon(persona.iconName, 'w-6 h-6')}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">{persona.title}</h3>
                <span className="text-xs font-mono text-cyan-400">{persona.audience}</span>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              Selector: <span className="text-slate-200 font-medium">I am a {persona.selectorLabel}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onSelectPath(persona.recommendedPathId)}
              className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg transition-colors"
            >
              <span>Start recommended path</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                onOpenAltiumLink(persona.ctaLabel, landingAltiumTrialUrl(persona.utmContent))
              }
              className="px-5 py-3 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
            >
              <span>{persona.ctaLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Outcomes */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            What Altium Develop solves for this role
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {persona.developOutcomes.map((outcome) => (
              <li
                key={outcome}
                className="flex items-start space-x-2 text-sm text-slate-300 bg-slate-950 border border-slate-800 rounded-xl p-4"
              >
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended path */}
        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Recommended starting path
          </h4>
          {path ? (
            <>
              <p className="text-base font-bold text-white">{path.title}</p>
              <p className="text-sm text-slate-400 leading-relaxed">{path.headline}</p>
              <p className="text-xs text-slate-500">
                Outcome: {path.outcome} · ~{path.estimatedHours}h · {path.difficulty}
              </p>
              <button
                type="button"
                onClick={() => onSelectPath(path.id)}
                className="mt-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center space-x-1"
              >
                <span>Open path</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <p className="text-sm text-slate-400">Path mapping unavailable.</p>
          )}
        </div>

        {/* Tutorials */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-white">
              Tutorials for {persona.selectorLabel}s
            </h4>
            <span className="text-xs font-mono text-slate-400">{tutorials.length} curated</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tutorials.map((tut) => (
              <button
                key={tut.id}
                type="button"
                onClick={() => onSelectTutorial(tut)}
                className="p-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-400">{tut.product}</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{tut.durationFormatted}</span>
                  </span>
                </div>
                <h5 className="font-semibold text-xs text-white line-clamp-2 flex items-start gap-1.5">
                  <Play className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                  <span>{tut.title}</span>
                </h5>
                <p className="text-[11px] text-slate-400 line-clamp-2">{tut.shortDescription}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Workflow + tool */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Realistic workflow example
            </h4>
            <p className="text-sm font-bold text-white">{persona.workflowExample.title}</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {persona.workflowExample.narrative}
            </p>
            <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside">
              {persona.workflowExample.steps.map((step) => (
                <li key={step} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 flex flex-col">
            <h4 className="text-xs font-mono uppercase tracking-wider text-fuchsia-400">
              Relevant tool
            </h4>
            <p className="text-sm font-bold text-white">{persona.relevantTool.label}</p>
            <p className="text-xs text-slate-400 leading-relaxed flex-1">
              {persona.relevantTool.description}
            </p>
            <button
              type="button"
              onClick={() => onOpenTool(persona.relevantTool.tab)}
              className="mt-2 w-full py-3 bg-fuchsia-700/80 hover:bg-fuchsia-600 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Open {persona.relevantTool.label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {persona.relatedRoleSlug && (
              <button
                type="button"
                onClick={() => onNavigate(`/roles/${persona.relatedRoleSlug}`)}
                className="text-[11px] text-slate-500 hover:text-slate-300 text-center"
              >
                Also see catalog role hub →
              </button>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <p className="text-xs text-slate-500 max-w-xl">
            Outbound trial links use landing UTMs (
            <span className="font-mono text-slate-400">
              source=eet_learning_hub · medium=landing · campaign=altium_develop · content=
              {persona.utmContent}
            </span>
            ) so partnership reporting can attribute persona journeys.
          </p>
          <button
            type="button"
            onClick={() =>
              onOpenAltiumLink(persona.ctaLabel, landingAltiumTrialUrl(persona.utmContent))
            }
            className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-2 shrink-0 transition-colors"
          >
            <span>{persona.ctaLabel}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
