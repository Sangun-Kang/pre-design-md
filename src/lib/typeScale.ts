import type {
  FontPairing,
  Rem,
  TypeKey,
  TypeScaleTokens,
  TypographyInput,
} from '../types/design';

export const PAIRINGS: FontPairing[] = [
  {
    id: 'modern-sans',
    name: 'Modern Sans',
    description: 'Inter throughout — neutral, dense, universal.',
    heading: "'Inter', system-ui, -apple-system, sans-serif",
    body: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    weights: { body: 400, bodyStrong: 600, heading: 700 },
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Fraunces display serif + Inter body — warm, long-form.',
    heading: "'Fraunces', 'Source Serif 4', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    weights: { body: 400, bodyStrong: 600, heading: 600 },
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'JetBrains Mono headings + Inter body — developer tooling.',
    heading: "'JetBrains Mono', ui-monospace, monospace",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    weights: { body: 400, bodyStrong: 500, heading: 700 },
  },
  {
    id: 'humanist',
    name: 'Humanist',
    description: 'Source Serif + Source Sans — friendly, approachable.',
    heading: "'Source Serif 4', Georgia, serif",
    body: "'Source Sans 3', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    weights: { body: 400, bodyStrong: 600, heading: 700 },
  },
  {
    id: 'space',
    name: 'Space',
    description: 'Space Grotesk — geometric, slightly quirky, modern tech.',
    heading: "'Space Grotesk', system-ui, sans-serif",
    body: "'Space Grotesk', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    weights: { body: 400, bodyStrong: 500, heading: 700 },
  },
  {
    id: 'dm',
    name: 'DM Sans',
    description: 'DM Sans — geometric low-contrast, calm product feel.',
    heading: "'DM Sans', system-ui, sans-serif",
    body: "'DM Sans', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    weights: { body: 400, bodyStrong: 500, heading: 700 },
  },
  {
    id: 'plex',
    name: 'IBM Plex',
    description: 'IBM Plex Sans — precise, institutional, reliable.',
    heading: "'IBM Plex Sans', system-ui, sans-serif",
    body: "'IBM Plex Sans', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    weights: { body: 400, bodyStrong: 600, heading: 700 },
  },
  {
    id: 'display-serif',
    name: 'Display Serif',
    description: 'Playfair Display headline + DM Sans body — editorial showpiece.',
    heading: "'Playfair Display', Georgia, serif",
    body: "'DM Sans', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    weights: { body: 400, bodyStrong: 600, heading: 700 },
  },
];

/**
 * Pairings pinned to specific language scripts. Merged on top of PAIRINGS when
 * that language is active so Korean/Japanese users see locally-popular choices.
 */
