export const TEXTAREA_SIZES = ['sm', 'md'] as const;
/** Figma "Size" of `textarea`. */
export type TextareaSize = (typeof TEXTAREA_SIZES)[number];
