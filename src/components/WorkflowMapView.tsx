import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  FileText,
  Network,
  Cpu,
  ShoppingCart,
  MessageSquare,
  Factory,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  Users,
  Cloud,
  Play,
  ChevronRight,
  GitBranch,
} from 'lucide-react';
import { ALL_TUTORIALS } from '../data/catalog';
import { LEARNING_PATHS } from '../data/learningPaths';
import { WORKFLOW_STAGES, WorkflowStage, workflowStageBySlug } from '../data/workflowStages';
import { Tutorial } from '../types';
import { defaultAltiumTrialUrl } from '../utils/outbound';
import { useDocumentTitle } from '../utils/documentTitle';
import { trackEvent } from '../utils/analytics';

export interface WorkflowMapViewProps {
  onSelectTutorial: (tutorial: Tutorial) => void;
  onOpenAltiumLink: (title: string, url: string) => void;
  /** When set, opens that stage (deep-link or embed default). */
  initialStageSlug?: string;
  /** Compact teaser for /altium-develop landing. */
  variant?: 'page' | 'embed';
}

function StageIcon({ name, className }: { name: WorkflowStage['iconName']; className?: string }) {
  const cn = className || 'w-5 h-5';
  switch (name) {
    case 'Lightbulb':
      return <Lightbulb className={cn} />;
    case 'FileText':
      return <FileText className={cn} />;
    case 'Network':
      return <Network className={cn} />;
    case 'Cpu':
      return <Cpu className={cn} />;
    case 'ShoppingCart':
      return <ShoppingCart className={cn} />;
    case 'MessageSquare':
      return <MessageSquare className={cn} />;
    case 'Factory':
      return <Factory className={cn} />;
    case 'ShieldCheck':
      return <ShieldCheck className={cn} />;
    default:
      return <GitBranch className={cn} />;
  }
}

function preferDevelopTutorials(ids: string[]): Tutorial[] {
  const byId = new Map(ALL_TUTORIALS.map((t) => [t.id, t]));
  const resolved = ids.map((id) => byId.get(id)).filter(Boolean) as Tutorial[];
  return [...resolved].sort((a, b) => {
    const aDev = a.product === 'Altium Develop' ? 0 : 1;
    const bDev = b.product === 'Altium Develop' ? 0 : 1;
    return aDev - bDev;
  });
}

/** Compact stage strip + detail panel for /altium-develop (no document-title side effects). */
export const WorkflowMapEmbed: React.FC<Omit<WorkflowMapViewProps, 'variant'>> = (props) => (
  <WorkflowMapInner {...props} variant="embed" />
);

export const WorkflowMapView: React.FC<Omit<WorkflowMapViewProps, 'variant'>> = (props) => {
  useDocumentTitle(
    'Product Development Workflow',
    'Interactive map of electronics product development — Concept through Verification — mapped to Altium Develop capabilities and EET tutorials.',
    '/workflow'
  );
  return <WorkflowMapInner {...props} variant="page" />;
};

