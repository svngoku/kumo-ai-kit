import { useEffect, useRef, useState } from "react";

export interface UseStreamingTextOptions {
  /** Stream the text in (true) or reveal it instantly (false). @default true */
  enabled?: boolean;
  /** Approximate characters revealed per second. @default 280 */
  speed?: number;
  /** Called exactly once when the full text has been revealed. */
  onDone?: () => void;
}

export interface UseStreamingTextResult {
  /** The portion of the text revealed so far. */
  text: string;
  /** True once the full text is visible. */
  done: boolean;
}

/**
 * Progressively reveals `text`, character by character, at a natural
 * reading pace — the classic "model is typing" effect. Restarts whenever
 * `text` changes; renders instantly when `enabled` is false.
 */
export function useStreamingText(
  text: string,
  { enabled = true, speed = 280, onDone }: UseStreamingTextOptions = {},
): UseStreamingTextResult {
  const [count, setCount] = useState(() => (enabled ? 0 : text.length));
  const notifiedRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    notifiedRef.current = false;

    if (!enabled) {
      setCount(text.length);
      return;
    }

    setCount(0);
    let frame = 0;
    let last = performance.now();
    let progress = 0;

    const tick = (now: number) => {
      progress += ((now - last) / 1000) * speed;
      last = now;
      const next = Math.min(text.length, Math.floor(progress));
      setCount(next);
      if (next < text.length) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, enabled, speed]);

  const done = count >= text.length;

  useEffect(() => {
    if (done && !notifiedRef.current) {
      notifiedRef.current = true;
      onDoneRef.current?.();
    }
  }, [done]);

  return { text: text.slice(0, count), done };
}
