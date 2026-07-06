import { Button, cn, Tooltip } from "@cloudflare/kumo";
import { ArrowUpIcon, StopIcon } from "@phosphor-icons/react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export interface PromptComposerProps {
  /** Controlled value; leave undefined for uncontrolled usage. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the trimmed prompt when the user submits. */
  onSubmit?: (value: string) => void;
  /** While true the send button becomes a soft stop button. */
  streaming?: boolean;
  onStop?: () => void;
  disabled?: boolean;
  /** @default "Ask anything…" */
  placeholder?: string;
  /** Show a rough token estimate (~4 chars per token). @default false */
  showTokenEstimate?: boolean;
  /** Bottom-left slot: model select, attachment button, etc. */
  accessories?: ReactNode;
  /** Keyboard hint. @default "Enter to send · Shift + Enter for a new line" */
  hint?: string;
  autoFocus?: boolean;
  className?: string;
}

const estimateTokens = (text: string) => Math.ceil(text.length / 4);

/**
 * The centerpiece input of an AI product: a soft, rounded composer with
 * an auto-growing textarea, accessory slots, a token estimate and a
 * send button that morphs into a stop button while streaming.
 *
 * Enter submits · Shift+Enter inserts a newline.
 */
export function PromptComposer({
  value,
  defaultValue,
  onValueChange,
  onSubmit,
  streaming = false,
  onStop,
  disabled = false,
  placeholder = "Ask anything…",
  showTokenEstimate = false,
  accessories,
  hint = "Enter to send · Shift + Enter for a new line",
  autoFocus = false,
  className,
}: PromptComposerProps) {
  const [inner, setInner] = useState(defaultValue ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const text = value ?? inner;

  const setText = (next: string) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  // Auto-grow the textarea with its content
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 192)}px`;
  }, [text]);

  const canSend = !disabled && !streaming && text.trim().length > 0;

  const submit = () => {
    if (!canSend) return;
    const trimmed = text.trim();
    onSubmit?.(trimmed);
    setText("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-3xl bg-kumo-base p-3 shadow-xs ring-1 ring-kumo-hairline transition-shadow duration-200 focus-within:shadow-md focus-within:ring-2 focus-within:ring-kumo-brand/50",
        disabled && "opacity-60",
        className,
      )}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        disabled={disabled}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Prompt"
        className="max-h-48 min-h-11 w-full resize-none bg-transparent px-1.5 pt-1.5 text-[15px] leading-6 text-kumo-default outline-none placeholder:text-kumo-placeholder"
      />

      <div className="flex items-center gap-2">
        {accessories}
        <div className="ml-auto flex items-center gap-3">
          {showTokenEstimate && text.length > 0 && (
            <span className="text-xs text-kumo-inactive tabular-nums">
              ~{estimateTokens(text).toLocaleString()} tokens
            </span>
          )}
          {hint && (
            <span className="hidden text-xs text-kumo-inactive sm:block">
              {hint}
            </span>
          )}
          {streaming ? (
            <Tooltip
              content="Stop generating"
              render={
                <Button
                  variant="secondary"
                  shape="circle"
                  icon={StopIcon}
                  aria-label="Stop generating"
                  className="aikit-pulse aikit-press text-kumo-danger"
                  onClick={onStop}
                />
              }
            />
          ) : (
            <Button
              variant="primary"
              shape="circle"
              icon={ArrowUpIcon}
              aria-label="Send prompt"
              disabled={!canSend}
              className="aikit-press"
              onClick={submit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
