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
	| { id: number; type: "motd" }
	| { id: number; type: "input"; text: string }
	| { id: number; type: "output"; text: string }
	| { id: number; type: "links"; items: { label: string; url: string }[] }
	| { id: number; type: "dino"; session: number }
	| { id: number; type: "error"; text: string };
