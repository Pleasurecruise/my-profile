import type { Metadata } from "next";
import { JetBrains_Mono as FontSans } from "next/font/google";
import { CherryBlossom } from "@/components/cherry-blossom";
import { FloatingTerminal } from "@/components/floating-terminal";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import NavbarWrapper from "@/components/navbar-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";
import "@/styles/globals.css";
import "react-chrome-dino-ts/index.css";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	metadataBase: new URL(DATA.url),
	title: {
		default: "Pleasure1234",
		template: `%s | Pleasure1234`,
	},
	description: DATA.description,
	openGraph: {
		title: "Pleasure1234 的小站",
		description: DATA.description,
		url: DATA.url,
		siteName: "Pleasure1234 的小站",
		locale: "en_US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	twitter: {
		title: "Pleasure1234 的小站",
		description: DATA.description,
		card: "summary_large_image",
		creator: "@Pleasure9876",
	},
	alternates: {
		types: {
			"application/rss+xml": `${DATA.url}/feed.xml`,
		},
	},
	verification: {
		google: "",
		yandex: "",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
			>
				<TRPCReactProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<TooltipProvider delayDuration={0}>
							<div
								className="fixed inset-0 pointer-events-none"
								style={{ zIndex: 0 }}
								aria-hidden="true"
							>
								<div
									className="dark:hidden absolute inset-0"
									style={{
										background:
											"radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,255,255,0.95) 0%, transparent 70%)",
									}}
								/>
								<div
									className="hidden dark:block absolute inset-0"
									style={{
										background:
											"radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,255,255,0.05) 0%, transparent 65%)",
									}}
								/>
								<div className="bg-noise absolute inset-0 opacity-[0.05] dark:opacity-[0.025]" />
							</div>

							<CherryBlossom />
							<ScrollProgress />

							<div className="relative z-[2] mx-auto w-full max-w-2xl px-6 pt-12 pb-24 sm:py-24">
								{children}
								<NavbarWrapper />
								<FloatingTerminal />
								<Toaster />
							</div>
						</TooltipProvider>
					</ThemeProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