export const LANG_PAIRINGS: Record<string, FontPairing[]> = {
  ko: [
    {
      id: 'kr-noto',
      name: 'Noto Sans KR',
      description: 'Google Noto Sans KR — neutral, hangul-first, highly legible.',
      heading: "'Noto Sans KR', 'Apple SD Gothic Neo', system-ui, sans-serif",
      body: "'Noto Sans KR', 'Apple SD Gothic Neo', system-ui, sans-serif",
      mono: "'JetBrains Mono', ui-monospace, monospace",
      weights: { body: 400, bodyStrong: 600, heading: 700 },
    },
    {
      id: 'kr-plex',
      name: 'IBM Plex KR',
      description: 'IBM Plex Sans KR — institutional, precise hangul.',
      heading: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', system-ui, sans-serif",
      body: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', system-ui, sans-serif",
      mono: "'JetBrains Mono', ui-monospace, monospace",
      weights: { body: 400, bodyStrong: 500, heading: 700 },
    },
    {
      id: 'kr-gowun',
      name: 'Gowun',
      description: 'Gowun Batang headline + Gowun Dodum body — warm Korean serif & sans.',
      heading: "'Gowun Batang', Georgia, serif",
      body: "'Gowun Dodum', 'Apple SD Gothic Neo', system-ui, sans-serif",
      mono: "'JetBrains Mono', ui-monospace, monospace",
      weights: { body: 400, bodyStrong: 700, heading: 700 },
    },
  ],
  ja: [
    {
      id: 'jp-noto',
      name: 'Noto Sans JP',
      description: 'Google Noto Sans JP — universal Japanese sans, clean and clear.',
      heading: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', system-ui, sans-serif",
      body: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', system-ui, sans-serif",
      mono: "'JetBrains Mono', ui-monospace, monospace",
      weights: { body: 400, bodyStrong: 500, heading: 700 },
    },
    {
      id: 'jp-zen',
      name: 'Zen Kaku',
      description: 'Zen Kaku Gothic New — modern geometric kaku-gothic, crisp.',
      heading: "'Zen Kaku Gothic New', 'Hiragino Kaku Gothic ProN', system-ui, sans-serif",
      body: "'Zen Kaku Gothic New', 'Hiragino Kaku Gothic ProN', system-ui, sans-serif",
      mono: "'JetBrains Mono', ui-monospace, monospace",
      weights: { body: 400, bodyStrong: 500, heading: 700 },
    },
    {
      id: 'jp-rounded',
      name: 'M PLUS Rounded',
      description: 'M PLUS Rounded 1c — friendly rounded forms, consumer products.',
      heading: "'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN', system-ui, sans-serif",
      body: "'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN', system-ui, sans-serif",
      mono: "'JetBrains Mono', ui-monospace, monospace",
      weights: { body: 400, bodyStrong: 500, heading: 700 },
    },
    {
      id: 'jp-shippori',
      name: 'Shippori Mincho',
      description: 'Shippori Mincho headline + Noto Sans JP body — editorial Japanese.',
      heading: "'Shippori Mincho', 'YuMincho', 'Hiragino Mincho ProN', serif",
      body: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', system-ui, sans-serif",
      mono: "'JetBrains Mono', ui-monospace, monospace",
      weights: { body: 400, bodyStrong: 500, heading: 700 },
    },
  ],
};

export function getPairingsForLang(lang: string): FontPairing[] {
  const extras = LANG_PAIRINGS[lang] ?? [];
  return [...extras, ...PAIRINGS];
}

export function getPairing(id: string): FontPairing {
  for (const bucket of Object.values(LANG_PAIRINGS)) {
    const hit = bucket.find((p) => p.id === id);
    if (hit) return hit;
  }
  return PAIRINGS.find((p) => p.id === id) ?? PAIRINGS[0]!;
}

const TYPE_STEPS: Array<{ key: TypeKey; power: number }> = [
  { key: 'xs', power: -2 },
  { key: 'sm', power: -1 },
  { key: 'base', power: 0 },
  { key: 'lg', power: 1 },
  { key: 'xl', power: 2 },
  { key: '2xl', power: 3 },
  { key: '3xl', power: 4 },
  { key: '4xl', power: 5 },
];

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const round = (n: number, digits = 4) => {
  const m = 10 ** digits;
  return Math.round(n * m) / m;
};

export function buildTypeScale(input: TypographyInput): TypeScaleTokens {
  const { baseSize, ratio, pairingId } = input;
  const pairing = getPairing(pairingId);

  const sizes = {} as Record<TypeKey, Rem>;
  for (const { key, power } of TYPE_STEPS) {
    const px = baseSize * Math.pow(ratio, power);
    const rem = round(px / 16, 4);
    sizes[key] = `${rem}rem`;
  }

  const tight = round(clamp(1.3 - (ratio - 1.2) * 0.5, 1.1, 1.3), 3);
  const normal = round(clamp(1.6 - (ratio - 1.2) * 0.4, 1.45, 1.7), 3);
  const relaxed = round(normal + 0.15, 3);

  const families: TypeScaleTokens['families'] = {
    heading: pairing.heading,
    body: pairing.body,
  };
  if (pairing.mono) families.mono = pairing.mono;

  return {
    sizes,
    lineHeights: { tight, normal, relaxed },
    families,
    weights: pairing.weights,
    meta: { baseSize, ratio, pairingId: pairing.id },
  };
}

export function ratioName(ratio: number): string {
  switch (ratio) {
    case 1.125: return 'minor second';
    case 1.2: return 'minor third';
    case 1.25: return 'major third';
    case 1.333: return 'perfect fourth';
    case 1.5: return 'perfect fifth';
    default: return `${ratio}`;
  }
}
