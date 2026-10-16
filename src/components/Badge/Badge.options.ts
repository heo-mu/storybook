/** Figma badge "Status" (badge_status, badge_dot, badge_count). */
export const BADGE_STATUSES = ['basic', 'gray', 'point', 'success', 'warning', 'danger', 'information'] as const;
export type BadgeStatus = (typeof BADGE_STATUSES)[number];
/** Figma badge_status "Appearance". */
export const BADGE_APPEARANCES = ['filled', 'outline'] as const;
export type BadgeAppearance = (typeof BADGE_APPEARANCES)[number];
/** Figma badge_status / badge_dot "Size". */
export const BADGE_SIZES = ['sm', 'md', 'lg'] as const;
export type BadgeSize = (typeof BADGE_SIZES)[number];
/** Figma badge_status "Shape". */
export const BADGE_SHAPES = ['square', 'rounded'] as const;
export type BadgeShape = (typeof BADGE_SHAPES)[number];
