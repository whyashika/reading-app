import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Piece } from "../content/types";
import { readingTime } from "../lib/content";
import { subjectGradient } from "../lib/subjects";
import { DifficultyMeter, FormatTag, ReadingTime } from "./Badges";

export function PieceLinkCard({ piece, eyebrow, big = false }: { piece: Piece; eyebrow?: string; big?: boolean }) {
  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }} className="h-full">
      <Link
        to={`/piece/${piece.id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-rule bg-card p-5 pl-6 shadow-soft transition-shadow hover:shadow-lift"
      >
        <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: subjectGradient(piece.subject) }} aria-hidden />
        {eyebrow && <span className="label mb-2 text-muted">{eyebrow}</span>}
        <FormatTag format={piece.format} />
        <span className={`mt-1.5 font-display font-semibold leading-snug ${big ? "text-2xl" : "text-lg"}`}>{piece.title}</span>
        {big && <span className="mt-2 font-serif leading-relaxed text-ink/80">{piece.blurb}</span>}
        <span className="mt-auto flex items-center gap-4 pt-4">
          <ReadingTime minutes={readingTime(piece)} />
          <DifficultyMeter level={piece.difficulty} showLabel={false} />
          <ArrowRight size={18} className="ml-auto text-muted transition group-hover:translate-x-1 group-hover:text-ink" />
        </span>
      </Link>
    </motion.div>
  );
}
