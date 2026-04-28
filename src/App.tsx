import { useMemo, type CSSProperties } from 'react';
import { useDesignStore } from './store/designStore';
import { Wizard } from './components/Wizard';
import { decisionsToCssVars } from './preview/applyTokens';

const GLOBAL_SCOPE_STEPS = new Set(['color', 'preview', 'export']);

export function App() {
  const currentStep = useDesignStore((s) => s.currentStep);
  const typography = useDesignStore((s) => s.typography);
  const spacing = useDesignStore((s) => s.spacing);
  const radius = useDesignStore((s) => s.radius);
  const shadow = useDesignStore((s) => s.shadow);
  const color = useDesignStore((s) => s.color);

  const applyGlobally = GLOBAL_SCOPE_STEPS.has(currentStep);

  const style = useMemo<CSSProperties | undefined>(() => {
    if (!applyGlobally) return undefined;
    const vars: Record<string, string> = decisionsToCssVars({
      typography,
      spacing,
      radius,
      shadow,
      color,
    });
    // When the user has settled on a category, bleed the appropriate hue
    // into the chrome accent. Mono / off-mono fall back to neutral grays.
    if (color) {
      let accentHue: number | null;
      let accentChroma: number;
      switch (color.category) {
        case 'grayscale-accent':
          accentHue = color.accentHue;
          accentChroma = 0.15;
          break;
        case 'neon-on-dark':
          accentHue = color.accentHue;
          accentChroma = 0.2;
          break;
        case 'mono':
          accentHue = null;
          accentChroma = 0;
          break;
        case 'hue-based':
        default:
          accentHue = color.primaryHue;
          accentChroma = 0.15;
      }
      if (accentHue == null) {
        vars['--app-accent'] = 'oklch(35% 0 0)';
        vars['--app-accent-hover'] = 'oklch(45% 0 0)';
        vars['--app-accent-press'] = 'oklch(25% 0 0)';
        vars['--app-accent-soft'] = 'oklch(20% 0 0)';
        vars['--app-step-accent-text'] = 'oklch(100% 0 0)';
        vars['--app-step-accent-soft-text'] = 'oklch(100% 0 0)';
        vars['--app-focus'] = 'oklch(60% 0 0)';
      } else {
        vars['--app-accent'] = `oklch(74% ${accentChroma} ${accentHue})`;
        vars['--app-accent-hover'] = `oklch(80% ${accentChroma} ${accentHue})`;
        vars['--app-accent-press'] = `oklch(68% ${accentChroma} ${accentHue})`;
        vars['--app-accent-soft'] = `oklch(30% ${accentChroma * 0.7} ${accentHue})`;
        vars['--app-step-accent-text'] = 'oklch(14% 0 0)';
        vars['--app-step-accent-soft-text'] = 'oklch(100% 0 0)';
        vars['--app-focus'] = `oklch(80% ${accentChroma} ${accentHue})`;
      }
    }
    return vars as CSSProperties;
  }, [applyGlobally, typography, spacing, radius, shadow, color]);

  // Neon on dark forces a dark presentation; tone-tinted components
  // (Alert / Badge) read this attribute to swap to dark variants.
  const isDark = applyGlobally && color?.category === 'neon-on-dark';

  return (
    <div
      className={`app-root${applyGlobally ? ' app-root--global' : ''}`}
      data-theme={isDark ? 'dark' : undefined}
      style={style}
    >
      <Wizard />
    </div>
  );
}
