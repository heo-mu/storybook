# 호환성 변경 분석과 버전 정책 (2026-10-19)

2026-10-19 Figma 동기화(F31) · F65 · F69 · 공개 API 정리로 생긴 변경을 **호환성 관점**에서 정리하고 첫 배포 버전 정책을 제안합니다.
비교 기준은 안정화 작업 완료 시점(커밋 `2a48ded`)과 현재입니다. 패키지는 아직 **외부에 배포한 적이 없습니다**(`package.json` 0.1.0, npm 미게시).

## 1. 토큰 CSS 변수

`node`로 두 시점의 `src/tokens/tokens.json`을 비교한 결과입니다.

| 구분 | 개수 | 호환성 |
| --- | ---: | --- |
| 삭제 · 이름 변경 | 17 → **16** | **깨짐** — 앱 CSS가 이 이름을 쓰면 값이 사라짐(2026-10-19 오후 R1로 1개 복구) |
| 추가 | 26 | 호환 (Figma 25 + 등록 대기 1) |
| 값 변경 — 정의 자체 | 9 | 화면 변경 |
| 값 변경 — 별칭을 따라 | 16 | 화면 변경 (`fill/primary/subtle/hover` #f9fafb → #f5f6f7) |

### 삭제 · 이름 변경 (17)

| 이전 | 이후 | 값 |
| --- | --- | --- |
| `--colors-accordion-border-focus` | `--colors-accordion-border-hover` | 같음(#131c2b) |
| `--colors-button_text-{background,label,icon}-{default,hover,pressed,disabled}` (12) | `--colors-button_text-primary-…` (같은 꼬리) | 같음(단 `background-hover`는 #f5f6f7) |
| | `--colors-button_text-secondary-…` (12, 새로 추가) | Secondary 글자 · 아이콘이 한 단계 연함 |
| `--colors-button-primary-outline-border-default` | **복구됨** — 2026-10-19 Figma에 같은 이름 · 별칭으로 재생성(R1), 이름 · 값 그대로 | #004a38 |
| `--colors-button-primary-outline-border-disabled` | 대응 없음 | #d6dae0 |
| `--colors-button-primary-solid-border-default` | 대응 없음 | #004a38 |
| `--colors-button-primary-solid-border-disabled` | 대응 없음 | #d6dae0 |

### 값 변경 — 정의 자체 (9)

| 변수 | 이전 | 이후 |
| --- | --- | --- |
| `--colors-fill-primary-subtle-hover` | gray/50 #f9fafb | gray/75 #f5f6f7 |
| `--colors-accordion-background-disabled` | fill/transparent (투명) | fill/disabled #d6dae0 |
| `--colors-accordion-title-disabled` | text/disabled #c9ced6 | text/placeholder #a1a8b5 |
| `--colors-button-primary-solid-icon-default` | text/inverse | icon/inverse (값 같음 #fdfdfd) |
| `--colors-button-secondary-solid-background-{default,hover,pressed}` | 회색 #f5f6f7 · #eff0f3 · #e9ebee | 녹색 #007c56 · #009b68 · #02bb7b |
| `--colors-button-secondary-solid-{label,icon}-default` | #404b5d | #fdfdfd |

`secondary-solid-*`는 이전에 쓰는 컴포넌트가 없던 변수입니다(이전 Figma에 Secondary · Solid 변형 없음).

### 값 변경 — 별칭을 따라 (16)

`fill/primary/subtle/hover`를 쓰는 Hover 배경: Accordion, Button Primary · Secondary Outline, Checkbox, Radio, Chip, Chip Filter,
Date Picker(navigation · day), Link, Pagination(item · control), Select option, Tab filled(2), Table 행 — 채널당 4단계 어두워짐.

### 2026-10-19 오후 — Tertiary 배경 토큰(Figma 수정)

| 변경 | 내용 | 호환성 |
| --- | --- | --- |
| 추가 3 | `--colors-fill-tertiary-default · hover · pressed` (#e9ebee · #dcdfe4 · #d0d4db) | 호환 |
| 값 변경 3 | `--colors-button-tertiary-solid-background-{default,hover,pressed}` → 위 토큰의 별칭(이름 그대로) | 화면 변경 |
| 값 변경 1 | `--colors-fill-secondary-subtle-hover` #f9fafb → #f5f6f7(Figma에서 변경) | 화면 변경 |

삭제 · 이름 변경은 없습니다 — [분석](./analysis/tertiary-fill-2026-10-19.md).

### 2026-10-19 — 토큰 이름 규칙 (F81)

| 이전 | 이후 |
| --- | --- |
| `--border-radius-rounded-\[2px\]` | `--border-radius-rounded-2px` |
| `--border-radius-rounded-\[5px\]` | `--border-radius-rounded-5px` |
| `--border-radius-rounded-\[12px\]` | `--border-radius-rounded-12px` |

토큰 생성기가 Figma 이름의 `[값]`을 `값`으로 바꿉니다(이스케이프가 필요한 CSS 변수 이름 제거). 코드 안의 사용처 3곳(Chart · MetricCard · DashboardFilterBar)은 함께 바꿨고,
배포 전이라 이전 이름의 별칭은 두지 않습니다. 앱 CSS에서 이전 이름을 썼다면 위 표대로 바꾸면 됩니다.

### 2026-10-19 — Chart Component 토큰 (F78)

Chart 전용 토큰 19개 추가(호환): `--colors-chart-bar-{primary,compare,history,history-compare}`, `--colors-chart-line-{primary,compare}`,
`--colors-chart-point-{border-default,background-hover}`, `--colors-chart-plot-{grid-default,axis-default,baseline-default,guide-hover,highlight-hover}`,
`--colors-chart-label-default`, `--colors-chart-legend-label-default`, `--colors-chart-tooltip-{background,title,label,value}-default`.
기존 Semantic `--colors-chart-*` 변수는 그대로입니다.

### 2026-10-19 — 색 대비 (A-1 · A-2)

| 변경 | 내용 | 호환성 |
| --- | --- | --- |
| 추가 | `--colors-text-inactive` | 호환 |
| 값 변경 — 정의 | `--colors-brand-status-*-strong` 6개(700), `--colors-text-tertiary` · `--colors-text-placeholder`(#596475), `--colors-fill-secondary-strong-hover` · `-pressed`(#006247 · #004a38) | 화면 변경 — 이 변수를 따르는 모든 토큰 |
| 값 변경 — 별칭 | 비활성 라벨 15개 → `text-inactive`(값 그대로 #a1a8b5), 입력 칸 · Checkbox · Radio 테두리 → `border-gray` / `border-gray-dark`, Switch 트랙 · Disabled 라벨, EmptyState 제목 · 설명, Stepper 잠긴 설명 | 화면 변경(테두리 #a1a8b5 → #778191 등) |

앱 CSS에서 `--colors-text-placeholder`를 비활성 글자에 썼다면 `--colors-text-inactive`로 바꾸면 이전 색이 유지됩니다.

## 2. 컴포넌트 API

| 변경 | 종류 | 호환성 |
| --- | --- | --- |
| `Button` · `IconButton`: `variant="secondary" appearance="solid"` 허용 | 추가 | 호환. `appearance` 생략 시 Secondary는 이전처럼 Outline |
| `BUTTON_TONES`에 `{ secondary, solid }` 추가(3번째) | 상수 변경 | 위치로 읽는 코드는 깨짐 — 이제 **내부 API**(스토리 · 검증용) |
| `closeToast(key)` 추가 | 추가 | 호환. `toastQueue`는 **내부 API**로 분류(여전히 export) |
| 내부 부품 7 · 내부 API 13 분류 | 문서 · JSDoc `@internal` | export는 그대로 — 제거는 결정 D5 |
| `Chart variant="simple"`: 그림 영역이 초점을 받고 호버 · 탭 · 키보드로 툴팁 표시(F79) | 동작 추가 | 호환(Props 같음). 간단 차트가 Tab 순서에 들어감 |
| `ChartLegendItem type="dash-line"` `color` 기본값 `brand` → `02` | 기본값 변경 | `color`를 넘기지 않은 dash-line 범례만 색이 바뀜 |

## 3. 화면(시각) 변경

| 대상 | 변경 |
| --- | --- |
| `TextButton variant="secondary"` | 글자 #404b5d → #778191, 아이콘 #778191 → #a1a8b5 (Hover · Pressed도 한 단계 연함) |
| `Accordion` | Hover 배경이 모든 크기에서 보임, 펼친 항목 구분선 진하게, Disabled 회색 배경 · 제목 #a1a8b5 |
| `Chart` 가로 막대 · 기본 비교 막대 | #e2e5e9 → #d6dae0 (범례 · 툴팁과 같은 색) |
| `Chart` 간단 막대 현재 기간 비교 | #0086d3 → #d6dae0 (Figma 원본 변경) |
| `Chart` 간단 세로 막대 Group=no 지난 기간 | #d6dae0 → #e2e5e9 (세로 · 가로 같은 규칙, F78) |
| `Chart` 간단 선 마지막 점 | 빈 원 → 일반 점(빈 원은 활성 항목) |
| 상태 색(안내 · 성공 · 경고 · 포인트 · 위험 · 오류) | 한 단계 진하게(600 → 700) — 메시지 · 배지 · 토스트 · 알림 · 오류 테두리 |
| 보조 · 플레이스홀더 글자 | #778191 · #a1a8b5 → #596475 (비활성 라벨은 #a1a8b5 그대로) |
| 입력 칸 · Checkbox · Radio 테두리, Switch 꺼짐 트랙 | #a1a8b5 → #778191 (hover 한 단계 진하게) |
| Button Secondary · Solid Hover · Pressed | #009b68 · #02bb7b → #006247 · #004a38 |
| `Chart` 호버 강조 영역 | 세로 막대 Group=no 64 → 40px, 가로 막대 행 높이 → 32 · 46px, 간단 스타일 추가 |
| Hover 배경 16곳 | #f9fafb → #f5f6f7 |

## 4. 버전 정책 제안

### 첫 배포

외부 사용자가 없으므로 **위 변경을 모두 "첫 배포 이전 변경"으로 흡수**하고, 동기화된 지금 상태를 첫 버전으로 배포하는 것을 권장합니다.

| 안 | 버전 | 의미 | 권장 |
| --- | --- | --- | --- |
| A | **0.1.0** | 첫 공개. 결정 대기 항목(D3 · F65-b · F79 차트 구조 · F80 Accordion · 내부 export 제거)이 남아 API가 아직 바뀔 수 있음을 표시 | **권장** |
| B | 1.0.0-rc.0 | 1.0 후보. 남은 결정이 API를 바꾸지 않는다는 확신이 있을 때 | |
| C | 1.0.0 | 안정판 선언. 이후 이름 변경은 모두 메이저 | 결정 대기 항목 해소 후 |

- 이전 이름(삭제 17개)에 대한 **별칭은 만들지 않습니다** — 배포된 적이 없는 이름이라 남길 이유가 없고, Figma에 없는 이름을 토큰으로 두지 않는 원칙과도 맞습니다.
  사내 시제품 등에서 로컬 빌드를 쓴 곳이 있다면 위 표로 이름만 바꾸면 됩니다.
- 내부 부품 · 내부 API(20개)는 0.x 동안 export를 유지하고 `@internal`로 표시합니다. **1.0.0 전에 export에서 뺄지 결정(D5)** — 빼는 쪽을 권장합니다.

### 0.x 기간 규칙

| 변경 | 버전 |
| --- | --- |
| 공개 API · 토큰 이름의 삭제 · 변경, 기본값 변경 | 0.**y**.0 (마이너) — CHANGELOG에 "호환성 변경" 표시 |
| Figma 동기화로 인한 값(색 · 크기) 변경 | 0.**y**.0 — "화면 변경" 표시 |
| 추가(컴포넌트 · Prop · 토큰) | 0.**y**.0 |
| 버그 수정, 문서 | 0.y.**z** (패치) |

### 1.0.0 이후 (SemVer)

| 변경 | 버전 | 절차 |
| --- | --- | --- |
| 토큰 CSS 변수 · export 이름 삭제 · 변경, Prop 제거, 기본값 변경 | **메이저** | 직전 마이너에서 예고: 이전 토큰 이름은 새 이름을 가리키는 별칭으로 남기고(`deprecated` 블록), TS export는 `@deprecated` JSDoc |
| Figma 원본 값 변경(색 · 간격) | 마이너 | CHANGELOG "화면 변경" + 영향 컴포넌트 목록, `verify:all` 결과 첨부 |
| 추가 | 마이너 | |
| 수정 | 패치 | |

- 토큰 이름은 Figma 변수 이름에서 만들어지므로, Figma에서 변수 이름을 바꾸면 곧 메이저 변경입니다. Figma 쪽 변경 전에 디자인 · 개발이 함께 확인하는 절차를
  [developer-guide 7절](./developer-guide.md#7-버전-관리와-업데이트-절차)에 두었습니다.
