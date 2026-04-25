import type { CssShadow, OklchStr, ShadowInput, ShadowTokens } from '../types/design';

interface IntensityPreset {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

const INTENSITY: Record<ShadowInput['intensity'], IntensityPreset> = {
  none: { sm: 0, md: 0, lg: 0, xl: 0 },
  subtle: { sm: 0.06, md: 0.08, lg: 0.1, xl: 0.12 },
  medium: { sm: 0.09, md: 0.13, lg: 0.18, xl: 0.22 },
  strong: { sm: 0.14, md: 0.22, lg: 0.3, xl: 0.4 },
  layered: { sm: 0.1, md: 0.14, lg: 0.2, xl: 0.28 },
};

type LayerKey = keyof ShadowTokens['tokens'];

const GEOMETRY: Record<LayerKey, string[]> = {
  sm: ['0 1px 2px 0'],
  md: ['0 4px 6px -1px', '0 2px 4px -2px'],
  lg: ['0 10px 15px -3px', '0 4px 6px -4px'],
  xl: ['0 20px 25px -5px', '0 8px 10px -6px'],
};

// Layered: 3 stacked layers per level — close-tight + mid + far-blur — so
// the perceived depth comes from layer separation, not raw intensity.
const GEOMETRY_LAYERED: Record<LayerKey, string[]> = {
  sm: ['0 1px 1px 0', '0 1px 2px -0.5px'],
  md: ['0 1px 1px 0', '0 4px 8px -2px', '0 2px 4px -1px'],
  lg: ['0 1px 2px 0', '0 8px 16px -4px', '0 16px 32px -10px'],
  xl: ['0 2px 4px 0', '0 12px 24px -6px', '0 24px 48px -12px'],
};

function tintColor(tinted: boolean, primaryHue: number | undefined): OklchStr {
  if (tinted && primaryHue !== undefined) {
    return `oklch(25% 0.08 ${primaryHue})`;
  }
  return `oklch(0% 0 0)`;
}

function withAlpha(color: OklchStr, alpha: number): OklchStr {
  const inside = color.slice('oklch('.length, -1);
  return `oklch(${inside} / ${alpha})`;
}

function layerToString(intensity: IntensityPreset[LayerKey], geometries: string[], color: OklchStr): CssShadow {
  if (intensity === 0) return 'none';
  const colored = withAlpha(color, intensity);
  return geometries.map((g) => `${g} ${colored}`).join(', ');
}

export function buildShadowTokens(input: ShadowInput): ShadowTokens {
  const { intensity, tintedPreferred, primaryHue } = input;
  const preset = INTENSITY[intensity];
  const color = tintColor(tintedPreferred, primaryHue);
  const geom = intensity === 'layered' ? GEOMETRY_LAYERED : GEOMETRY;

  const tokens: ShadowTokens['tokens'] = {
    sm: layerToString(preset.sm, geom.sm, color),
    md: layerToString(preset.md, geom.md, color),
    lg: layerToString(preset.lg, geom.lg, color),
    xl: layerToString(preset.xl, geom.xl, color),
  };

  return {
    tokens,
    elevation: {
      dropdown: 'sm',
      card: 'md',
      modal: 'lg',
      toast: 'xl',
    },
    meta: {
      intensity,
      tinted: tintedPreferred && primaryHue !== undefined,
      tintColor: color,
    },
  };
}
