/** 데이터 영역 상태 — 불러오는 중 · 빈 상태 · 결과 없음 · 오류 · 권한 없음 · 일부만 표시 */
export const DATA_STATES = ['loading', 'empty', 'no-results', 'error', 'no-access', 'partial'] as const;
export type DataStateValue = (typeof DATA_STATES)[number];
