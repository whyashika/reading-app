import { WORDS_PER_MINUTE } from "../config";
import { pieces } from "../content/pieces";
import { SUBJECTS, type Difficulty, type Piece, type Subject } from "../content/types";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  1: "No background needed",
  2: "Builds on basics",
  3: "Deeper dive",
};

/** Newest first, as the feed shows them. */
export const allPieces: Piece[] = [...pieces].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));

const byId = new Map(pieces.map((p) => [p.id, p]));

export function getPiece(id: string | undefined): Piece | undefined {
  return id ? byId.get(id) : undefined;
}

/** Only subjects that at least one piece uses, in the standard order. */
export const subjectsInUse: Subject[] = SUBJECTS.filter((s) => pieces.some((p) => p.subject.includes(s)));

export function readingTime(piece: Piece): number {
  if (piece.readingTime) return piece.readingTime;
  const words = piece.body.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function prerequisites(piece: Piece): Piece[] {
  return (piece.readThisFirst ?? []).map((id) => byId.get(id)).filter((p): p is Piece => !!p);
}

export function nextInSeries(piece: Piece): Piece | undefined {
  if (!piece.series) return undefined;
  const { name, part } = piece.series;
  return pieces.find((p) => p.series?.name === name && p.series.part === part + 1);
}

/** Pieces sharing hidden keyTerms (weighted more) or subjects. */
export function relatedPieces(piece: Piece, limit = 3): Piece[] {
  const exclude = new Set([piece.id, nextInSeries(piece)?.id]);
  const terms = new Set(piece.keyTerms.map((t) => t.toLowerCase()));
  return pieces
    .filter((p) => !exclude.has(p.id))
    .map((p) => {
      const sharedTerms = p.keyTerms.filter((t) => terms.has(t.toLowerCase())).length;
      const sharedSubjects = p.subject.filter((s) => piece.subject.includes(s)).length;
      return { p, score: sharedTerms * 2 + sharedSubjects };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.publishedDate.localeCompare(a.p.publishedDate))
    .slice(0, limit)
    .map((x) => x.p);
}

// Friendly warnings in the browser console while writing content.
if (import.meta.env.DEV) {
  const seen = new Set<string>();
  for (const p of pieces) {
    if (seen.has(p.id)) console.warn(`[pieces.ts] Duplicate id "${p.id}"`);
    seen.add(p.id);
    for (const id of p.readThisFirst ?? []) {
      if (!byId.has(id)) console.warn(`[pieces.ts] "${p.id}" lists unknown readThisFirst id "${id}"`);
    }
    if (!p.checkIn.options.some((o) => o.isCorrect)) {
      console.warn(`[pieces.ts] "${p.id}" check-in has no correct option`);
    }
  }
}
