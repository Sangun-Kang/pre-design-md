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
import { buildColorPalette, categoryShortLabel, hueBucketName } from '../colorPalette';

// ──────────── Rationale tables ────────────

function rationaleTypography(t: TypographyInput): string {
  const ratioBucket: 'small' | 'mid' | 'large' =
    t.ratio <= 1.2 ? 'small' : t.ratio >= 1.333 ? 'large' : 'mid';
  const table: Record<number, Record<'small' | 'mid' | 'large', string>> = {
    14: {
      small: 'compact, dense, utilitarian — good for dashboards and tooling',
      mid: 'compact body with clear hierarchy — internal tools that still want some reading comfort',
      large: 'compact body but dramatic headings — editorial dashboards',
    },
    16: {
      small: 'classic, balanced — general product UI',
      mid: 'standard-modern — most web products',
      large: 'confident hierarchy — marketing and product mix',
    },
    18: {
      small: 'roomy, accessible — content-heavy apps',
      mid: 'editorial leaning — blogs and docs',
      large: 'generous, editorial — long-form reading',
    },
    20: {
      small: 'large default, accessibility-first',
      mid: 'magazine-like — reader apps',
      large: 'hero-first, decorative — landing pages',
    },
  };
  const row = table[t.baseSize];
  return row ? row[ratioBucket] : 'balanced typography';
}

function rationaleSpacing(s: SpacingInput): string {
  const key = `${s.baseUnit}-${s.scale}` as const;
  const table: Record<string, string> = {
    '4-linear': 'Tight, precise grid — data-dense surfaces with consistent rhythm.',
    '4-multiplicative': 'Tight at base but dramatic jumps — playful with clear hierarchy.',
    '6-linear': 'Half-step grid — uncommon grain, fits editorial apps.',
    '8-linear': 'Balanced, familiar web rhythm — wide compatibility and predictable density.',
    '8-multiplicative': 'Generous and bold — marketing-friendly breathing room.',
    '10-linear': 'Airy and confident — marketing-heavy product surfaces.',
  };
  return table[key] ?? 'Balanced spacing rhythm.';
}

function rationaleRadius(r: RadiusInput): string {
  const core: Record<number, string> = {
    0: 'hard-edged, technical',
    2: 'barely-there softening',
    4: 'softened but sober',
    8: 'friendly and modern',
    12: 'approachable, app-like',
    16: 'playful, pill-adjacent',
    24: 'bold, almost-pill',
  };
  const base = core[r.base] ?? 'balanced shape';
  const suffix =
    r.scale === 'asymmetric'
      ? ' — diagonal asymmetry (top-left and bottom-right only) for a deliberately off-balance, expressive moment'
      : r.scale === 'scaled'
        ? ' — per-component variation that reinforces shape roles (inputs crisper, cards softer)'
        : ' — uniform radius across components, a single shape identity';
  return `${base}${suffix}.`;
}

function rationaleShadow(s: ShadowInput): string {
  const core: Record<ShadowInput['intensity'], string> = {
    none: 'flat, UI-chrome-light',
    subtle: 'quiet hierarchy without depth theater',
    medium: 'clear elevation, material-adjacent',
    strong: 'dramatic, marketing-ready depth',
    layered: 'stacked-layer depth — close + mid + far blur composed for a Material-like elevation read',
  };
  const base = core[s.intensity];
  const suffix = s.tintedPreferred ? ', with shadows tinted by the primary hue for cohesion' : '';
  return `${base}${suffix}.`;
}

function darkModeNote(c: ColorInput): string {
  if (c.category === 'neon-on-dark') return ' Always presented in dark mode.';
  return c.supportsDark ? ' Dark mode is supported.' : ' Light mode only for v1.';
}

function rationaleColor(c: ColorInput): string {
  switch (c.category) {
    case 'hue-based': {
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
      return `A ${hueBucketName(c.primaryHue)}-led palette, ${chromaWord[c.chroma]}, paired with ${neutralWord[c.neutralStyle]}.${darkModeNote(c)}`;
    }
    case 'mono': {
      if (Math.abs(c.warmth) < 0.1) {
        return `A pure black-and-white system — no chroma in primary or neutrals. Hierarchy comes from lightness alone, semantic colors stay muted to keep the monochrome identity.${darkModeNote(c)}`;
      }
      const direction =
        c.warmth > 0 ? 'warm (toward sepia, ~60°)' : 'cool (toward blue-gray, ~240°)';
      return `Monochrome with a barely-perceptible ${direction} tint (warmth ${c.warmth.toFixed(2)}). Easier on the eyes than absolute mono while keeping the no-color identity.${darkModeNote(c)}`;
    }
    case 'grayscale-accent':
      return `Grayscale interface with one ${hueBucketName(c.accentHue)} accent. The neutrals carry the structure; the accent earns attention by being the only colorful element.${darkModeNote(c)}`;
    case 'neon-on-dark':
      return `Dark canvas with luminous ${hueBucketName(c.accentHue)} accent — energy, contrast, focus. The accent is engineered to glow against very dark neutrals.${darkModeNote(c)}`;
  }
}

