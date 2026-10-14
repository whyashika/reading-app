import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { blocks, plainText } from "./markdown";

/**
 * Listen mode: reads a piece aloud with the browser's built-in voice.
 * The piece is spoken in small chunks (a sentence or two at a time), which keeps
 * some browsers from cutting off long speech and lets us highlight the paragraph
 * being read.
 */
export const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

export const SPEEDS = [1, 1.25, 1.5, 0.75] as const;

interface Chunk {
  text: string;
  /** Body block index, or -1 for the title. */
  block: number;
}

function chunksFor(title: string, body: string): Chunk[] {
  const out: Chunk[] = [{ text: title, block: -1 }];
  blocks(body).forEach((b, i) => {
    const text = plainText(b);
    const sentences = text.match(/[^.!?…]+[.!?…]+["”’)]*\s*|[^.!?…]+$/g) ?? [text];
    let buf = "";
    for (const s of sentences) {
      if (buf && (buf + s).length > 220) {
        out.push({ text: buf.trim(), block: i });
        buf = "";
      }
      buf += s;
    }
    if (buf.trim()) out.push({ text: buf.trim(), block: i });
  });
  return out;
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const en = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  return (
    en.find((v) => v.lang.toLowerCase() === "en-in") ??
    en.find((v) => v.lang.toLowerCase() === "en-gb" && /natural|google|daniel|serena|kate/i.test(v.name)) ??
    en.find((v) => v.lang.toLowerCase() === "en-gb") ??
    en.find((v) => v.default) ??
    en[0]
  );
}

export function useSpeech(title: string, body: string, onFinish: () => void) {
  const chunks = useMemo(() => chunksFor(title, body), [title, body]);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState<number>(1);
  const [failed, setFailed] = useState(false);
  // A token per run, so callbacks from a cancelled utterance are ignored.
  const run = useRef(0);
  const finish = useRef(onFinish);
  finish.current = onFinish;

  const speakFrom = useCallback(
    (start: number, rate: number) => {
      const synth = window.speechSynthesis;
      const token = ++run.current;
      synth.cancel();
      const voice = pickVoice();
      const say = (i: number) => {
        if (token !== run.current) return;
        if (i >= chunks.length) {
          setStatus("idle");
          setIndex(0);
          finish.current();
          return;
        }
        setIndex(i);
        const u = new SpeechSynthesisUtterance(chunks[i].text);
        if (voice) {
          u.voice = voice;
          u.lang = voice.lang;
        }
        u.rate = rate;
        u.onend = () => say(i + 1);
        u.onerror = (e) => {
          if (token === run.current && e.error !== "interrupted" && e.error !== "canceled") {
            setStatus("idle");
            setFailed(true);
          }
        };
        synth.speak(u);
      };
      setFailed(false);
      setStatus("playing");
      say(start);
    },
    [chunks],
  );

  // Pausing cancels and remembers where we were: true pause is unreliable on Android.
  const stopSpeaking = () => {
    run.current++;
    window.speechSynthesis.cancel();
  };

  const play = () => speakFrom(status === "paused" ? index : 0, speed);
  const pause = () => {
    stopSpeaking();
    setStatus("paused");
  };
  const stop = () => {
    stopSpeaking();
    setStatus("idle");
    setIndex(0);
  };
  const cycleSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed as (typeof SPEEDS)[number]) + 1) % SPEEDS.length];
    setSpeed(next);
    if (status === "playing") speakFrom(index, next);
  };
  const skip = (dir: 1 | -1) => {
    // Jump to the start of the next or previous paragraph.
    const cur = chunks[index]?.block ?? -1;
    let i = index;
    if (dir === 1) while (i < chunks.length && chunks[i].block === cur) i++;
    else {
      while (i > 0 && chunks[i].block === cur) i--;
      const prev = chunks[i].block;
      while (i > 0 && chunks[i - 1].block === prev) i--;
    }
    i = Math.min(Math.max(i, 0), chunks.length - 1);
    if (status === "playing") speakFrom(i, speed);
    else setIndex(i);
  };

  useEffect(() => {
    // Voices load lazily in some browsers; asking once wakes them up.
    if (speechSupported) window.speechSynthesis.getVoices();
    setStatus("idle");
    setIndex(0);
    return () => {
      run.current++;
      if (speechSupported) window.speechSynthesis.cancel();
    };
  }, [title]);

  const block = status === "idle" ? undefined : chunks[index]?.block;
  const totalBlocks = chunks[chunks.length - 1]?.block + 1;
  return { status, failed, play, pause, stop, skip, speed, cycleSpeed, block, totalBlocks };
}
