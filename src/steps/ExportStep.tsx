import { useMemo, useState, type ReactNode } from 'react';
import { StepLayout } from '../components/StepLayout';
import { Alert } from '../components/ui/Alert';
import { useDesignStore, selectDecisions } from '../store/designStore';
import { buildDesignPrompt } from '../lib/buildPrompt';
import { DECISION_STEPS } from '../types/design';
import { useT } from '../i18n';
import styles from './ExportStep.module.css';

export function ExportStep() {
  const decisions = useDesignStore(selectDecisions);
  const [copied, setCopied] = useState(false);
  const t = useT();

  const prompt = useMemo(() => buildDesignPrompt(decisions), [decisions]);
  const missing = DECISION_STEPS.filter((s) => decisions[s] == null);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
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

      <section className={styles.promptSection}>
        <div className={styles.promptHead}>
          <h2 className={styles.sectionTitle}>{t('export.promptTitle')}</h2>
          <button type="button" className={styles.copyBtn} onClick={onCopy}>
            {copied ? t('export.copied') : t('export.copyBtn')}
          </button>
        </div>
        <textarea
          readOnly
          value={prompt}
          className={styles.textarea}
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          rows={18}
        />
      </section>

      <section className={styles.usage}>
        <h2 className={styles.sectionTitle}>{t('export.usageTitle')}</h2>
        <ol className={styles.steps}>
          <li>
            <Markdown>{t('export.usage.1')}</Markdown>
          </li>
          <li>
            <Markdown>{t('export.usage.2')}</Markdown>
          </li>
          <li>
            <Markdown>{t('export.usage.3')}</Markdown>
          </li>
        </ol>
      </section>
    </StepLayout>
  );
}

function Entry({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.entry}>
      <dt className={styles.entryLabel}>{label}</dt>
      <dd className={styles.entryValue}>{children}</dd>
    </div>
  );
}

/**
 * Minimal inline markdown renderer — only handles **bold** and `code`, which is
 * all we use in usage strings. Keeps the i18n files plain text without needing
 * a markdown library.
 */
function Markdown({ children }: { children: string }) {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let key = 0;
  for (const m of children.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) parts.push(children.slice(last, idx));
    const raw = m[0];
    if (raw.startsWith('**')) {
      parts.push(<strong key={key++}>{raw.slice(2, -2)}</strong>);
    } else {
      parts.push(<code key={key++}>{raw.slice(1, -1)}</code>);
    }
    last = idx + raw.length;
  }
  if (last < children.length) parts.push(children.slice(last));
  return <>{parts}</>;
}
