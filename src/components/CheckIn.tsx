import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, RotateCcw, Sparkles, X } from "lucide-react";
import { useState } from "react";
import type { Piece } from "../content/types";

const LETTERS = "ABCDEFGH";
const CHEERS = ["You got it!", "Spot on!", "Exactly right!"];
const NUDGES = ["Not quite, and that's a really common way to see it.", "Close! Here's the missing piece.", "Good thinking. Here's the twist."];

function Burst() {
  // A small, satisfying pop of colour around the correct answer.
  const colors = ["finance", "economics", "philosophy", "law", "sustainability", "tech"];
  return (
    <span className="pointer-events-none absolute left-7 top-1/2" aria-hidden>
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const dist = 38 + (i % 3) * 14;
        return (
          <motion.span
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{ background: `rgb(var(--s-${colors[i % colors.length]}))` }}
            initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: 1, opacity: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          />
        );
      })}
    </span>
  );
}

export function CheckIn({ piece, onAnswer }: { piece: Piece; onAnswer?: () => void }) {
  const { question, options } = piece.checkIn;
  const [picked, setPicked] = useState<number | null>(null);
  const [tried, setTried] = useState<Set<number>>(new Set());
  const reduce = useReducedMotion();
  const solved = picked !== null && options[picked].isCorrect;
  const tries = tried.size;

  const pick = (i: number) => {
    if (solved) return;
    setPicked(i);
    onAnswer?.();
    setTried((t) => new Set(t).add(i));
  };
  const reset = () => {
    setPicked(null);
    setTried(new Set());
  };

  return (
    <section className="rounded-[28px] border border-rule bg-card p-5 shadow-soft md:p-8" aria-labelledby="checkin-q">
      <div className="label mb-3 flex items-center gap-2 text-muted">
        <Sparkles size={14} /> Quick check-in
      </div>
      <h2 id="checkin-q" className="font-display text-[1.45rem] font-semibold leading-snug md:text-[1.7rem]">
        {question}
      </h2>
      <p className="mt-1.5 font-sans text-sm text-muted">No pressure. Pick what feels right; every answer explains itself.</p>

      <ul className="mt-5 space-y-2.5">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const wasTried = tried.has(i) && !isPicked;
          const state = isPicked ? (opt.isCorrect ? "right" : "wrong") : wasTried ? "tried" : solved ? "idle-done" : "idle";
          return (
            <li key={i} className="relative">
              <motion.button
                onClick={() => pick(i)}
                disabled={solved && !isPicked}
                aria-pressed={isPicked}
                animate={state === "wrong" && !reduce ? { x: [0, -7, 7, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={state === "idle" ? { y: -2 } : undefined}
                whileTap={state === "idle" || state === "tried" ? { scale: 0.98 } : undefined}
                className={`relative flex min-h-[3.25rem] w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-serif text-[1.02rem] leading-snug transition-colors ${
                  state === "right"
                    ? "border-[rgb(var(--s-sustainability))] bg-[rgb(var(--s-sustainability)/0.12)]"
                    : state === "wrong"
                      ? "border-accent/70 bg-accent/[0.08]"
                      : state === "tried"
                        ? "border-rule bg-ink/[0.03] text-muted"
                        : state === "idle-done"
                          ? "border-rule opacity-60"
                          : "border-rule bg-paper/60 hover:border-ink/40"
                }`}
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-sans text-sm font-bold ${
                    state === "right"
                      ? "bg-[rgb(var(--s-sustainability))] text-white dark:text-[#10220f]"
                      : state === "wrong"
                        ? "bg-accent text-white dark:text-[#2a140b]"
                        : "bg-ink/[0.07] text-ink"
                  }`}
                >
                  {state === "right" ? <Check size={17} strokeWidth={3} /> : state === "wrong" || state === "tried" ? <X size={16} strokeWidth={3} /> : LETTERS[i]}
                </span>
                <span>{opt.text}</span>
              </motion.button>
              {state === "right" && !reduce && <Burst />}
            </li>
          );
        })}
      </ul>

      <div aria-live="polite">
        <AnimatePresence mode="wait">
          {picked !== null && (
            <motion.div
              key={picked}
              initial={{ opacity: 0, y: 12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="overflow-hidden"
            >
              <div
                className={`mt-5 rounded-2xl p-4 md:p-5 ${
                  solved ? "bg-[rgb(var(--s-sustainability)/0.12)]" : "bg-accent/[0.08]"
                }`}
              >
                <div className="font-display text-lg font-semibold">
                  {solved ? CHEERS[(tries - 1) % CHEERS.length] : NUDGES[(tries - 1) % NUDGES.length]}
                </div>
                <p className="mt-1 font-serif leading-relaxed">{options[picked].explanation}</p>
                {!solved && <p className="mt-2 font-sans text-sm font-medium text-muted">Have another go; pick a different answer.</p>}
                {solved && (
                  <button
                    onClick={reset}
                    className="mt-3 inline-flex h-11 items-center gap-2 rounded-full px-3 -ml-3 font-sans text-sm font-semibold text-muted transition hover:bg-ink/5 hover:text-ink"
                  >
                    <RotateCcw size={16} /> Try it again
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
