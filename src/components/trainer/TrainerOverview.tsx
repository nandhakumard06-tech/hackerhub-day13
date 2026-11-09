import {
  Lightbulb,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import type { VulnerabilityItem } from '@/data/trainerData';

interface Props {
  vulnerability: VulnerabilityItem;
}

export function TrainerOverview({ vulnerability }: Props) {
  const { overview } = vulnerability;

  return (
    <div className="space-y-4">
      {/* Concise Concept & Real-World Analogy */}
      <div className="rounded-2xl border border-[var(--osa-border)] bg-gradient-to-b from-[#0e1628] to-[#080d16] p-5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-400">
            <Lightbulb className="size-3.5" />
            Vulnerability Breakdown
          </span>
          <span className="text-xs text-[var(--osa-muted)]">
            Beginner-Friendly Theory
          </span>
        </div>

        \

        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {overview.simpleExplanation}
        </p>

        {/* Real-World Analogy Box */}
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 to-[#0e1522] p-3.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Lightbulb className="size-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Real-World Analogy
            </span>
            <p className="mt-1 text-xs sm:text-sm text-slate-200 leading-relaxed">
              {overview.analogy}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Core Impact vs Quick Mitigation Strategy */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Core Impact Card */}
        <div className="flex flex-col rounded-2xl border border-red-900/40 bg-gradient-to-b from-[#160a0f] to-[#080d16] p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-red-900/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-red-950 text-red-400 border border-red-800/50">
                <Flame className="size-4" />
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base">
                Core Impact & Threats
              </h4>
            </div>
            <span className="rounded-full border border-red-600/40 bg-red-950/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
              Severity: {vulnerability.severity}
            </span>
          </div>

          <div className="mt-4 flex-1 space-y-3">
            {overview.coreImpacts.map((impact, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-xl border border-red-950/60 bg-[#12060b]/80 p-3 transition-colors hover:border-red-900/40"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-400" />
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {impact}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-red-950/20 px-3 py-2 text-[11px] font-mono text-red-300 border border-red-900/20">
            Mapped CWE: {vulnerability.cwe}
          </div>
        </div>

        {/* Quick Mitigation Strategy Card */}
        <div className="flex flex-col rounded-2xl border border-emerald-900/40 bg-gradient-to-b from-[#071714] to-[#080d16] p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-emerald-900/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                <ShieldCheck className="size-4" />
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base">
                Quick Mitigation Strategy
              </h4>
            </div>
            <span className="rounded-full border border-emerald-600/40 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Defensive Rules
            </span>
          </div>

          <div className="mt-4 flex-1 space-y-3">
            {overview.quickMitigations.map((mitigation, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-xl border border-emerald-950/60 bg-[#04130f]/80 p-3 transition-colors hover:border-emerald-900/40"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {mitigation}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-emerald-950/20 px-3 py-2 text-[11px] font-mono text-emerald-300 border border-emerald-900/20">
            Standard: OWASP Secure Coding Practices
          </div>
        </div>
      </div>
    </div>
  );
}
