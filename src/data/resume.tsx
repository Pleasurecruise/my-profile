import {
	BotMessageSquareIcon,
	CameraIcon,
	FeatherIcon,
	HourglassIcon,
	SproutIcon,
} from "lucide-react";
import { Icons } from "@/components/icons";
import { Docker } from "@/components/ui/svgs/docker";
import { Golang } from "@/components/ui/svgs/golang";
import { Java } from "@/components/ui/svgs/java";
import { MongoDB } from "@/components/ui/svgs/mongodb";
import { MySQL } from "@/components/ui/svgs/mysql";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Python } from "@/components/ui/svgs/python";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { Typescript } from "@/components/ui/svgs/typescript";

export const DATA = {
	name: "Yiming Wang",
	initials: "Pleasure1234",
	url: "https://yiming1234.cn",
	location: "Nottingham, UK",
	locationLink: "https://www.google.com/maps/place/nottingham",
	description:
		"Junior undergraduate student. I love to participate in open source projects. Active on X.",
	summary:
		"Passionate computer science student at UoN with hands-on experience in full-stack development and AI technologies. Proficient in modern web development frameworks like React, Next.js, and Vue, with internship experience in algorithm development and front-end engineering. " +
		"Active open source contributor with merged PRs across multiple projects, including [Cherry Studio](https://github.com/CherryHQ/cherry-studio), [Dify](https://github.com/langgenius/dify), [note-gen](https://github.com/codexu/note-gen), [Docmost](https://github.com/docmost/docmost), [Blinko](https://github.com/blinkospace/blinko), [LobeHub](https://github.com/lobehub/lobehub), [Zoot Plus](https://github.com/ZOOT-Plus/ZootPlusBackend) etc. " +
		"Founded the organization [CompPsyUnion](https://github.com/CompPsyUnion) on GitHub and was responsible for maintaining open-source activities. " +
		"Skilled in both mobile and web development with expertise in TypeScript, Python, and database technologies.",
	avatarUrl: "https://avatars.githubusercontent.com/u/144885467",
	skills: [
		{ name: "React", icon: ReactLight },
		{ name: "Typescript", icon: Typescript },
		{ name: "Next.js", icon: NextjsIconDark },
		{ name: "Node.js", icon: Nodejs },
		{ name: "Java", icon: Java },
		{ name: "Python", icon: Python },
		{ name: "Go", icon: Golang },
		{ name: "Postgres", icon: Postgresql },
		{ name: "Docker", icon: Docker },
		{ name: "MongoDB", icon: MongoDB },
		{ name: "MySQL", icon: MySQL },
	],
	navbar: [
		{ href: "/", icon: SproutIcon, label: "Home" },
		{ href: "/blog", icon: HourglassIcon, label: "Blog" },
		{ href: "/story", icon: FeatherIcon, label: "Story" },
		{ href: "/gallery", icon: CameraIcon, label: "Gallery" },
		{ href: "/chat", icon: BotMessageSquareIcon, label: "Chat" },
	],
	contact: {
		email: "pleasure9876@qq.com",
		telegram: "@Pleasure12345678",
		wechat: "W3196812536",
		social: {
			Notion: {
				name: "Notion",
				url: "https://yiming1234.notion.site/me",
				icon: Icons.notion,

				navbar: true,
			},
			GitHub: {
				name: "GitHub",
				url: "https://github.com/Pleasurecruise",
				icon: Icons.github,

				navbar: true,
			},
			X: {
				name: "X",
				url: "https://x.com/Pleasure9876",
				icon: Icons.x,

				navbar: true,
			},
			LinkedIn: {
				name: "LinkedIn",
				url: "https://www.linkedin.com/in/pleasure1234",
				icon: Icons.linkedin,

				navbar: true,
			},
			email: {
				name: "Send Email",
				url: "#",
				icon: Icons.email,

				navbar: false,
			},
			Instagram: {
				name: "Instagram",
				url: "https://www.instagram.com/yiming0305",
				icon: Icons.instagram,

				navbar: false,
			},
		},
	},
	work: [
		{
			company: "Ningbo Global Innovation Center, Zhejiang University",
			badges: [],
			location: "Ningbo, China",
			title: "Algorithm Internship",
			logoUrl: "/logos/zju.png",
			start: "Jun 2025",
			end: "Aug 2025",
			description:
				"Participate in the reproduction and application of a speech separation project based on Mamba-TasNet, encapsulation of the interface, as well as the construction of some datasets.",
		},
		{
			company: "Shanghai HRG Information Technology Co.",
			badges: [],
			location: "Remote",
			title: "Front-end Internship",
			logoUrl: "/projects/hrg.png",
			start: "Apr 2025",
			end: "May 2025",
			description:
				'Participated in the demand analysis, system design, and coding implementation of the company\'s "Plants vs. Zombies 2 UGC Upload System" project, mainly responsible for front-end development and some testing and maintenance tasks.Utilized the shadcn-vue component library and lucide-vue-next icons, styled with Tailwind CSS. Employed vue router for page navigation and axios for request encapsulation and forwarding. Responsible for deploying front-end and back-end testing environments, verifying consistency between request/response models and interface documentation, and resolving cross-domain communication and debugging issues. Collaborated with the testing team to complete unit testing and bug fixes, optimizing system performance.',
		},
	],
	academic: [
		{
			project: "FoSE SEP Project",
			subtitle:
				"Faculty of Science and Engineering Student Extra-curriculum Programme",
			href: "https://www.nottingham.ac.uk",
			logoUrl: "/logos/uon.png",
			start: "Jun 2025",
			end: "Aug 2025",
			description:
				"Medical Image Analysis with Deep Learning. This project explores the application of deep learning in analyzing medical images for disease detection and diagnosis. By processing medical scans such as X-rays, MRIs, and CT scans, the system aims to identify abnormalities and classify diseases to assist healthcare professionals. The objective is to improve diagnostic accuracy, automate image-based decision-making, and enhance the efficiency of medical imaging analysis.",
		},
	],
	education: [
		{
			school: "University of Nottingham",
			href: "https://www.nottingham.ac.uk",
			degree: "BSc Computer Science with Artificial Intelligence",
			logoUrl: "/logos/uon.png",
			start: "2023",
			end: "2027",
		},
	],
	projects: [
		{
			title: "Cherry Studio",
			href: "#",
			dates: "Feb 2025 - Present",
			active: true,
			description:
				"A cross-platform desktop client supporting multiple LLM providers including OpenAI, Anthropic, and Gemini. Contributions cover features, bug fixes, refactoring, dependency upgrades, and security patches.",
			technologies: ["Electron", "TypeScript", "React", "Node.js"],
			links: [
				{
					type: "Website",
					href: "#",
					icon: <Icons.globe className="size-3" />,
				},
				{
					type: "Source",
					href: "https://github.com/CherryHQ/cherry-studio",
					icon: <Icons.github className="size-3" />,
				},
			],
			image:
				"https://github.com/user-attachments/assets/36dddb2c-e0fb-4a5f-9411-91447bab6e18",
		},
		{
			title: "Cherry Studio App",
			href: "#",
			dates: "Mar 2025 - Present",
			active: true,
			description:
				"The official mobile version of Cherry Studio, bringing powerful LLMs to iOS and Android devices. Features multi-LLM provider support, AI assistants, conversation management, and mobile-optimized design with cross-platform compatibility.",
			technologies: [
				"React Native",
				"Expo",
				"TypeScript",
				"Tamagui",
				"Redux Toolkit",
			],
			links: [
				{
					type: "Source",
					href: "https://github.com/CherryHQ/cherry-studio-app",
					icon: <Icons.github className="size-3" />,
				},
			],
			image: "/projects/cherry-app.png",
		},
		{
			title: "NottinghamWall",
			href: "#",
			dates: "Jun 2024 - Dec 2024",
			active: true,
			description:
				"A campus-oriented WeChat mini-program providing services and facilitating interactions for University of Nottingham Ningbo students. Features user management and forum exchange with a full-stack architecture.",
			technologies: ["Vue3", "UniApp", "SpringBoot", "MyBatis", "Element Plus"],
			links: [
				{
					type: "Source",
					href: "https://github.com/CompPsyUnion/NottinghamWall",
					icon: <Icons.github className="size-3" />,
				},
			],
			image:
				"https://github.com/user-attachments/assets/26226271-e5d5-41cd-86db-7693ec98581a",
		},
		{
			title: "Linux Do MCP Server",
			href: "https://github.com/Pleasurecruise/linux-do-mcp",
			dates: "Mar 2025 - Apr 2025",
			active: false,
			description:
				"An open-source MCP (Model Context Protocol) server providing API integration with the Linux DO community forum. Features comprehensive forum interaction tools, supports both authenticated and unauthenticated requests, and enables retrieval of topics, notifications, and user-specific content across 12 different forum interaction tools and 11 categories.",
			technologies: [
				"TypeScript",
				"Node.js",
				"Python",
				"MCP",
				"REST API",
				"Community Integration",
			],
			links: [
				{
					type: "Website",
					href: "https://linux.do/t/topic/527169",
					icon: <Icons.globe className="size-3" />,
				},
				{
					type: "Source",
					href: "https://github.com/Pleasurecruise/linux-do-mcp",
					icon: <Icons.github className="size-3" />,
				},
			],
			image: "/projects/linux-do-mcp.png",
		},
	],
	translates: [
		{
			title: "React",
			dates: "2025 - Present",
			description:
				"Contributing to the React Chinese documentation project, helping translate official React documentation to make it accessible to Chinese developers. Contributed to pages including React Complier etc.",
			image: "https://cdn.simpleicons.org/react",
			links: [
				{
					title: "My Contributions",
					icon: <Icons.github className="h-4 w-4" />,
					href: "https://github.com/reactjs/zh-hans.react.dev/commits/main/?author=Pleasurecruise",
				},
			],
		},
		{
			title: "Flutter",
			dates: "2024 - Present",
			description:
				"Contributing to the Flutter Chinese community by translating Flutter documentation and guides. Helping Chinese developers better understand Flutter development concepts and best practices through high-quality translations.",
			image: "https://cdn.simpleicons.org/flutter",
			links: [
				{
					title: "My Contributions",
					icon: <Icons.github className="h-4 w-4" />,
					href: "https://github.com/cfug/flutter.cn/commits/main/?author=Pleasurecruise",
				},
			],
		},
		{
			title: "MDN Web Docs",
			dates: "2024 - Present",
			description:
				"Contributing to MDN Web Docs Chinese translations, helping provide comprehensive web development resources in Chinese. Translating technical articles, API documentation, and tutorials to support the Chinese web development community.",
			image: "https://github.com/mdn.png",
			links: [
				{
					title: "My Contributions",
					icon: <Icons.github className="h-4 w-4" />,
					href: "https://github.com/mdn/translated-content/commits/main/?author=Pleasurecruise",
				},
			],
		},
	],
	contributions: [
		{
			title: "Cherry Studio",
			dates: "Feb 2025 - Present",
			description:
				"Cross-platform desktop AI client supporting 300+ LLM providers. Contributions cover features, bug fixes, refactoring, dependency upgrades, and security patches.",
			image: "https://github.com/CherryHQ.png",
			links: [
				{
					title: "My Contributions",
					icon: <Icons.github className="h-4 w-4" />,
					href: "https://github.com/CherryHQ/cherry-studio/commits/main/?author=Pleasurecruise",
				},
			],
		},
		{
			title: "note-gen",
			dates: "2025 - Present",
			description:
				"Cross-platform Markdown note-taking app with AI integration. Contributions include i18n improvements, title extraction, file handling, and export fixes.",
			image:
				"https://raw.githubusercontent.com/codexu/note-gen/refs/heads/dev/public/app-icon.png",
			links: [
				{
					title: "My Contributions",
					icon: <Icons.github className="h-4 w-4" />,
					href: "https://github.com/codexu/note-gen/commits/dev/?author=Pleasurecruise",
				},
			],
		},
		{
			title: "Dify",
			dates: "2025 - Present",
			description:
				"Production-ready LLM application development platform. Contributions include UI fixes, content-type handling improvements, and plugin task header styling.",
			image: "https://github.com/langgenius.png",
			links: [
				{
					title: "My Contributions",
					icon: <Icons.github className="h-4 w-4" />,
					href: "https://github.com/langgenius/dify/commits/main/?author=Pleasurecruise",
				},
			],
		},
		{
			title: "Docmost",
			dates: "2025 - Present",
			description:
				"Open-source collaborative wiki and documentation platform. Contributions include combobox prop fixes and search-and-replace empty term handling.",
			image: "https://github.com/docmost.png",
			links: [
				{
					title: "My Contributions",
					icon: <Icons.github className="h-4 w-4" />,
					href: "https://github.com/docmost/docmost/commits/main/?author=Pleasurecruise",
				},
			],
		},
		{
			title: "Blinko",
			dates: "2025 - Present",
			description:
				"Open-source note-taking app focused on quick capture and AI-powered organization.",
			image: "https://github.com/blinkospace.png",
			links: [
				{
					title: "My Contributions",
					icon: <Icons.github className="h-4 w-4" />,
					href: "https://github.com/blinkospace/blinko/commits/main/?author=Pleasurecruise",
				},
			],
		},
		{
			title: "LobeHub",
			dates: "2025 - Present",
			description:
				"Open-source community ecosystem for AI-powered tools and extensions.",
			image: "https://github.com/lobehub.png",
			links: [
				{
					title: "My Contributions",
					icon: <Icons.github className="h-4 w-4" />,
					href: "https://github.com/lobehub/lobehub/commits/main/?author=Pleasurecruise",
				},
			],
		},
		{
			title: "Zoot Plus Backend",
			dates: "2025 - Present",
			description:
				"Backend service for the Arknights homework collection site.",
			image: "https://github.com/ZOOT-Plus.png",
			links: [
				{
					title: "My Contributions",
					icon: <Icons.github className="h-4 w-4" />,
					href: "https://github.com/ZOOT-Plus/ZootPlusBackend/commits/main/?author=Pleasurecruise",
				},
			],
		},
	],
	hackathons: [
		{
			title: "LeedsHack 2026",
			dates: "February 7th - 8th, 2026",
			location: "Leeds, UK",
			description: "An interactive AI-powered digital pet for LeedsHack 2026.",
			image: "/hackathons/leedshack2026-logo.svg",
			mlh: "/hackathons/mlh-2026-badge.svg",
			links: [
				{
					title: "Website",
					icon: <Icons.globe className="h-4 w-4" />,
					href: "https://leedshack.com",
				},
				{
					title: "Devpost",
					icon: <Icons.globe className="h-4 w-4" />,
					href: "https://leedshack-2026.devpost.com",
				},
				{
					title: "Project",
					icon: <Icons.github className="h-4 w-4" />,
					href: "https://github.com/Pleasurecruise/leedshack-digitalpet",
				},
			],
		},
		{
			title: "HackSheffield10",
			dates: "November 29th - 30th, 2025",
			location: "Sheffield, UK",
			description:
				"HackSheffield 10 is a hackathon hosted by Sheffield CompSoc at The University of Sheffield. The event welcomes students of all skill levels and disciplines to build projects, learn new skills, and collaborate.",
			image: "/hackathons/hacksheffield10-logo.svg",
			mlh: "/hackathons/mlh-2026-badge.svg",
			links: [
				{
					title: "Website",
					icon: <Icons.globe className="h-4 w-4" />,
					href: "https://hacksheffield.uk/",
				},
			],
		},
		{
			title: "HackNotts' 25",
			dates: "October 25th - 26th, 2025",
			location: "Nottingham, UK",
			description:
				"Developed an interactive terminal-based AI chat application with support for multiple AI providers through a React-powered command-line interface.",
			image: "/hackathons/hacknotts25-logo.png",
			mlh: "/hackathons/mlh-2026-badge.svg",
			links: [
				{
					title: "Website",
					icon: <Icons.globe className="h-4 w-4" />,
					href: "https://hacknotts.com",
				},
				{
					title: "Devpost",
					icon: <Icons.globe className="h-4 w-4" />,
					href: "https://hacknotts-25.devpost.com",
				},
				{
					title: "Project",
					icon: <Icons.github className="h-4 w-4" />,
					href: "https://github.com/Pleasurecruise/hacknotts-cli",
				},
			],
		},
	],
} as const;
