import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './StepLayout.module.css';
import { useDesignStore } from '../store/designStore';
import { STEP_ORDER, type Step } from '../types/design';
import { useT } from '../i18n';

export interface StepLayoutProps {
  title: string;
  description?: ReactNode;
  canProceed?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  children: ReactNode;
  cardsClassName?: string;
  eyebrow?: string;
}

export function StepLayout({
  title,
  description,
  canProceed = true,
  onBack,
  onNext,
  nextLabel,
  children,
  cardsClassName,
  eyebrow,
}: StepLayoutProps) {
  const currentStep = useDesignStore((s) => s.currentStep);
  const setStep = useDesignStore((s) => s.setStep);
  const t = useT();
  const resolvedNextLabel = nextLabel ?? t('common.next');
  const backLabel = t('common.back');

  function defaultBack() {
    const i = STEP_ORDER.indexOf(currentStep);
    if (i > 0) setStep(STEP_ORDER[i - 1] as Step);
  }

  function defaultNext() {
    const i = STEP_ORDER.indexOf(currentStep);
    if (i < STEP_ORDER.length - 1) setStep(STEP_ORDER[i + 1] as Step);
  }

  const handleBack = onBack ?? defaultBack;
  const handleNext = onNext ?? defaultNext;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.heading}>
          {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.topActions}>
          <button type="button" className={styles.ghostBtn} onClick={handleBack}>
            ← {backLabel}
          </button>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleNext}
            disabled={!canProceed}
          >
            {resolvedNextLabel} →
          </button>
        </div>
      </header>
      <div className={clsx(styles.body, cardsClassName)}>{children}</div>
      <footer className={styles.footer}>
        <button type="button" className={styles.ghostBtn} onClick={handleBack}>
          ← Back
        </button>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={handleNext}
          disabled={!canProceed}
        >
          {nextLabel} →
        </button>
      </footer>
    </div>
  );
}
