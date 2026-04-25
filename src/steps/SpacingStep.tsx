import { useDesignStore } from '../store/designStore';
import { PresetCard } from '../components/PresetCard';
import { StepLayout } from '../components/StepLayout';
import { buildSpacingScale } from '../lib/spacingScale';
import { useT } from '../i18n';
import type { SpacingInput } from '../types/design';
import styles from './SpacingStep.module.css';

const PRESETS: Array<{
  id: string;
  label: string;
  description: string;
  input: SpacingInput;
}> = [
  {
    id: '4-linear',
    label: 'Tight grid',
    description: '4px · linear — dense data UI, precise rhythm',
    input: { baseUnit: 4, scale: 'linear' },
  },
  {
    id: '4-mult',
    label: 'Tight + dramatic',
    description: '4px · multiplicative — gaps expand dramatically',
    input: { baseUnit: 4, scale: 'multiplicative' },
  },
  {
    id: '8-linear',
    label: 'Standard web',
    description: '8px · linear — familiar, balanced rhythm',
    input: { baseUnit: 8, scale: 'linear' },
  },
  {
    id: '8-mult',
    label: 'Generous',
    description: '8px · multiplicative — marketing breathing room',
    input: { baseUnit: 8, scale: 'multiplicative' },
  },
  {
    id: '6-linear',
    label: 'Half-step',
    description: '6px · linear — uncommon grain, editorial apps',
    input: { baseUnit: 6, scale: 'linear' },
  },
  {
    id: '10-linear',
    label: 'Airy',
    description: '10px · linear — generous, confident, marketing-heavy',
    input: { baseUnit: 10, scale: 'linear' },
  },
];

function sameSpacing(a: SpacingInput | null, b: SpacingInput): boolean {
  if (!a) return false;
  return a.baseUnit === b.baseUnit && a.scale === b.scale;
}

function SpacingPreview({ input }: { input: SpacingInput }) {
  const tokens = buildSpacingScale(input);
  const style = {
    '--_card-pad': tokens.components.cardPadding,
    '--_stack': tokens.components.stackGap,
    '--_gap': tokens.tokens.md,
    '--_btn-x': tokens.components.buttonPaddingX,
    '--_btn-y': tokens.components.buttonPaddingY,
    '--_grid': `${input.baseUnit * 2}px`,
  } as React.CSSProperties;

  return (
    <div className={styles.preview} style={style}>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Card title</div>
        <div className={styles.cardBody}>Content inside the card</div>
        <div className={styles.actions}>
          <button className={styles.btn}>Action</button>
          <button className={styles.btnGhost}>Cancel</button>
        </div>
      </div>
      <ul className={styles.list}>
        <li className={styles.listItem}>Item one</li>
        <li className={styles.listItem}>Item two</li>
        <li className={styles.listItem}>Item three</li>
      </ul>
    </div>
  );
}

export function SpacingStep() {
  const spacing = useDesignStore((s) => s.spacing);
  const updateSpacing = useDesignStore((s) => s.updateSpacing);
  const t = useT();

  return (
    <StepLayout
      eyebrow={t('spacing.eyebrow')}
      title={t('spacing.title')}
      description={t('spacing.description')}
      canProceed={spacing != null}
      cardsClassName={styles.bodyOverride}
    >
      {PRESETS.map((p) => (
        <PresetCard
          key={p.id}
          selected={sameSpacing(spacing, p.input)}
          label={p.label}
          description={p.description}
          onClick={() => updateSpacing(p.input)}
          flush
        >
          <SpacingPreview input={p.input} />
        </PresetCard>
      ))}
    </StepLayout>
  );
}
