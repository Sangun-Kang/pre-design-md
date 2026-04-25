import clsx from 'clsx';
import { useDesignStore } from '../store/designStore';
import { PresetCard } from '../components/PresetCard';
import { StepLayout } from '../components/StepLayout';
import { buildShadowTokens } from '../lib/shadowTokens';
import { useT } from '../i18n';
import type { ShadowInput, ShadowIntensity } from '../types/design';
import styles from './ShadowStep.module.css';

const PRESETS: Array<{
  id: ShadowIntensity;
  label: string;
  description: string;
}> = [
  { id: 'none', label: 'Flat', description: 'no shadow — UI-chrome light' },
  { id: 'subtle', label: 'Subtle', description: 'quiet hint, barely there' },
  { id: 'medium', label: 'Medium', description: 'Material-adjacent, clear layers' },
  { id: 'strong', label: 'Strong', description: 'dramatic, marketing-ready depth' },
];

function ShadowPreview({ intensity, tinted, hue }: { intensity: ShadowIntensity; tinted: boolean; hue: number }) {
  const tokens = buildShadowTokens({ intensity, tintedPreferred: tinted, primaryHue: hue });
  const LEVELS: Array<keyof typeof tokens.tokens> = ['sm', 'md', 'lg', 'xl'];

  return (
    <div className={styles.preview}>
      <div className={styles.stage}>
        {LEVELS.map((lvl) => (
          <div key={lvl} className={styles.card} style={{ boxShadow: tokens.tokens[lvl] }}>
            <span className={styles.cardLabel}>{lvl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ShadowStep() {
  const shadow = useDesignStore((s) => s.shadow);
  const color = useDesignStore((s) => s.color);
  const updateShadow = useDesignStore((s) => s.updateShadow);
  const t = useT();

  const tinted = shadow?.tintedPreferred ?? false;
  const hue = color?.primaryHue ?? 250;

  function select(intensity: ShadowIntensity) {
    updateShadow({ intensity, tintedPreferred: tinted });
  }

  function toggleTinted(next: boolean) {
    const current: ShadowInput = shadow ?? { intensity: 'medium', tintedPreferred: false };
    updateShadow({ ...current, tintedPreferred: next });
  }

  return (
    <StepLayout
      eyebrow={t('shadow.eyebrow')}
      title={t('shadow.title')}
      description={t('shadow.description')}
      canProceed={shadow != null}
      cardsClassName={styles.bodyOverride}
    >
      <div className={styles.presetGrid}>
        {PRESETS.map((p) => (
          <PresetCard
            key={p.id}
            selected={shadow?.intensity === p.id}
            label={p.label}
            description={p.description}
            onClick={() => select(p.id)}
            flush
          >
            <ShadowPreview intensity={p.id} tinted={tinted} hue={hue} />
          </PresetCard>
        ))}
      </div>

      <div className={styles.tintedRow}>
        <label className={styles.tintedLabel}>
          <input
            type="checkbox"
            className={styles.tintedInput}
            checked={tinted}
            onChange={(e) => toggleTinted(e.target.checked)}
          />
          <span className={clsx(styles.tintedBox, tinted && styles.tintedBoxActive)} aria-hidden />
          <span className={styles.tintedText}>
            <span className={styles.tintedTitle}>{t('shadow.tintedTitle')}</span>
            <span className={styles.tintedHint}>{t('shadow.tintedHint')}</span>
          </span>
        </label>
      </div>
    </StepLayout>
  );
}
