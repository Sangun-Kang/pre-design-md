import { StepLayout } from '../components/StepLayout';
import { ComponentSampler } from '../preview/ComponentSampler';
import { LandingSection } from '../preview/LandingSection';
import { useT } from '../i18n';
import styles from './PreviewStep.module.css';

export function PreviewStep() {
  const t = useT();
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

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('preview.sectionSampler')}</h2>
        <ComponentSampler />
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('preview.sectionLanding')}</h2>
        <LandingSection />
      </section>
    </StepLayout>
  );
}
