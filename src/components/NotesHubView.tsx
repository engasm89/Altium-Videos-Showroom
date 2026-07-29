import React, { useState } from 'react';
import { BookMarked, Search, Edit3, Trash2, ExternalLink } from 'lucide-react';
import { UserProgress, Tutorial } from '../types';
import { ALL_TUTORIALS } from '../data/catalog';

interface NotesHubViewProps {
  progress: UserProgress;
  onSelectTutorial: (tutorial: Tutorial) => void;
  onSaveNote: (id: string, noteText: string) => void;
}

export const NotesHubView: React.FC<NotesHubViewProps> = ({
  progress,
  onSelectTutorial,
  onSaveNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const notesList = Object.entries(progress.notes)
    .filter(([id, note]) => note && note.trim().length > 0)
    .map(([id, note]) => {
      const tutorial = ALL_TUTORIALS.find((t) => t.id === id);
      return { id, note, tutorial };
    })
    .filter((entry) => entry.tutorial !== undefined)
    .filter(
      (entry) =>
        entry.tutorial!.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.note.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono bg-blue-950 text-blue-300 border border-blue-800 px-3 py-1 rounded-full">
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Personal Knowledge Base</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineering Notes Hub
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Review and search all the personal engineering notes and observations you've captured across the tutorial library.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes or lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {notesList.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <BookMarked className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300">No Notes Found</h3>
          <p className="text-xs text-slate-500 mt-2">
            You haven't taken any notes yet, or none match your search. Start a lesson to add notes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notesList.map(({ id, note, tutorial }) => (
            <div
              key={id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors flex flex-col"
            >
              <div 
                className="cursor-pointer group flex-1 space-y-3"
                onClick={() => tutorial && onSelectTutorial(tutorial)}
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {tutorial?.title}
                  </h4>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 shrink-0 ml-2" />
                </div>
                
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap flex-1">
                  {note}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => onSaveNote(id, '')}
                  className="text-rose-400 hover:text-rose-300 text-xs font-mono flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Note</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
