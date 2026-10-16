/** Figma breadcrumb / breadcrumb-item "Size". */
export const BREADCRUMB_SIZES = ['md', 'sm'] as const;
export type BreadcrumbSize = (typeof BREADCRUMB_SIZES)[number];
/** Figma breadcrumb "Layout". */
export const BREADCRUMB_LAYOUTS = ['full', 'collapsed'] as const;
export type BreadcrumbLayout = (typeof BREADCRUMB_LAYOUTS)[number];
