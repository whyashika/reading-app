import { useSyncExternalStore } from "react";

/**
 * Small one-time hints and the "How it works" intro.
 * Each is remembered on this device so it only shows once.
 */
const KEY = "seen-v1";
type Hint = "intro" | "swipe" | "quote-tip";

function read(): Record<string, true> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}
let seen = read();
let introOpen = !seen.intro;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function markSeen(h: Hint) {
  if (seen[h]) return;
  seen = { ...seen, [h]: true };
  try {
    localStorage.setItem(KEY, JSON.stringify(seen));
  } catch {
    /* storage unavailable: the hint may show again next visit */
  }
  emit();
}
export const useSeen = (h: Hint) => useSyncExternalStore(subscribe, () => !!seen[h]);

export const useIntroOpen = () => useSyncExternalStore(subscribe, () => introOpen);
export function openIntro() {
  introOpen = true;
  emit();
}
export function closeIntro() {
  introOpen = false;
  markSeen("intro");
  emit();
}
