export const SEARCH_FIELD_APPEARANCES = ['outline', 'solid'] as const;
/** SearchField 모양 — 테두리(outline) · 채움(solid). */
export type SearchFieldAppearance = (typeof SEARCH_FIELD_APPEARANCES)[number];
