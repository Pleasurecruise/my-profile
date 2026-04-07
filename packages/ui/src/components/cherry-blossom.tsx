"use client";

import { useEffect, useState } from "react";

const PETAL_COLORS = ["#ffb7c5", "#ffc8d5", "#ff9ebc", "#ffdde6", "#f9a8c9"];

type Petal = {
	id: number;
	left: number;
	size: number;
	color: string;
	fallDuration: number;
	fallDelay: number;
	swayDuration: number;
	rotation: number;
};

export function CherryBlossom() {
	const [petals, setPetals] = useState<Petal[]>([]);

	useEffect(() => {
		setPetals(
			Array.from({ length: 18 }, (_, i) => ({
				id: i,
				left: Math.random() * 100,
				size: 8 + Math.random() * 10,
				color:
					PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)] ??
					"#ffb7c5",
				fallDuration: 10 + Math.random() * 12,
				fallDelay: Math.random() * 15,
				swayDuration: 2.5 + Math.random() * 3,
				rotation: Math.random() * 360,
			})),
		);
	}, []);

	if (petals.length === 0) return null;

	return (
		<div
			className="fixed inset-0 pointer-events-none overflow-hidden"
			style={{ zIndex: 1 }}
			aria-hidden="true"
		>
			{petals.map((p) => (
				<div
					key={p.id}
					className="absolute top-0"
					style={{
						left: `${p.left}%`,
						animation: `petal-fall ${p.fallDuration}s ${p.fallDelay}s linear infinite backwards`,
					}}
				>
					<div
						style={{
							animation: `petal-sway ${p.swayDuration}s ease-in-out infinite alternate`,
						}}
					>
						<svg
							width={p.size}
							height={p.size * 1.3}
							viewBox="0 0 24 30"
							style={{ transform: `rotate(${p.rotation}deg)`, opacity: 0.78 }}
							aria-hidden="true"
						>
							<path
								d="M12 27C7.5 27 3 22.5 3 16.5C3 10 7 3 12 2C17 3 21 10 21 16.5C21 22.5 16.5 27 12 27Z"
								fill={p.color}
							/>
							<path
								d="M12 27C7.5 27 3 22.5 3 16.5C3 10 7 3 12 2C17 3 21 10 21 16.5C21 22.5 16.5 27 12 27Z"
								fill="white"
								opacity="0.18"
							/>
						</svg>
					</div>
				</div>
			))}
		</div>
	);
}
