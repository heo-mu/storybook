export const SEARCH_FIELD_APPEARANCES = ['outline', 'solid'] as const;
/** Figma "Type" of `search-field`. */
export type SearchFieldAppearance = (typeof SEARCH_FIELD_APPEARANCES)[number];
