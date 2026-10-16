/** Figma metric-trend "Direction" (Disabled: no comparison available). */
export const METRIC_TREND_DIRECTIONS = ['up', 'down', 'flat', 'disabled'] as const;
export type MetricTrendDirection = (typeof METRIC_TREND_DIRECTIONS)[number];

/** Figma metric-trend "Tone": whether the change is good (positive), bad (negative) or neither. */
export const METRIC_TREND_TONES = ['positive', 'negative', 'neutral'] as const;
export type MetricTrendTone = (typeof METRIC_TREND_TONES)[number];
