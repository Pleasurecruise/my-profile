# Design System

This document records the design already used by `my-profile`. The chat refactor does not replace the
global theme or font stack.

## Source of Truth

- `src/styles/tokens.css` defines semantic color, radius, and Tailwind theme mappings.
- `src/styles/globals.css` defines the existing Inter, Fira Code, Noto Sans SC, and Newsreader stacks.
- `.dark` on the root element switches modes through `next-themes`.

Application components consume semantic utilities such as `bg-card`, `bg-muted`,
`text-muted-foreground`, `border-border`, and `text-foreground`. Feature code must not introduce a
parallel palette or replace the global fonts.

## Chat UI

The chat page adapts interaction patterns from Beautiful UI while staying inside the existing system:

- one bordered surface with a compact header
- right-aligned, low-contrast user messages
- unboxed assistant output with ordered agent steps
- a pixel-grid elapsed-time loading indicator
- compact expandable tool chips
- a bottom prompt bar with a single primary send/stop action

The UI does not fake tools, sources, model selection, or approval actions that the runtime does not
provide. Pi events are rendered only when they actually occur.

## Principles

1. Use existing semantic tokens; no feature-local theme.
2. Prefer borders and surface contrast over decorative shadows.
3. Keep actions quiet until they are available.
4. Preserve keyboard access, visible focus, labels, and reduced-motion-friendly behavior.
5. Let agent state determine the UI; do not simulate completion with timers.
