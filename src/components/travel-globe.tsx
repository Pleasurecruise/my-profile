"use client";

import mapboxgl, {type Map} from "mapbox-gl";
import {useEffect, useRef} from "react";
import {useTheme} from "next-themes";
import {cn} from "@/lib/utils";

export interface TravelLocation {
    name: string;
    location: Readonly<[number, number]>;
    size?: number;
}

interface TravelGlobeProps {
    locations: ReadonlyArray<TravelLocation>;
    className?: string;
}

const ROTATION_SPEED = 0.05;
const RESUME_DELAY_MS = 4000;

export function TravelGlobe({locations, className}: TravelGlobeProps) {
    const {resolvedTheme} = useTheme();
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const animationIdRef = useRef<number | null>(null);
    const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isUserInteractingRef = useRef(false);

    const isDark = resolvedTheme === "dark";
    const mapStyle = `mapbox://styles/mapbox/${isDark ? "dark" : "light"}-v10`;

    const toLngLat = (location: Readonly<[number, number]>) =>
        [location[1], location[0]] as [number, number];

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!token) {
            console.error("Missing NEXT_PUBLIC_MAPBOX_TOKEN for Mapbox GL.");
            return;
        }

        mapboxgl.accessToken = token;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: mapStyle,
            center: [100, 30],
            zoom: 1.6,
            projection: "globe",
            attributionControl: false,
            dragRotate: true,
            touchPitch: true,
        });

        mapRef.current = map;

        const handleResize = () => map.resize();
        window.addEventListener("resize", handleResize);

        const handleInteractionStart = () => {
            isUserInteractingRef.current = true;
            if (resumeTimeoutRef.current) {
                clearTimeout(resumeTimeoutRef.current);
                resumeTimeoutRef.current = null;
            }
        };

        const handleInteractionEnd = () => {
            resumeTimeoutRef.current = setTimeout(() => {
                isUserInteractingRef.current = false;
                resumeTimeoutRef.current = null;
            }, RESUME_DELAY_MS);
        };

        map.on("mousedown", handleInteractionStart);
        map.on("touchstart", handleInteractionStart);
        map.on("mouseup", handleInteractionEnd);
        map.on("touchend", handleInteractionEnd);

        const rotate = () => {
            if (!mapRef.current) return;
            if (!isUserInteractingRef.current) {
                const center = mapRef.current.getCenter();
                center.lng += ROTATION_SPEED;
                mapRef.current.setCenter(center);
            }
            animationIdRef.current = requestAnimationFrame(rotate);
        };
        rotate();

        return () => {
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
            if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
            window.removeEventListener("resize", handleResize);
            markersRef.current.forEach((marker) => marker.remove());
            markersRef.current = [];
            map.remove();
            mapRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const handleStyleLoad = () => {
            map.setProjection("globe");
        };

        if (map.isStyleLoaded()) {
            map.setProjection("globe");
        }
        map.once("style.load", handleStyleLoad);
        map.setStyle(mapStyle);

        return () => {
            map.off("style.load", handleStyleLoad);
        };
    }, [mapStyle, resolvedTheme]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        locations.forEach((loc) => {
            const el = document.createElement("div");
            const size = loc.size ? Math.max(6, loc.size * 120) : 8;
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.borderRadius = "9999px";
            el.style.background = "#fb6415";
            el.style.boxShadow = "0 0 10px rgba(251,100,21,0.6)";
            el.style.border = "2px solid rgba(255,255,255,0.8)";

            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnMove: false,
                offset: 10,
            }).setText(loc.name);

            el.addEventListener("mouseenter", () => {
                popup.setLngLat(toLngLat(loc.location)).addTo(map);
            });

            el.addEventListener("mouseleave", () => {
                popup.remove();
            });

            el.addEventListener("click", () => {
                map.flyTo({
                    center: toLngLat(loc.location),
                    zoom: 2.6,
                    speed: 0.9,
                    curve: 1.2,
                    essential: true,
                });
            });

            const marker = new mapboxgl.Marker({element: el, anchor: "center"})
                .setLngLat(toLngLat(loc.location))
                .addTo(map);

            markersRef.current.push(marker);
        });
    }, [locations]);

    return (
        <div className={cn("w-full", className)}>
            <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-2xl shadow-sm">
                <div ref={mapContainerRef} className="h-full w-full"/>
            </div>
        </div>
    );
}
