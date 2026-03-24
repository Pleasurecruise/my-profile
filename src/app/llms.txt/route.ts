export const revalidate = false;

export function GET() {
	const content = `# Yiming Wang (Pleasure1234)

> Personal portfolio website of Yiming Wang, a computer science student and full-stack developer.

## About

- Name: Yiming Wang
- Alias: Pleasurecruise / Pleasure1234
- Location: Nottingham, UK (originally from Ningbo, China)
- Education: BSc Computer Science with Artificial Intelligence, University of Nottingham (2023–2027)
- Email: pleasure9876@qq.com
- Website: https://yiming1234.cn

## Skills

React, TypeScript, Next.js, Node.js, Java, Python, Go, PostgreSQL, MongoDB, MySQL, Docker

## Work Experience

- Algorithm Internship — Ningbo Global Innovation Center, Zhejiang University (Jun–Aug 2025)
  Speech separation project based on Mamba-TasNet, interface encapsulation, dataset construction.

- Front-end Internship — Shanghai HRG Information Technology Co. (Apr–May 2025)
  Front-end development for a UGC Upload System using Vue 3, shadcn-vue, Tailwind CSS, and Axios.

## Education

- BSc Computer Science with Artificial Intelligence — University of Nottingham (2023–2027)

## Notable Projects

- Cherry Studio — Cross-platform desktop AI client supporting multiple LLM providers (Electron, React, TypeScript)
- Cherry Studio App — Official mobile version of Cherry Studio (React Native, Expo, TypeScript)
- NottinghamWall — Campus WeChat mini-program for University of Nottingham Ningbo students (Vue3, UniApp, SpringBoot)
- Linux Do MCP Server — MCP server for Linux DO community forum API (TypeScript, Python)

## Open Source Contributions (100+ merged PRs across 12 projects)

- Cherry Studio (79 PRs) — Cross-platform desktop AI client: https://github.com/CherryHQ/cherry-studio
- note-gen (5 PRs) — AI-powered Markdown note-taking app: https://github.com/codexu/note-gen
- React Chinese Docs (4 PRs) — React Compiler section translation: https://github.com/reactjs/zh-hans.react.dev
- Dify (3 PRs) — Production-ready LLM application platform: https://github.com/langgenius/dify
- Docmost (2 PRs) — Open-source collaborative wiki: https://github.com/docmost/docmost
- Flutter Chinese Community (1 PR): https://github.com/cfug/flutter.cn
- MDN Web Docs Chinese (1 PR): https://github.com/mdn/translated-content
- Blinko (1 PR) — Open-source note-taking app: https://github.com/blinkospace/blinko
- Zoot Plus Backend (1 PR) — Arknights homework collection: https://github.com/ZOOT-Plus/ZootPlusBackend
- LobeHub (1 PR): https://github.com/lobehub/lobehub
- obsidian-copilot (1 PR): https://github.com/logancyang/obsidian-copilot
- opencli (1 PR): https://github.com/jackwener/opencli
- twitter-cli (1 PR): https://github.com/jackwener/twitter-cli

## Social

- GitHub: https://github.com/Pleasurecruise
- X (Twitter): https://x.com/Pleasure9876
- LinkedIn: https://www.linkedin.com/in/pleasure1234

## Hackathons

- LeedsHack 2026 — University of Leeds
- HackSheffield 10 — University of Sheffield
- HackNotts 25 — University of Nottingham

## Pages

- Home: https://yiming1234.cn/home
- Blog: https://yiming1234.cn/blog
- Story: https://yiming1234.cn/story
- CV: https://yiming1234.cn/cv
- Chat: https://yiming1234.cn/chat
- Moments: https://yiming1234.cn/moment
- Am I OK: https://yiming1234.cn/am-i-ok
`;

	return new Response(content, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
}
