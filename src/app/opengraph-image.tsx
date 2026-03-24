import { ImageResponse } from "next/og";
import { DATA } from "@/data/resume";

export const alt = "Pleasure1234";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
	return new ImageResponse(
		<div
			style={{
				width: "1200px",
				height: "630px",
				background: "#080808",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				padding: "80px",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<svg
				aria-hidden="true"
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "1200px",
					height: "630px",
				}}
				width="1200"
				height="630"
			>
				<defs>
					<filter id="blur1" x="-100%" y="-100%" width="300%" height="300%">
						<feGaussianBlur stdDeviation="80" />
					</filter>
					<filter id="blur2" x="-100%" y="-100%" width="300%" height="300%">
						<feGaussianBlur stdDeviation="80" />
					</filter>
				</defs>
				<circle
					cx="0"
					cy="0"
					r="350"
					fill="#6366f1"
					opacity="0.6"
					filter="url(#blur1)"
				/>
				<circle
					cx="1200"
					cy="630"
					r="350"
					fill="#f59e0b"
					opacity="0.6"
					filter="url(#blur2)"
				/>
			</svg>

			<div
				style={{
					position: "absolute",
					top: 80,
					left: 80,
					width: 300,
					height: 1.5,
					background: "linear-gradient(to right, #6366f1cc, transparent)",
				}}
			/>

			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: 56,
				}}
			>
				<img
					src={`${DATA.url}/profile/me.png`}
					alt="Pleasure1234"
					width={160}
					height={160}
					style={{
						borderRadius: "50%",
						border: "3px solid rgba(255,255,255,0.12)",
						flexShrink: 0,
					}}
				/>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<div
						style={{
							display: "flex",
							fontSize: 80,
							fontWeight: 700,
							color: "#ffffff",
							lineHeight: 1.15,
							marginBottom: 24,
						}}
					>
						Pleasure1234
					</div>

					<div
						style={{
							display: "flex",
							fontSize: 28,
							color: "rgba(255,255,255,0.35)",
						}}
					>
						{`${DATA.url.replace("https://", "")}  ·  @Pleasure9876`}
					</div>
				</div>
			</div>
		</div>,
		{ ...size },
	);
}
