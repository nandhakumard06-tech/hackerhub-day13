import { Shield } from 'lucide-react';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  difficulty?: 'Beginner' | 'Advanced';
  onToggleDifficulty?: () => void;
  completionPercent?: number;
  onOpenQuiz?: () => void;
}

export function VisualLabTopNav({
  currentTab,
  onSelectTab,
  onOpenQuiz,
}: Props) {
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

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full shrink-0 items-center justify-start gap-6 border-b border-[var(--osa-border)]/80 bg-[#070b14]/95 px-4 backdrop-blur-md">
      {/* Left Brand / Logo */}
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 shadow-md shadow-purple-600/30 ring-1 ring-purple-400/40">
          <Shield className="size-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black tracking-wider text-white whitespace-nowrap">
            OWASP TOP 10
          </span>
          <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
            VISUAL LAB • 2025
          </span>
        </div>
      </div>

      {/* Center Nav Links */}
      <nav className="hidden items-center gap-1 xl:flex">
        {navLinks.map((link) => {
          const isActive = currentTab === link.id;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => {
                if (link.id === 'quizzes' && onOpenQuiz) {
                  onOpenQuiz();
                } else {
                  onSelectTab(link.id);
                }
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-purple-950/60 text-purple-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
