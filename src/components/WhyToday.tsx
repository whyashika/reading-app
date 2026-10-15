import { motion } from "framer-motion";
import { ArrowUpRight, Newspaper } from "lucide-react";
import type { Piece } from "../content/types";

/** The highlighted "Why this matters today" box. Only shows on pieces that set `whyToday`. */
export function WhyToday({ why }: { why: NonNullable<Piece["whyToday"]> }) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: "spring", damping: 24, stiffness: 260 }}
      className="relative mb-8 overflow-hidden rounded-2xl border border-accent/40 bg-accent/[0.07] p-4 md:p-5"
      aria-label="Why this matters today"
    >
      <div className="flex items-center gap-2 font-sans text-sm font-bold text-accent">
        <Newspaper size={16} /> Why this matters today
      </div>
      <p className="mt-2 font-serif text-[1.05rem] leading-relaxed text-ink/90">{why.text}</p>
      {why.link && (
        <a
          href={why.link.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex min-h-11 items-center gap-1 font-sans text-sm font-semibold underline decoration-accent decoration-2 underline-offset-4"
        >
          {why.link.label} <ArrowUpRight size={15} />
        </a>
      )}
    </motion.aside>
  );
}
