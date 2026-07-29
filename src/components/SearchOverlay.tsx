import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { SearchInput } from './ui';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubmit: () => void;
}

const QUICK_SEARCHES = ['DRC', 'ESP32', 'ActiveBOM', 'SolidWorks', 'Gerber', 'Stackup'];

/**
 * Full-screen search overlay reachable from the "Search" nav item (and via mobile,
 * where the inline navbar search bar is hidden). Wraps the shared `SearchInput`
 * primitive and hands off to the catalog view, which owns actual result rendering.
 */
export const SearchOverlay: React.FC<SearchOverlayProps> = ({ open, onClose, searchQuery, setSearchQuery, onSubmit }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-950/80 backdrop-blur-sm px-4 pt-24 sm:pt-32"
      onMouseDown={(e) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) onClose();
      }}
    >
      <div ref={containerRef} className="w-full max-w-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Search the Library</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <SearchInput
          size="lg"
          autoFocus
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={() => {
            onSubmit();
            onClose();
          }}
          placeholder="Search tutorials, learning paths, skills, commands..."
          suggestions={QUICK_SEARCHES}
          onSuggestionClick={(s) => {
            setSearchQuery(s);
            onSubmit();
            onClose();
          }}
        />
      </div>
    </div>
  );
};
