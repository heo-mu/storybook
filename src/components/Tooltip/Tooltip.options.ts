/** Figma tooltip "Placement". */
export const TOOLTIP_PLACEMENTS = ['top', 'right', 'bottom', 'left'] as const;
export type TooltipPlacement = (typeof TOOLTIP_PLACEMENTS)[number];
