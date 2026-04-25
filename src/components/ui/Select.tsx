import clsx from 'clsx';
import { forwardRef, type SelectHTMLAttributes } from 'react';
import styles from './Input.module.css';
import selectStyles from './Select.module.css';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={clsx(styles.input, selectStyles.select, className)}
      {...rest}
    >
      {children}
    </select>
  );
});
