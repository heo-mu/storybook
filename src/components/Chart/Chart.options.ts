/** 차트 종류 */
export const CHART_TYPES = ['line', 'bar-vertical', 'bar-horizontal'] as const;
export type ChartType = (typeof CHART_TYPES)[number];

/** 차트 스타일 — 기본 · 간단 */
export const CHART_VARIANTS = ['default', 'simple'] as const;
export type ChartVariant = (typeof CHART_VARIANTS)[number];

/** 범례 표시 모양 — 선 · 점선 · 네모 */
export const CHART_LEGEND_TYPES = ['line', 'dash-line', 'bar'] as const;
export type ChartLegendType = (typeof CHART_LEGEND_TYPES)[number];

/**
 * 계열 색 — 브랜드(brand) · 비교(compare) · 02, 간단 스타일 막대 차트의 지난 기간(history · history-compare).
 */
export const CHART_COLORS = ['brand', 'compare', '02', 'history', 'history-compare'] as const;
export type ChartColor = (typeof CHART_COLORS)[number];
