import {
  GraduationCap,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import type { VisualVulnerability } from '@/data/visualLabData';

interface Props {
  vulnerabilities: VisualVulnerability[];
  selectedId: string;
  onSelect: (id: string) => void;
  onSelectQuiz?: () => void;
  completedIds: string[];
}

export function VisualLabSidebar({
  vulnerabilities,
  selectedId,
  onSelect,
  onSelectQuiz,
  completedIds,
}: Props) {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = vulnerabilities.filter(
    (v) =>
      v.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      v.code.toLowerCase().includes(filterQuery.toLowerCase()) ||
      v.subtext.toLowerCase().includes(filterQuery.toLowerCase()),
  );

  return (
    <aside className="flex h-[calc(100vh-3.5rem)] w-72 shrink-0 flex-col border-r border-[var(--osa-border)]/80 bg-[#070b14] select-none">
      {/* Quick search input */}
      <div className="border-b border-[var(--osa-border)]/50 p-2.5">
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3 size-3.5 text-slate-500" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter modules..."
            className="w-full rounded-xl border border-slate-800 bg-[#0c1222] py-1.5 pr-3 pl-8 text-xs text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Foundations Section (Matching screenshot items 7, 8, 9) */}
        <div>
          <div className="px-2.5 pb-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Foundations & Methods
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onSelect('about')}
              className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all ${selectedId === 'about'
                ? 'border border-purple-500/70 bg-[#141229] text-white shadow-sm'
                : 'text-slate-300 hover:bg-[#0d1424] hover:text-white border border-transparent'
                }`}
            >
              <span className="mt-0.5 text-[11px] font-mono font-bold text-slate-500">
                01
              </span>
              <div className="flex-1 overflow-hidden">
                <span className="block text-xs font-semibold truncate text-slate-200">
                  About OWASP & Architecture
                </span>
                <span className="block text-[10px] text-slate-500 truncate">
                  Foundations · Mission & core pillars
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelect('basics')}
              className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all ${selectedId === 'basics'
                ? 'border border-purple-500/70 bg-[#141229] text-white shadow-sm'
                : 'text-slate-300 hover:bg-[#0d1424] hover:text-white border border-transparent'
                }`}
            >
              <span className="mt-0.5 text-[11px] font-mono font-bold text-slate-500">
                02
              </span>
              <div className="flex-1 overflow-hidden">
                <span className="block text-xs font-semibold truncate text-slate-200">
                  Security Basics & CIA Triad
                </span>
                <span className="block text-[10px] text-slate-500 truncate">
                  Intermediate · Defense-in-depth layers
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* OWASP Top 10 Section (Items 10 through 19) */}
        <div>
          <div className="px-2.5 pb-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            OWASP Top 10
          </div>

          <div className="space-y-1">
            {filtered.map((vuln) => {
              const isSelected = selectedId === vuln.id;
              const isCompleted = completedIds.includes(vuln.id);

              return (
                <button
                  key={vuln.id}
                  type="button"
                  onClick={() => onSelect(vuln.id)}
                  className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all ${isSelected
                    ? 'border border-purple-500/80 bg-[#141229] text-white shadow-md shadow-purple-950/40'
                    : 'text-slate-300 hover:bg-[#0d1424] hover:text-white border border-transparent'
                    }`}
                >
                  {/* Number Badge (1, 2, 3...) */}
                  <span
                    className={`mt-0.5 text-[11px] font-mono font-bold ${isSelected ? 'text-purple-400' : 'text-slate-500'
                      }`}
                  >
                    {vuln.number}
                  </span>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold truncate ${isSelected ? 'text-white font-bold' : 'text-slate-200'
                          }`}
                      >
                        {vuln.code} {vuln.title}
                      </span>
                      {isCompleted && (
                        <span className="size-1.5 rounded-full bg-emerald-400" />
                      )}
                    </div>
                    <span className="block text-[10px] text-slate-500 truncate">
                      {vuln.level} · {vuln.subtext}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dedicated Quizzes Section */}
        {onSelectQuiz && (
          <div>
            <div className="px-2.5 pb-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Knowledge Verification
            </div>

            <button
              type="button"
              onClick={onSelectQuiz}
              className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all ${selectedId === 'quizzes'
                ? 'border border-purple-500/80 bg-[#141229] text-white shadow-md shadow-purple-950/40'
                : 'text-slate-300 hover:bg-[#0d1424] hover:text-white border border-transparent'
                }`}
            >
              <div className="flex size-7 items-center justify-center rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/40">
                <GraduationCap className="size-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <span className="block text-xs font-semibold truncate text-slate-200">
                  Top 10 Quizzes
                </span>
                <span className="block text-[10px] text-slate-500 truncate">
                  Interactive knowledge checks
                </span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="shrink-0 border-t border-[var(--osa-border)]/50 p-2.5 text-center text-[10px] text-slate-500 font-mono">
        OWASP Visual Lab • 2025 Release
      </div>
    </aside>
  );
}
