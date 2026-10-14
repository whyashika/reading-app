import type { Subject } from "../content/types";

/**
 * Each subject's line colour. The actual RGB values live in src/index.css
 * (as --s-finance etc.) so light and dark mode can use different shades.
 */
const KEY: Record<Subject, string> = {
  Finance: "finance",
  Economics: "economics",
  Philosophy: "philosophy",
  Law: "law",
  Sustainability: "sustainability",
  Tech: "tech",
  History: "history",
  Culture: "culture",
};

export function subjectColor(subject: Subject, alpha = 1): string {
  return alpha === 1 ? `rgb(var(--s-${KEY[subject]}))` : `rgb(var(--s-${KEY[subject]}) / ${alpha})`;
}

/** Text colour that stays readable on top of a subject's line colour. */
export function subjectInk(subject: Subject): string {
  return `rgb(var(--s-${KEY[subject]}-ink))`;
}

/** A soft gradient across a piece's subject colours, for card accents. */
export function subjectGradient(subjects: Subject[], alpha = 1): string {
  if (subjects.length === 1) {
    const c = subjectColor(subjects[0], alpha);
    return `linear-gradient(90deg, ${c}, ${c})`;
  }
  return `linear-gradient(90deg, ${subjects.map((s) => subjectColor(s, alpha)).join(", ")})`;
}
