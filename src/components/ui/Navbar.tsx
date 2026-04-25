import type { ReactNode } from 'react';
import styles from './Navbar.module.css';
import { Button } from './Button';

export interface NavbarProps {
  brand?: ReactNode;
  links?: Array<{ label: string; href?: string }>;
  cta?: ReactNode;
}

export function Navbar({
  brand = 'Acme',
  links = [
    { label: 'Features' },
    { label: 'Pricing' },
    { label: 'Docs' },
    { label: 'Blog' },
  ],
  cta = (
    <Button size="sm" variant="primary">
      Sign up
    </Button>
  ),
}: NavbarProps) {
  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>{brand}</span>
      <ul className={styles.links}>
        {links.map((l, i) => (
          <li key={i}>
            <a href={l.href ?? '#'} className={styles.link}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <div className={styles.cta}>{cta}</div>
    </nav>
  );
}
