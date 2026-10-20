/** Tabs 모양 — 밑줄(line) · 채움(filled) */
export const TABS_APPEARANCES = ['line', 'filled'] as const;
export type TabsAppearance = (typeof TABS_APPEARANCES)[number];
/** Tabs 종류 — 선택된 탭의 색 */
export const TABS_VARIANTS = ['primary', 'secondary'] as const;
export type TabsVariant = (typeof TABS_VARIANTS)[number];
/** Tabs 크기 */
export const TABS_SIZES = ['sm', 'md', 'lg'] as const;
export type TabsSize = (typeof TABS_SIZES)[number];
/** Tabs 모서리 모양(filled에만 적용) */
export const TABS_SHAPES = ['square', 'rounded'] as const;
export type TabsShape = (typeof TABS_SHAPES)[number];
