import { Button, cn, Tooltip } from "@cloudflare/kumo";
import {
  ArrowsClockwiseIcon,
  CheckIcon,
  CopyIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@phosphor-icons/react";
import { useRef, useState } from "react";
import type { FeedbackValue } from "../types";

export interface FeedbackBarProps {
  /** Fires with "up", "down" — or null when the user un-selects. */
  onFeedback?: (value: FeedbackValue | null) => void;
  /** Text copied to the clipboard by the copy action. */
  copyText?: string;
  onRegenerate?: () => void;
  className?: string;
}

/**
 * Quiet response actions for assistant messages: thumbs up/down with
 * a filled selected state, copy-with-confirmation and regenerate.
 */
export function FeedbackBar({
  onFeedback,
  copyText,
  onRegenerate,
  className,
}: FeedbackBarProps) {
  const [selected, setSelected] = useState<FeedbackValue | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | undefined>(undefined);

  const choose = (next: FeedbackValue) => {
    const resolved = selected === next ? null : next;
    setSelected(resolved);
    onFeedback?.(resolved);
  };

  const copy = async () => {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (permissions / insecure context) — stay quiet.
    }
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      <Tooltip
        content="Good response"
        render={
          <Button
            variant="ghost"
            size="xs"
            shape="square"
            aria-label="Good response"
            aria-pressed={selected === "up"}
            onClick={() => choose("up")}
          >
            <ThumbsUpIcon
              size={14}
              weight={selected === "up" ? "fill" : "regular"}
              className={selected === "up" ? "text-kumo-success" : undefined}
            />
          </Button>
        }
      />
      <Tooltip
        content="Needs work"
        render={
          <Button
            variant="ghost"
            size="xs"
            shape="square"
            aria-label="Bad response"
            aria-pressed={selected === "down"}
            onClick={() => choose("down")}
          >
            <ThumbsDownIcon
              size={14}
              weight={selected === "down" ? "fill" : "regular"}
              className={selected === "down" ? "text-kumo-danger" : undefined}
            />
          </Button>
        }
      />
      {copyText !== undefined && (
        <Tooltip
          content={copied ? "Copied!" : "Copy response"}
          render={
            <Button
              variant="ghost"
              size="xs"
              shape="square"
              aria-label="Copy response"
              onClick={copy}
            >
              {copied ? (
                <CheckIcon size={14} className="text-kumo-success" />
              ) : (
                <CopyIcon size={14} />
              )}
            </Button>
          }
        />
      )}
      {onRegenerate && (
        <Tooltip
          content="Regenerate"
          render={
            <Button
              variant="ghost"
              size="xs"
              shape="square"
              aria-label="Regenerate response"
              onClick={onRegenerate}
            >
              <ArrowsClockwiseIcon size={14} />
            </Button>
          }
        />
      )}
    </div>
  );
}
