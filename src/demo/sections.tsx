import { Banner, useKumoToastManager } from "@cloudflare/kumo";
import {
  CoinsIcon,
  GaugeIcon,
  InfoIcon,
  LightningIcon,
  StackIcon,
} from "@phosphor-icons/react";
import {
  AgentCard,
  ApiKeyField,
  RunStatusBadge,
  ToolCallCard,
  UsageStat,
  type AgentSummary,
  type RunStatus,
} from "../lib";
import { AGENTS, TOOL_CALLS } from "./data";

export const RUN_STATUSES: RunStatus[] = [
  "idle",
  "queued",
  "running",
  "succeeded",
  "failed",
  "canceled",
  "paused",
];

/** Agent fleet, tool-call inspectors and the run-state vocabulary. */
export function AgentsContent() {
  const toasts = useKumoToastManager();

  const handleRun = (agent: AgentSummary) => {
    toasts.add({
      title: `${agent.name} started`,
      description: `Running on ${agent.model} — watch the status badge flip.`,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="aikit-stagger grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onRun={handleRun} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-xl font-bold tracking-tight text-kumo-default">
            Tool calls
          </h3>
          {TOOL_CALLS.map((call, index) => (
            <ToolCallCard key={call.id} toolCall={call} defaultOpen={index === 0} />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-display text-xl font-bold tracking-tight text-kumo-default">
            Run states
          </h3>
          <div className="flex flex-col gap-4 rounded-3xl bg-kumo-base p-5 ring-1 ring-kumo-hairline">
            <p className="text-sm text-kumo-subtle">
              Every run, agent and workflow speaks the same status language:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {RUN_STATUSES.map((status) => (
                <RunStatusBadge key={status} status={status} />
              ))}
            </div>
            <p className="text-sm text-kumo-subtle">
              The running state pulses softly — enough to notice, never enough to
              distract.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Usage stat cards with sparklines, plus the budget-alert banner. */
export function UsageContent() {
  return (
    <div className="flex flex-col gap-8">
      <div className="aikit-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UsageStat
          label="Requests"
          value="48.2K"
          delta={12.4}
          deltaLabel="vs last week"
          icon={LightningIcon}
          trend={[18, 22, 21, 26, 24, 30, 33, 31, 38, 42]}
        />
        <UsageStat
          label="Tokens"
          value="9.6M"
          delta={8.1}
          deltaLabel="vs last week"
          icon={StackIcon}
          trend={[40, 42, 45, 43, 48, 47, 52, 55, 54, 60]}
        />
        <UsageStat
          label="Avg latency"
          value="842ms"
          delta={-6.3}
          deltaLabel="vs last week"
          positiveIsGood={false}
          icon={GaugeIcon}
          trend={[62, 60, 64, 58, 55, 57, 52, 50, 51, 48]}
        />
        <UsageStat
          label="Spend"
          value="$412.08"
          delta={4.9}
          deltaLabel="vs last week"
          positiveIsGood={false}
          icon={CoinsIcon}
          trend={[20, 22, 21, 24, 25, 24, 27, 28, 27, 30]}
        />
      </div>

      <Banner
        icon={<InfoIcon weight="fill" />}
        variant="secondary"
        title="Budget alerts"
        description="Soft alerts fire at 80% of budget; hard limits pause agents gracefully mid-conversation, never mid-sentence."
      />
    </div>
  );
}

/** Provider credential fields with live configured badges. */
export function CredentialsContent() {
  return (
    <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
      <ApiKeyField
        provider="OpenAI"
        defaultValue="sk-demo-1234567890abcdef"
        description="Used by Stratus models."
      />
      <ApiKeyField
        provider="Anthropic"
        placeholder="sk-ant-…"
        description="Required for Cirrus models."
      />
    </div>
  );
}
