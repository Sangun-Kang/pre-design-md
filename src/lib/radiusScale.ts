import type {
  CssLength,
  RadiusInput,
  RadiusKey,
  RadiusTokens,
} from '../types/design';

const LABELS: Record<number, string> = {
  0: 'sharp',
  2: 'whisper',
  4: 'subtle',
  8: 'soft',
  12: 'rounded',
  16: 'pill-like',
  24: 'capsule',
};

const toRem = (px: number): CssLength => {
  if (px === 0) return '0';
  const rem = Math.round((px / 16) * 10000) / 10000;
  return `${rem}rem`;
};

export function buildRadiusScale(input: RadiusInput): RadiusTokens {
  const { base, scale } = input;

  const tokens: Record<RadiusKey, CssLength> = {
    none: '0',
    sm: toRem(base === 0 ? 0 : base / 2),
    md: toRem(base),
    lg: toRem(base === 0 ? 0 : base * 1.5),
    xl: toRem(base === 0 ? 0 : base * 2),
    full: '9999px',
  };

  const components =
    scale === 'uniform'
      ? {
          input: tokens.md,
          button: tokens.md,
          card: tokens.md,
          badge: tokens.full,
        }
      : {
          input: tokens.sm,
          button: tokens.md,
          card: tokens.lg,
          badge: tokens.full,
        };

  return {
    tokens,
    components,
    meta: { base, scale, label: LABELS[base] ?? 'custom' },
  };
}
