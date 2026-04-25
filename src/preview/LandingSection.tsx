import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { pickImage } from '../lib/imageFilter';
import { effectiveAccentHue } from '../lib/colorPalette';
import { IMAGE_POOL } from '../assets/preview-images';
import { useDesignStore } from '../store/designStore';
import { useT } from '../i18n';
import styles from './LandingSection.module.css';

export function LandingSection() {
  const color = useDesignStore((s) => s.color);
  // Mono / off-mono(neutral) → no tinted backdrop. Other categories pick
  // an image whose dominant hue matches the active accent.
  const accentHue = color ? effectiveAccentHue(color) : 235;
  const heroImg = accentHue != null ? pickImage(accentHue, IMAGE_POOL) : null;
  const t = useT();

  const features = [
    { num: '01', title: t('landing.feature.1.title'), body: t('landing.feature.1.body') },
    { num: '02', title: t('landing.feature.2.title'), body: t('landing.feature.2.body') },
    { num: '03', title: t('landing.feature.3.title'), body: t('landing.feature.3.body') },
  ];

  const stats = [
    { value: '5', label: t('landing.stats.steps') },
    { value: '11', label: t('landing.stats.palette') },
    { value: '<60s', label: t('landing.stats.time') },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.nav}>
        <div className={styles.navBrand}>
          <span className={styles.navMark} />
          Pinecone
        </div>
        <ul className={styles.navLinks}>
          <li><a href="#">{t('landing.nav.product')}</a></li>
          <li><a href="#">{t('landing.nav.docs')}</a></li>
          <li><a href="#">{t('landing.nav.changelog')}</a></li>
          <li><a href="#">{t('landing.nav.pricing')}</a></li>
        </ul>
        <div className={styles.navActions}>
          <a href="#" className={styles.navLink}>{t('landing.nav.signin')}</a>
          <Button size="sm">{t('landing.nav.cta')}</Button>
        </div>
      </div>

      <section className={styles.hero}>
        <div
          className={styles.heroBackdrop}
          style={heroImg ? { backgroundImage: `url("${heroImg.url.replace(/"/g, '\\"')}")` } : undefined}
        />
        <div className={styles.heroGrid} aria-hidden />
        <div className={styles.heroGlowA} aria-hidden />
        <div className={styles.heroGlowB} aria-hidden />

        <div className={styles.heroInner}>
          <Badge tone="info">
            <span className={styles.badgeDot} /> {t('landing.hero.badge')}
          </Badge>
          <h1 className={styles.heroTitle}>
            {t('start.heroA')}
            <br />
            <span className={styles.heroAccent}>{t('start.heroB')}</span>
          </h1>
          <p className={styles.heroLede}>{t('landing.hero.lede')}</p>
          <div className={styles.heroCtas}>
            <Button variant="primary" size="lg">{t('landing.hero.ctaPrimary')}</Button>
            <Button variant="ghost" size="lg">{t('landing.hero.ctaSecondary')}</Button>
          </div>
          <div className={styles.heroProof}>
            <span className={styles.proofLabel}>{t('landing.hero.trustedBy')}</span>
            <div className={styles.proofLogos}>
              {['atlas', 'nova', 'runway', 'foundry', 'linear-ish'].map((l) => (
                <span key={l} className={styles.proofLogo}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      <section className={styles.features}>
        <header className={styles.featuresHeader}>
          <span className={styles.featuresEyebrow}>{t('landing.features.eyebrow')}</span>
          <h2 className={styles.featuresTitle}>{t('landing.features.title')}</h2>
        </header>
        <div className={styles.featuresGrid}>
          {features.map((f) => (
            <article key={f.num} className={styles.feature}>
              <span className={styles.featureNum}>{f.num}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureBody}>{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>{t('landing.cta.title')}</h2>
          <p className={styles.ctaLede}>{t('landing.cta.lede')}</p>
          <div className={styles.ctaActions}>
            <Button variant="primary" size="lg">{t('landing.cta.primary')}</Button>
            <Button variant="ghost" size="lg">{t('landing.cta.secondary')}</Button>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrandBlock}>
            <div className={styles.footerBrand}>
              <span className={styles.navMark} /> Pinecone
            </div>
            <p className={styles.footerTag}>{t('landing.footer.tag')}</p>
          </div>
          <div className={styles.footerCols}>
            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>{t('landing.footer.product')}</div>
              <a href="#">{t('landing.nav.product')}</a>
              <a href="#">{t('landing.nav.pricing')}</a>
              <a href="#">{t('landing.nav.changelog')}</a>
            </div>
            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>{t('landing.footer.company')}</div>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
            </div>
            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>{t('landing.footer.legal')}</div>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div className={styles.copy}>{t('landing.footer.copy')}</div>
          <div className={styles.footerSocial}>
            <a href="#" aria-label="GitHub">GH</a>
            <a href="#" aria-label="Twitter">TW</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
