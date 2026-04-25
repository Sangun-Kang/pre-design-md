import clsx from 'clsx';
import { useDesignStore } from '../store/designStore';
import { StepLayout } from '../components/StepLayout';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { buildColorPalette, hueBucketName } from '../lib/colorPalette';
import { useT } from '../i18n';
import type {
  ChromaLevel,
  ColorInput,
  NeutralStyle,
  Scale11,
  Step11,
} from '../types/design';
import { SCALE_STEPS } from '../types/design';
import styles from './ColorStep.module.css';

const HUE_PRESETS: Array<{ label: string; hue: number }> = [
  { label: 'Red', hue: 25 },
  { label: 'Orange', hue: 45 },
  { label: 'Yellow', hue: 85 },
  { label: 'Green', hue: 140 },
  { label: 'Teal', hue: 180 },
  { label: 'Blue', hue: 235 },
  { label: 'Purple', hue: 280 },
  { label: 'Magenta', hue: 330 },
];

const DEFAULT: ColorInput = {
  primaryHue: 235,
  chroma: 'balanced',
  neutralStyle: 'pure',
  supportsDark: false,
};

function Swatches({ scale, label }: { scale: Scale11; label: string }) {
  return (
    <div className={styles.swatchRow}>
      <span className={styles.swatchLabel}>{label}</span>
      <div className={styles.swatches}>
        {SCALE_STEPS.map((step: Step11) => (
          <div key={step} className={styles.swatch} style={{ background: scale[step] }}>
            <span className={styles.swatchStep}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ColorStep() {
  const color = useDesignStore((s) => s.color);
  const updateColor = useDesignStore((s) => s.updateColor);
  const t = useT();
  const current: ColorInput = color ?? DEFAULT;

  function set<K extends keyof ColorInput>(key: K, value: ColorInput[K]) {
    updateColor({ ...current, [key]: value });
  }

  const palette = buildColorPalette(current);

  return (
    <StepLayout
      eyebrow={t('color.eyebrow')}
      title={t('color.title')}
      description={t('color.description')}
      canProceed={color != null}
      cardsClassName={styles.bodyOverride}
    >
      <div className={styles.controls}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('color.primaryHue')}</h2>
          <div className={styles.hueRow}>
            {HUE_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                aria-label={p.label}
                onClick={() => set('primaryHue', p.hue)}
                className={clsx(
                  styles.hueChip,
                  Math.abs(current.primaryHue - p.hue) < 2 && styles.hueChipSelected,
                )}
                style={{ background: `oklch(62% 0.17 ${p.hue})` }}
                title={`${p.label} — ${p.hue}°`}
              />
            ))}
          </div>
          <label className={styles.sliderLabel}>
            <span>
              {Math.round(current.primaryHue)}° ({hueBucketName(current.primaryHue)})
            </span>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={current.primaryHue}
              onChange={(e) => set('primaryHue', Number(e.target.value))}
              className={styles.slider}
            />
          </label>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('color.chroma')}</h2>
          <div className={styles.chipGroup}>
            {(['muted', 'balanced', 'vivid'] as ChromaLevel[]).map((c) => (
              <button
                key={c}
                type="button"
                className={clsx(styles.chipBtn, current.chroma === c && styles.chipBtnActive)}
                onClick={() => set('chroma', c)}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('color.neutralStyle')}</h2>
          <div className={styles.chipGroup}>
            {(['pure', 'warm', 'cool', 'tinted'] as NeutralStyle[]).map((s) => (
              <button
                key={s}
                type="button"
                className={clsx(styles.chipBtn, current.neutralStyle === s && styles.chipBtnActive)}
                onClick={() => set('neutralStyle', s)}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.toggleRow}>
            <input
              type="checkbox"
              checked={current.supportsDark}
              onChange={(e) => set('supportsDark', e.target.checked)}
            />
            <span>
              <strong>{t('color.darkMode')}</strong>
              <span className={styles.muted}>{t('color.darkModeHint')}</span>
            </span>
          </label>
        </section>
      </div>

      <div className={styles.preview}>
        <Swatches scale={palette.primary} label="primary" />
        <Swatches scale={palette.neutral} label="neutral" />

        <div className={styles.semanticRow}>
          {(Object.entries(palette.semantic) as Array<[string, string]>).map(([k, v]) => (
            <div key={k} className={styles.semantic}>
              <div className={styles.semanticSwatch} style={{ background: v }} />
              <span className={styles.semanticLabel}>{k}</span>
            </div>
          ))}
        </div>

        <div className={styles.uiSample}>
          <div className={styles.uiRow}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Delete</Button>
          </div>
          <div className={styles.uiRow}>
            <Badge tone="neutral">neutral</Badge>
            <Badge tone="info">info</Badge>
            <Badge tone="success">success</Badge>
            <Badge tone="warning">warning</Badge>
            <Badge tone="danger">danger</Badge>
          </div>
          <Alert tone="info" title="Info alert">
            Semantic colors adapt to your chroma level.
          </Alert>
        </div>
      </div>
    </StepLayout>
  );
}
