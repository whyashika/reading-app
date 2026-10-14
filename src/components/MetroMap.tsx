import { motion } from "framer-motion";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { Subject } from "../content/types";
import { LABEL, labelOffset, stationRadius, type MetroLayout, type Station } from "../lib/metroLayout";
import { pieceStatus, usePassport } from "../lib/progress";
import { subjectColor, subjectInk } from "../lib/subjects";
import { FormatIcon } from "./Badges";

export interface MetroMapHandle {
  zoomBy: (factor: number) => void;
  fit: () => void;
  centerOn: (id: string) => void;
}

type View = { x: number; y: number; k: number };
const MIN_K = 0.3;
const MAX_K = 2.5;
const clampK = (k: number) => Math.min(MAX_K, Math.max(MIN_K, k));

interface Props {
  layout: MetroLayout;
  highlight: Subject | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Space reserved by overlays (legend at top, preview at bottom) when fitting. */
  insets: { top: number; bottom: number };
}

export const MetroMap = forwardRef<MetroMapHandle, Props>(function MetroMap({ layout, highlight, selectedId, onSelect, insets }, ref) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 1 });
  const [animate, setAnimate] = useState(false);
  const viewRef = useRef(view);
  viewRef.current = view;
  const reduce = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  const set = useCallback(
    (v: View, smooth = false) => {
      setAnimate(smooth && !reduce);
      setView(v);
    },
    [reduce],
  );

  const size = () => {
    const r = svgRef.current!.getBoundingClientRect();
    return { w: r.width, h: r.height, left: r.left, top: r.top };
  };

  const zoomAt = useCallback(
    (px: number, py: number, factor: number, smooth = false) => {
      const v = viewRef.current;
      const k = clampK(v.k * factor);
      const wx = (px - v.x) / v.k;
      const wy = (py - v.y) / v.k;
      set({ k, x: px - wx * k, y: py - wy * k }, smooth);
    },
    [set],
  );

  const fit = useCallback(() => {
    const { w, h } = size();
    const availH = h - insets.top - insets.bottom;
    let k = Math.min(w / layout.width, availH / layout.height);
    k = clampK(Math.min(k, 1.1));
    const small = w < 640 && k < 0.55;
    if (small) k = 0.55; // On phones, start readable and let people pan.
    const x = small ? 0 : (w - layout.width * k) / 2;
    const y = insets.top + Math.max(0, (availH - layout.height * k) / 2);
    set({ x, y, k }, true);
  }, [insets.bottom, insets.top, layout.height, layout.width, set]);

  const centerOn = useCallback(
    (id: string) => {
      const st = layout.stations.find((s) => s.piece.id === id);
      if (!st) return;
      const { w, h } = size();
      const k = Math.max(viewRef.current.k, 0.9);
      const cy = insets.top + (h - insets.top - insets.bottom) / 2;
      set({ k, x: w / 2 - st.x * k, y: cy - st.y * k }, true);
    },
    [insets.bottom, insets.top, layout.stations, set],
  );

  useImperativeHandle(ref, () => ({
    zoomBy: (f) => {
      const { w, h } = size();
      zoomAt(w / 2, h / 2, f, true);
    },
    fit,
    centerOn,
  }));

  // Wheel / trackpad pinch to zoom (needs a non-passive listener).
  useEffect(() => {
    const svg = svgRef.current!;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { left, top } = size();
      const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.012 : 0.0018));
      zoomAt(e.clientX - left, e.clientY - top, factor);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // Drag to pan, two fingers to pinch.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const start = useRef<{ view: View; pts: Map<number, { x: number; y: number }> } | null>(null);
  const dragged = useRef(false);

  const snapshot = () => {
    start.current = { view: viewRef.current, pts: new Map(pointers.current) };
  };

  const onPointerDown = (e: PointerEvent) => {
    const { left, top } = size();
    pointers.current.set(e.pointerId, { x: e.clientX - left, y: e.clientY - top });
    if (pointers.current.size === 1) dragged.current = false;
    snapshot();
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!pointers.current.has(e.pointerId) || !start.current) return;
    const { left, top } = size();
    pointers.current.set(e.pointerId, { x: e.clientX - left, y: e.clientY - top });
    const s = start.current;
    const ids = [...pointers.current.keys()];
    if (ids.length === 1) {
      const p = pointers.current.get(ids[0])!;
      const p0 = s.pts.get(ids[0]);
      if (!p0) return snapshot();
      const dx = p.x - p0.x;
      const dy = p.y - p0.y;
      if (!dragged.current && Math.hypot(dx, dy) > 6) {
        dragged.current = true;
        svgRef.current!.setPointerCapture(e.pointerId);
      }
      if (dragged.current) set({ ...s.view, x: s.view.x + dx, y: s.view.y + dy });
    } else {
      const [a, b] = ids;
      const a0 = s.pts.get(a);
      const b0 = s.pts.get(b);
      if (!a0 || !b0) return snapshot();
      const a1 = pointers.current.get(a)!;
      const b1 = pointers.current.get(b)!;
      dragged.current = true;
      const d0 = Math.hypot(a0.x - b0.x, a0.y - b0.y) || 1;
      const d1 = Math.hypot(a1.x - b1.x, a1.y - b1.y);
      const m0 = { x: (a0.x + b0.x) / 2, y: (a0.y + b0.y) / 2 };
      const m1 = { x: (a1.x + b1.x) / 2, y: (a1.y + b1.y) / 2 };
      const k = clampK(s.view.k * (d1 / d0));
      const wx = (m0.x - s.view.x) / s.view.k;
      const wy = (m0.y - s.view.y) / s.view.k;
      set({ k, x: m1.x - wx * k, y: m1.y - wy * k });
    }
  };
  const onPointerUp = (e: PointerEvent) => {
    pointers.current.delete(e.pointerId);
    snapshot();
  };

  const tap = (id: string | null) => {
    if (dragged.current) return;
    onSelect(id);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const v = viewRef.current;
    const step = 80;
    const { w, h } = size();
    if (e.key === "+" || e.key === "=") zoomAt(w / 2, h / 2, 1.25, true);
    else if (e.key === "-" || e.key === "_") zoomAt(w / 2, h / 2, 0.8, true);
    else if (e.key === "ArrowLeft") set({ ...v, x: v.x + step }, true);
    else if (e.key === "ArrowRight") set({ ...v, x: v.x - step }, true);
    else if (e.key === "ArrowUp") set({ ...v, y: v.y + step }, true);
    else if (e.key === "ArrowDown") set({ ...v, y: v.y - step }, true);
    else if (e.key === "Escape") onSelect(null);
    else return;
    e.preventDefault();
  };

  const passport = usePassport();
  const onLine = (st: Station) => !highlight || st.lines.includes(highlight);
  const orderedLines = [...layout.lines].sort((a, b) => (a.subject === highlight ? 1 : 0) - (b.subject === highlight ? 1 : 0));

  return (
    <svg
      ref={svgRef}
      className="h-full w-full cursor-grab touch-none select-none outline-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={() => tap(null)}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="application"
      aria-label="Metro map of every piece. Drag to pan, scroll or pinch to zoom, Tab to move between stations."
    >
      <g
        style={{
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
          transformOrigin: "0 0",
          transition: animate ? "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
        }}
        onTransitionEnd={() => setAnimate(false)}
      >
        {/* Learning direction */}
        <g opacity={0.55}>
          <line x1={110} x2={layout.width - 90} y1={layout.height - 46} y2={layout.height - 46} stroke="rgb(var(--muted))" strokeWidth={1.5} strokeDasharray="2 6" strokeLinecap="round" />
          <text x={110} y={layout.height - 22} className="fill-muted font-sans text-[13px] font-semibold uppercase tracking-[0.12em]">
            Start here
          </text>
          <text x={layout.width - 90} y={layout.height - 22} textAnchor="end" className="fill-muted font-sans text-[13px] font-semibold uppercase tracking-[0.12em]">
            Go deeper →
          </text>
        </g>

        {/* Lines */}
        {orderedLines.map((line) => {
          const dim = highlight && highlight !== line.subject;
          return (
            <g key={line.subject} style={{ opacity: dim ? 0.12 : 1, transition: "opacity 0.35s" }}>
              <motion.path
                d={line.path}
                fill="none"
                stroke={subjectColor(line.subject)}
                strokeWidth={9}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
              <g transform={`translate(${line.tag.x}, ${line.tag.y})`}>
                <rect
                  x={-(line.subject.length * 8.2 + 26) / 2}
                  y={-15}
                  width={line.subject.length * 8.2 + 26}
                  height={30}
                  rx={15}
                  fill={subjectColor(line.subject)}
                />
                <text textAnchor="middle" y={5} className="font-sans text-[13px] font-bold" fill={subjectInk(line.subject)}>
                  {line.subject}
                </text>
              </g>
            </g>
          );
        })}

        {/* Stations */}
        {layout.stations.map((st) => {
          const active = onLine(st);
          const selected = selectedId === st.piece.id;
          const r = stationRadius(st.interchange);
          const label = st.label;
          const status = pieceStatus(st.piece, passport);
          const done = status === "finished";
          return (
            <g key={st.piece.id} transform={`translate(${st.x}, ${st.y})`} style={{ opacity: active ? 1 : 0.22, transition: "opacity 0.35s" }}>
            <motion.g
              className="cursor-pointer outline-none [&:focus-visible_.focus-ring]:opacity-100"
              role="button"
              tabIndex={0}
              aria-label={`${st.piece.title}. ${st.piece.format}. ${st.interchange ? `Interchange: ${st.lines.join(" and ")}.` : `${st.lines[0]} line.`}${done ? " Stamped." : status === "new" ? " New." : ""}`}
              aria-pressed={selected}
              onClick={(e) => {
                e.stopPropagation();
                tap(st.piece.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect(st.piece.id);
                }
              }}
              initial="rest"
              animate={selected ? "selected" : "rest"}
              whileHover="hover"
              whileTap="tap"
            >
              <circle r={28} fill="transparent" />
              <circle className="focus-ring" r={r + 9} fill="none" stroke="rgb(var(--accent))" strokeWidth={3} opacity={0} />
              {selected && !reduce && (
                <motion.circle
                  r={r}
                  fill="none"
                  stroke={subjectColor(st.lines[0])}
                  strokeWidth={3}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2.6, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
                />
              )}
              <motion.g
                variants={{
                  rest: { scale: 1 },
                  hover: { scale: 1.3 },
                  tap: { scale: 0.9 },
                  selected: { scale: 1.35 },
                }}
                transition={{ type: "spring", damping: 14, stiffness: 400 }}
              >
                {done ? (
                  <>
                    <circle
                      r={r + (st.interchange ? 0 : 2)}
                      fill={st.interchange ? "rgb(var(--ink))" : subjectColor(st.lines[0])}
                      stroke={st.interchange ? "rgb(var(--ink))" : subjectColor(st.lines[0])}
                      strokeWidth={st.interchange ? 4 : 2.5}
                    />
                    <path
                      d={st.interchange ? "M-5.5 0.5 L-1.5 4.5 L5.5 -3.5" : "M-4 0.5 L-1 3.5 L4.5 -2.5"}
                      fill="none"
                      stroke={st.interchange ? "rgb(var(--card))" : subjectInk(st.lines[0])}
                      strokeWidth={2.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ) : st.interchange ? (
                  <>
                    <circle r={r} fill="rgb(var(--card))" stroke="rgb(var(--ink))" strokeWidth={4} />
                    {st.lines.map((s, i) => (
                      <circle
                        key={s}
                        r={2.6}
                        cx={(i - (st.lines.length - 1) / 2) * 6}
                        fill={subjectColor(s)}
                      />
                    ))}
                  </>
                ) : (
                  <circle r={r} fill="rgb(var(--card))" stroke={subjectColor(st.lines[0])} strokeWidth={4.5} />
                )}
              </motion.g>
              {status === "new" && (
                <g transform={`translate(${r + 2}, ${st.labelAbove ? r - 2 : -r - 18})`} className="pointer-events-none">
                  <rect width={36} height={17} rx={8.5} fill="rgb(var(--accent))" />
                  <text x={18} y={12.5} textAnchor="middle" fill="rgb(var(--card))" className="font-sans text-[10px] font-bold tracking-wider">
                    NEW
                  </text>
                </g>
              )}
              <g transform={`translate(0, ${labelOffset(st)})`}>
                <FormatIcon format={st.piece.format} x={-8} y={0} size={16} strokeWidth={2.2} color="rgb(var(--muted))" />
                <text
                  textAnchor="middle"
                  className="fill-ink font-display font-semibold"
                  fontSize={LABEL.fontSize}
                  style={{ paintOrder: "stroke", stroke: "rgb(var(--paper))", strokeWidth: 5, strokeLinejoin: "round" }}
                >
                  {label.map((l, i) => (
                    <tspan key={i} x={0} y={LABEL.firstBaseline + i * LABEL.lineHeight}>
                      {l}
                    </tspan>
                  ))}
                </text>
              </g>
            </motion.g>
            </g>
          );
        })}
      </g>
    </svg>
  );
});
