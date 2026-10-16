import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type EmptyStateProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** Figma "Title Text". */
  title: ReactNode;
  /** Figma "Description Text" ("Description" on). */
  description?: ReactNode;
  /** Figma "Icon" (16px; the Figma placeholder is Database). Decorative. */
  icon?: ReactNode;
  /** The Figma button below the text, e.g. `<TextButton rightIcon={<CaretRightIcon />}>`. */
  action?: ReactNode;
};

/**
 * Figma component `empty-state` (724:14963): a centred message for an empty area — icon, title, description
 * (m-1 apart) and an action m-3 below. 320px wide as in Figma, narrower when the parent is.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState({ title, description, icon, action, className, ...rest }, ref) {
  return (
    <div {...rest} ref={ref} className={cx('ds-empty-state', className)}>
      <div className="ds-empty-state__text">
        {icon && (
          <span className="ds-empty-state__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <p className="ds-empty-state__title">{title}</p>
        {description != null && description !== false && <p className="ds-empty-state__description">{description}</p>}
      </div>
      {action != null && action !== false && <div className="ds-empty-state__action">{action}</div>}
    </div>
  );
});
