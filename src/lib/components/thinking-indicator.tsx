import { cn } from "@cloudflare/kumo";
import { useEffect, useState } from "react";

export interface ThinkingIndicatorProps {
  /** Label next to the dots. @default "Thinking" */
  label?: string;
  /** Tick up an elapsed-seconds counter while visible. @default false */
  showElapsed?: boolean;
  className?: string;
}

/**
 * A soft "the model is thinking" pill — three gently bobbing dots,
 * an optional label and elapsed timer. Announced politely to screen
 * readers via `role="status"`.
 */
export function ThinkingIndicator({
  label = "Thinking",
  showElapsed = false,
  className,
}: ThinkingIndicatorProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!showElapsed) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [showElapsed]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full bg-kumo-elevated py-2 pr-3.5 pl-3 ring-1 ring-kumo-hairline",
        className,
      )}
    >
      <span className="flex items-end gap-1" aria-hidden="true">
        <span className="aikit-dot size-1.5 rounded-full bg-kumo-brand" />
        <span className="aikit-dot size-1.5 rounded-full bg-kumo-brand" />
        <span className="aikit-dot size-1.5 rounded-full bg-kumo-brand" />
      </span>
      <span className="text-sm text-kumo-subtle">
        {label}
        {showElapsed && seconds > 0 && (
          <span className="text-kumo-inactive tabular-nums"> · {seconds}s</span>
        )}
      </span>
    </div>
  );
}
