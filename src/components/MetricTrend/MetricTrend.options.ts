/** 증감 방향(`disabled`: 비교할 값이 없음) */
export const METRIC_TREND_DIRECTIONS = ['up', 'down', 'flat', 'disabled'] as const;
export type MetricTrendDirection = (typeof METRIC_TREND_DIRECTIONS)[number];

/** 변화의 좋고 나쁨 — 좋음(positive) · 나쁨(negative) · 중립(neutral) */
export const METRIC_TREND_TONES = ['positive', 'negative', 'neutral'] as const;
export type MetricTrendTone = (typeof METRIC_TREND_TONES)[number];