const WorkflowMapInner: React.FC<WorkflowMapViewProps> = ({
  onSelectTutorial,
  onOpenAltiumLink,
  initialStageSlug,
  variant = 'page',
}) => {
  const navigate = useNavigate();
  const isEmbed = variant === 'embed';

  const [selectedSlug, setSelectedSlug] = useState<string>(
    () => workflowStageBySlug(initialStageSlug)?.slug || WORKFLOW_STAGES[0].slug
  );

  useEffect(() => {
    const match = workflowStageBySlug(initialStageSlug);
    if (match) setSelectedSlug(match.slug);
  }, [initialStageSlug]);

  const selected = useMemo(
    () => WORKFLOW_STAGES.find((s) => s.slug === selectedSlug) || WORKFLOW_STAGES[0],
    [selectedSlug]
  );

  const tutorials = useMemo(() => preferDevelopTutorials(selected.tutorialIds).slice(0, 6), [selected]);
  const path = LEARNING_PATHS.find((p) => p.id === selected.learningPathId);

  const selectStage = (stage: WorkflowStage) => {
    setSelectedSlug(stage.slug);
    trackEvent('workflow_stage_select', { stage: stage.slug, variant });
    if (!isEmbed) {
      navigate(`/workflow/${stage.slug}`, { replace: true });
    }
  };

  const handleCta = () => {
    const url = defaultAltiumTrialUrl(selected.utmContent);
    onOpenAltiumLink(`Try workflow: ${selected.title}`, url);
    trackEvent('workflow_cta_click', { stage: selected.slug, utm_content: selected.utmContent });
  };

  const stageStrip = (
    <div
      className={`flex ${isEmbed ? 'flex-row overflow-x-auto pb-2 gap-2' : 'flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-2'} scrollbar-thin`}
      role="tablist"
      aria-label="Product development workflow stages"
    >
      {WORKFLOW_STAGES.map((stage, index) => {
        const active = stage.slug === selected.slug;
        return (
          <React.Fragment key={stage.id}>
            <button
              type="button"
              role="tab"
              aria-selected={active}
              id={`workflow-tab-${stage.slug}`}
              aria-controls="workflow-stage-panel"
              onClick={() => selectStage(stage)}
              className={`shrink-0 text-left rounded-xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isEmbed ? 'min-w-[7.5rem] px-3 py-2.5' : 'flex-1 min-w-[8.5rem] px-3 py-3'
              } ${
                active
                  ? 'bg-cyan-950/90 border-cyan-500 text-white shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`flex items-center justify-center rounded-lg ${
                    active ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-500'
                  } ${isEmbed ? 'w-7 h-7' : 'w-8 h-8'}`}
                >
                  <StageIcon name={stage.iconName} className={isEmbed ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {String(stage.order).padStart(2, '0')}
                </span>
              </div>
              <div className={`font-bold leading-snug ${isEmbed ? 'text-[11px]' : 'text-xs sm:text-sm'}`}>
                {stage.shortLabel}
              </div>
            </button>
            {index < WORKFLOW_STAGES.length - 1 && (
              <div
                className={`hidden lg:flex items-center text-slate-700 shrink-0 ${isEmbed ? '' : ''}`}
                aria-hidden
              >
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const detailPanel = (
    <div
      id="workflow-stage-panel"
      role="tabpanel"
      aria-labelledby={`workflow-tab-${selected.slug}`}
      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-cyan-300">
            <StageIcon name={selected.iconName} className="w-3.5 h-3.5" />
            <span>
              Stage {selected.order} of {WORKFLOW_STAGES.length}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{selected.title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{selected.summary}</p>
        </div>
        <button
          type="button"
          onClick={handleCta}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg transition-colors"
        >
          <span>Try this workflow in Altium</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            Responsible roles
          </h4>
          <ul className="flex flex-wrap gap-2">
            {selected.responsibleRoles.map((role, i) => {
              const slug = selected.roleSlugs[i];
              return (
                <li key={role}>
                  {slug ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/roles/${slug}`)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-emerald-300 hover:border-emerald-600"
                    >
                      {role}
                    </button>
                  ) : (
                    <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                      {role}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Common problems
          </h4>
          <ul className="space-y-2">
            {selected.commonProblems.map((problem) => (
              <li
                key={problem}
                className="text-xs text-slate-300 leading-relaxed pl-3 border-l-2 border-amber-800/80"
              >
                {problem}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-xl border border-cyan-900/60 bg-cyan-950/30 p-4 space-y-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 flex items-center gap-2">
          <Cloud className="w-3.5 h-3.5" />
          Altium Develop capability
        </h4>
        <p className="text-sm font-bold text-white">{selected.developCapability.title}</p>
        <p className="text-xs text-slate-300 leading-relaxed">{selected.developCapability.description}</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Play className="w-3.5 h-3.5 text-blue-400" />
            Related tutorials
            <span className="text-slate-600 normal-case tracking-normal">(Develop-preferring)</span>
          </h4>
          {tutorials.length === 0 ? (
            <p className="text-xs text-slate-500">No matching catalog tutorials yet.</p>
          ) : (
            <ul className="space-y-2">
              {tutorials.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => onSelectTutorial(t)}
                    className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-600 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-white group-hover:text-blue-300 leading-snug">
                        {t.title}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 shrink-0 mt-0.5" />
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] font-mono">
                      <span
                        className={
                          t.product === 'Altium Develop'
                            ? 'text-cyan-400'
                            : 'text-blue-400'
                        }
                      >
                        {t.product}
                      </span>
                      <span className="text-slate-500">{t.durationFormatted}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Relevant learning path</h4>
          {path ? (
            <button
              type="button"
              onClick={() => navigate(`/learning-paths/${path.slug}`)}
              className="w-full text-left p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-600 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-white">{path.title}</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{path.headline}</p>
              <div className="flex flex-wrap gap-3 text-[10px] font-mono text-slate-500 pt-1">
                <span>{path.difficulty}</span>
                <span>~{path.estimatedHours} hrs</span>
                <span className="text-cyan-400/80">{path.targetRole}</span>
              </div>
            </button>
          ) : (
            <p className="text-xs text-slate-500">Learning path not found for this stage.</p>
          )}

          <button
            type="button"
            onClick={handleCta}
            className="w-full py-3 rounded-xl border border-amber-700/80 bg-amber-950/40 hover:bg-amber-900/50 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <span>Try this workflow in Altium</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Opens Altium free trial with UTM tags (
            <span className="font-mono text-slate-400">{selected.utmContent}</span>
            ). Independent EET learning hub — not affiliated with Altium LLC.
          </p>
        </section>
      </div>
    </div>
  );

  if (isEmbed) {
    return (
      <section className="space-y-5" aria-labelledby="workflow-embed-heading">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-1 rounded-full">
              <GitBranch className="w-3 h-3" />
              <span>Flagship workflow map</span>
            </div>
            <h2 id="workflow-embed-heading" className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Product-development workflow
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Click a stage to see roles, failure modes, Altium Develop capabilities, tutorials, and a
              learning path — how Develop connects teams across the full product lifecycle.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/workflow/${selected.slug}`)}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-200 inline-flex items-center gap-1 shrink-0"
          >
            Open full map
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {stageStrip}
        {detailPanel}
      </section>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-full">
          <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Product-Development Workflow</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          From concept to verified hardware
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Eight stages of multidisciplinary electronics product development. Select a stage to explore
          who owns it, what usually breaks, which Altium Develop capability helps, and which EET tutorials
          and learning paths teach that workflow.
        </p>
        <p className="text-[11px] text-slate-500 max-w-3xl">
          Independent learning experience by Educational Engineering Team. Not affiliated with Altium LLC.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
          Concept → Requirements → System Design → PCB Design → Sourcing → Review → Manufacturing →
          Verification
        </p>
        {stageStrip}
      </div>

      {detailPanel}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/altium-develop')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-600 text-xs font-semibold text-slate-200 transition-colors"
        >
          Altium Develop landing
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>
        <button
          type="button"
          onClick={() => navigate('/tutorials?product=Altium%20Develop')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-600 text-xs font-semibold text-slate-200 transition-colors"
        >
          Browse Develop tutorials
          <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
        </button>
      </div>
    </div>
  );
};
