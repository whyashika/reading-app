import { Flame } from "lucide-react";
import { useStreak } from "../lib/progress";

const DAY_LETTER = ["S", "M", "T", "W", "T", "F", "S"];

/** The reading streak, kept to one compact row: days in a row with at least one piece finished. */
export function StreakCard() {
  const { current, best, readToday, week } = useStreak();
  const sub =
    current === 0 ? "Finish a piece to start" : readToday ? "Done for today" : "Read one today to keep it";
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-rule bg-card px-4 py-3">
      <Flame size={22} className={current > 0 ? "shrink-0 text-accent" : "shrink-0 text-muted"} fill={current > 0 ? "currentColor" : "none"} />
      <div className="min-w-0 flex-1">
        <div className="font-sans text-[0.95rem] font-bold leading-tight">
          {current > 0 ? `${current}-day streak` : "No streak yet"}
          {best > current && <span className="font-medium text-muted"> · best {best}</span>}
        </div>
        <div className="truncate font-sans text-xs text-muted">{sub}</div>
      </div>
      <ol className="flex shrink-0 gap-1" aria-label="The last seven days">
        {week.map((d) => {
          const [y, m, dd] = d.day.split("-").map(Number);
          const letter = DAY_LETTER[new Date(y, m - 1, dd).getDay()];
          return (
            <li key={d.day} className="flex flex-col items-center gap-0.5" aria-label={`${d.isToday ? "Today" : d.day}: ${d.read ? "read" : "no reading"}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${d.read ? "bg-accent" : d.isToday ? "ring-[1.5px] ring-inset ring-accent/60" : "bg-ink/10"}`} />
              <span className={`font-sans text-[10px] font-semibold ${d.isToday ? "text-ink" : "text-muted"}`}>{letter}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
