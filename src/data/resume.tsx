import {Icons} from "@/components/icons";
import {HomeIcon, NotebookIcon, BotMessageSquareIcon, BoxIcon} from "lucide-react";

export const DATA = {
    name: "Yiming Wang",
    initials: "Pleasurecruise",
    url: "https://yiming1234.cn",
    location: "Ningbo, China",
    locationLink: "https://www.google.com/maps/place/ningbo",
    description:
        "Junior undergraduate student. I love to participate in open source projects. Active on X.",
    summary:
        "Passionate computer science student at UoN with hands-on experience in full-stack development and AI technologies. Proficient in modern web development frameworks like React, Next.js, and Vue, with internship experience in algorithm development and front-end engineering. " +
        "During my time at the school's computer enthusiasts association, I established the organization [CompPsyUnion](https://github.com/CompPsyUnion) on GitHub and was responsible for maintaining open-source activities. " +
        "In addition to the projects listed below, I have also actively contributed to many projects, such as [MirrorChyan](https://github.com/MirrorChyan/user-frontend), [blinko](https://github.com/blinkospace/blinko), [Hello Github](https://github.com/HelloGitHub-Team/geese) etc. " +
        "Skilled in both mobile and web development with expertise in TypeScript, Python, and database technologies.",
    avatarUrl: "/profile/me.png",
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
        {href: "/moment", icon: BoxIcon,label: "Moment"},
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
                "Participated in the demand analysis, system design, and coding implementation of the company's \"Plants vs. Zombies 2 UGC Upload System\" project, mainly responsible for front-end development and some testing and maintenance tasks.Utilized the shadcn-vue component library and lucide-vue-next icons, styled with Tailwind CSS. Employed vue router for page navigation and axios for request encapsulation and forwarding. Responsible for deploying front-end and back-end testing environments, verifying consistency between request/response models and interface documentation, and resolving cross-domain communication and debugging issues. Collaborated with the testing team to complete unit testing and bug fixes, optimizing system performance.",
        }
    ],
    academic: [
        {
            project: "FoSE SEP Project",
            subtitle: "Faculty of Science and Engineering Student Extra-curriculum Programme",
            href: "https://www.nottingham.ac.uk",
            logoUrl: "/logos/uon.png",
            start: "Jun 2025",
            end: "Aug 2025",
            description:
                "Medical Image Analysis with Deep Learning. This project explores the application of deep learning in analyzing medical images for disease detection and diagnosis. By processing medical scans such as X-rays, MRIs, and CT scans, the system aims to identify abnormalities and classify diseases to assist healthcare professionals. The objective is to improve diagnostic accuracy, automate image-based decision-making, and enhance the efficiency of medical imaging analysis.",
        }
    ],
    education: [
        {
            school: "University of Nottingham",
            href: "https://www.nottingham.ac.uk",
            degree: "BSc Computer Science with Artificial Intelligence",
            logoUrl: "/logos/uon.png",
            start: "2023",
            end: "2027",
        }
    ],
    projects: [
        {
            title: "Cherry Studio",
            href: "#",
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
                    href: "#",
                    icon: <Icons.globe className="size-3"/>,
                },
                {
                    type: "Source",
                    href: "https://github.com/CherryHQ/cherry-studio",
                    icon: <Icons.github className="size-3"/>,
                }
            ],
            image: "/projects/cherry.webp"
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
                "Redux Toolkit"
            ],
            links: [
                {
                    type: "Source",
                    href: "https://github.com/CherryHQ/cherry-studio-app",
                    icon: <Icons.github className="size-3"/>,
                },
            ],
            image: "/projects/cherry-app.png"
        },
        {
            title: "Note Gen",
            href: "#",
            dates: "Jun 2025 - Present",
            active: true,
            description:
                "NoteGen is a cross-platform Markdown note-taking application dedicated to using AI to bridge recording and writing, organizing fragmented knowledge into a readable note.",
            technologies: [
                "Tauri",
                "TypeScript",
                "React",
                "Node.js"
            ],
            links: [
                {
                    type: "Website",
                    href: "https://notegen.top/en",
                    icon: <Icons.globe className="size-3"/>,
                },
                {
                    type: "Source",
                    href: "https://github.com/codexu/note-gen",
                    icon: <Icons.github className="size-3"/>,
                },
            ],
            image: "/projects/note-gen.png"
        },
        {
            title: " Zoot Plus Backend",
            href: "#",
            dates: "Feb 2025 - Present",
            active: true,
            description:
                "Backend for Zoot Plus, an Arknights homework collection website. Integration with MAA",
            technologies: [
                "Kotlin",
                "Spring Boot",
                "MongoDB",
                "Redis",
                "Docker",
            ],
            links: [
                {
                    type: "Website",
                    href: "https://zoot.plus",
                    icon: <Icons.globe className="size-3"/>,
                },
                {
                    type: "Source",
                    href: "https://github.com/ZOOT-Plus/ZootPlusBackend",
                    icon: <Icons.github className="size-3"/>,
                },
            ],
            image: "/projects/zoot-plus.png"
        },
        {
            title: "NottinghamWall",
            href: "#",
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
                    type: "Source",
                    href: "https://github.com/CompPsyUnion/NottinghamWall",
                    icon: <Icons.github className="size-3"/>,
                },
            ],
            image: "/projects/nottinghamwall.png"
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
                    href: "https://linux.do/t/topic/527169",
                    icon: <Icons.globe className="size-3"/>,
                },
                {
                    type: "Source",
                    href: "https://github.com/Pleasurecruise/linux-do-mcp",
                    icon: <Icons.github className="size-3"/>,
                },
            ],
            image: "/projects/linux-do-mcp.png"
        }
    ],
    translates: [
        {
            title: "React",
            dates: "2025 - Present",
            description:
                "Contributing to the React Chinese documentation project, helping translate official React documentation to make it accessible to Chinese developers. Contributed to pages including React Complier etc.",
            image:
                "/icons/react.png",
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
            image:
                "/projects/flutter.png",
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
            image:
                "/logos/mdn.png",
            links: [
                {
                    title: "My Contributions", 
                    icon: <Icons.github className="h-4 w-4" />,
                    href: "https://github.com/mdn/translated-content/commits/main/?author=Pleasurecruise",
                },
            ],
        }
    ],
    hackathons: [
        {
            title: "HackSheffield10",
            dates: "November 29th - 30th, 2025",
            location: "Sheffield, UK",
            description:
                "HackSheffield 10 is a hackathon hosted by Sheffield CompSoc at The University of Sheffield. The event welcomes students of all skill levels and disciplines to build projects, learn new skills, and collaborate.",
            image:
                "/hackathons/hacksheffield10-logo.svg",
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
            image:
                "/hackathons/hacknotts25-logo.png",
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
