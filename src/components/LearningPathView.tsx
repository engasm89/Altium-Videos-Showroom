import React, { useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Cpu, 
  Cloud, 
  ShieldCheck, 
  Briefcase, 
  Zap, 
  Layers, 
  Boxes, 
  Share2, 
  TrendingUp, 
  CircuitBoard,
  Play,
  Award
} from 'lucide-react';
import { LEARNING_PATHS } from '../data/learningPaths';
import { ALL_TUTORIALS } from '../data/catalog';
import { LearningPath, Tutorial, UserProgress } from '../types';
import { CertificateModal } from './CertificateModal';

interface LearningPathViewProps {
  progress: UserProgress;
  onSelectTutorial: (tutorial: Tutorial) => void;
  initialPathSlug?: string;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  progress,
  onSelectTutorial,
  initialPathSlug,
}) => {
  const slugMatched = initialPathSlug
    ? LEARNING_PATHS.find((p) => p.slug === initialPathSlug)?.id
    : undefined;
  const [expandedPathId, setExpandedPathId] = useState<string | null>(slugMatched || 'path-001');
  const [selectedCertPath, setSelectedCertPath] = useState<LearningPath | null>(null);

  React.useEffect(() => {
    if (!initialPathSlug) return;
    const match = LEARNING_PATHS.find((p) => p.slug === initialPathSlug);
    if (match) setExpandedPathId(match.id);
  }, [initialPathSlug]);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'Boxes': return <Boxes className="w-5 h-5 text-amber-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-indigo-400" />;
      case 'CircuitBoard': return <CircuitBoard className="w-5 h-5 text-emerald-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Cloud': return <Cloud className="w-5 h-5 text-cyan-400" />;
      case 'Share2': return <Share2 className="w-5 h-5 text-purple-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-rose-400" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-blue-400" />;
      default: return <Compass className="w-5 h-5 text-blue-400" />;
    }
  };

  const calculatePathProgress = (path: LearningPath) => {
    const moduleTutorialIds = [...new Set(path.modules.flatMap((m) => m.tutorialIds))];
    const pathTutorials = moduleTutorialIds
      .map((id) => ALL_TUTORIALS.find((t) => t.id === id))
      .filter((t): t is Tutorial => Boolean(t));
    if (pathTutorials.length === 0) return { completed: 0, total: 0, percentage: 0 };

    const completedCount = pathTutorials.filter((t) =>
      progress.completedTutorials.includes(t.id)
    ).length;
    const percentage = Math.round((completedCount / pathTutorials.length) * 100);
    return { completed: completedCount, total: pathTutorials.length, percentage };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-mono bg-blue-950 text-blue-300 border border-blue-800 px-3 py-1 rounded-full">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Curated Outcome-Driven Curricula</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          10 Structured Hardware Learning Paths
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Playlists organize by date. Learning paths organize by outcome. Follow step-by-step sequences designed to master specific electronics engineering capabilities.
        </p>
      </div>

      {/* Path Cards List */}
      <div className="space-y-6">
        {LEARNING_PATHS.map((path) => {
          const stats = calculatePathProgress(path);
          const isExpanded = expandedPathId === path.id;

          return (
            <div 
              key={path.id}
              className={`bg-slate-900 rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded ? 'border-blue-600/80 shadow-2xl' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Path Header Bar */}
              <div 
                onClick={() => setExpandedPathId(isExpanded ? null : path.id)}
                className="p-5 sm:p-6 bg-slate-900 hover:bg-slate-850 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 shrink-0 mt-0.5">
                    {renderIcon(path.iconName)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-white hover:text-blue-300 transition-colors">
                        {path.title}
                      </h3>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {path.difficulty}
                      </span>
                      {path.featured && (
                        <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                      {path.headline}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>~{path.estimatedHours} Hours</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>
                          {new Set(path.modules.flatMap((m) => m.tutorialIds)).size} Tutorials
                        </span>
                      </span>
                      <span>•</span>
                      <span>Target: {path.targetRole}</span>
                    </div>
                  </div>
                </div>

                {/* Path Progress & Expand Trigger */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-300">
                      Progress: <span className="text-emerald-400 font-bold">{stats.percentage}%</span> ({stats.completed}/{stats.total})
                    </div>
                    <div className="w-32 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mt-1">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all duration-300"
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Path Details Accordion */}
              {isExpanded && (
                <div className="p-5 sm:p-6 bg-slate-950/70 border-t border-slate-800/80 space-y-6">
                  
                  {/* Target Outcome & Certificate CTA */}
                  <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-blue-400">Target Outcome</h4>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {path.outcome}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedCertPath(path)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center space-x-1.5 shrink-0 hover:brightness-110 transition-all"
                    >
                      <Award className="w-4 h-4" />
                      <span>Preview Official Certificate</span>
                    </button>
                  </div>

                  {/* Skills Acquired Grid */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Skills Acquired</h4>
                    <div className="flex flex-wrap gap-2">
                      {path.skillsAcquired.map((skill, idx) => (
                        <span key={idx} className="text-xs bg-slate-900 text-cyan-300 border border-slate-800 px-3 py-1 rounded-lg font-mono flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Path Modules & Lessons Breakdown */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Curriculum Modules & Lessons</h4>
                    
                    <div className="space-y-3">
                      {path.modules.map((mod, modIdx) => (
                        <div key={mod.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                            <span className="font-mono font-bold text-blue-400 uppercase">Module {modIdx + 1}: {mod.title}</span>
                            <span className="text-slate-400">{mod.description}</span>
                          </div>

                          <div className="space-y-2 pt-1">
                            {mod.tutorialIds.map((tutId) => {
                              const tut = ALL_TUTORIALS.find(t => t.id === tutId);
                              if (!tut) return null;
                              const isDone = progress.completedTutorials.includes(tut.id);

                              return (
                                <div
                                  key={tut.id}
                                  onClick={() => onSelectTutorial(tut)}
                                  className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                                    isDone 
                                      ? 'bg-slate-950/80 border-emerald-900/60 text-slate-300' 
                                      : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-white'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className={`p-1.5 rounded ${isDone ? 'text-emerald-400 bg-emerald-950' : 'text-blue-400 bg-slate-900'}`}>
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                    </div>
                                    <div>
                                      <div className="text-xs font-medium hover:text-blue-300 transition-colors">{tut.title}</div>
                                      <div className="text-[10px] text-slate-400 font-mono">{tut.durationFormatted} • {tut.product}</div>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    {isDone ? (
                                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded flex items-center space-x-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Completed</span>
                                      </span>
                                    ) : (
                                      <span className="text-xs text-blue-400 font-medium flex items-center space-x-1 hover:underline">
                                        <span>Start</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Certificate Modal */}
      {selectedCertPath && (
        <CertificateModal
          path={selectedCertPath}
          onClose={() => setSelectedCertPath(null)}
        />
      )}

    </div>
  );
};
