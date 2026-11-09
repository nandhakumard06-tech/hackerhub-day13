import {
  Maximize2,
  Minimize2,
  GraduationCap,
} from 'lucide-react';
import type { LabNode } from '@/data/visualLabData';

interface Props {
  selectedNode: LabNode;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenQuiz?: () => void;
}

export function VisualLabRightPane({
  selectedNode,
  isFullscreen,
  onToggleFullscreen,
  onOpenQuiz,
}: Props) {
  return (
    <aside className="relative flex h-[calc(100vh-3.5rem)] w-80 shrink-0 flex-col justify-between border-l border-[var(--osa-border)]/80 bg-[#070b14] p-5 select-none">
      {/* Top: Selected Node Details */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            SELECTED NODE
          </span>
          <h3 className="mt-1 text-xl font-extrabold tracking-tight text-white">
            {selectedNode.detailTitle}
          </h3>
          <span
            className="mt-1 inline-block rounded font-mono text-[11px] font-bold uppercase tracking-wider"
            style={{ color: selectedNode.badgeColor }}
          >
            {selectedNode.tag}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-slate-300">
          {selectedNode.detailDescription}
        </p>

        {/* Technical Mechanics List */}
        <div className="rounded-xl border border-slate-800 bg-[#0a0f1d] p-3 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Technical Vector Analysis:
          </span>
          <ul className="space-y-1.5">
            {selectedNode.technicalNotes.map((note, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-[11px] text-slate-300 leading-snug"
              >
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-slate-500" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Quiz CTA */}
        {onOpenQuiz && (
          <button
            type="button"
            onClick={onOpenQuiz}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/40 bg-purple-950/30 py-2.5 text-xs font-bold text-purple-200 transition-all hover:bg-purple-900/40 hover:text-white"
          >
            <GraduationCap className="size-4 text-purple-400" />
            <span>Test Comprehension (Quiz)</span>
          </button>
        )}
      </div>

      {/* Bottom Floating Presenter Tile & Layout Controls (Matching screenshot bottom-right) */}


      {/* Fullscreen / Presentation Toggle */}
      <div className="flex justify-end pb-1">
        <button
          type="button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Presentation' : 'Enter Presentation Mode'}
          className="flex size-9 items-center justify-center rounded-xl border border-slate-800 bg-[#0c1220] text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
        >
          {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </button>
      </div>


    </aside>
  );
}
