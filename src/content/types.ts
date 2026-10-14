export const SUBJECTS = ["Finance", "Economics", "Philosophy", "Law", "Sustainability", "Tech", "History", "Culture"] as const;
export type Subject = (typeof SUBJECTS)[number];

export type Format = "Story" | "Explainer" | "News breakdown";

/** 1 = "No background needed", 2 = "Builds on basics", 3 = "Deeper dive" */
export type Difficulty = 1 | 2 | 3;

export interface CheckInOption {
  text: string;
  isCorrect: boolean;
  /** Shown when the reader picks this option, right or wrong. */
  explanation: string;
}

export interface Piece {
  /** Unique, URL-friendly id, e.g. "carbon-credits". Used in links and in readThisFirst. */
  id: string;
  title: string;
  /** One or more subjects. Acts as the genre, and decides which map line(s) the piece sits on. */
  subject: Subject[];
  format: Format;
  /** 1–2 sentences. */
  blurb: string;
  themes: string[];
  /** The piece itself. Separate paragraphs with a blank line. Supports **bold**, *italic*, [links](https://…), "## Headings", "> quotes" and "- lists". */
  body: string;
  /** Minutes. Leave out to have it calculated from the body's length. */
  readingTime?: number;
  difficulty: Difficulty;
  /** ids of pieces a reader should ideally read before this one. */
  readThisFirst?: string[];
  realWorldHook?: { text: string; type: "Timely" | "Evergreen" };
  series?: { name: string; part: number; totalParts: number };
  /** HIDDEN: never shown to readers. Used only to find related pieces. */
  keyTerms: string[];
  checkIn: { question: string; options: CheckInOption[] };
  /** "YYYY-MM-DD" */
  publishedDate: string;
  /** Marks sample content. Shows a small "Placeholder" tag. Delete the line (or set false) on real pieces. */
  placeholder?: boolean;
}
