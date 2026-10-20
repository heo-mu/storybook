import { forwardRef, type ComponentPropsWithoutRef, type MouseEvent, type ReactNode } from 'react';
import { ArrowSquareOutIcon } from '../../icons';
import { cx } from '../../utils/cx';
import type { LinkSize } from './Link.options';

export type LinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'children'> & {
  /** 크기. @default 'sm' */
  size?: LinkSize;
  /** 링크 글자. */
  children: ReactNode;
  /** 새 창으로 엽니다. 화면 낭독기는 글자 뒤에 `newTabLabel`을 함께 읽습니다. */
  external?: boolean;
  /** 새 창 아이콘 표시 여부. @default `external` */
  showIcon?: boolean;
  /** 비활성 — 누를 수 없고 키보드 포커스를 받지 않습니다. */
  disabled?: boolean;
  /** 새 창 링크에서 화면 낭독기가 글자 뒤에 읽는 말. @default '(새 창)' */
  newTabLabel?: string;
};

/** 다른 페이지나 문서로 이동하는 텍스트 링크입니다. 현재 화면에서 동작을 실행할 때는 Button을 사용합니다. */
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
