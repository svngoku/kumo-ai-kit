import { Badge, Button, ClipboardText } from "@cloudflare/kumo";
import {
  CloudIcon,
  GithubLogoIcon,
  MoonIcon,
  SquaresFourIcon,
  SunIcon,
} from "@phosphor-icons/react";
import { useEffect, useState, type ReactNode } from "react";
import { Console } from "./Console";
import { Playground } from "./Playground";
import { AgentsContent, CredentialsContent, UsageContent } from "./sections";

export const REPO_URL = "https://github.com/svngoku/kumo-ai-kit";

function useThemeMode() {
  const [mode, setMode] = useState<"light" | "dark">(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  return { mode, toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")) };
}

function useHashRoute() {
  const read = () =>
    typeof window !== "undefined" && window.location.hash === "#console"
      ? ("console" as const)
      : ("home" as const);

  const [route, setRoute] = useState<"home" | "console">(read);

  useEffect(() => {
    const onHashChange = () => setRoute(read());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
}

function SectionHeading({
  id,
  num,
  eyebrow,
  title,
  description,
}: {
  id: string;
  num: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <div id={id} className="relative flex scroll-mt-24 flex-col gap-2">
      {/* Grid-breaking ghost numeral */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -top-12 -left-3 text-[6rem] leading-none font-extrabold tracking-tighter text-kumo-default opacity-5 select-none sm:-top-16 sm:text-[8rem]"
      >
        {num}
      </span>
      <span className="relative flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.12em] text-kumo-subtle uppercase">
        <span className="size-1.5 rounded-full bg-kumo-brand" aria-hidden />
        <span className="text-kumo-inactive tabular-nums">{num}</span>
        {eyebrow}
      </span>
      <h2 className="font-display relative text-3xl font-bold tracking-tight text-kumo-default">
        {title}
      </h2>
      <p className="relative max-w-2xl text-[15px] leading-relaxed text-kumo-subtle">
        {description}
      </p>
    </div>
  );
}

function Section({ children }: { children: ReactNode }) {
  return <section className="flex flex-col gap-8">{children}</section>;
}

export function App() {
  const { mode, toggle } = useThemeMode();
  const route = useHashRoute();

  if (route === "console") {
    return (
      <Console
        mode={mode}
        onToggleTheme={toggle}
        onExit={() => {
          window.location.hash = "";
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-kumo-canvas text-kumo-default">
      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-40 border-b border-kumo-hairline bg-kumo-canvas/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="aikit-ai-avatar flex size-8 items-center justify-center rounded-xl ring-1 ring-kumo-hairline">
              <CloudIcon size={17} weight="fill" className="text-kumo-strong" />
            </span>
            <span className="font-display font-bold tracking-tight">Kumo AI Kit</span>
            <Badge variant="beta">v0.1</Badge>
          </a>

          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {[
              ["Playground", "#playground"],
              ["Agents & tools", "#agents"],
              ["Usage", "#usage"],
              ["Credentials", "#credentials"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-3 py-1.5 text-sm text-kumo-subtle transition-colors hover:bg-kumo-tint hover:text-kumo-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kumo-focus"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="ghost"
              shape="square"
              size="sm"
              aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggle}
            >
              {mode === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            </Button>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="flex size-8 items-center justify-center rounded-lg text-kumo-subtle transition-colors hover:bg-kumo-tint hover:text-kumo-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kumo-focus"
            >
              <GithubLogoIcon size={17} />
            </a>
            <Button
              variant="primary"
              size="sm"
              icon={SquaresFourIcon}
              className="aikit-press ml-1"
              onClick={() => {
                window.location.hash = "console";
              }}
            >
              Console
            </Button>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <div id="top" className="relative overflow-hidden">
        <div className="aikit-halo pointer-events-none absolute inset-x-0 top-0 h-80" aria-hidden />
        {/* Atmosphere: soft dot field fading from the top */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-kumo-hairline) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(55% 60% at 50% 8%, black, transparent 78%)",
          }}
        />
        {/* Second aura, tilted off-axis for depth */}
        <div
          aria-hidden
          className="aikit-halo pointer-events-none absolute top-24 -right-64 h-96 w-2xl rotate-12 opacity-70"
        />
        <div className="aikit-stagger relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 pt-20 pb-16 text-center sm:px-6">
          <Badge variant="outline">Built on Cloudflare's Kumo design system</Badge>
          <h1 className="font-display max-w-3xl text-balance text-[clamp(2.5rem,4.5vw+1rem,4rem)] leading-[1.08] font-bold tracking-tight text-kumo-default">
            <span className="font-serif-accent font-normal italic">Soft</span>{" "}
            components for building AI platforms
          </h1>
          <p className="max-w-xl text-balance text-[17px] leading-relaxed text-kumo-subtle">
            Sixteen gentle, high-level React components — chat, streaming, agents,
            tool calls, usage and credentials — styled entirely with Kumo semantic
            tokens, so light and dark just work.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ClipboardText text="npm install kumo-ai-kit @cloudflare/kumo" />
            <Button
              variant="primary"
              icon={SquaresFourIcon}
              className="aikit-press"
              onClick={() => {
                window.location.hash = "console";
              }}
            >
              Open the console
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-kumo-inactive">
            <span>React 19</span>
            <span aria-hidden>·</span>
            <span>TypeScript</span>
            <span aria-hidden>·</span>
            <span>Tailwind v4 tokens</span>
            <span aria-hidden>·</span>
            <span>MIT</span>
          </div>
        </div>
      </div>

      {/* ---------- Sections ---------- */}
      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-4 pb-28 sm:px-6">
        <Section>
          <SectionHeading
            id="playground"
            num="01"
            eyebrow="Conversation"
            title={
              <>
                A living{" "}
                <em className="font-serif-accent font-normal italic">playground</em>
              </>
            }
            description="ChatThread, ChatMessage, StreamingText, ThinkingIndicator, SourceChip, FeedbackBar, PromptComposer, ModelSelect, ParameterSlider, SystemPromptEditor and TokenUsageMeter — one working loop. Send something."
          />
          <Playground />
        </Section>

        <Section>
          <SectionHeading
            id="agents"
            num="02"
            eyebrow="Agents & tools"
            title={
              <>
                Fleet at a{" "}
                <em className="font-serif-accent font-normal italic">glance</em>
              </>
            }
            description="AgentCard tiles with soft auras and live status, ToolCallCard inspectors for every invocation, and one RunStatusBadge vocabulary across the whole platform."
          />
          <AgentsContent />
        </Section>

        <Section>
          <SectionHeading
            id="usage"
            num="03"
            eyebrow="Usage & billing"
            title={
              <>
                Numbers that stay{" "}
                <em className="font-serif-accent font-normal italic">calm</em>
              </>
            }
            description="UsageStat cards with deltas and dependency-free sparklines. Latency and spend flip their colors — because down is good there."
          />
          <UsageContent />
        </Section>

        <Section>
          <SectionHeading
            id="credentials"
            num="04"
            eyebrow="Trust"
            title={
              <>
                Credentials, handled{" "}
                <em className="font-serif-accent font-normal italic">gently</em>
              </>
            }
            description="ApiKeyField wraps Kumo's SensitiveInput — masked by default, reveal on click, copy on hover — with a live configured badge."
          />
          <CredentialsContent />
        </Section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-kumo-hairline">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-8 text-sm text-kumo-subtle sm:px-6">
          <span className="flex items-center gap-2">
            <CloudIcon size={15} weight="fill" className="text-kumo-brand" />
            kumo-ai-kit · MIT
          </span>
          <a
            href="https://kumo-ui.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kumo-link hover:underline"
          >
            Kumo docs
          </a>
          <a
            href="https://github.com/cloudflare/kumo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kumo-link hover:underline"
          >
            @cloudflare/kumo
          </a>
          <span className="ml-auto text-xs text-kumo-inactive">
            Every color on this page is a Kumo semantic token.
          </span>
        </div>
      </footer>
    </div>
  );
}
