import { cn, Tooltip } from "@cloudflare/kumo";
import { ArrowUpRightIcon, GlobeIcon } from "@phosphor-icons/react";
import type { SourceRef } from "../types";

export interface SourceChipProps {
  source: SourceRef;
  /** Citation number rendered in the little leading circle. */
  index?: number;
  className?: string;
}

/**
 * A soft citation chip for RAG sources — numbered, truncating, with a
 * snippet tooltip and an external-link affordance when a URL is present.
 */
export function SourceChip({ source, index, className }: SourceChipProps) {
  const isLink = Boolean(source.url);

  const body = (
    <>
      <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-kumo-recessed font-mono text-[10px] text-kumo-subtle">
        {index ?? <GlobeIcon size={10} />}
      </span>
      <span className="truncate">{source.title}</span>
      {isLink && (
        <ArrowUpRightIcon
          size={12}
          className="shrink-0 text-kumo-inactive transition-colors group-hover/chip:text-kumo-strong"
        />
      )}
    </>
  );

  const chipClass = cn(
    "group/chip inline-flex max-w-56 items-center gap-1.5 rounded-full bg-kumo-base py-1 pr-2.5 pl-1 text-xs text-kumo-strong ring-1 ring-kumo-hairline transition-colors",
    isLink && "hover:bg-kumo-tint hover:ring-kumo-line",
    className,
  );

  const chip = isLink ? (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={chipClass}
    >
      {body}
    </a>
  ) : (
    <span className={chipClass}>{body}</span>
  );

  if (!source.snippet) return chip;

  return (
    <Tooltip
      content={<span className="block max-w-64 text-xs">{source.snippet}</span>}
      render={chip}
    />
  );
}
