import { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Flame,
  ChevronRight,
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
  LogIn,
  DownloadCloud,
  AlertTriangle,
  EyeOff,
  FileText,
  Clock,
  Send,
  Cloud,
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
};

export function TrainerWorkflowSvg({ vulnerability }: Props) {
  const [mode, setMode] = useState<'attack' | 'defense'>('attack');
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Reset step on vulnerability or mode change
  useEffect(() => {
    setCurrentStep(1);
    setIsPlaying(false);
  }, [vulnerability.id, mode]);

  const steps = mode === 'attack' ? vulnerability.workflow.steps : vulnerability.workflow.defenseSteps;
  const activeStepData = steps.find((s) => s.stepNumber === currentStep) || steps[0];
  const isAttack = mode === 'attack';

  // Fixed SVG node positions for 4-step linear flow
  const nodePositions = [
    { x: 80, y: 110 },
    { x: 240, y: 110 },
    { x: 400, y: 110 },
    { x: 560, y: 110 },
  ];

  const primaryColor = isAttack ? '#ef4444' : '#10b981';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--osa-border)] bg-gradient-to-b from-[#0e1626] to-[#080d16] p-5 shadow-2xl backdrop-blur-md">
      {/* Background Cyber Mesh */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Header & Mode Toggle */}
      <div className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--osa-border)]/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase ${
                isAttack
                  ? 'border border-red-500/30 bg-red-950/40 text-red-400'
                  : 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-400'
              }`}
            >
              {isAttack ? <Flame className="size-3.5 animate-pulse text-red-400" /> : <ShieldCheck className="size-3.5 text-emerald-400" />}
              {isAttack ? 'Attack Vector Simulation' : 'Secured Defense Flow'}
            </span>
            <span className="text-xs text-[var(--osa-muted)]">
              Interactive SVG Workflow
            </span>
          </div>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-white">
            {isAttack ? vulnerability.workflow.attackName : vulnerability.workflow.defenseName}
          </h3>
        </div>

        {/* Attack vs Defense Mode Switcher */}
        <div className="flex items-center rounded-xl border border-[var(--osa-border)] bg-[#070b14] p-1">
          <button
            type="button"
            onClick={() => setMode('attack')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              isAttack
                ? 'bg-red-500/20 text-red-300 shadow-sm border border-red-500/30 font-semibold'
                : 'text-[var(--osa-muted)] hover:text-white'
            }`}
          >
            <Flame className="size-3.5 text-red-400" />
            Attack Vector
          </button>
          <button
            type="button"
            onClick={() => setMode('defense')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              !isAttack
                ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30 font-semibold'
                : 'text-[var(--osa-muted)] hover:text-white'
            }`}
          >
            <ShieldCheck className="size-3.5 text-emerald-400" />
            Mitigated Flow
          </button>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-[var(--osa-border)]/50 bg-[#060a12]/90 p-2 shadow-inner">
        <svg
          viewBox="0 0 640 220"
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`${vulnerability.title} interactive workflow diagram`}
        >
          <defs>
            {/* Linear Glow Gradients */}
            <linearGradient id="cyber-line-attack" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="cyber-line-defense" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00c2ff" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#00f5a0" stopOpacity="1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines inside diagram */}
          <line x1="20" y1="110" x2="620" y2="110" stroke="#172236" strokeWidth="1" strokeDasharray="4 6" />

          {/* Connecting Arrows & Animated Packets between Nodes */}
          {nodePositions.slice(0, 3).map((pos, idx) => {
            const nextPos = nodePositions[idx + 1];
            const isLineActive = currentStep > idx;
            const isCurrentTransition = currentStep === idx + 1;

            return (
              <g key={`edge-${idx}`}>
                {/* Background base path */}
                <line
                  x1={pos.x + 38}
                  y1={pos.y}
                  x2={nextPos.x - 38}
                  y2={nextPos.y}
                  stroke="#1c2b42"
                  strokeWidth="2.5"
                />

                {/* Active Flow Line with animated dash */}
                {isLineActive && (
                  <line
                    x1={pos.x + 38}
                    y1={pos.y}
                    x2={nextPos.x - 38}
                    y2={nextPos.y}
                    stroke={isAttack ? 'url(#cyber-line-attack)' : 'url(#cyber-line-defense)'}
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    className="osa-flow"
                  />
                )}

                {/* Current Transition Pulsing Dot */}
                {isCurrentTransition && (
                  <circle
                    cx={(pos.x + nextPos.x) / 2}
                    cy={pos.y}
                    r="4"
                    fill={primaryColor}
                    filter="url(#node-glow)"
                    className="animate-pulse"
                  />
                )}

                {/* Arrowhead marker */}
                <polygon
                  points={`${nextPos.x - 42},${nextPos.y - 4} ${nextPos.x - 36},${nextPos.y} ${nextPos.x - 42},${nextPos.y + 4}`}
                  fill={isLineActive ? primaryColor : '#25354e'}
                />
              </g>
            );
          })}

          {/* 4 Workflow Nodes */}
          {vulnerability.workflow.nodes.map((node, idx) => {
            const pos = nodePositions[idx];
            const stepNum = idx + 1;
            const isCurrent = currentStep === stepNum;
            const isPassed = currentStep > stepNum;
            const NodeIcon = ICON_MAP[node.icon] || Server;

            let borderColor = '#223249';
            let bgColor = '#090f1d';
            let textColor = '#64748b';

            if (isCurrent) {
              borderColor = primaryColor;
              bgColor = isAttack ? '#22080a' : '#041d18';
              textColor = isAttack ? '#fca5a5' : '#6ee7b7';
            } else if (isPassed) {
              borderColor = isAttack ? '#7f1d1d' : '#065f46';
              bgColor = '#0c1524';
              textColor = '#94a3b8';
            }

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => setCurrentStep(stepNum)}
              >
                {/* Active Glowing Ring */}
                {isCurrent && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="38"
                    fill="none"
                    stroke={primaryColor}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.8"
                    className="osa-rotate"
                  />
                )}

                {/* Outer Node Circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="30"
                  fill={bgColor}
                  stroke={borderColor}
                  strokeWidth={isCurrent ? '2.5' : '1.5'}
                  filter={isCurrent ? 'url(#node-glow)' : undefined}
                />

                {/* Inner Icon representation via foreignObject */}
                <foreignObject
                  x={pos.x - 14}
                  y={pos.y - 14}
                  width="28"
                  height="28"
                  className="pointer-events-none"
                >
                  <div className="flex size-full items-center justify-center">
                    <NodeIcon
                      className={`size-5 ${
                        isCurrent
                          ? isAttack
                            ? 'text-red-400'
                            : 'text-emerald-400'
                          : isPassed
                            ? 'text-slate-400'
                            : 'text-slate-600'
                      }`}
                    />
                  </div>
                </foreignObject>

                {/* Step number badge above node */}
                <circle
                  cx={pos.x + 22}
                  cy={pos.y - 22}
                  r="10"
                  fill={isCurrent ? primaryColor : '#162234'}
                  stroke="#090f1d"
                  strokeWidth="2"
                />
                <text
                  x={pos.x + 22}
                  y={pos.y - 18}
                  textAnchor="middle"
                  fill={isCurrent ? '#041017' : '#94a3b8'}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {stepNum}
                </text>

                {/* Node Label below */}
                <text
                  x={pos.x}
                  y={pos.y + 46}
                  textAnchor="middle"
                  fill={isCurrent ? '#ffffff' : textColor}
                  fontSize="11"
                  fontWeight={isCurrent ? '600' : '500'}
                  fontFamily="system-ui, sans-serif"
                >
                  {node.label}
                </text>

                {/* Node Role sub-label */}
                <text
                  x={pos.x}
                  y={pos.y + 60}
                  textAnchor="middle"
                  fill={isCurrent ? primaryColor : '#475569'}
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {node.role}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Active Step Payload Callout Banner */}
        {activeStepData.payload && (
          <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-[var(--osa-border)] bg-[#040810]/90 px-3 py-2 font-mono text-xs">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                isAttack ? 'bg-red-950 text-red-400 border border-red-800/40' : 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
              }`}>
                {isAttack ? 'Payload' : 'Filter / Rule'}
              </span>
              <code className="text-slate-300 overflow-hidden text-ellipsis">
                {activeStepData.payload}
              </code>
            </div>
            <span className="shrink-0 text-[10px] text-[var(--osa-muted)]">
              Step {currentStep} of 4
            </span>
          </div>
        )}
      </div>

      {/* Step Description Card */}
      <div className="mt-4 rounded-xl border border-[var(--osa-border)] bg-[#080d1a] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`flex size-6 items-center justify-center rounded-full text-xs font-bold font-mono ${
                isAttack ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {currentStep}
            </span>
            <h4 className="font-semibold text-white">
              {activeStepData.title}
            </h4>
            <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-400">
              Actor: {activeStepData.actor}
            </span>
          </div>

          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${
              activeStepData.status === 'breached'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-600/40'
                : activeStepData.status === 'critical'
                  ? 'bg-red-950/80 text-red-300 border border-red-600/40'
                  : activeStepData.status === 'secured'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
                    : 'bg-slate-800 text-slate-300'
            }`}
          >
            {activeStepData.status}
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {activeStepData.action}
        </p>

        <p className="mt-1 text-xs text-[var(--osa-muted)]">
          {activeStepData.detail}
        </p>
      </div>

      {/* Interactive Playback & Step Controls Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--osa-border)]/50 pt-3">
        {/* Step Navigation Pill Buttons */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => {
                setCurrentStep(num);
                setIsPlaying(false);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                currentStep === num
                  ? isAttack
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-[#111927] text-slate-400 hover:bg-[#1a2538] hover:text-white border border-[var(--osa-border)]'
              }`}
            >
              <span>Step {num}</span>
            </button>
          ))}
        </div>

        {/* Play/Pause/Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--osa-border)] bg-[#0d1524] px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-[var(--osa-hover)] hover:text-white"
          >
            {isPlaying ? (
              <>
                <Pause className="size-3.5 text-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="size-3.5 text-emerald-400" />
                <span>Play Animation</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentStep(1);
              setIsPlaying(false);
            }}
            title="Reset to Step 1"
            className="flex items-center gap-1 rounded-lg border border-[var(--osa-border)] bg-[#0d1524] p-1.5 text-slate-400 transition-colors hover:bg-[var(--osa-hover)] hover:text-white"
          >
            <RotateCcw className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentStep((prev) => (prev >= 4 ? 1 : prev + 1));
              setIsPlaying(false);
            }}
            className="flex items-center gap-1 rounded-lg border border-[var(--osa-border)] bg-[#0d1524] px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-[var(--osa-hover)] hover:text-white"
          >
            <span>Next</span>
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
