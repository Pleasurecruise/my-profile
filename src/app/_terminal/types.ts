export type SelectorItem = { label: string; value: string; desc: string };

export type StreamItem = { text: string; delay: number };

export type SlashCommandResult =
    | { kind: "text"; text: string }
    | { kind: "stream"; items: StreamItem[] }
    | { kind: "links"; items: { label: string; url: string }[] }
    | { kind: "navigate"; path: string }
    | { kind: "dino" }
    | { kind: "clear" }
    | { kind: "sudo"; command: string }
    | { kind: "fetch"; url: string; format: (data: unknown) => string };

export type Line =
    | { type: "motd" }
    | { type: "input"; text: string }
    | { type: "output"; text: string }
    | { type: "links"; items: { label: string; url: string }[] }
    | { type: "dino"; session: number }
    | { type: "error"; text: string };
