"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import CLOUDS2 from "vanta/dist/vanta.clouds2.min";

type VantaEffect = { destroy: () => void; setOptions: (opts: Record<string, unknown>) => void };

export function VantaClouds2() {
    const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (!vantaEffect) {
            const isDark = resolvedTheme === "dark";
            setVantaEffect(
                CLOUDS2({
                    el: containerRef.current,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    scale: 1.0,
                    scaleMobile: 1.0,
                    texturePath: "/noise.png",
                    backgroundColor: isDark ? 0x0a0a0f : 0xfafafa,
                    skyColor: isDark ? 0x0d1b2a : 0x68b8d4,
                    cloudColor: isDark ? 0x1a2a3a : 0xadc4d4,
                    lightColor: isDark ? 0x223344 : 0xffffff,
                    speed: 1.0,
                })
            );
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vantaEffect]);

    useEffect(() => {
        if (!vantaEffect) return;
        const isDark = resolvedTheme === "dark";
        vantaEffect.setOptions({
            backgroundColor: isDark ? 0x0a0a0f : 0xfafafa,
            skyColor: isDark ? 0x0d1b2a : 0x68b8d4,
            cloudColor: isDark ? 0x1a2a3a : 0xadc4d4,
            lightColor: isDark ? 0x223344 : 0xffffff,
        });
    }, [resolvedTheme, vantaEffect]);

    return <div ref={containerRef} className="fixed inset-0 -z-10" aria-hidden="true" />;
}