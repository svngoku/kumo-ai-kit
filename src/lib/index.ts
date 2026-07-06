/**
 * kumo-ai-kit
 * ------------------------------------------------------------------
 * A soft, high-level React component suite for building AI platforms,
 * powered by Cloudflare's Kumo design system (@cloudflare/kumo).
 *
 * Everything is styled exclusively with Kumo semantic tokens, so the
 * whole kit adapts to light/dark automatically and inherits any Kumo
 * theme you apply.
 */

// Provider
export { AiKitProvider, type AiKitProviderProps } from "./provider";

// Conversation
export { ChatMessage, type ChatMessageProps } from "./components/chat-message";
export { ChatThread, type ChatThreadProps } from "./components/chat-thread";
export {
  PromptComposer,
  type PromptComposerProps,
} from "./components/prompt-composer";
export {
  StreamingText,
  type StreamingTextProps,
} from "./components/streaming-text";
export {
  ThinkingIndicator,
  type ThinkingIndicatorProps,
} from "./components/thinking-indicator";
export { FeedbackBar, type FeedbackBarProps } from "./components/feedback-bar";
export { SourceChip, type SourceChipProps } from "./components/source-chip";

// Models & controls
export { ModelSelect, type ModelSelectProps } from "./components/model-select";
export {
  ParameterSlider,
  type ParameterSliderProps,
} from "./components/parameter-slider";
export {
  SystemPromptEditor,
  type PromptPreset,
  type SystemPromptEditorProps,
} from "./components/system-prompt-editor";

// Agents & tools
export { AgentCard, type AgentCardProps } from "./components/agent-card";
export {
  RunStatusBadge,
  type RunStatusBadgeProps,
} from "./components/run-status-badge";
export {
  ToolCallCard,
  type ToolCallCardProps,
} from "./components/tool-call-card";

// Usage & trust
export { ApiKeyField, type ApiKeyFieldProps } from "./components/api-key-field";
export {
  TokenUsageMeter,
  type TokenUsageMeterProps,
} from "./components/token-usage-meter";
export { UsageStat, type UsageStatProps } from "./components/usage-stat";

// Hooks
export {
  useStreamingText,
  type UseStreamingTextOptions,
  type UseStreamingTextResult,
} from "./hooks/use-streaming-text";

// Shared types
export type {
  AgentSummary,
  ChatRole,
  FeedbackValue,
  MessageStatus,
  ModelOption,
  RunStatus,
  SourceRef,
  TokenUsage,
  ToolCall,
  ToolCallStatus,
} from "./types";
