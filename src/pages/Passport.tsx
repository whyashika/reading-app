import { motion } from "framer-motion";
import { ArrowRight, Check, PartyPopper, Share2, Stamp } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { StatusBadge } from "../components/Badges";
import { PieceLinkCard } from "../components/PieceLinkCard";
import { APP_NAME } from "../config";
import type { Piece, Subject } from "../content/types";
import { allPieces, getPiece } from "../lib/content";
import { buildMetroLayout } from "../lib/metroLayout";
import { pieceStatus, resetPassport, usePassport } from "../lib/progress";
import { subjectColor } from "../lib/subjects";

export default function Passport() {
  const passport = usePassport();
  const lines = useMemo(
    () =>
      buildMetroLayout(allPieces).lines.map((l) => ({
        subject: l.subject,
        stations: l.stationIds.map((id) => getPiece(id)!),
      })),
    [],
  );
  const stamped = allPieces.filter((p) => passport.finished[p.id]).length;
  const fresh = allPieces.filter((p) => pieceStatus(p, passport) === "new");
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+2rem)] md:pb-16 md:pt-[var(--topnav-h)]">
      <div className="mx-auto max-w-[880px] px-4 md:px-6">
        <header className="pb-6 pt-8 md:pt-12">
          <div className="label flex items-center gap-2 text-muted">
            <Stamp size={14} /> Concept passport
          </div>
          <h1 className="mt-2 font-display text-[2.3rem] font-semibold leading-[1.05] tracking-tight md:text-[3rem]">
            {stamped === 0 ? "Your first stamp is one piece away" : `${stamped} of ${allPieces.length} stations stamped`}
          </h1>
          <p className="mt-3 max-w-[60ch] font-serif text-lg leading-relaxed text-ink/75">
            Finish a piece, or answer its check-in, and it gets stamped here. Ride a whole line and you'll know that subject's basics
            well enough to explain them to a friend.
          </p>
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-ink/[0.08]" role="progressbar" aria-valuemin={0} aria-valuemax={allPieces.length} aria-valuenow={stamped} aria-label="Pieces stamped">
            <motion.div
              className="h-full rounded-full bg-ink"
              initial={{ width: 0 }}
              animate={{ width: `${(stamped / allPieces.length) * 100}%` }}
              transition={{ type: "spring", damping: 24, stiffness: 120 }}
            />
          </div>
        </header>

        {fresh.length > 0 && (
          <section className="mt-4">
            <h2 className="label mb-3 flex items-center gap-2 text-muted">
              New for you <span className="rounded-full bg-accent px-1.5 text-card">{fresh.length}</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {fresh.map((p) => (
                <PieceLinkCard key={p.id} piece={p} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="label mb-3 text-muted">Your lines</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {lines.map((l) => (
              <LineCard key={l.subject} subject={l.subject} stations={l.stations} />
            ))}
          </div>
        </section>

        <footer className="mt-12 flex flex-wrap items-center gap-3 border-t border-rule pt-5 font-sans text-sm text-muted">
          <span>Your passport is saved on this device only.</span>
          {stamped + Object.keys(passport.opened).length > 0 &&
            (confirmReset ? (
              <span className="flex items-center gap-2">
                Clear every stamp?
                <button
                  onClick={() => {
                    resetPassport();
                    setConfirmReset(false);
                  }}
                  className="h-11 rounded-full bg-ink px-4 font-semibold text-card"
                >
                  Yes, clear
                </button>
                <button onClick={() => setConfirmReset(false)} className="h-11 rounded-full px-3 font-semibold hover:bg-ink/5">
                  Keep them
                </button>
              </span>
            ) : (
              <button onClick={() => setConfirmReset(true)} className="h-11 rounded-full px-3 font-semibold underline-offset-4 hover:underline">
                Start over
              </button>
            ))}
        </footer>
      </div>
    </div>
  );
}

function LineCard({ subject, stations }: { subject: Subject; stations: Piece[] }) {
  const passport = usePassport();
  const done = stations.filter((p) => passport.finished[p.id]).length;
  const complete = done === stations.length;
  const next = stations.find((p) => !passport.finished[p.id]);
  const color = subjectColor(subject);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-rule bg-card p-5 shadow-soft">
      {complete && (
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl" style={{ background: subjectColor(subject, 0.3) }} aria-hidden />
      )}
      <div className="relative flex items-center gap-3">
        <span className="rounded-full px-3 py-1 font-sans text-sm font-bold text-[#1d1712]" style={{ background: color }}>
          {subject}
        </span>
        <span className="ml-auto font-sans text-sm font-semibold tabular-nums text-muted">
          {done} of {stations.length} stamped
        </span>
      </div>

      {/* The line, station by station, easiest first */}
      <div className="relative mt-6 px-1">
        <div className="absolute left-[26px] right-[26px] top-1/2 h-[6px] -translate-y-1/2 rounded-full" style={{ background: subjectColor(subject, 0.35) }} aria-hidden />
        <motion.div
          className="absolute left-[26px] top-1/2 h-[6px] -translate-y-1/2 rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: stations.length > 1 ? `calc((100% - 52px) * ${Math.max(0, lastStampedIndex(stations, passport.finished)) / (stations.length - 1)})` : 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 120 }}
          aria-hidden
        />
        <ol className="relative flex justify-between">
          {stations.map((p) => {
            const status = pieceStatus(p, passport);
            const stampedHere = status === "finished";
            return (
              <li key={p.id}>
                <Link
                  to={`/piece/${p.id}`}
                  title={p.title}
                  aria-label={`${p.title}${stampedHere ? ", stamped" : status === "new" ? ", new" : ""}`}
                  className="relative grid h-11 w-11 place-items-center"
                >
                  <motion.span
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="grid h-8 w-8 place-items-center rounded-full border-[3.5px]"
                    style={{ borderColor: color, background: stampedHere ? color : "rgb(var(--card))" }}
                  >
                    {stampedHere && <Check size={16} strokeWidth={3.2} className="text-[#1d1712]" />}
                  </motion.span>
                  {status === "new" && <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-card" />}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="relative mt-5">
        {complete ? (
          <LineComplete subject={subject} />
        ) : (
          next && (
            <Link to={`/piece/${next.id}`} className="group flex min-h-11 items-center gap-3 rounded-2xl bg-ink/[0.04] px-4 py-3 transition hover:bg-ink/[0.07]">
              <span className="min-w-0 flex-1">
                <span className="label flex items-center gap-2 text-muted">
                  {done === 0 ? "Start here" : "Next stop"} <StatusBadge status={pieceStatus(next, passport)} />
                </span>
                <span className="mt-0.5 block font-display text-lg font-semibold leading-snug">{next.title}</span>
              </span>
              <ArrowRight size={18} className="shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-ink" />
            </Link>
          )
        )}
      </div>
    </div>
  );
}

function lastStampedIndex(stations: Piece[], finished: Record<string, string>) {
  let last = -1;
  stations.forEach((p, i) => finished[p.id] && (last = i));
  return last;
}

function LineComplete({ subject }: { subject: Subject }) {
  const [note, setNote] = useState<string | null>(null);
  const text = `I rode the whole ${subject} line on ${APP_NAME}. I can now explain the basics of ${subject.toLowerCase()} to a friend.`;
  const share = async () => {
    const url = window.location.href.split("#")[0];
    try {
      if (navigator.share) {
        await navigator.share({ title: `${subject} line complete`, text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setNote("Copied. Paste it anywhere.");
    } catch {
      setNote(null);
    }
  };
  return (
    <motion.div
      initial={{ scale: 0.92, rotate: -2, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 14, stiffness: 220 }}
      className="rounded-2xl border-2 border-dashed p-4"
      style={{ borderColor: subjectColor(subject) }}
    >
      <div className="flex items-center gap-2 font-display text-lg font-semibold">
        <PartyPopper size={20} style={{ color: subjectColor(subject) }} /> Line complete!
      </div>
      <p className="mt-1 font-serif leading-relaxed">You can now explain the basics of {subject.toLowerCase()} to a friend.</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button onClick={share} className="flex h-11 items-center gap-2 rounded-full bg-ink px-4 font-sans text-sm font-semibold text-card transition hover:opacity-90">
          <Share2 size={16} /> Share it
        </button>
        {note && <span className="font-sans text-sm text-muted">{note}</span>}
      </div>
    </motion.div>
  );
}
