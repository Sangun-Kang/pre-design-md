import type {
  ColorInput,
  DesignDecisions,
  RadiusInput,
  ShadowInput,
  SpacingInput,
  TypographyInput,
} from '../../types/design';
import { DECISION_STEPS } from '../../types/design';
import { buildTypeScale, getPairing, ratioName } from '../typeScale';
import { buildSpacingScale } from '../spacingScale';
import { buildRadiusScale } from '../radiusScale';
import { buildShadowTokens } from '../shadowTokens';
import { buildColorPalette, hueBucketName, oklchStringToHex } from '../colorPalette';

// ──────────── helpers ────────────

function quote(s: string): string {
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function remToPx(rem: string): string {
  if (rem === '0' || rem === '0rem') return '0';
  if (rem.endsWith('px')) return rem;
  if (rem.endsWith('rem')) {
    const n = parseFloat(rem);
    const px = Math.round(n * 16 * 1000) / 1000;
    return `${px}px`;
  }
  return rem;
}

// Map type-scale keys to semantic typography roles in the Google spec.
const TYPE_ROLE_MAP: Array<{ role: string; scaleKey: string; lineHeight: 'tight' | 'normal' | 'relaxed' }> = [
  { role: 'h1', scaleKey: '4xl', lineHeight: 'tight' },
  { role: 'h2', scaleKey: '3xl', lineHeight: 'tight' },
  { role: 'h3', scaleKey: '2xl', lineHeight: 'tight' },
  { role: 'h4', scaleKey: 'xl', lineHeight: 'tight' },
  { role: 'body', scaleKey: 'base', lineHeight: 'normal' },
  { role: 'caption', scaleKey: 'sm', lineHeight: 'normal' },
];

// ──────────── frontmatter blocks ────────────

function colorsYaml(c: ColorInput): string[] {
  const palette = buildColorPalette(c);
  const lines: string[] = ['colors:'];
  // Single "primary" alias = step 500
  lines.push(`  primary: ${quote(oklchStringToHex(palette.primary['500']))}`);
  for (const step of Object.keys(palette.primary)) {
    lines.push(`  primary-${step}: ${quote(oklchStringToHex(palette.primary[step as keyof typeof palette.primary]))}`);
  }
  for (const step of Object.keys(palette.neutral)) {
    lines.push(`  neutral-${step}: ${quote(oklchStringToHex(palette.neutral[step as keyof typeof palette.neutral]))}`);
  }
  lines.push(`  success: ${quote(oklchStringToHex(palette.semantic.success))}`);
  lines.push(`  warning: ${quote(oklchStringToHex(palette.semantic.warning))}`);
  lines.push(`  danger: ${quote(oklchStringToHex(palette.semantic.danger))}`);
  lines.push(`  info: ${quote(oklchStringToHex(palette.semantic.info))}`);
  return lines;
}

function typographyYaml(t: TypographyInput): string[] {
  const tokens = buildTypeScale(t);
  const pairing = getPairing(t.pairingId);
  const lines: string[] = ['typography:'];
  for (const { role, scaleKey, lineHeight } of TYPE_ROLE_MAP) {
    const size = (tokens.sizes as Record<string, string>)[scaleKey];
    if (!size) continue;
    const family = role.startsWith('h') ? pairing.heading : pairing.body;
    const weight = role.startsWith('h') ? pairing.weights.heading : pairing.weights.body;
    lines.push(
      `  ${role}:`,
      `    fontFamily: ${quote(family)}`,
      `    fontSize: ${size}`,
      `    fontWeight: ${weight}`,
      `    lineHeight: ${tokens.lineHeights[lineHeight]}`,
    );
  }
  return lines;
}

function spacingYaml(s: SpacingInput): string[] {
  const tokens = buildSpacingScale(s);
  const lines: string[] = ['spacing:'];
  for (const k of Object.keys(tokens.tokens)) {
    const val = (tokens.tokens as Record<string, string>)[k]!;
    lines.push(`  ${k}: ${remToPx(val)}`);
  }
  return lines;
}

interface RoundedRef {
  input: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none';
  button: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none';
  card: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none';
  badge: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none';
}

function roundedRefs(scale: RadiusInput['scale']): RoundedRef {
  return scale === 'uniform'
    ? { input: 'md', button: 'md', card: 'md', badge: 'full' }
    : { input: 'sm', button: 'md', card: 'lg', badge: 'full' };
}

function roundedYaml(r: RadiusInput): string[] {
  const tokens = buildRadiusScale(r);
  const lines: string[] = ['rounded:'];
  for (const k of Object.keys(tokens.tokens)) {
    const val = (tokens.tokens as Record<string, string>)[k]!;
    lines.push(`  ${k}: ${remToPx(val)}`);
  }
  return lines;
}

function componentsYaml(r: RadiusInput | null): string[] {
  if (!r) return [];
  const refs = roundedRefs(r.scale);
  return [
    'components:',
    '  button:',
    `    rounded: ${quote(`{rounded.${refs.button}}`)}`,
    '  card:',
    `    rounded: ${quote(`{rounded.${refs.card}}`)}`,
    '  input:',
    `    rounded: ${quote(`{rounded.${refs.input}}`)}`,
    '  badge:',
    `    rounded: ${quote(`{rounded.${refs.badge}}`)}`,
  ];
}

// ──────────── body sections ────────────

function overviewBody(d: DesignDecisions): string {
  const decided = DECISION_STEPS.filter((s) => d[s] != null);
  const intent: string[] = [];
  if (d.color) intent.push(`${hueBucketName(d.color.primaryHue)}-led, ${d.color.chroma}`);
  if (d.typography && d.typography.baseSize >= 18) intent.push('reader-friendly');
  if (d.typography && d.typography.baseSize <= 14) intent.push('compact');
  if (d.shadow?.intensity === 'strong') intent.push('dramatic depth');
  if (d.shadow?.intensity === 'none') intent.push('flat surfaces');
  const intentStr = intent.length > 0 ? intent.join(', ') : 'general-purpose';

  const darkLine = d.color?.supportsDark
    ? 'Dark mode is supported and dark variants of the palette are part of this spec.'
    : 'Dark mode is out of scope for v1; this spec covers the light theme only.';

  return [
    '## Overview',
    '',
    `Brand intent: ${intentStr}.`,
    '',
    `Target context: general — adapt the values verbatim and elaborate on rationale where helpful.`,
    '',
    `Decisions made: ${decided.join(', ') || '(none yet)'}.`,
    '',
    darkLine,
  ].join('\n');
}

function colorsBody(c: ColorInput): string {
  const chromaWord: Record<ColorInput['chroma'], string> = {
    muted: 'calm and professional',
    balanced: 'confident and modern',
    vivid: 'energetic and brand-forward',
  };
  const neutralWord: Record<ColorInput['neutralStyle'], string> = {
    pure: 'objective, neutral grays',
    warm: 'inviting warmth',
    cool: 'clinical, technical cool',
    tinted: 'a cohesive tint binding colors to neutrals',
  };
  return [
    '## Colors',
    '',
    `A ${hueBucketName(c.primaryHue)}-led palette, ${chromaWord[c.chroma]}, paired with ${neutralWord[c.neutralStyle]}. ` +
      `The hex values in the frontmatter are derived from OKLCH source values; if you need the OKLCH form, see the Rich Prompt output.`,
    '',
    '### Interaction states (derived rules)',
    '',
    '- `hover`: lightness −5%',
    '- `active`: lightness −10%',
    '- `focus`: 2px solid `{colors.primary}` with 2px offset',
    '- `disabled`: opacity 40%',
  ].join('\n');
}

function typographyBody(t: TypographyInput): string {
  const pairing = getPairing(t.pairingId);
  const sameFamily = pairing.heading === pairing.body;
  const pairingNote = sameFamily
    ? `Single-family system (${pairing.name}) — heading and body share the typeface for unity.`
    : `${pairing.name} — heading and body use distinct families for hierarchy.`;
  return [
    '## Typography',
    '',
    `Base font size: ${t.baseSize}px. Modular scale ratio: ${t.ratio} (${ratioName(t.ratio)}).`,
    '',
    pairingNote,
    '',
    `${pairing.description}`,
  ].join('\n');
}

function spacingBody(s: SpacingInput): string {
  const key = `${s.baseUnit}-${s.scale}`;
  const table: Record<string, string> = {
    '4-linear': 'Tight, precise grid — data-dense surfaces with consistent rhythm.',
    '4-multiplicative': 'Tight at base but dramatic jumps — playful with clear hierarchy.',
    '6-linear': 'Half-step grid — uncommon grain, fits editorial apps.',
    '8-linear': 'Balanced, familiar web rhythm — wide compatibility and predictable density.',
    '8-multiplicative': 'Generous and bold — marketing-friendly breathing room.',
    '10-linear': 'Airy and confident — marketing-heavy product surfaces.',
  };
  return [
    '## Spacing',
    '',
    `Base unit: ${s.baseUnit}px. Scale approach: ${s.scale}.`,
    '',
    table[key] ?? 'Balanced spacing rhythm.',
  ].join('\n');
}

function roundedBody(r: RadiusInput): string {
  const core: Record<number, string> = {
    0: 'hard-edged, technical',
    2: 'barely-there softening',
    4: 'softened but sober',
    8: 'friendly and modern',
    12: 'approachable, app-like',
    16: 'playful, pill-adjacent',
    24: 'bold, almost-pill',
  };
  const refs = roundedRefs(r.scale);
  return [
    '## Rounded',
    '',
    `Base radius: ${r.base}px (${core[r.base] ?? 'balanced shape'}). Scale approach: ${r.scale}.`,
    '',
    r.scale === 'scaled'
      ? 'Per-component variation reinforces shape roles — inputs crisper, cards softer.'
      : 'A single, uniform radius across components — one shape identity for the whole system.',
    '',
    'Per-component intent (resolved in the components block):',
    `- input: \`{rounded.${refs.input}}\``,
    `- button: \`{rounded.${refs.button}}\``,
    `- card: \`{rounded.${refs.card}}\``,
    `- badge: \`{rounded.${refs.badge}}\``,
  ].join('\n');
}

function componentsBody(): string {
  return [
    '## Components',
    '',
    'Component-level shape choices are resolved via token references in the `components` block of the frontmatter. Future component additions should follow the same pattern: declare the role (button, card, input, …) and reference a `rounded` token rather than hard-coding a px value.',
  ].join('\n');
}

function shadowBody(s: ShadowInput): string {
  const tokens = buildShadowTokens(s);
  const tokenBlock = (Object.keys(tokens.tokens) as Array<keyof typeof tokens.tokens>)
    .map((k) => `--shadow-${k}: ${tokens.tokens[k]};`)
    .join('\n');
  const tintLine = tokens.meta.tinted
    ? `Tinted by the primary hue (\`${tokens.meta.tintColor}\`) for cohesion.`
    : 'Neutral black, no tinting.';
  return [
    '## Shadow',
    '',
    `Shadow is not in the official YAML schema at alpha. Tokens are emitted as CSS variables for direct consumption:`,
    '',
    '```css',
    tokenBlock,
    '```',
    '',
    `Intensity: ${s.intensity}. ${tintLine}`,
    '',
    'Elevation hierarchy: `dropdown` (sm) < `card` (md) < `modal` (lg) < `toast` (xl).',
  ].join('\n');
}

const USAGE_BODY = `## Usage guidelines

- Primary actions use the \`primary\` color; on hover shift to \`primary-600\`, on active to \`primary-700\`.
- Cards take the \`card\` rounded role and a medium shadow.
- Buttons take the \`button\` rounded role and a small shadow on the primary variant.
- Inputs take the \`input\` rounded role; focus ring follows the interaction-states spec.
- Body text uses the \`body\` typography role.
- Section spacing: use the \`3xl\` spacing token between major blocks.
- Stack spacing within a block: use the \`md\` spacing token.`;

const AI_INSTRUCTIONS = `## Generation instructions for AI

1. Treat the listed values as authoritative; do not re-derive from preference.
2. When a component needs a value not listed here, pick the nearest available token.
3. If a new decision is required, document it in an appended section and flag it clearly.
4. Preserve the rationale comments — they encode design intent.
5. Interaction states are derived rules, not hard-coded values — apply them procedurally.`;

// ──────────── top-level ────────────

export function buildGoogleSpec(d: DesignDecisions): string {
  const missing = DECISION_STEPS.filter((s) => d[s] == null);
  const lines: string[] = [];

  // Frontmatter
  lines.push('---');
  lines.push('name: pre-design-md output');
  lines.push('description: Generated by pre-design-md');
  if (d.color) lines.push(...colorsYaml(d.color));
  if (d.typography) lines.push(...typographyYaml(d.typography));
  if (d.spacing) lines.push(...spacingYaml(d.spacing));
  if (d.radius) lines.push(...roundedYaml(d.radius));
  if (d.radius) lines.push(...componentsYaml(d.radius));
  lines.push('---', '');

  if (missing.length > 0) {
    lines.push(
      `> [!WARNING] Incomplete design — undecided steps (${missing.join(', ')}) are omitted. Re-run after completing them.`,
      '',
    );
  }

  lines.push(overviewBody(d), '');
  if (d.color) lines.push(colorsBody(d.color), '');
  if (d.typography) lines.push(typographyBody(d.typography), '');
  if (d.spacing) lines.push(spacingBody(d.spacing), '');
  if (d.radius) lines.push(roundedBody(d.radius), '');
  if (d.radius) lines.push(componentsBody(), '');
  if (d.shadow) {
    const withHue: ShadowInput = {
      ...d.shadow,
      primaryHue: d.shadow.primaryHue ?? d.color?.primaryHue,
    };
    lines.push(shadowBody(withHue), '');
  }
  lines.push(USAGE_BODY, '');
  lines.push(AI_INSTRUCTIONS);

  return lines.join('\n');
}
