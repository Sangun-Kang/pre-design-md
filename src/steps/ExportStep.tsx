import { useMemo, useState, type ReactNode } from 'react';
import { StepLayout } from '../components/StepLayout';
import { Tabs } from '../components/Tabs';
import { Alert } from '../components/ui/Alert';
import { useDesignStore, selectDecisions } from '../store/designStore';
import {
  buildGoogleSpec,
  buildRichPrompt,
  buildCssVariables,
  buildFigmaTokens,
  type OutputFormat,
} from '../lib/build';
import { DECISION_STEPS } from '../types/design';
import { useT } from '../i18n';
import styles from './ExportStep.module.css';

interface TabDef {
  id: OutputFormat;
  labelKey: string;
  hintKey: string;
  usageKey: string;
  build: (d: Parameters<typeof buildGoogleSpec>[0]) => string;
  downloadName: string;
  mime: string;
}

const TABS: TabDef[] = [
  {
    id: 'google-spec',
    labelKey: 'export.tab.googleSpec.label',
    hintKey: 'export.tab.googleSpec.hint',
    usageKey: 'export.usage.googleSpec',
    build: buildGoogleSpec,
    downloadName: 'DESIGN.md',
    mime: 'text/markdown',
  },
  {
    id: 'rich-prompt',
    labelKey: 'export.tab.richPrompt.label',
    hintKey: 'export.tab.richPrompt.hint',
    usageKey: 'export.usage.richPrompt',
    build: buildRichPrompt,
    downloadName: 'DESIGN.md',
    mime: 'text/markdown',
  },
  {
    id: 'css-vars',
    labelKey: 'export.tab.cssVars.label',
    hintKey: 'export.tab.cssVars.hint',
    usageKey: 'export.usage.cssVars',
    build: buildCssVariables,
    downloadName: 'design-tokens.css',
    mime: 'text/css',
  },
  {
    id: 'figma-tokens',
    labelKey: 'export.tab.figmaTokens.label',
    hintKey: 'export.tab.figmaTokens.hint',
    usageKey: 'export.usage.figmaTokens',
    build: buildFigmaTokens,
    downloadName: 'design-tokens.json',
    mime: 'application/json',
  },
];

export function ExportStep() {
  const decisions = useDesignStore(selectDecisions);
  const [activeId, setActiveId] = useState<OutputFormat>('google-spec');
  const [copied, setCopied] = useState(false);
  const t = useT();

  // Pre-compute all formats so switching tabs is instant.
  const outputs = useMemo<Record<OutputFormat, string>>(
    () => ({
      'google-spec': buildGoogleSpec(decisions),
      'rich-prompt': buildRichPrompt(decisions),
      'css-vars': buildCssVariables(decisions),
      'figma-tokens': buildFigmaTokens(decisions),
    }),
    [decisions],
  );

  const activeTab = TABS.find((x) => x.id === activeId)!;
  const activeOutput = outputs[activeId];

  const missing = DECISION_STEPS.filter((s) => decisions[s] == null);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(activeOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function onDownload() {
    const blob = new Blob([activeOutput], { type: `${activeTab.mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeTab.downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Reset "copied" state when switching tabs to avoid stale "Copied ✓".
  function selectTab(id: OutputFormat) {
    setActiveId(id);
    setCopied(false);
  }

  const undecidedStr = t('decisions.undecided');

  return (
    <StepLayout
      eyebrow={t('export.eyebrow')}
      title={t('export.title')}
      description={t('export.description')}
      nextLabel={t('common.restart')}
      canProceed
      onNext={() => window.location.reload()}
      cardsClassName={styles.body}
    >
      {missing.length > 0 && (
        <Alert tone="warning" title={t('export.incompleteTitle')}>
          {t('export.incompleteBody', { missing: missing.join(', ') })}
        </Alert>
      )}

      <section className={styles.summary}>
        <h2 className={styles.sectionTitle}>{t('export.summaryTitle')}</h2>
        <dl className={styles.dl}>
          <Entry label="Typography">
            {decisions.typography
              ? `${decisions.typography.baseSize}px / ratio ${decisions.typography.ratio} / ${decisions.typography.pairingId}`
              : undecidedStr}
          </Entry>
          <Entry label="Spacing">
            {decisions.spacing
              ? `${decisions.spacing.baseUnit}px / ${decisions.spacing.scale}`
              : undecidedStr}
          </Entry>
          <Entry label="Radius">
            {decisions.radius
              ? `${decisions.radius.base}px / ${decisions.radius.scale}`
              : undecidedStr}
          </Entry>
          <Entry label="Shadow">
            {decisions.shadow
              ? `${decisions.shadow.intensity}${decisions.shadow.tintedPreferred ? ' / tinted' : ''}`
              : undecidedStr}
          </Entry>
          <Entry label="Color">
            {decisions.color
              ? `hue ${Math.round(decisions.color.primaryHue)}° / ${decisions.color.chroma} / ${decisions.color.neutralStyle}${decisions.color.supportsDark ? ' / dark' : ''}`
              : undecidedStr}
          </Entry>
        </dl>
      </section>

      <section className={styles.tabsBlock}>
        <Tabs
          items={TABS.map((tab) => ({ id: tab.id, label: t(tab.labelKey) }))}
          activeId={activeId}
          onChange={selectTab}
          idPrefix="export"
          ariaLabel={t('export.title')}
        />
        <p className={styles.tabHint}>{t(activeTab.hintKey)}</p>

        <div className={styles.outputHead}>
          <button
            type="button"
            className={styles.downloadBtn}
            onClick={onDownload}
            title={activeTab.downloadName}
          >
            {t('export.downloadBtn', { name: activeTab.downloadName })}
          </button>
          <button type="button" className={styles.copyBtn} onClick={onCopy}>
            {copied ? t('export.copied') : t('export.copyBtn')}
          </button>
        </div>
        <textarea
          key={activeId}
          readOnly
          value={activeOutput}
          className={styles.textarea}
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          rows={20}
        />
      </section>

      <section className={styles.usage}>
        <h2 className={styles.sectionTitle}>{t('export.usageTitle')}</h2>
        <ul className={styles.usageList}>
          {TABS.map((tab) => (
            <li key={tab.id}>
              <Markdown>{t(tab.usageKey)}</Markdown>
            </li>
          ))}
        </ul>
        <p className={styles.usageNote}>
          <Markdown>{t('export.usageNote')}</Markdown>
        </p>
      </section>
    </StepLayout>
  );
}

function Entry({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.entry}>
      <dt className={styles.entryLabel}>{label}</dt>
      <dd className={styles.entryValue}>{children}</dd>
    </div>
  );
}

/**
 * Minimal inline markdown renderer — handles **bold**, *italic*, and `code`,
 * which is all we use in usage strings. Keeps the i18n files plain text
 * without needing a markdown library.
 */
function Markdown({ children }: { children: string }) {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let key = 0;
  for (const m of children.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) parts.push(children.slice(last, idx));
    const raw = m[0];
    if (raw.startsWith('**')) {
      parts.push(<strong key={key++}>{raw.slice(2, -2)}</strong>);
    } else if (raw.startsWith('*')) {
      parts.push(<em key={key++}>{raw.slice(1, -1)}</em>);
    } else {
      parts.push(<code key={key++}>{raw.slice(1, -1)}</code>);
    }
    last = idx + raw.length;
  }
  if (last < children.length) parts.push(children.slice(last));
  return <>{parts}</>;
}
