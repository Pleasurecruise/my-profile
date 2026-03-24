"use client";

import dynamic from "next/dynamic";

const VantaClouds2 = dynamic(
	() => import("./vanta-clouds2").then((m) => m.VantaClouds2),
	{
		ssr: false,
	},
);

export function VantaClouds2Client() {
	return <VantaClouds2 />;
}
