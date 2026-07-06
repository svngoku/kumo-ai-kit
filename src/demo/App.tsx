import {
  Badge,
  Banner,
  Button,
  ClipboardText,
  Text,
  useKumoToastManager,
} from "@cloudflare/kumo";
import {
  CloudIcon,
  CoinsIcon,
  GaugeIcon,
  GithubLogoIcon,
  InfoIcon,
  LightningIcon,
  MoonIcon,
  StackIcon,
  SunIcon,
} from "@phosphor-icons/react";
import { useEffect, useState, type ReactNode } from "react";
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
import { Playground } from "./Playground";

export const REPO_URL = "https://github.com/svngoku/kumo-ai-kit";

const RUN_STATUSES: RunStatus[] = [
  "idle",
  "queued",
  "running",
  "succeeded",
  "failed",
  "canceled",
  "paused",
];

function useThemeMode() {
  const [mode, setMode] = useState<"light" | "dark">(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  return { mode, toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")) };
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div id={id} className="flex scroll-mt-24 flex-col gap-2">
      <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-kumo-subtle uppercase">
        <span className="size-1.5 rounded-full bg-kumo-brand" aria-hidden />
        {eyebrow}
      </span>
      <Text variant="heading2" as="h2">
        {title}
      </Text>
      <p className="max-w-2xl text-[15px] leading-relaxed text-kumo-subtle">
        {description}
      </p>
    </div>
  );
}

function Section({ children }: { children: ReactNode }) {
  return <section className="flex flex-col gap-8">{children}</section>;
}

export function App() {
  const { mode, toggle } = useThemeMode();
  const toasts = useKumoToastManager();

  const handleRun = (agent: AgentSummary) => {
    toasts.add({
      title: `${agent.name} started`,
      description: `Running on ${agent.model} — watch the status badge flip.`,
    });
  };

  return (
    <div className="min-h-screen bg-kumo-canvas text-kumo-default">
      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-40 border-b border-kumo-hairline bg-kumo-canvas/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="aikit-ai-avatar flex size-8 items-center justify-center rounded-xl ring-1 ring-kumo-hairline">
              <CloudIcon size={17} weight="fill" className="text-kumo-strong" />
            </span>
            <span className="font-semibold tracking-tight">Kumo AI Kit</span>
            <Badge variant="beta">v0.1</Badge>
          </a>

          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {[
              ["Playground", "#playground"],
              ["Agents & tools", "#agents"],
              ["Usage", "#usage"],
              ["Credentials", "#credentials"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-3 py-1.5 text-sm text-kumo-subtle transition-colors hover:bg-kumo-tint hover:text-kumo-default"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="ghost"
              shape="square"
              size="sm"
              aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggle}
            >
              {mode === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            </Button>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="flex size-8 items-center justify-center rounded-lg text-kumo-subtle transition-colors hover:bg-kumo-tint hover:text-kumo-default"
            >
              <GithubLogoIcon size={17} />
            </a>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <div id="top" className="relative overflow-hidden">
        <div className="aikit-halo pointer-events-none absolute inset-x-0 top-0 h-80" aria-hidden />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 pt-20 pb-16 text-center sm:px-6">
          <Badge variant="outline">Built on Cloudflare's Kumo design system</Badge>
          <div className="max-w-3xl text-balance">
            <Text variant="heading1" as="h1">
              Soft components for building AI platforms
            </Text>
          </div>
          <p className="max-w-xl text-balance text-[17px] leading-relaxed text-kumo-subtle">
            Sixteen gentle, high-level React components — chat, streaming, agents,
            tool calls, usage and credentials — styled entirely with Kumo semantic
            tokens, so light and dark just work.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ClipboardText text="npm install kumo-ai-kit @cloudflare/kumo" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-kumo-inactive">
            <span>React 19</span>
            <span aria-hidden>·</span>
            <span>TypeScript</span>
            <span aria-hidden>·</span>
            <span>Tailwind v4 tokens</span>
            <span aria-hidden>·</span>
            <span>MIT</span>
          </div>
        </div>
      </div>

      {/* ---------- Sections ---------- */}
      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-4 pb-28 sm:px-6">
        <Section>
          <SectionHeading
            id="playground"
            eyebrow="Conversation"
            title="A living playground"
            description="ChatThread, ChatMessage, StreamingText, ThinkingIndicator, SourceChip, FeedbackBar, PromptComposer, ModelSelect, ParameterSlider, SystemPromptEditor and TokenUsageMeter — one working loop. Send something."
          />
          <Playground />
        </Section>

        <Section>
          <SectionHeading
            id="agents"
            eyebrow="Agents & tools"
            title="Fleet at a glance"
            description="AgentCard tiles with soft auras and live status, ToolCallCard inspectors for every invocation, and one RunStatusBadge vocabulary across the whole platform."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {AGENTS.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onRun={handleRun} />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Text variant="heading3" as="h3">
                Tool calls
              </Text>
              {TOOL_CALLS.map((call, index) => (
                <ToolCallCard key={call.id} toolCall={call} defaultOpen={index === 0} />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Text variant="heading3" as="h3">
                Run states
              </Text>
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
                  The running state pulses softly — enough to notice, never enough
                  to distract.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section>
          <SectionHeading
            id="usage"
            eyebrow="Usage & billing"
            title="Numbers that stay calm"
            description="UsageStat cards with deltas and dependency-free sparklines. Latency and spend flip their colors — because down is good there."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        </Section>

        <Section>
          <SectionHeading
            id="credentials"
            eyebrow="Trust"
            title="Credentials, handled gently"
            description="ApiKeyField wraps Kumo's SensitiveInput — masked by default, reveal on click, copy on hover — with a live configured badge."
          />

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
        </Section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-kumo-hairline">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-8 text-sm text-kumo-subtle sm:px-6">
          <span className="flex items-center gap-2">
            <CloudIcon size={15} weight="fill" className="text-kumo-brand" />
            kumo-ai-kit · MIT
          </span>
          <a
            href="https://kumo-ui.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kumo-link hover:underline"
          >
            Kumo docs
          </a>
          <a
            href="https://github.com/cloudflare/kumo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kumo-link hover:underline"
          >
            @cloudflare/kumo
          </a>
          <span className="ml-auto text-xs text-kumo-inactive">
            Every color on this page is a Kumo semantic token.
          </span>
        </div>
      </footer>
    </div>
  );
}
