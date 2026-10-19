# F65 — 차트 비교 막대와 범례 색이 다른 원인 (2026-10-19)

Figma `chart`(698:4399)를 읽기 전용으로 조회해 막대 · 범례 · 툴팁의 색 바인딩을 비교했습니다.

> **2026-10-19 (최종 배포 준비)**: 코드에서 가로 막대 · 기본 · Group=yes의 비교 막대를 범례 · 툴팁과 같은 `chart/series/compare`로 통일했습니다.
> Figma 원본은 수정하지 않았고, 고칠 노드와 변수는 아래 [Figma 수정 요청](#figma-수정-요청-정확한-노드--변수)에 있습니다. 간단 스타일(F65-b)은 그대로입니다.

## 결론

| 위치 | 판정 | 근거 |
| --- | --- | --- |
| **가로 막대 · 기본 스타일 · Group=yes의 비교(이전 기간) 막대** | **Figma 수정 필요** (바인딩 오류로 판단) | 같은 차트의 범례 · 툴팁, 세로 막대의 비교 막대는 모두 `chart/series/compare`. 이 막대만 간단 스타일 전용 이름인 `chart/simple/history`이고, 그라디언트 변환 값이 간단 스타일 가로 막대의 지난 기간 막대와 똑같음(복사해 온 흔적) |
| 간단 스타일 · Group=no의 지난 기간 막대(세로 `series/compare` · 가로 `simple/history`) | **디자인 결정 필요** | 두 방향이 다른 색을 쓰지만 이를 설명하는 범례 · 정의가 없음. 어느 쪽이 의도인지 Figma만으로 판단 불가 |
| 그라디언트 끝 색(40%) | Figma 정리 권장 | 모든 막대의 두 번째 색 정지점이 변수 없이 지정(색 · 투명도만 같음) |

## 바인딩 비교

| 차트 | 첫 계열 막대 | 비교 · 지난 기간 막대 | 범례 | 툴팁 표시 |
| --- | --- | --- | --- | --- |
| 세로 막대 · 기본 · Group=yes | `series/brand` | `series/compare` | brand · compare | brand · compare |
| **가로 막대 · 기본 · Group=yes** | `series/brand` | **`simple/history`** | brand · **compare** | brand · **compare** |
| 세로 막대 · 간단 · Group=no | 현재 `series/brand` | 지난 `series/compare` | — | — |
| 가로 막대 · 간단 · Group=no | 현재 `series/brand` | 지난 `simple/history` | — | — |
| 세로 · 가로 막대 · 간단 · Group=yes | 현재 `series/brand` · `series/02` | 지난 `simple/history` · `simple/history-compare` | — | — |

그라디언트 변환(막대 방향 · 범위) 비교: 가로 막대 기본의 비교 막대 `[[-1,0,1],[0,0,0.5]]`는 간단 스타일 가로 막대의 지난 기간 막대와 같고,
같은 차트의 현재 막대(`[[-1,0,1],[0,-0.1,0.55]]`)와 다릅니다. 세로 막대 기본의 비교 막대는 간단 스타일 세로 막대 Group=no와 같은 변환을 씁니다.

변수 정의: `chart/series/*`는 데이터 계열 색(설명 없음), `chart/simple/*`는 이름상 간단 스타일 전용입니다(설명 · 용도 표기 없음).
`series/compare` = brand-gray/250(#d6dae0), `simple/history` = brand-gray/200(#e2e5e9)로 막대와 범례의 색이 한 단계 다르게 보입니다.

## 코드 처리

- **2026-10-19부터**: `Chart.tsx`의 `markColor`에서 가로 막대 예외를 지워 기본 스타일 비교 막대는 방향과 관계없이 `series/compare`(#d6dae0)입니다.
  범례 · 툴팁과 같은 색이고, 세로 막대 기본과도 같습니다.
- 간단 스타일(Group=no 지난 기간: 세로 `series/compare` · 가로 `simple/history`)은 **Figma 그대로** 둡니다(디자인 결정 필요 — F65-b).
- 검증: 원본 기준 이미지는 아직 `simple/history`(#e2e5e9)로 그려져 있지만 채널 차 12의 그라디언트라 픽셀 임계값 안이어서 마스크 없이 통과합니다
  (`figma/verify/chart.json`의 `//F65` 메모). 원본이 고쳐지면 기준 이미지만 다시 캡처하면 됩니다.

## Figma 수정 요청 (정확한 노드 · 변수)

대상 변형: `chart` 세트 698:4399 › **733:4930** `Type=Bar Horizontal, Style=Default, Group=yes`

| 노드 ID | 경로(변형 기준) | 현재 채우기 | 요청 |
| --- | --- | --- | --- |
| 733:4967 | Category / 101동 / … / Bar / 101동 / previous / 396 | GRADIENT_LINEAR: 정지점 0 `colors/chart/simple/history`, 정지점 1 바인딩 없음 #e2e5e9 · 40% | 정지점 0 → `colors/chart/series/compare`, 정지점 1 → #d6dae0 · 40%(세로 막대 비교 막대와 같게) |
| 742:31980 | Category / 102동 / … / previous / 396 | 같음 | 같음 |
| 742:31986 | Category / 103동 / … / previous / 396 | 같음 | 같음 |
| 742:31992 | Category / 104동 / … / previous / 396 | 같음 | 같음 |
| 742:31998 | Category / 105동 / … / previous / 396 | 같음 | 같음 |

| 변수 | ID | Key | 컬렉션 | 값 |
| --- | --- | --- | --- | --- |
| 현재: `colors/chart/simple/history` | `VariableID:762:5825` | `deba2c0811f778e64c56899340f6260fdac3c0a5` | Semantic | → `colors/brand-gray/200` (#e2e5e9) |
| 목표: `colors/chart/series/compare` | `VariableID:697:4134` | `ec44aa6a989669fd9f0288d85a8a536bb69f5385` | Semantic | → `colors/brand-gray/250` (#d6dae0) |

같은 변형의 범례(`chart-legend-item` 746:33346, 견본 `I746:33346;746:33293`)와 툴팁 표시(`I742:31704;693:9774`)는 이미 `series/compare`입니다.

## 요청 사항 (디자인)

1. 가로 막대 · 기본 · Group=yes의 비교 막대 5개를 `chart/series/compare`로 다시 바인딩(또는 범례 · 툴팁을 `simple/history`로 — 의도 확인).
2. 간단 스타일 Group=no의 지난 기간 색을 세로 · 가로 중 하나로 통일할지 결정.
3. 그라디언트 두 번째 정지점에 변수 바인딩(선택).
