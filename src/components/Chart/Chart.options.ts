/** Figma chart "Type". */
export const CHART_TYPES = ['line', 'bar-vertical', 'bar-horizontal'] as const;
export type ChartType = (typeof CHART_TYPES)[number];

/** Figma chart "Style". */
export const CHART_VARIANTS = ['default', 'simple'] as const;
export type ChartVariant = (typeof CHART_VARIANTS)[number];

/** Figma chart-legend-item "Type". */
export const CHART_LEGEND_TYPES = ['line', 'dash-line', 'bar'] as const;
export type ChartLegendType = (typeof CHART_LEGEND_TYPES)[number];

/**
 * Series colours used by the Figma chart parts: colors/chart/series/{brand, compare, 02} and
 * colors/chart/simple/{history, history-compare}.
 */
export const CHART_COLORS = ['brand', 'compare', '02', 'history', 'history-compare'] as const;
export type ChartColor = (typeof CHART_COLORS)[number];
