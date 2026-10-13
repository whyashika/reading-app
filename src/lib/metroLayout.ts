import type { Piece, Subject } from "../content/types";
import { SUBJECTS } from "../content/types";

/**
 * Turns the pieces into a metro map, automatically.
 *
 * 1. Every piece gets a place in one global reading order: prerequisites first,
 *    then easier before harder, then older before newer.
 * 2. Each subject is a line; its stations are its pieces in that global order,
 *    so riding a line left-to-right is a learning path.
 * 3. Each line gets a home row. Rows are ordered so lines that share
 *    interchange stations sit next to each other.
 * 4. Stations get columns ("layers") with a longest-path pass, so an
 *    interchange lines up with its neighbours on every line it serves.
 * 5. Lines are drawn with only horizontal, vertical and 45° segments.
 */

export const GRID = { col: 200, row: 145, padLeft: 200, padRight: 120, padTop: 100, padBottom: 170 };

/** Station label metrics (shared with the renderer). */
export const LABEL = { fontSize: 16, lineHeight: 18, firstBaseline: 34, charWidth: 8.4, maxChars: 18, maxLines: 4 };

export function wrapTitle(title: string): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const w of title.split(" ")) {
    if ((cur + " " + w).trim().length > LABEL.maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  if (lines.length > LABEL.maxLines) return [...lines.slice(0, LABEL.maxLines - 1), lines[LABEL.maxLines - 1] + "…"];
  return lines;
}

export function stationRadius(interchange: boolean) {
  return interchange ? 13 : 8;
}

/** Vertical offset of the label block (icon + title) from the station centre. */
export function labelOffset(st: { interchange: boolean; labelAbove: boolean; label: string[] }) {
  const r = stationRadius(st.interchange);
  const h = LABEL.firstBaseline + (st.label.length - 1) * LABEL.lineHeight;
  return st.labelAbove ? -(r + 12 + h) : r + 10;
}

function labelBox(st: Station) {
  const w = Math.max(...st.label.map((l) => l.length)) * LABEL.charWidth;
  const top = st.y + labelOffset(st);
  const h = LABEL.firstBaseline + (st.label.length - 1) * LABEL.lineHeight + 6;
  return { x1: st.x - w / 2, x2: st.x + w / 2, y1: top, y2: top + h };
}

export interface Station {
  piece: Piece;
  lines: Subject[];
  interchange: boolean;
  layer: number;
  /** Row position in row units. */
  row: number;
  /** Labels go above when branching lines arrive from below, so they don't cross the text. */
  labelAbove: boolean;
  /** Title wrapped onto short lines. */
  label: string[];
  x: number;
  y: number;
}

export interface LineRoute {
  subject: Subject;
  homeRow: number;
  path: string;
  stationIds: string[];
  /** Where the line's name tag sits. */
  tag: { x: number; y: number };
}

export interface MetroLayout {
  stations: Station[];
  lines: LineRoute[];
  width: number;
  height: number;
}

type Pt = { x: number; y: number };

function globalOrder(pieces: Piece[]): Piece[] {
  const byId = new Map(pieces.map((p) => [p.id, p]));
  const indeg = new Map(pieces.map((p) => [p.id, 0]));
  const out = new Map<string, string[]>(pieces.map((p) => [p.id, []]));
  for (const p of pieces) {
    for (const pre of p.readThisFirst ?? []) {
      if (!byId.has(pre) || pre === p.id) continue;
      out.get(pre)!.push(p.id);
      indeg.set(p.id, indeg.get(p.id)! + 1);
    }
  }
  const cmp = (a: Piece, b: Piece) =>
    a.difficulty - b.difficulty || a.publishedDate.localeCompare(b.publishedDate) || a.title.localeCompare(b.title);
  const ready = pieces.filter((p) => indeg.get(p.id) === 0);
  const order: Piece[] = [];
  while (ready.length) {
    ready.sort(cmp);
    const p = ready.shift()!;
    order.push(p);
    for (const nxt of out.get(p.id)!) {
      indeg.set(nxt, indeg.get(nxt)! - 1);
      if (indeg.get(nxt) === 0) ready.push(byId.get(nxt)!);
    }
  }
  // Circular prerequisites: just append whatever is left.
  if (order.length < pieces.length) {
    order.push(...pieces.filter((p) => !order.includes(p)).sort(cmp));
  }
  return order;
}

function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  return items.flatMap((item, i) => permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [item, ...rest]));
}

