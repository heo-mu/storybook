import { forwardRef, type ComponentPropsWithoutRef, type MouseEvent, type ReactNode } from 'react';
import { ArrowSquareOutIcon } from '../../icons';
import { cx } from '../../utils/cx';
import type { LinkSize } from './Link.options';

export type LinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'children'> & {
  /** Figma "Size". @default 'sm' */
  size?: LinkSize;
  /** Figma "Label Text". */
  children: ReactNode;
  /** Opens in a new tab (`target="_blank"`, `rel="noopener noreferrer"`) and announces it. */
  external?: boolean;
  /** Figma "Icon" (arrow-square-out). @default `external` */
  showIcon?: boolean;
  /** Figma State "Disabled": rendered without `href`, `aria-disabled`, not focusable. */
  disabled?: boolean;
  /** Text read after the label for external links. @default '(새 창)' */
  newTabLabel?: string;
};

/**
 * Figma component set `link` (111:1509). State: Hover / Pressed / Visited are :hover / :active / :visited,
 * Disabled = `disabled`. Renders a native `<a>`.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { size = 'sm', children, external = false, showIcon, disabled = false, newTabLabel = '(새 창)', href, target, rel, onClick, className, ...rest },
  ref,
) {
  const icon = showIcon ?? external;
  return (
    <a
      {...rest}
      ref={ref}
      className={cx('ds-link', className)}
      data-size={size}
      data-disabled={disabled || undefined}
      href={disabled ? undefined : href}
      target={external ? '_blank' : target}
      rel={external ? cx(rel, 'noopener noreferrer') : rel}
      aria-disabled={disabled || undefined}
      role={disabled ? 'link' : undefined}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
    >
      <span className="ds-link__label">{children}</span>
      {external && <span className="ds-link__sr"> {newTabLabel}</span>}
      {icon && <ArrowSquareOutIcon className="ds-link__icon" />}
    </a>
  );
});
