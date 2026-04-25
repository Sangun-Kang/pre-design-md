import { formatHex } from 'culori';
import type {
  ChromaLevel,
  ColorInput,
  ColorPalette,
  OklchStr,
  Scale11,
  SemanticColors,
  Step11,
} from '../types/design';
import { SCALE_STEPS } from '../types/design';

const L_CURVE: number[] = [0.985, 0.96, 0.9, 0.82, 0.72, 0.62, 0.52, 0.42, 0.32, 0.22, 0.15];

const BELL: number[] = [0.15, 0.3, 0.55, 0.8, 0.95, 1.0, 0.95, 0.8, 0.65, 0.45, 0.35];

const PEAK_C: Record<ChromaLevel, number> = {
  muted: 0.06,
  balanced: 0.14,
  vivid: 0.22,
};

const SEMANTIC_HUES = {
  success: 145,
  warning: 80,
  danger: 25,
  info: 240,
} as const;

const NEUTRAL_TINT_HUE: Record<'warm' | 'cool', number> = {
  warm: 60,
  cool: 240,
};

const round = (n: number, digits: number) => {
  const m = 10 ** digits;
  return Math.round(n * m) / m;
};

function oklchStr(l: number, c: number, h: number): OklchStr {
  const lPct = round(l * 100, 2);
  const cRound = round(c, 4);
  const hRound = round(h, 2);
  if (cRound === 0) {
    return `oklch(${lPct}% 0 0)`;
  }
  return `oklch(${lPct}% ${cRound} ${hRound})`;
}

function peakCFor(chroma: ChromaLevel): number {
  return PEAK_C[chroma];
}

function getL(i: number): number {
  return L_CURVE[i] ?? 0.5;
}

function getBell(i: number): number {
  return BELL[i] ?? 0.5;
}

function buildHueBasedPrimary(hue: number, chroma: ChromaLevel): Scale11 {
  const peak = peakCFor(chroma);
  const scale = {} as Scale11;
  SCALE_STEPS.forEach((step, i) => {
    const l = getL(i);
    const c = peak * getBell(i);
    scale[step] = oklchStr(l, c, hue);
  });
  return scale;
}

function buildHueBasedNeutral(input: ColorInput): Scale11 {
  const { neutralStyle, primaryHue, chroma } = input;
  const scale = {} as Scale11;

  if (neutralStyle === 'pure') {
    SCALE_STEPS.forEach((step, i) => {
      scale[step] = oklchStr(getL(i), 0, 0);
    });
    return scale;
  }

  let hue: number;
  let maxC: number;

  if (neutralStyle === 'tinted') {
    hue = primaryHue;
    const peak = peakCFor(chroma);
    maxC = Math.min(0.018, peak * 0.12);
  } else {
    hue = NEUTRAL_TINT_HUE[neutralStyle];
    maxC = 0.014;
  }

  SCALE_STEPS.forEach((step, i) => {
    const c = maxC * getBell(i);
    scale[step] = oklchStr(getL(i), c, hue);
  });
  return scale;
}

function buildSemantic(chroma: ChromaLevel): SemanticColors {
  const peak = peakCFor(chroma);
  return {
    success: oklchStr(0.6, peak * 0.95, SEMANTIC_HUES.success),
    warning: oklchStr(0.72, peak * 0.95, SEMANTIC_HUES.warning),
    danger: oklchStr(0.6, peak * 0.95, SEMANTIC_HUES.danger),
    info: oklchStr(0.6, peak * 0.95, SEMANTIC_HUES.info),
  };
}

// ──────────── per-category builders ────────────

interface BasePalette {
  primary: Scale11;
  neutral: Scale11;
  semantic: SemanticColors;
}

function pureGrayscale(): Scale11 {
  const scale = {} as Scale11;
  SCALE_STEPS.forEach((step, i) => {
    scale[step] = oklchStr(getL(i), 0, 0);
  });
  return scale;
}

function buildHueBased(input: ColorInput): BasePalette {
  return {
    primary: buildHueBasedPrimary(input.primaryHue, input.chroma),
    neutral: buildHueBasedNeutral(input),
    semantic: buildSemantic(input.chroma),
  };
}

// Mono absorbs the former "off-mono" via warmth: 0 = pure black/white,
// |warmth| > 0 = barely-perceptible warm/cool tint in neutrals.
function buildMono(input: ColorInput): BasePalette {
  const warmth = Math.max(-1, Math.min(1, input.warmth));
  const cFactor = Math.abs(warmth);
  if (cFactor < 0.01) {
    const gray = pureGrayscale();
    const grayCopy = pureGrayscale();
    return { primary: gray, neutral: grayCopy, semantic: buildSemantic('muted') };
  }
  const hue = warmth >= 0 ? 60 : 240;
  const peak = 0.012 * cFactor; // Tiny chroma — feels like tone, not color.

  const scale = {} as Scale11;
  SCALE_STEPS.forEach((step, i) => {
    scale[step] = oklchStr(getL(i), peak * getBell(i), hue);
  });
  const scaleCopy = {} as Scale11;
  SCALE_STEPS.forEach((step, i) => {
    scaleCopy[step] = oklchStr(getL(i), peak * getBell(i), hue);
  });
  return { primary: scale, neutral: scaleCopy, semantic: buildSemantic('muted') };
}

