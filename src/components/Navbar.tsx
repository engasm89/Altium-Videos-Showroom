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
  Cpu,
  Wrench,
  HelpCircle,
  ChevronDown,
  Sparkles,
  GraduationCap,
  Cloud,
  GitBranch,
} from 'lucide-react';
import { UserProgress } from '../types';
import { SearchOverlay } from './SearchOverlay';
import { APP_STAGE_LABEL, APP_VERSION } from '../utils/siteConfig';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  progress: UserProgress;
  onOpenAltiumLink: (title: string, url: string) => void;
  onOpenQuiz: () => void;
}

interface PrimaryNavItem {
  tab: string;
  label: string;
  icon: React.ReactNode;
}

const PRIMARY_NAV: PrimaryNavItem[] = [
  { tab: 'paths', label: 'Learning Paths', icon: <Compass className="w-4 h-4 text-blue-400" /> },
  { tab: 'projects', label: 'Projects', icon: <Layers className="w-4 h-4 text-amber-400" /> },
  { tab: 'products', label: 'Products', icon: <Cpu className="w-4 h-4 text-cyan-400" /> },
  { tab: 'roles', label: 'Engineering Roles', icon: <Users className="w-4 h-4 text-emerald-400" /> },
  { tab: 'skills', label: 'Skills', icon: <GraduationCap className="w-4 h-4 text-fuchsia-300" /> },
  { tab: 'catalog', label: 'All Tutorials', icon: <BookOpen className="w-4 h-4 text-blue-300" /> },
  { tab: 'myActivity', label: 'My Activity', icon: <BarChart3 className="w-4 h-4 text-cyan-400" /> },
];

const TOOLS_MENU_TABS = ['shortcuts', 'activebom', 'drc', 'stackup', 'notes', 'glossary'];

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
  const [searchOpen, setSearchOpen] = useState(false);
  const completedCount = progress.completedTutorials.length;
  const bookmarkedCount = progress.bookmarkedTutorials.length;

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top utility strip: identity + independence notice, not a vendor ad slot */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800/80 flex items-center justify-between font-mono">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold">learn.eduengteam.com</span>
          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-amber-700/70 bg-amber-950/40 text-amber-300">
            {APP_STAGE_LABEL}
          </span>
          <span className="hidden sm:inline text-slate-500">v{APP_VERSION}</span>
          <span className="hidden md:inline text-slate-500">| Independent EET learning library</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenQuiz}
            className="text-brand-bright hover:text-cyan-200 text-[11px] flex items-center space-x-1 transition-colors"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Take Skill Quiz</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className="hidden sm:inline text-slate-500 hover:text-slate-300 text-[11px] transition-colors"
          >
            Not affiliated with Altium LLC
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo & Brand — always primary identity */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <CircuitBoard className="w-6 h-6 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-lg text-white tracking-tight">EET</span>
                <span className="text-xs bg-blue-900/80 text-blue-300 px-1.5 py-0.5 rounded font-mono border border-blue-700">LIBRARY</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Altium Designer &amp; Develop library</p>
            </div>
          </div>

          {/* Partner Develop hub — prominent, but secondary to EET brand (outline chip, not primary tab style) */}
          <button
            type="button"
            onClick={() => setActiveTab('altiumDevelop')}
            className={`hidden md:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors shrink-0 ${
              activeTab === 'altiumDevelop'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                : 'bg-cyan-950/50 text-cyan-300 border-cyan-800/80 hover:bg-cyan-900/60 hover:text-cyan-100'
            }`}
            title="Independent Altium Develop learning hub"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Develop Hub</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('workflow')}
            className={`hidden lg:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors shrink-0 ${
              activeTab === 'workflow'
                ? 'bg-slate-100 text-slate-950 border-slate-300'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-cyan-700 hover:text-cyan-200'
            }`}
            title="Interactive product-development workflow map"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Workflow</span>
          </button>

          {/* Search Bar (compact, desktop only — Search nav button covers mobile + full overlay) */}
          <div className="flex-1 max-w-sm relative hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tutorials, skills, commands..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'catalog') setActiveTab('catalog');
                }}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Primary Navigation Items */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium overflow-x-auto">
            {PRIMARY_NAV.map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`px-2.5 py-2 rounded-md transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === item.tab ? 'bg-brand text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {/* Search trigger (nav-level entry point per site IA; opens full overlay) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="px-2.5 py-2 rounded-md transition-colors flex items-center space-x-1.5 whitespace-nowrap text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Open search"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search</span>
            </button>

            {/* Secondary interactive tools, tucked away so the required nav set stays scannable */}
            <div className="relative">
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`px-2.5 py-2 rounded-md transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
                  TOOLS_MENU_TABS.includes(activeTab)
                    ? 'bg-brand text-white'
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
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Hotkey Command Palette</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('activebom'); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 flex items-center space-x-2 text-slate-200"
                  >
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>ActiveBOM Risk Simulator</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('drc'); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 flex items-center space-x-2 text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-rose-400" />
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

            {/* Mobile search trigger — inline search bar above is desktop-only */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-2 py-2 flex items-center overflow-x-auto text-[11px] font-medium text-slate-300 space-x-1">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'home' ? 'text-brand-bright bg-slate-800' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('altiumDevelop')}
          className={`px-2 py-1 rounded whitespace-nowrap border ${
            activeTab === 'altiumDevelop'
              ? 'text-slate-950 bg-cyan-500 border-cyan-400'
              : 'text-cyan-300 border-cyan-900/60 bg-cyan-950/40'
          }`}
        >
          Develop Hub
        </button>
        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-2 py-1 rounded whitespace-nowrap ${
            activeTab === 'workflow' ? 'text-brand-bright bg-slate-800' : ''
          }`}
        >
          Workflow
        </button>
        {PRIMARY_NAV.map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === item.tab ? 'text-brand-bright bg-slate-800' : ''}`}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'notes' ? 'text-brand-bright bg-slate-800' : ''}`}
        >
          Notes
        </button>
        <button
          onClick={() => setActiveTab('glossary')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'glossary' ? 'text-brand-bright bg-slate-800' : ''}`}
        >
          Glossary
        </button>
      </div>

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSubmit={() => setActiveTab('catalog')}
      />
    </header>
  );
};
