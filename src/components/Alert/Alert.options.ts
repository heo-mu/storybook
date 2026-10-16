/** Figma alert / toast "Status". */
export const ALERT_STATUSES = ['information', 'success', 'error'] as const;
export type AlertStatus = (typeof ALERT_STATUSES)[number];
