/** Figma accordion-item "Size". */
export const ACCORDION_SIZES = ['md', 'sm'] as const;
export type AccordionSize = (typeof ACCORDION_SIZES)[number];
