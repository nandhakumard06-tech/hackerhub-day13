import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Zap,
} from 'lucide-react';
import type { VisualVulnerability } from '@/data/visualLabData';

interface Props {
  vulnerability: VisualVulnerability;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset?: () => void;
  speed: number;
  onSelectSpeed: (speed: number) => void;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onNext: () => void;
  onPresent: () => void;
}

const SPEED_OPTIONS = [0.5, 1, 1.5, 2];

export function VisualLabControls({
  vulnerability,
  isPlaying,
  onTogglePlay,
  onReset,
  speed,
  onSelectSpeed,
  isCompleted,
  onToggleComplete,
  onNext,
  onPresent,
}: Props) {
  return (
    <div className="relative mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--osa-border)]/60 pt-3 select-none">
      {/* Left Control Group: Playback, Speed, Reset */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Play / Pause Button */}
        <button
          type="button"
          onClick={onTogglePlay}
          className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-md transition-all ${
            isPlaying
              ? 'border border-cyan-500/50 bg-cyan-950/60 text-cyan-200 shadow-cyan-950/40 hover:bg-cyan-900/60 hover:text-white'
              : 'border border-slate-700 bg-[#0d1527] text-slate-300 hover:border-cyan-500/40 hover:bg-[#121c33] hover:text-white'
          }`}
          title={isPlaying ? 'Pause simulation packets' : 'Play simulation packets'}
        >
          {isPlaying ? (
            <>
              <Pause className="size-3.5 fill-cyan-400 text-cyan-400" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="size-3.5 fill-cyan-400 text-cyan-400" />
              <span>Play</span>
            </>
          )}
        </button>

        {/* Speed Selector */}
        <div className="flex items-center rounded-xl border border-slate-800 bg-[#0a1020] p-0.5">
          <span className="flex items-center px-2 text-[10px] font-mono text-slate-500 uppercase">
            <Zap className="mr-1 size-2.5 text-amber-400" />
            Speed
          </span>
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSelectSpeed(s)}
              className={`rounded-lg px-2 py-1 text-[11px] font-mono font-semibold transition-colors ${
                speed === s
                  ? 'bg-purple-600/80 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Optional Reset Button */}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#0a1020] px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-700 hover:bg-[#0e162d] hover:text-slate-200"
            title="Reset flow animation"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>

      {/* Right Control Group: Complete, Present, Next Module */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Fullscreen / Present mode */}
        <button
          type="button"
          onClick={onPresent}
          className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#0a1020] px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:border-purple-500/40 hover:bg-[#121128] hover:text-purple-300"
          title="Toggle Focus / Present Mode"
        >
          <Maximize2 className="size-3.5" />
          <span className="hidden sm:inline">Focus</span>
        </button>

        {/* Completed status button */}
        <button
          type="button"
          onClick={onToggleComplete}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
            isCompleted
              ? 'border-emerald-500/50 bg-emerald-950/50 text-emerald-300 shadow-sm shadow-emerald-950/40 hover:bg-emerald-900/50'
              : 'border-slate-800 bg-[#0a1020] text-slate-400 hover:border-emerald-500/30 hover:bg-[#081a17] hover:text-emerald-300'
          }`}
          title={isCompleted ? 'Mark as Incomplete' : 'Mark Module as Completed'}
        >
          <CheckCircle2
            className={`size-3.5 ${isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}
          />
          <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
        </button>

        {/* Next Module Button */}
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-1.5 rounded-xl border border-purple-500/60 bg-gradient-to-r from-purple-900/70 to-indigo-900/70 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-950/50 transition-all hover:border-purple-400 hover:from-purple-800 hover:to-indigo-800"
          title={`Proceed to next module: ${vulnerability.nextTitle}`}
        >
          <span>Next: {vulnerability.nextId}</span>
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
