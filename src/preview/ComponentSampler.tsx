import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox, Radio } from '../components/ui/Checkbox';
import { Card, CardBody, CardFooter, CardHeader, CardImage, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { Navbar } from '../components/ui/Navbar';
import { pickImage } from '../lib/imageFilter';
import { IMAGE_POOL } from '../assets/preview-images';
import { useDesignStore } from '../store/designStore';
import { useT } from '../i18n';
import styles from './ComponentSampler.module.css';

export function ComponentSampler() {
  const color = useDesignStore((s) => s.color);
  const hue = color?.primaryHue ?? 235;
  const heroImage = pickImage(hue, IMAGE_POOL);
  const t = useT();

  return (
    <div className={styles.root}>
      <Block title={t('sampler.block.nav')}>
        <Navbar />
      </Block>

      <Block title={t('sampler.block.buttons')}>
        <div className={styles.row}>
          <Button variant="primary" size="sm">
            Primary SM
          </Button>
          <Button variant="primary" size="md">
            Primary MD
          </Button>
          <Button variant="primary" size="lg">
            Primary LG
          </Button>
          <Button variant="primary" size="md" disabled>
            {t('sampler.disabled')}
          </Button>
        </div>
        <div className={styles.row}>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </Block>

      <Block title={t('sampler.block.inputs')}>
        <div className={styles.formCol}>
          <Input placeholder={t('sampler.emailPlaceholder')} />
          <Select defaultValue="">
            <option value="" disabled>
              {t('sampler.choosePlan')}
            </option>
            <option value="free">{t('sampler.planFree')}</option>
            <option value="pro">{t('sampler.planPro')}</option>
            <option value="team">{t('sampler.planTeam')}</option>
          </Select>
          <Textarea placeholder={t('sampler.tellMore')} />
          <div className={styles.row}>
            <Checkbox id="sampler-terms" label={t('sampler.agreeTerms')} />
            <Radio id="sampler-r1" name="sampler-radio" label="Option A" defaultChecked />
            <Radio id="sampler-r2" name="sampler-radio" label="Option B" />
          </div>
        </div>
      </Block>

      <Block title={t('sampler.block.cards')}>
        <div className={styles.cards}>
          <Card>
            {heroImage && <CardImage src={heroImage.url} alt={heroImage.alt} />}
            <CardHeader>
              <CardTitle>{t('sampler.card.title')}</CardTitle>
            </CardHeader>
            <CardBody>{t('sampler.card.body')}</CardBody>
            <CardFooter>
              <Button variant="primary" size="sm">
                {t('sampler.action')}
              </Button>
              <Button variant="ghost" size="sm">
                {t('sampler.cancel')}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('sampler.card.textOnly')}</CardTitle>
            </CardHeader>
            <CardBody>{t('sampler.card.textOnlyBody')}</CardBody>
            <CardFooter>
              <Button variant="secondary" size="sm">
                {t('sampler.moreInfo')}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('sampler.card.stat')}</CardTitle>
            </CardHeader>
            <CardBody>
              <div className={styles.stat}>42.1%</div>
              <div className={styles.statLabel}>{t('sampler.card.statLabel')}</div>
            </CardBody>
          </Card>
        </div>
      </Block>

      <Block title={t('sampler.block.badges')}>
        <div className={styles.row}>
          <Badge tone="neutral">neutral</Badge>
          <Badge tone="info">info</Badge>
          <Badge tone="success">success</Badge>
          <Badge tone="warning">warning</Badge>
          <Badge tone="danger">danger</Badge>
        </div>
      </Block>

      <Block title={t('sampler.block.alerts')}>
        <div className={styles.alertStack}>
          <Alert tone="info" title={t('sampler.alert.new.title')}>
            {t('sampler.alert.new.body')}
          </Alert>
          <Alert tone="success" title={t('sampler.alert.upload.title')}>
            {t('sampler.alert.upload.body')}
          </Alert>
          <Alert tone="warning" title={t('sampler.alert.storage.title')}>
            {t('sampler.alert.storage.body')}
          </Alert>
          <Alert tone="danger" title={t('sampler.alert.connection.title')}>
            {t('sampler.alert.connection.body')}
          </Alert>
        </div>
      </Block>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>{title}</h3>
      <div className={styles.blockBody}>{children}</div>
    </div>
  );
}
