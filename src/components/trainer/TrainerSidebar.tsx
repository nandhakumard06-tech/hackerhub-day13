import { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  LockOpen,
  KeyRound,
  Terminal,
  DraftingCompass,
  Sliders,
  PackageX,
  UserX,
  FileWarning,
  Activity,
  Radio,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  GraduationCap,
} from 'lucide-react';
import type { VulnerabilityItem } from '@/data/trainerData';

interface Props {
  selectedId: string; // 'about' | 'quizzes' | 'A01'...'A10'
  onSelect: (id: string) => void;
  vulnerabilities: VulnerabilityItem[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
}

const VULN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  A01: LockOpen,
  A02: KeyRound,
  A03: Terminal,
  A04: DraftingCompass,
  A05: Sliders,
  A06: PackageX,
  A07: UserX,
  A08: FileWarning,
  A09: Activity,
  A10: Radio,
};

export function TrainerSidebar({
  selectedId,
  onSelect,
  vulnerabilities,
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter vulnerabilities based on search
  const filteredVulnerabilities = vulnerabilities.filter(
    (v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tagline.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleItemClick = (id: string) => {
    onSelect(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`relative flex flex-col border-r border-[var(--osa-border)] bg-[#070c16]/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-72 lg:w-80'
      } h-screen select-none`}
    >
      {/* Sidebar Header: App Title ("OWASP Top 10 Trainer") */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--osa-border)] px-4">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-md shadow-emerald-500/20">
              <Shield className="size-5 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-white whitespace-nowrap">
                OWASP Top 10 Trainer
              </span>
              <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase">
                Interactive Edition
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-md shadow-emerald-500/20">
            <Shield className="size-5 text-slate-950" />
          </div>
        )}

        {/* Desktop Collapse Toggle Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className={`hidden items-center justify-center rounded-lg border border-[var(--osa-border)] bg-[#0d1626] p-1.5 text-slate-400 transition-colors hover:bg-[var(--osa-hover)] hover:text-white lg:flex ${
            isCollapsed ? 'mx-auto mt-1' : ''
          }`}
        >
          {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex rounded-lg border border-[var(--osa-border)] p-1.5 text-slate-400 hover:text-white lg:hidden"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Quick Search (Visible when expanded) */}
      {!isCollapsed && (
        <div className="border-b border-[var(--osa-border)]/60 p-3">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 size-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vulnerabilities..."
              className="w-full rounded-xl border border-[var(--osa-border)] bg-[#0b1220] py-1.5 pr-3 pl-8 text-xs text-white placeholder-slate-400 transition-colors focus:border-cyan-500/50 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-white"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5">
        {/* SECTION 1: About OWASP */}
        <div>
          {!isCollapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--osa-muted)]">
              Section 1: About OWASP
            </div>
          )}

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleItemClick('about')}
              title="About OWASP"
              className={`group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-xs font-medium transition-all ${
                selectedId === 'about'
                  ? 'border border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 to-[#0e1b2f] text-cyan-200 shadow-md shadow-cyan-950'
                  : 'text-slate-300 hover:bg-[#0e1627] hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                  selectedId === 'about'
                    ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-300'
                    : 'border-slate-800 bg-[#0c1424] text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Shield className="size-4" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-slate-100">About OWASP</span>
                  <span className="text-[10px] text-[var(--osa-muted)]">Foundation & Mission</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* SECTION 2: OWASP Top 10 Vulnerabilities */}
        <div>
          {!isCollapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--osa-muted)]">
              Section 2: OWASP Top 10 Vulnerabilities
            </div>
          )}

          <div className="space-y-1">
            {filteredVulnerabilities.map((vuln) => {
              const isSelected = selectedId === vuln.id;
              const IconComponent = VULN_ICONS[vuln.id] || ShieldAlert;

              return (
                <button
                  key={vuln.id}
                  type="button"
                  onClick={() => handleItemClick(vuln.id)}
                  title={`${vuln.code}: ${vuln.title}`}
                  className={`group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-xs font-medium transition-all ${
                    isSelected
                      ? 'border border-red-500/40 bg-gradient-to-r from-[#220a10] to-[#120509] text-red-200 shadow-md shadow-red-950'
                      : 'text-slate-300 hover:bg-[#0e1627] hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <div
                    className={`relative flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-red-500/50 bg-red-500/20 text-red-400'
                        : 'border-slate-800 bg-[#0c1424] text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <IconComponent className="size-4" />
                  </div>

                  {!isCollapsed && (
                    <div className="flex flex-1 flex-col text-left overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-100 truncate">
                          {vuln.code}: {vuln.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--osa-muted)] truncate">
                        {vuln.category}
                      </span>
                    </div>
                  )}

                  {!isCollapsed && isSelected && (
                    <span className="size-1.5 rounded-full bg-red-400 shadow-sm shadow-red-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: Quizzes (Dedicated Sidebar Option) */}
        <div>
          {!isCollapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--osa-muted)]">
              Section 3: Dedicated Quizzes
            </div>
          )}

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleItemClick('quizzes')}
              title="Quizzes"
              className={`group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-xs font-medium transition-all ${
                selectedId === 'quizzes'
                  ? 'border border-purple-500/40 bg-gradient-to-r from-purple-950/60 to-[#190d2e] text-purple-200 shadow-md shadow-purple-950'
                  : 'text-slate-300 hover:bg-[#0e1627] hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                  selectedId === 'quizzes'
                    ? 'border-purple-500/50 bg-purple-500/20 text-purple-300'
                    : 'border-slate-800 bg-[#0c1424] text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <GraduationCap className="size-4" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-slate-100">Quizzes</span>
                  <span className="text-[10px] text-[var(--osa-muted)]">Categorized A01–A10</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="shrink-0 border-t border-[var(--osa-border)] p-3 bg-[#060a12]">
          <div className="flex items-center justify-between text-[11px] text-[var(--osa-muted)]">
            <span>OWASP Top 10</span>
            <span className="font-mono text-cyan-400">Trainer v2.0</span>
          </div>
        </div>
      )}
    </aside>
  );
}
