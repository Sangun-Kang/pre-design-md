import type { PoolImage } from '../../lib/imageFilter';

function gradientDataUrl(hueA: number, hueB: number): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800' preserveAspectRatio='none'>
  <defs>
    <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='oklch(72% 0.18 ${hueA})' />
      <stop offset='100%' stop-color='oklch(38% 0.22 ${hueB})' />
    </linearGradient>
    <radialGradient id='spot' cx='30%' cy='30%' r='50%'>
      <stop offset='0%' stop-color='oklch(92% 0.12 ${hueA} / 0.55)' />
      <stop offset='100%' stop-color='oklch(60% 0.18 ${hueA} / 0)' />
    </radialGradient>
  </defs>
  <rect width='100%' height='100%' fill='url(#g)' />
  <rect width='100%' height='100%' fill='url(#spot)' />
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function make(hueA: number, hueB: number, alt: string): PoolImage {
  return {
    url: gradientDataUrl(hueA, hueB),
    alt,
    dominantHue: hueA,
  };
}

export const IMAGE_POOL: PoolImage[] = [
  make(15, 30, 'warm red flow'),
  make(45, 30, 'amber glow'),
  make(85, 70, 'citrus wash'),
  make(135, 115, 'moss gradient'),
  make(165, 180, 'mint spread'),
  make(200, 220, 'azure pool'),
  make(235, 250, 'classic blue drift'),
  make(270, 255, 'violet haze'),
  make(305, 320, 'berry mist'),
  make(345, 355, 'rose bloom'),
];
