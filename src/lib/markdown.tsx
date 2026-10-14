import { Fragment, type ReactNode } from "react";
import { glossaryMarker } from "./glossary";

/**
 * A deliberately tiny markdown renderer for piece bodies.
 * Blocks: paragraphs (blank-line separated), "## heading", "> quote", "- list".
 * Inline: **bold**, *italic*, [link](url).
 */
const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

type Mark = (text: string, key: string) => ReactNode;
const plain: Mark = (text) => text;

export function renderInline(text: string, mark: Mark = plain, keyPrefix = ""): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}${i}`;
    // Bold is where a piece explains a term itself, so the glossary leaves it alone.
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={key}>{mark(part.slice(1, -1), key)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link)
      return (
        <a key={key} href={link[2]} target="_blank" rel="noreferrer">
          {link[1]}
        </a>
      );
    return <Fragment key={key}>{mark(part, key)}</Fragment>;
  });
}

/** Markdown stripped to plain words, e.g. for reading aloud. */
export function plainText(block: string): string {
  return block
    .replace(/^##\s+/, "")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-*]\s/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s*\n\s*/g, " ")
    .trim();
}

export function blocks(body: string): string[] {
  return body
    .trim()
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
}

export function Markdown({
  body,
  className,
  glossary = false,
  activeBlock,
}: {
  body: string;
  className?: string;
  /** Underline glossary terms (first mention only) with tap-to-define pop-ups. */
  glossary?: boolean;
  /** Index of the block being read aloud, to highlight it. */
  activeBlock?: number;
}) {
  const mark = glossary ? glossaryMarker(new Set()) : plain;
  return (
    <div className={className}>
      {blocks(body).map((block, i) => {
        const attrs = { "data-block": i, className: activeBlock === i ? "is-speaking" : undefined };
        if (block.startsWith("## ")) return <h2 key={i} {...attrs}>{renderInline(block.slice(3), mark, `${i}-`)}</h2>;
        if (block.startsWith(">"))
          return <blockquote key={i} {...attrs}>{renderInline(block.replace(/^>\s?/gm, ""), mark, `${i}-`)}</blockquote>;
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-*]\s/.test(l)))
          return (
            <ul key={i} {...attrs}>
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^\s*[-*]\s/, ""), mark, `${i}-${j}-`)}</li>
              ))}
            </ul>
          );
        return <p key={i} {...attrs}>{renderInline(block.replace(/\n/g, " "), mark, `${i}-`)}</p>;
      })}
    </div>
  );
}
