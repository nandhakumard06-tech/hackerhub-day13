import { useState, useEffect, useRef } from 'react';
import { GripVertical } from 'lucide-react';
import type { VisualVulnerability, LabNode } from '@/data/visualLabData';

interface Props {
  vulnerability: VisualVulnerability;
  selectedNode: LabNode;
  onSelectNode: (node: LabNode) => void;
  isPlaying: boolean;
  speed: number; // 0.5, 1, 1.5, 2
}

export type NodeKey = 'actor' | 'entry' | 'failure' | 'impact' | 'defense';

const DEFAULT_POSITIONS: Record<NodeKey, { x: number; y: number }> = {
  actor: { x: 3.5, y: 10 },
  entry: { x: 38, y: 10 },
  failure: { x: 68, y: 35 },
  impact: { x: 47, y: 68 },
  defense: { x: 10, y: 68 },
};

export function VisualLabDiagram({
  vulnerability,
  selectedNode,
  onSelectNode,
  isPlaying,
  speed,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  // Box positions stored in percentage (0-100) for fully responsive layout
  const [positions, setPositions] =
    useState<Record<NodeKey, { x: number; y: number }>>(DEFAULT_POSITIONS);
  const [draggingKey, setDraggingKey] = useState<NodeKey | null>(null);

  // Continuous automated active step (0 to 4 corresponding to actor, entry, failure, impact, defense)
  const [activeStep, setActiveStep] = useState(0);

  const scrollToNode = (key: NodeKey) => {
    if (!scrollWrapperRef.current || !containerRef.current) return;
    const scrollEl = scrollWrapperRef.current;
    const containerEl = containerRef.current;
    const currentPos = positions[key];
    const cardW = 256;
    const targetX =
      (currentPos.x / 100) * containerEl.scrollWidth -
      scrollEl.clientWidth / 2 +
      cardW / 2;
    scrollEl.scrollTo({ left: Math.max(0, targetX), behavior: 'smooth' });
  };

  // Auto-advance step when playing
  useEffect(() => {
    if (!isPlaying) return;
    const baseInterval = 2800 / speed;
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        const nextStep = prev >= 4 ? 0 : prev + 1;
        const keys: NodeKey[] = ['actor', 'entry', 'failure', 'impact', 'defense'];
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
          scrollToNode(keys[nextStep]);
        }
        return nextStep;
      });
    }, baseInterval);

    return () => clearInterval(timer);
  }, [isPlaying, speed, positions]);

  // Reset positions when vulnerability changes
  useEffect(() => {
    setPositions(DEFAULT_POSITIONS);
  }, [vulnerability.id]);

  // Ref tracking active drag state
  const dragInfoRef = useRef<{
    key: NodeKey;
    startX: number;
    startY: number;
    startPxX: number;
    startPxY: number;
    hasMoved: boolean;
  } | null>(null);

  const handlePointerDown = (
    key: NodeKey,
    e: React.PointerEvent<HTMLDivElement>,
    node: LabNode,
    stepIndex: number,
  ) => {
    // Only accept left mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (e.pointerType === 'mouse') {
      e.preventDefault();
    }

    onSelectNode(node);
    setActiveStep(stepIndex);

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const currentPos = positions[key];

    dragInfoRef.current = {
      key,
      startX: e.clientX,
      startY: e.clientY,
      startPxX: (currentPos.x / 100) * containerRect.width,
      startPxY: (currentPos.y / 100) * containerRect.height,
      hasMoved: false,
    };

    setDraggingKey(key);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!dragInfoRef.current) return;
      const info = dragInfoRef.current;
      const deltaX = moveEvent.clientX - info.startX;
      const deltaY = moveEvent.clientY - info.startY;

      if (!info.hasMoved && Math.hypot(deltaX, deltaY) > 3) {
        info.hasMoved = true;
      }

      if (info.hasMoved) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Card width ~256px (w-64), height ~110px
        const cardW = 256;
        const cardH = 110;

        const clampedX = Math.max(8, Math.min(rect.width - cardW - 8, info.startPxX + deltaX));
        const clampedY = Math.max(8, Math.min(rect.height - cardH - 8, info.startPxY + deltaY));

        const percentX = (clampedX / rect.width) * 100;
        const percentY = (clampedY / rect.height) * 100;

        setPositions((prev) => ({
          ...prev,
          [info.key]: { x: percentX, y: percentY },
        }));
      }
    };

    const onPointerUp = () => {
      dragInfoRef.current = null;
      setDraggingKey(null);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };


  const { nodes, labels } = vulnerability;

  // -------------------------------------------------------------
  // Dynamic Bezier Connection Math for SVG (1000 x 540 viewBox)
  // -------------------------------------------------------------
  const cardWidthViewBox = 256;
  const cardHeightViewBox = 110;

  const getBoxGeometry = (key: NodeKey) => {
    const pos = positions[key];
    const x = (pos.x / 100) * 1000;
    const y = (pos.y / 100) * 540;
    return {
      x,
      y,
      width: cardWidthViewBox,
      height: cardHeightViewBox,
      cx: x + cardWidthViewBox / 2,
      cy: y + cardHeightViewBox / 2,
    };
  };

  const computeConnection = (fromKey: NodeKey, toKey: NodeKey) => {
    const a = getBoxGeometry(fromKey);
    const b = getBoxGeometry(toKey);

    const dx = b.cx - a.cx;
    const dy = b.cy - a.cy;

    // Exit point on Box A
    let startX = a.cx;
    let startY = a.cy;
    let exitDir: 'left' | 'right' | 'top' | 'bottom' = 'right';

    if (Math.abs(dx) * (a.height / 2) >= Math.abs(dy) * (a.width / 2)) {
      if (dx >= 0) {
        startX = a.x + a.width;
        startY = a.cy;
        exitDir = 'right';
      } else {
        startX = a.x;
        startY = a.cy;
        exitDir = 'left';
      }
    } else {
      if (dy >= 0) {
        startX = a.cx;
        startY = a.y + a.height;
        exitDir = 'bottom';
      } else {
        startX = a.cx;
        startY = a.y;
        exitDir = 'top';
      }
    }

    // Entry point on Box B
    const rdx = a.cx - b.cx;
    const rdy = a.cy - b.cy;
    let endX = b.cx;
    let endY = b.cy;
    let enterDir: 'left' | 'right' | 'top' | 'bottom' = 'left';

    if (Math.abs(rdx) * (b.height / 2) >= Math.abs(rdy) * (b.width / 2)) {
      if (rdx >= 0) {
        endX = b.x + b.width;
        endY = b.cy;
        enterDir = 'right';
      } else {
        endX = b.x;
        endY = b.cy;
        enterDir = 'left';
      }
    } else {
      if (rdy >= 0) {
        endX = b.cx;
        endY = b.y + b.height;
        enterDir = 'bottom';
      } else {
        endX = b.cx;
        endY = b.y;
        enterDir = 'top';
      }
    }

    // Curvature & control points
    const dist = Math.hypot(endX - startX, endY - startY);
    const curvature = Math.max(35, Math.min(110, dist * 0.4));

    let cp1X = startX;
    let cp1Y = startY;
    if (exitDir === 'right') cp1X += curvature;
    else if (exitDir === 'left') cp1X -= curvature;
    else if (exitDir === 'bottom') cp1Y += curvature;
    else if (exitDir === 'top') cp1Y -= curvature;

    let cp2X = endX;
    let cp2Y = endY;
    if (enterDir === 'right') cp2X += curvature;
    else if (enterDir === 'left') cp2X -= curvature;
    else if (enterDir === 'bottom') cp2Y += curvature;
    else if (enterDir === 'top') cp2Y -= curvature;

    const pathD = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)}, ${cp2X.toFixed(1)} ${cp2Y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;

    // Exact midpoint on Bezier curve at t = 0.5
    const t = 0.5;
    const midX =
      (1 - t) ** 3 * startX +
      3 * (1 - t) ** 2 * t * cp1X +
      3 * (1 - t) * t ** 2 * cp2X +
      t ** 3 * endX;
    const midY =
      (1 - t) ** 3 * startY +
      3 * (1 - t) ** 2 * t * cp1Y +
      3 * (1 - t) * t ** 2 * cp2Y +
      t ** 3 * endY;

    return {
      pathD,
      midX,
      midY,
      midPercentX: (midX / 1000) * 100,
      midPercentY: (midY / 540) * 100,
    };
  };

  const conn1 = computeConnection('actor', 'entry');
  const conn2 = computeConnection('entry', 'failure');
  const conn3 = computeConnection('failure', 'impact');
  const conn4 = computeConnection('impact', 'defense');

  const nodeSteps: { key: NodeKey; stepIndex: number; label: string; number: number }[] = [
    { key: 'actor', stepIndex: 0, label: 'Threat Actor', number: 1 },
    { key: 'entry', stepIndex: 1, label: 'Entry Point', number: 2 },
    { key: 'failure', stepIndex: 2, label: 'Failure', number: 3 },
    { key: 'impact', stepIndex: 3, label: 'Impact', number: 4 },
    { key: 'defense', stepIndex: 4, label: 'Defense', number: 5 },
  ];

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[var(--osa-border)]/70 bg-[#090d16] shadow-2xl">
      {/* Mobile Attack Flow Sequence Pills Bar */}
      <div className="flex flex-col border-b border-[var(--osa-border)]/50 bg-[#080d19] px-3 py-2 lg:hidden">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
            Attack Flow Sequence
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            ← Swipe circuit →
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {nodeSteps.map((s) => {
            const isCurrent = activeStep === s.stepIndex;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => {
                  onSelectNode(nodes[s.key]);
                  setActiveStep(s.stepIndex);
                  scrollToNode(s.key);
                }}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  isCurrent
                    ? 'bg-purple-900/60 text-white border border-purple-500/60 shadow-xs ring-1 ring-purple-500/30'
                    : 'bg-[#0c1220] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span className="font-mono text-[10px] text-slate-400">{s.number}.</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Horizontal Touch-Scrollable Circuit Viewport */}
      <div
        ref={scrollWrapperRef}
        className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div
          ref={containerRef}
          className="relative h-[530px] sm:h-[550px] min-w-[880px] lg:min-w-full select-none overflow-hidden"
        >
          {/* Background Cyber Grid */}
          <div className="absolute inset-0 grid-mesh opacity-70 pointer-events-none" />


      {/* SVG Connecting Paths & Animated Packets */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none z-10"
        viewBox="0 0 1000 540"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Arrowhead Markers */}
          <marker
            id="arrow-cyan"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#00e5ff" />
          </marker>
          <marker
            id="arrow-red"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#ff3366" />
          </marker>
          <marker
            id="arrow-amber"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#f59e0b" />
          </marker>
          <marker
            id="arrow-emerald"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
          </marker>

          {/* Glow filter */}
          <filter id="packet-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Path: Node 1 (Actor) -> Node 2 (Entry) */}
        <g>
          <path
            d={conn1.pathD}
            fill="none"
            stroke="#00e5ff"
            strokeWidth="2"
            strokeDasharray="4 4"
            markerEnd="url(#arrow-cyan)"
            opacity="0.85"
            className="osa-flow"
          />
          {activeStep === 0 && (
            <circle
              cx={conn1.midX}
              cy={conn1.midY}
              r="5"
              fill="#00e5ff"
              filter="url(#packet-glow)"
              className="animate-pulse"
            />
          )}
        </g>

        {/* 2. Path: Node 2 (Entry) -> Node 3 (Failure) */}
        <g>
          <path
            d={conn2.pathD}
            fill="none"
            stroke="#ff3366"
            strokeWidth="2"
            strokeDasharray="4 4"
            markerEnd="url(#arrow-red)"
            opacity="0.85"
            className="osa-flow"
          />
          {activeStep === 1 && (
            <circle
              cx={conn2.midX}
              cy={conn2.midY}
              r="5"
              fill="#ff3366"
              filter="url(#packet-glow)"
              className="animate-pulse"
            />
          )}
        </g>

        {/* 3. Path: Node 3 (Failure) -> Node 4 (Impact) */}
        <g>
          <path
            d={conn3.pathD}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4 4"
            markerEnd="url(#arrow-amber)"
            opacity="0.85"
            className="osa-flow"
          />
          {activeStep === 2 && (
            <circle
              cx={conn3.midX}
              cy={conn3.midY}
              r="5"
              fill="#f59e0b"
              filter="url(#packet-glow)"
              className="animate-pulse"
            />
          )}
        </g>

        {/* 4. Path: Node 4 (Impact) -> Node 5 (Defense) */}
        <g>
          <path
            d={conn4.pathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4 4"
            markerEnd="url(#arrow-emerald)"
            opacity="0.85"
            className="osa-flow"
          />
          {activeStep === 3 && (
            <circle
              cx={conn4.midX}
              cy={conn4.midY}
              r="5"
              fill="#10b981"
              filter="url(#packet-glow)"
              className="animate-pulse"
            />
          )}
        </g>
      </svg>

      {/* Path Badges / Pills Overlay - Dynamically Positioned at Midpoints */}
      {/* Badge: "request" (cyan) */}
      <div
        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded border border-[#00e5ff]/60 bg-[#061421]/90 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#00e5ff] shadow-sm shadow-[#00e5ff]/20 backdrop-blur-sm"
        style={{ left: `${conn1.midPercentX}%`, top: `${conn1.midPercentY}%` }}
      >
        {labels.request}
      </div>

      {/* Badge: "unsafe path" (red) */}
      <div
        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded border border-[#ff3366]/60 bg-[#21060f]/90 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#ff3366] shadow-sm shadow-[#ff3366]/20 backdrop-blur-sm"
        style={{ left: `${conn2.midPercentX}%`, top: `${conn2.midPercentY}%` }}
      >
        {labels.unsafe}
      </div>

      {/* Badge: "impact" (amber) */}
      <div
        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded border border-[#f59e0b]/60 bg-[#211506]/90 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#f59e0b] shadow-sm shadow-[#f59e0b]/20 backdrop-blur-sm"
        style={{ left: `${conn3.midPercentX}%`, top: `${conn3.midPercentY}%` }}
      >
        {labels.impact}
      </div>

      {/* Badge: "remediate" (green) */}
      <div
        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded border border-[#10b981]/60 bg-[#062114]/90 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#10b981] shadow-sm shadow-[#10b981]/20 backdrop-blur-sm"
        style={{ left: `${conn4.midPercentX}%`, top: `${conn4.midPercentY}%` }}
      >
        {labels.remediate}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5 Movable Interactive Workflow Boxes                          */}
      {/* ------------------------------------------------------------- */}

      {/* Node 1: Top-Left (Cyan Glow) - "User / External input" */}
      <div
        onPointerDown={(e) => handlePointerDown('actor', e, nodes.actor, 0)}
        className={`absolute z-30 w-64 rounded-2xl border-2 border-[#00e5ff] bg-[#07131e]/95 p-4 glow-cyan-card select-none transition-shadow ${draggingKey === 'actor'
          ? 'cursor-grabbing z-40 shadow-2xl shadow-cyan-500/40 ring-2 ring-cyan-300 scale-[1.03]'
          : 'cursor-grab hover:scale-[1.02] transition-transform duration-150'
          } ${selectedNode.id === nodes.actor.id ? 'ring-2 ring-white/60' : ''
          }`}
        style={{
          left: `${positions.actor.x}%`,
          top: `${positions.actor.y}%`,
          touchAction: 'none',
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <span className="mt-1 size-2 rounded-full bg-[#00e5ff] shadow-sm shadow-[#00e5ff]" />
            <div className="flex-1">
              <h4 className="text-sm font-bold tracking-tight text-white">
                {nodes.actor.title}
              </h4>
              <p className="mt-1 text-xs text-slate-300">
                {nodes.actor.subtitle}
              </p>
            </div>
          </div>
          <div
            className="flex shrink-0 items-center text-cyan-400/50 hover:text-cyan-300"
            title="Drag with cursor to move"
          >
            <GripVertical className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#00e5ff]/80">
            {nodes.actor.tag}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Node 1 • Actor
          </span>
        </div>
      </div>

      {/* Node 2: Top-Center (Purple Glow) - "External component" */}
      <div
        onPointerDown={(e) => handlePointerDown('entry', e, nodes.entry, 1)}
        className={`absolute z-30 w-64 rounded-2xl border-2 border-[#a855f7] bg-[#140b24]/95 p-4 glow-purple-card select-none transition-shadow ${draggingKey === 'entry'
          ? 'cursor-grabbing z-40 shadow-2xl shadow-purple-500/40 ring-2 ring-purple-300 scale-[1.03]'
          : 'cursor-grab hover:scale-[1.02] transition-transform duration-150'
          } ${selectedNode.id === nodes.entry.id ? 'ring-2 ring-white/60' : ''
          }`}
        style={{
          left: `${positions.entry.x}%`,
          top: `${positions.entry.y}%`,
          touchAction: 'none',
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <span className="mt-1 size-2 rounded-full bg-[#a855f7] shadow-sm shadow-[#a855f7]" />
            <div className="flex-1">
              <h4 className="text-sm font-bold tracking-tight text-white">
                {nodes.entry.title}
              </h4>
              <p className="mt-1 text-xs text-slate-300">
                {nodes.entry.subtitle}
              </p>
            </div>
          </div>
          <div
            className="flex shrink-0 items-center text-purple-400/50 hover:text-purple-300"
            title="Drag with cursor to move"
          >
            <GripVertical className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#a855f7]/80">
            {nodes.entry.tag}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Node 2 • Entry
          </span>
        </div>
      </div>

      {/* Node 3: Middle-Right (Red Glow) - "Security failure" */}
      <div
        onPointerDown={(e) => handlePointerDown('failure', e, nodes.failure, 2)}
        className={`absolute z-30 w-64 rounded-2xl border-2 border-[#ff3366] bg-[#220712]/95 p-4 glow-red-card select-none transition-shadow ${draggingKey === 'failure'
          ? 'cursor-grabbing z-40 shadow-2xl shadow-red-500/40 ring-2 ring-red-300 scale-[1.03]'
          : 'cursor-grab hover:scale-[1.02] transition-transform duration-150'
          } ${selectedNode.id === nodes.failure.id ? 'ring-2 ring-white/60' : ''
          }`}
        style={{
          left: `${positions.failure.x}%`,
          top: `${positions.failure.y}%`,
          touchAction: 'none',
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <span className="mt-1 size-2 rounded-full bg-[#ff3366] shadow-sm shadow-[#ff3366]" />
            <div className="flex-1">
              <h4 className="text-sm font-bold tracking-tight text-white">
                {nodes.failure.title}
              </h4>
              <p className="mt-1 text-xs text-slate-300">
                {nodes.failure.subtitle}
              </p>
            </div>
          </div>
          <div
            className="flex shrink-0 items-center text-rose-400/50 hover:text-rose-300"
            title="Drag with cursor to move"
          >
            <GripVertical className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#ff3366]/80">
            {nodes.failure.tag}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Node 3 • Failure
          </span>
        </div>
      </div>

      {/* Node 4: Bottom-Center (Amber Glow) - "Business impact" */}
      <div
        onPointerDown={(e) => handlePointerDown('impact', e, nodes.impact, 3)}
        className={`absolute z-30 w-64 rounded-2xl border-2 border-[#f59e0b] bg-[#1d1207]/95 p-4 glow-amber-card select-none transition-shadow ${draggingKey === 'impact'
          ? 'cursor-grabbing z-40 shadow-2xl shadow-amber-500/40 ring-2 ring-amber-300 scale-[1.03]'
          : 'cursor-grab hover:scale-[1.02] transition-transform duration-150'
          } ${selectedNode.id === nodes.impact.id ? 'ring-2 ring-white/60' : ''
          }`}
        style={{
          left: `${positions.impact.x}%`,
          top: `${positions.impact.y}%`,
          touchAction: 'none',
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <span className="mt-1 size-2 rounded-full bg-[#f59e0b] shadow-sm shadow-[#f59e0b]" />
            <div className="flex-1">
              <h4 className="text-sm font-bold tracking-tight text-white">
                {nodes.impact.title}
              </h4>
              <p className="mt-1 text-xs text-slate-300">
                {nodes.impact.subtitle}
              </p>
            </div>
          </div>
          <div
            className="flex shrink-0 items-center text-amber-400/50 hover:text-amber-300"
            title="Drag with cursor to move"
          >
            <GripVertical className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#f59e0b]/80">
            {nodes.impact.tag}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Node 4 • Impact
          </span>
        </div>
      </div>

      {/* Node 5: Bottom-Left (Emerald Glow) - "Secure control" */}
      <div
        onPointerDown={(e) => handlePointerDown('defense', e, nodes.defense, 4)}
        className={`absolute z-30 w-64 rounded-2xl border-2 border-[#10b981] bg-[#071913]/95 p-4 glow-emerald-card select-none transition-shadow ${draggingKey === 'defense'
          ? 'cursor-grabbing z-40 shadow-2xl shadow-emerald-500/40 ring-2 ring-emerald-300 scale-[1.03]'
          : 'cursor-grab hover:scale-[1.02] transition-transform duration-150'
          } ${selectedNode.id === nodes.defense.id ? 'ring-2 ring-white/60' : ''
          }`}
        style={{
          left: `${positions.defense.x}%`,
          top: `${positions.defense.y}%`,
          touchAction: 'none',
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <span className="mt-1 size-2 rounded-full bg-[#10b981] shadow-sm shadow-[#10b981]" />
            <div className="flex-1">
              <h4 className="text-sm font-bold tracking-tight text-white">
                {nodes.defense.title}
              </h4>
              <p className="mt-1 text-xs text-slate-300">
                {nodes.defense.subtitle}
              </p>
            </div>
          </div>
          <div
            className="flex shrink-0 items-center text-emerald-400/50 hover:text-emerald-300"
            title="Drag with cursor to move"
          >
            <GripVertical className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#10b981]/80">
            {nodes.defense.tag}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Node 5 • Defense
          </span>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}

