import { AnimatePresence, motion } from "framer-motion";
import { Download, Quote, Share2, X } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { APP_NAME } from "../config";
import type { Piece } from "../content/types";
import { appUrl, saveImage, shareImage } from "../lib/share";
import { drawQuoteCard } from "../lib/shareCard";

const MAX_CHARS = 280;

/**
 * Pull-quote cards. Highlight any line in a piece and a "Quote card" button
 * appears under it; tap it for a shareable image of that line.
 */
export function QuoteMaker({ piece, container }: { piece: Piece; container: RefObject<HTMLElement> }) {
  const [sel, setSel] = useState<{ text: string; top: number; left: number } | null>(null);
  const [quote, setQuote] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const s = window.getSelection();
        const el = container.current;
        if (!s || s.isCollapsed || !s.rangeCount || !el) return setSel(null);
        const range = s.getRangeAt(0);
        if (!el.contains(range.commonAncestorContainer)) return setSel(null);
        const text = s.toString().replace(/\s+/g, " ").trim();
        if (text.split(" ").length < 3) return setSel(null);
        const r = range.getBoundingClientRect();
        const top = Math.min(r.bottom + 12, window.innerHeight - 130);
        setSel({ text, top, left: Math.min(Math.max(r.left + r.width / 2, 110), window.innerWidth - 110) });
      });
    };
    document.addEventListener("selectionchange", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("selectionchange", update);
      window.removeEventListener("scroll", update);
    };
  }, [container]);

  const tooLong = !!sel && sel.text.length > MAX_CHARS;

  return createPortal(
    <>
      <AnimatePresence>
        {sel && !quote && (
          <motion.button
            key="quote-btn"
            initial={{ opacity: 0, y: -6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 22, stiffness: 400 }}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => {
              if (tooLong) return;
              setQuote(sel.text);
              window.getSelection()?.removeAllRanges();
              setSel(null);
            }}
            disabled={tooLong}
            className="fixed z-40 flex h-11 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-ink px-4 font-sans text-sm font-semibold text-card shadow-lift disabled:opacity-80"
            style={{ top: sel.top, left: sel.left }}
          >
            <Quote size={16} /> {tooLong ? `Too long for a card (${MAX_CHARS} characters max)` : "Make a quote card"}
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>{quote && <QuoteSheet piece={piece} quote={quote} onClose={() => setQuote(null)} />}</AnimatePresence>
    </>,
    document.body,
  );
}

function QuoteSheet({ piece, quote, onClose }: { piece: Piece; quote: string; onClose: () => void }) {
  const [image, setImage] = useState<{ blob: Blob; url: string } | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const fileName = `${APP_NAME.toLowerCase()}-quote-${piece.id}.png`;

  useEffect(() => {
    let url = "";
    let live = true;
    drawQuoteCard(piece.subject, quote, piece.title, appUrl())
      .then((blob) => {
        url = URL.createObjectURL(blob);
        if (live) setImage({ blob, url });
      })
      .catch(() => undefined);
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      live = false;
      if (url) URL.revokeObjectURL(url);
      window.removeEventListener("keydown", key);
    };
  }, [piece, quote, onClose]);

  const caption = `"${quote}" From "${piece.title}" on ${APP_NAME}.`;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Quote card">
      <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        className="relative w-full max-w-[380px] rounded-[28px] bg-card p-4 shadow-lift"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
      >
        <div className="flex items-center justify-between pb-3 pl-1">
          <div className="font-display text-lg font-semibold">Your quote card</div>
          <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full text-muted transition hover:bg-ink/5" aria-label="Close" autoFocus>
            <X size={20} />
          </button>
        </div>
        <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#16130F]">
          {image ? (
            <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={image.url} alt={`Quote card: ${quote}`} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center font-sans text-sm text-[#ACA092]">Setting the type…</div>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={async () => {
              const r = await shareImage({ blob: image?.blob ?? null, fileName, title: piece.title, text: caption, url: appUrl() });
              setNote(r === "copied" ? "Caption copied. Save the image too, then post both." : null);
            }}
            disabled={!image}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-ink font-sans text-sm font-semibold text-card transition hover:opacity-90 disabled:opacity-50"
          >
            <Share2 size={16} /> Share it
          </button>
          <button
            onClick={() => {
              if (!image) return;
              saveImage(image.url, fileName);
              setNote("Saved to your downloads.");
            }}
            disabled={!image}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full font-sans text-sm font-semibold ring-1 ring-rule transition hover:bg-ink/5 disabled:opacity-50"
          >
            <Download size={16} /> Save image
          </button>
        </div>
        {note && <p className="mt-2 text-center font-sans text-sm text-muted">{note}</p>}
      </motion.div>
    </div>
  );
}
