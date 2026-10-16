/** Figma data-freshness "State". */
export const DATA_FRESHNESS_STATES = ['fresh', 'stale', 'offline'] as const;
export type DataFreshnessState = (typeof DATA_FRESHNESS_STATES)[number];
