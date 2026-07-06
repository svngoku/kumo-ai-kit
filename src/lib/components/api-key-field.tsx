import { Badge, cn, SensitiveInput } from "@cloudflare/kumo";
import { useState, type ChangeEvent } from "react";

export interface ApiKeyFieldProps {
  /** @default "API key" */
  label?: string;
  /** Provider name for the status line, e.g. "OpenAI". */
  provider?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  description?: string;
  /** @default "sk-…" */
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * A provider-credential field built on Kumo's SensitiveInput (masked by
 * default, click to reveal, copy on hover) with a live Configured /
 * Not set badge. Credentials never need custom plumbing again.
 */
export function ApiKeyField({
  label = "API key",
  provider,
  value,
  defaultValue,
  onValueChange,
  description,
  placeholder = "sk-…",
  error,
  disabled,
  className,
}: ApiKeyFieldProps) {
  const [inner, setInner] = useState(defaultValue ?? "");
  const current = value ?? inner;
  const configured = current.trim().length > 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <SensitiveInput
        label={
          <span className="flex items-center gap-2">
            {provider ? `${provider} ${label}` : label}
            <Badge variant={configured ? "green" : "outline"}>
              {configured ? "Configured" : "Not set"}
            </Badge>
          </span>
        }
        placeholder={placeholder}
        description={description}
        error={error}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        autoComplete="off"
      />
    </div>
  );
}
