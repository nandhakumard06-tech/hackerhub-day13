import {
  Maximize2,
  Minimize2,
  GraduationCap,
} from 'lucide-react';
import type { LabNode } from '@/data/visualLabData';
import { cn } from '@/utils/cn';

interface Props {
  selectedNode: LabNode;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenQuiz?: () => void;
  isInline?: boolean;
  nodes?: {
    actor: LabNode;
    entry: LabNode;
    failure: LabNode;
    impact: LabNode;
    defense: LabNode;
  };
  onSelectNode?: (node: LabNode) => void;
  className?: string;
}

export function VisualLabRightPane({
  selectedNode,
  isFullscreen,
  onToggleFullscreen,
  onOpenQuiz,
  isInline = false,
  nodes,
  onSelectNode,
  className,
}: Props) {
  // Mobile / Tablet inline inspector layout (rendered directly below the diagram)
  if (isInline) {
    const nodeItems = nodes
      ? [
          { key: 'actor', node: nodes.actor, label: 'Actor', num: 1 },
          { key: 'entry', node: nodes.entry, label: 'Entry', num: 2 },
          { key: 'failure', node: nodes.failure, label: 'Failure', num: 3 },
          { key: 'impact', node: nodes.impact, label: 'Impact', num: 4 },
          { key: 'defense', node: nodes.defense, label: 'Defense', num: 5 },
        ]
      : [];

    return (
      <div
        className={cn(
          'rounded-2xl border border-[var(--osa-border)]/80 bg-[#070b14] p-4 sm:p-5 select-none shadow-xl',
          className,
        )}
      >
        {/* Quick Node Switcher Tabs on mobile */}
        {nodeItems.length > 0 && onSelectNode && (
          <div className="mb-4 pb-3 border-b border-[var(--osa-border)]/50">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-2">
              Select Node to Inspect
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {nodeItems.map((item) => {
                const isActive = selectedNode.id === item.node.id;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onSelectNode(item.node)}
                    className={`flex flex-col items-center justify-center rounded-xl py-2 px-1 text-center transition-all ${
                      isActive
                        ? 'border border-purple-500/80 bg-[#15112e] text-white shadow-sm ring-1 ring-purple-500/40'
                        : 'border border-slate-800 bg-[#0a0f1e] text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      0{item.num}
                    </span>
                    <span className="text-[11px] font-semibold truncate w-full">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Node Details Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              SELECTED NODE INSPECTOR
            </span>
            <h3 className="mt-0.5 text-lg sm:text-xl font-extrabold tracking-tight text-white">
              {selectedNode.detailTitle}
            </h3>
          </div>
          <span
            className="rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider border"
            style={{
              color: selectedNode.badgeColor,
              borderColor: `${selectedNode.badgeColor}40`,
              backgroundColor: `${selectedNode.badgeColor}15`,
            }}
          >
            {selectedNode.tag}
          </span>
        </div>

        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-300">
          {selectedNode.detailDescription}
        </p>

        {/* Technical Vector Analysis Box */}
        <div className="mt-3.5 rounded-xl border border-slate-800 bg-[#0a0f1d] p-3.5 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Technical Vector Analysis:
          </span>
          <ul className="space-y-1.5">
            {selectedNode.technicalNotes.map((note, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-300 leading-snug"
              >
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-slate-500" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quiz CTA */}
        {onOpenQuiz && (
          <div className="mt-4">
            <button
              type="button"
              onClick={onOpenQuiz}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/40 bg-purple-950/30 py-2.5 text-xs font-bold text-purple-200 transition-all hover:bg-purple-900/40 hover:text-white"
            >
              <GraduationCap className="size-4 text-purple-400" />
              <span>Test Comprehension (Take Quiz)</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Desktop aside layout (docked on right)
  return (
    <aside
      className={cn(
        'relative flex h-[calc(100vh-3.5rem)] w-80 shrink-0 flex-col justify-between border-l border-[var(--osa-border)]/80 bg-[#070b14] p-5 select-none',
        className,
      )}
    >
      {/* Top: Selected Node Details */}
      <div className="space-y-4 overflow-y-auto">
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

      {/* Fullscreen / Presentation Toggle */}
      <div className="flex justify-end pt-3 border-t border-[var(--osa-border)]/40">
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
