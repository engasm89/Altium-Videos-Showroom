import React, { useState } from 'react';
import { 
  BarChart3, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  FileSpreadsheet, 
  Globe, 
  Award,
} from 'lucide-react';
import { ALL_TUTORIALS, catalogCounts } from '../data/catalog';
import { LEARNING_PATHS } from '../data/learningPaths';
import { HARDWARE_PROJECTS } from '../data/projects';
import { getOutboundClickLogs, getSearchQueryLogs } from '../utils/storage';
import { UserProgress } from '../types';

interface ImpactDashboardViewProps {
  progress: UserProgress;
  onOpenAltiumLink: (title: string, url: string) => void;
}

/**
 * Impact metrics are local-browser only: completions, bookmarks, outbound clicks,
 * and search logs stored in this visitor's localStorage. No invented traffic or geo stats.
 */
export const ImpactDashboardView: React.FC<ImpactDashboardViewProps> = ({
  progress,
  onOpenAltiumLink
}) => {
  const [reportExported, setReportExported] = useState(false);

  const outboundLogs = getOutboundClickLogs();
  const searchLogs = getSearchQueryLogs();
  const zeroResultSearches = searchLogs.filter(s => s.resultCount === 0);

  const handleExportAltiumReport = () => {
    const reportData = {
      platform: 'EET Electronics Product Development Library',
      url: 'learn.eduengteam.com',
      generatedDate: new Date().toISOString(),
      note: 'Metrics below are this browser session only (localStorage). They are not site-wide analytics.',
      catalogMetrics: {
        enrichedTutorials: catalogCounts.enriched,
        totalCatalog: catalogCounts.total,
        playableEmbeds: catalogCounts.playable,
        enrichmentGoal: catalogCounts.enrichmentGoal,
        altiumDesignerTutorials: catalogCounts.designer,
        altiumDevelopTutorials: catalogCounts.develop,
        learningPaths: LEARNING_PATHS.length,
        hardwareProjects: HARDWARE_PROJECTS.length,
      },
      localUserEngagement: {
        completedLessonsTracked: progress.completedTutorials.length,
        bookmarkedTutorials: progress.bookmarkedTutorials.length,
        outboundAltiumClicksLogged: outboundLogs.length,
        outboundClicksCounter: progress.outboundClicksCount,
        searchQueriesLogged: searchLogs.length,
        unmatchedSearchGaps: zeroResultSearches.map(z => z.query),
      },
      utmTrackingParameters: {
        utm_source: 'eet_learning_hub',
        utm_medium: 'tutorial',
        utm_campaign: 'altium_develop_library'
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EET_Local_Impact_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setReportExported(true);
    setTimeout(() => setReportExported(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-full">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Local engagement only — not site-wide analytics</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Impact & Discovery Signals
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Counts below come from this browser&apos;s localStorage (completions, bookmarks, outbound clicks, searches).
            Catalog sizes reflect the imported EET audit spreadsheet — playable embeds require oEmbed-public status.
          </p>
        </div>

        <button
          onClick={handleExportAltiumReport}
          className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 shrink-0 transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Local Impact Report</span>
        </button>
      </div>

      {reportExported && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 text-xs font-mono flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Local impact JSON exported. Share only what this browser actually recorded.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Enriched Tutorials</span>
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{catalogCounts.total}</div>
          <div className="text-[11px] text-slate-400">
            {catalogCounts.playable} playable · Designer {catalogCounts.designer} / Develop {catalogCounts.develop}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Your Lesson Completions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {progress.completedTutorials.length}
          </div>
          <div className="text-[11px] text-slate-400">Tracked in this browser</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Outbound Altium Clicks</span>
            <ExternalLink className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {outboundLogs.length}
          </div>
          <div className="text-[11px] text-slate-400">
            Counter {progress.outboundClicksCount} · UTM-tagged when logged
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Search Gaps Logged</span>
            <Search className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">
            {zeroResultSearches.length}
          </div>
          <div className="text-[11px] text-slate-400">Zero-result queries in this browser</div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>Tracked Outbound Clicks (this browser)</span>
            </h3>
            <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
              utm_source=eet_learning_hub
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Tutorial CTAs open Altium evaluation URLs with campaign parameters. Logs appear here only after you click.
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {outboundLogs.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono p-3 bg-slate-950 rounded-xl border border-slate-800">
                No outbound clicks recorded yet.
              </p>
            ) : (
              outboundLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 truncate max-w-[280px]">{log.tutorialTitle}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono truncate">{log.destinationUrl}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Search Log (this browser)</span>
            </h3>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
              Content demand signals
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Zero-result searches highlight topics learners look for that are not yet in the enriched catalog.
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {searchLogs.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono p-3 bg-slate-950 rounded-xl border border-slate-800">
                No searches logged yet.
              </p>
            ) : (
              searchLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    log.resultCount === 0 
                      ? 'bg-rose-950/40 border-rose-900/60 text-rose-200' 
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-medium">&quot;{log.query}&quot;</span>
                    {log.resultCount === 0 && (
                      <span className="text-[9px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.5 rounded font-mono">
                        GAP
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{log.resultCount} matches</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <div className="p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-800 rounded-2xl space-y-4 shadow-2xl">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <Award className="w-5 h-5" />
          <span>Partnership posture: evidence over inflation</span>
        </div>
        
        <p className="text-xs text-slate-300 leading-relaxed">
          Pitch from what is real: {catalogCounts.total} imported catalog rows ({catalogCounts.playable} oEmbed-public),
          {catalogCounts.enriched} hand-enriched overlays,
          {' '}{LEARNING_PATHS.length} outcome paths, {HARDWARE_PROJECTS.length} project hubs, and verifiable local engagement signals —
          not invented visitor or country metrics.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="font-semibold text-white mb-1">1. Seriousness</div>
            <p className="text-[11px] text-slate-400">Trademark-safe EET branding, conspicuous independent disclaimers, robust taxonomy.</p>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="font-semibold text-white mb-1">2. Honest scale</div>
            <p className="text-[11px] text-slate-400">
              {catalogCounts.total} catalog rows imported; {catalogCounts.playable} playable embeds; {catalogCounts.enriched} hand-enriched.
            </p>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="font-semibold text-white mb-1">3. Commercial usefulness</div>
            <p className="text-[11px] text-slate-400">
              UTM outbound logs and search-gap reports from real browser activity —{' '}
              <button
                type="button"
                onClick={() => onOpenAltiumLink('Altium evaluation', 'https://www.altium.com/')}
                className="text-cyan-400 hover:underline"
              >
                evaluate Altium
              </button>
              .
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
