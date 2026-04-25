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
    // When the user has settled on a primary hue, bleed it into the chrome
    // accent so the entire app adopts the chosen color — the "surprise" beat.
    if (color) {
      const h = color.primaryHue;
      vars['--app-accent'] = `oklch(74% 0.15 ${h})`;
      vars['--app-accent-hover'] = `oklch(80% 0.16 ${h})`;
      vars['--app-accent-press'] = `oklch(68% 0.16 ${h})`;
      vars['--app-accent-soft'] = `oklch(30% 0.1 ${h})`;
      vars['--app-focus'] = `oklch(80% 0.16 ${h})`;
    }
    return vars as CSSProperties;
  }, [applyGlobally, typography, spacing, radius, shadow, color]);

  return (
    <div className={`app-root${applyGlobally ? ' app-root--global' : ''}`} style={style}>
      <Wizard />
    </div>
  );
}
