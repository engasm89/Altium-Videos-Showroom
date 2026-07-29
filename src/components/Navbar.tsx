import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Compass, 
  Layers, 
  Users, 
  CircuitBoard, 
  BarChart3, 
  CheckCircle2, 
  Bookmark, 
  ExternalLink,
  Keyboard,
  FileSpreadsheet,
  ShieldAlert,
  Wrench,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { UserProgress } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  progress: UserProgress;
  onOpenAltiumLink: (title: string, url: string) => void;
  onOpenQuiz: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  progress,
  onOpenAltiumLink,
  onOpenQuiz
}) => {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const completedCount = progress.completedTutorials.length;
  const bookmarkedCount = progress.bookmarkedTutorials.length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Banner Domain Notice */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-slate-200 font-bold">learn.eduengteam.com</span>
          <span className="hidden md:inline text-slate-400">| EET Hardware Design & Altium Workflows Learning Library</span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onOpenQuiz}
            className="text-cyan-300 hover:text-cyan-200 text-[11px] font-mono flex items-center space-x-1 transition-colors bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded"
          >
            <HelpCircle className="w-3 h-3 text-cyan-400" />
            <span>Take Skill Quiz</span>
          </button>

          <span className="text-slate-400 hidden sm:inline text-[11px]">201 Recovered Tutorials Enriched</span>
          
          <button 
            onClick={() => onOpenAltiumLink('Altium Evaluation Portal', 'https://www.altium.com/yt-eet-header-evaluation')}
            className="text-amber-400 hover:text-amber-300 text-[11px] font-medium flex items-center space-x-1 transition-colors"
          >
            <span>Altium Free Evaluation</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <CircuitBoard className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">EET</span>
                <span className="text-xs bg-blue-900/80 text-blue-300 px-1.5 py-0.5 rounded font-mono border border-blue-700">LIBRARY</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Electronics Product Development</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search 201 tutorials, DRC, ESP32, SolidWorks, ActiveBOM..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'catalog') setActiveTab('catalog');
                }}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('paths')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${
                activeTab === 'paths' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Paths</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${
                activeTab === 'catalog' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>201 Tutorials</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${
                activeTab === 'projects' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Projects</span>
            </button>

            <button
              onClick={() => setActiveTab('roles')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${
                activeTab === 'roles' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Roles</span>
            </button>

            {/* Interactive Engineering Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${
                  ['shortcuts', 'activebom', 'drc', 'stackup', 'notes', 'glossary'].includes(activeTab) 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>Tools</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {toolsDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs space-y-1"
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                >
                  <button
                    onClick={() => { setActiveTab('shortcuts'); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 flex items-center space-x-2 text-slate-200"
                  >
                    <Keyboard className="w-4 h-4 text-cyan-400" />
                    <span>Hotkey Command Palette</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('activebom'); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 flex items-center space-x-2 text-slate-200"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                    <span>ActiveBOM Risk Simulator</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('drc'); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 flex items-center space-x-2 text-slate-200"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>DRC Rulebook & Assistant</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('stackup'); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 flex items-center space-x-2 text-slate-200"
                  >
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Stackup & Impedance Calculator</span>
                  </button>
                  
                  <div className="border-t border-slate-700 my-1"></div>
                  
                  <button
                    onClick={() => { setActiveTab('notes'); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 flex items-center space-x-2 text-slate-200"
                  >
                    <Bookmark className="w-4 h-4 text-emerald-400" />
                    <span>My Engineering Notes</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('glossary'); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 flex items-center space-x-2 text-slate-200"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>Hardware Glossary</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('impact')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${
                activeTab === 'impact' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Impact</span>
            </button>
          </nav>

          {/* User Progress Indicators */}
          <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
            <div 
              onClick={() => setActiveTab('catalog')}
              className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full cursor-pointer hover:bg-emerald-900/60 transition-colors"
              title="Completed Lessons"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-semibold">{completedCount}</span>
              <span className="hidden sm:inline text-slate-400">Done</span>
            </div>

            {bookmarkedCount > 0 && (
              <div 
                onClick={() => setActiveTab('catalog')}
                className="flex items-center space-x-1 text-xs text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-1 rounded-full cursor-pointer hover:bg-amber-900/60 transition-colors"
                title="Bookmarked Tutorials"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span className="font-semibold">{bookmarkedCount}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-2 py-2 flex items-center justify-around text-[11px] font-medium text-slate-300 overflow-x-auto space-x-1">
        <button 
          onClick={() => setActiveTab('home')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'home' ? 'text-blue-400 bg-slate-800' : ''}`}
        >
          Home
        </button>
        <button 
          onClick={() => setActiveTab('paths')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'paths' ? 'text-blue-400 bg-slate-800' : ''}`}
        >
          Paths
        </button>
        <button 
          onClick={() => setActiveTab('catalog')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'catalog' ? 'text-blue-400 bg-slate-800' : ''}`}
        >
          Tutorials
        </button>
        <button 
          onClick={() => setActiveTab('shortcuts')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'shortcuts' ? 'text-blue-400 bg-slate-800' : ''}`}
        >
          Shortcuts
        </button>
        <button 
          onClick={() => setActiveTab('activebom')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'activebom' ? 'text-blue-400 bg-slate-800' : ''}`}
        >
          ActiveBOM
        </button>
        <button 
          onClick={() => setActiveTab('drc')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'drc' ? 'text-blue-400 bg-slate-800' : ''}`}
        >
          DRC Guide
        </button>
        <button 
          onClick={() => setActiveTab('notes')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'notes' ? 'text-blue-400 bg-slate-800' : ''}`}
        >
          Notes
        </button>
        <button 
          onClick={() => setActiveTab('glossary')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'glossary' ? 'text-blue-400 bg-slate-800' : ''}`}
        >
          Glossary
        </button>
        <button 
          onClick={() => setActiveTab('impact')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'impact' ? 'text-blue-400 bg-slate-800' : ''}`}
        >
          Impact
        </button>
      </div>
    </header>
  );
};
