import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, label, id, ...rest },
  ref,
) {
  const content = (
    <input
      ref={ref}
      id={id}
      type="checkbox"
      className={clsx(styles.input, className)}
      {...rest}
    />
  );
  if (!label) return content;
  return (
    <label className={styles.wrapper} htmlFor={id}>
      {content}
      <span className={styles.label}>{label}</span>
    </label>
  );
});

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, label, id, ...rest },
  ref,
) {
  const content = (
    <input
      ref={ref}
      id={id}
      type="radio"
      className={clsx(styles.input, styles.radio, className)}
      {...rest}
    />
  );
  if (!label) return content;
  return (
    <label className={styles.wrapper} htmlFor={id}>
      {content}
      <span className={styles.label}>{label}</span>
    </label>
  );
});
