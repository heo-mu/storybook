import { createContext, useContext } from 'react';
import type { SegmentedControlSize } from './SegmentedControl.options';

export type SegmentedControlContextValue = {
  name: string;
  size: SegmentedControlSize;
  disabled?: boolean;
  selected: string | null;
  select: (value: string) => void;
};

export const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null);
export const useSegmentedControl = () => useContext(SegmentedControlContext);
