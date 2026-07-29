import React, { useState, useRef } from 'react';
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
  MessageSquare
} from 'lucide-react';
import { Tutorial } from '../types';
import { isPlayableYoutubeId } from '../utils/youtube';
import { defaultAltiumTrialUrl } from '../utils/outbound';

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
  if (!tutorial) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'transcript' | 'commands' | 'notes'>('overview');
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [currentNoteText, setCurrentNoteText] = useState(userNote || '');
  const [currentPlayTimestamp, setCurrentPlayTimestamp] = useState<number>(0);
  const playerRef = useRef<HTMLVideoElement>(null);

  const handleSeek = (timestampSeconds: number) => {
    setCurrentPlayTimestamp(timestampSeconds);
    if (playerRef.current) {
      playerRef.current.currentTime = timestampSeconds;
    }
  };

  const isDevelop = tutorial.product === 'Altium Develop';
  const playable = isPlayableYoutubeId(tutorial.youtubeId);

  const filteredTranscript = (tutorial.transcript || []).filter(line => 
    !transcriptSearch || line.text.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
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
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center p-6 text-center relative">
                <div className="w-16 h-16 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center shadow-xl mb-4">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <h3 className="text-lg font-bold text-white max-w-xl">{tutorial.title}</h3>
                <p className="text-xs text-amber-300 mt-2 font-mono">
                  Video enrichment pending — this lesson outline is not a playable YouTube embed
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">Duration estimate {tutorial.durationFormatted}</p>
                <div className="mt-4 flex items-center space-x-2 text-xs bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Chapters, notes, and docs below still apply</span>
                </div>
              </div>
            )}
          </div>

          {/* Title & Metadata Banner */}
          <div className="p-4 sm:p-6 bg-slate-900 border-b border-slate-800 space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{tutorial.title}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{tutorial.durationFormatted}</span>
              </span>
              <span>•</span>
              <span>Role: {tutorial.role}</span>
              <span>•</span>
              <span>Published: {tutorial.publishedDate}</span>
            </div>
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

            {tutorial.commands && tutorial.commands.length > 0 && (
              <button
                onClick={() => setActiveTab('commands')}
                className={`py-3 px-3 border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
                  activeTab === 'commands' ? 'border-blue-500 text-blue-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Commands ({tutorial.commands.length})</span>
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
          </div>

          {/* Tab Content Panes */}
          <div className="p-4 sm:p-6 space-y-6">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Lesson Summary</h4>
                  <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    {tutorial.fullSummary}
                  </p>
                </div>

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
                    onClick={() => onOpenAltiumLink(tutorial.title, tutorial.altiumTrialUrl || defaultAltiumTrialUrl(tutorial.slug))}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow flex items-center space-x-1.5 shrink-0 transition-colors"
                  >
                    <span>Try in Altium</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Official Docs Link */}
                {tutorial.officialDocUrl && (
                  <div className="text-xs text-slate-400">
                    <span>Reference Official Docs: </span>
                    <button
                      onClick={() => onOpenAltiumLink('Official Documentation', tutorial.officialDocUrl!)}
                      className="text-blue-400 hover:underline inline-flex items-center space-x-1"
                    >
                      <span>Altium Online Documentation</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CHAPTERS TAB */}
            {activeTab === 'chapters' && (
              <div className="space-y-3">
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
              </div>
            )}

            {/* TRANSCRIPT TAB */}
            {activeTab === 'transcript' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search transcript text..."
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
              </div>
            )}

            {/* COMMANDS TAB */}
            {activeTab === 'commands' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">Key keyboard hotkeys and commands demonstrated in this lesson:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(tutorial.commands || []).map((cmd, idx) => (
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

          </div>

        </div>

        {/* Modal Footer Navigation */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0 text-xs">
          <button
            disabled={!hasPrev}
            onClick={() => onSelectAdjacentTutorial('prev')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              hasPrev ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Lesson</span>
          </button>

          <span className="text-slate-500 font-mono hidden sm:inline">EET Catalog ID: {tutorial.id}</span>

          <button
            disabled={!hasNext}
            onClick={() => onSelectAdjacentTutorial('next')}
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
