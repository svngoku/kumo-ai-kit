import { Button, cn } from "@cloudflare/kumo";
import { ArrowDownIcon } from "@phosphor-icons/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface ChatThreadProps {
  children: ReactNode;
  /** Stick to the bottom as new content streams in. @default true */
  autoScroll?: boolean;
  /** Class for the outer (positioning) element — set the height here. */
  className?: string;
  /** Class for the inner column of messages. */
  contentClassName?: string;
}

/**
 * A conversation viewport with chat-style stick-to-bottom behavior:
 * it follows streaming content while you're at the bottom, stays put
 * while you read history, and offers a soft "jump to latest" pill.
 */
export function ChatThread({
  children,
  autoScroll = true,
  className,
  contentClassName,
}: ChatThreadProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef(true);
  const [pinned, setPinned] = useState(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = viewportRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const handleScroll = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nowPinned = distance < 56;
    pinnedRef.current = nowPinned;
    setPinned(nowPinned);
  }, []);

  useEffect(() => {
    if (!autoScroll) return;
    const el = viewportRef.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      if (pinnedRef.current) {
        el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
      }
    });
    observer.observe(el, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [autoScroll]);

  return (
    <div className={cn("relative min-h-0", className)}>
      <div
        ref={viewportRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto overscroll-contain px-1 [scrollbar-width:thin]"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 20px, black 100%)",
        }}
      >
        <div className={cn("flex flex-col gap-5 py-4", contentClassName)}>
          {children}
        </div>
      </div>

      {!pinned && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center">
          <Button
            variant="secondary"
            size="xs"
            icon={ArrowDownIcon}
            className="rounded-full shadow-md"
            onClick={() => scrollToBottom()}
          >
            Latest
          </Button>
        </div>
      )}
    </div>
  );
}
