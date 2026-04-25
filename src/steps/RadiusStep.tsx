import { useDesignStore } from '../store/designStore';
import { PresetCard } from '../components/PresetCard';
import { StepLayout } from '../components/StepLayout';
import { buildRadiusScale } from '../lib/radiusScale';
import { useT } from '../i18n';
import type { RadiusInput } from '../types/design';
import styles from './RadiusStep.module.css';

const PRESETS: Array<{
  id: string;
  label: string;
  descriptionKey: string;
  input: RadiusInput;
}> = [
  { id: 'sharp', label: 'Sharp', descriptionKey: 'radius.desc.sharp', input: { base: 0, scale: 'uniform' } },
  { id: 'whisper', label: 'Whisper', descriptionKey: 'radius.desc.whisper', input: { base: 2, scale: 'scaled' } },
  { id: 'subtle', label: 'Subtle', descriptionKey: 'radius.desc.subtle', input: { base: 4, scale: 'scaled' } },
  { id: 'soft', label: 'Soft', descriptionKey: 'radius.desc.soft', input: { base: 8, scale: 'scaled' } },
  { id: 'rounded', label: 'Rounded', descriptionKey: 'radius.desc.rounded', input: { base: 12, scale: 'scaled' } },
  { id: 'pill', label: 'Pill-like', descriptionKey: 'radius.desc.pill', input: { base: 16, scale: 'scaled' } },
  { id: 'capsule', label: 'Capsule', descriptionKey: 'radius.desc.capsule', input: { base: 24, scale: 'scaled' } },
  { id: 'uniform-soft', label: 'Soft uniform', descriptionKey: 'radius.desc.uniformSoft', input: { base: 8, scale: 'uniform' } },
];

function sameRadius(a: RadiusInput | null, b: RadiusInput): boolean {
  if (!a) return false;
  return a.base === b.base && a.scale === b.scale;
}

function RadiusPreview({ input }: { input: RadiusInput }) {
  const tokens = buildRadiusScale(input);
  const style = {
    '--_btn': tokens.components.button,
    '--_input': tokens.components.input,
    '--_card': tokens.components.card,
    '--_badge': tokens.components.badge,
  } as React.CSSProperties;

  return (
    <div className={styles.preview} style={style}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span>Card</span>
          <span className={styles.badge}>NEW</span>
        </div>
        <input className={styles.input} placeholder="Input" readOnly />
        <button className={styles.btn}>Action</button>
      </div>
    </div>
  );
}

export function RadiusStep() {
  const radius = useDesignStore((s) => s.radius);
  const updateRadius = useDesignStore((s) => s.updateRadius);
  const t = useT();

  return (
    <StepLayout
      eyebrow={t('radius.eyebrow')}
      title={t('radius.title')}
      description={t('radius.description')}
      canProceed={radius != null}
      cardsClassName={styles.bodyOverride}
    >
      {PRESETS.map((p) => (
        <PresetCard
          key={p.id}
          selected={sameRadius(radius, p.input)}
          label={p.label}
          description={t(p.descriptionKey)}
          onClick={() => updateRadius(p.input)}
          flush
        >
          <RadiusPreview input={p.input} />
        </PresetCard>
      ))}
    </StepLayout>
  );
}
