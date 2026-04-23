"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PixelImage } from "@/components/magicui/pixel-image";

export interface MasonryItem {
	id: string;
	img: string;
	title: string;
	ratio: number; // height / width
}

interface GridItem extends MasonryItem {
	x: number;
	y: number;
	w: number;
	h: number;
}

const GAP = 16;

function useColumnCount() {
	const [columns, setColumns] = useState(2);

	useEffect(() => {
		const breakpoints = [
			{ mq: matchMedia("(min-width: 1500px)"), cols: 5 },
			{ mq: matchMedia("(min-width: 1000px)"), cols: 4 },
			{ mq: matchMedia("(min-width: 600px)"), cols: 3 },
			{ mq: matchMedia("(min-width: 400px)"), cols: 2 },
		];

		const get = () => breakpoints.find(({ mq }) => mq.matches)?.cols ?? 1;
		const handler = () => setColumns(get());

		setColumns(get());
		breakpoints.forEach(({ mq }) => {
			mq.addEventListener("change", handler);
		});
		return () => {
			breakpoints.forEach(({ mq }) => {
				mq.removeEventListener("change", handler);
			});
		};
	}, []);

	return columns;
}

export function MasonryGallery({ items }: { items: MasonryItem[] }) {
	const columns = useColumnCount();
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerWidth, setContainerWidth] = useState(0);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry) setContainerWidth(entry.contentRect.width);
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const { grid, containerHeight } = useMemo<{
		grid: GridItem[];
		containerHeight: number;
	}>(() => {
		if (!containerWidth) return { grid: [], containerHeight: 0 };

		const colHeights = Array<number>(columns).fill(0);
		const columnWidth = (containerWidth - GAP * (columns - 1)) / columns;

		const grid = items.map((item): GridItem => {
			const col = colHeights.indexOf(Math.min(...colHeights));
			const x = col * (columnWidth + GAP);
			const h = columnWidth * item.ratio;
			// biome-ignore lint/style/noNonNullAssertion: col is a valid index
			const y = colHeights[col]!;
			// biome-ignore lint/style/noNonNullAssertion: col is a valid index
			colHeights[col]! += h + GAP;
			return { ...item, x, y, w: columnWidth, h };
		});

		const containerHeight = Math.max(0, ...grid.map((item) => item.y + item.h));
		return { grid, containerHeight };
	}, [items, columns, containerWidth]);

	// Lock scroll when lightbox is open
	useEffect(() => {
		if (selectedIndex === null) return;
		const originalBody = document.body.style.overflow;
		const originalHtml = document.documentElement.style.overflow;
		document.body.style.overflow = "hidden";
		document.documentElement.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = originalBody;
			document.documentElement.style.overflow = originalHtml;
		};
	}, [selectedIndex]);

	// Keyboard navigation
	useEffect(() => {
		if (selectedIndex === null) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") setSelectedIndex(null);
			else if (e.key === "ArrowLeft")
				setSelectedIndex((i) =>
					i === null ? null : i === 0 ? items.length - 1 : i - 1,
				);
			else if (e.key === "ArrowRight")
				setSelectedIndex((i) => (i === null ? null : (i + 1) % items.length));
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [selectedIndex, items.length]);

	const selectedItem =
		selectedIndex !== null ? (items[selectedIndex] ?? null) : null;

	return (
		<>
			<div
				ref={containerRef}
				className="relative w-full"
				style={{ minHeight: containerHeight }}
			>
				{grid.map((item, index) => (
					<motion.div
						key={item.id}
						layout
						className="absolute cursor-zoom-in overflow-hidden rounded-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)]"
						style={{
							left: item.x,
							top: item.y,
							width: item.w,
							height: item.h,
							willChange: "transform, opacity",
						}}
						initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
						animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
						transition={{
							layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
							opacity: { duration: 0.6, delay: index * 0.05 },
							filter: { duration: 0.8, delay: index * 0.05 },
							scale: {
								duration: 0.6,
								ease: [0.22, 1, 0.36, 1],
								delay: index * 0.05,
							},
						}}
						whileHover={{ scale: 0.97 }}
						onClick={() => setSelectedIndex(index)}
					>
						<PixelImage
							src={item.img}
							alt={item.title}
							className="w-full h-full"
							grid="8x8"
						/>
						<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 pt-8 pb-3 pointer-events-none">
							<p className="text-white text-xl font-medium truncate leading-tight">
								{item.title}
							</p>
						</div>
					</motion.div>
				))}
			</div>

			{mounted &&
				createPortal(
					<AnimatePresence>
						{selectedItem !== null && selectedIndex !== null && (
							<motion.div
								className="fixed inset-0 z-50 flex items-center justify-center"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
								onClick={() => setSelectedIndex(null)}
							>
								{/* Backdrop */}
								<div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

								{/* Image */}
								<motion.div
									className="relative z-10 flex flex-col items-center gap-3 px-4"
									initial={{ scale: 0.92, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									exit={{ scale: 0.92, opacity: 0 }}
									transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
									onClick={(e) => e.stopPropagation()}
								>
									<img
										src={selectedItem.img}
										alt={selectedItem.title}
										className="max-w-[90vw] max-h-[80vh] rounded-xl object-contain shadow-2xl"
									/>
									<div className="flex items-center gap-3 text-white/70 text-sm">
										<span className="font-medium text-white/90">
											{selectedItem.title}
										</span>
										<span>·</span>
										<span>
											{selectedIndex + 1} / {items.length}
										</span>
										<a
											href={selectedItem.img}
											target="_blank"
											rel="noopener noreferrer"
											className="hover:text-white transition-colors"
										>
											<span className="sr-only">在新标签页打开原图</span>
											<svg
												aria-hidden="true"
												xmlns="http://www.w3.org/2000/svg"
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="M15 3h6v6" />
												<path d="M10 14 21 3" />
												<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
											</svg>
										</a>
									</div>
								</motion.div>

								{/* Close */}
								<button
									type="button"
									aria-label="关闭"
									className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
									onClick={() => setSelectedIndex(null)}
								>
									<svg
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M18 6 6 18" />
										<path d="m6 6 12 12" />
									</svg>
								</button>

								{/* Prev / Next */}
								{items.length > 1 && (
									<>
										<button
											type="button"
											aria-label="上一张"
											className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
											onClick={(e) => {
												e.stopPropagation();
												setSelectedIndex((i) =>
													i === null
														? null
														: i === 0
															? items.length - 1
															: i - 1,
												);
											}}
										>
											<svg
												aria-hidden="true"
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="m15 18-6-6 6-6" />
											</svg>
										</button>
										<button
											type="button"
											aria-label="下一张"
											className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
											onClick={(e) => {
												e.stopPropagation();
												setSelectedIndex((i) =>
													i === null ? null : (i + 1) % items.length,
												);
											}}
										>
											<svg
												aria-hidden="true"
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="m9 18 6-6-6-6" />
											</svg>
										</button>
									</>
								)}
							</motion.div>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</>
	);
}
