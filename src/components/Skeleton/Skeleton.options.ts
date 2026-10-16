/** Figma skeleton "Shape" (Shape4 is the Figma value name of the 100 × 10 bar). */
export const SKELETON_SHAPES = ['line', 'shape4', 'block', 'circle'] as const;
export type SkeletonShape = (typeof SKELETON_SHAPES)[number];
