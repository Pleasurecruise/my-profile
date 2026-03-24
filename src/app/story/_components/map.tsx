"use client";

interface StoryMapProps {
	lat?: number;
	lng?: number;
	zoom?: number;
}

export function StoryMap({
	lat = 29.899573,
	lng = 121.5460043,
	zoom = 15,
}: StoryMapProps) {
	const src = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

	return (
		<div className="my-4">
			<iframe
				src={src}
				width="100%"
				height="300"
				className="rounded-lg border border-border"
				style={{ border: 0 }}
				allowFullScreen
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
				title="map"
			/>
		</div>
	);
}