// ──────────── Sub-section builders ────────────

function typographySection(t: TypographyInput): string {
  const tokens = buildTypeScale(t);
  const pairing = getPairing(t.pairingId);
  const sizeBlock = (Object.keys(tokens.sizes) as Array<keyof typeof tokens.sizes>)
    .map((k) => `--font-size-${k}: ${tokens.sizes[k]};`)
    .join('\n');

  // Bug 2 fix: only mention "Combined with X" when heading and body fonts truly differ.
  const sameFamily = pairing.heading === pairing.body;
  const pairingNote = sameFamily
    ? `single-family system (${pairing.name}) — heading and body share the typeface for unity`
    : `pairs ${pairing.name.toLowerCase()} — heading and body use different families for hierarchy`;

  return [
    '## Typography',
    `- Base font size: ${t.baseSize}px`,
    `- Modular scale ratio: ${t.ratio} (${ratioName(t.ratio)})`,
    `- Font pairing: ${pairing.name} — ${pairing.description}`,
    `- Pairing structure: ${pairingNote}`,
    `- Rationale: ${rationaleTypography(t)}`,
    '',
    '### Type scale',
    '```css',
    sizeBlock,
    '```',
    '',
    '### Line heights',
    '```css',
    `--line-height-tight: ${tokens.lineHeights.tight};`,
    `--line-height-normal: ${tokens.lineHeights.normal};`,
    `--line-height-relaxed: ${tokens.lineHeights.relaxed};`,
    '```',
    '',
    '### Font families',
    '```css',
    `--font-family-heading: ${tokens.families.heading};`,
    `--font-family-body: ${tokens.families.body};`,
    ...(tokens.families.mono ? [`--font-family-mono: ${tokens.families.mono};`] : []),
    '```',
    '',
    '### Font weights',
    '```css',
    `--font-weight-body: ${tokens.weights.body};`,
    `--font-weight-body-strong: ${tokens.weights.bodyStrong};`,
    `--font-weight-heading: ${tokens.weights.heading};`,
    '```',
  ].join('\n');
}

function spacingSection(s: SpacingInput): string {
  const tokens = buildSpacingScale(s);
  const block = (Object.keys(tokens.tokens) as Array<keyof typeof tokens.tokens>)
    .map((k) => `--space-${k}: ${tokens.tokens[k]};`)
    .join('\n');
  return [
    '## Spacing',
    `- Base unit: ${s.baseUnit}px`,
    `- Scale approach: ${s.scale}`,
    `- Rationale: ${rationaleSpacing(s)}`,
    '',
    '### Spacing scale',
    '```css',
    block,
    '```',
    '',
    '### Component defaults',
    '```css',
    `--space-button-padding-x: ${tokens.components.buttonPaddingX};`,
    `--space-button-padding-y: ${tokens.components.buttonPaddingY};`,
    `--space-card-padding: ${tokens.components.cardPadding};`,
    `--space-input-padding-x: ${tokens.components.inputPaddingX};`,
    `--space-input-padding-y: ${tokens.components.inputPaddingY};`,
    `--space-section-gap: ${tokens.components.sectionGap};`,
    `--space-stack-gap: ${tokens.components.stackGap};`,
    '```',
  ].join('\n');
}

