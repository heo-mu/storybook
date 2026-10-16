import { createContext, useContext } from 'react';
import type { FieldSize } from '../Field';

/** Size of the Select; its options read it. */
export const SelectSizeContext = createContext<FieldSize>('sm');
export const useSelectSize = () => useContext(SelectSizeContext);
