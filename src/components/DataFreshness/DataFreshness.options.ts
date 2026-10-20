/** 데이터 수신 상태 — 최근 수신(fresh) · 수신 지연(stale) · 연결 끊김(offline) */
export const DATA_FRESHNESS_STATES = ['fresh', 'stale', 'offline'] as const;
export type DataFreshnessState = (typeof DATA_FRESHNESS_STATES)[number];
