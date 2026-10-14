import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Footprints, Layers, Map as MapIcon, Stamp } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { DifficultyMeter, FormatTag, HookBadge, PlaceholderTag, ReadingTime, SubjectBadge } from "../components/Badges";
import { CheckIn } from "../components/CheckIn";
import { PieceLinkCard } from "../components/PieceLinkCard";
import { getPiece, nextInSeries, prerequisites, readingTime, relatedPieces } from "../lib/content";
import { Markdown } from "../lib/markdown";
import { markFinished, markOpened } from "../lib/progress";
import { subjectColor, subjectGradient, subjectInk } from "../lib/subjects";

export default function Reader() {
  const { id } = useParams();
  const piece = getPiece(id);
  const navigate = useNavigate();
  const location = useLocation();

  const endRef = useRef<HTMLDivElement>(null);
  const [justStamped, setJustStamped] = useState(false);
  const stamp = () => {
    if (piece && markFinished(piece.id)) {
      setJustStamped(true);
      setTimeout(() => setJustStamped(false), 3200);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setJustStamped(false);
    if (id && getPiece(id)) markOpened(id);
  }, [id]);

  // Reaching the end of the piece stamps it in the reader's passport.
  useEffect(() => {
    const el = endRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && stamp(), { threshold: 1 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!piece) {
    return (
      <div className="grid min-h-[70dvh] place-items-center p-8 text-center">
        <div>
          <p className="font-display text-2xl">This piece seems to have wandered off.</p>
          <Link to="/" className="mt-4 inline-flex h-11 items-center underline">
            Back to the feed
          </Link>
        </div>
      </div>
    );
  }

  const prereqs = prerequisites(piece);
  const next = nextInSeries(piece);
  const related = relatedPieces(piece);
  const main = piece.subject[0];
  // Go back if we came from inside the app, otherwise to the feed.
  const back = () => (location.key !== "default" ? navigate(-1) : navigate("/"));

  return (
    <motion.div
      key={piece.id}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 220 }}
      className="pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+2rem)] md:pb-16 md:pt-[var(--topnav-h)]"
      style={{ "--piece-color": subjectColor(main) } as CSSProperties}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-rule/60 bg-paper/85 backdrop-blur-md md:top-[var(--topnav-h)]">
        <div className="mx-auto flex h-14 max-w-[720px] items-center gap-2 px-3 md:px-6">
          <button onClick={back} className="-ml-1 flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition hover:bg-ink/5">
            <ArrowLeft size={18} /> Feed
          </button>
          <Link
            to={`/map?focus=${piece.id}`}
            className="ml-auto flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-muted transition hover:bg-ink/5 hover:text-ink"
          >
            <MapIcon size={18} /> On the map
          </Link>
        </div>
        <div className="h-1" style={{ background: subjectGradient(piece.subject) }} />
      </div>

      <article className="mx-auto max-w-[680px] px-5 md:px-6">
        <header className="pb-6 pt-8 md:pt-14">
          <div className="flex flex-wrap items-center gap-1.5">
            {piece.subject.map((s) => (
              <SubjectBadge key={s} subject={s} />
            ))}
            {piece.placeholder && <PlaceholderTag />}
          </div>
          {piece.series && (
            <div className="mt-4 flex items-center gap-2 font-sans text-sm font-semibold text-muted">
              <Layers size={16} /> {piece.series.name} · Part {piece.series.part} of {piece.series.totalParts}
            </div>
          )}
          <h1 className="mt-3 font-display text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-balance md:text-[3.4rem]">
            {piece.title}
          </h1>
          <p className="mt-4 font-serif text-lg italic leading-relaxed text-ink/75 md:text-xl">{piece.blurb}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-rule py-3">
            <FormatTag format={piece.format} />
            <ReadingTime minutes={readingTime(piece)} />
            <DifficultyMeter level={piece.difficulty} />
          </div>
          {piece.realWorldHook && (
            <div className="mt-4 flex items-start gap-2.5 font-sans text-sm leading-relaxed text-ink/80">
              <span className="mt-0.5 shrink-0"><HookBadge type={piece.realWorldHook.type} /></span>
              <span>{piece.realWorldHook.text}</span>
            </div>
          )}
        </header>

        {prereqs.length > 0 && (
          <motion.aside
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 rounded-3xl p-4 md:p-5"
            style={{ background: subjectColor(main, 0.1), boxShadow: `inset 0 0 0 1px ${subjectColor(main, 0.3)}` }}
          >
            <div className="flex items-center gap-2 font-sans text-sm font-semibold">
              <Footprints size={16} /> New to this? These might help first:
            </div>
            <div className="mt-2 flex flex-col gap-1">
              {prereqs.map((p) => (
                <Link
                  key={p.id}
                  to={`/piece/${p.id}`}
                  className="flex min-h-11 items-center gap-2 font-display text-lg underline decoration-2 underline-offset-4"
                  style={{ textDecorationColor: subjectColor(p.subject[0]) }}
                >
                  {p.title}
                </Link>
              ))}
            </div>
            <p className="mt-1 font-sans text-xs text-muted">Totally optional. This piece still works on its own.</p>
          </motion.aside>
        )}

        <Markdown body={piece.body} className="prose-literary drop-cap" />

        <div ref={endRef} className="my-12 text-center font-display text-2xl tracking-[0.5em] text-muted" aria-hidden>
          ⁂
        </div>

        <CheckIn piece={piece} onAnswer={stamp} />

        {next && (
          <section className="mt-12">
            <h2 className="label mb-3 text-muted">Next in the series</h2>
            <PieceLinkCard piece={next} big eyebrow={`${next.series!.name} · Part ${next.series!.part} of ${next.series!.totalParts}`} />
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="label mb-3 text-muted">If you liked this</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((p) => (
                <PieceLinkCard key={p.id} piece={p} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link to="/" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink font-sans text-sm font-semibold text-card transition hover:opacity-90">
            <ArrowLeft size={18} /> Back to the feed
          </Link>
          <Link
            to={`/map?focus=${piece.id}`}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-ink/80 font-sans text-sm font-semibold transition hover:bg-ink/5"
          >
            <MapIcon size={18} /> Find it on the map
          </Link>
        </div>
      </article>

      <AnimatePresence>
        {justStamped && (
          <motion.div
            role="status"
            className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+12px)] z-40 flex justify-center px-4 md:bottom-8"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <Link
              to="/passport"
              className="flex h-12 items-center gap-2.5 rounded-full bg-ink pl-2 pr-5 font-sans text-sm font-semibold text-card shadow-lift"
            >
              <motion.span
                className="grid h-9 w-9 place-items-center rounded-full"
                style={{ background: subjectColor(main), color: subjectInk(main) }}
                initial={{ rotate: -40, scale: 1.6 }}
                animate={{ rotate: -8, scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 260 }}
              >
                <Stamp size={18} strokeWidth={2.4} />
              </motion.span>
              Stamped in your passport
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
