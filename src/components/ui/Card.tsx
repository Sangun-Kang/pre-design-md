import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  elevated?: boolean;
}

export function Card({ className, children, elevated = true, ...rest }: CardProps) {
  return (
    <div
      className={clsx(styles.card, elevated && styles.elevated, className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx(styles.header, className)} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={clsx(styles.title, className)} {...rest}>
      {children}
    </h3>
  );
}

export function CardBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx(styles.body, className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx(styles.footer, className)} {...rest}>
      {children}
    </div>
  );
}

export function CardImage({ src, alt, className, ...rest }: HTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  return <img src={src} alt={alt} className={clsx(styles.image, className)} {...rest} />;
}
