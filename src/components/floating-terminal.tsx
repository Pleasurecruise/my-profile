"use client";

import { SquareTerminal } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Terminal } from "@/app/_terminal/terminal";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { useIsMobile } from "@/lib/use-mobile";
import { cn } from "@/lib/utils";

const MIN_W = 320;
const MIN_H = 213; // 3:2
const DEFAULT_W = 960;
const DEFAULT_H = 640; // 3:2

type InteractionType =
	| {
			kind: "drag";
			startX: number;
			startY: number;
			startPos: { x: number; y: number };
	  }
	| {
			kind: "resize";
			dir: string;
			startX: number;
			startY: number;
			startPos: { x: number; y: number };
			startSize: { w: number; h: number };
	  };

export function FloatingTerminal() {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const isMobile = useIsMobile();
	const pathname = usePathname();
	const [pos, setPos] = useState({ x: 0, y: 0 });
	const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
	const [active, setActive] = useState(false);
	const interactionRef = useRef<InteractionType | null>(null);

	// Close terminal on route change
	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	// Keyboard shortcut Ctrl/Cmd + `
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "`" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				setOpen((o) => !o);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);

	// Open/close animation + reset position
	useEffect(() => {
		if (open) {
			if (!isMobile) {
				const DOCK_H = 80; // navbar dock height + margin
				setPos({
					x: Math.round((window.innerWidth - DEFAULT_W) / 2),
					y: Math.round((window.innerHeight - DOCK_H - DEFAULT_H) / 2),
				});
			}
			requestAnimationFrame(() => setMounted(true));
		} else {
			setMounted(false);
		}
	}, [open, isMobile]);

	// Global pointer move/up — handles both drag and resize (desktop only)
	useEffect(() => {
		if (!active || isMobile) return;
		const onMove = (e: PointerEvent) => {
			const ia = interactionRef.current;
			if (!ia) return;
			const dx = e.clientX - ia.startX;
			const dy = e.clientY - ia.startY;

			if (ia.kind === "drag") {
				setPos({
					x: Math.max(
						0,
						Math.min(window.innerWidth - MIN_W, ia.startPos.x + dx),
					),
					y: Math.max(
						0,
						Math.min(window.innerHeight - MIN_H, ia.startPos.y + dy),
					),
				});
			} else {
				const { dir, startPos, startSize } = ia;
				let x = startPos.x;
				let y = startPos.y;
				let w = startSize.w;
				let h = startSize.h;

				if (dir.includes("e")) w = Math.max(MIN_W, startSize.w + dx);
				if (dir.includes("s")) h = Math.max(MIN_H, startSize.h + dy);
				if (dir.includes("w")) {
					w = Math.max(MIN_W, startSize.w - dx);
					x = startPos.x + startSize.w - w;
				}
				if (dir.includes("n")) {
					h = Math.max(MIN_H, startSize.h - dy);
					y = startPos.y + startSize.h - h;
				}

				setPos({ x, y });
				setSize({ w, h });
			}
		};
		const onUp = () => {
			setActive(false);
			interactionRef.current = null;
		};
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
		};
	}, [active, isMobile]);

	const handleDragStart = useCallback(
		(e: React.PointerEvent) => {
			if (isMobile) return;
			if ((e.target as HTMLElement).tagName === "SPAN") return;
			e.preventDefault();
			interactionRef.current = {
				kind: "drag",
				startX: e.clientX,
				startY: e.clientY,
				startPos: { ...pos },
			};
			setActive(true);
		},
		[pos, isMobile],
	);

	const handleResizeStart = useCallback(
		(e: React.PointerEvent, dir: string) => {
			e.preventDefault();
			e.stopPropagation();
			interactionRef.current = {
				kind: "resize",
				dir,
				startX: e.clientX,
				startY: e.clientY,
				startPos: { ...pos },
				startSize: { ...size },
			};
			setActive(true);
		},
		[pos, size],
	);

	return (
		<>
			{/* Trigger button */}
			<ShimmerButton
				onClick={() => setOpen((o) => !o)}
				aria-label="Toggle terminal"
				borderRadius="9999px"
				background="rgba(0,0,0,0.5)"
				className={cn(
					"fixed z-40 shadow-lg backdrop-blur-sm",
					"bottom-8 right-8 !w-16 !h-16 !p-0",
					"max-sm:bottom-24 max-sm:right-4 max-sm:!w-12 max-sm:!h-12",
					open && "ring-2 ring-white/20",
				)}
			>
				<SquareTerminal className="size-7 max-sm:size-5" />
			</ShimmerButton>

			{/* Mobile: fullscreen overlay */}
			{open && isMobile && (
				<div
					className={cn(
						"fixed inset-0 z-50 p-3 pb-28",
						"transition-all duration-200 ease-out",
						mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
					)}
				>
					<Terminal onClose={() => setOpen(false)} />
				</div>
			)}

			{/* Desktop: floating draggable window */}
			{open && !isMobile && (
				<div
					style={{
						position: "fixed",
						left: pos.x,
						top: pos.y,
						width: size.w,
						height: size.h,
						zIndex: 50,
						transition: active
							? "none"
							: "opacity 200ms ease-out, transform 200ms ease-out",
						transform: mounted
							? "scale(1) translateY(0)"
							: "scale(0.9) translateY(16px)",
						opacity: mounted ? 1 : 0,
						transformOrigin: "center",
					}}
				>
					{/* Resize handles */}
					<div
						className="absolute inset-0 pointer-events-none"
						style={{ zIndex: 10 }}
					>
						{/* Edges */}
						<div
							className="absolute top-0 left-3 right-3 h-1.5 cursor-n-resize pointer-events-auto"
							onPointerDown={(e) => handleResizeStart(e, "n")}
						/>
						<div
							className="absolute bottom-0 left-3 right-3 h-1.5 cursor-s-resize pointer-events-auto"
							onPointerDown={(e) => handleResizeStart(e, "s")}
						/>
						<div
							className="absolute left-0 top-3 bottom-3 w-1.5 cursor-w-resize pointer-events-auto"
							onPointerDown={(e) => handleResizeStart(e, "w")}
						/>
						<div
							className="absolute right-0 top-3 bottom-3 w-1.5 cursor-e-resize pointer-events-auto"
							onPointerDown={(e) => handleResizeStart(e, "e")}
						/>
						{/* Corners */}
						<div
							className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize pointer-events-auto"
							onPointerDown={(e) => handleResizeStart(e, "nw")}
						/>
						<div
							className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize pointer-events-auto"
							onPointerDown={(e) => handleResizeStart(e, "ne")}
						/>
						<div
							className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize pointer-events-auto"
							onPointerDown={(e) => handleResizeStart(e, "sw")}
						/>
						<div
							className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize pointer-events-auto"
							onPointerDown={(e) => handleResizeStart(e, "se")}
						/>
					</div>

					<Terminal
						onClose={() => setOpen(false)}
						onDragStart={handleDragStart}
					/>
				</div>
			)}
		</>
	);
}
