/** Breadcrumb 크기 */
export const BREADCRUMB_SIZES = ['md', 'sm'] as const;
export type BreadcrumbSize = (typeof BREADCRUMB_SIZES)[number];
/** Breadcrumb 배치 — 전체 경로(full) · 접힘(collapsed) */
export const BREADCRUMB_LAYOUTS = ['full', 'collapsed'] as const;
export type BreadcrumbLayout = (typeof BREADCRUMB_LAYOUTS)[number];
