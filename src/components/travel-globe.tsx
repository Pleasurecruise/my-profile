"use client";

import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface TravelLocation {
  name: string;
  location: [number, number];
  size?: number;
}

interface TravelGlobeProps {
  locations: TravelLocation[];
  className?: string;
}

const DRAG_SENSITIVITY = 0.01;

export function TravelGlobe({ locations, className }: TravelGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const focusRef = useRef<[number, number]>([0, 0]);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const currentAngles = useRef({ phi: 0, theta: 0.3 });
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  const locationToAngles = (lat: number, long: number): [number, number] => {
    return [
      Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
      (lat * Math.PI) / 180,
    ];
  };

  const updatePointerInteraction = (value: { x: number; y: number } | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const handlePointerDown = (clientX: number, clientY: number) => {
    pointerInteracting.current = { x: clientX, y: clientY };
    updatePointerInteraction({ x: clientX, y: clientY });
    focusRef.current = [0, 0];
    setActiveLocation(null);
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (pointerInteracting.current !== null) {
      const deltaX = clientX - pointerInteracting.current.x;
      const deltaY = clientY - pointerInteracting.current.y;

      currentAngles.current.phi += deltaX * DRAG_SENSITIVITY;
      currentAngles.current.theta += deltaY * DRAG_SENSITIVITY;

      pointerInteracting.current = { x: clientX, y: clientY };
    }
  };

  useEffect(() => {
    let width = 0;
    const doublePi = Math.PI * 2;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [251 / 255, 100 / 255, 21 / 255],
      glowColor: [1.2, 1.2, 1.2],
      markers: locations.map((loc) => ({
        location: loc.location,
        size: loc.size ?? 0.08,
      })),
      onRender: (state) => {
        const [focusPhi, focusTheta] = focusRef.current;
        const isIdle = focusPhi === 0 && focusTheta === 0;
        const isDragging = pointerInteracting.current !== null;

        if (isDragging) {
        } else if (isIdle) {
          currentAngles.current.phi += 0.005;
        } else {
          const distPositive =
            (focusPhi - currentAngles.current.phi + doublePi) % doublePi;
          const distNegative =
            (currentAngles.current.phi - focusPhi + doublePi) % doublePi;

          if (distPositive < distNegative) {
            currentAngles.current.phi += distPositive * 0.08;
          } else {
            currentAngles.current.phi -= distNegative * 0.08;
          }
          currentAngles.current.theta =
            currentAngles.current.theta * 0.92 + focusTheta * 0.08;
        }

        state.phi = currentAngles.current.phi;
        state.theta = currentAngles.current.theta;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [locations]);

  const handleLocationClick = (loc: TravelLocation) => {
    focusRef.current = locationToAngles(loc.location[0], loc.location[1]);
    setActiveLocation(loc.name);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative mx-auto aspect-square w-full max-w-[400px]">
        <canvas
          ref={canvasRef}
          className="h-full w-full cursor-grab opacity-0 transition-opacity duration-1000 [contain:layout_paint_size]"
          onPointerDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onPointerUp={() => updatePointerInteraction(null)}
          onPointerOut={() => updatePointerInteraction(null)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onTouchMove={(e) =>
            e.touches[0] &&
            handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)
          }
        />
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {locations.map((loc) => (
          <button
            key={loc.name}
            onClick={() => handleLocationClick(loc)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm transition-colors",
              "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700",
              activeLocation === loc.name &&
                "bg-neutral-200 dark:bg-neutral-700"
            )}
          >
            📍 {loc.name}
          </button>
        ))}
      </div>
    </div>
  );
}
