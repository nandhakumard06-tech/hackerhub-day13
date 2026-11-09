import { motion } from 'framer-motion';
import {
  Shield,
  Globe2,
  Users2,
  Award,
  BookOpen,
  ArrowRight,
  Lock,
  FileCheck,
} from 'lucide-react';

interface Props {
  onStartTraining: () => void;
  onGoToQuizzes?: () => void;
}

export function AboutOwaspView({ onStartTraining, onGoToQuizzes }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--osa-border)] bg-gradient-to-br from-[#0c1628] via-[#09101c] to-[#060a12] p-6 sm:p-8 shadow-2xl">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300">
            <Shield className="size-3.5 text-cyan-400" />
            Global Security Standard
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            About <span className="text-gradient">OWASP</span>
          </h1>

          <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">
            The <strong className="text-white font-semibold">Open Worldwide Application Security Project (OWASP)</strong> is an international non-profit foundation dedicated to improving software security through community-driven open source tools, documentation, and education.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onStartTraining}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:opacity-95 hover:shadow-emerald-500/30"
            >
              <span>Explore Top 10 Vulnerabilities</span>
              <ArrowRight className="size-4" />
            </button>
            {onGoToQuizzes && (
              <button
                type="button"
                onClick={onGoToQuizzes}
                className="flex items-center gap-2 rounded-xl border border-purple-500/40 bg-purple-950/40 px-4 py-2.5 text-sm font-bold text-purple-200 transition-all hover:bg-purple-900/50"
              >
                <span>Take Dedicated Quizzes</span>
                <ArrowRight className="size-4" />
              </button>
            )}
            <a
              href="https://owasp.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-[var(--osa-border)] bg-[#0d1627] px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-[var(--osa-hover)] hover:text-white"
            >
              <span>Official OWASP.org</span>
              <Globe2 className="size-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--osa-border)] bg-[#0a101d] p-5 shadow-lg">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Globe2 className="size-5" />
          </div>
          <h3 className="mt-3 font-bold text-white text-base">200+ Chapters</h3>
          <p className="mt-1 text-xs text-[var(--osa-muted)] leading-relaxed">
            Active volunteer-led chapters across 6 continents hosting free educational meetups and conferences.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--osa-border)] bg-[#0a101d] p-5 shadow-lg">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <FileCheck className="size-5" />
          </div>
          <h3 className="mt-3 font-bold text-white text-base">100% Free & Open</h3>
          <p className="mt-1 text-xs text-[var(--osa-muted)] leading-relaxed">
            All standards, frameworks, and training documentation are vendor-neutral and free under open-source licenses.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--osa-border)] bg-[#0a101d] p-5 shadow-lg">
          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Award className="size-5" />
          </div>
          <h3 className="mt-3 font-bold text-white text-base">Industry Benchmark</h3>
          <p className="mt-1 text-xs text-[var(--osa-muted)] leading-relaxed">
            Mandated by PCI-DSS, NIST, FTC guidelines, and ISO 27001 as the core standard for secure development.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--osa-border)] bg-[#0a101d] p-5 shadow-lg">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Users2 className="size-5" />
          </div>
          <h3 className="mt-3 font-bold text-white text-base">50,000+ Members</h3>
          <p className="mt-1 text-xs text-[var(--osa-muted)] leading-relaxed">
            A worldwide community of developers, ethical hackers, security researchers, and CISOs collaborating daily.
          </p>
        </div>
      </div>

      {/* Why Web Security Matters & Methodology Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Why Web Security Matters */}
        <div className="rounded-2xl border border-[var(--osa-border)] bg-gradient-to-b from-[#0d1628] to-[#080d16] p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Lock className="size-4" />
            </div>
            <h2 className="text-lg font-bold text-white">Why Web Security Matters</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Modern business and personal lives exist on the web. A single flaw in an application can result in:
          </p>

          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-3 rounded-xl border border-[var(--osa-border)]/60 bg-[#060a12] p-3 text-xs sm:text-sm text-slate-300">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-950 font-bold text-red-400 border border-red-800">1</span>
              <span><strong>Catastrophic Data Breaches:</strong> Average cost of an enterprise data breach exceeds $4.45M, with lasting brand reputational damage.</span>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-[var(--osa-border)]/60 bg-[#060a12] p-3 text-xs sm:text-sm text-slate-300">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-950 font-bold text-red-400 border border-red-800">2</span>
              <span><strong>User Privacy Violation:</strong> Millions of personal medical, financial, and authentication records exposed to dark web brokers.</span>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-[var(--osa-border)]/60 bg-[#060a12] p-3 text-xs sm:text-sm text-slate-300">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-950 font-bold text-red-400 border border-red-800">3</span>
              <span><strong>Legal & Compliance Penalties:</strong> Stringent fines under GDPR, CCPA, HIPAA, and PCI-DSS for failing to protect consumer data.</span>
            </li>
          </ul>
        </div>

        {/* The OWASP Top 10 Purpose */}
        <div className="rounded-2xl border border-[var(--osa-border)] bg-gradient-to-b from-[#0d1628] to-[#080d16] p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BookOpen className="size-4" />
            </div>
            <h2 className="text-lg font-bold text-white">The OWASP Top 10 Mission</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            First published in 2003, the OWASP Top 10 represents a broad consensus regarding the most critical security risks to web applications:
          </p>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-cyan-900/40 bg-[#060e1c] p-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wide text-cyan-300">
                Data-Driven & Community Consensus
              </h4>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Aggregated from vulnerability data across hundreds of organizations and over 500,000 applications, supplemented by industry-wide surveys.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-900/40 bg-[#041410] p-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wide text-emerald-300">
                Actionable Defense for Developers
              </h4>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Designed to guide software engineers, DevSecOps teams, and architects to build security into software from day one.
              </p>
            </div>

            <div className="rounded-xl border border-purple-900/40 bg-[#12071d] p-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wide text-purple-300">
                Visual Interactive Learning in This Trainer
              </h4>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                This platform strips away heavy code barriers, focusing on clear animated attack workflows, concise theory, and instant-feedback quizzes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
