import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronsDown, Info } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { Piece } from "../content/types";
import { readingTime } from "../lib/content";
import { blocks, Markdown } from "../lib/markdown";
import { subjectColor, subjectGradient } from "../lib/subjects";
import { DifficultyMeter, FormatTag, PlaceholderTag, ReadingTime, SubjectBadge } from "./Badges";
import { BottomSheet } from "./BottomSheet";
import { PieceDetails } from "./PieceDetails";

export function FeedCard({
  piece,
  active,
  isDesktop,
  infoOpen,
  onInfo,
  showSwipeHint,
}: {
  piece: Piece;
  active: boolean;
  isDesktop: boolean;
  infoOpen: boolean;
  onInfo: (open: boolean) => void;
  showSwipeHint: boolean;
}) {
  const main = piece.subject[0];
  const excerpt = blocks(piece.body).slice(0, 5).join("\n\n");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Desktop popover: close on outside click or Escape.
  useEffect(() => {
    if (!infoOpen || !isDesktop) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!popoverRef.current?.contains(target) && !target.closest("[data-info-button]")) onInfo(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onInfo(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [infoOpen, isDesktop, onInfo]);

  return (
    <motion.article
      className="relative flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-card shadow-soft"
      style={{ "--piece-color": subjectColor(main) } as CSSProperties}
      animate={{ scale: active ? 1 : 0.94, opacity: active ? 1 : 0.55 }}
      transition={{ type: "spring", damping: 26, stiffness: 220 }}
      whileTap={{ scale: 0.985 }}
    >
      {/* Subject accent */}
      <div className="h-2 w-full shrink-0" style={{ background: subjectGradient(piece.subject) }} />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{ background: subjectColor(main, 0.22) }}
        aria-hidden
      />
      {piece.subject[1] && (
        <div
          className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full blur-3xl"
          style={{ background: subjectColor(piece.subject[1], 0.16) }}
          aria-hidden
        />
      )}

      {/* The whole card opens the piece */}
      <Link to={`/piece/${piece.id}`} className="absolute inset-0 z-0 rounded-[28px]" aria-label={`Read “${piece.title}”`} />

      <div className="pointer-events-none relative flex min-h-0 flex-1 flex-col px-6 pb-5 pt-5 md:px-9 md:pt-7">
        <div className="flex items-start gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            {piece.subject.map((s) => (
              <SubjectBadge key={s} subject={s} />
            ))}
            {piece.placeholder && <PlaceholderTag />}
          </div>
          <motion.button
            data-info-button
            onClick={() => onInfo(!infoOpen)}
            whileTap={{ scale: 0.88 }}
            className={`pointer-events-auto relative z-10 -mr-2 -mt-1.5 grid h-11 w-11 shrink-0 place-items-center rounded-full transition ${
              infoOpen ? "bg-ink text-card" : "bg-ink/[0.06] text-ink hover:bg-ink/10"
            }`}
            aria-label={`About this piece`}
            aria-expanded={infoOpen}
          >
            <Info size={20} />
          </motion.button>
        </div>

        <div className="mt-4">
          <FormatTag format={piece.format} />
        </div>
        <h2 className="mt-2 font-display text-[1.95rem] font-semibold leading-[1.08] tracking-tight text-balance md:text-[2.5rem]">
          {piece.title}
        </h2>

        <div className="fade-out relative mt-5 min-h-0 flex-1 overflow-hidden">
          <Markdown body={excerpt} className="prose-literary drop-cap text-ink/85" />
        </div>

        <div className="flex items-center gap-4 pt-3">
          <ReadingTime minutes={readingTime(piece)} />
          <DifficultyMeter level={piece.difficulty} showLabel={false} />
          <span className="ml-auto inline-flex h-11 items-center gap-2 rounded-full bg-ink pl-4 pr-1.5 text-sm font-semibold text-card shadow-soft">
            Read
            <span className="grid h-8 w-8 place-items-center rounded-full text-[#1d1712]" style={{ background: subjectColor(main) }}>
              <ArrowRight size={16} />
            </span>
          </span>
        </div>
        {showSwipeHint && !isDesktop && (
          <motion.div
            className="mt-2 flex items-center justify-center gap-1 text-xs font-medium text-muted"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          >
            <ChevronsDown size={14} className="rotate-180" /> Swipe up for the next piece
          </motion.div>
        )}
      </div>

      {/* Info: popover on desktop */}
      <AnimatePresence>
        {isDesktop && infoOpen && (
          <motion.div
            ref={popoverRef}
            role="dialog"
            aria-label="About this piece"
            className="absolute right-5 top-[4.6rem] z-20 max-h-[calc(100%-6rem)] w-[min(400px,calc(100%-2.5rem))] origin-top-right overflow-y-auto rounded-3xl border border-rule bg-card p-6 shadow-lift"
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ type: "spring", damping: 26, stiffness: 340 }}
          >
            <PieceDetails piece={piece} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Info: bottom sheet on mobile */}
      {!isDesktop && (
        <BottomSheet open={infoOpen} onClose={() => onInfo(false)} label="About this piece">
          <div className="pt-4">
            <PieceDetails piece={piece} />
          </div>
        </BottomSheet>
      )}
    </motion.article>
  );
}
