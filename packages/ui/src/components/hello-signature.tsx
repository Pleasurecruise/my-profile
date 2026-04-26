"use client";

import { useEffect, useId, useRef, useState } from "react";

const font = { className: "", style: { fontFamily: "'Dancing Script', cursive" } };

export function HelloSignature() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [started, setStarted] = useState(false);

  const rawId = useId();
  const clipId = `sig-clip-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 310 65"
      className="h-10 w-auto"
      aria-label="Pleasure1234"
      overflow="visible"
      fill="none"
    >
      <defs>
        <clipPath id={clipId}>
          <rect
            x="0"
            y="-8"
            width="310"
            height="80"
            style={
              {
                transform: started ? "scaleX(1)" : "scaleX(0)",
                transformBox: "fill-box",
                transformOrigin: "left center",
                transition: started
                  ? "transform 1.8s cubic-bezier(0.35, 0, 0.15, 1) 0.15s"
                  : "none",
              } as React.CSSProperties
            }
          />
        </clipPath>
      </defs>

      <text
        x="306"
        y="50"
        textAnchor="end"
        fill="currentColor"
        opacity="0.08"
        style={{
          fontFamily: font.style.fontFamily,
          fontSize: "44px",
          fontWeight: 600,
        }}
      >
        Pleasure1234
      </text>

      <text
        x="306"
        y="50"
        textAnchor="end"
        fill="currentColor"
        clipPath={`url(#${clipId})`}
        style={{
          fontFamily: font.style.fontFamily,
          fontSize: "44px",
          fontWeight: 600,
        }}
      >
        Pleasure1234
      </text>
    </svg>
  );
}
