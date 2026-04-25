/// <reference types="node" />
import { buildGoogleSpec, buildRichPrompt, buildCssVariables } from '../src/lib/build';

const sample = {
  typography: { baseSize: 18 as const, ratio: 1.25 as const, pairingId: 'modern-sans' },
  spacing: { baseUnit: 8 as const, scale: 'linear' as const },
  radius: { base: 8 as const, scale: 'scaled' as const },
  shadow: { intensity: 'medium' as const, tintedPreferred: false },
  color: { primaryHue: 250, chroma: 'balanced' as const, neutralStyle: 'pure' as const, supportsDark: false },
};

const which = process.argv[2] ?? 'google';
if (which === 'google') console.log(buildGoogleSpec(sample));
else if (which === 'rich') console.log(buildRichPrompt(sample));
else if (which === 'css') console.log(buildCssVariables(sample));
