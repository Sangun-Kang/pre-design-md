import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Alert.module.css';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  title?: ReactNode;
  children: ReactNode;
}

const ICONS: Record<AlertTone, string> = {
  info: 'i',
  success: '✓',
  warning: '!',
  danger: '×',
};

export function Alert({ tone = 'info', title, className, children, ...rest }: AlertProps) {
  return (
    <div
      className={clsx(styles.alert, styles[`tone_${tone}`], className)}
      role="status"
      {...rest}
    >
      <span className={styles.icon} aria-hidden>
        {ICONS[tone]}
      </span>
      <div className={styles.body}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.text}>{children}</div>
      </div>
    </div>
  );
}
