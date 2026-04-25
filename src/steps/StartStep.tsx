import { useDesignStore } from '../store/designStore';
import { useT } from '../i18n';
import styles from './StartStep.module.css';

const CHAIN_KEYS = [
  'start.chain.0',
  'start.chain.1',
  'start.chain.2',
  'start.chain.3',
  'start.chain.4',
];

export function StartStep() {
  const setStep = useDesignStore((s) => s.setStep);
  const t = useT();

  function onBegin() {
    setStep('typography');
  }

  return (
    <div className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.brand}>pre-design-md</div>
          <h1 className={styles.title}>
            <span className={styles.titleMain}>{t('start.heroA')}</span>
            <span className={styles.titleSub}>{t('start.heroB')}</span>
          </h1>

          <div className={styles.chainWrap}>
            <span className={styles.chainPrefix}>{t('start.chainPrefix')}</span>
            <span className={styles.chainRotator}>
              {CHAIN_KEYS.map((k, i) => (
                <span
                  key={k}
                  className={styles.chainWord}
                  style={{ animationDelay: `${i * 2}s` }}
                >
                  {t(k)}
                </span>
              ))}
            </span>
          </div>

          <div className={styles.ctas}>
            <button type="button" className={styles.primaryCta} onClick={onBegin}>
              {t('start.startBtn')} →
            </button>
          </div>
        </div>

        <a href="#info" className={styles.scrollHint} aria-label="Scroll">
          <span>{t('start.scrollHint')}</span>
        </a>
      </section>

      <section id="info" className={styles.info}>
        <header className={styles.infoHeader}>
          <span className={styles.infoEyebrow}>{t('start.info.eyebrow')}</span>
          <h2 className={styles.infoTitle}>{t('start.info.title')}</h2>
        </header>

        <div className={styles.infoGrid}>
          <article className={styles.infoCard}>
            <span className={styles.infoCardNum}>{t('start.info.whyLabel')}</span>
            <h3 className={styles.infoCardTitle}>{t('start.info.whyTitle')}</h3>
            <p className={styles.infoCardBody}>{t('start.info.whyBody')}</p>
          </article>
          <article className={styles.infoCard}>
            <span className={styles.infoCardNum}>{t('start.info.doLabel')}</span>
            <h3 className={styles.infoCardTitle}>{t('start.info.doTitle')}</h3>
            <p className={styles.infoCardBody}>{t('start.info.doBody')}</p>
          </article>
          <article className={styles.infoCard}>
            <span className={styles.infoCardNum}>{t('start.info.getLabel')}</span>
            <h3 className={styles.infoCardTitle}>{t('start.info.getTitle')}</h3>
            <p className={styles.infoCardBody}>{t('start.info.getBody')}</p>
          </article>
        </div>

        <div className={styles.infoCta}>
          <h3 className={styles.infoCtaTitle}>{t('start.info.ctaTitle')}</h3>
          <p className={styles.infoCtaBody}>{t('start.info.ctaBody')}</p>
          <button type="button" className={styles.primaryCta} onClick={onBegin}>
            {t('start.startBtn')} →
          </button>
        </div>
      </section>
    </div>
  );
}
