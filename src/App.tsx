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
import { PersonaJourneyView } from './components/PersonaJourneyView';
import { ProjectHubView } from './components/ProjectHubView';
import { ProductCatalogView } from './components/ProductCatalogView';
import { MyActivityView } from './components/MyActivityView';
import { InsightsView } from './components/InsightsView';
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
import { ChangelogView } from './components/ChangelogView';
import { SkillsIndexView } from './components/SkillsIndexView';
import { AdminView } from './components/AdminView';
import { AltiumDevelopLandingView } from './components/AltiumDevelopLandingView';
import { WorkflowMapView } from './components/WorkflowMapView';
import { Esp32CaseStudyView } from './components/Esp32CaseStudyView';
import { CompareWorkflowsView } from './components/CompareWorkflowsView';
import { FeedbackInboxView } from './components/FeedbackInboxView';
import { NotFoundView } from './components/NotFoundView';
import { pathForTab, tabFromPathname } from './routes';
import { withEetUtm } from './utils/outbound';
import {
  initAnalytics,
  trackAltiumCtaClick,
  trackPageView,
  trackPathProgression,
  trackTutorialComplete,
} from './utils/analytics';
import { useDocumentTitle } from './utils/documentTitle';

const DOCUMENT_TITLES: Record<string, string | null> = {
  home: null,
  altiumDevelop: 'Altium Develop Learning Hub',
  workflow: 'Product Development Workflow',
  myActivity: 'My Activity',
  insights: 'Site Insights',
  changelog: 'Changelog',
};

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = tabFromPathname(location.pathname);
  const titleOverride = Object.prototype.hasOwnProperty.call(DOCUMENT_TITLES, activeTab)
    ? DOCUMENT_TITLES[activeTab]
    : activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1');
  useDocumentTitle(titleOverride, undefined, location.pathname);

  React.useEffect(() => {
    initAnalytics();
  }, []);

  React.useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [missingTutorialSlug, setMissingTutorialSlug] = useState<string | null>(null);
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
  const [initialPersonaSlug, setInitialPersonaSlug] = useState<string | undefined>();
  const [initialProductSlug, setInitialProductSlug] = useState<string | undefined>();
  const [initialProjectSlug, setInitialProjectSlug] = useState<string | undefined>();
  const [initialWorkflowSlug, setInitialWorkflowSlug] = useState<string | undefined>();

  const setActiveTab = (tab: string) => {
    navigate(pathForTab(tab));
  };

  // Sync deep-link params → local UI state
  useEffect(() => {
    const tutorialMatch = matchPath('/tutorials/:slug', location.pathname);
    if (tutorialMatch?.params.slug) {
      const tut = ALL_TUTORIALS.find((t) => t.slug === tutorialMatch.params.slug);
      setSelectedTutorial(tut ?? null);
      setMissingTutorialSlug(tut ? null : tutorialMatch.params.slug);
    } else {
      setSelectedTutorial(null);
      setMissingTutorialSlug(null);
    }

    const pathMatch = matchPath('/learning-paths/:slug', location.pathname);
    setInitialPathSlug(pathMatch?.params.slug);

    const roleMatch = matchPath('/roles/:slug', location.pathname);
    setInitialRoleSlug(roleMatch?.params.slug);

    const personaMatch = matchPath('/personas/:slug', location.pathname);
    setInitialPersonaSlug(personaMatch?.params.slug);

    if (location.pathname === '/altium-develop') {
      setInitialProductSlug('altium-develop');
    } else {
      const productMatch = matchPath('/products/:slug', location.pathname);
      setInitialProductSlug(productMatch?.params.slug);
    }

    const projectMatch = matchPath('/projects/:slug', location.pathname);
    setInitialProjectSlug(projectMatch?.params.slug);

    const workflowMatch = matchPath('/workflow/:stageSlug', location.pathname);
    setInitialWorkflowSlug(workflowMatch?.params.stageSlug);

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
    const wasComplete = progress.completedTutorials.includes(targetId);
    const updated = toggleCompletedTutorial(targetId);
    setProgress(updated);

    if (!wasComplete && updated.completedTutorials.includes(targetId)) {
      const tut = ALL_TUTORIALS.find((t) => t.id === targetId);
      trackTutorialComplete(targetId, tut?.slug);
      for (const path of LEARNING_PATHS) {
        const moduleTutorialIds = [...new Set(path.modules.flatMap((m) => m.tutorialIds))];
        if (!moduleTutorialIds.includes(targetId)) continue;
        const total = moduleTutorialIds.length;
        const completed = moduleTutorialIds.filter((tid) =>
          updated.completedTutorials.includes(tid)
        ).length;
        const percentage = total ? Math.round((completed / total) * 100) : 0;
        trackPathProgression(path.id, completed, total, percentage);
      }
    }
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
    // Landing CTA URLs already carry full UTMs — do not overwrite with tutorial campaign defaults.
    const alreadyTracked =
      url.includes('utm_source=') &&
      url.includes('utm_medium=') &&
      url.includes('utm_campaign=');
    const tracked = alreadyTracked ? url : withEetUtm(url, selectedTutorial?.slug);
    trackAltiumCtaClick({ title, url: tracked, tutorialId: selectedTutorial?.id });
    logOutboundClick(selectedTutorial?.id || 'general-nav', title, tracked);
    setProgress(getInitialProgress());
    window.open(tracked, '_blank', 'noopener,noreferrer');
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

  const handleOpenToolFromPersona = (tab: string) => {
    navigate(pathForTab(tab));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-3 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-xs"
      >
        Skip to main content
      </a>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        progress={progress}
        onOpenAltiumLink={handleOpenAltiumLink}
        onOpenQuiz={() => setShowQuizModal(true)}
      />

      <main id="main-content" className="flex-1" tabIndex={-1}>
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
                            <span>
                              {new Set(path.modules.flatMap((m) => m.tutorialIds)).size} Lessons
                            </span>
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
              <>
                {missingTutorialSlug && (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    <div className="p-4 bg-amber-950/70 border border-amber-800 rounded-xl text-amber-200 text-sm">
                      No tutorial matches <span className="font-mono">{missingTutorialSlug}</span>.
                      Browse the enriched catalog below, or{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/tutorials')}
                        className="underline hover:text-white"
                      >
                        clear this deep link
                      </button>
                      .
                    </div>
                  </div>
                )}
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
              </>
            }
          />
          <Route
            path="/tutorials/:slug"
            element={
              <>
                {missingTutorialSlug && (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    <div className="p-4 bg-amber-950/70 border border-amber-800 rounded-xl text-amber-200 text-sm">
                      No tutorial matches <span className="font-mono">{missingTutorialSlug}</span>.
                      Browse the enriched catalog below, or{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/tutorials')}
                        className="underline hover:text-white"
                      >
                        clear this deep link
                      </button>
                      .
                    </div>
                  </div>
                )}
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
              </>
            }
          />

          <Route
            path="/projects"
            element={<ProjectHubView onSelectTutorial={handleSelectTutorial} />}
          />
          <Route
            path="/projects/:slug"
            element={
              <ProjectHubView
                onSelectTutorial={handleSelectTutorial}
                initialProjectSlug={initialProjectSlug}
              />
            }
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
            path="/personas"
            element={
              <PersonaJourneyView
                onSelectTutorial={handleSelectTutorial}
                onSelectPath={handleSelectPathFromRole}
                onOpenTool={handleOpenToolFromPersona}
                onOpenAltiumLink={handleOpenAltiumLink}
                onNavigate={navigate}
              />
            }
          />
          <Route
            path="/personas/:slug"
            element={
              <PersonaJourneyView
                initialPersonaSlug={initialPersonaSlug}
                onSelectTutorial={handleSelectTutorial}
                onSelectPath={handleSelectPathFromRole}
                onOpenTool={handleOpenToolFromPersona}
                onOpenAltiumLink={handleOpenAltiumLink}
                onNavigate={navigate}
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

          <Route path="/case-studies/esp32-product" element={<Esp32CaseStudyView />} />
          <Route path="/compare-workflows" element={<CompareWorkflowsView />} />

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

          <Route path="/impact" element={<Navigate to="/my-activity" replace />} />

          <Route
            path="/my-activity"
            element={
              <MyActivityView
                progress={progress}
                onOpenAltiumLink={handleOpenAltiumLink}
              />
            }
          />

          <Route
            path="/insights"
            element={<InsightsView setActiveTab={setActiveTab} />}
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

          <Route
            path="/changelog"
            element={<ChangelogView setActiveTab={setActiveTab} />}
          />

          <Route
            path="/altium-develop"
            element={
              <AltiumDevelopLandingView
                onSelectTutorial={handleSelectTutorial}
                onOpenAltiumLink={handleOpenAltiumLink}
                setActiveTab={setActiveTab}
                onNavigate={navigate}
              />
            }
          />

          <Route
            path="/workflow"
            element={
              <WorkflowMapView
                onSelectTutorial={handleSelectTutorial}
                onOpenAltiumLink={handleOpenAltiumLink}
              />
            }
          />
          <Route
            path="/workflow/:stageSlug"
            element={
              <WorkflowMapView
                onSelectTutorial={handleSelectTutorial}
                onOpenAltiumLink={handleOpenAltiumLink}
                initialStageSlug={initialWorkflowSlug}
              />
            }
          />

          <Route path="/admin" element={<AdminView />} />

          <Route
            path="/feedback-inbox"
            element={<FeedbackInboxView setActiveTab={setActiveTab} />}
          />

          <Route path="*" element={<NotFoundView />} />
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
