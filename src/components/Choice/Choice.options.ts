/** Figma "Size" of checkbox and radio. */
export const CHOICE_SIZES = ['sm', 'md', 'lg'] as const;
export type ChoiceSize = (typeof CHOICE_SIZES)[number];

export const CHOICE_GROUP_ORIENTATIONS = ['vertical', 'horizontal'] as const;
export type ChoiceGroupOrientation = (typeof CHOICE_GROUP_ORIENTATIONS)[number];
