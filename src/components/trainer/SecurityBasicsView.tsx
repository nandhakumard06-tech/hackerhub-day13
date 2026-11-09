import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Layers,
  FileCheck2,
  Activity,
  CheckCircle2,
  ArrowRight,
  Eye,
} from 'lucide-react';

interface Props {
  onStartVulnerabilities: () => void;
}

export function SecurityBasicsView({ onStartVulnerabilities }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--osa-border)] bg-gradient-to-br from-[#0c1628] via-[#09101c] to-[#060a12] p-6 sm:p-8 shadow-2xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Layers className="size-3.5 text-emerald-400" />
            Foundational Concepts
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Web Security <span className="text-gradient">Basics</span>
          </h1>

          <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">
            Before diving into individual vulnerabilities, understand the core principles, threat models, and architectural layers that protect modern web applications.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={onStartVulnerabilities}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:opacity-95"
            >
              <span>Start Vulnerability Modules</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* The CIA Triad Section */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <ShieldAlert className="size-3.5" />
          </div>
          <h2 className="text-lg font-bold text-white">The CIA Triad</h2>
          <span className="text-xs text-[var(--osa-muted)]">— The Three Pillars of Information Security</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Confidentiality */}
          <div className="rounded-2xl border border-cyan-900/40 bg-gradient-to-b from-[#091629] to-[#060a12] p-5 shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Eye className="size-4" />
              </div>
              <h3 className="font-bold text-white text-base">Confidentiality</h3>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ensuring sensitive data is accessible ONLY to authorized entities. Protects against snooping, theft, and unauthorized exposure.
            </p>
            <div className="mt-4 rounded-xl border border-cyan-950 bg-[#040c17] p-3 text-xs text-cyan-300 font-mono">
              Defenses: TLS 1.3, AES-256, Scoped Access Control, Least Privilege
            </div>
          </div>

          {/* Integrity */}
          <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-b from-[#071915] to-[#060a12] p-5 shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <FileCheck2 className="size-4" />
              </div>
              <h3 className="font-bold text-white text-base">Integrity</h3>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Guarding against unauthorized modification or deletion of information. Guarantees that data received is identical to data sent.
            </p>
            <div className="mt-4 rounded-xl border border-emerald-950 bg-[#030f0c] p-3 text-xs text-emerald-300 font-mono">
              Defenses: Digital Signatures, Parameterized Queries, Checksums
            </div>
          </div>

          {/* Availability */}
          <div className="rounded-2xl border border-purple-900/40 bg-gradient-to-b from-[#140b24] to-[#060a12] p-5 shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Activity className="size-4" />
              </div>
              <h3 className="font-bold text-white text-base">Availability</h3>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ensuring systems and services remain operational, responsive, and resilient when legitimate users need them.
            </p>
            <div className="mt-4 rounded-xl border border-purple-950 bg-[#090514] p-3 text-xs text-purple-300 font-mono">
              Defenses: Rate Limiting, DDoS Protection, Redundancy, Circuit Breakers
            </div>
          </div>
        </div>
      </div>

      {/* Defense-in-Depth Model & Golden Rules */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Defense-in-Depth */}
        <div className="rounded-2xl border border-[var(--osa-border)] bg-gradient-to-b from-[#0e1628] to-[#080d16] p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Layers className="size-4" />
            </div>
            <h2 className="text-lg font-bold text-white">Defense-in-Depth Architecture</h2>
          </div>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Never rely on a single defensive line. If an attacker breaches the outer wall, inner layers must still contain them:
          </p>

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#080e1b] p-3 text-xs sm:text-sm text-slate-200">
              <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-xs font-bold text-cyan-400 border border-cyan-800">Layer 1</span>
              <div>
                <strong className="text-white">Edge / Perimeter:</strong> WAF, DDoS mitigation, HTTPS enforcement.
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#080e1b] p-3 text-xs sm:text-sm text-slate-200">
              <span className="rounded bg-emerald-950 px-2 py-0.5 font-mono text-xs font-bold text-emerald-400 border border-emerald-800">Layer 2</span>
              <div>
                <strong className="text-white">Network & Transport:</strong> VPC isolation, private subnets, firewall egress rules.
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#080e1b] p-3 text-xs sm:text-sm text-slate-200">
              <span className="rounded bg-amber-950 px-2 py-0.5 font-mono text-xs font-bold text-amber-400 border border-amber-800">Layer 3</span>
              <div>
                <strong className="text-white">Application Logic:</strong> Server-side auth, parameterized queries, input validation.
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#080e1b] p-3 text-xs sm:text-sm text-slate-200">
              <span className="rounded bg-purple-950 px-2 py-0.5 font-mono text-xs font-bold text-purple-400 border border-purple-800">Layer 4</span>
              <div>
                <strong className="text-white">Data & Storage:</strong> Encrypted databases at rest, HSM key vaults, immutable audit trails.
              </div>
            </div>
          </div>
        </div>

        {/* 5 Golden Rules */}
        <div className="rounded-2xl border border-[var(--osa-border)] bg-gradient-to-b from-[#0e1628] to-[#080d16] p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <CheckCircle2 className="size-4" />
            </div>
            <h2 className="text-lg font-bold text-white">5 Golden Rules for Developers</h2>
          </div>

          <div className="mt-4 space-y-3">
            {[
              {
                num: 1,
                title: 'Never Trust Client Input',
                desc: 'All HTTP parameters, headers, query strings, and cookies can be forged. Validate and sanitize on the server.',
              },
              {
                num: 2,
                title: 'Enforce Least Privilege & Deny by Default',
                desc: 'Users and microservices should only possess the minimum permissions necessary to complete their job.',
              },
              {
                num: 3,
                title: 'Fail Securely (Fail Closed)',
                desc: 'When an exception or timeout occurs, reject the transaction and lock down rather than granting default access.',
              },
              {
                num: 4,
                title: 'Continuous Vulnerability & Dependency Auditing',
                desc: 'Scan code in CI/CD, maintain an SBOM, and patch outdated packages with known CVEs immediately.',
              },
              {
                num: 5,
                title: 'Log Security Events & Alert Promptly',
                desc: 'Record authentication failures, authorization bypass attempts, and input anomalies to an immutable SIEM.',
              },
            ].map((rule) => (
              <div
                key={rule.num}
                className="flex items-start gap-3 rounded-xl border border-[var(--osa-border)]/60 bg-[#070c17] p-3 text-xs sm:text-sm text-slate-300"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-cyan-950 font-bold font-mono text-cyan-400 border border-cyan-800 text-xs">
                  {rule.num}
                </span>
                <div>
                  <strong className="text-white">{rule.title}: </strong>
                  <span className="text-slate-300">{rule.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
