import { useState } from 'react';
import { VISUAL_VULNERABILITIES } from '@/data/visualLabData';
import { VisualLabTopNav } from './VisualLabTopNav';
import { VisualLabSidebar } from './VisualLabSidebar';
import { VisualLabDiagram } from './VisualLabDiagram';
import { VisualLabControls } from './VisualLabControls';
import { VisualLabRightPane } from './VisualLabRightPane';
import { DedicatedQuizSection } from './DedicatedQuizSection';
import { AboutOwaspView } from './AboutOwaspView';
import { SecurityBasicsView } from './SecurityBasicsView';

export function VisualLabApp() {
  // Active selected vulnerability ID (default 'A03' matching the user's screenshot!)
  const [selectedId, setSelectedId] = useState<string>('A03');

  // Active difficulty mode ('Beginner' or 'Advanced')
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Advanced'>('Beginner');

  // Animation controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(0.5); // Default 0.5x matching screenshot
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Completed items list
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<string>('top-10');

  // Find current vulnerability
  const currentVuln =
    VISUAL_VULNERABILITIES.find((v) => v.id === selectedId) ||
    VISUAL_VULNERABILITIES[2]; // Default A03

  // Active selected node for right inspector pane (defaults to actor node of current vulnerability)
  const [selectedNode, setSelectedNode] = useState(currentVuln.nodes.actor);

  // When vulnerability changes, update selected node to the new actor node
  const handleSelectVulnerability = (id: string) => {
    setSelectedId(id);
    if (id === 'about' || id === 'basics' || id === 'quizzes') {
      return;
    }
    const next = VISUAL_VULNERABILITIES.find((v) => v.id === id);
    if (next) {
      setSelectedNode(next.nodes.actor);
    }
  };


  const completionPercent = Math.round(
    (completedIds.length / VISUAL_VULNERABILITIES.length) * 100,
  );

  return (
    <div
      className={`min-h-screen bg-[#060a12] text-slate-100 font-sans antialiased flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''
        }`}
    >
      {/* 1. Top Navbar (Matches exact screenshot) */}
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
        onOpenQuiz={() => setSelectedId('quizzes')}
      />

      {/* 2. Main 3-Pane Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (Matches exact numbered items 07-19) */}
        <VisualLabSidebar
          vulnerabilities={VISUAL_VULNERABILITIES}
          selectedId={selectedId}
          onSelect={handleSelectVulnerability}
          onSelectQuiz={() => setSelectedId('quizzes')}
          completedIds={completedIds}
        />

        {/* Center Main Stage */}
        <main className="flex flex-1 flex-col overflow-y-auto px-5 py-4 bg-[#050812]">
          {/* View: About OWASP */}
          {selectedId === 'about' && (
            <AboutOwaspView
              onStartTraining={() => handleSelectVulnerability('A01')}
              onGoToQuizzes={() => setSelectedId('quizzes')}
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

          {/* View: Visual Lab Diagram for Vulnerability (Matches exact center canvas in screenshot) */}
          {selectedId !== 'about' && selectedId !== 'basics' && selectedId !== 'quizzes' && (
            <div className="flex flex-1 flex-col justify-between">
              {/* Header above canvas */}
              <div className="mb-3">
                <span className="font-mono text-[11px] font-bold text-slate-400 tracking-wider">
                  {currentVuln.topTag}
                </span>
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

              {/* Bottom Playback & Speed Controls */}
              <VisualLabControls
                vulnerability={currentVuln}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying((p) => !p)}
                speed={speed}
                onSelectSpeed={setSpeed}
                isCompleted={completedIds.includes(currentVuln.id)}
                onToggleComplete={() =>
                  setCompletedIds((prev) =>
                    prev.includes(currentVuln.id)
                      ? prev.filter((id) => id !== currentVuln.id)
                      : [...prev, currentVuln.id],
                  )
                }
                onNext={() => {
                  const idx = VISUAL_VULNERABILITIES.findIndex((v) => v.id === currentVuln.id);
                  if (idx >= 0 && idx < VISUAL_VULNERABILITIES.length - 1) {
                    handleSelectVulnerability(VISUAL_VULNERABILITIES[idx + 1].id);
                  }
                }}
                onPresent={() => setIsFullscreen((f) => !f)}
              />
            </div>
          )}
        </main>

        {/* Right Inspector Pane */}
        {selectedId !== 'about' && selectedId !== 'basics' && selectedId !== 'quizzes' && (
          <VisualLabRightPane
            selectedNode={selectedNode}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen((f) => !f)}
            onOpenQuiz={() => setSelectedId('quizzes')}
          />
        )}
      </div>
    </div>
  );
}
