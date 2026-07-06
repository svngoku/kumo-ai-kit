import { cn } from "@cloudflare/kumo";
import {
  useStreamingText,
  type UseStreamingTextOptions,
} from "../hooks/use-streaming-text";

export interface StreamingTextProps
  extends Pick<UseStreamingTextOptions, "speed" | "onDone"> {
  /** The full text to reveal. */
  text: string;
  /** Animate the reveal; false renders the text instantly. @default true */
  animate?: boolean;
  /** Show the soft blinking caret while streaming. @default true */
  showCaret?: boolean;
  className?: string;
}

/**
 * Token-streaming text with a soft blinking caret. Give it the full
 * (or growing) response text and it reveals it at a natural pace.
 */
export function StreamingText({
  text,
  animate = true,
  showCaret = true,
  speed,
  onDone,
  className,
}: StreamingTextProps) {
  const { text: shown, done } = useStreamingText(text, {
    enabled: animate,
    speed,
    onDone,
  });

  return (
    <span
      className={cn(
        "whitespace-pre-wrap",
        showCaret && !done && "aikit-caret",
        className,
      )}
    >
      {shown}
    </span>
  );
}
