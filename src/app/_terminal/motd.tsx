"use client";

import { useState, useEffect, startTransition } from "react";
import { DATA } from "@/data/resume";

function parseBrowser(ua: string): string {
    if (/Edg\/[\d.]+/.test(ua)) return `Edge ${ua.match(/Edg\/([\d.]+)/)?.[1] ?? ""}`;
    if (/OPR\/[\d.]+/.test(ua)) return `Opera ${ua.match(/OPR\/([\d.]+)/)?.[1] ?? ""}`;
    if (/Chrome\/[\d.]+/.test(ua)) return `Chrome ${ua.match(/Chrome\/([\d.]+)/)?.[1] ?? ""}`;
    if (/Firefox\/[\d.]+/.test(ua)) return `Firefox ${ua.match(/Firefox\/([\d.]+)/)?.[1] ?? ""}`;
    if (/Safari\/[\d.]+/.test(ua)) return `Safari ${ua.match(/Version\/([\d.]+)/)?.[1] ?? ""}`;
    return "Unknown";
}

function parsePlatform(ua: string): string {
    if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
    if (/Android/.test(ua)) return `Android ${ua.match(/Android ([\d.]+)/)?.[1] ?? ""}`;
    if (/Windows NT/.test(ua)) {
        const v = ua.match(/Windows NT ([\d.]+)/)?.[1];
        const map: Record<string, string> = {
            "10.0": "Windows 10/11",
            "6.3": "Windows 8.1",
            "6.2": "Windows 8",
            "6.1": "Windows 7",
        };
        return map[v ?? ""] ?? `Windows NT ${v}`;
    }
    if (/Mac OS X/.test(ua)) return `macOS ${(ua.match(/Mac OS X ([\d_]+)/)?.[1] ?? "").replace(/_/g, ".")}`;
    if (/Linux/.test(ua)) return "Linux";
    return "Unknown";
}

import { MC_ARTS } from "./mc-arts";

function McArt() {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        startTransition(() => {
            setLines(MC_ARTS[Math.floor(Math.random() * MC_ARTS.length)] ?? []);
        });
    }, []);

    const lineCounts = new Map<string, number>();

    return (
        <div className="my-2 leading-none text-base select-none ml-8">
            {lines.map((row) => {
                const nextCount = (lineCounts.get(row) ?? 0) + 1;
                lineCounts.set(row, nextCount);

                return <div key={`${row}:${nextCount}`}>{row}</div>;
            })}
        </div>
    );
}

export function MOTD() {
    const [info, setInfo] = useState({
        dateStr: "", browser: "", platform: "", resolution: "", language: "", ip: "loading...",
    });

    useEffect(() => {
        const ua = navigator.userAgent;
        startTransition(() => {
            setInfo((prev) => ({
                ...prev,
                dateStr: new Date().toUTCString().replace("GMT", "UTC"),
                browser: parseBrowser(ua),
                platform: parsePlatform(ua),
                resolution: `${screen.width} x ${screen.height}`,
                language: navigator.language,
            }));
        });
        fetch("https://api.ipify.org?format=json")
            .then((r) => r.json())
            .then((d: { ip: string }) => setInfo((prev) => ({ ...prev, ip: d.ip })))
            .catch(() => setInfo((prev) => ({ ...prev, ip: "unavailable" })));
    }, []);

    const { dateStr, browser, platform, resolution, language, ip } = info;

    const link = (href: string, text: string) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-cyan-400 hover:underline"
        >
            {text}
        </a>
    );

    return (
        <div className="mb-2 font-mono text-sm leading-relaxed">
            <p className="text-white">
                Welcome to{" "}
                <span className="text-green-400 font-bold">Pleasure1234&apos;s Website</span>
                {" "}(Next.js 16 / TypeScript)
            </p>
            <McArt />

            <p className="text-white mb-1"><span className="text-green-400">$</span> /whoami</p>
            <div className="mb-3 ml-2 space-y-1.5 text-zinc-300">
                <p>
                    <span className="text-yellow-400">👋</span>{" "}
                    Hi! I&apos;m <span className="text-green-400 font-bold">Pleasure1234</span>{" "}
                    <span className="text-zinc-500">(@Pleasurecruise)</span>
                </p>
                <p className="text-zinc-500">Keywords: <span className="text-zinc-400">TypeScript, React, Next.js</span></p>
                <p className="text-zinc-500 ml-9"><span className="text-zinc-400">Agents, Open Source, Hackathon</span></p>
                <p>Junior undergrad @ <span className="text-white">University of Nottingham</span>,</p>
                <p>studying <span className="text-cyan-400">BSc Computer Science with AI</span>.</p>
                <p>Interested in front-end engineering. Hope to have my own open source project.</p>
                <p>
                    Founded{" "}{link("https://github.com/CompPsyUnion", "CompPsyUnion")}
                    {" "}· contributed to{" "}{link("https://github.com/CherryHQ/cherry-studio", "cherry-studio")}
                    {" "}·{" "}{link("https://github.com/codexu/note-gen", "note-gen")}
                    {" "}·{" "}{link("https://github.com/jackwener/twitter-cli", "twitter-cli")}
                </p>
                <p className="text-zinc-500">
                    📍 {DATA.location} · 🎓 2027 · 💼 {DATA.projects.length} projects · 🏆 {DATA.hackathons.length} hackathons
                </p>
            </div>

            <p className="text-white mb-2">
                Visitor system information as of <span className="text-zinc-300">{dateStr}</span>
            </p>
            <div className="ml-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0.5 text-zinc-300">
                <p><span className="text-zinc-500">Browser:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{browser}</p>
                <p><span className="text-zinc-500">Platform:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{platform}</p>
                <p><span className="text-zinc-500">Resolution:&nbsp;&nbsp;&nbsp;&nbsp;</span>{resolution}</p>
                <p><span className="text-zinc-500">Language:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{language}</p>
                <p><span className="text-zinc-500">IP Address:&nbsp;&nbsp;&nbsp;&nbsp;</span>{ip}</p>
            </div>

            <p className="mt-3 text-zinc-500">
                Type <span className="text-yellow-400">/help</span> to see available commands.
            </p>
            <p className="mt-3 text-zinc-500">
                Recommend to visit <span className="text-yellow-400">/go home</span>.
            </p>
        </div>
    );
}
