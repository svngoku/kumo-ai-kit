import { cn, Meter } from "@cloudflare/kumo";
import type { TokenUsage } from "../types";

export interface TokenUsageMeterProps {
  usage: TokenUsage;
  /** @default "Context window" */
  label?: string;
  /** Ratio (0–1) where the fill turns to the warning color. @default 0.75 */
  warnAt?: number;
  /** Show the prompt / completion legend. @default true */
  showBreakdown?: boolean;
  className?: string;
}

const fmt = (n: number) => n.toLocaleString();

/**
 * Context-window / budget tracking on Kumo's Meter: the fill glides
 * from brand → warning → danger as usage approaches the limit, with a
 * quiet prompt/completion breakdown underneath.
 */
export function TokenUsageMeter({
  usage,
  label = "Context window",
  warnAt = 0.75,
  showBreakdown = true,
  className,
}: TokenUsageMeterProps) {
  const total = usage.prompt + usage.completion;
  const limit = usage.limit ?? Math.max(total, 1);
  const ratio = total / limit;

  const indicatorClassName =
    ratio >= 0.95
      ? "bg-kumo-danger"
      : ratio >= warnAt
        ? "bg-kumo-warning"
        : "bg-kumo-brand";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Meter
        label={label}
        value={Math.min(total, limit)}
        max={limit}
        customValue={
          usage.limit !== undefined
            ? `${fmt(total)} / ${fmt(limit)}`
            : `${fmt(total)} tokens`
        }
        indicatorClassName={indicatorClassName}
      />

      {showBreakdown && (
        <div className="flex items-center gap-4 text-xs text-kumo-subtle">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-kumo-brand" aria-hidden />
            Prompt
            <span className="font-mono text-kumo-inactive tabular-nums">
              {fmt(usage.prompt)}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-kumo-info" aria-hidden />
            Completion
            <span className="font-mono text-kumo-inactive tabular-nums">
              {fmt(usage.completion)}
            </span>
          </span>
          {usage.limit !== undefined && (
            <span className="ml-auto font-mono text-kumo-inactive tabular-nums">
              {Math.round(ratio * 100)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}
