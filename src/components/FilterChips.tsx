import { motion } from "framer-motion";
import type { Subject } from "../content/types";
import { subjectsInUse } from "../lib/content";
import { subjectColor } from "../lib/subjects";

export function FilterChips({ value, onChange }: { value: Subject | null; onChange: (s: Subject | null) => void }) {
  const options: (Subject | null)[] = [null, ...subjectsInUse];
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5 md:justify-center" role="toolbar" aria-label="Filter by subject">
      {options.map((s) => {
        const active = value === s;
        return (
          <button
            key={s ?? "all"}
            onClick={() => onChange(active ? null : s)}
            aria-pressed={active}
            className={`relative flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${
              active ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {active && (
              <motion.span
                layoutId="chip-active"
                className="absolute inset-0 rounded-full"
                style={{
                  background: s ? subjectColor(s, 0.18) : "rgb(var(--ink) / 0.08)",
                  boxShadow: `inset 0 0 0 1.5px ${s ? subjectColor(s, 0.6) : "rgb(var(--ink) / 0.25)"}`,
                }}
                transition={{ type: "spring", damping: 28, stiffness: 380 }}
              />
            )}
            {!active && <span className="absolute inset-0 rounded-full bg-card/80 shadow-[inset_0_0_0_1px_rgb(var(--rule))]" />}
            {s && <span className="relative h-2.5 w-2.5 rounded-full" style={{ background: subjectColor(s) }} aria-hidden />}
            <span className="relative">{s ?? "All"}</span>
          </button>
        );
      })}
    </div>
  );
}
