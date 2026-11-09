import { useState } from 'react';
import {
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
  GraduationCap,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  difficulty?: 'Beginner' | 'Advanced';
  onToggleDifficulty?: () => void;
  completionPercent?: number;
  onOpenQuiz?: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function VisualLabTopNav({
  currentTab,
  onSelectTab,
  onOpenQuiz,
  isSidebarOpen,
  onToggleSidebar,
}: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'foundations', label: 'Foundations' },
    { id: 'top-10', label: 'OWASP Top 10' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'juice-shop', label: 'Juice Shop' },
    { id: 'testing-tools', label: 'Testing Tools' },
    { id: 'threat-model', label: 'Threat Model' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'report-lab', label: 'Report Lab' },
    { id: 'safety', label: 'Safety' },
  ];

  // Quick primary tabs for mobile and tablet
  const primaryMobileTabs = [
    { id: 'top-10', label: 'Top 10' },
    { id: 'foundations', label: 'Foundations' },
    { id: 'home', label: 'About' },
    { id: 'quizzes', label: 'Quizzes' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'quizzes' && onOpenQuiz) {
      onOpenQuiz();
    } else {
      onSelectTab(id);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex flex-col border-b border-[var(--osa-border)]/80 bg-[#070b14]/95 backdrop-blur-md">
      {/* Main Top Bar */}
      <div className="flex h-14 w-full items-center justify-between gap-2 px-3 sm:px-4">
        {/* Left Section: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Left Sidebar Toggle Button */}
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-[#0d1424] text-slate-300 transition-all hover:border-purple-500/50 hover:bg-purple-950/40 hover:text-white active:scale-95 shadow-sm"
              aria-label={isSidebarOpen ? 'Close left modules sidebar' : 'Open left modules sidebar'}
              title={isSidebarOpen ? 'Close modules sidebar' : 'Open modules sidebar'}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="size-4 text-purple-400" />
              ) : (
                <PanelLeftOpen className="size-4 text-slate-300" />
              )}
            </button>
          )}

          {/* Logo & Platform Name */}
          <button
            type="button"
            onClick={() => handleNavClick('top-10')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 shadow-md shadow-purple-600/30 ring-1 ring-purple-400/40">
              <Shield className="size-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-white whitespace-nowrap">
                OWASP TOP 10
              </span>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase hidden sm:block">
                VISUAL LAB • 2025
              </span>
            </div>
          </button>
        </div>

        {/* Center Desktop Nav Links (xl screens and larger) */}
        <nav className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-950/60 text-purple-300 font-semibold border border-purple-800/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f172a]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Mobile Quick Tabs, Quiz Shortcut & Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Quiz CTA button */}
          {onOpenQuiz && (
            <button
              type="button"
              onClick={onOpenQuiz}
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-950/30 px-2.5 py-1.5 text-xs font-semibold text-purple-300 transition-all hover:bg-purple-900/40 hover:text-white"
              title="Open Knowledge Quizzes"
            >
              <GraduationCap className="size-3.5 text-purple-400" />
              <span className="hidden sm:inline">Quizzes</span>
            </button>
          )}

          {/* Switch to Full Academy Platform Link */}
          <Link
            to="/academy"
            className="hidden md:flex items-center gap-1 rounded-xl border border-slate-800 bg-[#0d1424] px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Switch to OWASP Academy Platform"
          >
            <span>Academy</span>
            <ExternalLink className="size-3 text-slate-400" />
          </Link>

          {/* Mobile Menu Dropdown Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex size-9 items-center justify-center rounded-xl border border-slate-800 bg-[#0d1424] text-slate-300 transition-all hover:bg-slate-800 hover:text-white xl:hidden"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Pill Navigation Bar (visible on < xl screens) */}
      <div className="flex xl:hidden items-center gap-1.5 overflow-x-auto border-t border-[var(--osa-border)]/40 px-3 py-1.5 scrollbar-none bg-[#050811]/90">
        {primaryMobileTabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleNavClick(tab.id)}
              className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-purple-900/50 text-purple-200 border border-purple-500/50 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1324] border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="shrink-0 flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-[#0c1324]"
        >
          <span>More</span>
          <ChevronDown className="size-3" />
        </button>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[var(--osa-border)]/70 bg-[#090f1d] px-4 py-3 shadow-2xl xl:hidden animate-in slide-in-from-top-2 duration-150">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pb-2">
            Navigation Destinations
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                    isActive
                      ? 'bg-purple-950/70 text-purple-300 font-bold border border-purple-700/50'
                      : 'text-slate-300 hover:bg-[#0e172e] hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Security Academy:</span>
            <Link
              to="/academy"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1 font-semibold text-purple-400 hover:text-purple-300"
            >
              <span>Full Academy Platform</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
