import {Icons} from "@/components/icons";
import {HomeIcon, NotebookIcon, BotMessageSquareIcon} from "lucide-react";

export const DATA = {
    name: "Yiming Wang",
    initials: "Pleasurecruise",
    url: "https://yiming1234.cn",
    location: "Ningbo, China",
    locationLink: "https://www.google.com/maps/place/ningbo",
    description:
        "Junior undergraduate student. I love to participate in open source projects. Active on X.",
    summary:
        "Passionate computer science student at UoN with hands-on experience in full-stack development and AI technologies. Proficient in modern web development frameworks like React, Next.js, and Vue, with internship experience in algorithm development and front-end engineering. During my time at the school's computer enthusiasts association, I established the organization [CompPsyUnion](https://github.com/CompPsyUnion) on GitHub and was responsible for maintaining open-source activities. Active contributor to open source projects including [Cherry Studio](https://github.com/CherryHQ/cherry-studio), [cherry-studio-app](https://github.com/CherryHQ/cherry-studio-app), [Zoot Plus Backend](https://github.com/ZOOT-Plus/ZootPlusBackend), [MirrorChyan](https://github.com/MirrorChyan/user-frontend), [Hello Github](https://github.com/HelloGitHub-Team/geese) etc. Skilled in both mobile and web development with expertise in TypeScript, Python, and database technologies.",
    avatarUrl: "/me.png",
    skills: [
        "React",
        "Typescript",
        "Next.js",
        "Node.js",
        "Python",
        "Java",
        "Go",
        "Postgres",
        "MongoDB",
        "MySQL",
        "Docker"
    ],
    navbar: [
        {href: "/", icon: HomeIcon, label: "Home"},
        {href: "/blog", icon: NotebookIcon, label: "Blog"},
        {href: "/chat", icon: BotMessageSquareIcon, label: "Chat"}
    ],
    contact: {
        email: "3196812536@qq.com",
        social: {
            GitHub: {
                name: "GitHub",
                url: "https://github.com/Pleasurecruise",
                icon: Icons.github,

                navbar: true,
            },
            LinkedIn: {
                name: "LinkedIn",
                url: "https://www.linkedin.com/in/pleasure1234",
                icon: Icons.linkedin,

                navbar: true,
            },
            X: {
                name: "X",
                url: "https://x.com/Pleasure9876",
                icon: Icons.x,

                navbar: true,
            },
            email: {
                name: "Send Email",
                url: "#",
                icon: Icons.email,

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
            logoUrl: "/zju.png",
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
            logoUrl: "/hrg.png",
            start: "Apr 2025",
            end: "May 2025",
            description:
                "Participated in the demand analysis, system design, and coding implementation of the company's \"Plants vs. Zombies 2 UGC Upload System\" project, mainly responsible for front-end development and some testing and maintenance tasks.Utilized the shadcn-vue component library and lucide-vue-next icons, styled with Tailwind CSS. Employed vue router for page navigation and axios for request encapsulation and forwarding. Responsible for deploying front-end and back-end testing environments, verifying consistency between request/response models and interface documentation, and resolving cross-domain communication and debugging issues. Collaborated with the testing team to complete unit testing and bug fixes, optimizing system performance.",
        }
    ],
    education: [
        {
            school: "University of Nottingham",
            href: "https://www.nottingham.ac.uk",
            degree: "BSc Computer Science with Artificial Intelligence",
            logoUrl: "/uon.png",
            start: "2023",
            end: "2027",
        }
    ],
    projects: [
        {
            title: "Cherry Studio",
            href: "https://www.cherry-ai.com",
            dates: "Feb 2025 - Present",
            active: true,
            description:
                "A cross-platform desktop client supporting multiple LLM providers including OpenAI, Anthropic, and Gemini. Features 300+ pre-configured AI assistants, document processing capabilities, and support for both cloud and local models via Ollama.",
            technologies: [
                "Electron",
                "TypeScript",
                "React",
                "Node.js"
            ],
            links: [
                {
                    type: "Website",
                    href: "https://www.cherry-ai.com",
                    icon: <Icons.globe className="size-3"/>,
                },
                {
                    type: "Source",
                    href: "https://github.com/magicuidesign/magicui",
                    icon: <Icons.github className="size-3"/>,
                }
            ],
            image: "/cherry.webp"
        },
        {
            title: "Cherry Studio App",
            href: "https://github.com/CherryHQ/cherry-studio-app",
            dates: "Mar 2025 - Present",
            active: true,
            description:
                "The official mobile version of Cherry Studio, bringing powerful LLMs to iOS and Android devices. Features multi-LLM provider support, AI assistants, conversation management, and mobile-optimized design with cross-platform compatibility.",
            technologies: [
                "React Native",
                "Expo",
                "TypeScript",
                "Tamagui",
                "Redux Toolkit"
            ],
            links: [
                {
                    type: "Website",
                    href: "https://github.com/CherryHQ/cherry-studio-app",
                    icon: <Icons.github className="size-3"/>,
                },
            ],
            image: "/cherry-app.png"
        },
        {
            title: "NottinghamWall",
            href: "https://github.com/CompPsyUnion/NottinghamWall",
            dates: "Jun 2024 - Dec 2024",
            active: true,
            description:
                "A campus-oriented WeChat mini-program providing services and facilitating interactions for University of Nottingham Ningbo students. Features user management and forum exchange with a full-stack architecture.",
            technologies: [
                "Vue3",
                "UniApp",
                "SpringBoot",
                "MyBatis",
                "Element Plus"
            ],
            links: [
                {
                    type: "Website",
                    href: "https://github.com/CompPsyUnion/NottinghamWall",
                    icon: <Icons.github className="size-3"/>,
                },
            ],
            image: "/nottinghamwall.png"
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
                "Community Integration"
            ],
            links: [
                {
                    type: "Website",
                    href: "https://github.com/Pleasurecruise/linux-do-mcp",
                    icon: <Icons.github className="size-3"/>,
                },
            ],
            image: "/linux-do-mcp.png"
        }
    ]
} as const;
