/** Figma pagination "Size". */
export const PAGINATION_SIZES = ['sm', 'md', 'lg'] as const;
export type PaginationSize = (typeof PAGINATION_SIZES)[number];
/** Figma pagination "Shape". */
export const PAGINATION_SHAPES = ['square', 'rounded'] as const;
export type PaginationShape = (typeof PAGINATION_SHAPES)[number];
