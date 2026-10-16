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
  /** Figma set: `tab_filled` (filled) or `tab_line` (line). @default 'line' */
  appearance?: TabsAppearance;
  /** Figma "Variant" — the Selected colour (Primary #004a38 · Secondary #007c56). @default 'primary' */
  variant?: TabsVariant;
  /** Figma "Size". @default 'sm' */
  size?: TabsSize;
  /** Figma "Shape" (filled only). @default 'square' */
  shape?: TabsShape;
  /** Selected tab id (controlled). */
  selectedKey?: Key;
  /** Initially selected tab id (uncontrolled). */
  defaultSelectedKey?: Key;
  /** Called with the newly selected tab id. */
  onSelectionChange?: (key: Key) => void;
  /** Tab ids that cannot be selected (Figma State "Disabled"). */
  disabledKeys?: Iterable<Key>;
  /** Activate a tab on focus (automatic) or on Enter / Space (manual). @default 'automatic' */
  keyboardActivation?: 'automatic' | 'manual';
  /** `TabList` and `TabPanel`s. */
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Figma component sets `tab_filled` (91:5000) and `tab_line` (91:5241). Arrow keys move between tabs,
 * Home / End jump to the ends (react-aria-components tablist pattern). State: Hover / Pressed = :hover / press,
 * Selected = the selected tab, Disabled = `disabledKeys` or `Tab disabled`.
 */
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
  /** Name of the tab list (e.g. what the tabs switch). */
  'aria-label'?: string;
  className?: string;
};

/** The row of tabs. Figma defines no spacing between tabs, so they sit side by side. */
export function TabList<T extends object = object>({ className, ...rest }: TabListProps<T>) {
  const { appearance } = useContext(TabsStyleContext);
  return <AriaTabList {...rest} className={cx('ds-tabs__list', className)} data-appearance={appearance} />;
}

export type TabProps = Omit<AriaTabProps, 'className' | 'children' | 'isDisabled'> & {
  /** Figma "Label Text". */
  children: ReactNode;
  /** Figma State "Disabled". */
  disabled?: boolean;
  className?: string;
};

/** One tab (Figma tab_filled / tab_line variant). `id` links it to its `TabPanel`. */
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

/** Content of a tab (not styled in Figma). */
export function TabPanel({ className, ...rest }: TabPanelProps) {
  return <AriaTabPanel {...rest} className={cx('ds-tabs__panel', className)} />;
}
