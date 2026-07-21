import { createFileRoute } from "@tanstack/react-router";
import { InfiniteGallery, type GalleryImage } from "@/components/reactbits/infinite-gallery";

export const Route = createFileRoute("/gallery")({
  loader: async (): Promise<GalleryImage[]> => {
    const response = await fetch("/api/gallery");
    if (!response.ok) throw new Error(`Failed to load R2 gallery (${response.status})`);
    const keys = (await response.json()) as string[];

    return keys.map((key) => ({
      url: `/api/gallery/img/${key}`,
      alt: photoLabel(key),
    }));
  },
  component: GalleryPage,
});

function photoLabel(key: string) {
  const filename = key.split("/").at(-1) ?? key;
  return filename.replace(/\.[^.]+$/, "").replaceAll(/[-_]+/g, " ");
}

function GalleryPage() {
  const photos = Route.useLoaderData();

  return (
    <main className="fixed inset-0 z-20 overflow-hidden bg-black text-white">
      {photos.length > 0 ? (
        <InfiniteGallery images={photos} />
      ) : (
        <div className="flex size-full items-center justify-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            The archive is quiet
          </p>
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_38%,rgba(0,0,0,0.18)_68%,rgba(0,0,0,0.62)_100%)]"
        aria-hidden="true"
      />

      {photos.length > 0 && (
        <>
          <div className="pointer-events-none absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 backdrop-blur-md sm:right-7 sm:top-7">
            <span className="size-1 rounded-full bg-white/70" />
            {photos.length} frames
          </div>

          <p className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.22em] text-white/35">
            Drag · Scroll · Select
          </p>
        </>
      )}
    </main>
  );
}
