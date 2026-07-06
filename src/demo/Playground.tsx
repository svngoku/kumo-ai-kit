import { useEffect, useRef, useState } from "react";
import {
  ChatMessage,
  ChatThread,
  FeedbackBar,
  ModelSelect,
  ParameterSlider,
  PromptComposer,
  SourceChip,
  StreamingText,
  SystemPromptEditor,
  ThinkingIndicator,
  TokenUsageMeter,
  type MessageStatus,
  type SourceRef,
  type TokenUsage,
} from "../lib";
import {
  CANNED_REPLIES,
  DEFAULT_SYSTEM_PROMPT,
  MODELS,
  PROMPT_PRESETS,
  SOURCES,
} from "./data";

interface DemoMessage {
  id: number;
  role: "user" | "assistant" | "system";
  text: string;
  status: MessageStatus;
  time: string;
  sources?: SourceRef[];
}

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const SEED: DemoMessage[] = [
  {
    id: 1,
    role: "system",
    text: "Conversation started · Sora Large · temperature 0.7",
    status: "complete",
    time: "",
  },
  {
    id: 2,
    role: "user",
    text: "What are the quota limits on the free plan?",
    status: "complete",
    time: "14:02",
  },
  {
    id: 3,
    role: "assistant",
    text: "Free workspaces get 100K tokens per day and up to 3 active agents. Bursts beyond the allowance return a 429 with a Retry-After header instead of failing the run — so a queued retry usually just works.",
    status: "complete",
    time: "14:02",
    sources: SOURCES,
  },
];

/**
 * The living playground: a real conversation loop (thinking → streaming →
 * complete) wired to the model picker, parameter sliders and token meter.
 */
export function Playground() {
  const [messages, setMessages] = useState<DemoMessage[]>(SEED);
  const [thinking, setThinking] = useState(false);
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [usage, setUsage] = useState<TokenUsage>({
    prompt: 1_840,
    completion: 610,
  });

  const nextId = useRef(SEED.length + 1);
  const replyIndex = useRef(0);
  const thinkTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(thinkTimer.current), []);

  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];
  const streaming = thinking || messages.some((m) => m.status === "streaming");

  const send = (text: string) => {
    if (streaming) return;
    const userMessage: DemoMessage = {
      id: nextId.current++,
      role: "user",
      text,
      status: "complete",
      time: now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setThinking(true);

    thinkTimer.current = window.setTimeout(() => {
      const reply = CANNED_REPLIES[replyIndex.current % CANNED_REPLIES.length];
      const withSources = replyIndex.current % CANNED_REPLIES.length === 0;
      replyIndex.current += 1;
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: "assistant",
          text: reply,
          status: "streaming",
          time: now(),
          sources: withSources ? SOURCES : undefined,
        },
      ]);
    }, 1200);
  };

  const settle = (id: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "complete" } : m)),
    );
    setUsage((prev) => {
      const last = messages[messages.length - 1];
      const completionDelta = Math.ceil(
        (CANNED_REPLIES[(replyIndex.current - 1) % CANNED_REPLIES.length] ?? "")
          .length / 4,
      );
      const promptDelta = last ? Math.ceil(last.text.length / 4) + 24 : 48;
      return {
        ...prev,
        prompt: prev.prompt + promptDelta,
        completion: prev.completion + completionDelta,
      };
    });
  };

  const stop = () => {
    window.clearTimeout(thinkTimer.current);
    setThinking(false);
    // Skipping the reveal settles the message immediately.
    setMessages((prev) =>
      prev.map((m) => (m.status === "streaming" ? { ...m, status: "complete" } : m)),
    );
  };

  const regenerate = () => {
    if (streaming) return;
    setMessages((prev) => {
      const lastAssistant = [...prev].reverse().find((m) => m.role === "assistant");
      if (!lastAssistant) return prev;
      const reply = CANNED_REPLIES[replyIndex.current % CANNED_REPLIES.length];
      replyIndex.current += 1;
      return prev.map((m) =>
        m.id === lastAssistant.id
          ? { ...m, text: reply, status: "streaming" as const, time: now() }
          : m,
      );
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* Conversation column */}
      <div className="flex min-w-0 flex-col gap-4 rounded-3xl bg-kumo-elevated/60 p-4 ring-1 ring-kumo-hairline sm:p-6">
        <ChatThread className="h-105" contentClassName="pr-2">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              authorName={message.role === "assistant" ? "Assistant" : undefined}
              timestamp={message.time || undefined}
              status={message.status}
              animateIn={message.id > 3}
              footer={
                message.sources && message.status === "complete" ? (
                  <span className="flex flex-wrap gap-1.5">
                    {message.sources.map((source, i) => (
                      <SourceChip key={source.id} source={source} index={i + 1} />
                    ))}
                  </span>
                ) : undefined
              }
              actions={
                message.role === "assistant" && message.status === "complete" ? (
                  <FeedbackBar copyText={message.text} onRegenerate={regenerate} />
                ) : undefined
              }
            >
              {message.role === "assistant" ? (
                <StreamingText
                  text={message.text}
                  animate={message.status === "streaming"}
                  onDone={
                    message.status === "streaming"
                      ? () => settle(message.id)
                      : undefined
                  }
                />
              ) : (
                message.text
              )}
            </ChatMessage>
          ))}
          {thinking && <ThinkingIndicator showElapsed className="ml-11" />}
        </ChatThread>

        <PromptComposer
          onSubmit={send}
          streaming={streaming}
          onStop={stop}
          showTokenEstimate
          accessories={
            <ModelSelect
              models={MODELS}
              value={modelId}
              onValueChange={setModelId}
              size="xs"
            />
          }
        />
      </div>

      {/* Run controls column */}
      <aside className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 rounded-3xl bg-kumo-base p-5 ring-1 ring-kumo-hairline">
          <ParameterSlider
            label="Temperature"
            value={temperature}
            onValueChange={setTemperature}
            max={2}
            step={0.05}
            format={(v) => v.toFixed(2)}
            hint="Higher runs dreamier, lower runs stricter."
          />
          <ParameterSlider
            label="Top P"
            value={topP}
            onValueChange={setTopP}
            step={0.05}
            format={(v) => v.toFixed(2)}
          />
          <TokenUsageMeter
            usage={{ ...usage, limit: model.contextWindow }}
            label={`Context · ${model.name}`}
          />
        </div>

        <SystemPromptEditor
          value={systemPrompt}
          onValueChange={setSystemPrompt}
          presets={PROMPT_PRESETS}
          maxLength={600}
          rows={5}
        />
      </aside>
    </div>
  );
}
