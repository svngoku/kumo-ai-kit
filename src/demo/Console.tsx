import { Badge, Button, Sidebar } from "@cloudflare/kumo";
import {
  ArrowLeftIcon,
  ChatCircleDotsIcon,
  CloudIcon,
  GaugeIcon,
  GithubLogoIcon,
  KeyIcon,
  MoonIcon,
  RobotIcon,
  SunIcon,
} from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";
import { Playground } from "./Playground";
import { AgentsContent, CredentialsContent, UsageContent } from "./sections";

type ConsoleView = "playground" | "agents" | "usage" | "credentials";

const VIEWS: Record<
  ConsoleView,
  { title: string; blurb: string }
> = {
  playground: {
    title: "Playground",
    blurb: "Converse, stream, stop — parameters and context on the right.",
  },
  agents: {
    title: "Agents",
    blurb: "Your fleet, its tool calls and one shared status language.",
  },
  usage: {
    title: "Usage",
    blurb: "Requests, tokens, latency and spend — numbers that stay calm.",
  },
  credentials: {
    title: "Credentials",
    blurb: "Provider keys, masked by default and labeled when configured.",
  },
};

export interface ConsoleProps {
  mode: "light" | "dark";
  onToggleTheme: () => void;
  onExit: () => void;
}

/**
 * The dedicated console page: a real AI-platform app shell built on
 * Kumo's Sidebar — icon-collapsible navigation driving the kit's
 * playground, agents, usage and credentials surfaces.
 */
export function Console({ mode, onToggleTheme, onExit }: ConsoleProps) {
  const [view, setView] = useState<ConsoleView>("playground");
  const current = VIEWS[view];

  let content: ReactNode;
  switch (view) {
    case "agents":
      content = <AgentsContent />;
      break;
    case "usage":
      content = <UsageContent />;
      break;
    case "credentials":
      content = <CredentialsContent />;
      break;
    default:
      content = <Playground />;
  }

  return (
    <Sidebar.Provider
      defaultOpen
      collapsible="icon"
      className="h-dvh bg-kumo-canvas text-kumo-default"
    >
      <Sidebar>
        <Sidebar.Header>
          <div className="flex items-center gap-2.5 overflow-hidden px-1 py-0.5">
            <span className="aikit-ai-avatar flex size-8 shrink-0 items-center justify-center rounded-xl ring-1 ring-kumo-hairline">
              <CloudIcon size={17} weight="fill" className="text-kumo-strong" />
            </span>
            <span className="font-display truncate font-bold tracking-tight">
              Kumo AI
            </span>
            <Badge variant="outline">Console</Badge>
          </div>
        </Sidebar.Header>

        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuButton
                icon={ChatCircleDotsIcon}
                tooltip="Playground"
                active={view === "playground"}
                onClick={() => setView("playground")}
              >
                Playground
              </Sidebar.MenuButton>
              <Sidebar.MenuButton
                icon={RobotIcon}
                tooltip="Agents"
                active={view === "agents"}
                onClick={() => setView("agents")}
              >
                Agents
              </Sidebar.MenuButton>
              <Sidebar.MenuButton
                icon={GaugeIcon}
                tooltip="Usage"
                active={view === "usage"}
                onClick={() => setView("usage")}
              >
                Usage
              </Sidebar.MenuButton>
              <Sidebar.MenuButton
                icon={KeyIcon}
                tooltip="Credentials"
                active={view === "credentials"}
                onClick={() => setView("credentials")}
              >
                Credentials
              </Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>

          <Sidebar.Group>
            <Sidebar.GroupLabel>Elsewhere</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuButton
                icon={ArrowLeftIcon}
                tooltip="Back to showcase"
                onClick={onExit}
              >
                Back to showcase
              </Sidebar.MenuButton>
              <Sidebar.MenuButton
                icon={GithubLogoIcon}
                tooltip="GitHub"
                onClick={() =>
                  window.open(
                    "https://github.com/svngoku/kumo-ai-kit",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                GitHub
              </Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>

        <Sidebar.Footer>
          <div className="flex items-center gap-1">
            <Sidebar.Trigger />
            <Button
              variant="ghost"
              shape="square"
              size="sm"
              aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={onToggleTheme}
            >
              {mode === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            </Button>
          </div>
        </Sidebar.Footer>
      </Sidebar>

      {/* Main surface */}
      <div className="flex h-dvh min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-kumo-hairline bg-kumo-canvas/80 px-5 backdrop-blur-md">
          <div className="min-w-0">
            <h1 className="font-display truncate text-lg font-bold tracking-tight">
              {current.title}
            </h1>
          </div>
          <p className="hidden truncate text-sm text-kumo-subtle md:block">
            {current.blurb}
          </p>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-kumo-tint px-2.5 py-1 text-xs text-kumo-subtle sm:flex">
              <span className="size-1.5 rounded-full bg-kumo-success" aria-hidden />
              All systems soft
            </span>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div key={view} className="aikit-rise mx-auto max-w-6xl px-4 py-6 sm:px-6">
            {content}
          </div>
        </main>
      </div>
    </Sidebar.Provider>
  );
}
