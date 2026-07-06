# kumo-ai-kit 🌥️

**A soft, high-level React component suite for building AI platforms — powered by [Cloudflare's Kumo](https://github.com/cloudflare/kumo) design system.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg)](https://www.typescriptlang.org/)
[![Built on Kumo](https://img.shields.io/badge/built%20on-%40cloudflare%2Fkumo%20%E2%89%A5%202.7-f6821f.svg)](https://kumo-ui.com)

Kumo gives you beautiful, accessible primitives — `Button`, `Select`, `Meter`, `Collapsible`, `Dialog`.
**kumo-ai-kit** composes them into the sixteen product-level pieces every AI platform ends up
rebuilding: chat threads, streaming text, prompt composers, model pickers, agent cards, tool-call
inspectors, token meters and credential fields.

Everything is styled **exclusively with Kumo semantic tokens** (`bg-kumo-base`, `text-kumo-subtle`,
`ring-kumo-hairline`, …) — so the entire kit adapts to light/dark automatically via
`light-dark()`, inherits any Kumo theme, and never hardcodes a color.

## Design principles

- **Soft by default** — generous radii (`rounded-3xl`), airy spacing, hairline rings instead of hard borders, gentle entrance motion, pulsing status dots, `prefers-reduced-motion` respected throughout.
- **Tokens only** — no raw Tailwind colors, no `dark:` variants. If Kumo re-themes, the kit re-themes.
- **High-level, not high-handed** — components own layout and motion; you own the data. Bring your own markdown renderer, transport and state.
- **Accessible** — built on Kumo (Base UI underneath): keyboard navigation, focus management, `role="status"` live regions, `aria-pressed` feedback states.

## Install

```bash
npm install kumo-ai-kit @cloudflare/kumo @phosphor-icons/react
```

### CSS setup (Tailwind CSS v4)

Kumo requires this exact import order, and Tailwind must scan both packages' compiled output:

```css
/* main.css */
@source "../node_modules/@cloudflare/kumo/dist/**/*.{js,jsx,ts,tsx}";
@source "../node_modules/kumo-ai-kit/dist/**/*.js";
@import "@cloudflare/kumo/styles";
@import "tailwindcss";

/* the kit's soft layer (motion, carets, auras) */
@import "kumo-ai-kit/styles.css";
```

> Adjust the `@source` paths relative to your CSS file's location.

## Quickstart

```tsx
import { useState } from "react";
import {
  AiKitProvider,
  ChatMessage,
  ChatThread,
  PromptComposer,
  StreamingText,
  ThinkingIndicator,
} from "kumo-ai-kit";

export function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant" as const, text: "Hi! Ask me anything." },
  ]);
  const [thinking, setThinking] = useState(false);

  return (
    <AiKitProvider>
      <div className="flex h-screen flex-col bg-kumo-canvas p-6">
        <ChatThread className="flex-1">
          {messages.map((m) => (
            <ChatMessage key={m.id} role={m.role}>
              {m.role === "assistant" ? <StreamingText text={m.text} /> : m.text}
            </ChatMessage>
          ))}
          {thinking && <ThinkingIndicator showElapsed />}
        </ChatThread>

        <PromptComposer
          showTokenEstimate
          onSubmit={(text) => {
            setMessages((prev) => [
              ...prev,
              { id: Date.now(), role: "user" as const, text },
            ]);
            setThinking(true);
            // …call your model, append the streamed reply, setThinking(false)
          }}
        />
      </div>
    </AiKitProvider>
  );
}
```

## The suite

### Conversation

| Component | What it does |
| --- | --- |
| `ChatThread` | Stick-to-bottom conversation viewport with a soft "Latest" jump pill and top edge fade. |
| `ChatMessage` | Role-aware rows — tinted user bubbles, carded assistant bubbles with aura avatars, mono tool rows, centered system pills. Queued skeletons and error states built in. |
| `StreamingText` | Token-streaming reveal with a soft blinking caret. |
| `ThinkingIndicator` | Bobbing dots, optional label + elapsed seconds, announced politely to screen readers. |
| `PromptComposer` | Auto-growing textarea, accessory slots (drop a `ModelSelect` in), token estimate, Enter-to-send, and a send button that morphs into a pulsing stop button while streaming. |
| `FeedbackBar` | Thumbs up/down with filled selected states, copy-with-confirmation, regenerate. |
| `SourceChip` | Numbered RAG citation chips with snippet tooltips and external-link affordances. |

### Models & controls

| Component | What it does |
| --- | --- |
| `ModelSelect` | Kumo `Select` with provider-colored dots, context-window hints and "New" tags. |
| `ParameterSlider` | Temperature / top-p sliders on the Base UI Slider primitive, with mono value pills. |
| `SystemPromptEditor` | Mono editing card with live character count and one-click preset chips. |

### Agents & tools

| Component | What it does |
| --- | --- |
| `AgentCard` | Soft agent tiles — aura icon, model, status, tags, run action, gentle hover lift. |
| `ToolCallCard` | Collapsible invocation inspector: status glyphs, duration, pretty-printed JSON args/results via Kumo `CodeBlock`, error surfaces. |
| `RunStatusBadge` | One status vocabulary (`idle → queued → running → succeeded / failed / canceled / paused`) with a softly pulsing running dot. |

### Usage & trust

| Component | What it does |
| --- | --- |
| `TokenUsageMeter` | Kumo `Meter` that glides brand → warning → danger as the context window fills, with prompt/completion breakdown. |
| `UsageStat` | Dashboard stat cards: deltas with direction icons (flippable polarity — down is good for latency), dependency-free SVG sparklines. |
| `ApiKeyField` | Kumo `SensitiveInput` (masked, reveal on click, copy on hover) with a live Configured / Not set badge. |

### Plus

- `AiKitProvider` — batteries-included wrapper (Kumo `TooltipProvider` + `Toasty`).
- `useStreamingText` — the reveal engine behind `StreamingText`, exported for custom UIs.
- Shared types: `ChatRole`, `MessageStatus`, `RunStatus`, `ToolCall`, `TokenUsage`, `ModelOption`, `SourceRef`, `AgentSummary`, …

## Theming

The kit has **no palette of its own** — it reads Kumo's semantic tokens at runtime:

- **Dark mode**: set `data-mode="dark"` on `<html>` (and `color-scheme: dark`). Every component follows instantly — see `useThemeMode()` in [`src/demo/App.tsx`](./src/demo/App.tsx).
- **Custom themes**: any Kumo theme (or your own token overrides) restyles the whole kit for free.
- **The soft layer** ([`src/lib/styles/ai-kit.css`](./src/lib/styles/ai-kit.css)) only adds motion keyframes, the streaming caret, and brand-derived auras — all in plain CSS, derived from `--color-kumo-*` variables.

## Development

```bash
npm install
npm run dev        # showcase playground at http://localhost:5173
npm run typecheck  # strict TS across lib + demo
npm run build      # typecheck + production demo build (dist-demo/)
npm run build:lib  # ESM library + rolled-up .d.ts + styles (dist/)
```

The showcase (`src/demo/`) is a full working AI console: a live conversation loop
(thinking → streaming → settled usage), an agent fleet, tool-call inspection, usage
dashboards and credential management — every component in the suite, exercised for real.

## Credits

- [Kumo](https://kumo-ui.com) (`@cloudflare/kumo`) — Cloudflare's component library, MIT.
- [Base UI](https://base-ui.com) — the unstyled, accessible primitives underneath Kumo.
- [Phosphor Icons](https://phosphoricons.com) — the icon family used throughout.

## License

[MIT](./LICENSE)
