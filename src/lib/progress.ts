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
  /** Every day ("YYYY-MM-DD") the reader finished at least one piece, re-reads included. Drives the streak. */
  readDays: string[];
  /** Day of this visit, and of the visit before it, for "new since you were last here". */
  visitDay?: string;
  prevVisitDay?: string;
}

const KEY = "passport-v1";
/** "YYYY-MM-DD" in the reader's own time zone, so a day ends at their midnight. */
const dayOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const today = () => dayOf(new Date());
const daysBefore = (day: string, n: number) => {
  const [y, m, d] = day.split("-").map(Number);
  return dayOf(new Date(y, m - 1, d - n));
};

function load(): Passport {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Passport;
      const finished = p.finished ?? {};
      // Older passports had no readDays: rebuild them from the stamp dates.
      const readDays = p.readDays ?? [...new Set(Object.values(finished))].sort();
      return { opened: p.opened ?? {}, finished, readDays, visitDay: p.visitDay, prevVisitDay: p.prevVisitDay };
    }
  } catch {
    /* storage unavailable or corrupt: start fresh */
  }
  return { opened: {}, finished: {}, readDays: [] };
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

/**
 * Called whenever a reader reaches the end of a piece (or answers its check-in).
 * `stamped`: this is the piece's first stamp. `streakDay`: this is the first piece finished
 * today, so the streak just grew.
 */
export function markFinished(id: string): { stamped: boolean; streakDay: boolean } {
  const day = today();
  const stamped = !state.finished[id];
  const streakDay = !state.readDays.includes(day);
  if (!stamped && !streakDay) return { stamped, streakDay };
  save({
    ...state,
    opened: { ...state.opened, [id]: state.opened[id] ?? day },
    finished: stamped ? { ...state.finished, [id]: day } : state.finished,
    readDays: streakDay ? [...state.readDays, day] : state.readDays,
  });
  return { stamped, streakDay };
}

export function resetPassport() {
  save({ opened: {}, finished: {}, readDays: [], visitDay: today() });
}

/**
 * The reading streak: days in a row with at least one finished piece.
 * Today still counts as "alive" until midnight, so a streak that ended yesterday
 * isn't broken until a whole day is missed.
 */
export function streakOf(p: Passport) {
  const days = new Set(p.readDays);
  const t = today();
  const readToday = days.has(t);
  let current = 0;
  for (let d = readToday ? t : daysBefore(t, 1); days.has(d); d = daysBefore(d, 1)) current++;

  let best = 0;
  let run = 0;
  let prev = "";
  for (const d of [...days].sort()) {
    run = prev && daysBefore(d, 1) === prev ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = daysBefore(t, 6 - i);
    return { day: d, read: days.has(d), isToday: d === t };
  });
  return { current, best, readToday, week };
}

export function useStreak() {
  return streakOf(usePassport());
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
