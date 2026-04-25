import { useState } from 'react';
import clsx from 'clsx';
import { StepLayout } from '../components/StepLayout';
import { ComponentSampler } from '../preview/ComponentSampler';
import { LandingSection } from '../preview/LandingSection';
import { useT } from '../i18n';
import styles from './PreviewStep.module.css';

type TabId = 'sampler' | 'landing';

export function PreviewStep() {
  const t = useT();
  const [activeId, setActiveId] = useState<TabId>('sampler');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'sampler', label: t('preview.sectionSampler') },
    { id: 'landing', label: t('preview.sectionLanding') },
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

      <div className={styles.tabBar} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={activeId === tab.id}
            aria-controls={`preview-panel-${tab.id}`}
            id={`preview-tab-${tab.id}`}
            className={clsx(styles.tab, activeId === tab.id && styles.tabActive)}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

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
