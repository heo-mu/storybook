import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type CardProps = ComponentPropsWithoutRef<'div'>;

/**
 * Figma Card (185:6512): header, content and footer in a container — padding p-5 top / bottom, m-4 between the parts,
 * border-radius/rounded-lg, colors/card/background, 1px INSIDE colors/card/border, shadow (figma-issues F60).
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx('ds-card', className)} />;
});

export type CardHeaderProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** Figma "Card Text". */
  title: ReactNode;
  /** Figma "Sub" · "Sub Text". */
  description?: ReactNode;
  /** Figma "Button" (Button Tertiary · Outline · sm in Figma). */
  action?: ReactNode;
  /** Heading level of the title. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};

/** Figma card_header (218:7173): title, description and an action above a divider. */
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

/** Figma card_content: the body, padded p-5 left and right. */
export const CardContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(function CardContent({ className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx('ds-card__content', className)} />;
});

/** Figma card_footer (218:7174): full-width buttons m-2 apart (Figma: Primary · Solid · md and Tertiary · Outline · md). */
export const CardFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(function CardFooter({ className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx('ds-card__footer', className)} />;
});
