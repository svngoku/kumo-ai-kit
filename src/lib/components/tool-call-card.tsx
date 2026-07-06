import { Badge, cn, CodeBlock, Collapsible, Loader } from "@cloudflare/kumo";
import {
  CaretDownIcon,
  CheckCircleIcon,
  ClockIcon,
  WarningCircleIcon,
  WrenchIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import type { ToolCall, ToolCallStatus } from "../types";

export interface ToolCallCardProps {
  toolCall: ToolCall;
  /** @default false */
  defaultOpen?: boolean;
  className?: string;
}

function StatusGlyph({ status }: { status: ToolCallStatus }) {
  switch (status) {
    case "running":
      return <Loader size={14} />;
    case "success":
      return (
        <CheckCircleIcon size={16} weight="fill" className="text-kumo-success" />
      );
    case "error":
      return (
        <WarningCircleIcon size={16} weight="fill" className="text-kumo-danger" />
      );
    default:
      return <ClockIcon size={15} className="text-kumo-inactive" />;
  }
}

function formatDuration(ms?: number) {
  if (ms === undefined) return null;
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

function toJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return String(value);
  }
}

/**
 * A collapsible inspector for a model's tool invocation: name, live
 * status, duration — and pretty-printed arguments/results inside.
 */
export function ToolCallCard({
  toolCall,
  defaultOpen = false,
  className,
}: ToolCallCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const duration = formatDuration(toolCall.durationMs);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className={cn(
        "overflow-hidden rounded-2xl bg-kumo-base ring-1 ring-kumo-hairline",
        className,
      )}
    >
      <Collapsible.Trigger className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-kumo-tint">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-kumo-recessed">
          <WrenchIcon size={15} className="text-kumo-strong" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate font-mono text-[13px] font-medium text-kumo-default">
            {toolCall.name}
          </span>
          {toolCall.description && (
            <span className="block truncate text-xs text-kumo-subtle">
              {toolCall.description}
            </span>
          )}
        </span>

        {duration && (
          <span className="shrink-0 font-mono text-xs text-kumo-inactive tabular-nums">
            {duration}
          </span>
        )}
        {toolCall.status === "running" && <Badge variant="blue">Running</Badge>}
        <StatusGlyph status={toolCall.status} />
        <CaretDownIcon
          size={14}
          className={cn(
            "shrink-0 text-kumo-inactive transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </Collapsible.Trigger>

      <Collapsible.Panel>
        <div className="flex flex-col gap-3 border-t border-kumo-hairline px-4 py-3.5">
          {toolCall.args !== undefined && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium tracking-wide text-kumo-inactive uppercase">
                Arguments
              </span>
              <CodeBlock code={toJson(toolCall.args)} lang="jsonc" />
            </div>
          )}

          {toolCall.status === "error" && toolCall.error && (
            <p className="flex items-start gap-1.5 text-sm text-kumo-danger">
              <WarningCircleIcon size={15} weight="fill" className="mt-0.5 shrink-0" />
              {toolCall.error}
            </p>
          )}

          {toolCall.result !== undefined && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium tracking-wide text-kumo-inactive uppercase">
                Result
              </span>
              {typeof toolCall.result === "string" ? (
                <p className="rounded-lg bg-kumo-recessed/60 p-3 text-[13px] leading-relaxed text-kumo-strong">
                  {toolCall.result}
                </p>
              ) : (
                <CodeBlock code={toJson(toolCall.result)} lang="jsonc" />
              )}
            </div>
          )}
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
