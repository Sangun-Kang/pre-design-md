import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useDesignStore } from '../store/designStore';
import { PresetCard } from '../components/PresetCard';
import { StepLayout } from '../components/StepLayout';
import { buildTypeScale, getPairing, getPairingsForLang, ratioName } from '../lib/typeScale';
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

  const [dockOpen, setDockOpen] = useState(false);
  const prevPairingIdRef = useRef<string | null>(null);

  useEffect(() => {
    const pid = typography?.pairingId ?? null;
    if (pid && pid !== prevPairingIdRef.current) {
      setDockOpen(true);
      prevPairingIdRef.current = pid;
    }
  }, [typography?.pairingId]);

  const baseSize = typography?.baseSize ?? 16;
  const ratio = typography?.ratio ?? 1.25;
  const pairingId = typography?.pairingId ?? 'modern-sans';
  const pairing = getPairing(pairingId);

  function set(partial: Partial<TypographyInput>) {
    update({ baseSize, ratio, pairingId, ...partial });
  }

  const previewTokens = buildTypeScale({ baseSize, ratio, pairingId });

  return (
    <StepLayout
      eyebrow={t('typography.eyebrow')}
      title={t('typography.title')}
      description={t('typography.description')}
      canProceed={typography != null}
      cardsClassName={styles.bodyOverride}
    >
      <section className={styles.pairingsSection}>
        <span className={styles.sectionEyebrow}>{t('typography.pairingsHeading')}</span>
        <div className={styles.pairingGrid}>
          {pairings.map((p) => (
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
                  style={{ fontFamily: p.heading, fontWeight: p.weights.heading }}
                >
                  {t('typography.pairingHeading')}
                </div>
                <div
                  className={styles.pairingBody}
                  style={{ fontFamily: p.body, fontWeight: p.weights.body }}
                >
                  {t('typography.pairingBody')}
                </div>
              </div>
            </PresetCard>
          ))}
        </div>
      </section>

      <aside className={clsx(styles.dock, dockOpen && styles.dockOpen)}>
        <button
          type="button"
          className={styles.dockHandle}
          onClick={() => setDockOpen((v) => !v)}
          aria-expanded={dockOpen}
        >
          <span className={styles.dockLabel}>
            {dockOpen ? t('typography.dockToggleClose') : t('typography.dockToggleOpen')}
          </span>
          <span className={clsx(styles.dockChevron, dockOpen && styles.dockChevronOpen)} aria-hidden>
            ▲
          </span>
        </button>
        <div className={styles.dockContent} aria-hidden={!dockOpen}>
          <div className={styles.dockInner}>
            <div className={styles.dockBody}>
              <div className={styles.controlRow}>
                <span className={styles.controlLabel}>{t('typography.baseSize')}</span>
                <div className={styles.seg}>
                  {BASE_SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={clsx(styles.segBtn, baseSize === s && styles.segBtnActive)}
                      onClick={() => set({ baseSize: s })}
                    >
                      {s}px
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.controlRow}>
                <span className={styles.controlLabel}>{t('typography.ratio')}</span>
                <div className={styles.seg}>
                  {RATIOS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={clsx(styles.segBtn, ratio === r && styles.segBtnActive)}
                      onClick={() => set({ ratio: r })}
                    >
                      <span className={styles.segPrimary}>{r}</span>
                      <span className={styles.segSecondary}>{ratioName(r)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.livePreview}>
                <span className={styles.previewEyebrow}>{t('typography.livePreview')}</span>
                <div className={styles.previewCanvas}>
                  <div
                    className={styles.previewHeading}
                    style={{
                      fontFamily: pairing.heading,
                      fontSize: previewTokens.sizes['2xl'],
                      fontWeight: pairing.weights.heading,
                      lineHeight: previewTokens.lineHeights.tight,
                    }}
                  >
                    {t('typography.sampleHeading')}
                  </div>
                  <div
                    className={styles.previewBody}
                    style={{
                      fontFamily: pairing.body,
                      fontSize: previewTokens.sizes.base,
                      fontWeight: pairing.weights.body,
                      lineHeight: previewTokens.lineHeights.normal,
                    }}
                  >
                    {t('typography.sampleBody')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </StepLayout>
  );
}
