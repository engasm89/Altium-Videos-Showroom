import React, { useState } from 'react';
import { 
  getInitialProgress, 
  toggleCompletedTutorial, 
  toggleBookmarkedTutorial, 
  saveTutorialNote, 
  logOutboundClick 
} from './utils/storage';
import { Tutorial, UserProgress } from './types';
import { ALL_TUTORIALS } from './data/catalog';
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
import { LEARNING_PATHS } from './data/learningPaths';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress());
  const [productFilterOverride, setProductFilterOverride] = useState<string>('All');
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);

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
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSelectAdjacentTutorial = (direction: 'next' | 'prev') => {
    if (!selectedTutorial) return;
    const currentIndex = ALL_TUTORIALS.findIndex(t => t.id === selectedTutorial.id);
    if (currentIndex === -1) return;

    if (direction === 'next' && currentIndex < ALL_TUTORIALS.length - 1) {
      setSelectedTutorial(ALL_TUTORIALS[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setSelectedTutorial(ALL_TUTORIALS[currentIndex - 1]);
    }
  };

  const currentIndex = selectedTutorial ? ALL_TUTORIALS.findIndex(t => t.id === selectedTutorial.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < ALL_TUTORIALS.length - 1;

  const handleFilterProductFromHero = (product: string) => {
    setProductFilterOverride(product);
    setActiveTab('catalog');
  };

  const handleSelectPathFromRole = (pathId: string) => {
    setActiveTab('paths');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        progress={progress}
        onOpenAltiumLink={handleOpenAltiumLink}
        onOpenQuiz={() => setShowQuizModal(true)}
      />

      {/* Main Content Views */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-12">
            <Hero
              setActiveTab={setActiveTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onFilterProduct={handleFilterProductFromHero}
            />

            {/* Home Featured Curricula Quick Highlights */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
              
              {/* Featured Learning Paths */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Featured Outcome Learning Paths
                  </h2>
                  <button 
                    onClick={() => setActiveTab('paths')}
                    className="text-xs text-blue-400 hover:underline font-mono"
                  >
                    View All 10 Paths →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {LEARNING_PATHS.slice(0, 3).map((path) => (
                    <div
                      key={path.id}
                      onClick={() => setActiveTab('paths')}
                      className="p-5 bg-slate-900 border border-slate-800 hover:border-blue-600 rounded-2xl cursor-pointer transition-all space-y-3 group shadow-lg"
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span className="text-blue-400">{path.targetRole}</span>
                        <span>~{path.estimatedHours} hrs</span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                        {path.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {path.headline}
                      </p>
                      <div className="pt-2 flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold">
                        <span>{path.tutorialCount} Lessons</span>
                        <span>Start Path →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Tutorials Carousel Grid */}
              <CatalogView
                searchQuery=""
                setSearchQuery={setSearchQuery}
                progress={progress}
                onSelectTutorial={setSelectedTutorial}
                onToggleBookmark={handleToggleBookmark}
                onToggleCompleted={handleToggleCompleted}
                productFilterOverride="All"
              />

            </div>
          </div>
        )}

        {activeTab === 'paths' && (
          <LearningPathView
            progress={progress}
            onSelectTutorial={setSelectedTutorial}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogView
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            progress={progress}
            onSelectTutorial={setSelectedTutorial}
            onToggleBookmark={handleToggleBookmark}
            onToggleCompleted={handleToggleCompleted}
            productFilterOverride={productFilterOverride}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectHubView
            onSelectTutorial={setSelectedTutorial}
          />
        )}

        {activeTab === 'roles' && (
          <RoleView
            onSelectTutorial={setSelectedTutorial}
            onSelectPath={handleSelectPathFromRole}
          />
        )}

        {activeTab === 'products' && (
          <ProductCatalogView
            onSelectTutorial={setSelectedTutorial}
            onFilterProduct={handleFilterProductFromHero}
          />
        )}

        {activeTab === 'shortcuts' && (
          <ShortcutsView
            onSelectTutorial={setSelectedTutorial}
          />
        )}

        {activeTab === 'activebom' && (
          <ActiveBomSimulatorView
            onSelectTutorial={setSelectedTutorial}
          />
        )}

        {activeTab === 'drc' && (
          <DrcAssistantView
            onSelectTutorial={setSelectedTutorial}
          />
        )}

        {activeTab === 'stackup' && (
          <StackupInspectorView
            onSelectTutorial={setSelectedTutorial}
          />
        )}

        {activeTab === 'impact' && (
          <ImpactDashboardView
            progress={progress}
            onOpenAltiumLink={handleOpenAltiumLink}
          />
        )}

        {activeTab === 'notes' && (
          <NotesHubView
            progress={progress}
            onSelectTutorial={setSelectedTutorial}
            onSaveNote={handleSaveNote}
          />
        )}

        {activeTab === 'glossary' && (
          <GlossaryView />
        )}
      </main>

      {/* Tutorial Detail Modal */}
      {selectedTutorial && (
        <TutorialDetailModal
          tutorial={selectedTutorial}
          onClose={() => setSelectedTutorial(null)}
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

      {/* Knowledge Assessment Quiz Modal */}
      {showQuizModal && (
        <QuizModal
          onClose={() => setShowQuizModal(false)}
        />
      )}

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenAltiumLink={handleOpenAltiumLink}
      />

    </div>
  );
}
