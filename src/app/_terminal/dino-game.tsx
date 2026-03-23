"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ChromeDinoGame = dynamic(() => import("react-chrome-dino-ts"), {
    ssr: false,
    loading: () => (
        <div className="flex min-h-[180px] items-center justify-center text-sm text-zinc-500">
            Loading Dino...
        </div>
    ),
});

type DinoGameProps = {
    onExit: () => void;
};

export function DinoGame({ onExit }: DinoGameProps) {
    const [gameKey, setGameKey] = useState(0);
    const [exiting, setExiting] = useState(false);

    const restartGame = () => setGameKey((key) => key + 1);
    const handleExit = () => setExiting(true);

    useEffect(() => {
        if (!exiting) return;
        const id = setTimeout(onExit, 50);
        return () => clearTimeout(id);
    }, [exiting, onExit]);

    return (
        <section className="mb-4 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950/80">
            <div className="flex flex-col gap-3 border-b border-zinc-700 bg-zinc-900/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">arcade mode</p>
                    <p className="mt-1 text-sm text-zinc-200">Click the game area, then use `Space` or `↑` to jump, `↓` to duck.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={restartGame}
                        className="rounded border border-zinc-600 px-3 py-1.5 text-xs text-zinc-200 transition hover:border-zinc-400 hover:bg-zinc-800"
                    >
                        Restart
                    </button>
                    <button
                        type="button"
                        onClick={handleExit}
                        className="rounded border border-cyan-700 px-3 py-1.5 text-xs text-cyan-300 transition hover:border-cyan-500 hover:bg-cyan-950/50"
                    >
                        Exit
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto bg-white px-2 py-4 sm:px-4">
                <div className="mx-auto min-w-[320px] max-w-[600px]">
                    {!exiting && <ChromeDinoGame key={gameKey} />}
                </div>
            </div>
        </section>
    );
}
