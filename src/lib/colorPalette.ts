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

function buildPrimary(hue: number, chroma: ChromaLevel): Scale11 {
  const peak = peakCFor(chroma);
  const scale = {} as Scale11;
  SCALE_STEPS.forEach((step, i) => {
    const l = getL(i);
    const c = peak * getBell(i);
    scale[step] = oklchStr(l, c, hue);
  });
  return scale;
}

function buildNeutral(input: ColorInput): Scale11 {
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
  const { primaryHue, chroma, supportsDark } = input;

  const primary = buildPrimary(primaryHue, chroma);
  const neutral = buildNeutral(input);
  const semantic = buildSemantic(chroma);

  const palette: ColorPalette = {
    primary,
    neutral,
    semantic,
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

  if (supportsDark) {
    palette.dark = {
      primary: buildDarkScale(primary),
      neutral: buildDarkScale(neutral),
      semantic: dimSemantic(semantic),
    };
  }

  return palette;
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
