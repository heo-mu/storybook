# F65 — 차트 비교 막대와 범례 색이 다른 원인 (2026-10-19)

Figma `chart`(698:4399)를 읽기 전용으로 조회해 막대 · 범례 · 툴팁의 색 바인딩을 비교했습니다. 코드는 바꾸지 않았습니다.

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

- 지금은 **Figma 변형 그대로**(가로 막대 비교 막대 `simple/history`, 범례 · 툴팁 `series/compare`)입니다. 새 색 정책을 코드에서 정하지 않았습니다.
- Figma에서 가로 막대 비교 막대를 `series/compare`로 고치면, 코드 변경은 `Chart.tsx`의 `markColor` 한 줄(가로 막대 예외 삭제)과
  검증 기준 재캡처입니다.

## 요청 사항 (디자인)

1. 가로 막대 · 기본 · Group=yes의 비교 막대 5개를 `chart/series/compare`로 다시 바인딩(또는 범례 · 툴팁을 `simple/history`로 — 의도 확인).
2. 간단 스타일 Group=no의 지난 기간 색을 세로 · 가로 중 하나로 통일할지 결정.
3. 그라디언트 두 번째 정지점에 변수 바인딩(선택).
