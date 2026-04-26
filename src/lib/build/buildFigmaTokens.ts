import { converter, formatHex, formatHex8, parse } from 'culori';
import type {
  ColorPalette,
  DesignDecisions,
  Scale11,
  ShadowInput,
  Step11,
} from '../../types/design';
import { SCALE_STEPS } from '../../types/design';
import { buildTypeScale, getPairing } from '../typeScale';
import { buildSpacingScale } from '../spacingScale';
import { buildRadiusScale } from '../radiusScale';
import { buildShadowTokens } from '../shadowTokens';
import { buildColorPalette } from '../colorPalette';

// Tokens Studio / W3C Design Tokens — single "global" set for v1.
// Loadable via the Tokens Studio Figma plugin (File → Tools → Load).
// Native Figma "Import variables" reads color/dimension/borderRadius cleanly;
// shadow + composite typography require the plugin.

interface TokenColor {
  $type: 'color';
  $value: string;
  $description?: string;
}
interface TokenDim {
  $type: 'dimension';
  $value: string;
}
interface TokenRadius {
  $type: 'borderRadius';
  $value: string;
}
interface TokenFontFamily {
  $type: 'fontFamilies';
  $value: string;
}
interface TokenFontSize {
  $type: 'fontSizes';
  $value: string;
}
interface TokenLineHeight {
  $type: 'lineHeights';
  $value: string;
}
interface TokenFontWeight {
  $type: 'fontWeights';
  $value: number;
}
interface ShadowLayer {
  x: string;
  y: string;
  blur: string;
  spread: string;
  color: string;
  type: 'dropShadow';
}
interface TokenShadow {
  $type: 'boxShadow';
  $value: ShadowLayer | ShadowLayer[];
}
interface TokenTypography {
  $type: 'typography';
  $value: {
    fontFamily: string;
    fontWeight: number;
    fontSize: string;
    lineHeight: string;
  };
}

type TokenNode =
  | TokenColor
  | TokenDim
  | TokenRadius
  | TokenFontFamily
  | TokenFontSize
  | TokenLineHeight
  | TokenFontWeight
  | TokenShadow
  | TokenTypography
  | { [key: string]: TokenNode };

const toOklch = converter('oklch');

function colorToHex(input: string): string {
  const parsed = parse(input);
  if (!parsed) return '#000000';
  if (parsed.alpha !== undefined && parsed.alpha < 1) {
    return formatHex8(parsed) ?? '#000000';
  }
  return formatHex(parsed) ?? '#000000';
}

function shiftLightness(oklchStr: string, delta: number): string {
  const c = toOklch(oklchStr);
  if (!c) return colorToHex(oklchStr);
  const next = { ...c, l: Math.max(0, Math.min(1, (c.l ?? 0) + delta)) };
  return formatHex(next) ?? '#000000';
}

function remToPx(value: string): string {
  if (value === '0') return '0px';
  if (value.endsWith('px')) return value;
  if (value.endsWith('rem')) {
    const n = parseFloat(value);
    if (!Number.isFinite(n)) return value;
    return `${Math.round(n * 16 * 100) / 100}px`;
  }
  return value;
}

// "0.25rem 0 0.25rem 0" → "4px 0px 4px 0px" (asymmetric radius four-corner form).
function lengthListToPx(value: string): string {
  if (!value.includes(' ')) return remToPx(value);
  return value.split(' ').filter(Boolean).map(remToPx).join(' ');
}

function firstFontFamily(stack: string): string {
  const m = stack.match(/^\s*['"]?([^'",]+)['"]?/);
  return m?.[1]?.trim() ?? stack;
}

function parseShadowLayer(layer: string): ShadowLayer | null {
  // "0 1px 2px 0 oklch(0% 0 0 / 0.06)"
  const m = layer.trim().match(/^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)$/);
  if (!m) return null;
  const [, x, y, blur, spread, color] = m;
  return {
    x: x ?? '0',
    y: y ?? '0',
    blur: blur ?? '0',
    spread: spread ?? '0',
    color: colorToHex(color ?? '#000'),
    type: 'dropShadow',
  };
}

function parseShadowCss(css: string): ShadowLayer | ShadowLayer[] | null {
  if (!css || css === 'none') return null;
  // The CSS oklch() function never contains ", " between args, so this split is safe.
  const layers = css
    .split(/,\s+/)
    .map(parseShadowLayer)
    .filter((l): l is ShadowLayer => l != null);
  if (layers.length === 0) return null;
  return layers.length === 1 ? layers[0]! : layers;
}

function scaleToHexTokens(scale: Scale11): Record<Step11, TokenColor> {
  const out = {} as Record<Step11, TokenColor>;
  for (const step of SCALE_STEPS) {
    out[step] = { $type: 'color', $value: colorToHex(scale[step]) };
  }
  return out;
}

function scaleToShiftedHex(scale: Scale11, delta: number): Record<Step11, TokenColor> {
  const out = {} as Record<Step11, TokenColor>;
  for (const step of SCALE_STEPS) {
    out[step] = { $type: 'color', $value: shiftLightness(scale[step], delta) };
  }
  return out;
}

