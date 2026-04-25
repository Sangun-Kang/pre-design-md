import type {
  Rem,
  SpacingInput,
  SpacingKey,
  SpacingTokens,
} from '../types/design';

const KEYS: SpacingKey[] = [
  '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl',
];

const LINEAR_FACTORS = [0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16];
const MULTIPLICATIVE_FACTORS = [0.5, 1, 2, 3, 4, 6, 8, 12, 16, 24];

const toRem = (px: number): Rem => {
  const rem = Math.round((px / 16) * 10000) / 10000;
  return `${rem}rem`;
};

export function buildSpacingScale(input: SpacingInput): SpacingTokens {
  const { baseUnit, scale } = input;
  const factors = scale === 'linear' ? LINEAR_FACTORS : MULTIPLICATIVE_FACTORS;

  const tokens = {} as Record<SpacingKey, Rem>;
  KEYS.forEach((key, i) => {
    const factor = factors[i] ?? factors[factors.length - 1]!;
    tokens[key] = toRem(factor * baseUnit);
  });

  return {
    tokens,
    components: {
      buttonPaddingX: tokens.md,
      buttonPaddingY: tokens.xs,
      cardPadding: tokens.lg,
      inputPaddingY: tokens.xs,
      inputPaddingX: tokens.sm,
      sectionGap: tokens['3xl'],
      stackGap: tokens.md,
    },
    meta: { baseUnit, scale },
  };
}