function buildGrayscaleAccent(input: ColorInput): BasePalette {
  return {
    primary: buildHueBasedPrimary(input.accentHue, 'balanced'),
    neutral: pureGrayscale(),
    semantic: buildSemantic('muted'),
  };
}

const NEON_PRIMARY_L: number[] = [0.95, 0.90, 0.85, 0.80, 0.75, 0.70, 0.62, 0.50, 0.38, 0.28, 0.20];

function buildNeonOnDark(input: ColorInput): BasePalette {
  const peak = 0.30;
  const primary = {} as Scale11;
  SCALE_STEPS.forEach((step, i) => {
    const l = NEON_PRIMARY_L[i] ?? 0.5;
    primary[step] = oklchStr(l, peak * getBell(i), input.accentHue);
  });
  // Neutral keeps the standard light→dark scale; applyTokens flips
  // surface/text mapping when category === 'neon-on-dark'.
  return {
    primary,
    neutral: pureGrayscale(),
    semantic: buildSemantic('vivid'),
  };
}

function dispatchCategory(input: ColorInput): BasePalette {
  switch (input.category) {
    case 'mono':
      return buildMono(input);
    case 'grayscale-accent':
      return buildGrayscaleAccent(input);
    case 'neon-on-dark':
      return buildNeonOnDark(input);
    case 'hue-based':
    default:
      return buildHueBased(input);
  }
}

function buildDarkScale(source: Scale11): Scale11 {
  const dark = {} as Scale11;
  const reversed = [...SCALE_STEPS].reverse() as Step11[];
  SCALE_STEPS.forEach((step, i) => {
    const mirrorStep = reversed[i]!;
    dark[step] = source[mirrorStep];
  });
  return dark;
}

function dimSemantic(sem: SemanticColors): SemanticColors {
  const dim = (s: OklchStr): OklchStr => s;
  return {
    success: dim(sem.success),
    warning: dim(sem.warning),
    danger: dim(sem.danger),
    info: dim(sem.info),
  };
}

export function buildColorPalette(input: ColorInput): ColorPalette {
  const base = dispatchCategory(input);

  const palette: ColorPalette = {
    primary: base.primary,
    neutral: base.neutral,
    semantic: base.semantic,
    interactionStates: {
      hover: { lightnessDelta: -0.05 },
      active: { lightnessDelta: -0.1 },
      focus: {
        outline: '2px solid var(--color-primary-500)',
        offset: '2px',
        color: 'var(--color-primary-500)',
      },
      disabled: { opacity: 0.4 },
    },
    meta: input,
  };

  // Neon on dark forces a dark presentation. Light-mode users still get
  // light variants so consumer code that flips by media query keeps working.
  const includeDark = input.supportsDark || input.category === 'neon-on-dark';
  if (includeDark) {
    palette.dark = {
      primary: buildDarkScale(base.primary),
      neutral: buildDarkScale(base.neutral),
      semantic: dimSemantic(base.semantic),
    };
  }

  return palette;
}

/**
 * Convert any culori-parseable color string (oklch, hsl, hex, ...) to sRGB hex.
 * If the OKLCH point is outside the sRGB gamut, culori clips to the nearest
 * representable color. Returns black as a last-resort fallback.
 */
export function oklchStringToHex(input: string): string {
  return formatHex(input) ?? '#000000';
}

/**
 * The hue actually carrying color identity for the chosen category.
 * Returns null when the category is achromatic (mono, or off-mono with warmth ≈ 0)
 * so consumers can skip hue-based effects (e.g. tinted hero backgrounds).
 */
export function effectiveAccentHue(c: ColorInput): number | null {
  switch (c.category) {
    // Mono is fundamentally achromatic — its warmth is meant to be a *barely*
    // perceptible tint in neutrals, not a hero-level accent.
    case 'mono':
      return null;
    case 'grayscale-accent':
    case 'neon-on-dark':
      return c.accentHue;
    case 'hue-based':
    default:
      return c.primaryHue;
  }
}

/** Short, single-line description of the color choice for prose / comments. */
export function categoryShortLabel(c: ColorInput): string {
  switch (c.category) {
    case 'hue-based':
      return `${hueBucketName(c.primaryHue)}-led, ${c.chroma}`;
    case 'mono': {
      if (Math.abs(c.warmth) < 0.1) return 'pure monochrome';
      const tone = c.warmth > 0 ? 'warm tint' : 'cool tint';
      return `monochrome (${tone})`;
    }
    case 'grayscale-accent':
      return `grayscale with ${hueBucketName(c.accentHue)} accent`;
    case 'neon-on-dark':
      return `${hueBucketName(c.accentHue)} neon on dark`;
  }
}

export function hueBucketName(hue: number): string {
  const h = ((hue % 360) + 360) % 360;
  if (h < 20) return 'red';
  if (h < 50) return 'orange';
  if (h < 70) return 'yellow';
  if (h < 160) return 'green';
  if (h < 200) return 'teal';
  if (h < 260) return 'blue';
  if (h < 310) return 'purple';
  return 'magenta';
}
