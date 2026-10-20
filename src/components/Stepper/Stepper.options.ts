/** Stepper 방향 */
export const STEPPER_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export type StepperOrientation = (typeof STEPPER_ORIENTATIONS)[number];
/** Stepper 단계 상태 */
export const STEPPER_STATUSES = ['upcoming', 'current', 'completed', 'locked', 'error'] as const;
export type StepperStatus = (typeof STEPPER_STATUSES)[number];
