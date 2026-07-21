import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type GalleryImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type InfiniteGalleryProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
  images: GalleryImage[];
  density?: number;
  imageSize?: number;
  cellSize?: number;
  viewRange?: number;
  fogNear?: number;
  fogFar?: number;
  dragSpeed?: number;
  driftAmount?: number;
  friction?: number;
  autoZoom?: boolean;
  autoZoomSpeed?: number;
  imageRadius?: number;
  allowImageFocusOnClick?: boolean;
  backgroundColor?: string;
  fogColor?: string;
};

type Vec3 = { x: number; y: number; z: number };

type WorldImage = Vec3 & {
  key: string;
  imageIndex: number;
  size: number;
  width: number;
  height: number;
};

type ScreenImage = WorldImage & {
  screenX: number;
  screenY: number;
  screenWidth: number;
  screenHeight: number;
  depth: number;
  fog: number;
};

type CameraState = {
  position: Vec3;
  velocity: Vec3;
  target: Vec3;
  drift: { x: number; y: number };
  mouse: { x: number; y: number };
  dragDistanceSquared: number;
  focusTarget: WorldImage | null;
};

type LoadedImage = {
  element: HTMLImageElement;
  loaded: boolean;
  requested: boolean;
  loading: boolean;
  failed: boolean;
  priority: "high" | "auto";
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

function seededRandom(seed: number) {
  const value = Math.sin(seed * 9999) * 10000;
  return value - Math.floor(value);
}

function hashCell(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index++) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function smoothstep(edge0: number, edge1: number, value: number) {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function cssSize(value: string | number) {
  return typeof value === "number" ? `${value}px` : value;
}

function generateCell(
  cx: number,
  cy: number,
  cz: number,
  cellSize: number,
  density: number,
  imageSize: number,
  images: GalleryImage[],
) {
  const key = `${cx},${cy},${cz}|${cellSize}|${density}|${imageSize}`;
  const seed = hashCell(key);
  const result: WorldImage[] = [];

  for (let index = 0; index < density; index++) {
    const itemSeed = seed + 7919 * index;
    const size = imageSize * (0.65 + 0.7 * seededRandom(itemSeed + 4));
    const imageIndex = Math.floor(seededRandom(itemSeed + 5) * 1_000_000) % images.length;
    const image = images[imageIndex];
    if (!image) continue;
    const aspect =
      image.width && image.height && image.width > 0 && image.height > 0
        ? image.width / image.height
        : 1;

    result.push({
      key: `${key}-${index}`,
      x: cx * cellSize + seededRandom(itemSeed) * cellSize,
      y: cy * cellSize + seededRandom(itemSeed + 1) * cellSize,
      z: cz * cellSize + seededRandom(itemSeed + 2) * cellSize,
      imageIndex,
      size,
      width: size * aspect,
      height: size,
    });
  }

  return result;
}

export function InfiniteGallery({
  width = "100%",
  height = "100%",
  className,
  images,
  density = 5,
  imageSize = 24,
  cellSize = 100,
  viewRange = 2,
  fogNear = 120,
  fogFar = 320,
  dragSpeed = 1,
  driftAmount = 8,
  friction = 0.9,
  autoZoom = false,
  autoZoomSpeed = 0.5,
  imageRadius = 0.06,
  allowImageFocusOnClick = true,
  backgroundColor = "#000000",
  fogColor = "#000000",
}: InfiniteGalleryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const camera: CameraState = {
      position: { x: 0, y: 0, z: 50 },
      velocity: { x: 0, y: 0, z: 0 },
      target: { x: 0, y: 0, z: 0 },
      drift: { x: 0, y: 0 },
      mouse: { x: 0, y: 0 },
      dragDistanceSquared: 0,
      focusTarget: null,
    };
    const activePointers = new Map<number, { x: number; y: number }>();
    const assignedImages = new Map<string, number>();
    const loadedImages: LoadedImage[] = images.map(() => {
      const element = new Image();
      element.decoding = "async";
      return {
        element,
        loaded: false,
        requested: false,
        loading: false,
        failed: false,
        priority: "auto" as const,
      };
    });
    const imageQueue: number[] = [];
    let activeImageLoads = 0;
    let disposed = false;

    const pumpImageQueue = () => {
      while (!disposed && activeImageLoads < 6 && imageQueue.length > 0) {
        const imageIndex = imageQueue.shift();
        if (imageIndex === undefined) break;
        const item = loadedImages[imageIndex];
        const source = images[imageIndex];
        if (!item || !source || item.loading || item.loaded || item.failed) continue;

        item.loading = true;
        item.element.fetchPriority = item.priority;
        activeImageLoads++;

        const finish = (loaded: boolean) => {
          item.loaded = loaded;
          item.failed = !loaded;
          item.loading = false;
          activeImageLoads--;
          pumpImageQueue();
        };

        item.element.onload = () => finish(true);
        item.element.onerror = () => finish(false);
        item.element.src = source.url;
      }
    };

    const requestImage = (imageIndex: number, priority: "high" | "auto" = "auto") => {
      const item = loadedImages[imageIndex];
      if (!item || item.loaded || item.failed || item.loading) return;

      if (item.requested) {
        if (priority === "high" && item.priority !== "high") {
          item.priority = "high";
          const queuedAt = imageQueue.indexOf(imageIndex);
          if (queuedAt >= 0) {
            imageQueue.splice(queuedAt, 1);
            imageQueue.unshift(imageIndex);
          }
        }
        return;
      }

      item.requested = true;
      item.priority = priority;
      if (priority === "high") imageQueue.unshift(imageIndex);
      else imageQueue.push(imageIndex);
      pumpImageQueue();
    };

    for (let index = Math.min(images.length, 8) - 1; index >= 0; index--) {
      requestImage(index, "high");
    }

    let frame = 0;
    let viewportWidth = 1;
    let viewportHeight = 1;
    let lastPointerDistance = 0;
    let hitTargets: ScreenImage[] = [];
    let lastTime = performance.now();
    let isReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      viewportWidth = Math.max(1, bounds.width);
      viewportHeight = Math.max(1, bounds.height);
      const dprLimit = viewportWidth < 640 ? 1.25 : 1.5;
      const dpr = Math.min(window.devicePixelRatio || 1, dprLimit);
      canvas.width = Math.round(viewportWidth * dpr);
      canvas.height = Math.round(viewportHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const reducedMotionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      isReducedMotion = event.matches;
    };
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);

    const clearFocus = () => {
      camera.focusTarget = null;
    };

    const findHit = (x: number, y: number) => {
      for (let index = hitTargets.length - 1; index >= 0; index--) {
        const item = hitTargets[index];
        if (!item) continue;
        if (
          x >= item.screenX - item.screenWidth / 2 &&
          x <= item.screenX + item.screenWidth / 2 &&
          y >= item.screenY - item.screenHeight / 2 &&
          y <= item.screenY + item.screenHeight / 2
        ) {
          return item;
        }
      }
      return null;
    };

    const pointerDistance = () => {
      const pointers = [...activePointers.values()];
      const first = pointers[0];
      const second = pointers[1];
      if (!first || !second) return 0;
      return Math.hypot(first.x - second.x, first.y - second.y);
    };

    const onPointerDown = (event: PointerEvent) => {
      canvas.setPointerCapture(event.pointerId);
      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      camera.dragDistanceSquared = 0;
      lastPointerDistance = pointerDistance();
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      camera.mouse.x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1)) * 2 - 1;
      camera.mouse.y = -(((event.clientY - bounds.top) / Math.max(bounds.height, 1)) * 2 - 1);
      const previous = activePointers.get(event.pointerId);
      if (!previous) {
        const localX = event.clientX - bounds.left;
        const localY = event.clientY - bounds.top;
        canvas.style.cursor =
          allowImageFocusOnClick && findHit(localX, localY) ? "pointer" : "grab";
        return;
      }

      const deltaX = event.clientX - previous.x;
      const deltaY = event.clientY - previous.y;
      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      camera.dragDistanceSquared += deltaX * deltaX + deltaY * deltaY;

      if (activePointers.size === 1) {
        if (camera.focusTarget && camera.dragDistanceSquared > 16) clearFocus();
        camera.target.x -= deltaX * dragSpeed * 0.025;
        camera.target.y += deltaY * dragSpeed * 0.025;
      } else if (activePointers.size === 2) {
        const distance = pointerDistance();
        if (lastPointerDistance > 0) camera.target.z += (lastPointerDistance - distance) * 0.006;
        lastPointerDistance = distance;
        clearFocus();
      }
      canvas.style.cursor = "grabbing";
    };

    const onPointerUp = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const wasSinglePointer = activePointers.size === 1;
      activePointers.delete(event.pointerId);
      lastPointerDistance = pointerDistance();
      canvas.style.cursor = "grab";

      if (!allowImageFocusOnClick || !wasSinglePointer || camera.dragDistanceSquared > 16) return;
      const selected = findHit(event.clientX - bounds.left, event.clientY - bounds.top);
      if (!selected) {
        clearFocus();
        return;
      }
      if (camera.focusTarget?.key === selected.key) {
        clearFocus();
        return;
      }
      camera.focusTarget = selected;
      camera.velocity = { x: 0, y: 0, z: 0 };
      camera.target = { x: 0, y: 0, z: 0 };
    };

    const onPointerCancel = (event: PointerEvent) => {
      activePointers.delete(event.pointerId);
      lastPointerDistance = pointerDistance();
      canvas.style.cursor = "grab";
    };

    const onPointerLeave = () => {
      if (activePointers.size === 0) camera.mouse = { x: 0, y: 0 };
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      clearFocus();
      camera.target.z += event.deltaY * 0.006 * dragSpeed;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    const render = (time: number) => {
      const delta = clamp((time - lastTime) / (1000 / 60), 0.25, 3);
      lastTime = time;
      const focused = camera.focusTarget;

      if (focused) {
        const focusDistance = Math.max(focused.width, focused.height) * 1.2;
        camera.position.x = lerp(camera.position.x, focused.x, 0.08 * delta);
        camera.position.y = lerp(camera.position.y, focused.y, 0.08 * delta);
        camera.position.z = lerp(camera.position.z, focused.z + focusDistance, 0.08 * delta);
        camera.drift.x = lerp(camera.drift.x, 0, 0.15 * delta);
        camera.drift.y = lerp(camera.drift.y, 0, 0.15 * delta);
      } else {
        const driftScale = clamp(camera.position.z / 50, 0.3, 2);
        if (activePointers.size === 0) {
          camera.drift.x = lerp(
            camera.drift.x,
            camera.mouse.x * driftAmount * driftScale,
            0.12 * delta,
          );
          camera.drift.y = lerp(
            camera.drift.y,
            camera.mouse.y * driftAmount * driftScale,
            0.12 * delta,
          );
        }
        if (autoZoom && !isReducedMotion) camera.position.z -= autoZoomSpeed * delta;
        camera.target.x = clamp(camera.target.x, -3.2, 3.2);
        camera.target.y = clamp(camera.target.y, -3.2, 3.2);
        camera.target.z = clamp(camera.target.z, -3.2, 3.2);
        camera.velocity.x = lerp(camera.velocity.x, camera.target.x, 0.16 * delta);
        camera.velocity.y = lerp(camera.velocity.y, camera.target.y, 0.16 * delta);
        camera.velocity.z = lerp(camera.velocity.z, camera.target.z, 0.16 * delta);
        camera.position.x += camera.velocity.x * delta;
        camera.position.y += camera.velocity.y * delta;
        camera.position.z += camera.velocity.z * delta;
        const decay = Math.pow(clamp(friction, 0, 1), delta);
        camera.target.x *= decay;
        camera.target.y *= decay;
        camera.target.z *= decay;
      }

      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, viewportWidth, viewportHeight);

      const cameraX = camera.position.x + camera.drift.x;
      const cameraY = camera.position.y + camera.drift.y;
      const focalLength = viewportHeight / (2 * Math.tan(Math.PI / 6));
      const currentCellX = Math.floor(camera.position.x / cellSize);
      const currentCellY = Math.floor(camera.position.y / cellSize);
      const currentCellZ = Math.floor(camera.position.z / cellSize);
      const compactViewport = viewportWidth < 640;
      const range =
        Math.max(1, Math.round(compactViewport ? Math.min(viewRange, 1) : viewRange)) + 1;
      const visibleDensity = Math.max(
        1,
        Math.round(compactViewport ? Math.min(density, 4) : density),
      );
      const visible: ScreenImage[] = [];
      const readyImageIndexes: number[] = [];
      for (let index = 0; index < loadedImages.length; index++) {
        if (loadedImages[index]?.loaded) readyImageIndexes.push(index);
      }
      const canLockAssignments = readyImageIndexes.length >= Math.min(images.length, 8);

      for (let offsetX = -range; offsetX <= range; offsetX++) {
        for (let offsetY = -range; offsetY <= range; offsetY++) {
          for (let offsetZ = -range; offsetZ <= range; offsetZ++) {
            const cellImages = generateCell(
              currentCellX + offsetX,
              currentCellY + offsetY,
              currentCellZ + offsetZ,
              cellSize,
              visibleDensity,
              imageSize,
              images,
            );

            for (const item of cellImages) {
              const depth = camera.position.z - item.z;
              if (depth <= 1 || depth > fogFar + cellSize) continue;

              const scale = focalLength / depth;
              const screenX = viewportWidth / 2 + (item.x - cameraX) * scale;
              const screenY = viewportHeight / 2 - (item.y - cameraY) * scale;
              const approximateWidth = item.width * scale;
              const approximateHeight = item.height * scale;
              if (
                screenX + approximateWidth / 2 < -40 ||
                screenX - approximateWidth / 2 > viewportWidth + 40 ||
                screenY + approximateHeight / 2 < -40 ||
                screenY - approximateHeight / 2 > viewportHeight + 40
              ) {
                continue;
              }

              requestImage(item.imageIndex, depth < fogNear ? "high" : "auto");
              if (readyImageIndexes.length === 0) continue;

              let displayImageIndex = assignedImages.get(item.key);
              if (displayImageIndex === undefined || !loadedImages[displayImageIndex]?.loaded) {
                displayImageIndex = loadedImages[item.imageIndex]?.loaded
                  ? item.imageIndex
                  : (readyImageIndexes[hashCell(item.key) % readyImageIndexes.length] ?? 0);

                if (canLockAssignments) {
                  assignedImages.set(item.key, displayImageIndex);
                  if (assignedImages.size > 4096) {
                    const oldestKey = assignedImages.keys().next().value;
                    if (oldestKey !== undefined) assignedImages.delete(oldestKey);
                  }
                }
              }

              const loadedImage = loadedImages[displayImageIndex];
              const naturalAspect =
                loadedImage?.loaded && loadedImage.element.naturalHeight > 0
                  ? loadedImage.element.naturalWidth / loadedImage.element.naturalHeight
                  : item.width / item.height;
              const worldWidth = item.size * naturalAspect;
              const screenWidth = worldWidth * scale;
              const screenHeight = item.height * scale;
              if (
                screenX + screenWidth / 2 < -40 ||
                screenX - screenWidth / 2 > viewportWidth + 40 ||
                screenY + screenHeight / 2 < -40 ||
                screenY - screenHeight / 2 > viewportHeight + 40
              ) {
                continue;
              }
              visible.push({
                ...item,
                imageIndex: displayImageIndex,
                width: worldWidth,
                screenX,
                screenY,
                screenWidth,
                screenHeight,
                depth,
                fog: smoothstep(fogNear, fogFar, depth),
              });
            }
          }
        }
      }

      visible.sort((a, b) => b.depth - a.depth);
      const focusKey = focused?.key;
      const ordered = focusKey
        ? [
            ...visible.filter((item) => item.key !== focusKey),
            ...visible.filter((item) => item.key === focusKey),
          ]
        : visible;
      hitTargets = [];

      for (const item of ordered) {
        const source = loadedImages[item.imageIndex];
        if (!source?.loaded) continue;
        const x = item.screenX - item.screenWidth / 2;
        const y = item.screenY - item.screenHeight / 2;
        const radius = Math.max(
          0,
          Math.min(item.screenWidth, item.screenHeight) * imageRadius * 0.5,
        );
        context.save();
        context.beginPath();
        context.roundRect(x, y, item.screenWidth, item.screenHeight, radius);
        context.clip();
        context.globalAlpha = focusKey === item.key ? 1 : 1 - item.fog;
        context.drawImage(source.element, x, y, item.screenWidth, item.screenHeight);
        if (fogColor !== backgroundColor && item.fog > 0) {
          context.globalAlpha = item.fog;
          context.fillStyle = fogColor;
          context.fillRect(x, y, item.screenWidth, item.screenHeight);
        }
        context.restore();
        if (item.fog < 0.88 || focusKey === item.key) hitTargets.push(item);
      }

      frame = requestAnimationFrame(render);
    };

    const onVisibilityChange = () => {
      cancelAnimationFrame(frame);
      if (document.hidden) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(render);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    if (!document.hidden) frame = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resizeObserver.disconnect();
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("wheel", onWheel);
      for (const item of loadedImages) {
        item.element.onload = null;
        item.element.onerror = null;
        item.element.src = "";
      }
    };
  }, [
    allowImageFocusOnClick,
    autoZoom,
    autoZoomSpeed,
    backgroundColor,
    cellSize,
    density,
    dragSpeed,
    driftAmount,
    fogColor,
    fogFar,
    fogNear,
    friction,
    imageRadius,
    imageSize,
    images,
    viewRange,
  ]);

  return (
    <div
      className={cn("relative overflow-hidden touch-none", className)}
      style={{ width: cssSize(width), height: cssSize(height), backgroundColor }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full cursor-grab select-none"
        aria-label="Infinite three-dimensional image gallery. Drag to move, scroll to travel, and click an image to focus."
        role="img"
      />
    </div>
  );
}
