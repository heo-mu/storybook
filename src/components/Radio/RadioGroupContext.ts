import { createContext, useContext } from 'react';
import type { ChoiceSize } from '../Choice';

export type RadioGroupContextValue = {
  name: string;
  size?: ChoiceSize;
  disabled?: boolean;
  required?: boolean;
  selected: string | null;
  select: (value: string) => void;
};

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
export const useRadioGroup = () => useContext(RadioGroupContext);
