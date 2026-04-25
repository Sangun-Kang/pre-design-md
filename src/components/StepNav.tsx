import clsx from 'clsx';
import { useDesignStore } from '../store/designStore';
import { STEP_ORDER, type Step } from '../types/design';
import { useLang, SUPPORTED_LANGS } from '../i18n';
import styles from './StepNav.module.css';

function isAccessible(
  step: Step,
  currentStep: Step,
  completedSteps: Set<string>,
): boolean {
  if (step === currentStep) return true;
  if (step === 'start') return true;
  if (completedSteps.has(step)) return true;
  const currentIdx = STEP_ORDER.indexOf(currentStep);
  const targetIdx = STEP_ORDER.indexOf(step);
  return targetIdx < currentIdx;
}

export function StepNav() {
  const currentStep = useDesignStore((s) => s.currentStep);
  const completedSteps = useDesignStore((s) => s.completedSteps);
  const setStep = useDesignStore((s) => s.setStep);
  const { lang, setLang, t } = useLang();

  return (
    <nav className={styles.nav} aria-label="Progress">
      <div className={styles.brand}>pre-design-md</div>
      <ol className={styles.list}>
        {STEP_ORDER.map((step, i) => {
          const completedGeneric = completedSteps as Set<string>;
          const accessible = isAccessible(step, currentStep, completedGeneric);
          const isCurrent = step === currentStep;
          const isComplete = completedGeneric.has(step);
          return (
            <li key={step} className={styles.item}>
              <button
                type="button"
                className={clsx(styles.stepBtn, {
                  [styles.current!]: isCurrent,
                  [styles.complete!]: isComplete,
                  [styles.disabled!]: !accessible,
                })}
                disabled={!accessible}
                onClick={() => accessible && setStep(step)}
              >
                <span className={styles.idx}>{i + 1}</span>
                <span className={styles.label}>{t(`nav.${step}`)}</span>
              </button>
              {i < STEP_ORDER.length - 1 && <span className={styles.separator} aria-hidden />}
            </li>
          );
        })}
      </ol>
      <div className={styles.langSwitcher} role="group" aria-label="Language">
        {SUPPORTED_LANGS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={clsx(styles.langBtn, lang === l && styles.langBtnActive)}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  );
}
