import { Button, cn } from "@cloudflare/kumo";
import { useId } from "react";

export interface PromptPreset {
  label: string;
  prompt: string;
}

export interface SystemPromptEditorProps {
  value: string;
  onValueChange?: (value: string) => void;
  /** @default "System prompt" */
  label?: string;
  description?: string;
  /** One-click starting points rendered as soft chips. */
  presets?: PromptPreset[];
  /** @default 5 */
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * A soft card for editing an agent's system prompt: mono editing surface,
 * live character count and one-click preset chips.
 */
export function SystemPromptEditor({
  value,
  onValueChange,
  label = "System prompt",
  description,
  presets,
  rows = 5,
  maxLength,
  disabled,
  className,
}: SystemPromptEditorProps) {
  const id = useId();
  const overLimit = maxLength !== undefined && value.length > maxLength;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl bg-kumo-base p-4 ring-1 ring-kumo-hairline focus-within:ring-kumo-line",
        disabled && "opacity-60",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-kumo-default">
          {label}
        </label>
        <span
          className={cn(
            "text-xs tabular-nums",
            overLimit ? "text-kumo-danger" : "text-kumo-inactive",
          )}
        >
          {value.length.toLocaleString()}
          {maxLength !== undefined && ` / ${maxLength.toLocaleString()}`}
        </span>
      </div>

      {description && <p className="text-xs text-kumo-subtle">{description}</p>}

      <textarea
        id={id}
        rows={rows}
        value={value}
        disabled={disabled}
        onChange={(event) => onValueChange?.(event.target.value)}
        spellCheck={false}
        className="w-full resize-y rounded-lg bg-kumo-recessed/60 p-3 font-mono text-[13px] leading-relaxed text-kumo-default outline-none placeholder:text-kumo-placeholder"
        placeholder="You are a helpful assistant…"
      />

      {presets && presets.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-kumo-inactive">Presets</span>
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="xs"
              disabled={disabled}
              className="rounded-full"
              onClick={() => onValueChange?.(preset.prompt)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
