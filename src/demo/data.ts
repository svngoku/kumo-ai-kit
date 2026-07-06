import type {
  AgentSummary,
  ModelOption,
  SourceRef,
  ToolCall,
} from "../lib";

export const MODELS: ModelOption[] = [
  {
    id: "sora-large",
    name: "Sora Large",
    provider: "cloudflare",
    contextWindow: 200_000,
    tag: "New",
  },
  {
    id: "sora-mini",
    name: "Sora Mini",
    provider: "cloudflare",
    contextWindow: 128_000,
  },
  {
    id: "cirrus-4",
    name: "Cirrus 4",
    provider: "anthropic",
    contextWindow: 200_000,
  },
  {
    id: "stratus-o",
    name: "Stratus Omni",
    provider: "openai",
    contextWindow: 128_000,
  },
  {
    id: "nimbus-flash",
    name: "Nimbus Flash",
    provider: "google",
    contextWindow: 1_000_000,
  },
];

export const AGENTS: AgentSummary[] = [
  {
    id: "support-copilot",
    name: "Support Copilot",
    description:
      "Triages inbound tickets, drafts empathetic replies and escalates anything that smells like churn.",
    status: "running",
    model: "sora-large",
    tags: ["support", "email"],
  },
  {
    id: "docs-gardener",
    name: "Docs Gardener",
    description:
      "Walks the knowledge base nightly, prunes stale pages and rewrites anything that drifted from the source of truth.",
    status: "succeeded",
    model: "cirrus-4",
    tags: ["docs", "nightly"],
  },
  {
    id: "spend-sentry",
    name: "Spend Sentry",
    description:
      "Watches token burn across every workspace and whispers before budgets shout.",
    status: "paused",
    model: "sora-mini",
    tags: ["finops", "alerts"],
  },
];

export const TOOL_CALLS: ToolCall[] = [
  {
    id: "call_1",
    name: "search_documents",
    description: "Vector search over the workspace knowledge base",
    status: "success",
    durationMs: 412,
    args: { query: "quota limits for the free plan", top_k: 3 },
    result: {
      matches: [
        { title: "Plans & quotas", score: 0.92 },
        { title: "Rate limiting", score: 0.87 },
        { title: "Billing FAQ", score: 0.81 },
      ],
    },
  },
  {
    id: "call_2",
    name: "run_sql",
    description: "Read-only analytics query",
    status: "running",
    args: {
      database: "analytics",
      query: "SELECT model, sum(tokens) FROM usage GROUP BY 1",
    },
  },
  {
    id: "call_3",
    name: "send_notification",
    description: "Slack DM to the on-call engineer",
    status: "error",
    durationMs: 1890,
    args: { channel: "#oncall", severity: "high" },
    error: "Slack workspace token expired — reconnect the integration.",
  },
];

export const SOURCES: SourceRef[] = [
  {
    id: "s1",
    title: "Plans & quotas",
    url: "https://example.com/docs/plans",
    snippet:
      "Free plan workspaces include 100K tokens per day and up to 3 active agents.",
  },
  {
    id: "s2",
    title: "Rate limiting",
    url: "https://example.com/docs/rate-limits",
    snippet:
      "Requests beyond the burst allowance receive a 429 with a Retry-After header.",
  },
  {
    id: "s3",
    title: "Billing FAQ",
    url: "https://example.com/docs/billing",
    snippet: "Usage is metered per token and settled monthly, with soft alerts at 80%.",
  },
];

export const CANNED_REPLIES: string[] = [
  "Great question — the free plan includes 100K tokens per day, refreshed at midnight UTC.\n\nYou can run up to 3 agents concurrently, and bursts beyond the allowance return a friendly 429 rather than failing the run. If you're regularly brushing against the ceiling, the Growth plan lifts the daily quota to 5M tokens and adds budget alerts you can route to Slack.",
  "Here's the short version: streaming responses are billed on completion tokens only, and cancelled generations are pro-rated to the tokens actually produced.\n\nSo stopping a response early — like you can with the stop button below — genuinely saves budget. The usage meter on the right updates the moment a run settles.",
  "I'd suggest starting with Sora Mini for drafts and switching to Sora Large for the final pass.\n\nThe kit makes this a one-line change: the model picker, token meter and cost stats all key off the same `ModelOption`, so the whole console stays in sync when you swap models.",
];

export const PROMPT_PRESETS = [
  {
    label: "Support",
    prompt:
      "You are a warm, precise support engineer. Answer from the knowledge base, cite sources, and escalate anything involving billing disputes.",
  },
  {
    label: "Analyst",
    prompt:
      "You are a careful data analyst. Prefer SQL over intuition, show your working, and flag any query that scans more than 1M rows.",
  },
  {
    label: "Concise",
    prompt:
      "You are ruthlessly concise. Two sentences maximum unless the user explicitly asks you to elaborate.",
  },
];

export const DEFAULT_SYSTEM_PROMPT =
  "You are a helpful platform assistant. Be warm, be brief, cite sources when you use them, and never invent quota numbers.";
