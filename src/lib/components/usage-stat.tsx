import { cn } from "@cloudflare/kumo";
import { TrendDownIcon, TrendUpIcon, type Icon } from "@phosphor-icons/react";
import { useId, type ReactNode } from "react";

export interface UsageStatProps {
  /** e.g. "Requests", "Tokens burned", "Avg latency", "Spend". */
  label: string;
  /** Pre-formatted headline value, e.g. "1.2M" or "$412.08". */
  value: ReactNode;
  /** Signed percentage change, e.g. 12.4 or -3.1. */
  delta?: number;
  /** Context for the delta, e.g. "vs last week". */
  deltaLabel?: string;
  /** Whether an increase is good — flips delta colors. @default true */
  positiveIsGood?: boolean;
  icon?: Icon;
  /** Sparkline values (any scale) — rendered as a soft brand line. */
  trend?: number[];
  className?: string;
}

function Sparkline({ values }: { values: number[] }) {
  // SVG-safe unique id (React 19 useId may contain non-alphanumeric chars)
  const gradientId = `aikit-spark-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = 100 / (values.length - 1);

  const points = values
    .map((v, i) => `${(i * step).toFixed(2)},${(28 - ((v - min) / range) * 24 + 2).toFixed(2)}`)
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-8 w-full text-kumo-brand"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.22} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={`0,32 ${points} 100,32`} fill={`url(#${gradientId})`} />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * A soft dashboard stat card — label, headline value, colored delta
 * with direction icon, and an optional dependency-free sparkline.
 */
export function UsageStat({
  label,
  value,
  delta,
  deltaLabel,
  positiveIsGood = true,
  icon: IconComponent,
  trend,
  className,
}: UsageStatProps) {
  const isGood = delta !== undefined && (delta >= 0) === positiveIsGood;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-3xl bg-kumo-base p-5 ring-1 ring-kumo-hairline",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        {IconComponent && (
          <span className="flex size-8 items-center justify-center rounded-xl bg-kumo-recessed">
            <IconComponent size={16} className="text-kumo-strong" />
          </span>
        )}
        <span className="text-sm text-kumo-subtle">{label}</span>
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="text-2xl font-semibold tracking-tight text-kumo-default tabular-nums">
          {value}
        </span>
        {delta !== undefined && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-sm font-medium tabular-nums",
              isGood ? "text-kumo-success" : "text-kumo-danger",
            )}
          >
            {delta >= 0 ? <TrendUpIcon size={14} /> : <TrendDownIcon size={14} />}
            {Math.abs(delta).toLocaleString(undefined, { maximumFractionDigits: 1 })}%
          </span>
        )}
        {deltaLabel && (
          <span className="text-xs text-kumo-inactive">{deltaLabel}</span>
        )}
      </div>

      {trend && <Sparkline values={trend} />}
    </div>
  );
}
