# Changelog

[Semantic Versioning](https://semver.org/)을 따릅니다. 버전 규칙과 업데이트 절차는 [docs/developer-guide.md](docs/developer-guide.md#7-버전-관리와-업데이트-절차).
아직 레지스트리에 배포하지 않았습니다(`"private": true`).

## [Unreleased]

첫 배포 버전 제안: **0.1.0**(외부 배포 전이므로 아래 변경을 첫 버전에 포함) — [docs/breaking-changes.md](docs/breaking-changes.md).

### 호환성 변경 (Figma 동기화 2026-10-19 — F31)
- **토큰 CSS 변수 삭제 · 이름 변경 17개**: `--colors-button_text-*` 12개 → `--colors-button_text-primary-*`(Secondary는 `-secondary-*` 새로 추가),
  `--colors-accordion-border-focus` → `--colors-accordion-border-hover`, `--colors-button-primary-{solid,outline}-border-{default,disabled}` 4개 삭제
  (Figma에서 변수 삭제). 별칭은 두지 않습니다.
- `BUTTON_TONES`에 Secondary · Solid 추가(3번째) — 이제 내부 API.

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
- 공통 토큰 `--border-radius-rounded-\[12px\]`(F69, Figma 등록 대기 — `figma-pending/primitive.txt`). MetricCard · DashboardFilterBar가 사용.
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
