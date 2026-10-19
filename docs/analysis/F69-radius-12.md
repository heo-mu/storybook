# F69 — 12px 모서리 사용 범위와 토큰 제안 (2026-10-19)

Figma 파일 전체 페이지를 읽기 전용으로 조회해 모서리 12px인 노드를 모두 찾았습니다.

> **2026-10-19 (최종 배포 준비) — A안 적용**: 공통 토큰 `border-radius/rounded-[12px]` = 12 (`--border-radius-rounded-\[12px\]`)을 추가하고
> `MetricCard` · `DashboardFilterBar`가 사용합니다. Figma에는 아직 없어 **Figma 등록 대기** 토큰으로 관리합니다 — [적용 내용](#적용-내용-2026-10-19).

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

## 적용 내용 (2026-10-19)

| 항목 | 내용 |
| --- | --- |
| 이름 | `border-radius/rounded-[12px]` → CSS `--border-radius-rounded-\[12px\]` (로컬 `rounded-[2px]` · `rounded-[5px]`와 같은 규칙, Tailwind 미사용) |
| 원본 위치 | `figma-pending/primitive.txt` — Figma 스냅샷(`figma/`)과 체크섬에는 들어가지 않음. `npm run tokens`가 `primitive.css` 끝에 별도 블록으로 내보내고 `tokens.json`에 `"pending"` 표시 |
| 사용처 | `MetricCard.css` · `DashboardFilterBar.css` (`12px` → 토큰). 화면 변화 없음 — 두 컴포넌트 Chromium · Firefox · WebKit 정합성 통과 |
| Figma 등록 후 | Figma에 같은 이름의 로컬 변수가 생기고 스냅샷을 다시 추출하면 `npm run tokens`가 이름 중복으로 실패 → `figma-pending/primitive.txt`에서 해당 줄 삭제 |

## Figma 등록 (2026-10-19 완료)

Figma Primitive에 `border-radius/rounded-[12px]`(`VariableID:1033:6620`)를 등록하고 본 페이지 5개 노드를 다시 연결했습니다(legacy 인스턴스 10개는 자동).
`figma-pending/primitive.txt`의 항목은 지웠고 토큰은 스냅샷에서 생성됩니다. 아래는 등록 전 요청 내용입니다.

## Figma 등록 요청 (원본은 수정하지 않음 — 당시)

1. **Primitive** 컬렉션(`border-radius/*`)에 `border-radius/rounded-[12px]` = 12, 범위 `CORNER_RADIUS` 추가.
2. 아래 노드의 모서리를 원격 `radius/xlarge1`(`VariableID:51661197e51223702f7df7f651a203c9ea6ec323/138:631`)에서 새 변수로 다시 바인딩.

**🔵 Ver 0.4 (0:1)** — 5개

| 노드 ID | 종류 · 이름 | 크기 | 현재 | 위치 |
| --- | --- | --- | --- | --- |
| 697:4487 | COMPONENT `metric-card` | 386×136 | 원격 `radius/xlarge1` | Dashboard components 728:25472 › Dashboard/v1 697:4143 |
| 698:4163 | COMPONENT `dashboard-filter-bar` | 1616×68 | 원격 `radius/xlarge1` | Dashboard components 728:25472 › Dashboard/v1 697:4143 |
| 773:6944 | FRAME `chart-panel` | 1024×364 | 원격 `radius/xlarge1` | Component 58:5174 › Chart 773:6723 |
| 773:7038 | FRAME `chart-panel` | 568×364 | 원격 `radius/xlarge1` | Component 58:5174 › Chart 773:6723 |
| 773:9908 | FRAME `chart-panel` | 400×252 | **바인딩 없음**(값 12) | Component 58:5174 › Chart 773:6723 |

**legacy (684:6491)** — 29개, 모두 원격 `radius/xlarge1`. `metric-card` · `dashboard-filter-bar` 인스턴스(773:13550 · 773:13552–13555 · 868:10955 · 868:10957–10960)는
컴포넌트를 다시 바인딩하면 따라 바뀝니다(덮어쓰기가 없다면).

| 최상위 프레임 | 노드 ID |
| --- | --- |
| Slider · 디자인 대안 2종 684:6492 | 684:6501, 684:6551 |
| A · 아웃라인형 684:6597 | 684:6601 |
| 입주민 관리_수정 773:12349 | 773:12369, 773:12380, 773:12454 |
| 입주민 관리_수정 773:12493 | 773:12523, 773:12651 |
| 에너지 절약 프로그램 등록 · 컴포넌트 적용안 773:12707 | 773:12751, 773:12775 |
| 데이터 대시보드 · JH × shadcn 773:13510 | 773:13550, 773:13552, 773:13553, 773:13554, 773:13555, 773:13557, 773:13569, 773:13582, 773:13617 |
| 데이터 대시보드 · JH × shadcn 868:10915 | 868:10955, 868:10957, 868:10958, 868:10959, 868:10960, 868:10962, 868:10974, 868:10988, 868:10993, 868:11021 |
