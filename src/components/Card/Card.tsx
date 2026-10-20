import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type CardProps = ComponentPropsWithoutRef<'div'>;

/** 관련 정보와 동작을 하나의 영역으로 묶습니다. 헤더·본문·푸터를 필요한 만큼 조합합니다. */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx('ds-card', className)} />;
});

export type CardHeaderProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** 카드 제목. 제목 요소(기본 `<h3>`)로 표시됩니다. */
  title: ReactNode;
  /** 제목 아래 설명. 길면 줄바꿈됩니다. */
  description?: ReactNode;
  /** 제목 오른쪽 버튼. 디자인 예시는 `Button variant="tertiary" appearance="outline" size="sm"`입니다. */
  action?: ReactNode;
  /** 제목의 단계(h2–h6). @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};

/** 카드 헤더입니다. 제목 · 설명 · 버튼을 두고, 아래에 구분선이 있습니다. */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { title, description, action, headingLevel = 3, className, ...rest },
  ref,
) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div {...rest} ref={ref} className={cx('ds-card__header', className)}>
      <div className="ds-card__heading">
        <Heading className="ds-card__title">{title}</Heading>
        {description != null && description !== false && <p className="ds-card__description">{description}</p>}
      </div>
      {action != null && action !== false && <div className="ds-card__action">{action}</div>}
    </div>
  );
});

/** 카드 본문입니다. */
export const CardContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(function CardContent({ className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx('ds-card__content', className)} />;
});

/** 카드 아래쪽 버튼 영역입니다. 버튼이 너비를 나눠 채웁니다. */
export const CardFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(function CardFooter({ className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx('ds-card__footer', className)} />;
});
