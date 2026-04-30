import { createFileRoute } from "@tanstack/react-router";

type GalleryPhoto = {
  id: string;
  img: string;
  title: string;
  ratio: number;
};

export const Route = createFileRoute("/gallery")({
  loader: async (): Promise<GalleryPhoto[]> => {
    const res = await fetch("/api/gallery");
    if (!res.ok) throw new Error("Failed to load gallery");
    return res.json() as Promise<GalleryPhoto[]>;
  },
  component: GalleryPage,
});

function GalleryPage() {
  const photos = Route.useLoaderData();

  return (
    <div className="w-[100vw] ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-24 pt-6 sm:pt-8">
      <section>
        <MasonryGallery items={photos} />
      </section>
    </div>
  );
}

// Inline masonry gallery (avoids Next.js-specific imports from original file)
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PixelImage } from "@/components/magicui/pixel-image";
import BlurFade from "@/components/magicui/blur-fade";

interface GridItem extends GalleryPhoto {
  x: number;
  y: number;
  w: number;
  h: number;
}

const GAP = 16;

function useColumnCount() {
  const [columns, setColumns] = useState(2);
  useEffect(() => {
    const breakpoints = [
      { mq: matchMedia("(min-width: 1500px)"), cols: 5 },
      { mq: matchMedia("(min-width: 1000px)"), cols: 4 },
      { mq: matchMedia("(min-width: 640px)"), cols: 3 },
    ];
    const update = () => {
      for (const { mq, cols } of breakpoints) {
        if (mq.matches) {
          setColumns(cols);
          return;
        }
      }
      setColumns(2);
    };
    update();
    breakpoints.forEach(({ mq }) => mq.addEventListener("change", update));
    return () => breakpoints.forEach(({ mq }) => mq.removeEventListener("change", update));
  }, []);
  return columns;
}

function MasonryGallery({ items }: { items: GalleryPhoto[] }) {
  const columns = useColumnCount();
  const containerRef = useRef<HTMLDivElement>(null);
  const [colW, setColW] = useState(0);
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);
  const [ratios, setRatios] = useState<Record<string, number>>({});

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const w = entry.contentRect.width;
      setColW((w - GAP * (columns - 1)) / columns);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [columns]);

  const grid = useMemo<GridItem[]>(() => {
    if (!colW) return [];
    const colHeights = Array<number>(columns).fill(0);
    return items.map((item) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (colW + GAP);
      const y = colHeights[col] ?? 0;
      const ratio = ratios[item.id] ?? item.ratio;
      const h = colW * ratio;
      colHeights[col] = (colHeights[col] ?? 0) + h + GAP;
      return { ...item, x, y, w: colW, h };
    });
  }, [items, colW, columns, ratios]);

  const totalH = useMemo(() => Math.max(...grid.map((i) => i.y + i.h), 0), [grid]);

  return (
    <>
      <div ref={containerRef} className="relative w-full" style={{ height: totalH }}>
        {grid.map((item, i) => (
          <div
            key={item.id}
            className="absolute overflow-hidden rounded-lg"
            style={{ left: item.x, top: item.y, width: item.w, height: item.h }}
          >
            <BlurFade delay={i * 0.03} className="w-full h-full" yOffset={0}>
              <button
                type="button"
                className="w-full h-full cursor-pointer focus:outline-none"
                onClick={() => setSelected(item)}
              >
                <PixelImage
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.currentTarget;
                    if (naturalWidth && naturalHeight) {
                      setRatios((prev) => ({ ...prev, [item.id]: naturalHeight / naturalWidth }));
                    }
                  }}
                />
              </button>
            </BlurFade>
          </div>
        ))}
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {selected && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelected(null)}
              >
                <motion.img
                  src={selected.img}
                  alt={selected.title}
                  className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain shadow-2xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
