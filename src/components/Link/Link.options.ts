/** Figma link "Size". */
export const LINK_SIZES = ['sm', 'md', 'lg'] as const;
export type LinkSize = (typeof LINK_SIZES)[number];