function colorSection(palette: ColorPalette) {
  const section: Record<string, TokenNode> = {
    primary: scaleToHexTokens(palette.primary),
    'primary-hover': scaleToShiftedHex(
      palette.primary,
      palette.interactionStates.hover.lightnessDelta,
    ),
    'primary-active': scaleToShiftedHex(
      palette.primary,
      palette.interactionStates.active.lightnessDelta,
    ),
    neutral: scaleToHexTokens(palette.neutral),
    semantic: {
      success: { $type: 'color', $value: colorToHex(palette.semantic.success) },
      warning: { $type: 'color', $value: colorToHex(palette.semantic.warning) },
      danger: { $type: 'color', $value: colorToHex(palette.semantic.danger) },
      info: { $type: 'color', $value: colorToHex(palette.semantic.info) },
    },
  };
  return section;
}

function darkColorSection(palette: ColorPalette): Record<string, TokenNode> | null {
  if (!palette.dark) return null;
  const semantic: Record<string, TokenColor> = {
    success: { $type: 'color', $value: colorToHex(palette.dark.semantic.success) },
    warning: { $type: 'color', $value: colorToHex(palette.dark.semantic.warning) },
    danger: { $type: 'color', $value: colorToHex(palette.dark.semantic.danger) },
    info: { $type: 'color', $value: colorToHex(palette.dark.semantic.info) },
  };
  return {
    primary: scaleToHexTokens(palette.dark.primary),
    neutral: scaleToHexTokens(palette.dark.neutral),
    semantic,
  };
}

export function buildFigmaTokens(d: DesignDecisions): string {
  const global: Record<string, TokenNode> = {};

  if (d.color) {
    const palette = buildColorPalette(d.color);
    global.color = colorSection(palette);
    const dark = darkColorSection(palette);
    if (dark) global['color-dark'] = dark;
  }

  if (d.spacing) {
    const spacing = buildSpacingScale(d.spacing);
    const out: Record<string, TokenDim> = {};
    for (const [k, v] of Object.entries(spacing.tokens)) {
      out[k] = { $type: 'dimension', $value: remToPx(v) };
    }
    global.spacing = out;
  }

  if (d.radius) {
    const radius = buildRadiusScale(d.radius);
    const out: Record<string, TokenRadius> = {};
    for (const [k, v] of Object.entries(radius.tokens)) {
      out[k] = { $type: 'borderRadius', $value: lengthListToPx(v) };
    }
    out.button = { $type: 'borderRadius', $value: lengthListToPx(radius.components.button) };
    out.card = { $type: 'borderRadius', $value: lengthListToPx(radius.components.card) };
    out.input = { $type: 'borderRadius', $value: lengthListToPx(radius.components.input) };
    out.badge = { $type: 'borderRadius', $value: lengthListToPx(radius.components.badge) };
    global.radius = out;
  }

  if (d.shadow) {
    const shadowInput: ShadowInput = {
      ...d.shadow,
      primaryHue: d.shadow.primaryHue ?? d.color?.primaryHue,
    };
    const shadow = buildShadowTokens(shadowInput);
    const out: Record<string, TokenShadow> = {};
    for (const [k, v] of Object.entries(shadow.tokens)) {
      const parsed = parseShadowCss(v);
      if (parsed) out[k] = { $type: 'boxShadow', $value: parsed };
    }
    if (Object.keys(out).length > 0) global.shadow = out;
  }

  if (d.typography) {
    const t = buildTypeScale(d.typography);
    const pairing = getPairing(d.typography.pairingId);
    const headingFont = firstFontFamily(pairing.heading);
    const bodyFont = firstFontFamily(pairing.body);

    const fontFamily: Record<string, TokenFontFamily> = {
      heading: { $type: 'fontFamilies', $value: headingFont },
      body: { $type: 'fontFamilies', $value: bodyFont },
    };
    if (pairing.mono) {
      fontFamily.mono = { $type: 'fontFamilies', $value: firstFontFamily(pairing.mono) };
    }
    global.fontFamily = fontFamily;

    const fontSize: Record<string, TokenFontSize> = {};
    for (const [k, v] of Object.entries(t.sizes)) {
      fontSize[k] = { $type: 'fontSizes', $value: remToPx(v) };
    }
    global.fontSize = fontSize;

    global.lineHeight = {
      tight: { $type: 'lineHeights', $value: String(t.lineHeights.tight) },
      normal: { $type: 'lineHeights', $value: String(t.lineHeights.normal) },
      relaxed: { $type: 'lineHeights', $value: String(t.lineHeights.relaxed) },
    };

    global.fontWeight = {
      body: { $type: 'fontWeights', $value: t.weights.body },
      bodyStrong: { $type: 'fontWeights', $value: t.weights.bodyStrong },
      heading: { $type: 'fontWeights', $value: t.weights.heading },
    };

    const composite = (
      size: string,
      weight: number,
      lh: number,
      family: string,
    ): TokenTypography => ({
      $type: 'typography',
      $value: {
        fontFamily: family,
        fontWeight: weight,
        fontSize: remToPx(size),
        lineHeight: String(lh),
      },
    });

    global.typography = {
      h1: composite(t.sizes['4xl'], t.weights.heading, t.lineHeights.tight, headingFont),
      h2: composite(t.sizes['3xl'], t.weights.heading, t.lineHeights.tight, headingFont),
      h3: composite(t.sizes['2xl'], t.weights.heading, t.lineHeights.tight, headingFont),
      h4: composite(t.sizes.xl, t.weights.heading, t.lineHeights.tight, headingFont),
      body: composite(t.sizes.base, t.weights.body, t.lineHeights.normal, bodyFont),
      caption: composite(t.sizes.sm, t.weights.body, t.lineHeights.normal, bodyFont),
    };
  }

  return JSON.stringify({ global }, null, 2);
}
