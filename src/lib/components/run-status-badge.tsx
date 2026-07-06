import { Badge, cn, type BadgeVariant } from "@cloudflare/kumo";
import type { RunStatus } from "../types";

export interface RunStatusBadgeProps {
  status: RunStatus;
  /** Override the default label for the status. */
  label?: string;
  className?: string;
}

const STATUS_MAP: Record<
  RunStatus,
  { label: string; variant: BadgeVariant; pulse?: boolean }
> = {
  idle: { label: "Idle", variant: "neutral" },
  queued: { label: "Queued", variant: "neutral" },
  running: { label: "Running", variant: "blue", pulse: true },
  succeeded: { label: "Succeeded", variant: "green" },
  failed: { label: "Failed", variant: "red" },
  canceled: { label: "Canceled", variant: "neutral" },
  paused: { label: "Paused", variant: "orange" },
};

/**
 * The canonical run-state badge for agents, jobs and workflows —
 * consistent colors everywhere, with a soft pulsing dot while running.
 */
export function RunStatusBadge({ status, label, className }: RunStatusBadgeProps) {
  const config = STATUS_MAP[status];

  return (
    <Badge variant={config.variant} className={cn("gap-1.5", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "inline-block size-1.5 rounded-full bg-current",
          config.pulse && "aikit-pulse",
        )}
      />
      {label ?? config.label}
    </Badge>
  );
}
