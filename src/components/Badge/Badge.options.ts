/** 배지 종류(상태 색) — Badge · BadgeDot · BadgeCount 공통 */
export const BADGE_STATUSES = ['basic', 'gray', 'point', 'success', 'warning', 'danger', 'information'] as const;
export type BadgeStatus = (typeof BADGE_STATUSES)[number];
/** Badge 모양 */
export const BADGE_APPEARANCES = ['filled', 'outline'] as const;
export type BadgeAppearance = (typeof BADGE_APPEARANCES)[number];
/** Badge · BadgeDot 크기 */
export const BADGE_SIZES = ['sm', 'md', 'lg'] as const;
export type BadgeSize = (typeof BADGE_SIZES)[number];
/** Badge 모서리 모양 */
export const BADGE_SHAPES = ['square', 'rounded'] as const;
export type BadgeShape = (typeof BADGE_SHAPES)[number];
