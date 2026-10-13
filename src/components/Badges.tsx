import { Clock, Lightbulb, Newspaper, Feather, type LucideProps } from "lucide-react";
import type { Difficulty, Format, Subject } from "../content/types";
import { DIFFICULTY_LABEL } from "../lib/content";
import { subjectColor } from "../lib/subjects";

export function SubjectBadge({ subject, size = "md" }: { subject: Subject; size?: "sm" | "md" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-sans font-semibold text-ink ${
        size === "sm" ? "px-2 py-0.5 text-[0.7rem]" : "px-2.5 py-1 text-xs"
      }`}
      style={{ background: subjectColor(subject, 0.16), boxShadow: `inset 0 0 0 1px ${subjectColor(subject, 0.35)}` }}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: subjectColor(subject) }} aria-hidden />
      {subject}
    </span>
  );
}

const FORMAT_ICON = { Story: Feather, Explainer: Lightbulb, "News breakdown": Newspaper } as const;

export function FormatIcon({ format, ...props }: { format: Format } & LucideProps) {
  const Icon = FORMAT_ICON[format];
  return <Icon aria-hidden {...props} />;
}

export function FormatTag({ format }: { format: Format }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
      <FormatIcon format={format} size={14} strokeWidth={2.2} />
      {format}
    </span>
  );
}

export function ReadingTime({ minutes }: { minutes: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
      <Clock size={14} strokeWidth={2.2} aria-hidden />
      {minutes} min read
    </span>
  );
}

export function DifficultyMeter({ level, showLabel = true }: { level: Difficulty; showLabel?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted" title={DIFFICULTY_LABEL[level]}>
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3].map((n) => (
          <span key={n} className={`h-2 w-2 rounded-full ${n <= level ? "bg-ink/70" : "bg-ink/15"}`} />
        ))}
      </span>
      {showLabel ? DIFFICULTY_LABEL[level] : <span className="sr-only">{DIFFICULTY_LABEL[level]}</span>}
    </span>
  );
}

export function PlaceholderTag() {
  return (
    <span className="rounded-md border border-dashed border-muted/60 px-1.5 py-0.5 font-sans text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
      Placeholder
    </span>
  );
}

export function HookBadge({ type }: { type: "Timely" | "Evergreen" }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 font-sans text-[0.65rem] font-bold uppercase tracking-wider ${
        type === "Timely" ? "bg-accent/15 text-accent" : "bg-ink/10 text-ink/80"
      }`}
    >
      {type === "Timely" ? "● Timely" : "Evergreen"}
    </span>
  );
}
