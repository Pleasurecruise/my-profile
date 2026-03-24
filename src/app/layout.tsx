import type { Metadata } from "next";
import { JetBrains_Mono as FontSans } from "next/font/google";
import Script from "next/script";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import NavbarWrapper from "@/components/navbar-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { VantaClouds2Client } from "@/components/vanta-clouds2-client";
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
			<head>
				<Script
					src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"
					strategy="beforeInteractive"
				/>
			</head>
			<body
				className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
			>
				<TRPCReactProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<TooltipProvider delayDuration={0}>
							<VantaClouds2Client />
							<ScrollProgress />
							<div className="mx-auto w-full max-w-2xl px-6 pt-12 pb-24 sm:py-24">
								{children}
								<NavbarWrapper />
								<Toaster />
							</div>
						</TooltipProvider>
					</ThemeProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
