import React from 'react';
import { 
  Play, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Cpu, 
  Cloud, 
  Eye, 
  ChevronRight 
} from 'lucide-react';
import { Tutorial } from '../types';

interface TutorialCardProps {
  tutorial: Tutorial;
  isCompleted: boolean;
  isBookmarked: boolean;
  onSelect: (tutorial: Tutorial) => void;
  onToggleBookmark: (e: React.MouseEvent, id: string) => void;
  onToggleCompleted: (e: React.MouseEvent, id: string) => void;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({
  tutorial,
  isCompleted,
  isBookmarked,
  onSelect,
  onToggleBookmark,
  onToggleCompleted
}) => {
  const isDevelop = tutorial.product === 'Altium Develop';

  return (
    <div 
      onClick={() => onSelect(tutorial)}
      className={`group bg-slate-900 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between hover:shadow-xl ${
        isCompleted 
          ? 'border-emerald-700/60 bg-slate-900/90' 
          : 'border-slate-800 hover:border-slate-600'
      }`}
    >
      <div>
        {/* Thumbnail area */}
        <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center group-hover:opacity-95 transition-opacity">
          {/* Simulated circuit trace background for visual realism */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />
          
          <div className="relative z-10 flex flex-col items-center text-center p-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform ${
              isDevelop ? 'bg-cyan-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <span className="mt-2 text-xs font-mono text-slate-400 max-w-[200px] truncate">
              {tutorial.youtubeId.startsWith('eet') ? 'EET Tutorial Video' : `YouTube: ${tutorial.youtubeId}`}
            </span>
          </div>

          {/* Top Overlays */}
          <div className="absolute top-2 left-2 flex items-center space-x-1.5 z-20">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
              isDevelop ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-800' : 'bg-blue-950/90 text-blue-300 border border-blue-800'
            }`}>
              {tutorial.product}
            </span>
            {tutorial.featured && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/90 text-amber-300 border border-amber-800">
                Featured
              </span>
            )}
          </div>

          <div className="absolute top-2 right-2 flex items-center space-x-1 z-20">
            <button
              onClick={(e) => onToggleBookmark(e, tutorial.id)}
              className="p-1.5 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Tutorial'}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Bottom Overlay: Duration & Views */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800/80 z-20 backdrop-blur-sm">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{tutorial.durationFormatted}</span>
            </div>
            {tutorial.viewsCount && (
              <div className="flex items-center space-x-1 text-slate-400">
                <Eye className="w-3 h-3" />
                <span>{tutorial.viewsCount.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2">
          
          {/* Difficulty & Role */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-slate-300">{tutorial.difficulty}</span>
            <span className="truncate max-w-[150px] text-slate-400">{tutorial.role}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
            {tutorial.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {tutorial.shortDescription}
          </p>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-1 pt-1">
            {tutorial.skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                {skill}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-3 bg-slate-950/50 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <button
          onClick={(e) => onToggleCompleted(e, tutorial.id)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-colors ${
            isCompleted
              ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-800/80'
              : 'text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
        </button>

        <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center font-medium">
          <span>Watch</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>

    </div>
  );
};
