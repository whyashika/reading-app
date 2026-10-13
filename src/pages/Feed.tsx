import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FeedCard } from "../components/FeedCard";
import { FilterChips } from "../components/FilterChips";
import { SUBJECTS, type Subject } from "../content/types";
import { allPieces } from "../lib/content";
import { useIsDesktop } from "../lib/hooks";

// Remembers where you were when you come back from reading a piece.
let lastSeenId: string | null = null;

export default function Feed() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("subject");
  const filter = SUBJECTS.includes(raw as Subject) ? (raw as Subject) : null;
  const items = useMemo(() => (filter ? allPieces.filter((p) => p.subject.includes(filter)) : allPieces), [filter]);

  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [infoId, setInfoId] = useState<string | null>(null);
  const isDesktop = useIsDesktop();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Restore position (or reset to top when the filter changes).
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const i = Math.max(0, items.findIndex((p) => p.id === lastSeenId));
    el.scrollTop = i * el.clientHeight;
    setIndex(i);
  }, [items]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const i = Math.round(el.scrollTop / el.clientHeight);
    if (i !== index) {
      setIndex(i);
      setInfoId(null);
    }
    if (items[i]) lastSeenId = items[i].id;
  };

  const goTo = useCallback(
    (i: number) => {
      const el = scroller.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(items.length - 1, i));
      el.scrollTo({ top: clamped * el.clientHeight, behavior: reduceMotion ? "auto" : "smooth" });
    },
    [items.length, reduceMotion],
  );

  // Arrow keys / j k / Page keys move between cards.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (infoId || (e.target as HTMLElement).closest("input, textarea, [role=dialog]")) return;
      if (["ArrowDown", "PageDown", "j"].includes(e.key)) {
        e.preventDefault();
        goTo(index + 1);
      } else if (["ArrowUp", "PageUp", "k"].includes(e.key)) {
        e.preventDefault();
        goTo(index - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index, infoId]);

  const setFilter = (s: Subject | null) => {
    lastSeenId = null;
    setInfoId(null);
    setParams(s ? { subject: s } : {}, { replace: true });
  };

  return (
    <div className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] top-0 md:bottom-0 md:top-[var(--topnav-h)]">
      <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-paper via-paper/90 to-transparent pb-3 pt-[env(safe-area-inset-top)]">
        <FilterChips value={filter} onChange={setFilter} />
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        className="no-scrollbar h-full snap-y snap-mandatory overflow-y-auto overscroll-contain"
        aria-label="Feed"
      >
        {items.map((piece, i) => (
          <section
            key={piece.id}
            className="flex h-full snap-start snap-always justify-center px-3.5 pb-3.5 pt-[calc(env(safe-area-inset-top)+4.25rem)] md:px-6 md:pb-8 md:pt-[4.5rem]"
            aria-label={`${i + 1} of ${items.length}: ${piece.title}`}
          >
            <div className="h-full w-full max-w-[640px]">
              <FeedCard
                piece={piece}
                active={i === index}
                isDesktop={isDesktop}
                infoOpen={infoId === piece.id}
                onInfo={(open) => setInfoId(open ? piece.id : null)}
                showSwipeHint={i === 0 && items.length > 1}
              />
            </div>
          </section>
        ))}
        {items.length === 0 && (
          <div className="grid h-full place-items-center p-8 text-center font-serif text-lg text-muted">
            Nothing here yet. Try another subject.
          </div>
        )}
      </div>

      {/* Desktop: position + up/down controls */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex lg:right-10">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="grid h-11 w-11 place-items-center rounded-full bg-card shadow-soft transition hover:-translate-y-0.5 disabled:opacity-30"
          aria-label="Previous piece"
        >
          <ChevronUp size={20} />
        </button>
        <div className="flex flex-col items-center gap-1.5 py-1" aria-hidden>
          {items.map((p, i) => (
            <span
              key={p.id}
              className={`w-1.5 rounded-full transition-all duration-300 ${i === index ? "h-5 bg-ink" : "h-1.5 bg-ink/20"}`}
            />
          ))}
        </div>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index >= items.length - 1}
          className="grid h-11 w-11 place-items-center rounded-full bg-card shadow-soft transition hover:translate-y-0.5 disabled:opacity-30"
          aria-label="Next piece"
        >
          <ChevronDown size={20} />
        </button>
        <span className="mt-1 font-sans text-xs font-semibold tabular-nums text-muted">
          {Math.min(index + 1, items.length)} / {items.length}
        </span>
      </div>
    </div>
  );
}
