import { CaretLeftIcon, CaretRightIcon, PlusIcon } from './figma-icons';

/** Storybook control options for icon slots (Figma's boolean + icon instance). */
export const ICON_OPTIONS = ['None', 'CaretLeft', 'CaretRight', 'Plus'] as const;
export const ICON_MAPPING = {
  None: undefined,
  CaretLeft: <CaretLeftIcon />,
  CaretRight: <CaretRightIcon />,
  Plus: <PlusIcon />,
};
