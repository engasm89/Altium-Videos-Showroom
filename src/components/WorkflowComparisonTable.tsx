import React from 'react';
import { WORKFLOW_COMPARISON_ROWS } from '../data/workflowComparison';

interface WorkflowComparisonTableProps {
  className?: string;
  compact?: boolean;
}

/** Disconnected vs Altium Develop process comparison — no brand attacks. */
export const WorkflowComparisonTable: React.FC<WorkflowComparisonTableProps> = ({
  className = '',
  compact = false,
}) => {
  return (
    <div className={className}>
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">
            Comparison of disconnected hardware workflows versus Altium Develop collaboration processes
          </caption>
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-mono uppercase tracking-wider text-slate-400">
              <th scope="col" className="px-4 py-3 font-medium">
                Theme
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Disconnected workflow
              </th>
              <th scope="col" className="px-4 py-3 font-medium text-cyan-300/90">
                Altium Develop workflow
              </th>
            </tr>
          </thead>
          <tbody>
            {WORKFLOW_COMPARISON_ROWS.map((row) => (
              <tr key={row.theme} className="border-b border-slate-800/80 last:border-0 align-top">
                <th
                  scope="row"
                  className={`px-4 py-3 font-semibold text-white ${compact ? 'text-xs' : 'text-sm'}`}
                >
                  {row.theme}
                </th>
                <td className={`px-4 py-3 text-slate-400 ${compact ? 'text-xs' : 'text-sm'} leading-relaxed`}>
                  {row.disconnected}
                </td>
                <td className={`px-4 py-3 text-slate-200 ${compact ? 'text-xs' : 'text-sm'} leading-relaxed`}>
                  {row.develop}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px] text-slate-500 font-mono leading-relaxed">
        Process comparison only — this library does not rank or attack competing CAD brands.
      </p>
    </div>
  );
};
