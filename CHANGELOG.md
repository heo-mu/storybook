# Changelog

[Semantic Versioning](https://semver.org/)을 따릅니다. 버전 규칙과 업데이트 절차는 [docs/developer-guide.md](docs/developer-guide.md#7-버전-관리와-업데이트-절차).
아직 레지스트리에 배포하지 않았습니다(`"private": true`).

## [Unreleased]

첫 배포 버전 제안: **0.1.0**(외부 배포 전이므로 아래 변경을 첫 버전에 포함) — [docs/breaking-changes.md](docs/breaking-changes.md).

### 코드 정책 → Figma 공식 정책 (2026-10-19, Figma와 함께)
코드에만 있던 정책 152개를 Figma에 정의하거나(변형 · 속성 · 변수 · 스타일 39개, Design System Rules 02–09장 · 주석 96개) 개발 구현(15개)으로
나누었습니다. 남은 Figma 반영 대기 2개. 목록 · 출처 · 상태: [docs/code-policy-audit.md](docs/code-policy-audit.md).
- **Added**: 토큰 `--colors-border-focus`(brand/700) · `--colors-dialog-scrim-default`(→ `surface/scrim`). Storybook **Foundations / Focus**.
- **포커스 표시**: 모든 포커스 가능한 컨트롤에 키보드 포커스 링(2px `colors/border/focus`, 바깥 2px — 폭을 채우는 행은 안쪽) — Figma 속성 `Focus`.
  Select 닫힌 상태는 Figma State=Focus 테두리. 마우스 클릭에는 그리지 않습니다.
- **Dialog**: 모달 덮개 검정 50%(`colors/dialog/scrim/default`). 토큰 `--colors-surface-scrim` 검정 90% → 50%.
- **Toast**: 한 번에 최대 3개(이전 5), `showToast`의 `status: 'error'` 기본 `timeout`이 `null`(닫을 때까지 유지), 같은 문구 · 상태는 보이는 토스트를 대체.
- **Tooltip**: `delay` 기본값 1500 → 500ms(키보드 포커스는 그대로 즉시).
- **CheckboxGroup · RadioGroup**: 항목 간격 세로 8px · 가로 16px(이전 0 — `style` · `className`으로 준 간격은 그대로 우선).
- **토큰 값**: `--typography-sm-leading-normal-underline-line-height` 140% → 20px(`leading-5`, Link md — 화면은 이미 20px 줄).
- 문서: 모든 Usage의 "코드 정책" 절을 **정책** 절(Figma 정의 · Figma 문서화 · 개발 구현 세부 · Figma 반영 대기)로 재분류.

### 호환성 변경 (Figma 동기화 2026-10-19 — F31)
- **토큰 CSS 변수 삭제 · 이름 변경 17개**: `--colors-button_text-*` 12개 → `--colors-button_text-primary-*`(Secondary는 `-secondary-*` 새로 추가),
  `--colors-accordion-border-focus` → `--colors-accordion-border-hover`, `--colors-button-primary-solid-border-{default,disabled}` · `--colors-button-primary-outline-border-disabled` 3개 삭제
  (`--colors-button-primary-outline-border-default`는 Figma 복구로 유지)
  (Figma에서 변수 삭제). 별칭은 두지 않습니다.
- `BUTTON_TONES`에 Secondary · Solid 추가(3번째) — 이제 내부 API.

### 호환성 변경 — 토큰 이름 규칙 (F81)
- 대괄호가 들어간 Figma 변수 이름은 대괄호를 뺀 CSS 변수로 생성합니다(이스케이프 불필요):
  `--border-radius-rounded-\[2px\]` → `--border-radius-rounded-2px`, `\[5px\]` → `5px`, `\[12px\]` → `12px`. 별칭은 두지 않습니다(배포 전).

### Chart — Component 토큰 · hover 변형 (F78 · F79, 2026-10-19 정합성 개선)
- **Added**: Chart Component 토큰 19개 `--colors-chart-{bar,line,point,plot,label,legend,tooltip}-*`(`src/tokens/components/chart.css`, Figma
  `colors/chart/*` Component 변수). `Chart` · `ChartLegendItem` · `ChartTooltip`의 모든 색이 이 토큰을 씁니다.
- **동작 변경**: 간단 스타일(`variant="simple"`)도 호버 · 탭 · 키보드로 항목을 표시합니다(Figma hover=yes) — 그림 영역이 초점을 받는
  `role="group"`이 됨. 기본 스타일 포함 감지 영역은 데이터 영역만(값 눈금 열 · 가로 막대 눈금 줄 제외), 터치로 탭하면 표시되고 바깥을 누르면 닫힘.
- **화면 변경**: 간단 막대 현재 기간 비교 #0086d3 → #d6dae0(Figma `series/compare`), 간단 세로 막대 Group=no 지난 기간 #d6dae0 → #e2e5e9
  (가로와 같은 `bar/history`), 간단 선 마지막 점은 일반 점(빈 원은 활성 항목), 강조 영역 크기 Figma대로(세로 막대 Group=no 40px · 가로 막대
  32 · 46px 높이 · 간단 48 · 28px).
- `ChartLegendItem type="dash-line"`의 `color` 기본값 `brand` → `02`(Figma 메인 컴포넌트 `line/compare`).

### 접근성 — 색 대비 (A-1 · A-2, 2026-10-19, Figma와 함께 수정)
- **토큰 값 변경**: Theme `brand-status/{point,success,warning,danger,error,information}/strong` 600 → 700, Semantic `text/tertiary` ·
  `text/placeholder` gray/500 · 400 → gray/600, `fill/secondary/strong/hover` · `pressed` brand/600 · 500 → brand/800 · 900.
- **Added**: Semantic `--colors-text-inactive`(gray/400) — 비활성 라벨(Button · TextButton · Chip · Table 편집 칸 · FileUploader · Accordion).
- **Component 토큰 별칭 변경**: 입력 칸(Input · Textarea · Select · DatePicker · SearchField Outline) · Checkbox · Radio 테두리 default/completed/read-only
  `border/gray` · hover `border/gray-dark`, Switch 꺼짐 트랙 500 · 600 · 700, Switch Disabled 라벨 `text/disabled`, EmptyState 제목 `text/secondary` ·
  설명 `text/tertiary`, Stepper 잠긴 설명 `text/tertiary`. MetricTrend Disabled 글자 `text/secondary`, 필터 막대 `|` `border/gray-subtle`.
- 결과: axe 색 대비 423 → 0(알려진 대비 목록 삭제 — 이제 실패로 처리), 컨트롤 경계 2.35 → 3.87:1. 전후 표: [docs/accessibility.md](docs/accessibility.md).

### Fixed
- Component 토큰 파일 머리 주석이 `*/`로 일찍 닫혀 Button 외 Component 토큰 `:root` 규칙이 브라우저에서 버려지던 문제(F81 작업에서 생김, 같은 날 수정).

### Figma 수정 반영 (2026-10-19, [docs/figma-fix-requests.md](docs/figma-fix-requests.md))
- 화면 변화 없는 바인딩 복구: Button Primary · Outline 테두리가 `--colors-button-primary-outline-border-default` 사용(리터럴 #004a38 제거),
  12px 모서리는 Figma 변수에서 생성(등록 대기 목록 비움), `sm/leading-normal/underline`의 자간 · 굵기가 변수 참조(값 같음).
- Table 편집 칸 Filter · Editing 칩이 Selected(쇼케이스 · 기준 이미지).
- Chart 가로 막대 비교 막대: 원본이 `chart/series/compare`로 고쳐져 코드와 일치(개별 기준 이미지).

### 화면 변경
- **Button · IconButton Tertiary / Solid 배경**(Figma 2026-10-19 수정): 새 Semantic 토큰 `colors/fill/tertiary/*` — Default #f5f6f7 → #e9ebee,
  Hover #eff0f3 → #dcdfe4, Pressed #e9ebee → #d0d4db(Disabled 그대로). 페이지 대비 1.06 → 1.17:1 — [docs/analysis/tertiary-fill-2026-10-19.md](docs/analysis/tertiary-fill-2026-10-19.md).
- `fill/secondary/subtle/hover` #f9fafb → #f5f6f7(Figma에서 변경됨) — Button Tertiary / Outline Hover, Navigation 항목 Hover.
- Hover 배경(`fill/primary/subtle/hover`) #f9fafb → #f5f6f7 — Button Outline · TextButton · Checkbox · Radio · Chip · DatePicker · Link · Pagination · Select · Tabs · Table · Accordion.
- **TextButton** `variant="secondary"`: 글자 · 아이콘이 Primary보다 한 단계 연함(Figma `button_text/secondary`).
- **Accordion**: 모든 크기 Hover 배경, 펼친 항목 구분선 `border/hover`, Disabled 배경 `fill/disabled` · 제목 `text/placeholder`(F50 해소).
- **Chart**: 가로 막대 기본 스타일 비교 막대를 범례 · 툴팁과 같은 `chart/series/compare`로(F65 — Figma 수정 요청).

### Added
- 토큰 `--colors-fill-tertiary-default` · `-hover` · `-pressed`(Figma Semantic, Primitive gray/150 · 225 · 275 별칭).
  `--colors-button-tertiary-solid-background-{default,hover,pressed}`는 이 토큰의 별칭으로 바뀜(이름 그대로).
- Storybook **Components / Button / Tertiary Background** — Tertiary 배경 변경 전후 비교.
- **Button · IconButton**: Secondary · Solid(Figma 56개 변형, 352개 전체). `appearance`를 생략하면 Secondary는 이전처럼 Outline.
- `closeToast(key)` — `showToast()`가 돌려준 토스트를 코드에서 닫기.
- 공통 토큰 `--border-radius-rounded-12px`(F69, Figma `border-radius/rounded-[12px]`). MetricCard · DashboardFilterBar가 사용.
- 문서: `docs/public-api.md`(공개 49 · 보조 32 · 사용 금지 내부 API, 자동 생성), `docs/breaking-changes.md`, `docs/figma-fix-requests.md`,
  `docs/release-checklist.md`. `api.md`에 분류 표시.

### Deprecated
- 내부 API로 분류(`@internal`, export는 유지 — 1.0 전 제거 여부 결정): `toastQueue` · `resolveAppearance` · `BUTTON_STATES` · `BUTTON_TONES` ·
  `ButtonToneProps` · `ButtonDisabledProp`, 내부 부품 `PaginationItem` · `PaginationControl` · `BreadcrumbItem` · `BreadcrumbSeparator` ·
  `StepperIndicator` · `StepperConnector` · `NavParentItem`과 그 Props 타입.

### Changed
- **Chart**: 툴팁을 `<body>`로 포털(`position: fixed`)하고, 보이는 그림 영역과 화면 안으로 자동 배치(넘치면 뒤집기 · 가장자리에서 이동, 스크롤 · 창 크기 변경 추적).
  `overflow: hidden` 부모 안에서도 잘리지 않습니다. 테스트에서 툴팁을 찾을 때는 `document`에서 조회하세요.
- **SegmentedControl**: 라벨이 항목 내용 상자보다 넓으면 Figma처럼 좌우 padding까지 쓰고, 항목 전체보다 넓을 때만 말줄임
  (DashboardFilterBar의 "최근 30일"이 잘리던 문제).

### Added
- 개발자 문서: `docs/developer-guide.md`, 자동 생성 API 문서 `docs/api.md`(`npm run docs:api`), Figma 이슈 분류 `docs/figma-issue-triage.md`,
  재분석 `docs/analysis/`(F31 Button 동기화 영향, F65 차트 비교 색, F69 12px 모서리).

## [0.1.0] — 2026-10-16

첫 구현(배포 전). Figma Component 섹션(58:5174)과 Dashboard components 섹션(728:25472) 전체.

### Added
- 디자인 토큰(Figma Variables · Text · Effect Style 스냅샷에서 생성).
- 컴포넌트: Button · IconButton · TextButton, Input · Textarea · SearchField, Select · Checkbox · Radio · Switch · Slider · SegmentedControl ·
  Chip · InputChip · FilterChip, DatePicker · Calendar · FileUploader · Loading, Link · Navigation · Tabs · Pagination · Breadcrumb · Stepper ·
  DropdownMenu, Badge · Progress · Alert · Toast · Tooltip · EmptyState, Dialog · Accordion, Table · KeyValueTable · Card · Chart,
  Skeleton · MetricTrend · DataFreshness · MetricCard · DataState · DashboardFilterBar.
- Figma 정합성 검증(Button 296 + 842 변형, Chromium · Firefox · WebKit), 스토리 테스트, axe 접근성 감사, Storybook MCP.
