import { useDesignStore } from '../store/designStore';
import { PresetCard } from '../components/PresetCard';
import { StepLayout } from '../components/StepLayout';
import { buildRadiusScale } from '../lib/radiusScale';
import { useT } from '../i18n';
import type { RadiusInput } from '../types/design';
import styles from './RadiusStep.module.css';

type PreviewKind =
  | 'tabs'
  | 'form'
  | 'list'
  | 'productCard'
  | 'dialog'
  | 'chips'
  | 'search'
  | 'uniformGrid'
  | 'asymHero';

const PRESETS: Array<{
  id: string;
  label: string;
  descriptionKey: string;
  input: RadiusInput;
  kind: PreviewKind;
}> = [
  { id: 'sharp', label: 'Sharp', descriptionKey: 'radius.desc.sharp', input: { base: 0, scale: 'uniform' }, kind: 'tabs' },
  { id: 'whisper', label: 'Whisper', descriptionKey: 'radius.desc.whisper', input: { base: 2, scale: 'scaled' }, kind: 'form' },
  { id: 'subtle', label: 'Subtle', descriptionKey: 'radius.desc.subtle', input: { base: 4, scale: 'scaled' }, kind: 'list' },
  { id: 'soft', label: 'Soft', descriptionKey: 'radius.desc.soft', input: { base: 8, scale: 'scaled' }, kind: 'productCard' },
  { id: 'rounded', label: 'Rounded', descriptionKey: 'radius.desc.rounded', input: { base: 12, scale: 'scaled' }, kind: 'dialog' },
  { id: 'pill', label: 'Pill-like', descriptionKey: 'radius.desc.pill', input: { base: 16, scale: 'scaled' }, kind: 'chips' },
  { id: 'capsule', label: 'Capsule', descriptionKey: 'radius.desc.capsule', input: { base: 24, scale: 'scaled' }, kind: 'search' },
  { id: 'uniform-soft', label: 'Soft uniform', descriptionKey: 'radius.desc.uniformSoft', input: { base: 8, scale: 'uniform' }, kind: 'uniformGrid' },
  { id: 'asymmetric', label: 'Asymmetric', descriptionKey: 'radius.desc.asymmetric', input: { base: 12, scale: 'asymmetric' }, kind: 'asymHero' },
];

function sameRadius(a: RadiusInput | null, b: RadiusInput): boolean {
  if (!a) return false;
  return a.base === b.base && a.scale === b.scale;
}

function RadiusPreview({ input, kind }: { input: RadiusInput; kind: PreviewKind }) {
  const tokens = buildRadiusScale(input);
  const style = {
    '--_btn': tokens.components.button,
    '--_input': tokens.components.input,
    '--_card': tokens.components.card,
    '--_badge': tokens.components.badge,
    '--_sm': tokens.tokens.sm,
    '--_md': tokens.tokens.md,
    '--_lg': tokens.tokens.lg,
    '--_xl': tokens.tokens.xl,
  } as React.CSSProperties;

  return (
    <div className={styles.preview} style={style}>
      {renderVariant(kind)}
    </div>
  );
}

function renderVariant(kind: PreviewKind) {
  switch (kind) {
    case 'tabs': return <TabsVariant />;
    case 'form': return <FormVariant />;
    case 'list': return <ListVariant />;
    case 'productCard': return <ProductCardVariant />;
    case 'dialog': return <DialogVariant />;
    case 'chips': return <ChipsVariant />;
    case 'search': return <SearchVariant />;
    case 'uniformGrid': return <UniformGridVariant />;
    case 'asymHero': return <AsymHeroVariant />;
  }
}

function TabsVariant() {
  return (
    <div className={styles.tabs}>
      <div className={styles.tabBar}>
        <span className={`${styles.tab} ${styles.tabActive}`}>Overview</span>
        <span className={styles.tab}>Tokens</span>
        <span className={styles.tab}>Code</span>
      </div>
      <div className={styles.tabPane}>
        <div className={styles.tabRow} />
        <div className={styles.tabRow} />
        <div className={styles.tabRow} />
      </div>
    </div>
  );
}

function FormVariant() {
  return (
    <div className={styles.form}>
      <span className={styles.fieldLabel}>Email</span>
      <input className={styles.input} placeholder="you@studio.com" readOnly />
      <span className={styles.fieldLabel}>Project</span>
      <input className={styles.input} placeholder="Untitled" readOnly />
      <button className={styles.btn}>Continue</button>
    </div>
  );
}

function ListVariant() {
  const rows: Array<[string, string]> = [
    ['Anna', 'Pushed 3 commits'],
    ['Bear', 'Opened pull request'],
    ['Iris', 'Approved review'],
  ];
  return (
    <div className={styles.list}>
      {rows.map(([who, what]) => (
        <div key={who} className={styles.listRow}>
          <span className={styles.avatar} />
          <span className={styles.listText}>
            <span className={styles.listWho}>{who}</span>
            <span className={styles.listWhat}>{what}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function ProductCardVariant() {
  return (
    <div className={styles.productCard}>
      <div className={styles.productImage} />
      <div className={styles.productMeta}>
        <span className={styles.productTitle}>Atlas runner</span>
        <span className={styles.productPrice}>$148</span>
      </div>
      <button className={styles.btn}>Add to bag</button>
    </div>
  );
}

function DialogVariant() {
  return (
    <div className={styles.dialog}>
      <span className={styles.dialogTitle}>Delete project?</span>
      <span className={styles.dialogBody}>This action cannot be undone.</span>
      <div className={styles.dialogActions}>
        <button className={styles.btnGhost}>Cancel</button>
        <button className={styles.btn}>Delete</button>
      </div>
    </div>
  );
}

function ChipsVariant() {
  return (
    <div className={styles.chips}>
      <div className={styles.chipRow}>
        <span className={styles.chip}>Design</span>
        <span className={`${styles.chip} ${styles.chipOn}`}>Prototype</span>
        <span className={styles.chip}>Research</span>
      </div>
      <div className={styles.chipRow}>
        <button className={styles.btn}>Confirm</button>
        <button className={styles.btnGhost}>Cancel</button>
      </div>
    </div>
  );
}

function SearchVariant() {
  return (
    <div className={styles.search}>
      <div className={styles.searchBar}>
        <span className={styles.searchIcon} aria-hidden>⌕</span>
        <span className={styles.searchPlaceholder}>Search docs…</span>
        <span className={styles.searchKbd}>⌘K</span>
      </div>
      <div className={styles.chipRow}>
        <span className={styles.chip}>Recent</span>
        <span className={styles.chip}>Tokens</span>
        <span className={styles.chip}>Color</span>
      </div>
    </div>
  );
}

function UniformGridVariant() {
  return (
    <div className={styles.uniformGrid}>
      <span className={styles.uniformItem}>Card</span>
      <span className={styles.uniformItem}>Input</span>
      <span className={styles.uniformItem}>Button</span>
      <span className={styles.uniformItem}>Tile</span>
    </div>
  );
}

function AsymHeroVariant() {
  return (
    <div className={styles.asymCard}>
      <span className={styles.asymQuote}>“The diagonal cut is the signature.”</span>
      <span className={styles.asymBy}>— Studio note</span>
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
          <RadiusPreview input={p.input} kind={p.kind} />
        </PresetCard>
      ))}
    </StepLayout>
  );
}
