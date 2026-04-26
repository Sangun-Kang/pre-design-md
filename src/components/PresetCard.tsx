import clsx from 'clsx';
import type { KeyboardEvent, ReactNode } from 'react';
import styles from './PresetCard.module.css';

export interface PresetCardProps {
  selected?: boolean;
  label: string;
  description?: string;
  onClick: () => void;
  children: ReactNode;
  previewBackground?: string;
  /** If true, the preview area is not padded — for scopes that manage their own layout */
  flush?: boolean;
}

export function PresetCard({
  selected,
  label,
  description,
  onClick,
  children,
  previewBackground,
  flush,
}: PresetCardProps) {
  // Rendered as <div role="button"> rather than <button> because some
  // previews embed real <button>/<input> elements as visual samples (e.g.
  // SpacingStep, RadiusStep). A native <button> wrapper produces invalid
  // nested-interactive HTML; the div + role + keyboard handler keeps the
  // a11y semantics without the nesting.
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={clsx(styles.card, selected && styles.selected)}
      data-selected={selected ? 'true' : 'false'}
      aria-pressed={selected}
    >
      <div
        className={clsx(styles.preview, flush && styles.previewFlush)}
        style={previewBackground ? { background: previewBackground } : undefined}
      >
        <div className={styles.previewInner}>{children}</div>
      </div>
      <div className={styles.meta}>
        <div className={styles.label}>{label}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </div>
  );
}
