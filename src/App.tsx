import React, { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  matchPath,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  getInitialProgress,
  toggleCompletedTutorial,
  toggleBookmarkedTutorial,
  saveTutorialNote,
  logOutboundClick,
} from './utils/storage';
import { Tutorial, UserProgress } from './types';
import { ALL_TUTORIALS } from './data/catalog';
import { LEARNING_PATHS } from './data/learningPaths';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { CatalogView } from './components/CatalogView';
import { LearningPathView } from './components/LearningPathView';
import { RoleView } from './components/RoleView';
import { ProjectHubView } from './components/ProjectHubView';
import { ProductCatalogView } from './components/ProductCatalogView';
import { ImpactDashboardView } from './components/ImpactDashboardView';
import { ShortcutsView } from './components/ShortcutsView';
import { ActiveBomSimulatorView } from './components/ActiveBomSimulatorView';
import { DrcAssistantView } from './components/DrcAssistantView';
import { StackupInspectorView } from './components/StackupInspectorView';
import { QuizModal } from './components/QuizModal';
import { TutorialDetailModal } from './components/TutorialDetailModal';
import { NotesHubView } from './components/NotesHubView';
import { GlossaryView } from './components/GlossaryView';
import { AboutView } from './components/AboutView';
import { PrivacyView } from './components/PrivacyView';
import { SkillsIndexView } from './components/SkillsIndexView';
import { pathForTab, tabFromPathname } from './routes';

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = tabFromPathname(location.pathname);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress());
  const [productFilterOverride, setProductFilterOverride] = useState<string>(() => {
    return new URLSearchParams(location.search).get('product') || 'All';
  });
  const [skillFilterOverride, setSkillFilterOverride] = useState<string>(() => {
    return new URLSearchParams(location.search).get('skill') || 'All';
  });
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [initialPathSlug, setInitialPathSlug] = useState<string | undefined>();
  const [initialRoleSlug, setInitialRoleSlug] = useState<string | undefined>();
  const [initialProductSlug, setInitialProductSlug] = useState<string | undefined>();

  const setActiveTab = (tab: string) => {
    navigate(pathForTab(tab));
  };

  // Sync deep-link params → local UI state
  useEffect(() => {
    const tutorialMatch = matchPath('/tutorials/:slug', location.pathname);
    if (tutorialMatch?.params.slug) {
      const tut = ALL_TUTORIALS.find((t) => t.slug === tutorialMatch.params.slug);
      setSelectedTutorial(tut ?? null);
    } else {
      setSelectedTutorial(null);
    }

    const pathMatch = matchPath('/learning-paths/:slug', location.pathname);
    setInitialPathSlug(pathMatch?.params.slug);

    const roleMatch = matchPath('/roles/:slug', location.pathname);
    setInitialRoleSlug(roleMatch?.params.slug);

    const productMatch = matchPath('/products/:slug', location.pathname);
    setInitialProductSlug(productMatch?.params.slug);

    const params = new URLSearchParams(location.search);
    const product = params.get('product');
    setProductFilterOverride(product || 'All');
    const skill = params.get('skill');
    setSkillFilterOverride(skill || 'All');
  }, [location.pathname, location.search]);

  const handleToggleCompleted = (e?: React.MouseEvent, id?: string) => {
    if (e) e.stopPropagation();
    const targetId = id || selectedTutorial?.id;
    if (!targetId) return;
    const updated = toggleCompletedTutorial(targetId);
    setProgress(updated);
  };

  const handleToggleBookmark = (e?: React.MouseEvent, id?: string) => {
    if (e) e.stopPropagation();
    const targetId = id || selectedTutorial?.id;
    if (!targetId) return;
    const updated = toggleBookmarkedTutorial(targetId);
    setProgress(updated);
  };

  const handleSaveNote = (id: string, noteText: string) => {
    const updated = saveTutorialNote(id, noteText);
    setProgress(updated);
  };

  const handleOpenAltiumLink = (title: string, url: string) => {
    logOutboundClick(selectedTutorial?.id || 'general-nav', title, url);
    setProgress(getInitialProgress());
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSelectTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    navigate(`/tutorials/${tutorial.slug}`);
  };

  const handleCloseTutorial = () => {
    setSelectedTutorial(null);
    if (matchPath('/tutorials/:slug', location.pathname)) {
      navigate('/tutorials');
    }
  };

  const handleSelectAdjacentTutorial = (direction: 'next' | 'prev') => {
    if (!selectedTutorial) return;
    const currentIndex = ALL_TUTORIALS.findIndex((t) => t.id === selectedTutorial.id);
    if (currentIndex === -1) return;

    if (direction === 'next' && currentIndex < ALL_TUTORIALS.length - 1) {
      handleSelectTutorial(ALL_TUTORIALS[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      handleSelectTutorial(ALL_TUTORIALS[currentIndex - 1]);
    }
  };

  const currentIndex = selectedTutorial
    ? ALL_TUTORIALS.findIndex((t) => t.id === selectedTutorial.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < ALL_TUTORIALS.length - 1;

  const handleFilterProductFromHero = (product: string) => {
    setProductFilterOverride(product);
    navigate(`/tutorials?product=${encodeURIComponent(product)}`);
  };

  const handleSelectPathFromRole = (pathId: string) => {
    const path = LEARNING_PATHS.find((p) => p.id === pathId);
    navigate(path ? `/learning-paths/${path.slug}` : '/learning-paths');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        progress={progress}
        onOpenAltiumLink={handleOpenAltiumLink}
        onOpenQuiz={() => setShowQuizModal(true)}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <div className="space-y-12">
                <Hero
                  setActiveTab={setActiveTab}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onFilterProduct={handleFilterProductFromHero}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Featured Outcome Learning Paths
                      </h2>
                      <button
                        onClick={() => setActiveTab('paths')}
                        className="text-xs text-blue-400 hover:underline font-mono"
                      >
                        View All {LEARNING_PATHS.length} Paths →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {LEARNING_PATHS.slice(0, 3).map((path) => (
                        <div
                          key={path.id}
                          onClick={() => navigate(`/learning-paths/${path.slug}`)}
                          className="p-5 bg-slate-900 border border-slate-800 hover:border-blue-600 rounded-2xl cursor-pointer transition-all space-y-3 group shadow-lg"
                        >
                          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                            <span className="text-blue-400">{path.targetRole}</span>
                            <span>~{path.estimatedHours} hrs</span>
                          </div>
                          <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                            {path.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2">{path.headline}</p>
                          <div className="pt-2 flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold">
                            <span>{path.tutorialCount} Lessons</span>
                            <span>Start Path →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <CatalogView
                    searchQuery=""
                    setSearchQuery={setSearchQuery}
                    progress={progress}
                    onSelectTutorial={handleSelectTutorial}
                    onToggleBookmark={handleToggleBookmark}
                    onToggleCompleted={handleToggleCompleted}
                    productFilterOverride="All"
                    skillFilterOverride="All"
                  />
                </div>
              </div>
            }
          />

          <Route
            path="/learning-paths"
            element={
              <LearningPathView
                progress={progress}
                onSelectTutorial={handleSelectTutorial}
                initialPathSlug={undefined}
              />
            }
          />
          <Route
            path="/learning-paths/:slug"
            element={
              <LearningPathView
                progress={progress}
                onSelectTutorial={handleSelectTutorial}
                initialPathSlug={initialPathSlug}
              />
            }
          />

          <Route
            path="/tutorials"
            element={
              <CatalogView
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                progress={progress}
                onSelectTutorial={handleSelectTutorial}
                onToggleBookmark={handleToggleBookmark}
                onToggleCompleted={handleToggleCompleted}
                productFilterOverride={productFilterOverride}
                skillFilterOverride={skillFilterOverride}
              />
            }
          />
          <Route
            path="/tutorials/:slug"
            element={
              <CatalogView
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                progress={progress}
                onSelectTutorial={handleSelectTutorial}
                onToggleBookmark={handleToggleBookmark}
                onToggleCompleted={handleToggleCompleted}
                productFilterOverride={productFilterOverride}
                skillFilterOverride={skillFilterOverride}
              />
            }
          />

          <Route
            path="/projects"
            element={<ProjectHubView onSelectTutorial={handleSelectTutorial} />}
          />

          <Route
            path="/roles"
            element={
              <RoleView
                onSelectTutorial={handleSelectTutorial}
                onSelectPath={handleSelectPathFromRole}
                initialRoleSlug={undefined}
              />
            }
          />
          <Route
            path="/roles/:slug"
            element={
              <RoleView
                onSelectTutorial={handleSelectTutorial}
                onSelectPath={handleSelectPathFromRole}
                initialRoleSlug={initialRoleSlug}
              />
            }
          />

          <Route
            path="/products"
            element={
              <ProductCatalogView
                onSelectTutorial={handleSelectTutorial}
                onFilterProduct={handleFilterProductFromHero}
                initialProductSlug={undefined}
              />
            }
          />
          <Route
            path="/products/:slug"
            element={
              <ProductCatalogView
                onSelectTutorial={handleSelectTutorial}
                onFilterProduct={handleFilterProductFromHero}
                initialProductSlug={initialProductSlug}
              />
            }
          />

          <Route
            path="/tools/shortcuts"
            element={<ShortcutsView onSelectTutorial={handleSelectTutorial} />}
          />
          <Route
            path="/tools/activebom"
            element={<ActiveBomSimulatorView onSelectTutorial={handleSelectTutorial} />}
          />
          <Route
            path="/tools/drc"
            element={<DrcAssistantView onSelectTutorial={handleSelectTutorial} />}
          />
          <Route
            path="/tools/stackup"
            element={<StackupInspectorView onSelectTutorial={handleSelectTutorial} />}
          />

          <Route
            path="/impact"
            element={
              <ImpactDashboardView
                progress={progress}
                onOpenAltiumLink={handleOpenAltiumLink}
              />
            }
          />

          <Route
            path="/notes"
            element={
              <NotesHubView
                progress={progress}
                onSelectTutorial={handleSelectTutorial}
                onSaveNote={handleSaveNote}
              />
            }
          />

          <Route path="/glossary" element={<GlossaryView />} />

          <Route
            path="/skills"
            element={
              <SkillsIndexView
                setActiveTab={setActiveTab}
              />
            }
          />

          <Route
            path="/about"
            element={
              <AboutView
                setActiveTab={setActiveTab}
                onOpenAltiumLink={handleOpenAltiumLink}
              />
            }
          />

          <Route
            path="/privacy"
            element={<PrivacyView setActiveTab={setActiveTab} />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {selectedTutorial && (
        <TutorialDetailModal
          tutorial={selectedTutorial}
          onClose={handleCloseTutorial}
          isCompleted={progress.completedTutorials.includes(selectedTutorial.id)}
          isBookmarked={progress.bookmarkedTutorials.includes(selectedTutorial.id)}
          onToggleBookmark={(id) => handleToggleBookmark(undefined, id)}
          onToggleCompleted={(id) => handleToggleCompleted(undefined, id)}
          userNote={progress.notes[selectedTutorial.id] || ''}
          onSaveNote={handleSaveNote}
          onOpenAltiumLink={handleOpenAltiumLink}
          onSelectAdjacentTutorial={handleSelectAdjacentTutorial}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      )}

      {showQuizModal && <QuizModal onClose={() => setShowQuizModal(false)} />}

      <Footer setActiveTab={setActiveTab} onOpenAltiumLink={handleOpenAltiumLink} />
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
