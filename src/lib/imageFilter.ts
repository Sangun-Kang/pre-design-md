export interface PoolImage {
  url: string;
  alt: string;
  dominantHue: number;
}

export function hueDelta(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export function filterImagesByHue(
  primaryHue: number,
  imagePool: PoolImage[],
  maxDelta = 30,
): PoolImage[] {
  return imagePool
    .map((img) => ({ img, d: hueDelta(primaryHue, img.dominantHue) }))
    .filter((x) => x.d <= maxDelta)
    .sort((a, b) => a.d - b.d)
    .map((x) => x.img);
}

export function pickImage(primaryHue: number, imagePool: PoolImage[]): PoolImage | null {
  const filtered = filterImagesByHue(primaryHue, imagePool);
  if (filtered.length > 0) return filtered[0]!;
  if (imagePool.length === 0) return null;
  const sorted = [...imagePool].sort(
    (a, b) => hueDelta(primaryHue, a.dominantHue) - hueDelta(primaryHue, b.dominantHue),
  );
  return sorted[0]!;
}
