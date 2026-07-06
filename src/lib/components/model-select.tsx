import { Badge, cn, Select } from "@cloudflare/kumo";
import type { ModelOption } from "../types";

export interface ModelSelectProps {
  models: ModelOption[];
  value?: string;
  onValueChange?: (modelId: string) => void;
  /** Visible label above the control (screen-reader only by default). */
  label?: string;
  hideLabel?: boolean;
  size?: "xs" | "sm" | "base" | "lg";
  disabled?: boolean;
  className?: string;
}

const PROVIDER_DOTS: Record<string, string> = {
  openai: "bg-kumo-success",
  anthropic: "bg-kumo-warning",
  google: "bg-kumo-info",
  meta: "bg-kumo-brand",
  mistral: "bg-kumo-danger",
  cloudflare: "bg-kumo-brand",
};

function providerDot(provider?: string) {
  return (provider && PROVIDER_DOTS[provider.toLowerCase()]) || "bg-kumo-contrast";
}

function formatContext(tokens?: number) {
  if (!tokens) return null;
  return tokens >= 1_000_000
    ? `${(tokens / 1_000_000).toLocaleString()}M ctx`
    : `${Math.round(tokens / 1000)}K ctx`;
}

/**
 * A model picker with provider-colored dots, context-window hints and
 * optional "New"/"Fastest" tags — built straight on Kumo's Select.
 */
export function ModelSelect({
  models,
  value,
  onValueChange,
  label = "Model",
  hideLabel = true,
  size = "sm",
  disabled,
  className,
}: ModelSelectProps) {
  const items = models.map((model) => ({
    value: model.id,
    label: (
      <span className="flex items-center gap-2">
        <span
          className={cn("size-1.5 shrink-0 rounded-full", providerDot(model.provider))}
        />
        <span className="truncate">{model.name}</span>
        {model.tag && <Badge variant="beta">{model.tag}</Badge>}
        {model.contextWindow && (
          <span className="ml-auto pl-3 text-xs text-kumo-inactive tabular-nums">
            {formatContext(model.contextWindow)}
          </span>
        )}
      </span>
    ),
  }));

  const renderValue = (id: string) => {
    const model = models.find((m) => m.id === id);
    if (!model) return id;
    return (
      <span className="flex items-center gap-2">
        <span
          className={cn("size-1.5 shrink-0 rounded-full", providerDot(model.provider))}
        />
        <span className="truncate">{model.name}</span>
      </span>
    );
  };

  return (
    <span
      className={cn(
        "inline-flex",
        // Kumo's Select renders a visible label element even when
        // hideLabel is set (an sr-only copy exists for a11y) — hide it.
        hideLabel && "[&_[id$=-label]]:hidden",
      )}
    >
      <Select
        label={label}
        hideLabel={hideLabel}
        size={size}
        disabled={disabled}
        items={items}
        value={value}
        renderValue={renderValue}
        onValueChange={(next) => {
          if (typeof next === "string") onValueChange?.(next);
        }}
        className={cn("rounded-full", className)}
      />
    </span>
  );
}
