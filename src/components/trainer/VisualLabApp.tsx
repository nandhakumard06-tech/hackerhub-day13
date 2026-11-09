import { useState, useEffect } from 'react';
import { PanelLeftOpen } from 'lucide-react';
import { VISUAL_VULNERABILITIES } from '@/data/visualLabData';
import { VisualLabTopNav } from './VisualLabTopNav';
import { VisualLabSidebar } from './VisualLabSidebar';
import { VisualLabDiagram } from './VisualLabDiagram';
import { VisualLabRightPane } from './VisualLabRightPane';
import { VisualLabControls } from './VisualLabControls';
import { DedicatedQuizSection } from './DedicatedQuizSection';
import { AboutOwaspView } from './AboutOwaspView';
import { SecurityBasicsView } from './SecurityBasicsView';

export function VisualLabApp() {
  // Active selected vulnerability ID (default 'A03')
  const [selectedId, setSelectedId] = useState<string>('A03');

  // Active difficulty mode ('Beginner' or 'Advanced')
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Advanced'>('Beginner');

  // Animation controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(0.5); // Default 0.5x
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Completed items list
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<string>('top-10');

  // Left sidebar open/close state
  // On desktop (>=1024px) defaults to open, on mobile (<1024px) defaults to closed
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Keep sidebar responsive if window resizes across breakpoint
  useEffect(() => {
    const handleResize = () => {
      // If expanding to desktop, keep open by default
      if (window.innerWidth >= 1024 && !isSidebarOpen) {
        // user may have manually collapsed it, so we don't force, but we ensure layout is clean
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Find current vulnerability
  const currentVuln =
    VISUAL_VULNERABILITIES.find((v) => v.id === selectedId) ||
    VISUAL_VULNERABILITIES[2]; // Default A03

  // Active selected node for right inspector pane (defaults to actor node of current vulnerability)
  const [selectedNode, setSelectedNode] = useState(currentVuln.nodes.actor);

  // When vulnerability changes, update selected node to the new actor node
  const handleSelectVulnerability = (id: string) => {
    setSelectedId(id);

    // On mobile / tablet screens, automatically close the sidebar drawer after selecting
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

    if (id === 'about') {
      setCurrentTab('home');
      return;
    }
    if (id === 'basics') {
      setCurrentTab('foundations');
      return;
    }
    if (id === 'quizzes') {
      setCurrentTab('quizzes');
      return;
    }

    setCurrentTab('top-10');
    const next = VISUAL_VULNERABILITIES.find((v) => v.id === id);
    if (next) {
      setSelectedNode(next.nodes.actor);
    }
  };

  const handleToggleComplete = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleNextVulnerability = () => {
    if (currentVuln.nextId) {
      handleSelectVulnerability(currentVuln.nextId);
    }
  };

  const completionPercent = Math.round(
    (completedIds.length / VISUAL_VULNERABILITIES.length) * 100,
  );

  return (
    <div
      className={`min-h-screen bg-[#060a12] text-slate-100 font-sans antialiased flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''
      }`}
    >
      {/* 1. Top Navbar with open/close sidebar toggle button and mobile navigation */}
      <VisualLabTopNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'home') setSelectedId('about');
          else if (tab === 'foundations') setSelectedId('basics');
          else if (tab === 'quizzes') setSelectedId('quizzes');
          else if (tab === 'top-10') setSelectedId('A03');
        }}
        difficulty={difficulty}
        onToggleDifficulty={() =>
          setDifficulty((d) => (d === 'Beginner' ? 'Advanced' : 'Beginner'))
        }
        completionPercent={completionPercent}
        onOpenQuiz={() => {
          setSelectedId('quizzes');
          setCurrentTab('quizzes');
        }}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* 2. Main 3-Pane Workspace */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Mobile Backdrop Overlay (closes sidebar when tapped outside) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs transition-opacity lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Left Sidebar Drawer on Mobile / Docked Panel on Desktop */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:static lg:z-auto ${
            isSidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:hidden'
          }`}
        >
          <VisualLabSidebar
            vulnerabilities={VISUAL_VULNERABILITIES}
            selectedId={selectedId}
            onSelect={handleSelectVulnerability}
            onSelectQuiz={() => handleSelectVulnerability('quizzes')}
            completedIds={completedIds}
            onClose={() => setIsSidebarOpen(false)}
            className="h-full shadow-2xl lg:shadow-none"
          />
        </div>

        {/* Desktop Quick Re-open button if sidebar is collapsed */}
        {!isSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="hidden lg:flex fixed left-3 bottom-5 z-30 items-center gap-1.5 rounded-xl border border-purple-500/30 bg-[#0c1322]/90 px-3 py-2 text-xs font-semibold text-purple-300 shadow-xl backdrop-blur-md hover:bg-purple-950/50 hover:text-white transition-all"
            title="Expand left modules sidebar"
          >
            <PanelLeftOpen className="size-4 text-purple-400" />
            <span>Modules Menu</span>
          </button>
        )}

        {/* Center Main Stage */}
        <main className="flex flex-1 flex-col overflow-y-auto px-3 sm:px-5 py-3 sm:py-4 bg-[#050812]">
          {/* View: About OWASP */}
          {selectedId === 'about' && (
            <AboutOwaspView
              onStartTraining={() => handleSelectVulnerability('A01')}
              onGoToQuizzes={() => handleSelectVulnerability('quizzes')}
            />
          )}

          {/* View: Security Basics */}
          {selectedId === 'basics' && (
            <SecurityBasicsView
              onStartVulnerabilities={() => handleSelectVulnerability('A01')}
            />
          )}

          {/* View: Dedicated Quizzes */}
          {selectedId === 'quizzes' && <DedicatedQuizSection />}

          {/* View: Visual Lab Diagram for Vulnerability */}
          {selectedId !== 'about' && selectedId !== 'basics' && selectedId !== 'quizzes' && (
            <div className="flex flex-1 flex-col justify-between space-y-4">
              {/* Header above canvas */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-slate-400 tracking-wider">
                    {currentVuln.topTag}
                  </span>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded-full">
                    {currentVuln.level}
                  </span>
                </div>
                <h2 className="mt-1 text-lg sm:text-xl font-extrabold text-white">
                  {currentVuln.code}: {currentVuln.title}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
                  {currentVuln.description}
                </p>
              </div>

              {/* 5-Node Interactive Circuit Canvas */}
              <VisualLabDiagram
                vulnerability={currentVuln}
                selectedNode={selectedNode}
                onSelectNode={setSelectedNode}
                isPlaying={isPlaying}
                speed={speed}
              />

              {/* Simulation Playback & Navigation Controls */}
              <VisualLabControls
                vulnerability={currentVuln}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying((p) => !p)}
                speed={speed}
                onSelectSpeed={setSpeed}
                isCompleted={completedIds.includes(currentVuln.id)}
                onToggleComplete={() => handleToggleComplete(currentVuln.id)}
                onNext={handleNextVulnerability}
                onPresent={() => setIsFullscreen((f) => !f)}
              />

              {/* Mobile / Tablet Inline Inspector (shown directly below diagram on < xl screens) */}
              <div className="xl:hidden">
                <VisualLabRightPane
                  selectedNode={selectedNode}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={() => setIsFullscreen((f) => !f)}
                  onOpenQuiz={() => handleSelectVulnerability('quizzes')}
                  isInline={true}
                  nodes={currentVuln.nodes}
                  onSelectNode={setSelectedNode}
                />
              </div>
            </div>
          )}
        </main>

        {/* Right Inspector Pane (Desktop xl+ screens) */}
        {selectedId !== 'about' && selectedId !== 'basics' && selectedId !== 'quizzes' && (
          <div className="hidden xl:flex">
            <VisualLabRightPane
              selectedNode={selectedNode}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen((f) => !f)}
              onOpenQuiz={() => handleSelectVulnerability('quizzes')}
              nodes={currentVuln.nodes}
              onSelectNode={setSelectedNode}
            />
          </div>
        )}
      </div>
    </div>
  );
}
