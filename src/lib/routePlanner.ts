import { ROUTE_PLANNER_URL } from "../config";
import type { Piece } from "../content/types";
import { allPieces, getPiece, prerequisites } from "./content";

/**
 * The personal route planner: a reader types a goal, and gets a short path of stations to read in order.
 * With ROUTE_PLANNER_URL set, an AI picks the stops and explains each one. Without it (or if the AI
 * is unreachable) a simple matcher compares the goal with each piece's subjects, themes and key terms.
 */
export interface RouteStop {
  id: string;
  why: string;
}
export interface Route {
  goal: string;
  intro: string;
  stops: RouteStop[];
  source: "ai" | "matcher";
  /** True when nothing matched well and these are general first stops. */
  generic?: boolean;
  plannedAt: string;
}

const MAX_STOPS = 5;

// Everyday words a reader might use, mapped to words our pieces actually use.
const SYNONYMS: [RegExp, string[]][] = [
  [/^(invest|salary|money|saving|save|sip|mutual|fund|wealth|retire|pension|bank|loan|emi|debt|credit|finance|financ)/, ["finance", "saving", "compound interest", "interest rate", "shares"]],
  [/^(stock|share|market|trading|trade|sensex|nifty)/, ["shares", "markets", "insider trading", "finance"]],
  [/^(budget|econom|price|inflation|rbi|rate|cost|gdp|tax)/, ["economics", "inflation", "prices", "interest rate", "central bank"]],
  [/^(law|legal|right|court|contract|judge|lawyer|sue|rule)/, ["law", "contract", "precedent", "courts", "consent"]],
  [/^(climate|environment|carbon|pollut|green|sustainab|weather|planet|emission)/, ["sustainability", "climate", "carbon credits", "emissions", "shared resources"]],
  [/^(ai|chatgpt|chatbot|tech|computer|algorithm|social|feed|instagram|youtube|app|online|internet|data)/, ["tech", "algorithm", "artificial intelligence", "machine learning", "data", "recommendation"]],
  [/^(privacy|accept|terms|cookie|policy|sign)/, ["terms of service", "consent", "contract", "data"]],
  [/^(philosoph|meaning|identity|value|ethic|think|idea|why)/, ["philosophy", "value", "identity", "thought experiment"]],
  [/^(india|history|histor|ancient|indus|harappa|past|civilis|civiliz|city|cities)/, ["history", "indus valley", "ancient india", "cities"]],
  [/^(culture|myth|ramayana|story|stories|festival|tradition|epic|religio|art)/, ["culture", "ramayana", "tradition", "storytelling", "myth"]],
];

const STOP = new Set(
  "i im i'm me my we our you your a an the to of and or for in on at about into with want wanna would like need know learn understand understanding get start starting basics basic some more how what is are be it its this that just really finally keep hearing so can do change changes new first news people world work life things thing stuff everything going lot".split(
    " ",
  ),
);

const stem = (w: string) => w.slice(0, 5);

function goalTerms(goal: string): { words: string[]; expanded: string[] } {
  const words = goal
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
  const expanded = new Set<string>();
  for (const w of words) for (const [re, terms] of SYNONYMS) if (re.test(w)) terms.forEach((t) => expanded.add(t));
  return { words, expanded: [...expanded] };
}

function scorePiece(p: Piece, words: string[], expanded: string[]) {
  const fields: [string[], number][] = [
    [p.keyTerms, 3],
    [[p.title], 3],
    [p.subject, 2],
    [p.themes, 2],
    [[p.blurb], 1],
  ];
  let score = 0;
  const hits = new Set<string>();
  for (const [texts, weight] of fields) {
    for (const text of texts) {
      const lower = text.toLowerCase();
      const tokens = lower.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
      for (const w of words) {
        if (tokens.some((t) => t.length > 2 && stem(t) === stem(w))) {
          score += weight;
          if (weight >= 2) hits.add(text);
        }
      }
      for (const term of expanded) {
        if (lower.includes(term)) {
          score += weight * 0.6;
          if (weight >= 2) hits.add(text);
        }
      }
    }
  }
  const unique = [...new Set([...hits].filter((h) => h !== p.title).map((h) => h.toLowerCase()))];
  return { score, hits: unique };
}

/** Prerequisites first, then easier pieces first. */
function orderStops(ids: string[]): string[] {
  const set = new Set(ids);
  const out: string[] = [];
  const visit = (id: string, trail = new Set<string>()) => {
    if (out.includes(id) || trail.has(id)) return;
    trail.add(id);
    const p = getPiece(id)!;
    for (const pre of prerequisites(p)) if (set.has(pre.id)) visit(pre.id, trail);
    out.push(id);
  };
  [...ids]
    .sort((a, b) => getPiece(a)!.difficulty - getPiece(b)!.difficulty)
    .forEach((id) => visit(id));
  return out;
}

