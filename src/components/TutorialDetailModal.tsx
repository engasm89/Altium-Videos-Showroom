import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import confetti from 'canvas-confetti';
import { 
  X, 
  Play, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Download, 
  Terminal, 
  BookOpen, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  Share2,
  List,
  Sparkles,
  MessageSquare,
  CalendarClock,
  BadgeCheck
} from 'lucide-react';
import { Tutorial, isPedagogicallyEnriched } from '../types';
import { isPlayableTutorial, ALL_TUTORIALS } from '../data/catalog';
import { defaultAltiumTrialUrl } from '../utils/outbound';
import { trackTutorialStart, trackPlaybackMilestone } from '../utils/analytics';
import { useDocumentTitle } from '../utils/documentTitle';
import { upsertVideoJsonLd } from '../utils/jsonld';
import { getContentFreshness } from '../utils/contentFreshness';
import { useModalA11y } from '../utils/useModalA11y';
import { TutorialFeedbackForm } from './TutorialFeedbackForm';
import { ReportContentControl } from './ReportContentControl';

interface TutorialDetailModalProps {
  tutorial: Tutorial | null;
  onClose: () => void;
  isCompleted: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onToggleCompleted: (id: string) => void;
  userNote: string;
  onSaveNote: (id: string, note: string) => void;
  onOpenAltiumLink: (title: string, url: string) => void;
  onSelectAdjacentTutorial: (direction: 'next' | 'prev') => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const TutorialDetailModal: React.FC<TutorialDetailModalProps> = ({
  tutorial,
  onClose,
  isCompleted,
  isBookmarked,
  onToggleBookmark,
  onToggleCompleted,
  userNote,
  onSaveNote,
  onOpenAltiumLink,
  onSelectAdjacentTutorial,
  hasPrev,
  hasNext
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'transcript' | 'commands' | 'notes' | 'feedback'>('overview');
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [currentNoteText, setCurrentNoteText] = useState(userNote || '');
  const [currentPlayTimestamp, setCurrentPlayTimestamp] = useState<number>(0);
  const [milestonesHit, setMilestonesHit] = useState<Set<number>>(new Set());
  const playerRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useDocumentTitle(
    tutorial?.title,
    tutorial?.shortDescription,
    tutorial ? `/tutorials/${tutorial.slug}` : undefined
  );
  useModalA11y(Boolean(tutorial), dialogRef, onClose);

  React.useEffect(() => {
    upsertVideoJsonLd(tutorial);
    return () => upsertVideoJsonLd(null);
  }, [tutorial]);

  React.useEffect(() => {
    setCurrentNoteText(userNote || '');
  }, [userNote, tutorial?.id]);

  React.useEffect(() => {
    if (tutorial && isPlayableTutorial(tutorial)) {
      trackTutorialStart(tutorial.id, tutorial.slug);
      setMilestonesHit(new Set());
    }
  }, [tutorial?.id]);

  React.useEffect(() => {
    if (!tutorial) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrev) {
        e.preventDefault();
        onSelectAdjacentTutorial('prev');
      } else if (e.key === 'ArrowRight' && hasNext) {
        e.preventDefault();
        onSelectAdjacentTutorial('next');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tutorial, hasPrev, hasNext, onSelectAdjacentTutorial]);

  if (!tutorial) return null;

  const handleSeek = (timestampSeconds: number) => {
    setCurrentPlayTimestamp(timestampSeconds);
    if (playerRef.current) {
      playerRef.current.currentTime = timestampSeconds;
    }
  };

  const isDevelop = tutorial.product === 'Altium Develop';
  const playable = isPlayableTutorial(tutorial);
  const freshness = getContentFreshness(tutorial);
  const thinEnrichment =
    !tutorial.chapters?.length &&
    !tutorial.transcript?.length &&
    !isPedagogicallyEnriched(tutorial.enrichmentStatus);

  const nextLesson = tutorial.nextRecommendedLessonId
    ? ALL_TUTORIALS.find((t) => t.id === tutorial.nextRecommendedLessonId)
    : undefined;
  const docLinks =
    tutorial.officialDocLinks?.length
      ? tutorial.officialDocLinks
      : tutorial.officialDocUrl
        ? [{ title: 'Altium Online Documentation', url: tutorial.officialDocUrl }]
        : [];
  const transcriptIsOutline = tutorial.transcriptKind === 'outline';

  const related = ALL_TUTORIALS.filter(
    (t) =>
      t.id !== tutorial.id &&
      (t.product === tutorial.product ||
        t.skills.some((s) => tutorial.skills.includes(s)) ||
        t.learningPathIds.some((p) => tutorial.learningPathIds.includes(p)))
  ).slice(0, 4);

  const filteredTranscript = (tutorial.transcript || []).filter(line => 
    !transcriptSearch || line.text.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  const onProgress = (state: { played: number; playedSeconds: number }) => {
    setCurrentPlayTimestamp(state.playedSeconds);
    const pct = Math.round(state.played * 100);
    for (const milestone of [25, 50, 75, 100] as const) {
      if (pct >= milestone && !milestonesHit.has(milestone)) {
        setMilestonesHit((prev) => new Set(prev).add(milestone));
        trackPlaybackMilestone(tutorial.id, milestone);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={tutorial.title}
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs">
            <span className={`px-2.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
              isDevelop ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
            }`}>
              {tutorial.product}
            </span>
            {tutorial.softwareVersion && (
              <span className="font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {tutorial.softwareVersion}
              </span>
            )}
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-medium">{tutorial.difficulty}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleBookmark(tutorial.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked 
                  ? 'bg-amber-950/80 text-amber-400 border-amber-800' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                if (!isCompleted) {
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                  });
                }
                onToggleCompleted(tutorial.id);
              }}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isCompleted
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{isCompleted ? 'Completed' : 'Mark Completed'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Close tutorial"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Video Player Section */}
          <div className="bg-black relative aspect-video w-full max-h-[420px] mx-auto border-b border-slate-800">
            {playable ? (
              <ReactPlayer
                ref={playerRef}
                src={`https://www.youtube.com/watch?v=${tutorial.youtubeId}`}
                width="100%"
                height="100%"
                controls={true}
                playing={true}
                onTimeUpdate={() => {
                  const el = playerRef.current;
                  if (!el || !el.duration) return;
                  onProgress({
                    played: el.currentTime / el.duration,
                    playedSeconds: el.currentTime,
                  });
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center p-6 text-center relative">
                <div className="w-16 h-16 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center shadow-xl mb-4">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <h3 className="text-lg font-bold text-white max-w-xl">{tutorial.title}</h3>
                <p className="text-xs text-amber-300 mt-2 font-mono">
                  {tutorial.youtubeStatus === 'playlist_only'
                    ? 'Playlist-only recovery — individual video URL not recovered yet'
                    : tutorial.youtubeStatus === 'unverified'
                      ? 'YouTube ID present but not oEmbed-confirmed — embed withheld'
                      : 'Video enrichment pending — not a playable YouTube embed'}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Status: {tutorial.youtubeStatus || 'unknown'} · {tutorial.durationFormatted}
                </p>
                <div className="mt-4 flex items-center space-x-2 text-xs bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Chapters, notes, and docs below still apply when available</span>
                </div>
              </div>
            )}
          </div>

          {/* Title & Metadata Banner */}
          <div className="p-4 sm:p-6 bg-slate-900 border-b border-slate-800 space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{tutorial.title}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{tutorial.durationFormatted}</span>
              </span>
              <span>•</span>
              <span>Role: {tutorial.role}</span>
              {tutorial.workflowStage && (
                <>
                  <span>•</span>
                  <span>Stage: {tutorial.workflowStage}</span>
                </>
              )}
              {isPedagogicallyEnriched(tutorial.enrichmentStatus) && (
                <>
                  <span>•</span>
                  <span className="text-emerald-400">
                    {tutorial.enrichmentStatus === 'enriched' ? 'enriched' : 'hand_enriched'}
                  </span>
                </>
              )}
              <span>•</span>
              <span>Published: {tutorial.publishedDate}</span>
            </div>

            {freshness.hasAny && (
              <div
                className="flex flex-wrap gap-2 pt-1"
                aria-label="Content freshness indicators"
              >
                {freshness.recordedDate && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-300">
                    <CalendarClock className="w-3 h-3 text-slate-400" />
                    Recorded {freshness.recordedDate}
                  </span>
                )}
                {freshness.lastVerifiedDate && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-300">
                    <BadgeCheck className="w-3 h-3 text-emerald-400" />
                    Last verified {freshness.lastVerifiedDate}
                  </span>
                )}
                {freshness.softwareVersion && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-300">
                    Version {freshness.softwareVersion}
                  </span>
                )}
                {freshness.stillCurrent !== undefined && (
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg border ${
                      freshness.stillCurrent
                        ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                        : 'bg-amber-950/60 border-amber-800 text-amber-200'
                    }`}
                  >
                    {freshness.stillCurrent ? 'Still current' : 'Needs re-verification'}
                  </span>
                )}
                {freshness.featureAvailability && (
                  <span className="w-full text-[11px] text-slate-400 leading-relaxed mt-0.5">
                    Feature availability: {freshness.featureAvailability}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tab Controls */}
          <div className="px-4 sm:px-6 bg-slate-950 border-b border-slate-800 flex items-center space-x-1 sm:space-x-4 overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'overview' ? 'border-blue-500 text-blue-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Overview & Outcomes</span>
            </button>

            <button
              onClick={() => setActiveTab('chapters')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'chapters' ? 'border-blue-500 text-blue-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Chapters ({tutorial.chapters.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('transcript')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'transcript' ? 'border-blue-500 text-blue-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Transcript</span>
            </button>

            {((tutorial.commands && tutorial.commands.length > 0) ||
              (tutorial.proceduralSteps && tutorial.proceduralSteps.length > 0)) && (
              <button
                onClick={() => setActiveTab('commands')}
                className={`py-3 px-3 border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
                  activeTab === 'commands' ? 'border-blue-500 text-blue-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>
                  Steps
                  {tutorial.proceduralSteps?.length
                    ? ` (${tutorial.proceduralSteps.length})`
                    : tutorial.commands?.length
                      ? ` (${tutorial.commands.length})`
                      : ''}
                </span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'notes' ? 'border-blue-500 text-blue-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>My Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('feedback')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'feedback' ? 'border-blue-500 text-blue-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Feedback</span>
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="p-4 sm:p-6 space-y-6">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {thinEnrichment && (
                  <div className="p-3 bg-amber-950/50 border border-amber-800/80 rounded-xl text-xs text-amber-200 font-mono">
                    Enrichment pending — summary below is audit-derived. Chapters/transcript will land in a later pass.
                    {tutorial.youtubeStatus ? ` · youtube_status=${tutorial.youtubeStatus}` : ''}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Lesson Summary</h4>
                  <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    {tutorial.fullSummary}
                  </p>
                </div>

                {tutorial.learningOutcomes && tutorial.learningOutcomes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Learning Outcomes</h4>
                    <ul className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      {tutorial.learningOutcomes.map((outcome, idx) => (
                        <li key={idx} className="text-sm text-slate-200 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Prerequisites</h4>
                    <ul className="space-y-1.5 text-sm text-slate-300 list-disc list-inside">
                      {tutorial.prerequisites.map((pre, idx) => (
                        <li key={idx}>{pre}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills Acquired */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Skills & Engineering Workflows</h4>
                  <div className="flex flex-wrap gap-2">
                    {tutorial.skills.map((skill, idx) => (
                      <span key={idx} className="text-xs bg-slate-800 text-blue-300 border border-slate-700 px-3 py-1 rounded-lg font-mono">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {(tutorial.role || tutorial.workflowStage) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                      <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Related role</h4>
                      <p className="text-sm text-slate-200">{tutorial.role}</p>
                    </div>
                    {tutorial.workflowStage && (
                      <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                        <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Workflow stage</h4>
                        <p className="text-sm text-cyan-300">{tutorial.workflowStage}</p>
                      </div>
                    )}
                  </div>
                )}

                {nextLesson && (
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Next recommended lesson</h4>
                    <Link
                      to={`/tutorials/${nextLesson.slug}`}
                      className="block p-4 bg-cyan-950/40 border border-cyan-800/80 rounded-xl hover:border-cyan-600 transition-colors"
                    >
                      <div className="text-sm font-semibold text-white">{nextLesson.title}</div>
                      <div className="text-[10px] font-mono text-cyan-400/80 mt-1">
                        {nextLesson.workflowStage || nextLesson.product} · Continue sequence →
                      </div>
                    </Link>
                  </div>
                )}

                {/* Downloadable Resources */}
                {tutorial.resources && tutorial.resources.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Project Files & Schematics</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tutorial.resources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <Download className="w-4 h-4 text-emerald-400" />
                            <div>
                              <div className="font-semibold text-white">{res.title}</div>
                              <div className="text-slate-400 font-mono text-[10px]">{res.type}</div>
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tracked Altium Action Callout */}
                <div className="p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Execute this workflow in Altium</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Start a free Altium evaluation license to practice this exact tutorial workflow in real CAD.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onOpenAltiumLink(tutorial.title, tutorial.altiumTrialUrl || defaultAltiumTrialUrl(tutorial.slug));
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow flex items-center space-x-1.5 shrink-0 transition-colors"
                  >
                    <span>{tutorial.altiumCtaLabel || 'Try in Altium'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Official Docs Links */}
                {docLinks.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Related official docs</h4>
                    <ul className="space-y-2">
                      {docLinks.map((doc, idx) => (
                        <li key={idx}>
                          <button
                            onClick={() => {
                              onOpenAltiumLink(doc.title, doc.url);
                            }}
                            className="text-xs text-blue-400 hover:underline inline-flex items-center space-x-1"
                          >
                            <span>{doc.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {related.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Related lessons</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {related.map((r) => (
                        <Link
                          key={r.id}
                          to={`/tutorials/${r.slug}`}
                          className="text-left p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-700 transition-colors block"
                        >
                          <div className="text-xs font-medium text-white line-clamp-2">{r.title}</div>
                          <div className="text-[10px] font-mono text-slate-500 mt-1">{r.product}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CHAPTERS TAB */}
            {activeTab === 'chapters' && (
              <div className="space-y-3">
                {tutorial.chapters.length > 0 ? (
                  <>
                    <p className="text-xs text-slate-400">Click any chapter timestamp to seek the video to that exact section:</p>
                    <div className="space-y-2">
                      {tutorial.chapters.map((ch, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSeek(ch.timestampSeconds)}
                          className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="font-mono text-xs text-cyan-400 bg-cyan-950 border border-cyan-800 px-2.5 py-1 rounded">
                              {ch.timestampFormatted}
                            </span>
                            <span className="text-sm font-medium text-slate-200">{ch.title}</span>
                          </div>
                          <Play className="w-4 h-4 text-slate-500 hover:text-cyan-400" />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-amber-300 font-mono">
                    Enrichment pending — chapter markers not authored for this imported lesson yet.
                  </p>
                )}
              </div>
            )}

            {/* TRANSCRIPT TAB */}
            {activeTab === 'transcript' && (
              <div className="space-y-4">
                {(tutorial.transcript || []).length > 0 ? (
                  <>
                    {transcriptIsOutline && (
                      <div className="p-3 bg-amber-950/40 border border-amber-800/70 rounded-xl text-xs text-amber-100 font-mono">
                        Lesson outline / summary — not a full verbatim transcript. Timestamps are pedagogical anchors for seeking.
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder={transcriptIsOutline ? 'Search outline text...' : 'Search transcript text...'}
                      value={transcriptSearch}
                      onChange={(e) => setTranscriptSearch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />

                    {filteredTranscript.length > 0 ? (
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {filteredTranscript.map((line, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSeek(line.timestampSeconds)}
                            className="p-2.5 bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 text-xs flex items-start space-x-3 cursor-pointer transition-colors"
                          >
                            <span className="font-mono text-xs text-blue-400 shrink-0 mt-0.5">{line.timestampFormatted}</span>
                            <p className="text-slate-300 leading-relaxed">{line.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No matching transcript lines found.</p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-amber-300 font-mono">
                    Enrichment pending — transcript not available for this imported lesson yet.
                  </p>
                )}
              </div>
            )}

            {/* COMMANDS / PROCEDURAL STEPS TAB */}
            {activeTab === 'commands' && (
              <div className="space-y-6">
                {tutorial.proceduralSteps && tutorial.proceduralSteps.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">Procedural steps for this Develop workflow:</p>
                    <ol className="space-y-2">
                      {tutorial.proceduralSteps.map((step) => (
                        <li
                          key={step.step}
                          className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3"
                        >
                          <span className="font-mono text-xs text-cyan-300 bg-cyan-950 border border-cyan-800 px-2 py-1 rounded shrink-0">
                            {step.step}
                          </span>
                          <div>
                            <div className="text-sm font-medium text-slate-100">{step.title}</div>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.detail}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {tutorial.commands && tutorial.commands.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">Key commands / actions demonstrated in this lesson:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tutorial.commands.map((cmd, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="text-xs font-medium text-slate-200">{cmd.action}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{cmd.context} Mode</div>
                          </div>
                          <span className="font-mono text-xs text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2.5 py-1 rounded">
                            {cmd.key}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* NOTES TAB */}
            {activeTab === 'notes' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">Your personal notes for this tutorial (saved locally in your browser):</p>
                <textarea
                  rows={6}
                  value={currentNoteText}
                  onChange={(e) => {
                    setCurrentNoteText(e.target.value);
                    onSaveNote(tutorial.id, e.target.value);
                  }}
                  placeholder="Record layout tips, net class parameters, or design rule considerations for this tutorial..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <div className="flex justify-end text-xs text-emerald-400 font-mono">
                  <span>Note auto-saved</span>
                </div>
              </div>
            )}

            {/* FEEDBACK TAB — central store via /api/feedback or VITE_FEEDBACK_ENDPOINT */}
            {activeTab === 'feedback' && (
              <div className="max-w-xl">
                <TutorialFeedbackForm key={tutorial.id} tutorial={tutorial} />
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer Navigation */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <button
            disabled={!hasPrev}
            onClick={() => onSelectAdjacentTutorial('prev')}
            aria-label="Previous lesson"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              hasPrev ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Lesson</span>
          </button>

          <div className="flex flex-col items-center gap-1 order-last sm:order-none w-full sm:w-auto">
            <span className="text-slate-500 font-mono hidden sm:inline">EET Catalog ID: {tutorial.id}</span>
            <ReportContentControl
              compact
              tutorialId={tutorial.id}
              slug={tutorial.slug}
              title={tutorial.title}
            />
          </div>

          <button
            disabled={!hasNext}
            onClick={() => onSelectAdjacentTutorial('next')}
            aria-label="Next lesson"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              hasNext ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-500' : 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600'
            }`}
          >
            <span>Next Lesson</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
