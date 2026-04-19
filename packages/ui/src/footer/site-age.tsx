const LAUNCH_DATE = new Date("2025-09-04");

export function SiteAge() {
	const days = Math.floor(
		(Date.now() - LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24),
	);
	return (
		<p className="text-xs text-muted-foreground/50">
			The site has been live for <span className="tabular-nums">{days}</span>{" "}
			days!
		</p>
	);
}