const listify = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

export function planWithMatcher(goal: string): Route {
  const { words, expanded } = goalTerms(goal);
  const scored = allPieces
    .map((p) => ({ p, ...scorePiece(p, words, expanded) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  const top = scored[0]?.score ?? 0;
  const picked = scored.filter((x) => x.score >= Math.max(2, top * 0.35)).slice(0, MAX_STOPS);
  const plannedAt = new Date().toISOString();

  if (!picked.length) {
    const starters = allPieces.filter((p) => p.difficulty === 1).slice(0, 4);
    return {
      goal,
      intro: "Nothing here matches that goal closely yet, so here are some easy first stops across different lines.",
      stops: orderStops(starters.map((p) => p.id)).map((id) => ({ id, why: `A gentle start on the ${getPiece(id)!.subject.join(" and ")} line.` })),
      source: "matcher",
      generic: true,
      plannedAt,
    };
  }

  const why = new Map<string, string>();
  for (const x of picked) {
    const about = x.hits.map((h) => h.toLowerCase()).slice(0, 3);
    why.set(x.p.id, about.length ? `Covers ${listify(about)}.` : `Closely matches what you asked about.`);
  }
  // Pull in anything a picked piece says to read first.
  for (const x of [...picked]) {
    for (const pre of prerequisites(x.p)) {
      if (!why.has(pre.id) && why.size < MAX_STOPS + 2) why.set(pre.id, `Background for "${x.p.title}".`);
    }
  }
  // A one-stop route feels thin: add a piece that shares a key term with the best match, if one exists.
  if (why.size < 2) {
    const best = picked[0].p;
    const terms = new Set(best.keyTerms.map((t) => t.toLowerCase()));
    const next = allPieces
      .filter((p) => !why.has(p.id))
      .map((p) => ({ p, shared: p.keyTerms.filter((t) => terms.has(t.toLowerCase())).length }))
      .filter((x) => x.shared > 0)
      .sort((a, b) => b.shared - a.shared)[0];
    if (next) why.set(next.p.id, `A good next stop after "${best.title}".`);
  }
  const stops = orderStops([...why.keys()]).map((id) => ({ id, why: why.get(id)! }));
  return {
    goal,
    intro:
      stops.length === 1
        ? "Only one station matches that closely so far. Start here; more stops will join as new pieces are published."
        : `Here's a ${stops.length}-stop route for that, easiest first.`,
    stops,
    source: "matcher",
    plannedAt,
  };
}

async function planWithAI(goal: string): Promise<Route> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25000);
  try {
    const res = await fetch(ROUTE_PLANNER_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({
        goal,
        stations: allPieces.map((p) => ({
          id: p.id,
          title: p.title,
          subjects: p.subject,
          format: p.format,
          difficulty: p.difficulty,
          blurb: p.blurb,
          themes: p.themes,
          keyTerms: p.keyTerms,
          readThisFirst: p.readThisFirst ?? [],
        })),
      }),
    });
    if (!res.ok) throw new Error(`Route planner returned ${res.status}`);
    const data = (await res.json()) as { intro?: string; stops?: RouteStop[] };
    const stops = (data.stops ?? []).filter((s, i, all) => getPiece(s.id) && all.findIndex((t) => t.id === s.id) === i).slice(0, 7);
    if (!stops.length) throw new Error("Route planner returned no usable stops");
    return { goal, intro: data.intro?.trim() || "Here's your route.", stops, source: "ai", plannedAt: new Date().toISOString() };
  } finally {
    clearTimeout(timer);
  }
}

export const aiPlannerEnabled = !!ROUTE_PLANNER_URL;

export async function planRoute(goal: string): Promise<Route> {
  if (aiPlannerEnabled) {
    try {
      return await planWithAI(goal);
    } catch {
      /* fall through to the matcher, so readers always get a route */
    }
  }
  return planWithMatcher(goal);
}

// The reader's most recent route, kept on this device so it's there when they come back.
const KEY = "route-v1";
export function loadRoute(): Route | null {
  try {
    const r = JSON.parse(localStorage.getItem(KEY) ?? "null") as Route | null;
    return r && r.stops?.every((s) => getPiece(s.id)) ? r : null;
  } catch {
    return null;
  }
}
export function saveRoute(r: Route | null) {
  try {
    if (r) localStorage.setItem(KEY, JSON.stringify(r));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: the route lasts for this visit only */
  }
}
