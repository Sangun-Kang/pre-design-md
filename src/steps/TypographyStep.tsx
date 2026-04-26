import clsx from 'clsx';
import { useDesignStore } from '../store/designStore';
import { PresetCard } from '../components/PresetCard';
import { StepLayout } from '../components/StepLayout';
import { buildTypeScale, getPairingsForLang } from '../lib/typeScale';
import { useLang, useT } from '../i18n';
import type { BaseSize, TypographyInput, TypeRatio } from '../types/design';
import styles from './TypographyStep.module.css';

const BASE_SIZES: BaseSize[] = [14, 16, 18, 20];
const RATIOS: TypeRatio[] = [1.125, 1.2, 1.25, 1.333, 1.5];

export function TypographyStep() {
  const typography = useDesignStore((s) => s.typography);
  const update = useDesignStore((s) => s.updateTypography);
  const t = useT();
  const { lang } = useLang();
  const pairings = getPairingsForLang(lang);

  const baseSize = typography?.baseSize ?? 16;
  const ratio = typography?.ratio ?? 1.25;
  const pairingId = typography?.pairingId ?? 'modern-sans';

  function set(partial: Partial<TypographyInput>) {
    update({ baseSize, ratio, pairingId, ...partial });
  }

  return (
    <StepLayout
      eyebrow={t('typography.eyebrow')}
      title={t('typography.title')}
      description={t('typography.description')}
      canProceed={typography != null}
      cardsClassName={styles.bodyOverride}
    >
      <section className={styles.controlsBar} aria-label={t('typography.scaleControls')}>
        <div className={styles.controlBlock}>
          <span className={styles.controlLabel}>{t('typography.baseSize')}</span>
          <div className={styles.seg} role="radiogroup" aria-label={t('typography.baseSize')}>
            {BASE_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={baseSize === s}
                className={clsx(styles.segBtn, baseSize === s && styles.segBtnActive)}
                onClick={() => set({ baseSize: s })}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>
        <div className={styles.controlBlock}>
          <span className={styles.controlLabel}>{t('typography.ratio')}</span>
          <div className={styles.seg} role="radiogroup" aria-label={t('typography.ratio')}>
            {RATIOS.map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={ratio === r}
                className={clsx(styles.segBtn, ratio === r && styles.segBtnActive)}
                onClick={() => set({ ratio: r })}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.pairingsSection}>
        <span className={styles.sectionEyebrow}>{t('typography.pairingsHeading')}</span>
        <div className={styles.pairingGrid}>
          {pairings.map((p) => {
            const tokens = buildTypeScale({ baseSize, ratio, pairingId: p.id });
            return (
              <PresetCard
                key={p.id}
                selected={typography != null && pairingId === p.id}
                label={p.name}
                description={p.description}
                onClick={() => set({ pairingId: p.id })}
                flush
              >
                <div className={styles.pairingCardContent}>
                  <div
                    className={styles.pairingHeading}
                    style={{
                      fontFamily: p.heading,
                      fontWeight: p.weights.heading,
                      fontSize: tokens.sizes.xl,
                      lineHeight: tokens.lineHeights.tight,
                    }}
                  >
                    {t('typography.pairingHeading')}
                  </div>
                  <div
                    className={styles.pairingBody}
                    style={{
                      fontFamily: p.body,
                      fontWeight: p.weights.body,
                      fontSize: tokens.sizes.base,
                      lineHeight: tokens.lineHeights.normal,
                    }}
                  >
                    {t('typography.pairingBody')}
                  </div>
                </div>
              </PresetCard>
            );
          })}
        </div>
      </section>
    </StepLayout>
  );
}
