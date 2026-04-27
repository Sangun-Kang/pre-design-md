import clsx from 'clsx';
import { useEffect } from 'react';
import { useDesignStore } from '../store/designStore';
import { StartStep } from '../steps/StartStep';
import { TypographyStep } from '../steps/TypographyStep';
import { SpacingStep } from '../steps/SpacingStep';
import { RadiusStep } from '../steps/RadiusStep';
import { ShadowStep } from '../steps/ShadowStep';
import { ColorStep } from '../steps/ColorStep';
import { PreviewStep } from '../steps/PreviewStep';
import { ExportStep } from '../steps/ExportStep';
import { StepNav } from './StepNav';
import { GitHubIcon, GITHUB_REPOSITORY_URL } from './GitHubIcon';
import styles from './Wizard.module.css';

export function Wizard() {
  const currentStep = useDesignStore((s) => s.currentStep);
  const isStart = currentStep === 'start';

  // Reset scroll on step change so each step starts at the top, regardless of
  // where the user scrolled in the previous one. Instant (not smooth) — the
  // step-mount animation handles the perceived transition.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentStep]);

  return (
    <div className={styles.wizard}>
      <StepNav />
      <main
        key={currentStep}
        className={clsx(styles.main, isStart && styles.mainFull)}
      >
        {currentStep === 'start' && <StartStep />}
        {currentStep === 'typography' && <TypographyStep />}
        {currentStep === 'spacing' && <SpacingStep />}
        {currentStep === 'radius' && <RadiusStep />}
        {currentStep === 'shadow' && <ShadowStep />}
        {currentStep === 'color' && <ColorStep />}
        {currentStep === 'preview' && <PreviewStep />}
        {currentStep === 'export' && <ExportStep />}
      </main>
      <footer className={styles.globalFooter}>
        <span>© 2026 Sangun Kang</span>
        <a
          href={GITHUB_REPOSITORY_URL}
          target="_blank"
          rel="noreferrer"
          className={styles.githubLink}
          aria-label="pre-design-md repository on GitHub"
        >
          <GitHubIcon />
          <span>GitHub</span>
        </a>
      </footer>
    </div>
  );
}
