import { createContext, useContext, type ReactNode } from 'react';
import { Button, Disclosure, DisclosureGroup, DisclosurePanel, Heading, type Key } from 'react-aria-components';
import { CaretDownIcon, CaretUpIcon } from '../../icons';
import { cx } from '../../utils/cx';
import type { AccordionSize } from './Accordion.options';

const SizeContext = createContext<AccordionSize>('md');

export type AccordionProps = {
  /** 안에 넣을 `AccordionItem` 항목들. */
  children: ReactNode;
  /** 크기. 모든 항목에 적용됩니다. @default 'md' */
  size?: AccordionSize;
  /** 여러 항목을 동시에 펼칠 수 있습니다. 끄면 한 번에 한 항목만 펼칩니다. @default false */
  allowsMultipleExpanded?: boolean;
  /** 펼친 항목의 `id` 목록. 직접 제어할 때 씁니다. */
  expandedKeys?: Iterable<Key>;
  /** 처음 펼칠 항목의 `id` 목록. 직접 제어하지 않을 때 씁니다. */
  defaultExpandedKeys?: Iterable<Key>;
  /** 펼친 항목이 바뀌면 펼친 항목의 `id` 목록과 함께 호출됩니다. */
  onExpandedChange?: (keys: Set<Key>) => void;
  className?: string;
};

/** 관련 콘텐츠를 접고 펼쳐 필요한 정보부터 확인할 수 있는 컴포넌트입니다. */
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
  /** 항목 id. `expandedKeys` · `defaultExpandedKeys`에서 이 값을 씁니다. */
  id?: Key;
  /** 제목. */
  title: ReactNode;
  /** 제목 아래 설명. */
  description?: ReactNode;
  /** 펼쳤을 때 보이는 내용. */
  children: ReactNode;
  /** 아래 구분선을 표시합니다. @default true */
  divider?: boolean;
  /** 비활성 — 펼칠 수 없고 키보드 포커스를 받지 않습니다. */
  disabled?: boolean;
  /** 펼침 여부. `Accordion` 밖에서 단독으로 쓰며 직접 제어할 때 씁니다. */
  expanded?: boolean;
  /** 처음 펼침 여부. 단독으로 쓰며 직접 제어하지 않을 때 씁니다. */
  defaultExpanded?: boolean;
  /** 항목을 펼치거나 접을 때 호출됩니다. */
  onExpandedChange?: (expanded: boolean) => void;
  /** 제목의 제목 요소 수준(`h2` – `h6`). @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
};

/**
 * 제목을 눌러 내용을 펼치거나 접는 아코디언 항목입니다. 마우스를 올리면 모양이 바뀌고, `disabled`이면 펼칠 수 없습니다.
 * 보통 `Accordion` 안에 넣으며 단독으로도 쓸 수 있습니다.
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
