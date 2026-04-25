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
  ColorCategory,
  ColorInput,
  NeutralStyle,
  Scale11,
  Step11,
} from '../types/design';
import { COLOR_CATEGORIES_PRIMARY, SCALE_STEPS } from '../types/design';
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
  category: 'hue-based',
  primaryHue: 235,
  chroma: 'balanced',
  neutralStyle: 'pure',
  supportsDark: false,
  warmth: 0.3,
  accentHue: 280,
};

type T = ReturnType<typeof useT>;

function Swatches({
  scale,
  label,
  hint,
}: {
  scale: Scale11;
  label: string;
  hint?: string;
}) {
  return (
    <div className={styles.swatchRow}>
      <div className={styles.swatchHead}>
        <span className={styles.swatchLabel}>{label}</span>
        {hint && <span className={styles.swatchHint}>{hint}</span>}
      </div>
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

  function selectCategory(category: ColorCategory) {
    const next: ColorInput = { ...current, category };
    if (category === 'neon-on-dark') next.supportsDark = true;
    updateColor(next);
  }

  const palette = buildColorPalette(current);

  // Each category card shows a peek of its primary-500 — preserve the user's
  // current tunables so the swatch reflects what they'd actually get.
  function categorySwatch(cat: ColorCategory): string {
    const peek: ColorInput = { ...current, category: cat };
    if (cat === 'neon-on-dark') peek.supportsDark = true;
    return buildColorPalette(peek).primary['500'];
  }

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
          <h2 className={styles.sectionTitle}>{t('color.approach')}</h2>
          <div className={styles.categoryGrid}>
            {COLOR_CATEGORIES_PRIMARY.map((cat) => (
              <CategoryCard
                key={cat}
                category={cat}
                active={current.category === cat}
                swatch={categorySwatch(cat)}
                onClick={() => selectCategory(cat)}
                t={t}
              />
            ))}
          </div>
        </section>

        <CategoryControls current={current} set={set} t={t} />
      </div>

      <div className={styles.preview}>
        <Swatches
          scale={palette.primary}
          label="primary"
          hint={t('color.derived.primary')}
        />
        <Swatches
          scale={palette.neutral}
          label="neutral"
          hint={t('color.derived.neutral')}
        />

        <div className={styles.semanticBlock}>
          <div className={styles.swatchHead}>
            <span className={styles.swatchLabel}>semantic</span>
            <span className={styles.swatchHint}>{t('color.derived.semantic')}</span>
          </div>
          <div className={styles.semanticRow}>
            {(Object.entries(palette.semantic) as Array<[string, string]>).map(([k, v]) => (
              <div key={k} className={styles.semantic}>
                <div className={styles.semanticSwatch} style={{ background: v }} />
                <span className={styles.semanticLabel}>{k}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.uiSampleBlock}>
          <div className={styles.swatchHead}>
            <span className={styles.swatchLabel}>components</span>
            <span className={styles.swatchHint}>{t('color.derived.sample')}</span>
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
              Semantic colors adapt to the chosen category.
            </Alert>
          </div>
        </div>
      </div>
    </StepLayout>
  );
}

function CategoryCard({
  category,
  active,
  swatch,
  onClick,
  t,
}: {
  category: ColorCategory;
  active: boolean;
  swatch: string;
  onClick: () => void;
  t: T;
}) {
  return (
    <button
      type="button"
      className={clsx(styles.categoryCard, active && styles.categoryCardActive)}
      onClick={onClick}
    >
      <span className={styles.categorySwatch} style={{ background: swatch }} />
      <span className={styles.categoryText}>
        <span className={styles.categoryLabel}>{t(`color.category.${category}.label`)}</span>
        <span className={styles.categoryDesc}>{t(`color.category.${category}.desc`)}</span>
      </span>
    </button>
  );
}

function CategoryControls({
  current,
  set,
  t,
}: {
  current: ColorInput;
  set: <K extends keyof ColorInput>(k: K, v: ColorInput[K]) => void;
  t: T;
}) {
  const cat = current.category;
  return (
    <>
      {cat === 'hue-based' && (
        <HueControl
          label={t('color.primaryHue')}
          value={current.primaryHue}
          onChange={(v) => set('primaryHue', v)}
        />
      )}
      {(cat === 'grayscale-accent' || cat === 'neon-on-dark') && (
        <HueControl
          label={t('color.accentHue')}
          value={current.accentHue}
          onChange={(v) => set('accentHue', v)}
        />
      )}
      {cat === 'hue-based' && (
        <>
          <ChipsSection
            title={t('color.chroma')}
            options={['muted', 'balanced', 'vivid'] as ChromaLevel[]}
            value={current.chroma}
            onChange={(v) => set('chroma', v)}
          />
          <ChipsSection
            title={t('color.neutralStyle')}
            options={['pure', 'warm', 'cool', 'tinted'] as NeutralStyle[]}
            value={current.neutralStyle}
            onChange={(v) => set('neutralStyle', v)}
          />
        </>
      )}
      {cat === 'mono' && (
        <WarmthSlider value={current.warmth} onChange={(v) => set('warmth', v)} t={t} />
      )}
      <DarkToggle
        value={current.supportsDark}
        forced={cat === 'neon-on-dark'}
        onChange={(v) => set('supportsDark', v)}
        t={t}
      />
    </>
  );
}

function HueControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{label}</h2>
      <div className={styles.hueRow}>
        {HUE_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            aria-label={p.label}
            onClick={() => onChange(p.hue)}
            className={clsx(
              styles.hueChip,
              Math.abs(value - p.hue) < 2 && styles.hueChipSelected,
            )}
            style={{ background: `oklch(62% 0.17 ${p.hue})` }}
            title={`${p.label} — ${p.hue}°`}
          />
        ))}
      </div>
      <label className={styles.sliderLabel}>
        <span>
          {Math.round(value)}° ({hueBucketName(value)})
        </span>
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={styles.slider}
        />
      </label>
    </section>
  );
}

function ChipsSection<O extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: O[];
  value: O;
  onChange: (v: O) => void;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.chipGroup}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={clsx(styles.chipBtn, value === opt && styles.chipBtnActive)}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </section>
  );
}

function WarmthSlider({
  value,
  onChange,
  t,
}: {
  value: number;
  onChange: (v: number) => void;
  t: T;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('color.warmth')}</h2>
      <label className={styles.sliderLabel}>
        <span className={styles.warmthLabels}>
          <span>{t('color.warmth.cool')}</span>
          <span>{value.toFixed(2)}</span>
          <span>{t('color.warmth.warm')}</span>
        </span>
        <input
          type="range"
          min={-1}
          max={1}
          step={0.05}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={styles.slider}
        />
      </label>
    </section>
  );
}

function DarkToggle({
  value,
  forced,
  onChange,
  t,
}: {
  value: boolean;
  forced: boolean;
  onChange: (v: boolean) => void;
  t: T;
}) {
  return (
    <section className={styles.section}>
      <label className={clsx(styles.toggleRow, forced && styles.toggleRowDisabled)}>
        <input
          type="checkbox"
          checked={value}
          disabled={forced}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>
          <strong>{t('color.darkMode')}</strong>
          <span className={styles.muted}>
            {forced ? t('color.darkForcedHint') : t('color.darkModeHint')}
          </span>
        </span>
      </label>
    </section>
  );
}
