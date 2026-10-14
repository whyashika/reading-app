import { useSyncExternalStore } from "react";
import { NEW_PIECE_DAYS } from "../config";
import type { Piece } from "../content/types";

/**
 * The reader's passport: which pieces they've opened and finished.
 * Saved in this browser only (no accounts), so it quietly resets on a new device.
 */
interface Passport {
  /** piece id → date first opened ("YYYY-MM-DD") */
  opened: Record<string, string>;
  /** piece id → date stamped (read to the end, or answered the check-in) */
  finished: Record<string, string>;
  /** Day of this visit, and of the visit before it, for "new since you were last here". */
  visitDay?: string;
  prevVisitDay?: string;
}

const KEY = "passport-v1";
const today = () => new Date().toISOString().slice(0, 10);

function load(): Passport {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Passport;
      return { opened: p.opened ?? {}, finished: p.finished ?? {}, visitDay: p.visitDay, prevVisitDay: p.prevVisitDay };
    }
  } catch {
    /* storage unavailable or corrupt: start fresh */
  }
  return { opened: {}, finished: {} };
}

let state = load();
if (state.visitDay !== today()) state = { ...state, prevVisitDay: state.visitDay, visitDay: today() };
const listeners = new Set<() => void>();

function save(next: Passport) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: progress lasts for this session only */
  }
  listeners.forEach((l) => l());
}
save(state);

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function usePassport(): Passport {
  return useSyncExternalStore(subscribe, () => state);
}

export function markOpened(id: string) {
  if (!state.opened[id]) save({ ...state, opened: { ...state.opened, [id]: today() } });
}

/** Returns true the first time a piece is stamped. */
export function markFinished(id: string): boolean {
  if (state.finished[id]) return false;
  save({
    ...state,
    opened: { ...state.opened, [id]: state.opened[id] ?? today() },
    finished: { ...state.finished, [id]: today() },
  });
  return true;
}

export function resetPassport() {
  save({ opened: {}, finished: {}, visitDay: today() });
}

export type PieceStatus = "finished" | "started" | "new" | "unread";

export function pieceStatus(piece: Piece, p: Passport): PieceStatus {
  if (p.finished[piece.id]) return "finished";
  if (p.opened[piece.id]) return "started";
  const cutoff = new Date(Date.now() - NEW_PIECE_DAYS * 864e5).toISOString().slice(0, 10);
  const sinceLastVisit = p.prevVisitDay ? piece.publishedDate > p.prevVisitDay : false;
  return piece.publishedDate >= cutoff || sinceLastVisit ? "new" : "unread";
}

export function usePieceStatus(piece: Piece): PieceStatus {
  return pieceStatus(piece, usePassport());
}
