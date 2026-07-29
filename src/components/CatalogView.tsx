import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  X, 
  BookOpen, 
  SlidersHorizontal, 
  CheckCircle2, 
  Bookmark, 
  ArrowUpDown,
  Grid,
  List as ListIcon
} from 'lucide-react';
import { ALL_TUTORIALS, catalogCounts } from '../data/catalog';
import { LEARNING_PATHS } from '../data/learningPaths';
import { HARDWARE_PROJECTS } from '../data/projects';
import { searchAndFilterTutorials, getAllSkillsList } from '../utils/search';
import { Tutorial, SearchFilterState, UserProgress } from '../types';
import { TutorialCard } from './TutorialCard';
import { useDocumentTitle } from '../utils/documentTitle';
import { trackEvent } from '../utils/analytics';

interface CatalogViewProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  progress: UserProgress;
  onSelectTutorial: (tutorial: Tutorial) => void;
  onToggleBookmark: (e: React.MouseEvent, id: string) => void;
  onToggleCompleted: (e: React.MouseEvent, id: string) => void;
  productFilterOverride?: string;
  skillFilterOverride?: string;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  searchQuery,
  setSearchQuery,
  progress,
  onSelectTutorial,
  onToggleBookmark,
  onToggleCompleted,
  productFilterOverride,
  skillFilterOverride
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState<SearchFilterState>({
    query: searchQuery,
    product: (productFilterOverride as SearchFilterState['product']) || 'All',
    role: 'All',
    difficulty: 'All',
    skill: (skillFilterOverride as SearchFilterState['skill']) || 'All',
    learningPathId: 'All',
    projectId: 'All',
    durationRange: 'All',
    sortBy: 'popular'
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showOnlyCompleted, setShowOnlyCompleted] = useState(false);
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);

  useDocumentTitle('Tutorial Catalog');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pathId = params.get('path');
    const projectId = params.get('project');
    if (pathId || projectId) {
      setFilters((prev) => ({
        ...prev,
        learningPathId: pathId || prev.learningPathId,
        projectId: projectId || prev.projectId,
      }));
    }
  }, [location.search]);

  useEffect(() => {
    if (productFilterOverride && productFilterOverride !== 'All') {
      setFilters((prev) => ({
        ...prev,
        product: productFilterOverride as SearchFilterState['product'],
      }));
    }
  }, [productFilterOverride]);

  useEffect(() => {
    if (skillFilterOverride && skillFilterOverride !== 'All') {
      setFilters((prev) => ({
        ...prev,
        skill: skillFilterOverride,
      }));
    }
  }, [skillFilterOverride]);

  // Keep search query in sync
  const currentQuery = searchQuery;

  const activeFilters: SearchFilterState = {
    ...filters,
    query: currentQuery,
    product:
      productFilterOverride && productFilterOverride !== 'All'
        ? (productFilterOverride as SearchFilterState['product'])
        : filters.product,
    skill:
      skillFilterOverride && skillFilterOverride !== 'All'
        ? skillFilterOverride
        : filters.skill,
  };

  const { results, totalMatches } = searchAndFilterTutorials(ALL_TUTORIALS, activeFilters);

  // Further filter for user toggles
  let displayed = [...results];
  if (showOnlyCompleted) {
    displayed = displayed.filter(t => progress.completedTutorials.includes(t.id));
  }
  if (showOnlyBookmarked) {
    displayed = displayed.filter(t => progress.bookmarkedTutorials.includes(t.id));
  }

  const allSkills = getAllSkillsList(ALL_TUTORIALS);

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      query: '',
      product: 'All',
      role: 'All',
      difficulty: 'All',
      skill: 'All',
      learningPathId: 'All',
      projectId: 'All',
      durationRange: 'All',
      sortBy: 'popular'
    });
    setShowOnlyCompleted(false);
    setShowOnlyBookmarked(false);
    if (location.pathname.startsWith('/tutorials/') && location.pathname !== '/tutorials') {
      navigate('/tutorials');
    } else if (location.search) {
      navigate('/tutorials');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-mono bg-blue-950 text-blue-300 border border-blue-800 px-3 py-1 rounded-full">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Imported EET Video Catalog</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {catalogCounts.total} Named Tutorials
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Full MD→CSV catalog — {catalogCounts.playable} oEmbed-public embeds,
          {catalogCounts.otherAdjacent} adjacent/search-tail,
          {catalogCounts.enriched} enriched overlays
          {catalogCounts.developEnriched != null ? ` (${catalogCounts.developEnriched} Develop)` : ''}. CSV wins over xlsx; no invented YouTube IDs.
        </p>
      </div>

      {/* Filter Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        
        {/* Top Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by keyword, DRC rule, net label, component, or shortcut..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Toggle Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowOnlyCompleted(!showOnlyCompleted)}
              className={`px-3 py-2 rounded-xl text-xs font-mono border flex items-center space-x-1.5 transition-colors ${
                showOnlyCompleted 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed ({progress.completedTutorials.length})</span>
            </button>

            <button
              onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
              className={`px-3 py-2 rounded-xl text-xs font-mono border flex items-center space-x-1.5 transition-colors ${
                showOnlyBookmarked 
                  ? 'bg-amber-950 text-amber-300 border-amber-800' 
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarks ({progress.bookmarkedTutorials.length})</span>
            </button>
          </div>

        </div>

        {/* Multi-Select Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 pt-2 text-xs border-t border-slate-800">
          
          {/* Product Filter */}
          <div>
            <label className="block font-mono text-[10px] text-slate-400 uppercase mb-1">Product</label>
            <select
              value={activeFilters.product}
              onChange={(e) => {
                const product = e.target.value as SearchFilterState['product'];
                setFilters({ ...filters, product });
                navigate(
                  product === 'All'
                    ? '/tutorials'
                    : `/tutorials?product=${encodeURIComponent(product)}`
                );
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Products ({ALL_TUTORIALS.length})</option>
              <option value="Altium Designer">Altium Designer ({catalogCounts.designer})</option>
              <option value="Altium Develop">Altium Develop ({catalogCounts.develop})</option>
              {catalogCounts.otherAdjacent > 0 && (
                <option value="Other / Adjacent">
                  Other / Adjacent ({catalogCounts.otherAdjacent})
                </option>
              )}
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block font-mono text-[10px] text-slate-400 uppercase mb-1">Engineering Role</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value as SearchFilterState['role'] })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Engineering Roles</option>
              <option value="Hardware & PCB Engineering">Hardware & PCB</option>
              <option value="Procurement & Components">Procurement & Components</option>
              <option value="Manufacturing & Quality">Manufacturing & Quality</option>
              <option value="Product & Applications">Product & Applications</option>
              <option value="Engineering Leadership">Engineering Leadership</option>
              <option value="Compliance & Sustainability">Compliance & Sustainability</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block font-mono text-[10px] text-slate-400 uppercase mb-1">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value as SearchFilterState['difficulty'] })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Skill Filter */}
          <div>
            <label className="block font-mono text-[10px] text-slate-400 uppercase mb-1">Skill</label>
            <select
              value={activeFilters.skill}
              onChange={(e) => {
                setFilters({ ...filters, skill: e.target.value });
                navigate(
                  e.target.value === 'All'
                    ? '/tutorials'
                    : `/tutorials?skill=${encodeURIComponent(e.target.value)}`
                );
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Skills</option>
              {allSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Learning Path */}
          <div>
            <label className="block font-mono text-[10px] text-slate-400 uppercase mb-1">Learning Path</label>
            <select
              value={filters.learningPathId}
              onChange={(e) => {
                setFilters({ ...filters, learningPathId: e.target.value });
                trackEvent('search', { filter: 'learningPath', value: e.target.value });
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Paths</option>
              {LEARNING_PATHS.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          {/* Project */}
          <div>
            <label className="block font-mono text-[10px] text-slate-400 uppercase mb-1">Project</label>
            <select
              value={filters.projectId}
              onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Projects</option>
              {HARDWARE_PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          {/* Duration Filter */}
          <div>
            <label className="block font-mono text-[10px] text-slate-400 uppercase mb-1">Duration</label>
            <select
              value={filters.durationRange}
              onChange={(e) => setFilters({ ...filters, durationRange: e.target.value as SearchFilterState['durationRange'] })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">Any Duration</option>
              <option value="< 5 min">&lt; 5 Minutes</option>
              <option value="5-15 min">5 - 15 Minutes</option>
              <option value="15+ min">15+ Minutes</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block font-mono text-[10px] text-slate-400 uppercase mb-1">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as SearchFilterState['sortBy'] })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="popular">Featured / Newest</option>
              <option value="newest">Newest First</option>
              <option value="duration">Longest Duration</option>
              <option value="relevance">Relevance</option>
            </select>
          </div>

        </div>

        {/* Results Counter & Reset Action */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
          <div>
            Showing <span className="text-white font-bold">{displayed.length}</span> of <span className="text-white">{ALL_TUTORIALS.length}</span> tutorials
          </div>

          {(activeFilters.product !== 'All' || activeFilters.role !== 'All' || activeFilters.difficulty !== 'All' || activeFilters.skill !== 'All' || filters.learningPathId !== 'All' || filters.projectId !== 'All' || searchQuery || showOnlyCompleted || showOnlyBookmarked) && (
            <button
              onClick={resetFilters}
              className="text-amber-400 hover:underline flex items-center space-x-1"
            >
              <X className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

      </div>

      {/* Tutorials Grid */}
      {displayed.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayed.map((tut) => (
            <TutorialCard
              key={tut.id}
              tutorial={tut}
              isCompleted={progress.completedTutorials.includes(tut.id)}
              isBookmarked={progress.bookmarkedTutorials.includes(tut.id)}
              onSelect={onSelectTutorial}
              onToggleBookmark={onToggleBookmark}
              onToggleCompleted={onToggleCompleted}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No tutorials match your active filter criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search query or clear the active product/role filters to see all {ALL_TUTORIALS.length} tutorials.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-500 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
