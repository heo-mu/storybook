/** Figma chip "Size" (chip-multi, chip-input, chip-filter). */
export const CHIP_SIZES = ['xs', 'sm', 'md'] as const;
export type ChipSize = (typeof CHIP_SIZES)[number];
