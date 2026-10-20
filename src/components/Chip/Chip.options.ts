/** 칩 크기 (Chip · InputChip · FilterChip · FilterChipSelect) */
export const CHIP_SIZES = ['xs', 'sm', 'md'] as const;
export type ChipSize = (typeof CHIP_SIZES)[number];
