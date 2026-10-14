import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import type { useSpeech } from "../lib/useSpeech";

type Speech = ReturnType<typeof useSpeech>;

/** The floating mini player that appears while a piece is being read aloud. */
export function ListenPlayer({ speech, open, onClose, color }: { speech: Speech; open: boolean; onClose: () => void; color: string }) {
  const { status, failed, play, pause, skip, speed, cycleSpeed, block, totalBlocks } = speech;
  const where = block === undefined || block < 0 ? "Title" : `Paragraph ${block + 1} of ${totalBlocks}`;
  const btn = "grid h-11 w-11 place-items-center rounded-full transition hover:bg-card/15";
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+12px)] z-40 flex justify-center px-3 md:bottom-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
        >
          <div role="region" aria-label="Listen mode" className="flex items-center gap-0.5 rounded-full bg-ink py-1 pl-1 pr-1 font-sans text-card shadow-lift">
            <button onClick={() => skip(-1)} className={btn} aria-label="Previous paragraph">
              <SkipBack size={18} />
            </button>
            <button
              onClick={status === "playing" ? pause : play}
              className="grid h-12 w-12 place-items-center rounded-full transition hover:scale-105"
              style={{ background: color, color: "rgb(29 23 18)" }}
              aria-label={status === "playing" ? "Pause" : "Play"}
            >
              {status === "playing" ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={() => skip(1)} className={btn} aria-label="Next paragraph">
              <SkipForward size={18} />
            </button>
            <div className="mx-2 min-w-[92px] text-xs leading-tight" aria-live="polite">
              <div className="font-semibold">{status === "playing" ? "Reading aloud" : status === "paused" ? "Paused" : "Listen"}</div>
              <div className="text-card/70">{failed ? "Voice unavailable here" : where}</div>
            </div>
            <button onClick={cycleSpeed} className="h-11 min-w-11 rounded-full px-2 text-sm font-bold tabular-nums transition hover:bg-card/15" aria-label={`Speed ${speed}x. Change speed`}>
              {speed}×
            </button>
            <button onClick={onClose} className={btn} aria-label="Stop listening">
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
