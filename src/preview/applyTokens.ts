import type {
  DesignDecisions,
  ShadowInput,
  TokensBundle,
} from '../types/design';
import { buildTypeScale } from '../lib/typeScale';
import { buildSpacingScale } from '../lib/spacingScale';
import { buildRadiusScale } from '../lib/radiusScale';
import { buildShadowTokens } from '../lib/shadowTokens';
import { buildColorPalette } from '../lib/colorPalette';

export const DEFAULT_DECISIONS: Required<{
  [K in keyof DesignDecisions]: NonNullable<DesignDecisions[K]>;
}> = {
  typography: { baseSize: 16, ratio: 1.25, pairingId: 'modern-sans' },
  spacing: { baseUnit: 8, scale: 'linear' },
  radius: { base: 8, scale: 'scaled' },
  shadow: { intensity: 'medium', tintedPreferred: false },
  color: {
    category: 'hue-based',
    primaryHue: 250,
    chroma: 'balanced',
    neutralStyle: 'pure',
    supportsDark: false,
    warmth: 0,
    accentHue: 250,
  },
};

export function buildTokensBundle(decisions: DesignDecisions): TokensBundle {
  const typography = decisions.typography ?? DEFAULT_DECISIONS.typography;
  const spacing = decisions.spacing ?? DEFAULT_DECISIONS.spacing;
  const radius = decisions.radius ?? DEFAULT_DECISIONS.radius;
  const color = decisions.color ?? DEFAULT_DECISIONS.color;

  // Shadow may carry a tint — derive primaryHue from the current color decision
  // so the tint visibly matches. If no color decided yet, use default hue.
  const shadowInput: ShadowInput = {
    ...(decisions.shadow ?? DEFAULT_DECISIONS.shadow),
    primaryHue: color.primaryHue,
  };

  return {
    type: buildTypeScale(typography),
    spacing: buildSpacingScale(spacing),
    radius: buildRadiusScale(radius),
    shadow: buildShadowTokens(shadowInput),
    color: buildColorPalette(color),
  };
}

export function tokensToCssVars(bundle: TokensBundle): Record<string, string> {
  const vars: Record<string, string> = {};

  // Typography
  for (const [k, v] of Object.entries(bundle.type.sizes)) {
    vars[`--font-size-${k}`] = v;
  }
  vars['--line-height-tight'] = String(bundle.type.lineHeights.tight);
  vars['--line-height-normal'] = String(bundle.type.lineHeights.normal);
  vars['--line-height-relaxed'] = String(bundle.type.lineHeights.relaxed);
  vars['--font-family-heading'] = bundle.type.families.heading;
  vars['--font-family-body'] = bundle.type.families.body;
  if (bundle.type.families.mono) vars['--font-family-mono'] = bundle.type.families.mono;
  vars['--font-weight-body'] = String(bundle.type.weights.body);
  vars['--font-weight-body-strong'] = String(bundle.type.weights.bodyStrong);
  vars['--font-weight-heading'] = String(bundle.type.weights.heading);

  // Spacing
  for (const [k, v] of Object.entries(bundle.spacing.tokens)) {
    vars[`--space-${k}`] = v;
  }
  vars['--space-button-padding-x'] = bundle.spacing.components.buttonPaddingX;
  vars['--space-button-padding-y'] = bundle.spacing.components.buttonPaddingY;
  vars['--space-card-padding'] = bundle.spacing.components.cardPadding;
  vars['--space-input-padding-x'] = bundle.spacing.components.inputPaddingX;
  vars['--space-input-padding-y'] = bundle.spacing.components.inputPaddingY;
  vars['--space-section-gap'] = bundle.spacing.components.sectionGap;
  vars['--space-stack-gap'] = bundle.spacing.components.stackGap;

  // Radius
  for (const [k, v] of Object.entries(bundle.radius.tokens)) {
    vars[`--radius-${k}`] = v;
  }
  vars['--radius-input'] = bundle.radius.components.input;
  vars['--radius-button'] = bundle.radius.components.button;
  vars['--radius-card'] = bundle.radius.components.card;
  vars['--radius-badge'] = bundle.radius.components.badge;

  // Shadow
  for (const [k, v] of Object.entries(bundle.shadow.tokens)) {
    vars[`--shadow-${k}`] = v;
  }

  // Color — primary
  for (const [k, v] of Object.entries(bundle.color.primary)) {
    vars[`--color-primary-${k}`] = v;
  }
  // Color — neutral
  for (const [k, v] of Object.entries(bundle.color.neutral)) {
    vars[`--color-neutral-${k}`] = v;
  }
  // Semantic
  vars['--color-success-500'] = bundle.color.semantic.success;
  vars['--color-warning-500'] = bundle.color.semantic.warning;
  vars['--color-danger-500'] = bundle.color.semantic.danger;
  vars['--color-info-500'] = bundle.color.semantic.info;

  // Semantic surfaces (derived from neutral — consumers use these).
  // Neon on dark inverts the mapping so the standard component vars
  // automatically render against a dark stage.
  if (bundle.color.meta.category === 'neon-on-dark') {
    vars['--color-bg'] = bundle.color.neutral['950'];
    vars['--color-surface'] = bundle.color.neutral['900'];
    vars['--color-surface-raised'] = bundle.color.neutral['800'];
    vars['--color-text'] = bundle.color.neutral['50'];
    vars['--color-text-muted'] = bundle.color.neutral['300'];
    vars['--color-border'] = bundle.color.neutral['700'];
    vars['--color-border-strong'] = bundle.color.neutral['600'];
  } else {
    vars['--color-bg'] = bundle.color.neutral['50'];
    vars['--color-surface'] = bundle.color.neutral['50'];
    vars['--color-surface-raised'] = 'oklch(100% 0 0)';
    vars['--color-text'] = bundle.color.neutral['900'];
    vars['--color-text-muted'] = bundle.color.neutral['600'];
    vars['--color-border'] = bundle.color.neutral['200'];
    vars['--color-border-strong'] = bundle.color.neutral['300'];
  }

  return vars;
}

export function decisionsToCssVars(decisions: DesignDecisions): Record<string, string> {
  return tokensToCssVars(buildTokensBundle(decisions));
}
