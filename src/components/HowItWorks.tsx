import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { APP_NAME } from "../config";
import { closeIntro, useIntroOpen } from "../lib/onboarding";

const C = {
  finance: "rgb(var(--s-finance))",
  economics: "rgb(var(--s-economics))",
  law: "rgb(var(--s-law))",
  culture: "rgb(var(--s-culture))",
};

function Station({ x, y, color, done }: { x: number; y: number; color: string; done?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="9" fill={done ? color : "rgb(var(--card))"} stroke={color} strokeWidth="4.5" />
      {done && <path d={`M${x - 4} ${y} l3 3 l5 -6`} fill="none" stroke="rgb(29 23 18)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />}
    </g>
  );
}

const STEPS: { title: string; body: ReactNode; art: ReactNode }[] = [
  {
    title: "Hard ideas, told simply",
    body: (
      <>
        {APP_NAME} is a small library of short pieces by one writer who found finance, law, tech and the rest hard to grasp too. Each one
        explains a single idea in a few minutes, tied to the real world.
      </>
    ),
    art: (
      <svg viewBox="0 0 220 120" className="h-full w-full" aria-hidden>
        <rect x="40" y="14" width="140" height="96" rx="16" fill="rgb(var(--card))" stroke="rgb(var(--rule))" strokeWidth="2" />
        <rect x="40" y="14" width="140" height="7" rx="3" fill={C.finance} />
        <rect x="58" y="38" width="90" height="10" rx="5" fill="rgb(var(--ink))" opacity=".85" />
        <rect x="58" y="54" width="70" height="10" rx="5" fill="rgb(var(--ink))" opacity=".85" />
        <rect x="58" y="76" width="104" height="5" rx="2.5" fill="rgb(var(--muted))" opacity=".5" />
        <rect x="58" y="88" width="84" height="5" rx="2.5" fill="rgb(var(--muted))" opacity=".5" />
      </svg>
    ),
  },
  {
    title: "Subjects are lines, pieces are stations",
    body: (
      <>
        On the Map, every subject is a metro line and every piece is a station, easiest on the left. Pieces that belong to two subjects are
        interchanges. Follow a line in order and each stop builds on the last.
      </>
    ),
    art: (
      <svg viewBox="0 0 220 120" className="h-full w-full" aria-hidden>
        <path d="M20 40 H90 L120 70 H200" fill="none" stroke={C.economics} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 90 H90 L120 70 H200" fill="none" stroke={C.finance} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <Station x={45} y={40} color={C.economics} />
        <Station x={45} y={90} color={C.finance} />
        <circle cx="120" cy="70" r="12" fill="rgb(var(--card))" stroke="rgb(var(--ink))" strokeWidth="4" />
        <Station x={175} y={70} color={C.finance} />
      </svg>
    ),
  },
  {
    title: "Read, then check in",
    body: (
      <>
        Each piece ends with one gentle question; every answer explains itself. Underlined words have quick definitions, and you can tap
        Listen to hear a piece read aloud.
      </>
    ),
    art: (
      <svg viewBox="0 0 220 120" className="h-full w-full" aria-hidden>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="40" y={18 + i * 32} width="140" height="24" rx="12" fill={i === 1 ? "rgb(var(--s-sustainability) / .18)" : "rgb(var(--card))"} stroke={i === 1 ? "rgb(var(--s-sustainability))" : "rgb(var(--rule))"} strokeWidth="2" />
            <rect x="56" y={27 + i * 32} width={i === 1 ? 80 : 64} height="6" rx="3" fill="rgb(var(--ink))" opacity=".6" />
          </g>
        ))}
        <circle cx="164" cy="62" r="7" fill="rgb(var(--s-sustainability))" />
      </svg>
    ),
  },
  {
    title: "Collect stamps in your passport",
    body: (
      <>
        Finish a piece and it's stamped in your Passport. Complete whole lines, keep a reading streak, or ask the route planner for a path
        toward something you want to understand. No sign-up: it all stays on this device.
      </>
    ),
    art: (
      <svg viewBox="0 0 220 120" className="h-full w-full" aria-hidden>
        <path d="M30 60 H190" stroke={C.culture} strokeWidth="7" strokeLinecap="round" />
        <Station x={50} y={60} color={C.culture} done />
        <Station x={110} y={60} color={C.culture} done />
        <Station x={170} y={60} color={C.culture} />
        <g transform="rotate(-10 150 30)">
          <circle cx="150" cy="30" r="20" fill="none" stroke={C.law} strokeWidth="3" />
          <circle cx="150" cy="30" r="14" fill="none" stroke={C.law} strokeWidth="1.5" />
        </g>
      </svg>
    ),
  },
];

/** "How it works": opens by itself on a first visit, and from the More menu / top nav any time after. */
export function HowItWorks() {
  const open = useIntroOpen();
  const [step, setStep] = useState(0);
  const last = step === STEPS.length - 1;

  useEffect(() => {
    if (!open) return;
    setStep(0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeIntro();
      if (e.key === "ArrowRight") setStep((s) => Math.min(s + 1, STEPS.length - 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const s = STEPS[step];
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-label="How it works">
          <motion.div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeIntro} />
          <motion.div
            className="relative w-full max-w-[440px] rounded-t-[30px] bg-paper px-6 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-4 shadow-lift md:rounded-[30px] md:pb-6"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <span className="label text-muted">How it works</span>
              <button onClick={closeIntro} className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-muted transition hover:bg-ink/5" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.2 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) setStep((v) => Math.min(v + 1, STEPS.length - 1));
                  if (info.offset.x > 60) setStep((v) => Math.max(v - 1, 0));
                }}
              >
                <div className="mx-auto mt-2 h-32 w-full max-w-[260px]">{s.art}</div>
                <h2 className="mt-4 font-display text-[1.6rem] font-semibold leading-tight">{s.title}</h2>
                <p className="mt-2 min-h-[7.5rem] font-serif text-[1.05rem] leading-relaxed text-ink/80">{s.body}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex flex-1 gap-1.5" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className="grid h-11 w-6 place-items-center"
                    aria-label={`Go to step ${i + 1}`}
                    aria-current={i === step}
                  >
                    <span className={`h-2 rounded-full transition-all ${i === step ? "w-5 bg-ink" : "w-2 bg-ink/20"}`} />
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-rule transition hover:bg-ink/5" aria-label="Back">
                  <ArrowLeft size={18} />
                </button>
              )}
              <button
                onClick={() => (last ? closeIntro() : setStep(step + 1))}
                className="flex h-12 items-center gap-2 rounded-full bg-ink px-5 font-sans text-sm font-semibold text-card transition hover:opacity-90"
              >
                {last ? "Start reading" : "Next"} <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
