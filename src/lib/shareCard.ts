import { APP_NAME } from "../config";
import type { Subject } from "../content/types";

/**
 * Draws the "line complete" passport stamp as a 1080×1350 PNG (Instagram's
 * 4:5 portrait size, which also crops nicely on LinkedIn and WhatsApp).
 * The card is always dark, like the app icon, so these are the dark-mode
 * line colours from src/index.css.
 */
const LINE_RGB: Record<Subject, string> = {
  Finance: "251 191 36",
  Economics: "251 113 133",
  Philosophy: "167 139 250",
  Law: "96 165 250",
  Sustainability: "74 222 128",
  Tech: "34 211 238",
  History: "214 172 128",
  Culture: "240 141 247",
};

const W = 1080;
const H = 1350;
const BG = "#16130F";
const INK = "#EDE6DA";
const MUTED = "#ACA092";
const ACCENT = "#F08C64";
const DISPLAY = "Fraunces, Georgia, serif";
const SERIF = "Literata, Georgia, serif";
const SANS = "Inter, system-ui, sans-serif";

const rgb = (s: Subject, a = 1) => `rgb(${LINE_RGB[s]} / ${a})`;

export async function drawLineCard(subject: Subject, stationTitles: string[], url: string): Promise<Blob> {
  await Promise.all(
    [`600 120px Fraunces`, `italic 500 56px Fraunces`, `400 40px Literata`, `700 30px Inter`, `600 30px Inter`].map((f) =>
      document.fonts?.load(f).catch(() => undefined),
    ),
  );

  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const color = rgb(subject);

  // Paper and a soft glow in the line's colour
  g.fillStyle = BG;
  g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W * 0.85, H * 0.12, 0, W * 0.85, H * 0.12, 760);
  glow.addColorStop(0, rgb(subject, 0.28));
  glow.addColorStop(1, rgb(subject, 0));
  g.fillStyle = glow;
  g.fillRect(0, 0, W, H);

  // Brand: the bookmark mark and the name
  drawLogo(g, 80, 80, 76);
  g.fillStyle = INK;
  g.font = `600 52px ${DISPLAY}`;
  g.textBaseline = "middle";
  g.fillText(APP_NAME, 176, 120);
  g.fillStyle = MUTED;
  g.font = `600 24px ${SANS}`;
  g.textAlign = "right";
  g.fillText("CONCEPT PASSPORT", W - 80, 120);
  g.textAlign = "left";

  // The stamp
  drawStamp(g, W / 2, 560, 300, subject, color);

  // The line itself, every station stamped
  drawLine(g, 140, 980, W - 140, stationTitles.length, color, subject);

  // The achievement line
  g.textAlign = "center";
  g.textBaseline = "alphabetic";
  g.fillStyle = INK;
  g.font = `italic 500 54px ${DISPLAY}`;
  g.fillText("Completed the", W / 2, 1110);
  g.fillText(`${subject} line.`, W / 2, 1176);
  g.fillStyle = MUTED;
  g.font = `400 30px ${SERIF}`;
  const n = stationTitles.length;
  g.fillText(`${n} ${n === 1 ? "station" : "stations"}, every one stamped`, W / 2, 1232);

  // Where to find it
  g.font = `600 26px ${SANS}`;
  g.fillStyle = rgb(subject, 0.9);
  g.fillText(url.replace(/^https?:\/\//, "").replace(/\/$/, ""), W / 2, H - 56);

  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"));
}

function drawLogo(g: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const k = size / 100;
  g.save();
  g.translate(x, y);
  g.scale(k, k);
  roundRect(g, 0, 0, 100, 100, 22);
  g.fillStyle = "#211C17";
  g.fill();
  g.strokeStyle = "rgb(60 52 44)";
  g.lineWidth = 3;
  g.stroke();
  g.beginPath();
  g.moveTo(39, 35.5);
  g.lineTo(61, 35.5);
  g.lineTo(61, 83.5);
  g.lineTo(50, 74);
  g.lineTo(39, 83.5);
  g.closePath();
  g.fillStyle = INK;
  g.fill();
  g.beginPath();
  g.arc(50, 22.5, 6.5, 0, Math.PI * 2);
  g.fillStyle = ACCENT;
  g.fill();
  g.restore();
}

function drawStamp(g: CanvasRenderingContext2D, cx: number, cy: number, r: number, subject: Subject, color: string) {
  g.save();
  g.translate(cx, cy);
  g.rotate((-8 * Math.PI) / 180);

  // Ink fill and double ring
  g.beginPath();
  g.arc(0, 0, r, 0, Math.PI * 2);
  g.fillStyle = rgb(subject, 0.1);
  g.fill();
  g.strokeStyle = color;
  g.lineWidth = 12;
  g.stroke();
  g.beginPath();
  g.arc(0, 0, r - 30, 0, Math.PI * 2);
  g.lineWidth = 4;
  g.stroke();
  g.beginPath();
  g.arc(0, 0, r - 112, 0, Math.PI * 2);
  g.lineWidth = 4;
  g.stroke();

  // Lettering around the ring
  g.fillStyle = color;
  g.font = `700 36px ${SANS}`;
  arcText(g, "LINE COMPLETE", r - 72, -Math.PI / 2, 0.16, true);
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();
  arcText(g, date, r - 72, Math.PI / 2, 0.13, false);
  for (const a of [Math.PI, 0]) {
    g.beginPath();
    g.arc(Math.cos(a) * (r - 72), Math.sin(a) * (r - 72), 8, 0, Math.PI * 2);
    g.fill();
  }

  // Subject name in the middle, shrunk to fit
  let size = 112;
  g.font = `600 ${size}px ${DISPLAY}`;
  while (g.measureText(subject).width > (r - 130) * 1.8 && size > 48) {
    size -= 4;
    g.font = `600 ${size}px ${DISPLAY}`;
  }
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = INK;
  g.fillText(subject, 0, 4);
  g.restore();
}

/** Letters spaced along a circle. Top text reads clockwise; bottom text is flipped so it reads left to right. */
function arcText(g: CanvasRenderingContext2D, text: string, radius: number, centre: number, step: number, top: boolean) {
  const chars = [...text];
  const total = step * (chars.length - 1);
  g.textAlign = "center";
  g.textBaseline = "middle";
  chars.forEach((ch, i) => {
    const a = top ? centre - total / 2 + i * step : centre + total / 2 - i * step;
    g.save();
    g.rotate(a);
    g.translate(radius, 0);
    g.rotate(top ? Math.PI / 2 : -Math.PI / 2);
    g.fillText(ch, 0, 0);
    g.restore();
  });
}

function drawLine(g: CanvasRenderingContext2D, x0: number, y: number, x1: number, n: number, color: string, subject: Subject) {
  g.strokeStyle = color;
  g.lineWidth = 16;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(x0, y);
  g.lineTo(x1, y);
  g.stroke();
  const count = Math.max(n, 1);
  for (let i = 0; i < count; i++) {
    const x = count === 1 ? (x0 + x1) / 2 : x0 + ((x1 - x0) * i) / (count - 1);
    g.beginPath();
    g.arc(x, y, 30, 0, Math.PI * 2);
    g.fillStyle = color;
    g.fill();
    g.strokeStyle = BG;
    g.lineWidth = 6;
    g.stroke();
    // tick
    g.beginPath();
    g.moveTo(x - 12, y + 1);
    g.lineTo(x - 3, y + 10);
    g.lineTo(x + 13, y - 9);
    g.strokeStyle = `rgb(29 23 18)`;
    g.lineWidth = 7;
    g.lineJoin = "round";
    g.stroke();
  }
  g.strokeStyle = rgb(subject);
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/**
 * A pull-quote card: the line a reader highlighted, in large italic type,
 * with the piece's title underneath. Same size and dark look as the line card.
 */
export async function drawQuoteCard(subjects: Subject[], quote: string, title: string, url: string): Promise<Blob> {
  await Promise.all(
    [`italic 500 64px Fraunces`, `600 40px Fraunces`, `600 30px Inter`, `700 24px Inter`].map((f) => document.fonts?.load(f).catch(() => undefined)),
  );
  const subject = subjects[0];
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const color = rgb(subject);

  g.fillStyle = BG;
  g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W * 0.1, H * 0.95, 0, W * 0.1, H * 0.95, 820);
  glow.addColorStop(0, rgb(subject, 0.24));
  glow.addColorStop(1, rgb(subject, 0));
  g.fillStyle = glow;
  g.fillRect(0, 0, W, H);

  // A band of the piece's subject colours along the top edge
  subjects.forEach((s, i) => {
    g.fillStyle = rgb(s);
    g.fillRect((W / subjects.length) * i, 0, W / subjects.length + 1, 14);
  });

  drawLogo(g, 80, 80, 76);
  g.fillStyle = INK;
  g.font = `600 52px ${DISPLAY}`;
  g.textBaseline = "middle";
  g.textAlign = "left";
  g.fillText(APP_NAME, 176, 120);

  // Big opening quote mark
  g.fillStyle = color;
  g.font = `600 260px ${DISPLAY}`;
  g.textBaseline = "alphabetic";
  g.fillText("“", 64, 420);

  // The quote, as large as fits the box
  const clean = quote.replace(/\s+/g, " ").trim().replace(/^["“'‘]+|["”'’]+$/g, "");
  const box = { x: 100, top: 400, w: W - 200, h: 560 };
  let size = 76;
  let lines: string[] = [];
  for (; size >= 36; size -= 2) {
    g.font = `italic 500 ${size}px ${DISPLAY}`;
    lines = wrap(g, clean, box.w);
    if (lines.length * size * 1.32 <= box.h) break;
  }
  const lh = size * 1.32;
  const blockH = lines.length * lh;
  let y = box.top + (box.h - blockH) / 2 + size;
  g.fillStyle = INK;
  for (const line of lines) {
    g.fillText(line, box.x, y);
    y += lh;
  }

  // Where it's from
  const footTop = 1040;
  g.fillStyle = color;
  g.fillRect(box.x, footTop, 80, 8);
  g.fillStyle = MUTED;
  g.font = `700 24px ${SANS}`;
  g.fillText(`FROM ${APP_NAME.toUpperCase()} · ${subjects.join(" × ").toUpperCase()}`, box.x, footTop + 64);
  g.fillStyle = INK;
  g.font = `600 40px ${DISPLAY}`;
  const titleLines = wrap(g, title, box.w).slice(0, 2);
  titleLines.forEach((l, i) => g.fillText(l, box.x, footTop + 120 + i * 50));

  g.font = `600 26px ${SANS}`;
  g.fillStyle = rgb(subject, 0.9);
  g.textAlign = "center";
  g.fillText(url.replace(/^https?:\/\//, "").replace(/\/$/, ""), W / 2, H - 56);

  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"));
}

function wrap(g: CanvasRenderingContext2D, text: string, width: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (g.measureText(next).width > width && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}
