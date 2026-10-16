/** Figma loading "size". */
export const LOADING_SIZES = ['md', 'sm'] as const;
export type LoadingSize = (typeof LOADING_SIZES)[number];
