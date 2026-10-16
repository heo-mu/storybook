/** Figma data-state "State". */
export const DATA_STATES = ['loading', 'empty', 'no-results', 'error', 'no-access', 'partial'] as const;
export type DataStateValue = (typeof DATA_STATES)[number];
