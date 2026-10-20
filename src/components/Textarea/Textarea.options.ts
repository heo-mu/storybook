export const TEXTAREA_SIZES = ['sm', 'md'] as const;
/** Textarea 크기. */
export type TextareaSize = (typeof TEXTAREA_SIZES)[number];
