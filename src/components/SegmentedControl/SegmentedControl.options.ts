/** Figma segmented-control "Size". */
export const SEGMENTED_CONTROL_SIZES = ['md', 'sm', 'xs'] as const;
export type SegmentedControlSize = (typeof SEGMENTED_CONTROL_SIZES)[number];
