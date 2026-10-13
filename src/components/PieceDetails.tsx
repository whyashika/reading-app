import { ArrowUpRight, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import type { Piece } from "../content/types";
import { prerequisites, readingTime } from "../lib/content";
import { subjectColor } from "../lib/subjects";
import { DifficultyMeter, FormatTag, HookBadge, ReadingTime, SubjectBadge } from "./Badges";

/** Everything about a piece except the piece itself. Fields a piece doesn't have are hidden. */
export function PieceDetails({ piece }: { piece: Piece }) {
  const prereqs = prerequisites(piece);
  return (
    <div className="space-y-5 font-sans">
      <div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {piece.subject.map((s) => (
            <SubjectBadge key={s} subject={s} />
          ))}
        </div>
        <h2 className="font-display text-2xl font-semibold leading-tight">{piece.title}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <FormatTag format={piece.format} />
          <ReadingTime minutes={readingTime(piece)} />
          <DifficultyMeter level={piece.difficulty} />
        </div>
      </div>

      <p className="font-serif text-[1.05rem] leading-relaxed">{piece.blurb}</p>

      {piece.series && (
        <div className="flex items-center gap-3 rounded-2xl bg-ink/[0.04] px-4 py-3">
          <Layers size={18} className="shrink-0 text-muted" aria-hidden />
          <div className="text-sm">
            <div className="font-semibold">{piece.series.name}</div>
            <div className="text-muted">
              Part {piece.series.part} of {piece.series.totalParts}
            </div>
          </div>
        </div>
      )}

      {piece.realWorldHook && (
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="label text-muted">Real-world hook</span>
            <HookBadge type={piece.realWorldHook.type} />
          </div>
          <p className="text-sm leading-relaxed">{piece.realWorldHook.text}</p>
        </div>
      )}

      {piece.themes.length > 0 && (
        <div>
          <div className="label mb-1.5 text-muted">Themes</div>
          <div className="flex flex-wrap gap-1.5">
            {piece.themes.map((t) => (
              <span key={t} className="rounded-full border border-rule px-2.5 py-1 text-xs font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {prereqs.length > 0 && (
        <div>
          <div className="label mb-1.5 text-muted">Read this first</div>
          <ul className="space-y-1">
            {prereqs.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/piece/${p.id}`}
                  className="group flex min-h-11 items-center gap-2 rounded-xl px-2 -mx-2 text-sm font-medium hover:bg-ink/5"
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: subjectColor(p.subject[0]) }} />
                  <span className="font-display text-base">{p.title}</span>
                  <ArrowUpRight size={16} className="ml-auto shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
