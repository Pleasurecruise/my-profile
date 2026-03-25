"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSelectorItems, resolveCommand } from "./commands";
import { DinoGame } from "./dino-game";
import { MOTD } from "./motd";
import type { Line, SelectorItem } from "./types";

const HOSTNAME = "pleasure1234@website";
const PROMPT = `${HOSTNAME}:~$`;

interface TerminalProps {
	onClose?: () => void;
	onDragStart?: (e: React.PointerEvent) => void;
}

export function Terminal({ onClose, onDragStart }: TerminalProps = {}) {
	const router = useRouter();
	const idRef = useRef(0);
	const nextId = () => ++idRef.current;
	const [lines, setLines] = useState<Line[]>([{ id: nextId(), type: "motd" }]);
	const [input, setInput] = useState("");
	const [history, setHistory] = useState<string[]>([]);
	const [historyIdx, setHistoryIdx] = useState(-1);
	const [selectorItems, setSelectorItems] = useState<SelectorItem[]>([]);
	const [selectorIdx, setSelectorIdx] = useState(0);
	const [sudoState, setSudoState] = useState<{
		command: string;
		attempts: number;
	} | null>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const draftRef = useRef("");
	const hasInitializedScrollRef = useRef(false);
	const streamTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

	const cancelStreamTimers = () => {
		streamTimersRef.current.forEach(clearTimeout);
		streamTimersRef.current = [];
	};
	const hasActiveDino = lines.some((line) => line.type === "dino");

	useEffect(() => {
		return () => cancelStreamTimers();
	}, []);

	useEffect(() => {
		if (!hasInitializedScrollRef.current) {
			hasInitializedScrollRef.current = true;
			return;
		}

		requestAnimationFrame(() => {
			bottomRef.current?.scrollIntoView({ behavior: "smooth" });
		});
	}, [lines, selectorItems]);

	const updateInput = (val: string) => {
		setInput(val);
		const items = getSelectorItems(val);
		setSelectorItems(items);
		setSelectorIdx(0);
	};

	const closeDino = useCallback((session: number) => {
		setLines((prev) =>
			prev.filter((line) => line.type !== "dino" || line.session !== session),
		);
		requestAnimationFrame(() => {
			inputRef.current?.focus();
		});
	}, []);

	const executeInput = useCallback(
		(cmd: string) => {
			if (cmd) setHistory((h) => [cmd, ...h]);
			setHistoryIdx(-1);
			draftRef.current = "";
			setInput("");
			setSelectorItems([]);
			setSelectorIdx(0);

			if (cmd === "") return;

			const hasSlash = cmd.startsWith("/");
			const [slug = "", ...restParts] = cmd
				.replace(/^\//, "")
				.toLowerCase()
				.split(/\s+/);
			const rest = restParts.join(" ");
			const result = resolveCommand(slug, rest);

			if (!result) {
				if (!hasSlash) {
					setLines((prev) => [
						...prev,
						{ id: nextId(), type: "input", text: cmd },
						{
							id: nextId(),
							type: "error",
							text: `Commands start with /  —  try /help to see what's available.`,
						},
					]);
				} else {
					setLines((prev) => [
						...prev,
						{ id: nextId(), type: "input", text: cmd },
						{
							id: nextId(),
							type: "error",
							text: `/${slug}: command not found. Type /help for available commands.`,
						},
					]);
				}
				return;
			}

			if (result.kind === "fetch") {
				setLines((prev) => [
					...prev,
					{ id: nextId(), type: "input", text: cmd },
					{ id: nextId(), type: "output", text: "fetching..." },
				]);
				const { url, format } = result;
				fetch(url)
					.then((r) => r.json())
					.then((data: unknown) => {
						setLines((prev) => [
							...prev.slice(0, -1),
							{ id: nextId(), type: "output", text: format(data) },
						]);
					})
					.catch(() => {
						setLines((prev) => [
							...prev.slice(0, -1),
							{ id: nextId(), type: "error", text: "fetch failed." },
						]);
					});
				return;
			}

			if (result.kind === "sudo") {
				setLines((prev) => [
					...prev,
					{ id: nextId(), type: "input", text: cmd },
				]);
				setSudoState({ command: result.command, attempts: 0 });
				return;
			}

			if (result.kind === "stream") {
				setLines((prev) => [
					...prev,
					{ id: nextId(), type: "input", text: cmd },
				]);
				result.items.forEach(({ text, delay }) => {
					const id = setTimeout(() => {
						setLines((prev) => [
							...prev,
							{ id: nextId(), type: "output", text },
						]);
						streamTimersRef.current = streamTimersRef.current.filter(
							(t) => t !== id,
						);
					}, delay);
					streamTimersRef.current.push(id);
				});
			} else if (result.kind === "clear") {
				cancelStreamTimers();
				setLines([]);
			} else if (result.kind === "navigate") {
				if (result.path === "__reload__") {
					setLines((prev) => [
						...prev,
						{ id: nextId(), type: "input", text: cmd },
						{ id: nextId(), type: "output", text: "Reloading..." },
					]);
					setTimeout(() => {
						onClose?.();
						window.location.reload();
					}, 800);
					return;
				}
				onClose?.();
				router.push(result.path);
			} else if (result.kind === "text") {
				setLines((prev) => [
					...prev,
					{ id: nextId(), type: "input", text: cmd },
					{ id: nextId(), type: "output", text: result.text },
				]);
			} else if (result.kind === "links") {
				setLines((prev) => [
					...prev,
					{ id: nextId(), type: "input", text: cmd },
					{ id: nextId(), type: "links", items: result.items },
				]);
			} else if (result.kind === "dino") {
				if (hasActiveDino) {
					setLines((prev) => [
						...prev,
						{ id: nextId(), type: "input", text: cmd },
						{
							id: nextId(),
							type: "output",
							text: "Dino is already running. Use the Exit button in the game panel, or /clear to reset the terminal.",
						},
					]);
					return;
				}

				setLines((prev) => [
					...prev,
					{ id: nextId(), type: "input", text: cmd },
					{ id: nextId(), type: "dino", session: Date.now() },
				]);
				requestAnimationFrame(() => {
					inputRef.current?.blur();
				});
			}
		},
		[hasActiveDino, router],
	);

	const handleSudoSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (!sudoState) return;
			setInput("");
			const newAttempts = sudoState.attempts + 1;
			if (newAttempts < 3) {
				setLines((prev) => [
					...prev,
					{ id: nextId(), type: "output", text: "Sorry, try again." },
				]);
				setSudoState({ ...sudoState, attempts: newAttempts });
			} else {
				setLines((prev) => [
					...prev,
					{ id: nextId(), type: "output", text: "Sorry, try again." },
					{
						id: nextId(),
						type: "error",
						text: "sudo: 3 incorrect password attempts\nThis incident will be reported.",
					},
				]);
				setSudoState(null);
			}
		},
		[sudoState],
	);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			executeInput(input.trim());
		},
		[input, executeInput],
	);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (selectorItems.length > 0) {
			if (e.key === "ArrowUp") {
				e.preventDefault();
				setSelectorIdx((i) => (i <= 0 ? selectorItems.length - 1 : i - 1));
				return;
			}
			if (e.key === "ArrowDown") {
				e.preventDefault();
				setSelectorIdx((i) => (i >= selectorItems.length - 1 ? 0 : i + 1));
				return;
			}
			if (e.key === "Escape") {
				e.preventDefault();
				setSelectorItems([]);
				return;
			}
			if (e.key === "Tab" || e.key === "Enter") {
				e.preventDefault();
				const selected = selectorItems[selectorIdx];
				if (!selected) return;
				if (selected.value.endsWith(" ")) {
					// "/go " — fill and open sub-selector
					setInput(selected.value);
					setSelectorItems(getSelectorItems(selected.value));
					setSelectorIdx(0);
				} else {
					setSelectorItems([]);
					if (e.key === "Enter") executeInput(selected.value.trim());
					else setInput(selected.value);
				}
				return;
			}
		} else {
			if (e.key === "ArrowUp") {
				e.preventDefault();
				if (history.length === 0) return;
				// save draft the first time we leave index -1
				if (historyIdx === -1) draftRef.current = input;
				const next = Math.min(historyIdx + 1, history.length - 1);
				setHistoryIdx(next);
				const val = history[next] ?? "";
				setInput(val);
				setSelectorItems([]);
				// move cursor to end after React re-render
				requestAnimationFrame(() => {
					const el = inputRef.current;
					if (el) el.setSelectionRange(val.length, val.length);
				});
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				if (historyIdx === -1) return;
				const next = historyIdx - 1;
				setHistoryIdx(next);
				const val = next === -1 ? draftRef.current : (history[next] ?? "");
				setInput(val);
				setSelectorItems([]);
				requestAnimationFrame(() => {
					const el = inputRef.current;
					if (el) el.setSelectionRange(val.length, val.length);
				});
			}
		}
	};

	const selectItem = (item: SelectorItem) => {
		if (item.value.endsWith(" ")) {
			setInput(item.value);
			setSelectorItems(getSelectorItems(item.value));
			setSelectorIdx(0);
		} else {
			setSelectorItems([]);
			executeInput(item.value.trim());
		}
		inputRef.current?.focus();
	};

	return (
		<div className="flex flex-col w-full h-full">
			<div
				className="relative flex flex-col flex-1
                    bg-zinc-900
                    rounded-xl border border-zinc-700/60
                    shadow-2xl
                    overflow-hidden min-h-0"
			>
				{/* Title bar */}
				<div
					className="relative flex items-center gap-2 px-4 py-2.5 border-b border-white/10 shrink-0"
					onPointerDown={onDragStart}
					style={{ cursor: onDragStart ? "grab" : undefined }}
				>
					<button
						type="button"
						className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:brightness-125 transition-all"
						onClick={onClose}
						title="Close"
					/>
					<span className="w-3 h-3 rounded-full bg-yellow-500" />
					<span className="w-3 h-3 rounded-full bg-green-500" />
					<span className="ml-3 text-xs text-zinc-400 font-mono select-none">
						{HOSTNAME}:~
					</span>
				</div>

				{/* Terminal output */}
				<div
					className="p-4 flex-1 overflow-y-auto font-mono text-sm text-zinc-100 cursor-text min-h-0"
					style={{
						scrollbarWidth: "thin",
						scrollbarColor: "#52525b transparent",
					}}
				>
					{lines.map((line) => {
						if (line.type === "motd")
							return (
								<div key={line.id}>
									<MOTD />
									{lines.length > 1 && (
										<div className="border-t border-white/10 my-3" />
									)}
								</div>
							);
						if (line.type === "input")
							return (
								<div key={line.id} className="flex gap-2 mt-2 first:mt-0">
									<span className="text-green-400 shrink-0">{PROMPT}</span>
									<span className="text-white">{line.text}</span>
								</div>
							);
						if (line.type === "output")
							return (
								<div
									key={line.id}
									className="whitespace-pre-wrap text-zinc-300 leading-5"
								>
									{line.text}
								</div>
							);
						if (line.type === "links")
							return (
								<div key={line.id}>
									{line.items.map((item) => (
										<div
											key={item.label}
											className="flex gap-2 text-zinc-300 leading-5"
										>
											<span className="text-zinc-500 shrink-0">
												{item.label}
											</span>
											{item.url.startsWith("wechat:") ? (
												<span className="text-zinc-300 truncate">
													{item.url.replace("wechat:", "")}
												</span>
											) : (
												<a
													href={item.url}
													target={
														item.url.startsWith("mailto:")
															? undefined
															: "_blank"
													}
													rel="noopener noreferrer"
													onClick={(e) => e.stopPropagation()}
													className="text-cyan-400 hover:underline truncate"
												>
													{item.url.startsWith("mailto:")
														? item.url.replace("mailto:", "")
														: item.url}
												</a>
											)}
										</div>
									))}
								</div>
							);
						if (line.type === "dino")
							return (
								<DinoGame
									key={line.session}
									onExit={() => closeDino(line.session)}
								/>
							);
						if (line.type === "error")
							return (
								<p
									key={line.id}
									className="text-red-400 whitespace-pre-wrap leading-5"
								>
									{line.text}
								</p>
							);
						return null;
					})}
					<div ref={bottomRef} />
				</div>

				{/* Fixed bottom: selector + input */}
				<div className="shrink-0 border-t border-white/10 font-mono text-sm">
					{!sudoState && selectorItems.length > 0 && (
						<div className="px-4 pt-2 pb-1">
							{selectorItems.map((item, i) => (
								<button
									type="button"
									key={item.value}
									className="flex items-center gap-2 text-xs cursor-pointer select-none leading-5"
									onMouseEnter={() => setSelectorIdx(i)}
									onClick={() => selectItem(item)}
								>
									<span className="w-3 shrink-0 text-yellow-400">
										{i === selectorIdx ? "❯" : ""}
									</span>
									<span
										className={
											i === selectorIdx ? "text-white" : "text-zinc-500"
										}
									>
										{item.label}
									</span>
									<span className="text-zinc-400 truncate">{item.desc}</span>
								</button>
							))}
							<div className="mt-0.5 ml-5 text-zinc-500 text-xs flex gap-3">
								<span>↑↓</span>
								<span>↵ confirm</span>
								<span>esc</span>
							</div>
						</div>
					)}
					<form
						ref={formRef}
						onSubmit={sudoState ? handleSudoSubmit : handleSubmit}
						className="flex gap-2 items-center px-4 py-2.5"
					>
						<span
							className={`${sudoState ? "text-yellow-300" : "text-green-400"} shrink-0`}
						>
							{sudoState ? (
								<>
									<span className="hidden sm:inline">
										[sudo] password for visitor:
									</span>
									<span className="sm:hidden">[sudo] passwd:</span>
								</>
							) : (
								<>
									<span className="hidden sm:inline">{PROMPT}</span>
									<span className="sm:hidden">~$</span>
								</>
							)}
						</span>
						<input
							ref={inputRef}
							type={sudoState ? "password" : "text"}
							className="flex-1 bg-transparent outline-none border-0 text-white caret-green-400"
							value={input}
							onChange={(e) =>
								sudoState
									? setInput(e.target.value)
									: updateInput(e.target.value)
							}
							onKeyDown={sudoState ? undefined : handleKeyDown}
							spellCheck={false}
							autoComplete="off"
							autoCorrect="off"
							autoCapitalize="off"
						/>
					</form>
				</div>
			</div>
		</div>
	);
}
