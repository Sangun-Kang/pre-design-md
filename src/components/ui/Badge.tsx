import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', className, children, ...rest }: BadgeProps) {
  return (
    <span className={clsx(styles.badge, styles[`tone_${tone}`], className)} {...rest}>
      {children}
    </span>
  );
}
