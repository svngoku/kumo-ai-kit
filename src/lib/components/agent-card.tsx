import { Button, cn } from "@cloudflare/kumo";
import { PlayIcon, RobotIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import type { AgentSummary } from "../types";
import { RunStatusBadge } from "./run-status-badge";

export interface AgentCardProps {
  agent: AgentSummary;
  onRun?: (agent: AgentSummary) => void;
  /** @default "Run" */
  runLabel?: string;
  /** Extra header actions — e.g. a Kumo DropdownMenu trigger. */
  actions?: ReactNode;
  /** Replaces the default footer (tags + run button). */
  footer?: ReactNode;
  className?: string;
}

/**
 * A soft agent tile: aura icon, name, model, status, description,
 * tag chips and a run action. Lifts gently on hover.
 */
export function AgentCard({
  agent,
  onRun,
  runLabel = "Run",
  actions,
  footer,
  className,
}: AgentCardProps) {
  return (
    <article
      className={cn(
        "group/agent flex flex-col gap-4 rounded-3xl bg-kumo-base p-5 ring-1 ring-kumo-hairline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <header className="flex items-start gap-3">
        <span className="aikit-ai-avatar flex size-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-kumo-hairline">
          {agent.icon ?? <RobotIcon size={20} className="text-kumo-strong" />}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-kumo-default">{agent.name}</h3>
          {agent.model && (
            <p className="truncate font-mono text-xs text-kumo-inactive">
              {agent.model}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {agent.status && <RunStatusBadge status={agent.status} />}
          {actions}
        </div>
      </header>

      {agent.description && (
        <p className="line-clamp-2 text-sm leading-relaxed text-kumo-subtle">
          {agent.description}
        </p>
      )}

      {footer ?? (
        <footer className="mt-auto flex items-center gap-1.5 pt-1">
          {agent.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-kumo-tint px-2.5 py-0.5 text-xs text-kumo-subtle"
            >
              {tag}
            </span>
          ))}
          {onRun && (
            <Button
              variant="primary"
              size="sm"
              icon={PlayIcon}
              className="ml-auto"
              onClick={() => onRun(agent)}
            >
              {runLabel}
            </Button>
          )}
        </footer>
      )}
    </article>
  );
}
