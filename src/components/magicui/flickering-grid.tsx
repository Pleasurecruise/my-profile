"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
  style?: React.CSSProperties;
}

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  style,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const parseColor = useCallback((colorStr: string) => {
    const match = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
    }
    return { r: 0, g: 0, b: 0 };
  }, []);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, container: HTMLDivElement) => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      const w = width || rect.width;
      const h = height || rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);
      const cols = Math.floor(w / (squareSize + gridGap));
      const rows = Math.floor(h / (squareSize + gridGap));
      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }
      return { ctx, cols, rows, squares, w, h };
    },
    [squareSize, gridGap, width, height, maxOpacity]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let state = setupCanvas(canvas, container);
    let animationId: number;
    const { r, g, b } = parseColor(color);

    const draw = () => {
      state.ctx.clearRect(0, 0, state.w, state.h);
      for (let i = 0; i < state.squares.length; i++) {
        if (Math.random() < flickerChance) {
          state.squares[i] = Math.random() * maxOpacity;
        }
        const col = i % state.cols;
        const row = Math.floor(i / state.cols);
        const x = col * (squareSize + gridGap);
        const y = row * (squareSize + gridGap);
        state.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${state.squares[i]})`;
        state.ctx.fillRect(x, y, squareSize, squareSize);
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();

    const resizeObserver = new ResizeObserver(() => {
      state = setupCanvas(canvas, container);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [setupCanvas, flickerChance, maxOpacity, squareSize, gridGap, color, parseColor]);

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)} style={style}>
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  );
}