import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Maximize2, Minus, Plus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { DifficultyMeter, FormatIcon, FormatTag, PlaceholderTag, ReadingTime, StatusBadge, SubjectBadge } from "../components/Badges";
import { pieceStatus, usePassport } from "../lib/progress";
import { MetroMap, type MetroMapHandle } from "../components/MetroMap";
import type { Subject } from "../content/types";
import { allPieces, getPiece, readingTime } from "../lib/content";
import { useIsDesktop } from "../lib/hooks";
import { buildMetroLayout } from "../lib/metroLayout";
import { subjectColor, subjectGradient } from "../lib/subjects";

export default function MapPage() {
  const layout = useMemo(() => buildMetroLayout(allPieces), []);
  const [params, setParams] = useSearchParams();
  const focus = params.get("focus");
  const [selectedId, setSelectedId] = useState<string | null>(getPiece(focus ?? undefined) ? focus : null);
  const [highlight, setHighlight] = useState<Subject | null>(null);
  const mapRef = useRef<MetroMapHandle>(null);
  const passport = usePassport();
  const isDesktop = useIsDesktop();
  const selected = getPiece(selectedId ?? undefined);
  const insets = useMemo(
    () => ({ top: isDesktop ? 90 : 120, bottom: isDesktop ? 40 : selectedId ? 360 : 20 }),
    [isDesktop, selectedId],
  );

  // First view: fit everything, or fly to the piece we came from.
  useEffect(() => {
    const t = setTimeout(() => {
      if (selectedId) mapRef.current?.centerOn(selectedId);
      else mapRef.current?.fit();
    }, 30);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  // Arriving via "Find it on the map" while the map is already open.
  useEffect(() => {
    if (focus && focus !== selectedId && getPiece(focus)) {
      setSelectedId(focus);
      setTimeout(() => mapRef.current?.centerOn(focus), 30);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  const select = (id: string | null) => {
    setSelectedId(id);
    setParams(id ? { focus: id } : {}, { replace: true });
    // On phones the preview covers the bottom of the map, so glide the station into view.
    if (id && !isDesktop) setTimeout(() => mapRef.current?.centerOn(id), 30);
  };

  const toggleLine = (s: Subject | null) => setHighlight((h) => (h === s ? null : s));

  return (
    <div className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] top-0 overflow-hidden md:bottom-0 md:top-[var(--topnav-h)]">
      <MetroMap ref={mapRef} layout={layout} highlight={highlight} selectedId={selectedId} onSelect={select} insets={insets} />

      {/* Legend */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-paper via-paper/85 to-transparent pb-6 pt-[env(safe-area-inset-top)] md:bg-none">
        <div className="pointer-events-auto md:m-4 md:inline-block md:max-w-[calc(100%-2rem)] md:rounded-3xl md:border md:border-rule md:bg-card/90 md:p-2 md:shadow-soft md:backdrop-blur">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-3 pt-2.5 md:px-1 md:pt-0" role="toolbar" aria-label="Highlight a line">
            <LegendChip active={highlight === null} onClick={() => setHighlight(null)} label="All lines" />
            {layout.lines.map((l) => (
              <LegendChip key={l.subject} active={highlight === l.subject} onClick={() => toggleLine(l.subject)} label={l.subject} color={subjectColor(l.subject)} />
            ))}
          </div>
          <div className="no-scrollbar flex items-center gap-4 overflow-x-auto px-4 pt-1.5 font-sans text-[0.72rem] font-medium text-muted md:px-3 md:pb-1">
            {(["Story", "Explainer", "News breakdown"] as const).map((f) => (
              <span key={f} className="flex shrink-0 items-center gap-1">
                <FormatIcon format={f} size={13} strokeWidth={2.3} /> {f}
              </span>
            ))}
            <span className="flex shrink-0 items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <circle cx="8" cy="8" r="6" fill="rgb(var(--card))" stroke="rgb(var(--ink))" strokeWidth="2.5" />
              </svg>
              Interchange
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <circle cx="8" cy="8" r="7" fill="rgb(var(--ink))" />
                <path d="M4.8 8.3 L7 10.5 L11.2 6" fill="none" stroke="rgb(var(--card))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Stamped
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              <span className="rounded-full bg-accent px-1.5 text-[0.6rem] font-bold tracking-wider text-card">NEW</span>
              Not read yet
            </span>
            <span className="shrink-0">Left → right: easiest first</span>
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className={`absolute bottom-4 right-3 flex-col overflow-hidden rounded-2xl border border-rule bg-card/95 shadow-soft backdrop-blur md:bottom-6 md:right-5 ${selected && !isDesktop ? "hidden" : "flex"}`}>
        <ZoomButton label="Zoom in" onClick={() => mapRef.current?.zoomBy(1.3)}>
          <Plus size={18} />
        </ZoomButton>
        <ZoomButton label="Zoom out" onClick={() => mapRef.current?.zoomBy(1 / 1.3)}>
          <Minus size={18} />
        </ZoomButton>
        <ZoomButton label="Fit whole map" onClick={() => mapRef.current?.fit()}>
          <Maximize2 size={16} />
        </ZoomButton>
      </div>

      {/* Station preview */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            role="dialog"
            aria-label={`Preview: ${selected.title}`}
            className="absolute inset-x-3 bottom-3 rounded-[26px] border border-rule bg-card p-5 shadow-lift md:inset-x-auto md:bottom-6 md:left-6 md:w-[400px]"
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
          >
            <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-[26px]" style={{ background: subjectGradient(selected.subject) }} />
            <button
              onClick={() => select(null)}
              className="absolute right-2 top-2.5 grid h-11 w-11 place-items-center rounded-full text-muted hover:bg-ink/5"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
            <div className="flex flex-wrap items-center gap-1.5 pr-10">
              {selected.subject.map((s) => (
                <SubjectBadge key={s} subject={s} size="sm" />
              ))}
              <StatusBadge status={pieceStatus(selected, passport)} />
              {selected.placeholder && <PlaceholderTag />}
            </div>
            <h2 className="mt-2.5 font-display text-[1.4rem] font-semibold leading-tight">{selected.title}</h2>
            <p className="mt-1.5 line-clamp-3 font-serif leading-relaxed text-ink/80">{selected.blurb}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <FormatTag format={selected.format} />
              <ReadingTime minutes={readingTime(selected)} />
              <DifficultyMeter level={selected.difficulty} />
            </div>
            <Link
              to={`/piece/${selected.id}`}
              className="mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-ink font-sans text-sm font-semibold text-card transition hover:opacity-90"
            >
              Read <ArrowRight size={17} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LegendChip({ active, onClick, label, color }: { active: boolean; onClick: () => void; label: string; color?: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-11 shrink-0 items-center gap-2 rounded-full px-3.5 font-sans text-sm font-semibold transition ${
        active ? "bg-ink text-card" : "bg-card/90 text-ink shadow-[inset_0_0_0_1px_rgb(var(--rule))] hover:bg-ink/5 md:bg-transparent md:shadow-none"
      }`}
    >
      {color && <span className="h-1.5 w-5 rounded-full" style={{ background: color }} aria-hidden />}
      {label}
    </button>
  );
}

function ZoomButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} className="grid h-11 w-11 place-items-center text-ink transition hover:bg-ink/5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-rule">
      {children}
    </button>
  );
}
