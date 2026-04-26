import clsx from 'clsx';
import styles from './Tabs.module.css';

export interface TabItem<Id extends string = string> {
  id: Id;
  label: string;
}

export interface TabsProps<Id extends string = string> {
  items: ReadonlyArray<TabItem<Id>>;
  activeId: Id;
  onChange: (id: Id) => void;
  ariaLabel?: string;
  className?: string;
  /**
   * If set, renders `id={`${idPrefix}-tab-${tabId}`}` on each button and
   * `aria-controls={`${idPrefix}-panel-${tabId}`}` so the consumer can wire
   * matching panel ids for tablist semantics.
   */
  idPrefix?: string;
}

export function Tabs<Id extends string = string>({
  items,
  activeId,
  onChange,
  ariaLabel,
  className,
  idPrefix,
}: TabsProps<Id>) {
  return (
    <div className={clsx(styles.tabBar, className)} role="tablist" aria-label={ariaLabel}>
      {items.map((item) => {
        const active = activeId === item.id;
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls={idPrefix ? `${idPrefix}-panel-${item.id}` : undefined}
            id={idPrefix ? `${idPrefix}-tab-${item.id}` : undefined}
            className={clsx(styles.tab, active && styles.tabActive)}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
