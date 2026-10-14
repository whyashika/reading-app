import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { glossary, type GlossaryEntry } from "../content/glossary";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Every spelling → its entry, and one regex that finds any of them (longest first).
const BY_SPELLING = new Map<string, GlossaryEntry>();
for (const e of glossary) for (const s of [e.term, ...(e.aliases ?? [])]) BY_SPELLING.set(s.toLowerCase(), e);
const SPELLINGS = [...BY_SPELLING.keys()].sort((a, b) => b.length - a.length);
const PATTERN = SPELLINGS.length ? new RegExp(`(?<![\\p{L}\\p{N}-])(${SPELLINGS.map(escape).join("|")})(?![\\p{L}\\p{N}-])`, "giu") : null;

/**
 * Returns a function that wraps glossary terms in plain text. `seen` makes sure each
 * term is only marked the first time it appears in a piece.
 */
export function glossaryMarker(seen: Set<string>) {
  return (text: string, key: string): ReactNode => {
    if (!PATTERN) return text;
    const out: ReactNode[] = [];
    let last = 0;
    for (const m of text.matchAll(PATTERN)) {
      const entry = BY_SPELLING.get(m[0].toLowerCase());
      if (!entry || seen.has(entry.term)) continue;
      seen.add(entry.term);
      out.push(text.slice(last, m.index));
      out.push(<GlossaryTerm key={`${key}-${m.index}`} entry={entry} text={m[0]} />);
      last = m.index! + m[0].length;
    }
    if (!out.length) return text;
    out.push(text.slice(last));
    return <Fragment key={key}>{out}</Fragment>;
  };
}

function GlossaryTerm({ entry, text }: { entry: GlossaryEntry; text: string }) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${text}: show definition`}
        className="glossary-term"
      >
        {text}
      </button>
      {createPortal(
        <AnimatePresence>{open && <Definition entry={entry} anchor={btn.current!} onClose={() => setOpen(false)} />}</AnimatePresence>,
        document.body,
      )}
    </>
  );
}

function Definition({ entry, anchor, onClose }: { entry: GlossaryEntry; anchor: HTMLElement; onClose: () => void }) {
  const card = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean } | null>(null);

  useLayoutEffect(() => {
    const r = anchor.getBoundingClientRect();
    const h = card.current?.offsetHeight ?? 160;
    const w = Math.min(340, window.innerWidth - 32);
    const left = Math.min(Math.max(16, r.left + r.width / 2 - w / 2), window.innerWidth - w - 16);
    const above = r.bottom + h + 12 > window.innerHeight - 90 && r.top - h - 12 > 70;
    setPos({ top: above ? r.top - h - 10 : r.bottom + 10, left, above });
  }, [anchor]);

  useEffect(() => {
    const away = (e: PointerEvent) => {
      if (!card.current?.contains(e.target as Node) && !anchor.contains(e.target as Node)) onClose();
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && (onClose(), anchor.focus());
    const scroll = () => onClose();
    document.addEventListener("pointerdown", away);
    window.addEventListener("keydown", key);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", away);
      window.removeEventListener("keydown", key);
      window.removeEventListener("scroll", scroll);
    };
  }, [anchor, onClose]);

  return (
    <motion.div
      ref={card}
      role="dialog"
      aria-label={`Definition of ${entry.term}`}
      className="fixed z-50 w-[min(340px,calc(100vw-32px))] rounded-2xl border border-rule bg-card p-4 pr-11 shadow-lift"
      style={{ top: pos?.top ?? -9999, left: pos?.left ?? 0 }}
      initial={{ opacity: 0, y: pos?.above ? 6 : -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", damping: 26, stiffness: 380 }}
    >
      <div className="label flex items-center gap-1.5 text-muted">
        <BookOpen size={13} /> Glossary
      </div>
      <div className="mt-1 font-display text-lg font-semibold leading-snug">{entry.term}</div>
      <p className="mt-1 font-serif text-[0.98rem] leading-relaxed text-ink/85">{entry.definition}</p>
      <button
        onClick={() => {
          onClose();
          anchor.focus();
        }}
        className="absolute right-1.5 top-1.5 grid h-11 w-11 place-items-center rounded-full text-muted transition hover:bg-ink/5"
        aria-label="Close definition"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
}
