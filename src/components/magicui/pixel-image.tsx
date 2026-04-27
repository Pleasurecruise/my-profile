"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type GridPreset = "6x4" | "8x8" | "8x3" | "4x6" | "3x8";

const GRID_PRESETS: Record<GridPreset, { rows: number; cols: number }> = {
  "6x4": { rows: 6, cols: 4 },
  "8x8": { rows: 8, cols: 8 },
  "8x3": { rows: 8, cols: 3 },
  "4x6": { rows: 4, cols: 6 },
  "3x8": { rows: 3, cols: 8 },
};

interface PixelImageProps {
  src: string;
  alt?: string;
  grid?: GridPreset;
  customGrid?: { rows: number; cols: number };
  grayscaleAnimation?: boolean;
  pixelFadeInDuration?: number;
  maxAnimationDelay?: number;
  colorRevealDelay?: number;
  className?: string;
  imgClassName?: string;
  style?: React.CSSProperties;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export function PixelImage({
  src,
  alt = "",
  grid = "8x8",
  customGrid,
  grayscaleAnimation = true,
  pixelFadeInDuration = 1000,
  maxAnimationDelay = 1200,
  colorRevealDelay = 1500,
  className,
  imgClassName,
  style,
  onLoad,
}: PixelImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [isGrayscale, setIsGrayscale] = useState(true);

  const { rows, cols } = customGrid ?? GRID_PRESETS[grid];
  const cellCount = rows * cols;

  const delays = useRef<number[]>([]);
  if (delays.current.length !== cellCount) {
    delays.current = Array.from({ length: cellCount }, () => Math.random() * maxAnimationDelay);
  }

  useEffect(() => {
    if (!loaded || !grayscaleAnimation) return;
    const timer = setTimeout(() => setIsGrayscale(false), colorRevealDelay);
    return () => clearTimeout(timer);
  }, [loaded, grayscaleAnimation, colorRevealDelay]);

  return (
    <div className={cn("relative overflow-hidden", className)} style={style}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        className={cn("absolute inset-0 w-full h-full object-cover", imgClassName)}
        style={{
          filter: grayscaleAnimation && isGrayscale ? "grayscale(1)" : "grayscale(0)",
          transition: `filter ${pixelFadeInDuration}ms ease`,
        }}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />

      <div
        className="absolute inset-0 grid pointer-events-none"
        style={{
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}
      >
        {Array.from({ length: cellCount }).map((_, i) => (
          <div
            key={i}
            className="bg-muted"
            style={{
              opacity: loaded ? 0 : 1,
              transition: loaded
                ? `opacity ${pixelFadeInDuration}ms ease ${delays.current[i]}ms`
                : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
