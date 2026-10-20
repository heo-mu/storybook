import { createContext, useContext, type CSSProperties, type ReactNode } from 'react';
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type Key,
  type TabListProps as AriaTabListProps,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
} from 'react-aria-components';
import { cx } from '../../utils/cx';
import type { TabsAppearance, TabsShape, TabsSize, TabsVariant } from './Tabs.options';

type TabsStyle = { appearance: TabsAppearance; variant: TabsVariant; size: TabsSize; shape: TabsShape };
const TabsStyleContext = createContext<TabsStyle>({ appearance: 'line', variant: 'primary', size: 'sm', shape: 'square' });

export type TabsProps = {
  /** 모양 — 밑줄(`line`) · 채움(`filled`). @default 'line' */
  appearance?: TabsAppearance;
  /** 종류 — 선택된 탭의 색. @default 'primary' */
  variant?: TabsVariant;
  /** 크기. @default 'sm' */
  size?: TabsSize;
  /** 모서리 모양(`filled`에만 적용). @default 'square' */
  shape?: TabsShape;
  /** 선택된 탭의 `id`. 넘기면 선택을 바깥에서 관리합니다. */
  selectedKey?: Key;
  /** 처음 선택할 탭의 `id`. `selectedKey` 없이 탭이 스스로 선택을 관리할 때 씁니다. */
  defaultSelectedKey?: Key;
  /** 선택이 바뀌면 새로 선택된 탭의 `id`로 호출됩니다. */
  onSelectionChange?: (key: Key) => void;
  /** 고를 수 없는 탭의 `id` 목록(비활성). */
  disabledKeys?: Iterable<Key>;
  /** 방향키로 옮기면 바로 선택(`automatic`)할지, Enter · Space를 눌러야 선택(`manual`)할지 정합니다. @default 'automatic' */
  keyboardActivation?: 'automatic' | 'manual';
  /** `TabList`와 `TabPanel`들. */
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** 같은 화면의 관련 콘텐츠를 구분하고 탭을 선택해 전환합니다. */
export function Tabs({ appearance = 'line', variant = 'primary', size = 'sm', shape = 'square', className, children, ...rest }: TabsProps) {
  return (
    <TabsStyleContext.Provider value={{ appearance, variant, size, shape }}>
      <AriaTabs {...rest} className={cx('ds-tabs', className)}>
        {children}
      </AriaTabs>
    </TabsStyleContext.Provider>
  );
}

export type TabListProps<T extends object = object> = Omit<AriaTabListProps<T>, 'className'> & {
  /** 화면 낭독기가 읽는 탭 목록 이름(예: 탭으로 바꾸는 내용). */
  'aria-label'?: string;
  className?: string;
};

/** 탭을 한 줄로 늘어놓는 탭 목록입니다. 탭은 간격 없이 나란히 놓입니다. */
export function TabList<T extends object = object>({ className, ...rest }: TabListProps<T>) {
  const { appearance } = useContext(TabsStyleContext);
  return <AriaTabList {...rest} className={cx('ds-tabs__list', className)} data-appearance={appearance} />;
}

export type TabProps = Omit<AriaTabProps, 'className' | 'children' | 'isDisabled'> & {
  /** 탭 글자. */
  children: ReactNode;
  /** 비활성 — 고를 수 없고, 방향키로 옮길 때도 건너뜁니다. */
  disabled?: boolean;
  className?: string;
};

/** 탭 하나입니다. 같은 `id`를 가진 `TabPanel`과 짝을 이룹니다. */
export function Tab({ className, children, disabled, ...rest }: TabProps) {
  const { appearance, variant, size, shape } = useContext(TabsStyleContext);
  return (
    <AriaTab
      {...rest}
      isDisabled={disabled}
      className={cx('ds-tab', className)}
      data-appearance={appearance}
      data-variant={variant}
      data-size={size}
      data-shape={appearance === 'filled' ? shape : undefined}
    >
      <span className="ds-tab__label">{children}</span>
    </AriaTab>
  );
}

export type TabPanelProps = Omit<AriaTabPanelProps, 'className'> & { className?: string };

/** 탭 하나의 내용입니다. 따로 꾸밈이 없으므로 내용의 여백 등은 직접 정합니다. */
export function TabPanel({ className, ...rest }: TabPanelProps) {
  return <AriaTabPanel {...rest} className={cx('ds-tabs__panel', className)} />;
}
