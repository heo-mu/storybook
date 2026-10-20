/** Alert · Toast 종류 */
export const ALERT_STATUSES = ['information', 'success', 'warning', 'error'] as const;
export type AlertStatus = (typeof ALERT_STATUSES)[number];
