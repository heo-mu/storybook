/** Figma stepper "Type". */
export const STEPPER_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export type StepperOrientation = (typeof STEPPER_ORIENTATIONS)[number];
/** Figma stepper_indicator "Variant". */
export const STEPPER_STATUSES = ['upcoming', 'current', 'completed', 'locked', 'error'] as const;
export type StepperStatus = (typeof STEPPER_STATUSES)[number];
