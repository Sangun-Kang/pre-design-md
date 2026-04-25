export type Step =
  | 'start'
  | 'typography'
  | 'spacing'
  | 'radius'
  | 'shadow'
  | 'color'
  | 'preview'
  | 'export';

export const STEP_ORDER: Step[] = [
  'start',
  'typography',
  'spacing',
  'radius',
  'shadow',
  'color',
  'preview',
  'export',
];

export const DECISION_STEPS = ['typography', 'spacing', 'radius', 'shadow', 'color'] as const;
export type DecisionStep = (typeof DECISION_STEPS)[number];

export type Rem = `${number}rem`;
export type CssLength = string;
export type OklchStr = string;
export type CssShadow = string;

export type Step11 =
  | '50' | '100' | '200' | '300' | '400'
  | '500' | '600' | '700' | '800' | '900' | '950';

export const SCALE_STEPS: Step11[] = [
  '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950',
];

export type TypeKey = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type SpacingKey = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
export type RadiusKey = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

// ──────────── Typography ────────────

export type BaseSize = 14 | 16 | 18 | 20;
export type TypeRatio = 1.125 | 1.2 | 1.25 | 1.333 | 1.5;

export interface FontPairing {
  id: string;
  name: string;
  description: string;
  heading: string;
  body: string;
  mono?: string;
  weights: { body: number; bodyStrong: number; heading: number };
}

export interface TypographyInput {
  baseSize: BaseSize;
  ratio: TypeRatio;
  pairingId: string;
}

export interface TypeScaleTokens {
  sizes: Record<TypeKey, Rem>;
  lineHeights: { tight: number; normal: number; relaxed: number };
  families: { heading: string; body: string; mono?: string };
  weights: FontPairing['weights'];
  meta: { baseSize: number; ratio: number; pairingId: string };
}

// ──────────── Spacing ────────────

export type SpacingBase = 4 | 6 | 8 | 10;
export type SpacingScale = 'linear' | 'multiplicative';

export interface SpacingInput {
  baseUnit: SpacingBase;
  scale: SpacingScale;
}

export interface SpacingTokens {
  tokens: Record<SpacingKey, Rem>;
  components: {
    buttonPaddingX: Rem;
    buttonPaddingY: Rem;
    cardPadding: Rem;
    inputPaddingY: Rem;
    inputPaddingX: Rem;
    sectionGap: Rem;
    stackGap: Rem;
  };
  meta: SpacingInput;
}

// ──────────── Radius ────────────

export type RadiusBase = 0 | 2 | 4 | 8 | 12 | 16 | 24;
export type RadiusScale = 'uniform' | 'scaled';

export interface RadiusInput {
  base: RadiusBase;
  scale: RadiusScale;
}

export interface RadiusTokens {
  tokens: Record<RadiusKey, CssLength>;
  components: {
    input: CssLength;
    button: CssLength;
    card: CssLength;
    badge: CssLength;
  };
  meta: RadiusInput & { label: string };
}

// ──────────── Shadow ────────────

export type ShadowIntensity = 'none' | 'subtle' | 'medium' | 'strong';

export interface ShadowInput {
  intensity: ShadowIntensity;
  tintedPreferred: boolean;
  primaryHue?: number;
}

export interface ShadowTokens {
  tokens: {
    sm: CssShadow;
    md: CssShadow;
    lg: CssShadow;
    xl: CssShadow;
  };
  elevation: {
    dropdown: keyof ShadowTokens['tokens'];
    card: keyof ShadowTokens['tokens'];
    modal: keyof ShadowTokens['tokens'];
    toast: keyof ShadowTokens['tokens'];
  };
  meta: { intensity: ShadowIntensity; tinted: boolean; tintColor: OklchStr };
}

// ──────────── Color ────────────

export type ChromaLevel = 'muted' | 'balanced' | 'vivid';
export type NeutralStyle = 'pure' | 'warm' | 'cool' | 'tinted';

export interface ColorInput {
  primaryHue: number;
  chroma: ChromaLevel;
  neutralStyle: NeutralStyle;
  supportsDark: boolean;
}

export type Scale11 = Record<Step11, OklchStr>;

export interface SemanticColors {
  success: OklchStr;
  warning: OklchStr;
  danger: OklchStr;
  info: OklchStr;
}

export interface ColorPalette {
  primary: Scale11;
  neutral: Scale11;
  semantic: SemanticColors;
  interactionStates: {
    hover: { lightnessDelta: number };
    active: { lightnessDelta: number };
    focus: { outline: string; offset: string; color: string };
    disabled: { opacity: number };
  };
  dark?: {
    primary: Scale11;
    neutral: Scale11;
    semantic: SemanticColors;
  };
  meta: ColorInput;
}

// ──────────── Aggregate ────────────

export interface TokensBundle {
  type: TypeScaleTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadow: ShadowTokens;
  color: ColorPalette;
}

export interface DesignDecisions {
  typography: TypographyInput | null;
  spacing: SpacingInput | null;
  radius: RadiusInput | null;
  shadow: ShadowInput | null;
  color: ColorInput | null;
}
