import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ExternalLink, GitCompareArrows, Shield } from 'lucide-react';
import { WorkflowComparisonTable } from './WorkflowComparisonTable';
import { Breadcrumbs } from './ui';
import { useDocumentTitle } from '../utils/documentTitle';
import { landingAltiumTrialUrl } from '../utils/outbound';

export const CompareWorkflowsView: React.FC = () => {
  useDocumentTitle('Compare workflows');
  const navigate = useNavigate();
  const trialUrl = landingAltiumTrialUrl('compare-workflows');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => navigate('/') },
          { label: 'Altium Develop', onClick: () => navigate('/altium-develop') },
          { label: 'Compare workflows' },
        ]}
      />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
          <GitCompareArrows className="w-4 h-4" />
          <span>Process comparison</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Disconnected vs Altium Develop workflows
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Hardware teams often lose time moving intent between tools, inboxes, and static exports. The table below
          contrasts common disconnected practices with how Altium Develop keeps the same work in one shared context.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-amber-900/40 bg-amber-950/20 px-4 py-3 text-xs text-amber-100/90">
        <Shield className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
        <p>
          Independent EET educational framing — not an Altium marketing claim. We compare collaboration processes,
          not competitor brands. Altium Develop is a trademark of Altium LLC or its affiliates.
        </p>
      </div>

      <WorkflowComparisonTable />

      <div className="flex flex-wrap gap-3 pt-2">
        <a
          href={trialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
        >
          Try Altium Develop
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <Link
          to="/case-studies/esp32-product"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-colors"
        >
          <span>See ESP32 multidisciplinary case study</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/altium-develop"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-semibold transition-colors"
        >
          Back to Altium Develop hub
        </Link>
      </div>
    </div>
  );
};