function assignRows(lines: Subject[], pieces: Piece[]): Map<Subject, number> {
  const multi = pieces.filter((p) => p.subject.length > 1);
  let best = lines;
  let bestCost = Infinity;
  for (const perm of permutations(lines)) {
    const row = new Map(perm.map((s, i) => [s, i]));
    let cost = 0;
    for (const p of multi) {
      const rows = p.subject.filter((s) => row.has(s)).map((s) => row.get(s)!);
      const lo = Math.min(...rows);
      const hi = Math.max(...rows);
      cost += (hi - lo) ** 2 * 10;
      for (const [s, r] of row) if (r > lo && r < hi && !p.subject.includes(s)) cost += 5;
    }
    if (cost < bestCost) {
      bestCost = cost;
      best = perm;
    }
  }
  return new Map(best.map((s, i) => [s, i]));
}

/** Octilinear route between two stations on one line, hugging the line's home row. */
function routeSegment(a: Pt, b: Pt, home: number): Pt[] {
  const dx = b.x - a.x;
  const d1 = Math.abs(a.y - home);
  const d2 = Math.abs(b.y - home);
  if (d1 + d2 <= dx + 0.01) {
    const pts: Pt[] = [a];
    if (d1 > 0) pts.push({ x: a.x + d1, y: home });
    if (d2 > 0) pts.push({ x: b.x - d2, y: home });
    pts.push(b);
    return pts;
  }
  const dy = b.y - a.y;
  const sign = Math.sign(dy);
  if (Math.abs(dy) <= dx) {
    const flat = (dx - Math.abs(dy)) / 2;
    return [a, { x: a.x + flat, y: a.y }, { x: b.x - flat, y: b.y }, b];
  }
  // Steeper than 45°: diagonal, vertical, diagonal.
  const h = dx / 2;
  return [a, { x: a.x + h, y: a.y + sign * h }, { x: b.x - h, y: b.y - sign * h }, b];
}

function dedupe(pts: Pt[]): Pt[] {
  return pts.filter((p, i) => i === 0 || Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y) > 0.5);
}

/** Polyline → SVG path with softly rounded corners, like a printed transit map. */
function roundedPath(raw: Pt[], radius = 22): string {
  const pts = dedupe(raw);
  if (pts.length < 2) return "";
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const prev = pts[i - 1];
    const next = pts[i + 1];
    const l1 = Math.hypot(p.x - prev.x, p.y - prev.y);
    const l2 = Math.hypot(next.x - p.x, next.y - p.y);
    const r = Math.min(radius, l1 / 2, l2 / 2);
    const a = { x: p.x - ((p.x - prev.x) / l1) * r, y: p.y - ((p.y - prev.y) / l1) * r };
    const b = { x: p.x + ((next.x - p.x) / l2) * r, y: p.y + ((next.y - p.y) / l2) * r };
    d += ` L${a.x},${a.y} Q${p.x},${p.y} ${b.x},${b.y}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L${last.x},${last.y}`;
}

function distToSegment(p: Pt, a: Pt, b: Pt): number {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const len2 = vx * vx + vy * vy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / len2));
  return Math.hypot(p.x - (a.x + t * vx), p.y - (a.y + t * vy));
}

