import { cn, SkeletonLine } from "@cloudflare/kumo";
import {
  SparkleIcon,
  TerminalWindowIcon,
  UserIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";
import type { ChatRole, MessageStatus } from "../types";

export interface ChatMessageProps {
  role: ChatRole;
  /** Message content — plain text or your own rich/markdown renderer. */
  children?: ReactNode;
  /** Display name above assistant / tool bubbles. */
  authorName?: string;
  /** Custom avatar node; a soft role-appropriate avatar is the default. */
  avatar?: ReactNode;
  /** Meta text next to the author name, e.g. "12:04". */
  timestamp?: string;
  /** @default "complete" */
  status?: MessageStatus;
  /** Actions under the bubble (e.g. <FeedbackBar />), revealed on hover. */
  actions?: ReactNode;
  /** Footer content under the bubble (e.g. a row of <SourceChip />). */
  footer?: ReactNode;
  /** Soft entrance animation. @default true */
  animateIn?: boolean;
  className?: string;
}

function DefaultAvatar({ role }: { role: ChatRole }) {
  if (role === "assistant") {
    return (
      <span className="aikit-ai-avatar flex size-8 shrink-0 items-center justify-center rounded-full ring-1 ring-kumo-hairline">
        <SparkleIcon size={15} weight="fill" className="text-kumo-strong" />
      </span>
    );
  }
  if (role === "tool") {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-kumo-recessed ring-1 ring-kumo-hairline">
        <TerminalWindowIcon size={15} className="text-kumo-subtle" />
      </span>
    );
  }
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-kumo-recessed ring-1 ring-kumo-hairline">
      <UserIcon size={15} className="text-kumo-subtle" />
    </span>
  );
}

/**
 * A role-aware chat message row with soft, generous bubbles.
 *
 * - `user` — right-aligned tinted bubble
 * - `assistant` — avatar + raised card bubble
 * - `tool` — mono, terminal-flavored bubble
 * - `system` — centered pill
 */
export function ChatMessage({
  role,
  children,
  authorName,
  avatar,
  timestamp,
  status = "complete",
  actions,
  footer,
  animateIn = true,
  className,
}: ChatMessageProps) {
  if (role === "system") {
    return (
      <div
        className={cn(
          "flex justify-center",
          animateIn && "aikit-rise",
          className,
        )}
      >
        <span className="rounded-full bg-kumo-tint px-3.5 py-1.5 text-xs text-kumo-subtle ring-1 ring-kumo-hairline">
          {children}
        </span>
      </div>
    );
  }

  const isUser = role === "user";
  const isError = status === "error";

  const bubble = (
    <div
      className={cn(
        "max-w-full rounded-3xl px-4 py-3 text-[15px] leading-relaxed text-kumo-default",
        isUser
          ? "rounded-br-lg bg-kumo-recessed"
          : "rounded-bl-lg bg-kumo-base shadow-xs ring-1 ring-kumo-hairline",
        role === "tool" && "font-mono text-[13px]",
        isError && "bg-kumo-danger/5 ring-1 ring-kumo-danger/30",
      )}
    >
      {status === "queued" ? (
        <span className="flex w-48 max-w-full flex-col gap-2 py-1">
          <SkeletonLine />
          <SkeletonLine />
        </span>
      ) : (
        children
      )}
      {isError && (
        <span className="mt-2 flex items-center gap-1.5 text-sm text-kumo-danger">
          <WarningCircleIcon size={15} weight="fill" />
          Something went wrong generating this response.
        </span>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        "group/message flex gap-3",
        isUser && "flex-row-reverse",
        animateIn && "aikit-rise",
        className,
      )}
    >
      {avatar ?? <DefaultAvatar role={role} />}

      <div
        className={cn(
          "flex min-w-0 max-w-[85%] flex-col gap-1.5",
          isUser && "items-end",
        )}
      >
        {(authorName || timestamp) && (
          <div
            className={cn(
              "flex items-baseline gap-2 px-1",
              isUser && "flex-row-reverse",
            )}
          >
            {authorName && (
              <span className="text-[13px] font-medium text-kumo-strong">
                {authorName}
              </span>
            )}
            {timestamp && (
              <span className="text-xs text-kumo-inactive tabular-nums">
                {timestamp}
              </span>
            )}
          </div>
        )}

        {bubble}

        {footer && <div className={cn("px-1 pt-0.5")}>{footer}</div>}

        {actions && (
          <div className="px-1 opacity-0 transition-opacity duration-200 group-hover/message:opacity-100 focus-within:opacity-100">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
