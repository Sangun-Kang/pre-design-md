import { useMemo, type CSSProperties, type HTMLAttributes } from 'react';
import type { DesignDecisions } from '../types/design';
import { useDesignStore } from '../store/designStore';
import { decisionsToCssVars } from './applyTokens';

export interface PreviewScopeProps extends HTMLAttributes<HTMLDivElement> {
  override?: Partial<DesignDecisions>;
}

/**
 * Injects user-decision CSS variables into a bounded subtree.
 * The app chrome outside this scope stays on --app-* tokens and is unaffected.
 * `override` merges on top of the current store decisions — use it so preset cards
 * can preview one variation while still inheriting the rest of the user's choices.
 */
export function PreviewScope({ override, style, children, ...rest }: PreviewScopeProps) {
  const typography = useDesignStore((s) => s.typography);
  const spacing = useDesignStore((s) => s.spacing);
  const radius = useDesignStore((s) => s.radius);
  const shadow = useDesignStore((s) => s.shadow);
  const color = useDesignStore((s) => s.color);

  const mergedStyle = useMemo<CSSProperties>(() => {
    const merged: DesignDecisions = {
      typography: override?.typography ?? typography,
      spacing: override?.spacing ?? spacing,
      radius: override?.radius ?? radius,
      shadow: override?.shadow ?? shadow,
      color: override?.color ?? color,
    };
    const vars = decisionsToCssVars(merged) as CSSProperties;
    return { ...vars, ...(style ?? {}) };
  }, [override, typography, spacing, radius, shadow, color, style]);

  return (
    <div style={mergedStyle} {...rest}>
      {children}
    </div>
  );
}