export function buildMetroLayout(pieces: Piece[]): MetroLayout {
  const order = globalOrder(pieces);
  const lines = SUBJECTS.filter((s) => pieces.some((p) => p.subject.includes(s)));
  const rowOf = assignRows(lines, pieces);
  const seq = new Map(lines.map((s) => [s, order.filter((p) => p.subject.includes(s))]));

  // Interchanges sit on the row of their busiest line, so that line runs straight
  // through and the others branch in to meet it.
  const rowFor = (p: Piece): number => {
    const members = p.subject.filter((s) => rowOf.has(s));
    if (members.length === 1) return rowOf.get(members[0])!;
    const sorted = [...members].sort((a, b) => rowOf.get(a)! - rowOf.get(b)!);
    const middle = sorted.slice(Math.floor((sorted.length - 1) / 2), Math.ceil((sorted.length + 1) / 2));
    const busiest = middle.sort((a, b) => seq.get(b)!.length - seq.get(a)!.length)[0];
    return rowOf.get(busiest)!;
  };

  const minLayer = new Map<string, number>();
  let stations: Station[] = [];
  let routes: { subject: Subject; pts: Pt[]; segments: [string, string][] }[] = [];

  const toPx = (layer: number, row: number): Pt => ({
    x: GRID.padLeft + layer * GRID.col,
    y: GRID.padTop + row * GRID.row,
  });

  for (let attempt = 0; attempt < 200; attempt++) {
    // Columns: longest path along every line, respecting any bumps.
    const layer = new Map<string, number>();
    for (const p of order) {
      let l = minLayer.get(p.id) ?? 0;
      for (const s of p.subject) {
        const line = seq.get(s)!;
        const i = line.indexOf(p);
        if (i > 0) l = Math.max(l, layer.get(line[i - 1].id)! + 1);
      }
      layer.set(p.id, l);
    }
    stations = order.map((p) => {
      const row = rowFor(p);
      const l = layer.get(p.id)!;
      const memberRows = p.subject.map((s) => rowOf.get(s)!);
      const labelAbove = memberRows.some((r) => r > row) && !memberRows.some((r) => r < row);
      return { piece: p, lines: p.subject.filter((s) => rowOf.has(s)), interchange: p.subject.length > 1, layer: l, row, labelAbove, label: wrapTitle(p.title), ...toPx(l, row) };
    });
    const at = new Map(stations.map((s) => [s.piece.id, s]));

    // Two stations in the same spot? Nudge the later one right.
    let bumped = false;
    for (let i = 0; i < stations.length && !bumped; i++) {
      for (let j = i + 1; j < stations.length; j++) {
        const a = stations[i];
        const b = stations[j];
        if (a.layer === b.layer && Math.abs(a.row - b.row) < 0.75) {
          minLayer.set(b.piece.id, b.layer + 1);
          bumped = true;
          break;
        }
      }
    }
    if (bumped) continue;

    // Labels bumping into each other, or a label sitting on another station? Nudge the later one.
    const boxes = stations.map(labelBox);
    for (let i = 0; i < stations.length && !bumped; i++) {
      for (let j = 0; j < stations.length; j++) {
        if (i === j) continue;
        const a = boxes[i];
        const b = boxes[j];
        const labelsOverlap = j > i && a.x1 < b.x2 + 6 && b.x1 < a.x2 + 6 && a.y1 < b.y2 && b.y1 < a.y2;
        const sj = stations[j];
        const onStation = sj.x > a.x1 - 10 && sj.x < a.x2 + 10 && sj.y > a.y1 - 10 && sj.y < a.y2 + 10;
        if (labelsOverlap || onStation) {
          const later = Math.max(i, j);
          minLayer.set(stations[later].piece.id, stations[later].layer + 1);
          bumped = true;
          break;
        }
      }
    }
    if (bumped) continue;

    // Route every line.
    routes = lines.map((subject) => {
      const home = GRID.padTop + rowOf.get(subject)! * GRID.row;
      const line = seq.get(subject)!.map((p) => at.get(p.id)!);
      let pts: Pt[] = [line[0]];
      const segments: [string, string][] = [];
      for (let i = 1; i < line.length; i++) {
        pts = pts.concat(routeSegment(line[i - 1], line[i], home).slice(1));
        segments.push([line[i - 1].piece.id, line[i].piece.id]);
      }
      return { subject, pts, segments };
    });

    // A line running straight through a station it doesn't stop at? Nudge that station.
    for (const st of stations) {
      for (const r of routes) {
        if (st.lines.includes(r.subject)) continue;
        for (let i = 1; i < r.pts.length; i++) {
          if (distToSegment(st, r.pts[i - 1], r.pts[i]) < 22) {
            minLayer.set(st.piece.id, st.layer + 1);
            bumped = true;
            break;
          }
        }
        if (bumped) break;
      }
      if (bumped) break;
    }
    if (!bumped) break;
  }

  // Lines sharing the same stretch between two interchanges get drawn side by side.
  const segKey = (a: string, b: string) => `${a}→${b}`;
  const shared = new Map<string, Subject[]>();
  for (const r of routes) for (const [a, b] of r.segments) shared.set(segKey(a, b), [...(shared.get(segKey(a, b)) ?? []), r.subject]);

  const at = new Map(stations.map((s) => [s.piece.id, s]));
  const lineRoutes: LineRoute[] = routes.map((r) => {
    const homeRow = rowOf.get(r.subject)!;
    const home = GRID.padTop + homeRow * GRID.row;
    const stationsOnLine = seq.get(r.subject)!.map((p) => at.get(p.id)!);
    const first = stationsOnLine[0];
    // Name tag a little to the left of the first station, on the home row.
    const tag = { x: first.x - GRID.col * 0.62, y: home };
    let pts: Pt[] = [tag, ...routeSegment(tag, first, home).slice(1)];
    for (let i = 1; i < stationsOnLine.length; i++) {
      const a = stationsOnLine[i - 1];
      const b = stationsOnLine[i];
      const group = shared.get(segKey(a.piece.id, b.piece.id))!;
      let seg = routeSegment(a, b, home);
      if (group.length > 1) {
        const off = (group.indexOf(r.subject) - (group.length - 1) / 2) * 7;
        seg = seg.map((p) => ({ x: p.x, y: p.y + off }));
      }
      pts = pts.concat(seg.slice(1));
    }
    return { subject: r.subject, homeRow, path: roundedPath(pts), stationIds: stationsOnLine.map((s) => s.piece.id), tag };
  });

  const maxX = Math.max(...stations.map((s) => s.x));
  const maxY = Math.max(...stations.map((s) => s.y), ...lineRoutes.map((l) => l.tag.y));
  return {
    stations,
    lines: lineRoutes,
    width: maxX + GRID.padRight,
    height: maxY + GRID.padBottom,
  };
}