function radiusSection(r: RadiusInput): string {
  const tokens = buildRadiusScale(r);
  const tokenBlock = (Object.keys(tokens.tokens) as Array<keyof typeof tokens.tokens>)
    .map((k) => `--radius-${k}: ${tokens.tokens[k]};`)
    .join('\n');
  // Bug 3 fix: emit per-component radius CSS variables so the Usage prose
  // references (var(--radius-card), var(--radius-button), ...) actually resolve.
  const componentBlock = [
    `--radius-input: ${tokens.components.input};`,
    `--radius-button: ${tokens.components.button};`,
    `--radius-card: ${tokens.components.card};`,
    `--radius-badge: ${tokens.components.badge};`,
  ].join('\n');
  return [
    '## Radius',
    `- Base radius: ${r.base}px (${tokens.meta.label})`,
    `- Scale approach: ${r.scale}`,
    `- Rationale: ${rationaleRadius(r)}`,
    '',
    '### Radius scale',
    '```css',
    tokenBlock,
    '```',
    '',
    '### Per-component variables',
    '```css',
    componentBlock,
    '```',
  ].join('\n');
}

function shadowSection(s: ShadowInput): string {
  const tokens = buildShadowTokens(s);
  const tokenBlock = (Object.keys(tokens.tokens) as Array<keyof typeof tokens.tokens>)
    .map((k) => `--shadow-${k}: ${tokens.tokens[k]};`)
    .join('\n');
  return [
    '## Shadow / Elevation',
    `- Intensity: ${s.intensity}`,
    `- Tinted: ${tokens.meta.tinted ? `yes — tint color \`${tokens.meta.tintColor}\`` : 'no (neutral black)'}`,
    `- Rationale: ${rationaleShadow(s)}`,
    '',
    '### Shadow scale',
    '```css',
    tokenBlock,
    '```',
    '',
    '### Elevation hierarchy',
    `\`dropdown\` (${tokens.elevation.dropdown}) < \`card\` (${tokens.elevation.card}) < \`modal\` (${tokens.elevation.modal}) < \`toast\` (${tokens.elevation.toast})`,
  ].join('\n');
}

function scaleBlock(prefix: string, scale: Record<string, string>): string {
  return Object.keys(scale)
    .map((step) => `--color-${prefix}-${step}: ${scale[step]};`)
    .join('\n');
}

function colorMetaLines(c: ColorInput): string[] {
  const lines: string[] = [`- Approach: ${categoryShortLabel(c)}`];
  switch (c.category) {
    case 'hue-based':
      lines.push(
        `- Primary hue: ${Math.round(c.primaryHue)}° (${hueBucketName(c.primaryHue)})`,
        `- Chroma level: ${c.chroma}`,
        `- Neutral style: ${c.neutralStyle}`,
      );
      break;
    case 'mono':
      if (Math.abs(c.warmth) >= 0.1) {
        lines.push(`- Warmth: ${c.warmth.toFixed(2)} (negative = cool, positive = warm)`);
      }
      break;
    case 'grayscale-accent':
    case 'neon-on-dark':
      lines.push(`- Accent hue: ${Math.round(c.accentHue)}° (${hueBucketName(c.accentHue)})`);
      break;
  }
  const darkLine =
    c.category === 'neon-on-dark'
      ? '- Dark mode: forced (always on)'
      : `- Dark mode: ${c.supportsDark ? 'supported' : 'not supported'}`;
  lines.push(darkLine);
  return lines;
}

function colorSection(c: ColorInput): string {
  const palette = buildColorPalette(c);
  const lines: string[] = [
    '## Color',
    ...colorMetaLines(c),
    `- Rationale: ${rationaleColor(c)}`,
    '',
    '### Primary palette',
    '```css',
    scaleBlock('primary', palette.primary),
    '```',
    '',
    '### Neutral palette',
    '```css',
    scaleBlock('neutral', palette.neutral),
    '```',
    '',
    '### Semantic colors',
    '```css',
    `--color-success-500: ${palette.semantic.success};`,
    `--color-warning-500: ${palette.semantic.warning};`,
    `--color-danger-500:  ${palette.semantic.danger};`,
    `--color-info-500:    ${palette.semantic.info};`,
    '```',
    '',
    '### Interaction states (derived)',
    `- \`hover\`: lightness ${palette.interactionStates.hover.lightnessDelta * 100}%`,
    `- \`active\`: lightness ${palette.interactionStates.active.lightnessDelta * 100}%`,
    `- \`focus\`: \`${palette.interactionStates.focus.outline}\` with offset \`${palette.interactionStates.focus.offset}\``,
    `- \`disabled\`: opacity ${palette.interactionStates.disabled.opacity * 100}%`,
  ];

  if (palette.dark) {
    lines.push(
      '',
      '### Dark variants',
      '```css',
      scaleBlock('primary-dark', palette.dark.primary),
      '```',
      '',
      '```css',
      scaleBlock('neutral-dark', palette.dark.neutral),
      '```',
    );
  }

  return lines.join('\n');
}

