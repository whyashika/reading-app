import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Map as MapIcon, Route as RouteIcon, Sparkles, Wand2 } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FormatIcon, StatusBadge } from "../components/Badges";
import { getPiece, readingTime } from "../lib/content";
import { pieceStatus, usePassport } from "../lib/progress";
import { aiPlannerEnabled, loadRoute, planRoute, saveRoute, type Route } from "../lib/routePlanner";
import { subjectColor, subjectGradient } from "../lib/subjects";

const EXAMPLES = [
  "I'm about to invest my first salary",
  "I want to follow budget news",
  "I keep hearing about AI and want the basics",
  "What am I agreeing to when I tap 'Accept'?",
  "I want to understand India's past",
];

export default function RoutePlanner() {
  const [goal, setGoal] = useState("");
  const [route, setRoute] = useState<Route | null>(() => loadRoute());
  const [busy, setBusy] = useState(false);
  const [justPlanned, setJustPlanned] = useState(false);

  const plan = async (text: string) => {
    const g = text.trim();
    if (!g || busy) return;
    setGoal(g);
    setBusy(true);
    try {
      const r = await planRoute(g);
      setRoute(r);
      saveRoute(r);
      setJustPlanned(true);
    } finally {
      setBusy(false);
    }
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    plan(goal);
  };

  return (
    <div className="pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+2rem)] md:pb-16 md:pt-[var(--topnav-h)]">
      <div className="mx-auto max-w-[720px] px-4 md:px-6">
        <header className="pb-6 pt-8 md:pt-12">
          <div className="label flex items-center gap-2 text-muted">
            <RouteIcon size={14} /> Route planner
          </div>
          <h1 className="mt-2 font-display text-[2.3rem] font-semibold leading-[1.05] tracking-tight md:text-[3rem]">Where are you trying to get to?</h1>
          <p className="mt-3 max-w-[56ch] font-serif text-lg leading-relaxed text-ink/75">
            Tell us what you want to understand, in your own words. We'll plot a short route through the stations, easiest first.
          </p>
        </header>

        <form onSubmit={submit} className="rounded-3xl border border-rule bg-card p-3 shadow-soft focus-within:ring-2 focus-within:ring-ink/20">
          <label htmlFor="goal" className="sr-only">
            Your goal
          </label>
          <textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value.slice(0, 300))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                plan(goal);
              }
            }}
            rows={2}
            placeholder="e.g. I'm about to invest my first salary"
            className="w-full resize-none bg-transparent px-2 py-1.5 font-serif text-lg leading-relaxed outline-none placeholder:text-muted/70"
          />
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="submit"
              disabled={!goal.trim() || busy}
              className="flex h-11 items-center gap-2 rounded-full bg-ink px-5 font-sans text-sm font-semibold text-card transition hover:opacity-90 disabled:opacity-40"
            >
              {busy ? (
                <>
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
                    <Wand2 size={16} />
                  </motion.span>
                  Plotting your route…
                </>
              ) : (
                <>
                  <RouteIcon size={16} /> Plan my route
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap gap-2" aria-label="Example goals">
          {EXAMPLES.map((ex, i) => (
            <button
              key={ex}
              onClick={() => plan(ex)}
              disabled={busy}
              className={`min-h-11 rounded-full border border-rule px-3.5 py-2 text-left font-sans text-sm text-ink/80 transition hover:border-ink/40 hover:bg-ink/5 disabled:opacity-50 ${i >= 3 ? "hidden sm:block" : ""}`}
            >
              {ex}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">{route && !busy && <RouteCard key={route.plannedAt} route={route} scrollTo={justPlanned} />}</AnimatePresence>
      </div>
    </div>
  );
}

function RouteCard({ route, scrollTo }: { route: Route; scrollTo: boolean }) {
  const passport = usePassport();
  const ref = useRef<HTMLElement>(null);
  // A freshly planned route lands below the fold on phones, so bring it into view.
  useEffect(() => {
    if (!scrollTo) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => ref.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), 150);
    return () => clearTimeout(t);
  }, [scrollTo]);
  const stops = route.stops.map((s) => ({ ...s, piece: getPiece(s.id)! }));
  const minutes = stops.reduce((n, s) => n + readingTime(s.piece), 0);
  const done = stops.filter((s) => passport.finished[s.id]).length;
  const next = stops.find((s) => !passport.finished[s.id]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", damping: 26, stiffness: 240 }}
      className="mt-10 scroll-mt-6 md:scroll-mt-[calc(var(--topnav-h)+1.5rem)]"
      aria-label="Your route"
    >
      <div className="label text-muted">Your route</div>
      <h2 className="mt-1 font-display text-2xl font-semibold leading-snug">"{route.goal}"</h2>
      <p className="mt-2 font-serif text-lg leading-relaxed text-ink/80">{route.intro}</p>
      <p className="mt-1 font-sans text-sm text-muted">
        {stops.length} {stops.length === 1 ? "stop" : "stops"} · about {minutes} min of reading{done > 0 && ` · ${done} already stamped`}
      </p>

      <ol className="relative mt-6">
        {stops.map((s, i) => {
          const status = pieceStatus(s.piece, passport);
          const stamped = status === "finished";
          const color = subjectColor(s.piece.subject[0]);
          const last = i === stops.length - 1;
          return (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i + 0.1 }}
              className="relative flex gap-4 pb-5"
            >
              {/* The line between stops, coloured from this stop into the next */}
              {!last && (
                <span
                  className="absolute left-[17px] top-9 bottom-0 w-[6px] rounded-full"
                  style={{ background: subjectGradient([s.piece.subject[0], stops[i + 1].piece.subject[0]]).replace("90deg", "180deg") }}
                  aria-hidden
                />
              )}
              <span
                className="relative z-10 mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border-[4px] font-sans text-sm font-bold"
                style={{ borderColor: color, background: stamped ? color : "rgb(var(--card))", color: stamped ? "rgb(29 23 18)" : "rgb(var(--ink))" }}
              >
                {stamped ? <Check size={18} strokeWidth={3} /> : i + 1}
              </span>
              <Link
                to={`/piece/${s.id}`}
                className="group min-w-0 flex-1 rounded-2xl border border-rule bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs font-semibold text-muted">
                  <span className="flex items-center gap-1">
                    <FormatIcon format={s.piece.format} size={13} /> {s.piece.format}
                  </span>
                  <span>{readingTime(s.piece)} min</span>
                  <span style={{ color }}>{s.piece.subject.join(" × ")}</span>
                  <StatusBadge status={status} />
                </div>
                <div className="mt-1 font-display text-lg font-semibold leading-snug">{s.piece.title}</div>
                <p className="mt-1 font-serif leading-relaxed text-ink/75">{s.why}</p>
              </Link>
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        {next ? (
          <Link
            to={`/piece/${next.id}`}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink font-sans text-sm font-semibold text-card transition hover:opacity-90"
          >
            {done === 0 ? "Start at stop 1" : `Continue at stop ${stops.indexOf(next) + 1}`} <ArrowRight size={18} />
          </Link>
        ) : (
          <div className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink/[0.06] font-sans text-sm font-semibold">
            <Check size={18} /> Route complete. Every stop is stamped.
          </div>
        )}
        <Link
          to="/map"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-ink/80 font-sans text-sm font-semibold transition hover:bg-ink/5"
        >
          <MapIcon size={18} /> See the full map
        </Link>
      </div>

      <p className="mt-4 flex items-center gap-1.5 font-sans text-xs text-muted">
        {route.source === "ai" ? (
          <>
            <Sparkles size={13} /> Planned by AI from {stops.length === 1 ? "this station" : "these stations"}. The pieces themselves are written by a person.
          </>
        ) : (
          <>Matched from each piece's subjects and themes.{aiPlannerEnabled ? " (The AI planner couldn't be reached just now.)" : ""}</>
        )}
      </p>
    </motion.section>
  );
}
