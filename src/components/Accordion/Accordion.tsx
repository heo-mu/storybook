import { createContext, useContext, type ReactNode } from 'react';
import { Button, Disclosure, DisclosureGroup, DisclosurePanel, Heading, type Key } from 'react-aria-components';
import { CaretDownIcon, CaretUpIcon } from '../../icons';
import { cx } from '../../utils/cx';
import type { AccordionSize } from './Accordion.options';

const SizeContext = createContext<AccordionSize>('md');

export type AccordionProps = {
  /** `AccordionItem` elements. */
  children: ReactNode;
  /** Figma "Size" for every item. @default 'md' */
  size?: AccordionSize;
  /** Several items may be open at once. @default false */
  allowsMultipleExpanded?: boolean;
  /** Ids of the open items (controlled). */
  expandedKeys?: Iterable<Key>;
  /** Ids of the items open at first (uncontrolled). */
  defaultExpandedKeys?: Iterable<Key>;
  /** Called with the ids of the open items. */
  onExpandedChange?: (keys: Set<Key>) => void;
  className?: string;
};

/** A group of `AccordionItem`s (react-aria-components DisclosureGroup). */
export function Accordion({ children, size = 'md', className, ...rest }: AccordionProps) {
  return (
    <SizeContext.Provider value={size}>
      <DisclosureGroup {...rest} className={cx('ds-accordion', className)}>
        {children}
      </DisclosureGroup>
    </SizeContext.Provider>
  );
}

export type AccordionItemProps = {
  /** Item id (for `expandedKeys`). */
  id?: Key;
  /** Figma "Title Text". */
  title: ReactNode;
  /** Figma "Description Text" ("Show Description" on). */
  description?: ReactNode;
  /** Figma "Body" (accordion-content): the panel content. */
  children: ReactNode;
  /** Figma "Show Divider". @default true */
  divider?: boolean;
  /** Figma State "Disabled". */
  disabled?: boolean;
  /** Open state of a single item outside an `Accordion` (controlled). */
  expanded?: boolean;
  /** Initial open state of a single item (uncontrolled). */
  defaultExpanded?: boolean;
  /** Called when the item opens or closes. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Heading level of the title. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
};

/**
 * Figma component set `accordion-item` (796:6071): a heading button that shows or hides its panel
 * (react-aria-components Disclosure: aria-expanded / aria-controls, Enter / Space). State Hover = :hover,
 * Expanded = open, Disabled = `disabled`.
 */
export function AccordionItem({
  id,
  title,
  description,
  children,
  divider = true,
  disabled,
  expanded,
  defaultExpanded,
  onExpandedChange,
  headingLevel = 3,
  className,
}: AccordionItemProps) {
  const size = useContext(SizeContext);
  return (
    <Disclosure
      id={id}
      isDisabled={disabled}
      isExpanded={expanded}
      defaultExpanded={defaultExpanded}
      onExpandedChange={onExpandedChange}
      className={cx('ds-accordion__item', className)}
      data-size={size}
    >
      {({ isExpanded }) => (
        <>
          <Heading level={headingLevel} className="ds-accordion__heading">
            <Button slot="trigger" className="ds-accordion__trigger" data-divider={divider || undefined}>
              <span className="ds-accordion__heading-text">
                <span className="ds-accordion__title">{title}</span>
                {description != null && description !== false && <span className="ds-accordion__description">{description}</span>}
              </span>
              {isExpanded ? <CaretUpIcon className="ds-accordion__icon" /> : <CaretDownIcon className="ds-accordion__icon" />}
            </Button>
          </Heading>
          <DisclosurePanel className="ds-accordion__panel">
            <div className="ds-accordion__body">{children}</div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
