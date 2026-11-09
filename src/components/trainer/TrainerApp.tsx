import { useState, useEffect } from 'react';
import {
  Menu,
  ExternalLink,
} from 'lucide-react';
import { OWASP_VULNERABILITIES } from '@/data/trainerData';
import { TrainerSidebar } from './TrainerSidebar';
import { AboutOwaspView } from './AboutOwaspView';
import { VulnerabilityView } from './VulnerabilityView';
import { DedicatedQuizSection } from './DedicatedQuizSection';

export function TrainerApp() {
  // Navigation state: 'about' | 'quizzes' | 'A01'...'A10'
  const [selectedId, setSelectedId] = useState<string>('about');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Read initial route or hash if provided
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      if (hash === 'about' || hash === 'quizzes') {
        setSelectedId(hash);
      } else {
        const found = OWASP_VULNERABILITIES.find(
          (v) => v.id.toLowerCase() === hash.toLowerCase() || v.slug === hash,
        );
        if (found) {
          setSelectedId(found.id);
        }
      }
    }
  }, []);

  // Update hash on selection
  const handleSelect = (id: string) => {
    setSelectedId(id);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentVulnerability = OWASP_VULNERABILITIES.find((v) => v.id === selectedId);

  return (
    <div className="flex min-h-screen bg-[#060a12] text-slate-100 font-sans antialiased">
      {/* Mobile Backdrop Overlay */}
      {isMobileDrawerOpen && (
        <div
          onClick={() => setIsMobileDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Left Collapsible Sidebar (Desktop: sticky, Mobile: fixed drawer) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <TrainerSidebar
          selectedId={selectedId}
          onSelect={handleSelect}
          vulnerabilities={OWASP_VULNERABILITIES}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onCloseMobile={() => setIsMobileDrawerOpen(false)}
        />
      </div>

      {/* Main Interactive Dashboard (Right Content Area) */}
      <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[var(--osa-border)] bg-[#070c16]/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="flex size-9 items-center justify-center rounded-xl border border-[var(--osa-border)] bg-[#0d1526] text-slate-300 hover:text-white lg:hidden"
              aria-label="Open sidebar menu"
            >
              <Menu className="size-5" />
            </button>

            {/* Breadcrumb Display */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-[var(--osa-muted)]">Trainer</span>
              <span className="text-slate-600">/</span>
              {selectedId === 'about' ? (
                <span className="font-semibold text-cyan-400">Section 1: About OWASP</span>
              ) : selectedId === 'quizzes' ? (
                <span className="font-semibold text-purple-400">Section 3: Dedicated Quizzes</span>
              ) : (
                <div className="flex items-center gap-1.5 font-semibold text-slate-100">
                  <span className="text-red-400 font-mono">{currentVulnerability?.code}:</span>
                  <span className="truncate max-w-[200px] sm:max-w-none">
                    {currentVulnerability?.title}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-2.5">
            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-400 sm:flex">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OWASP Top 10 Active</span>
            </div>

            <a
              href="https://owasp.org/Top10/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-xl border border-[var(--osa-border)] bg-[#0d1627] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-[var(--osa-hover)] hover:text-white"
            >
              <span className="hidden sm:inline">Official Docs</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 max-w-7xl mx-auto w-full">
          {/* Section 1: About OWASP */}
          {selectedId === 'about' && (
            <AboutOwaspView
              onStartTraining={() => handleSelect('A01')}
              onGoToQuizzes={() => handleSelect('quizzes')}
            />
          )}

          {/* Section 3: Dedicated Quizzes */}
          {selectedId === 'quizzes' && <DedicatedQuizSection />}

          {/* Section 2: Vulnerability View (Title + Automated Continuous SVG Diagram ONLY) */}
          {currentVulnerability && (
            <VulnerabilityView
              vulnerability={currentVulnerability}
              onSelectVulnerability={handleSelect}
              allVulnerabilities={OWASP_VULNERABILITIES}
            />
          )}
        </main>
      </div>
    </div>
  );
}
