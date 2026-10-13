import { Fragment, type ReactNode } from "react";

/**
 * A deliberately tiny markdown renderer for piece bodies.
 * Blocks: paragraphs (blank-line separated), "## heading", "> quote", "- list".
 * Inline: **bold**, *italic*, [link](url).
 */
const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

export function renderInline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link)
      return (
        <a key={i} href={link[2]} target="_blank" rel="noreferrer">
          {link[1]}
        </a>
      );
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function blocks(body: string): string[] {
  return body
    .trim()
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
}

export function Markdown({ body, className }: { body: string; className?: string }) {
  return (
    <div className={className}>
      {blocks(body).map((block, i) => {
        if (block.startsWith("## ")) return <h2 key={i}>{renderInline(block.slice(3))}</h2>;
        if (block.startsWith(">"))
          return <blockquote key={i}>{renderInline(block.replace(/^>\s?/gm, ""))}</blockquote>;
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-*]\s/.test(l)))
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^\s*[-*]\s/, ""))}</li>
              ))}
            </ul>
          );
        return <p key={i}>{renderInline(block.replace(/\n/g, " "))}</p>;
      })}
    </div>
  );
}
