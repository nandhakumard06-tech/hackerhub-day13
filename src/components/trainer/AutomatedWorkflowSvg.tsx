import { useState, useEffect } from 'react';
import {
  User,
  ShieldAlert,
  Server,
  Database,
  Wifi,
  Terminal,
  Cpu,
  Bot,
  Key,
  UserCheck,
  Radio,
  Lock,
  FileCode,
  ServerCrash,
  Search,
  Box,
  Flame,
  LogIn,
  DownloadCloud,
  AlertTriangle,
  EyeOff,
  FileText,
  Clock,
  Send,
  Cloud,
  Activity,
} from 'lucide-react';
import type { VulnerabilityItem } from '@/data/trainerData';

interface Props {
  vulnerability: VulnerabilityItem;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  ShieldAlert,
  Server,
  Database,
  Wifi,
  Terminal,
  Cpu,
  Bot,
  Key,
  UserCheck,
  Radio,
  Lock,
  FileCode,
  ServerCrash,
  Search,
  Box,
  Flame,
  LogIn,
  DownloadCloud,
  AlertTriangle,
  EyeOff,
  FileText,
  Clock,
  Send,
  Cloud,
  Activity,
};

export function AutomatedWorkflowSvg({ vulnerability }: Props) {
  // Continuous automated step timer (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // Reset to step 1 whenever vulnerability changes
  useEffect(() => {
    setCurrentStep(1);
  }, [vulnerability.id]);

  // Automated continuous looping animation (runs on its own, non-manual)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 2800); // 2.8 seconds per step, smooth loop

    return () => clearInterval(timer);
  }, [vulnerability.id]);

  const steps = vulnerability.workflow.steps;
  const activeStep = steps.find((s) => s.stepNumber === currentStep) || steps[0];

  // 4 node positions across 760px viewBox
  const nodePositions = [
    { x: 95, y: 130 },
    { x: 285, y: 130 },
    { x: 475, y: 130 },
    { x: 665, y: 130 },
  ];

  const primaryRed = '#ef4444';
  const pulseAmber = '#f59e0b';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--osa-border)] bg-gradient-to-b from-[#0b1220] via-[#070c17] to-[#040810] p-5 shadow-2xl backdrop-blur-md">
      {/* Background Cyber Mesh */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Status & Continuous Indicator Bar */}
      <div className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--osa-border)]/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-red-400 animate-ping" />
          <span className="font-mono text-xs font-bold tracking-wider uppercase text-red-400">
            Automated Attack Simulation
          </span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-xs text-slate-400">
            Step {currentStep} of 4: {activeStep.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-0.5 font-mono text-[11px] text-cyan-300">
            Continuous Loop • Active
          </span>
        </div>
      </div>

      {/* SVG Canvas for Automated Visual Workflow */}
      <div className="relative mx-auto w-full overflow-hidden rounded-xl border border-[var(--osa-border)]/60 bg-[#050912]/95 p-3 shadow-inner">
        <svg
          viewBox="0 0 760 260"
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`${vulnerability.title} automated workflow diagram`}
        >
          <defs>
            {/* Luminous Red-Amber Attack Gradient */}
            <linearGradient id="auto-flow-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="auto-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Line */}
          <line
            x1="40"
            y1="130"
            x2="720"
            y2="130"
            stroke="#172337"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />

          {/* Animated Connecting Flow Lines between Nodes */}
          {nodePositions.slice(0, 3).map((pos, idx) => {
            const nextPos = nodePositions[idx + 1];
            const isLineActive = currentStep > idx;
            const isCurrentTraveling = currentStep === idx + 1;

            return (
              <g key={`edge-${idx}`}>
                {/* Dark Base Line */}
                <line
                  x1={pos.x + 40}
                  y1={pos.y}
                  x2={nextPos.x - 40}
                  y2={nextPos.y}
                  stroke="#1b283d"
                  strokeWidth="3"
                />

                {/* Active Animated Pulse Flow Line */}
                {isLineActive && (
                  <line
                    x1={pos.x + 40}
                    y1={pos.y}
                    x2={nextPos.x - 40}
                    y2={nextPos.y}
                    stroke="url(#auto-flow-line)"
                    strokeWidth="3.5"
                    strokeDasharray="8 8"
                    className="osa-flow"
                  />
                )}

                {/* Traveling Glowing Data Packet */}
                {isCurrentTraveling && (
                  <g className="animate-pulse">
                    <circle
                      cx={(pos.x + nextPos.x) / 2}
                      cy={pos.y}
                      r="5"
                      fill={primaryRed}
                      filter="url(#auto-glow)"
                    />
                    <circle
                      cx={(pos.x + nextPos.x) / 2}
                      cy={pos.y}
                      r="9"
                      fill="none"
                      stroke={pulseAmber}
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                  </g>
                )}

                {/* Arrowhead */}
                <polygon
                  points={`${nextPos.x - 44},${nextPos.y - 5} ${nextPos.x - 38},${nextPos.y} ${nextPos.x - 44},${nextPos.y + 5}`}
                  fill={isLineActive ? primaryRed : '#24344e'}
                />
              </g>
            );
          })}

          {/* 4 Nodes */}
          {vulnerability.workflow.nodes.map((node, idx) => {
            const pos = nodePositions[idx];
            const stepNum = idx + 1;
            const isCurrent = currentStep === stepNum;
            const isPassed = currentStep > stepNum;
            const NodeIcon = ICON_MAP[node.icon] || Server;

            let circleFill = '#090f1d';
            let circleBorder = '#223249';
            let textColor = '#64748b';

            if (isCurrent) {
              circleFill = '#22080a';
              circleBorder = primaryRed;
              textColor = '#fca5a5';
            } else if (isPassed) {
              circleFill = '#120b16';
              circleBorder = '#7f1d1d';
              textColor = '#cbd5e1';
            }

            return (
              <g
                key={node.id}
                className="transition-all duration-300"
              >
                {/* Active Halo & Rotating Ring */}
                {isCurrent && (
                  <>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="46"
                      fill={primaryRed}
                      opacity="0.15"
                      filter="url(#auto-glow)"
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="42"
                      fill="none"
                      stroke={primaryRed}
                      strokeWidth="1.5"
                      strokeDasharray="5 5"
                      className="osa-rotate"
                    />
                  </>
                )}

                {/* Node Circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="34"
                  fill={circleFill}
                  stroke={circleBorder}
                  strokeWidth={isCurrent ? '3' : '1.5'}
                  filter={isCurrent ? 'url(#auto-glow)' : undefined}
                />

                {/* Node Center Icon */}
                <foreignObject
                  x={pos.x - 16}
                  y={pos.y - 16}
                  width="32"
                  height="32"
                  className="pointer-events-none"
                >
                  <div className="flex size-full items-center justify-center">
                    <NodeIcon
                      className={`size-6 ${
                        isCurrent
                          ? 'text-red-400'
                          : isPassed
                            ? 'text-slate-300'
                            : 'text-slate-600'
                      }`}
                    />
                  </div>
                </foreignObject>

                {/* Step Number Badge */}
                <circle
                  cx={pos.x + 24}
                  cy={pos.y - 24}
                  r="11"
                  fill={isCurrent ? primaryRed : '#162338'}
                  stroke="#080e1a"
                  strokeWidth="2.5"
                />
                <text
                  x={pos.x + 24}
                  y={pos.y - 20}
                  textAnchor="middle"
                  fill={isCurrent ? '#ffffff' : '#94a3b8'}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {stepNum}
                </text>

                {/* Node Label */}
                <text
                  x={pos.x}
                  y={pos.y + 54}
                  textAnchor="middle"
                  fill={isCurrent ? '#ffffff' : textColor}
                  fontSize="12"
                  fontWeight={isCurrent ? '700' : '500'}
                  fontFamily="system-ui, sans-serif"
                >
                  {node.label}
                </text>

                {/* Node Role sub-label */}
                <text
                  x={pos.x}
                  y={pos.y + 70}
                  textAnchor="middle"
                  fill={isCurrent ? primaryRed : '#475569'}
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {node.role}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Live Attack Payload Callout Bar inside SVG Box */}
        {activeStep.payload && (
          <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-red-900/40 bg-[#080306]/95 px-3.5 py-2 font-mono text-xs">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="rounded bg-red-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400 border border-red-800/60">
                Vector / Payload
              </span>
              <code className="text-red-200 overflow-hidden text-ellipsis">
                {activeStep.payload}
              </code>
            </div>
            <span className="shrink-0 text-[10px] font-mono text-slate-400">
              Auto-Playing Step {currentStep} / 4
            </span>
          </div>
        )}
      </div>

      {/* Step Timeline Indicator Bar (Fills as steps progress) */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {steps.map((s) => {
          const isCurrent = s.stepNumber === currentStep;
          const isDone = s.stepNumber < currentStep;

          return (
            <div
              key={s.stepNumber}
              className={`flex flex-col rounded-xl border p-2.5 transition-all duration-300 ${
                isCurrent
                  ? 'border-red-500/80 bg-red-950/40 text-red-200 shadow-md shadow-red-950/50'
                  : isDone
                    ? 'border-slate-800 bg-[#070d18] text-slate-400'
                    : 'border-slate-800/60 bg-[#050812] text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                <span>Step {s.stepNumber}</span>
                {isCurrent && (
                  <span className="size-2 rounded-full bg-red-400 animate-ping" />
                )}
              </div>
              <span className="mt-1 text-xs font-semibold truncate text-slate-200">
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Dynamic Action Explanation for the Current Step */}
      <div className="mt-4 rounded-xl border border-red-950/80 bg-[#080206] p-4 text-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-950/80 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-red-900/40 font-mono text-xs font-bold text-red-400 border border-red-700/50">
              {currentStep}
            </div>
            <span className="text-sm font-bold text-white">
              {activeStep.title}
            </span>
            <span className="rounded bg-slate-900 px-2 py-0.5 text-[11px] font-mono text-slate-400">
              Actor: {activeStep.actor}
            </span>
          </div>

          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              activeStep.status === 'breached'
                ? 'bg-rose-950 text-rose-300 border border-rose-600'
                : 'bg-red-950 text-red-400 border border-red-800'
            }`}
          >
            {activeStep.status === 'breached' ? '🚨 System Breached' : '⚠️ Exploit In Progress'}
          </span>
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-slate-200">
          {activeStep.action}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {activeStep.detail}
        </p>
      </div>
    </div>
  );
}
