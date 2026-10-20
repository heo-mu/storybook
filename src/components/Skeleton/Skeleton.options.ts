/** 스켈레톤 모양(`shape4`는 100 × 10 막대) */
export const SKELETON_SHAPES = ['line', 'shape4', 'block', 'circle'] as const;
export type SkeletonShape = (typeof SKELETON_SHAPES)[number];
