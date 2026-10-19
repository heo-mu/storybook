# F69 — 12px 모서리 사용 범위와 토큰 제안 (2026-10-19)

Figma 파일 전체 페이지를 읽기 전용으로 조회해 모서리 12px인 노드를 모두 찾았습니다. 토큰 · 코드는 바꾸지 않았습니다.

## 사용 현황

| 페이지 | 노드 수 | 위치 | 바인딩 |
| --- | --- | --- | --- |
| 🔵 Ver 0.4 | 5 | `metric-card`(컴포넌트), `dashboard-filter-bar`(컴포넌트), Chart 섹션의 `chart-panel` 예시 프레임 3개 | 원격 `radius/xlarge1` 4, 바인딩 없음 1(chart-panel 400×252) |
| legacy | 29 | 데이터 대시보드 · JH × shadcn 19, 입주민 관리_수정 5, 에너지 절약 프로그램 등록 2, Slider 디자인 대안 2, 아웃라인형 1 | 모두 원격 `radius/xlarge1` |
| Cover | 0 | | |

- 로컬 모서리 토큰: 0 · 2 · 4 · 5 · 6 · 8 · 10(`rounded-lg`) · 14(`rounded-xl`) · 18 · 22 · 26 · full — **12 없음**.
- 12px는 원격 라이브러리(shadcn 계열 화면 예시와 같은 출처)의 `radius/xlarge1`이며, 컴포넌트 라이브러리 안에서는 **대시보드 카드형 컨테이너 2종**에만 쓰입니다.
- 같은 카드형인 로컬 `Card`(185:6512)는 `rounded-lg`(10)입니다 — 같은 성격의 컨테이너가 10과 12로 나뉘어 있습니다.
- 같은 두 컴포넌트는 padding(`padding/6` 16) · 배경(`color/background/white`)도 원격 변수입니다.

## 코드 현재 처리

`MetricCard` · `DashboardFilterBar`의 모서리를 Figma 값 그대로 `12px`(토큰 없는 값)로 씁니다. padding은 같은 값의 로컬 `p-4`, 배경은 `colors/surface/page`.

## 제안 (결정 필요)

| 안 | 내용 | 영향 |
| --- | --- | --- |
| **A. 로컬 토큰 추가 (권장)** | Primitive에 `border-radius/rounded-[12px]` = 12 추가(기존 `rounded-[2px]` · `rounded-[5px]`와 같은 이름 규칙), 두 컴포넌트와 chart-panel을 다시 바인딩 | 화면 변화 없음. 코드는 `12px` → `var(--border-radius-rounded-\[12px\])` 한 줄씩. 원격 의존 1개 제거 |
| B. 기존 토큰으로 통일 | `rounded-lg`(10, Card와 같음) 또는 `rounded-xl`(14)로 재바인딩 | 대시보드 카드 모서리가 바뀜(재검증 필요). 카드형 모서리가 하나로 통일됨 |
| C. 현 상태 유지 | 원격 변수 그대로, 코드는 12px 값 | 원격 라이브러리 변경을 추적할 수 없음 |

A안이 화면을 바꾸지 않고 원격 의존을 없애는 최소 변경입니다. 카드형 모서리를 통일하려는 디자인 의도가 있다면 B안입니다.
어느 쪽이든 결정 후 `figma/` 스냅샷 재추출 → `npm run tokens` → 두 컴포넌트 CSS 수정 → `verify:all` 순서로 반영합니다.
