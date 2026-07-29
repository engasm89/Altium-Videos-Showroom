import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Cpu,
  Factory,
  FileCheck2,
  Layers,
  PackageSearch,
  Shield,
  Users,
} from 'lucide-react';
import { ESP32_CASE_STUDY } from '../data/esp32CaseStudy';
import { ALL_TUTORIALS } from '../data/catalog';
import { Breadcrumbs } from './ui';
import { useDocumentTitle } from '../utils/documentTitle';
import { WorkflowComparisonTable } from './WorkflowComparisonTable';

const STAGE_ICONS = {
  requirements: FileCheck2,
  pcb: Cpu,
  sourcing: PackageSearch,
  review: Users,
  manufacturing: Factory,
} as const;

export const Esp32CaseStudyView: React.FC = () => {
  useDocumentTitle(ESP32_CASE_STUDY.title);
  const navigate = useNavigate();
  const [activeStageId, setActiveStageId] = useState(ESP32_CASE_STUDY.stages[0]?.id);

  const tutorialsBySlug = useMemo(() => {
    const map = new Map(ALL_TUTORIALS.map((t) => [t.slug, t]));
    return map;
  }, []);

  const activeStage =
    ESP32_CASE_STUDY.stages.find((s) => s.id === activeStageId) || ESP32_CASE_STUDY.stages[0];

  const stageTutorials = (activeStage?.tutorialSlugs || [])
    .map((slug) => tutorialsBySlug.get(slug))
    .filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => navigate('/') },
          { label: 'Altium Develop', onClick: () => navigate('/altium-develop') },
          { label: 'ESP32 case study' },
        ]}
      />

      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
          <Layers className="w-4 h-4" />
          <span>Guided multidisciplinary case study</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight max-w-4xl">
          {ESP32_CASE_STUDY.title}
        </h1>
        <p className="text-lg text-cyan-100/90 font-medium max-w-3xl">{ESP32_CASE_STUDY.headline}</p>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          {ESP32_CASE_STUDY.description}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/projects/${ESP32_CASE_STUDY.projectSlug}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold transition-colors"
          >
            Open ESP32 project hub
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/compare-workflows"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800 text-cyan-200 text-xs font-semibold transition-colors"
          >
            Compare disconnected vs Develop
          </Link>
        </div>
      </header>

      <div className="flex items-start gap-2 rounded-xl border border-amber-900/40 bg-amber-950/20 px-4 py-3 text-xs text-amber-100/90">
        <Shield className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
        <p>
          Independent Educational Engineering Team learning experience — not affiliated with or sponsored by Altium
          LLC. Stages map to real catalog lessons where available.
        </p>
      </div>

      {/* Stage rail */}
      <nav aria-label="Case study stages" className="flex flex-wrap gap-2">
        {ESP32_CASE_STUDY.stages.map((stage, idx) => {
          const Icon = STAGE_ICONS[stage.id as keyof typeof STAGE_ICONS] || Layers;
          const active = stage.id === activeStage?.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStageId(stage.id)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                active
                  ? 'bg-cyan-600 text-slate-950 border-cyan-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="font-mono opacity-70">{idx + 1}</span>
              <Icon className="w-3.5 h-3.5" />
              <span>{stage.title}</span>
            </button>
          );
        })}
      </nav>

      {activeStage && (
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-5 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">{activeStage.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{activeStage.summary}</p>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                Stakeholder entry points
              </h3>
              <ul className="space-y-3">
                {activeStage.stakeholders.map((s) => (
                  <li
                    key={`${activeStage.id}-${s.roleSlug}`}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
                  >
                    <Link
                      to={`/roles/${s.roleSlug}`}
                      className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                    >
                      {s.roleTitle}
                    </Link>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.entryPoint}</p>
                  </li>
                ))}
              </ul>
            </div>

            {activeStage.toolLinks && activeStage.toolLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {activeStage.toolLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:border-cyan-700"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Lessons for this stage
            </h3>
            {stageTutorials.length > 0 ? (
              <div className="space-y-2">
                {stageTutorials.map((t) =>
                  t ? (
                    <Link
                      key={t.id}
                      to={`/tutorials/${t.slug}`}
                      className="block p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-700 transition-colors"
                    >
                      <div className="text-sm font-medium text-white line-clamp-2">{t.title}</div>
                      <div className="mt-1 text-[10px] font-mono text-slate-500">
                        {t.product} · {t.durationFormatted}
                      </div>
                    </Link>
                  ) : null
                )}
              </div>
            ) : (
              <p className="text-xs text-amber-300 font-mono">
                Linked lessons not found in catalog — check slug map.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Full pipeline overview */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">End-to-end pipeline</h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ESP32_CASE_STUDY.stages.map((stage, idx) => (
            <li key={stage.id}>
              <button
                type="button"
                onClick={() => setActiveStageId(stage.id)}
                className="w-full h-full text-left p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-700 transition-colors space-y-2"
              >
                <div className="text-[10px] font-mono text-cyan-400">Stage {idx + 1}</div>
                <div className="text-sm font-semibold text-white">{stage.title}</div>
                <p className="text-[11px] text-slate-500 line-clamp-3">{stage.summary}</p>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4 pt-2">
        <h2 className="text-lg font-bold text-white">Why this beats a pile of unrelated tutorials</h2>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Stakeholders enter at different stages — procurement at sourcing, manufacturing at early DFM and release,
          management at requirements and review. The comparison below shows the process shift Develop enables.
        </p>
        <WorkflowComparisonTable compact />
      </section>
    </div>
  );
};
