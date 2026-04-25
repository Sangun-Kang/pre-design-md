/// <reference types="node" />
import { buildGoogleSpec, buildRichPrompt, buildCssVariables } from '../src/lib/build';
import type { ColorCategory, ColorInput } from '../src/types/design';

const cat = (process.argv[3] as ColorCategory | undefined) ?? 'hue-based';

const color: ColorInput = {
  category: cat,
  primaryHue: 250,
  chroma: 'balanced',
  neutralStyle: 'pure',
  supportsDark: false,
  warmth: 0.4,
  accentHue: 280,
};

const radiusScale = (process.argv[4] as 'uniform' | 'scaled' | 'asymmetric' | undefined) ?? 'scaled';
const shadowIntensity =
  (process.argv[5] as 'none' | 'subtle' | 'medium' | 'strong' | 'layered' | undefined) ?? 'medium';

const sample = {
  typography: { baseSize: 18 as const, ratio: 1.25 as const, pairingId: 'modern-sans' },
  spacing: { baseUnit: 8 as const, scale: 'linear' as const },
  radius: { base: 12 as const, scale: radiusScale },
  shadow: { intensity: shadowIntensity, tintedPreferred: false },
  color,
};

const which = process.argv[2] ?? 'google';
if (which === 'google') console.log(buildGoogleSpec(sample));
else if (which === 'rich') console.log(buildRichPrompt(sample));
else if (which === 'css') console.log(buildCssVariables(sample));