// ──────────── Static blocks ────────────

const USAGE_GUIDELINES = `## Usage guidelines

- Primary actions: \`var(--color-primary-500)\`; on hover \`var(--color-primary-600)\`; on active \`var(--color-primary-700)\`
- Cards: \`var(--radius-card)\` with \`var(--shadow-md)\`
- Buttons: \`var(--radius-button)\` with \`var(--shadow-sm)\` on the primary variant
- Inputs: \`var(--radius-input)\`; focus ring uses the interaction-states spec
- Body text: \`var(--font-size-base)\` with \`var(--line-height-normal)\`
- Section spacing: \`var(--space-3xl)\` between major blocks
- Stack spacing within a block: \`var(--space-md)\``;

// Bug 1 fix: dark-mode line is no longer a placeholder; it's resolved from
// the actual decision and produces a real sentence (or is omitted).
function notSection(d: DesignDecisions): string {
  const supportsDark = d.color?.supportsDark ?? false;
  const darkLine = supportsDark
    ? '- Dark mode tokens: included — see the "Dark variants" block in the Color section.'
    : '- Dark mode tokens: out of scope for v1 — light mode only.';
  return [
    '## What this design system is NOT',
    '',
    '- Not a component library specification — tokens only',
    '- Not opinionated about responsive breakpoints',
    '- Extend these tokens via prefixed custom properties (`--color-brand-*`), do not replace',
    darkLine,
  ].join('\n');
}

const AI_INSTRUCTIONS = `## Generation instructions for AI

When using this DESIGN.md:
1. Treat the listed values as authoritative; do not re-derive from preference.
2. When a component needs a value not listed here, pick the nearest available token.
3. If a new decision is required, document it in an appended section and flag it clearly.
4. Preserve the rationale comments — they encode design intent and should guide new decisions in unlisted contexts.
5. Interaction states are derived rules, not hard-coded values — apply them procedurally.`;

const INTRO = `# Design System Source of Truth

You are generating a DESIGN.md for a frontend project.
The following decisions represent the design intent and MUST be preserved in the generated DESIGN.md. Use the values verbatim; elaborate on rationale in your own words where helpful.`;

// ──────────── Top-level ────────────

function missingDecisions(d: DesignDecisions): string[] {
  return DECISION_STEPS.filter((step) => d[step] == null);
}

function overallIntent(d: DesignDecisions): string {
  const parts: string[] = [];
  if (d.color) {
    parts.push(categoryShortLabel(d.color));
  }
  if (d.typography) {
    if (d.typography.baseSize >= 18) parts.push('reader-friendly');
    else if (d.typography.baseSize <= 14) parts.push('compact');
  }
  if (d.shadow) {
    if (d.shadow.intensity === 'strong') parts.push('dramatic depth');
    else if (d.shadow.intensity === 'none') parts.push('flat surfaces');
  }
  return parts.length > 0 ? parts.join(', ') : 'to be determined';
}

export function buildRichPrompt(d: DesignDecisions): string {
  const missing = missingDecisions(d);
  const sections: string[] = [INTRO, ''];

  if (missing.length > 0) {
    sections.push(
      `> [!WARNING] Incomplete design — the following steps are undecided and their sections are omitted below: ${missing.join(', ')}.`,
      '> Re-run after completing them for a full DESIGN.md.',
      '',
    );
  }

  sections.push(
    '## Intent',
    `- Overall feeling: ${overallIntent(d)}`,
    '- Target context: general (customize in the generated DESIGN.md)',
    `- Decisions made: ${DECISION_STEPS.filter((s) => d[s] != null).join(', ') || '(none yet)'}`,
    '',
  );

  if (d.typography) sections.push(typographySection(d.typography), '');
  if (d.spacing) sections.push(spacingSection(d.spacing), '');
  if (d.radius) sections.push(radiusSection(d.radius), '');
  if (d.shadow) {
    const withHue: ShadowInput = {
      ...d.shadow,
      primaryHue: d.shadow.primaryHue ?? d.color?.primaryHue,
    };
    sections.push(shadowSection(withHue), '');
  }
  if (d.color) sections.push(colorSection(d.color), '');

  sections.push(USAGE_GUIDELINES, '', notSection(d), '', AI_INSTRUCTIONS);

  return sections.join('\n');
}
