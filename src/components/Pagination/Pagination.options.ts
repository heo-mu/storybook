/** Pagination 크기 */
export const PAGINATION_SIZES = ['sm', 'md', 'lg'] as const;
export type PaginationSize = (typeof PAGINATION_SIZES)[number];
/** Pagination 모서리 모양 */
export const PAGINATION_SHAPES = ['square', 'rounded'] as const;
export type PaginationShape = (typeof PAGINATION_SHAPES)[number];
