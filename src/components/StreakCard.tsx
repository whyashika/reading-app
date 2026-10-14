import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useStreak } from "../lib/progress";

const DAY_LETTER = ["S", "M", "T", "W", "T", "F", "S"];

/** The reading streak: days in a row with at least one piece finished. */
export function StreakCard() {
  const { current, best, readToday, week } = useStreak();
  const headline = current === 0 ? "No streak yet" : `${current}-day reading streak`;
  const sub =
    current === 0
      ? "Finish a piece today to start one. One piece a day keeps it going."
      : readToday
        ? "You've read today. Come back tomorrow to keep it going."
        : "Finish a piece today to keep it alive. Miss a whole day and it starts again.";
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-rule bg-card p-5 shadow-soft sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-4">
        <motion.div
          className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${current > 0 ? "bg-accent text-card" : "bg-ink/[0.06] text-muted"}`}
          initial={{ scale: 0.6, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 260 }}
        >
          <Flame size={28} strokeWidth={2.2} fill={current > 0 ? "currentColor" : "none"} />
        </motion.div>
        <div className="min-w-0">
          <div className="font-display text-xl font-semibold leading-tight">{headline}</div>
          <p className="mt-0.5 font-sans text-sm leading-snug text-muted">{sub}</p>
          {best > 1 && <p className="mt-1 font-sans text-xs font-semibold text-muted">Longest so far: {best} days</p>}
        </div>
      </div>
      <ol className="flex justify-between gap-1.5 sm:justify-end" aria-label="The last seven days">
        {week.map((d) => {
          const [y, m, dd] = d.day.split("-").map(Number);
          const letter = DAY_LETTER[new Date(y, m - 1, dd).getDay()];
          return (
            <li key={d.day} className="flex flex-col items-center gap-1" aria-label={`${d.isToday ? "Today" : d.day}: ${d.read ? "read" : "no reading"}`}>
              <span
                className={`grid h-8 w-8 place-items-center rounded-full font-sans text-xs font-bold ${
                  d.read ? "bg-accent text-card" : d.isToday ? "border-2 border-dashed border-accent/60 text-muted" : "bg-ink/[0.06] text-muted"
                }`}
              >
                {d.read ? <Flame size={14} fill="currentColor" /> : null}
              </span>
              <span className={`font-sans text-[11px] font-semibold ${d.isToday ? "text-ink" : "text-muted"}`}>{letter}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
