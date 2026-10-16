/** Figma switch "Size". */
export const SWITCH_SIZES = ['sm', 'md'] as const;
export type SwitchSize = (typeof SWITCH_SIZES)[number];
