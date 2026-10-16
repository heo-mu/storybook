import { createContext, useContext } from 'react';
import type { ChoiceSize } from '../Choice';

export type CheckboxGroupContextValue = {
  name?: string;
  size?: ChoiceSize;
  disabled?: boolean;
  isSelected: (value: string) => boolean;
  toggle: (value: string, selected: boolean) => void;
};

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);
export const useCheckboxGroup = () => useContext(CheckboxGroupContext);
