import { useState } from 'react';
import { StepLayout } from '../components/StepLayout';
import { Tabs } from '../components/Tabs';
import { ComponentSampler } from '../preview/ComponentSampler';
import { LandingSection } from '../preview/LandingSection';
import { useT } from '../i18n';
import styles from './PreviewStep.module.css';

type TabId = 'sampler' | 'landing';

export function PreviewStep() {
  const t = useT();
  const [activeId, setActiveId] = useState<TabId>('sampler');

  const tabs = [
    { id: 'sampler' as const, label: t('preview.sectionSampler') },
    { id: 'landing' as const, label: t('preview.sectionLanding') },
  ];

  return (
    <StepLayout
      eyebrow={t('preview.eyebrow')}
      title={t('preview.title')}
      description={t('preview.description')}
      canProceed={true}
      cardsClassName={styles.body}
    >
      <div className={styles.banner} role="note">
        <span className={styles.bannerDot} aria-hidden />
        <span>{t('preview.banner.tokensApplied')}</span>
      </div>

      <Tabs
        items={tabs}
        activeId={activeId}
        onChange={setActiveId}
        idPrefix="preview"
        ariaLabel={t('preview.title')}
      />

      <section
        role="tabpanel"
        id={`preview-panel-${activeId}`}
        aria-labelledby={`preview-tab-${activeId}`}
        className={styles.panel}
      >
        {activeId === 'sampler' ? <ComponentSampler /> : <LandingSection />}
      </section>
    </StepLayout>
  );
}
