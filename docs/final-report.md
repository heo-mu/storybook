# 최종 보고 — Platform Web Design System React 컴포넌트

Figma **[Platform] Web Design System**(`Ry3WecA6sP6lKPop1vXrTp`, 페이지 `🔵 Ver 0.4`)의 Component 섹션(58:5174)과
Dashboard components 섹션(728:25472)을 React 라이브러리 + Storybook으로 구현한 결과입니다. (2026-10-16)

Figma 원본은 읽기 전용으로만 조회했고 수정하지 않았습니다. 원격 Push · 배포는 하지 않았고, 커밋은 로컬에만 있습니다.

## 1. 요약

| 항목 | 결과 |
| --- | --- |
| 구현 컴포넌트 | Figma Component Set · Component 74개(Button 3 포함) → React 컴포넌트 44종(+ 하위 부품), Storybook 사용 문서 37쪽 |
| 구현 불가 | Popover · Combobox · Drawer — 작업 중 Figma에서 삭제되어 근거 없음 |
| Figma 정합성 | Button 352 + 그 밖의 857개 변형(Table Textarea 두 줄 3변형은 수동 검토, F58), Chromium · Firefox · WebKit 3개 엔진 모두 통과 — 컴포넌트별 상태 [sync-status.md](./sync-status.md) (2026-10-19 밤) |
| 스토리 테스트 | 90 파일 · 396개 통과 (2026-10-19 밤 Figma × Storybook 전체 동기화 후) |
| 접근성(axe) | 396 스토리 — Storybook 사이드바 경고 0 · 색 대비 0 · 그 밖의 위반 0(axe 기본 규칙, 제외 없음) (A-1 · A-2 수정 · 알려진 위반 목록 없음 — 이전에 따로 둔 react-aria 달력 이름도 원인 수정, [accessibility.md](./accessibility.md)) |
| 빌드 · 타입 · 린트 | typecheck · lint · build · build-storybook 통과 |
| 외부 사용 검증 | `npm pack`(184 파일) → 새 Vite 8 + React 19 + TypeScript 6 프로젝트에 설치, 컴포넌트 · 하위 부품 · 아이콘 · 상수 60여 개 import — strict 타입 검사(패키지 `.d.ts` 포함) · `vite build` · 브라우저 실행(콘솔 오류 0, 폰트 · 토큰 적용) 통과 |
| Storybook MCP | 컴포넌트 매니페스트 44 · 문서 37쪽 조회 가능(검증용 Showcase는 `!manifest`로 제외) |

## 2. 컴포넌트 인벤토리

상세 표: [component-inventory.md](./component-inventory.md) · 엔진별 검증 표: [progress.md](./progress.md#검증-현황)

| Phase | Figma | React | 변형 |
| --- | --- | --- | --- |
| — | Button 3종 | `Button` · `IconButton` · `TextButton` | 296 |
| 1 | Input · Textarea · Search Field | `Input` · `Textarea` · `SearchField` | 21 + 14 + 36 |
| 2 | Select · Checkbox · Radio · Switch · Slider · Segmented Control · Chip | `Select`(+`SelectOption`) · `Checkbox` · `Radio`(+`RadioGroup`) · `Switch` · `Slider` · `SegmentedControl` · `Chip` · `InputChip` · `FilterChip` | 42 + 36 + 24 + 16 + 7 + 21 + 84 |
| 3 | Date Picker · File Uploader · Loading | `DatePicker` · `Calendar` · `FileUploader` · `FileUploaderItem` · `Loading` | 40 + 10 |
| 4 | Link · Navigation · Tab · Pagination · Breadcrumb · Stepper · Dropdown Menu | `Link` · `Navigation`(+`NavLink` · `NavGroup` …) · `Tabs` · `Pagination` · `Breadcrumb` · `Stepper` · `DropdownMenu` | 15 + 12 + 90 + 75 + 18 + 20 + 6 |
| 5 | Badge · Progress · Alert · Toast · Tooltip · Empty State | `Badge` · `BadgeDot` · `BadgeCount` · `Progress` · `Alert` · `Toast`(+`ToastRegion` · `showToast`) · `Tooltip` · `EmptyState` | 119 + 1 + 3 + 3 + 4 + 1 |
| 6 | Dialog · Accordion | `Dialog` · `Accordion` · `AccordionItem` | 1 + 10 |
| 7 | Table · Card · Chart | `Table`(+ Header · Column · Body · Row · Cell) · `KeyValueTable` · `Card`(+ Header · Content · Footer) · `Chart` · `ChartLegendItem` · `ChartTooltip` | 67 + 3 + 16 |
| 8 | Dashboard components | `Skeleton` · `MetricTrend` · `DataFreshness` · `MetricCard` · `DataState` · `DashboardFilterBar`(+ Group · Range) | 4 + 12 + 3 + 1 + 6 + 1 |

## 3. 검증 결과 (최종 실행)

| 검증 | 명령 | 결과 |
| --- | --- | --- |
| Figma ↔ 코드 정합성(전 컴포넌트 × 3 엔진) | `npm run verify:all` | 36개 컴포넌트(71세트 · 842변형) × Chromium · Firefox · WebKit — 108/108 통과 |
| Button 296 변형 + 실제 포인터 상태 | `npm run verify:button` | 296/296(button_basic 160 · button_icon 120 · button_text 16), 실제 포인터 Default · Hover · Pressed 27/27 |
| 스토리 테스트(Vitest + Playwright) | `npm test` | 86 파일 · 370개 통과 |
| 접근성 | `npm run verify:a11y` | 370 스토리 — 그 밖의 위반 0 (알려진 Figma 토큰 대비 400 · react-aria 달력 이름 693, [accessibility.md](./accessibility.md)) |
| 타입 · 린트 · 빌드 | `npm run typecheck` · `lint` · `build` · `build-storybook` | 모두 통과(빌드 시 토큰 재생성 — 변경 없음) |
| 외부 프로젝트 | `npm pack` → 새 Vite + React 19 + TS 프로젝트 | `npm pack`(184 파일) → 새 Vite 8 + React 19 + TypeScript 6 프로젝트에 설치, 컴포넌트 · 하위 부품 · 아이콘 · 상수 60여 개 import — strict 타입 검사(패키지 `.d.ts` 포함) · `vite build` · 브라우저 실행(콘솔 오류 0, 폰트 · 토큰 적용) 통과 |

정합성 검사는 변형마다 크기 · 위치(±0.5px), 글자 밖 픽셀(0.5% 이내), 글자 위치(잉크 중심 ±0.5px)를 Figma 스크린샷과 비교합니다.
엔진 렌더링 차이로 허용치를 넓힌 항목은 각 `figma/verify/*.json`에 이유와 함께 적었고, 정리는 [browser-support.md](./browser-support.md)에 있습니다.

### 수동 검토 항목 (자동 비교에서 일부 제외)

- Chart: 간단 선 차트의 그림 영역(Figma 샘플 점이 기간 가운데에 있지 않음 — F64), 차트 안 툴팁 위치(코드 정책 — F63)
- Table 관리 모드: Textarea 두 줄 변형 3개(F58)
- Card: Figma 프레임이 숨김이라 위치 · 크기만 비교(F61)
- Dashboard Filter Bar: 초기화 버튼(Figma Secondary · Solid는 스냅샷 이후 추가 — F31), "최근 30일" 말줄임(F71)
- Listbox 스크롤 표시(F9), File Uploader 점선(F30), Badge Outline 모서리, Breadcrumb 펼친 메뉴 위치(F33)

## 4. 사용 방법

```bash
npm run build && npm pack          # → platform-design-system-0.1.0.tgz
npm install ../platform-design-system/platform-design-system-0.1.0.tgz   # 사용하는 프로젝트
```

```tsx
import 'platform-design-system/fonts.css';
import 'platform-design-system/styles.css';
import { Chart, MetricCard, MetricTrend } from 'platform-design-system';
```

- 컴포넌트별 사용법 · Props · Figma 대응표: Storybook 각 컴포넌트의 **Usage** 문서(`npm run storybook`)
- AI 도구: Storybook MCP(`http://localhost:6006/mcp`)의 `docs-list` / `docs-show`
- 외부 프로젝트 설정 · 문제 해결: [usage.md](./usage.md), 엔진 지원: [browser-support.md](./browser-support.md), 접근성: [accessibility.md](./accessibility.md)

## 5. 결정이 필요한 항목

> 2026-10-19 갱신: 전체 이슈의 분류(디자인 결정 · 개발 개선 · 허용 차이)는 [figma-issue-triage.md](./figma-issue-triage.md)를 보세요.

Figma에 정의가 없거나 서로 맞지 않아 코드 정책으로 정한 것입니다. 자세한 내용은 [figma-issues.md](./figma-issues.md).

| # | 내용 | 현재 코드 |
| --- | --- | --- |
| F31 | 작업 중 Figma 원본 변경(Button Secondary · Solid 신설 등) 동기화 여부 | **2026-10-19 동기화 완료** — Primary · Outline 테두리 변수만 D1(8절) |
| F33 | Breadcrumb 펼친 상태 표현(Role=Open, 메뉴 위치) | … 버튼이 메뉴를 열고 현재 항목은 Current |
| F44 | Toast 위치 · 간격 · 표시 시간 | 화면 아래 가운데, 간격 m-2, 5초 |
| F48 | Tooltip 거리 · 지연 | 화살표 길이 8px, react-aria 기본 지연 |
| F50 | Accordion Hover 표현이 변형마다 다름 | **해소** — 2026-10-19 Figma에서 통일, 코드 반영 |
| F51 | Dialog 뒤 덮개(scrim) 색 | 투명 |
| F58 | Table 관리 모드 샘플 불일치 | 한 줄 Input · 실제 날짜, 두 줄 변형 수동 검토 |
| F60 | Card 그림자(원격 스타일 10%) | 로컬 elevation-1(12%) |
| F61 | Card 프레임 숨김 | 레이어 값으로 구현 |
| F63 | Chart 툴팁 위치 규칙 | 기준점 오른쪽 p-3(넘치면 왼쪽), 세로 막대는 항목 가운데 · 그림 영역 위 |
| F65 | Chart 비교 계열 색(가로 막대 막대 · 범례 색이 다름) | **기본 스타일은 `series/compare`로 통일**(Figma 수정 요청 R3), 간단 스타일은 결정 대기 |
| F69 | 대시보드 원격 변수(padding 16 · 모서리 12 · 흰 배경) | p-4 · **공통 토큰 `rounded-[12px]`(Figma 등록 대기 R4)** · surface/page |
| F71 | Dashboard Filter Bar 예시 크기(세그먼트 220px) | **해결** — 라벨이 항목 padding까지 사용 |

## 6. 체크포인트 커밋 (로컬)

- `57fa974` chore: scaffold Vite + React + TypeScript (create-vite react-ts)
- `c598f09` chore: set up library build and Storybook 10.6
- `06f70dc` feat(tokens): generate CSS variable tokens from Figma Variables and Styles
- `5ff776f` feat(button): Button, IconButton and TextButton from the Figma Button frame
- `2fcd23a` feat(storybook): connect Storybook MCP and split usage vs. verification stories
- `ac1dc26` fix(button): match Figma geometry to the pixel; resolve prop types in docs
- `c2b75c4` test(button): Figma parity check for all 296 Button variants
- `1f8b3d6` docs: README for the design system package
- `ec47f76` fix(button): explicit cross-browser fallbacks; document disabled prop
- `e632751` test(button): run the Figma parity check in Firefox and WebKit
- `2bed44e` docs: external usage guide, browser support and Figma issue report
- `0c7fcfa` chore(tokens): refresh all Figma component variables; component inventory
- `7398ccb` feat(field): Input, Textarea and SearchField from Figma (Phase 1)
- `6884143` feat(forms): Checkbox, Radio, Switch and Select from Figma (Phase 2, part 1)
- `2a6bb60` feat(forms): Slider and SegmentedControl from Figma (Phase 2, part 2)
- `aacccfe` refactor(slider): derive the number field text instead of syncing it in an effect
- `20f5ffe` feat(forms): Chip, InputChip and FilterChip; Phase 2 complete
- `6e96272` feat(date-picker): DatePicker and Calendar from Figma (Phase 3, part 1)
- `190cd0b` feat(phase3): FileUploader, FileUploaderItem, Loading; Link; token drift analysis
- `628d773` feat(navigation): Tabs and Pagination from Figma (Phase 4, part 2)
- `ff5330b` DropdownMenu: menu panel, items, sections and separator from Figma dropdownmenu_item / dropdownmenu_line
- `64ab4d2` Breadcrumb: breadcrumb, breadcrumb-item and separator from Figma, overflow menu via DropdownMenu
- `08868a1` Navigation: LNB with item_parent / item_link / item_child from Figma
- `f1be53b` Stepper; Phase 4 complete with group QA
- `d685c6c` Badge: badge_status, badge_dot and badge_count from Figma
- `0ca7cb4` Progress: Figma progress on react-aria ProgressBar
- `b876143` docs: fix Progress inventory row
- `b462618` Alert: Figma alert with status icon, title, description and action
- `edc33b2` Alert: move status options and icon map out of the component module (fast refresh)
- `4cc1f6a` Toast: Figma toast, ToastRegion and showToast on react-aria Toast
- `b4f82b5` Tooltip: Figma tooltip on react-aria TooltipTrigger with placement arrows
- `54e8116` EmptyState: Figma empty-state with icon, title, description and action
- `efc0475` Accordion and Dialog (Phase 6); Popover and Drawer recorded as deleted in Figma
- `d3e2288` Phase 5-6 group QA: tests 311, builds, verify:button 296/296, axe 0 other
- `6fb8fbd` Table: data table (header, body cells) and key-value table from Figma
- `4aa3f2f` Table management mode (table_value_editable): editable key-value cells
- `83d218a` docs: fix escaped backticks and list break in Dialog / Table usage pages
- `2cbf370` docs: unescape inline code in Dialog / Table usage pages
- `416d937` Card: Card, CardHeader, CardContent, CardFooter from the Figma card parts
- `4575e59` Chart: line / bar charts (default and simple style), ChartLegendItem, ChartTooltip from the Figma chart set
- `c0f29ff` docs: Phase 7 group verification (Table, Card, Chart, Loading)
- `25fe925` Dashboard components: Skeleton, MetricTrend, DataFreshness, MetricCard, DataState, DashboardFilterBar

## 7. 안정화 (2026-10-19)

신규 컴포넌트 없이 전달 전 안정화를 진행했습니다. 상세는 각 문서에 있습니다.

| 작업 | 결과 |
| --- | --- |
| F31 최신 Button 변경 재분석 | 기존 296 변형: 크기 · 배치 296 동일, 색 260 동일 · 36 다름(Hover 배경 30, TextButton Secondary 6), 새 Secondary · Solid 56 — [분석](./analysis/F31-button-sync.md). 동기화는 결정 대기 |
| Chart 툴팁 자동 위치 | 보이는 그림 영역 · 화면 경계 안으로 자동 배치, `<body>` 포털로 잘림 방지 — 스토리 테스트 3개 추가 |
| F65 원인 | 가로 막대 기본의 비교 막대만 `chart/simple/history`(간단 스타일 막대를 복사한 흔적) → **Figma 수정 필요**로 판단 — [분석](./analysis/F65-chart-compare-color.md) |
| F69 12px 모서리 | 본 페이지 5개 · legacy 29개, 모두 원격 `radius/xlarge1` — 로컬 `rounded-[12px]` 추가 제안 — [분석](./analysis/F69-radius-12.md) |
| "최근 30일" 잘림 | SegmentedControl 라벨이 Figma처럼 항목 padding까지 사용 → 잘림 해소, 해당 라벨 검증 재개 |
| 이슈 분류 | 113개 ID: 디자인 결정 37 · 개발 개선 7(완료 2) · 허용 차이 74 — [분류표](./figma-issue-triage.md) |
| 개발자 문서 | [developer-guide.md](./developer-guide.md), [api.md](./api.md)(자동 생성), [CHANGELOG.md](../CHANGELOG.md) |
| 회귀 · 외부 Import | verify:all 36개 컴포넌트 × 3 엔진 108/108, verify:button 296/296 · 실제 포인터 27/27, 스토리 테스트 86 파일 · 374개, typecheck · lint · build(토큰 변경 없음) · build-storybook, axe 374 스토리 그 밖의 위반 0, 외부 프로젝트(npm pack → Vite 8 + React 19 + TS 6) 타입 검사 · 빌드 · 실행 — 화면 가장자리 차트 툴팁이 `<body>`에서 보이는 그림 영역 안, "최근 30일" 잘림 없음, 콘솔 오류 0 |

## 8. 최종 배포 준비 (2026-10-19)

원격 Push · npm 배포 · Storybook 배포는 하지 않았고, 변경은 로컬 커밋만 했습니다. Figma 원본은 읽기 전용으로만 조회했습니다.

| 작업 | 결과 |
| --- | --- |
| F31 최신 Figma 동기화 | 스냅샷 재추출 → 체크섬 **8그룹 모두 원본과 일치**. 토큰 삭제 · 이름 변경 17 · 추가 26 · 값 변경 25. Button 352개(Secondary · Solid 56 추가) — [분석 6 · 7절](./analysis/F31-button-sync.md#6-적용-결과-2026-10-19) |
| Primary · Outline 테두리 | 원본 42개 노드가 **삭제된 변수**를 가리킴 → 원본에 남은 #004a38을 그대로 쓰고 **변수 연결은 정하지 않음**(D1) |
| Secondary · Solid Props · 호환성 | `appearance="solid"` 허용, 생략 시 Secondary는 이전처럼 Outline — 기존 코드 화면 변화 없음. `BUTTON_TONES` 위치 변경은 내부 API로 분류 |
| 노드 단위 원본 변경 | 68개 세트를 다시 캡처해 비교 → Accordion(모든 Hover 배경 · 펼침 구분선 · Disabled, F50 해소)과 Table 편집 칸 Filter(칩 1개 구성) 반영, 기준 갱신 |
| 호환성 · 버전 정책 | [breaking-changes.md](./breaking-changes.md) — 외부 배포 전이므로 별칭 없이 **0.1.0으로 첫 배포** 권장, 0.x · 1.0 이후 규칙 |
| F65 | 가로 막대 기본 비교 막대 = 범례 · 툴팁 `chart/series/compare`. Figma 노드 5개 · 변수 ID 보고(R3) |
| F69 | 공통 토큰 `--border-radius-rounded-12px`(F81 이후 이름, 기존 `rounded-[2px]` 규칙, Tailwind 없음) — `figma-pending/`에서 생성, 체크섬 밖, Figma 등록 시 자동 감지 |
| 공개 API 분류 | 컴포넌트 88 = **공개 49 · 보조 32 · 내부 부품 7**, export 308(= 307 + `closeToast`) = 컴포넌트 88 + 타입 125 + 상수 45 + 함수 2 + 아이콘 35 + 내부 API 13 — [public-api.md](./public-api.md)(자동 생성, 분류 누락 시 생성 실패) |
| 문서 | developer-guide · api.md · public-api.md · CHANGELOG 갱신, [release-checklist.md](./release-checklist.md) · [figma-fix-requests.md](./figma-fix-requests.md) 추가 |
| 회귀 · 외부 Import | typecheck · lint 0, 스토리 테스트 86 파일 · **376개** 통과, build(토큰 = 스냅샷, 변경 없음) · build-storybook, **verify:all 36 × 3 엔진 108/108**, **verify:button 352/352 · 실제 포인터 36/36 × 3 엔진**, axe 376 스토리 그 밖의 위반 0(새 알려진 대비 18: Secondary · Solid Hover · Pressed 흰 글자 3.51 · 2.46:1 — Figma 값, 디자인 확인 필요), 외부 프로젝트(npm pack → Vite 8 + React 19 + TS 6 strict) 타입 검사 · 빌드 · 실행 — Secondary · Solid #007c56, Secondary 기본 Outline 유지, 12px 토큰, `closeToast`, 콘솔 오류 0 |

### 결정이 필요한 항목

| # | 결정 | 권장 | 영향 |
| --- | --- | --- | --- |
| ~~D1~~ | Button Primary · Outline 테두리에 바인딩할 변수(원본에서 삭제됨) — **해소(10절, R1)** | 컴포넌트 변수 `colors/button/primary/outline/border/default`를 다시 만들어 `fill/primary/strong/default`에 연결 | Figma 42개 노드 재바인딩, 코드는 리터럴 → 토큰 한 줄 |
| D2 | 첫 배포 버전 | **0.1.0**(남은 결정이 API를 바꿀 수 있음) | CHANGELOG `[Unreleased]` → `[0.1.0]`, 태그 |
| D3 | Table 편집 칸 Filter의 다중 선택 목록(칩 + 체크 목록) | 필요하면 새 컴포넌트로 설계(지금은 그리지 않음) | 새 컴포넌트 또는 기존 DropdownMenu 선택 모드 |
| D4 | 간단 스타일 차트 지난 기간 색(세로 `series/compare` · 가로 `simple/history`, F65-b) | 디자인 의도 확인 | `markColor` 한 줄 |
| D5 | 내부 부품 7 · 내부 API 13을 1.0 전에 export에서 뺄지 | 빼기(0.x 마이너에서) | 호환성 변경 — 0.x 규칙상 마이너 |
| D6 | 배포 실행(npm 레지스트리 · Storybook 호스팅) 승인 | — | `"private": true` 해제, 레지스트리 설정 |

그 밖의 디자인 결정 37건은 [figma-issue-triage.md](./figma-issue-triage.md) 1절(우선순위 표시)에 있습니다.

### Figma 원본 수정 요청 (수정하지 않음)

[figma-fix-requests.md](./figma-fix-requests.md) — R1 Primary · Outline 테두리(삭제된 변수, 42노드) · R2 Secondary · Outline 테두리 바인딩(8노드) ·
R3 차트 비교 막대(5노드, F65) · R4 12px 변수 등록 · 재바인딩(5 + 29노드, F69) · R5 Accordion 변형 위치(1노드) · R6 Table Filter 칩 상태(3노드) ·
R7 다중 선택 목록(D3) · R8 Table 안내 글자(삭제된 변수, 3노드, F57).

## 9. Tertiary 배경 Semantic Token (2026-10-19, Figma 수정 승인 작업)

| 항목 | 결과 |
| --- | --- |
| 원인 | Tertiary / Solid 배경이 `surface/container-subtle`(gray/75 #f5f6f7) — 페이지(#fdfdfd) 대비 1.06:1, 상태 간 L\* 차이 약 2 |
| Figma 신규 Semantic | `colors/fill/tertiary/default · hover · pressed` → Primitive `gray/150 · 225 · 275`(#e9ebee · #dcdfe4 · #d0d4db), scopes FRAME_FILL · SHAPE_FILL, WEB code syntax |
| Figma 바인딩 | `button_basic` 24 · `button_icon` 18 변형의 배경 → 신규 토큰. Component `button/tertiary/solid/background/*`도 신규 토큰 별칭으로. Chip 등 다른 컴포넌트는 용도가 달라 유지 |
| Figma 검증 | 변경 전후 지문: 76개 세트 중 바뀐 것은 Dialog(인스턴스가 따라감)뿐, 체크섬 8그룹 일치 |
| 코드 | 토큰 재생성, `Button.css` Tertiary / Solid → `--colors-fill-tertiary-*`, 기준 이미지 · 스펙 갱신, 비교 스토리 **Components / Button / Tertiary Background** |
| 상세 | [analysis/tertiary-fill-2026-10-19.md](./analysis/tertiary-fill-2026-10-19.md) |

작업 중 다른 사람의 Figma 편집이 관찰되었습니다: `fill/secondary/subtle/hover` 값 변경(동기화함), Accordion 프레임 삭제 · Chart 세트 재배치(**반영하지 않음** — 진행 중인 편집으로 판단, 확인 필요).

## 10. Figma 오류 수정과 Storybook 동기화 (2026-10-19, Figma 수정 승인 작업)

상세: [figma-fix-requests.md](./figma-fix-requests.md). 원격 Push · npm 배포 · Storybook 배포는 하지 않았습니다.

| 항목 | 결과 |
| --- | --- |
| 안전 조치 | Git 태그 `checkpoint/pre-figma-fixes`, 변경 전 바인딩 · 값 기록. Figma 이름 있는 버전 저장은 MCP 미지원 |
| 시작 시 원본 재조회 | 다른 편집 확인: Component 별칭 3개(같은 값), Accordion 삭제, Chart `hover` 속성 추가(24개 변형) |
| R1 | `colors/button/primary/outline/border/default` 복구(`VariableID:1033:4608`, 별칭 `fill/primary/strong/default`) + 42노드 재연결 — **D1 해소** |
| R2 · R3 · R8 | 8노드 · 5노드 · 3노드 재연결(색 그대로, R3만 원본 색이 #e2e5e9 → #d6dae0으로 바로잡힘) |
| R4 | `border-radius/rounded-[12px]` 등록(`VariableID:1033:6620`) + 5노드 재연결, 코드의 등록 대기 토큰 해소 |
| R6 | 693:7165 칩 Selected · Expanded로(693:7167은 오류 아님) |
| R5 | **미확인** — Accordion이 원본에서 삭제됨(F80) |
| 추가 조사 | 삭제된 변수 참조 전수 조사 → C3 텍스트 스타일도 수정. 변경 후 삭제 참조 0, 바뀐 세트는 의도한 3개뿐, 체크섬 8그룹 일치 |
| 코드 | 토큰 재생성, `Button.css` 리터럴 → 토큰, 쇼케이스(R6), 기준 이미지(Table, Chart 개별 변형), 스펙 토큰 이름 |

새로 결정이 필요한 항목: F77 · F78(차트 hover 변형 바인딩), F79(차트 구조 동기화), F80(Accordion 복구 · 폐기), F81(2px code syntax), F82, F83,
대비 개선안 A-1 · A-2 와 값 변경 A-3 – A-5 — [figma-fix-requests.md](./figma-fix-requests.md#승인이-필요한-값--정책-변경-변경하지-않음).


## 11. Figma · Storybook 전체 정합성 개선 (2026-10-19, Figma 수정 허용 작업)

기록: [analysis/consistency-pass-2026-10-19.md](./analysis/consistency-pass-2026-10-19.md). 시작 체크포인트 `checkpoint/pre-consistency-pass`.
원격 Push · npm 배포 · Storybook 배포는 하지 않았고 커밋은 로컬에만 있습니다.

| 항목 | 결과 |
| --- | --- |
| F81 | 토큰 생성기 규칙 — `rounded-[2px]` → `--border-radius-rounded-2px`(5px · 12px 같음), Figma code syntax 3개 |
| 회귀 수정 | F81 커밋이 만든 토큰 파일 머리 주석 결함(`*/`) — Button 외 Component 토큰이 브라우저에서 정의되지 않던 문제를 찾아 수정, 생성기에 검사 추가 |
| F80 | Accordion 복구본을 로컬 변수 · 스타일로(색 58 · 레이아웃 442 · 텍스트 스타일 24), Component 토큰 9개 신설, R5 |
| F78 | Chart Component 토큰 19개(`colors/chart/{bar,line,point,plot,label,legend,tooltip}/*`) — 24변형 · 범례 · 툴팁 보이는 색 778곳 연결(F77 5노드 제외), 세로 · 가로 막대 같은 규칙 |
| F79 | 24변형(hover) 코드 · 스토리 · 검증, 간단 스타일 호버 · 키보드, 강조 크기, Hover 결함 2건(감지 영역 · 터치) 근본 수정 |
| F77 | 수정 제외(지시) — 5노드 그대로 확인, 3 엔진 정합성 통과 |
| A-1 · A-2 | 색 대비 axe 423 → 0, 컨트롤 경계 2.35 → 3.87:1 — 전후 표 [accessibility.md](./accessibility.md) |
| 전체 점검 | 원격 사본 92곳 로컬화, code syntax 11개, 다른 컴포넌트 토큰 별칭 1개, 배지 흰 채움 12변형, 변형 위치 1개 |
| 회귀 | typecheck · lint 0 · build · build-storybook 통과, 스토리 테스트 87 파일 · 378개, axe 378 스토리(색 대비 0 · 그 밖의 위반 0), verify:all 36 컴포넌트 × 3 엔진 108/108, verify:button 352 + 실제 포인터 36 × 3 엔진, Chart Hover 실제 브라우저 6종 × 3 엔진(터치는 Chromium · WebKit), Accordion 실제 브라우저 3 엔진, 외부 Vite + React 19 프로젝트(npm pack → 설치 · strict 타입 · 빌드 · 실행, 콘솔 오류 0), Figma 체크섬 8그룹 일치 |

남은 결정: 차트 보조 계열 막대 대비(1.24 · 1.38:1), SearchField Solid 경계, Segmented 선택 표시, Slider 손잡이 · Segmented 그림자 효과 스타일,
data-state · 예시 프레임 원격 흰 배경(#ffffff), F77 수정 여부, 그 밖에 [figma-issue-triage.md](./figma-issue-triage.md) 1절.

## 12. 코드 정책 → Figma 공식 정책 (2026-10-19 밤, Figma 수정 허용 작업)

시작 체크포인트 `checkpoint/pre-policy-pass`(e6b5f40), 커밋 6b38274 · c1e78df · 22cfc5e와 이 절의 회귀 커밋. 원격 Push · npm 배포 · Storybook 배포는 하지 않았습니다.
항목별 출처 · 결정 · Figma ID · 처리 상태: [code-policy-audit.md](./code-policy-audit.md). Figma 변경 목록: [figma-fix-requests.md P절](./figma-fix-requests.md#p-코드-정책--figma-공식-정책-2026-10-19-밤-사용자-승인-작업).

| # | 항목 | 결과 |
| --- | --- | --- |
| 1 | 코드 전용 정책 전체 | **152개**(분류 A 시각 상태 51 · B 동작 86 · C 기술 15) — Usage MDX 37쪽 · docs · CSS/TSX 주석 · Props 기본값 · 상태/상호작용 코드에서 수집 |
| 2 | Variant · Property · 변수 · 스타일로 반영(Figma 정의 정책) | **39개** — `Focus` 속성 24세트 766변형(숨김 링 · 토큰 바인딩), Select State=Focus 3변형, Dialog 덮개 변수 · 예시, Card · 대시보드 그림자 효과 스타일, 원격 padding · 배경 로컬화, Link 텍스트 스타일 줄 높이, 달력 요일, Pagination 예시, EmptyState `Show Button`, Table 예시 |
| 3 | Figma Rules에 문서화(Figma 문서화 정책) | **96개** — 기존 "Design System Rules"(227:3774)에 02–06장, 같은 스타일의 계속 프레임(1100:5082)에 07–10장(표 50행), 컴포넌트 Dev Mode 주석 17개(13세트). 항목마다 Rules 본문 · 주석에 있는지 Figma 재조회로 대조(빠진 3곳 — 탭 패널 · 입력 칸 안 버튼 · Toast 닫기, 진행 막대 · 단계 모션 — 보완) |
| 4 | 개발 구현 세부 사항 | **15개** — 포털 · z-index, 제어/비제어, 네이티브 요소, 엔진 대응, UNSTABLE Toast 감싸기 등(Rules 10장 목록) |
| — | Figma 반영 대기 | **2개** — Segmented 선택 그림자(같은 값의 효과 스타일 없음, 등록은 디자인 결정 · F18), Table Textarea 두 줄 예시(F58). 반영 완료로 표시하지 않음 |
| 5 | 새 · 수정 토큰과 컴포넌트 | 추가 `colors/border/focus`(→ brand/700) · `colors/dialog/scrim/default`, 값 `surface/scrim` 검정 90 → 50%, `sm/leading-normal/underline` 줄 높이 20px. 컴포넌트: 모든 포커스 가능한 컨트롤의 포커스 링, Select Focus 테두리, Dialog 덮개, Toast(최대 3 · 오류 유지 · 중복 대체), Tooltip 지연 500ms, 선택 그룹 간격 8 · 16px(`:where`로 사용처 간격 우선) |
| 6 | Storybook | Usage 37쪽의 "코드 정책" → **정책** 절(4분류, 항목 ID), Foundations/Focus(링 · 키보드 검사), Toast Policy · Dialog 덮개 · GroupSpacing(Checkbox · Radio) 상호작용 테스트, Select 매트릭스에 State=Focus, 그룹 스토리의 임의 `style` 간격 제거 |
| 7 | 접근성 | 포커스 표시를 형태별(바깥 링 · 안쪽 링 · 입력 칸 테두리 · 목록 Hover 모양)로 정의 — 링 5.14:1(회색 배경 4.59:1), 키보드에만. 오류 토스트 유지(2.2.1), 모달 덮개 · 포커스 가둠, Tooltip Esc, 모션 줄이기. [accessibility.md](./accessibility.md) |
| 8 | 회귀 | typecheck · lint 0 · build · build-storybook 통과 / 스토리 테스트 88 파일 · 383개 / axe 383 스토리 색 대비 0 · 그 밖의 위반 0 / verify:all 36 컴포넌트 × 3 엔진 108/108(854/857 변형, 3개는 F58 수동 검토) / verify:button 352 + 실제 포인터 36 × 3 엔진 / 키보드 포커스 링 23개 컴포넌트 × 3 엔진(WebKit 링크 2개는 Tab이 링크를 건너뛰는 기본 설정이라 키보드 포커스로 확인) / 외부 Vite + React 19 프로젝트(npm pack → strict 타입 · 빌드 · 3 엔진 실행: 포커스 링 키보드에만, 그룹 8 · 16px, 토스트 중복 1 · 최대 3 · 오류 5초 후 유지, 덮개 50%, Tooltip 250ms 없음 · 750ms 표시, 콘솔 오류 0 — Firefox는 Pretendard 글꼴 파일 name 표 경고만) |
| 9 | Figma 실패 · 미해결 | 쓰기 실패 없음(글꼴 로드 오류 1회는 재시도 전 원인 수정). **원본 동시 변경 감지**: 최종 회귀 중 다른 편집자가 차트 그라데이션 변수 22개를 추가하고 차트 Component 변수 6개 이름을 바꿨으며 `chart` 세트 118곳에 연결 — 범위 밖 · 진행 중이라 동기화 보류([token-diff.md](./token-diff.md#원본-변경-감지-2026-10-19-밤--차트-그라데이션-동기화-보류)); 그 외 체크섬은 스냅샷과 같음. 남은 결정은 [figma-issue-triage.md](./figma-issue-triage.md) 1절(17) |

주의: 이전 작업(c1e78df)의 그룹 간격 3 엔진 측정은 스토리에 `style` 간격이 있던 상태였습니다. 이번에 스토리의 임의 간격을 지우고 스토리 테스트(GroupSpacing)와 외부 프로젝트에서 컴포넌트 자체 간격을 다시 확인했습니다.

## 13. Figma × Storybook 전체 동기화 · 완성도 개선 (2026-10-19 밤, Figma 수정 허용 작업)

시작 체크포인트 `checkpoint/pre-full-sync`(4ebef48), 단계 커밋 2397da1(①) · 4790793(②) · 3385c5d(③) · 31c1f14(④) · 875cef3(⑤)와 이 절의 회귀 커밋.
원격 Push · npm 배포 · Storybook 배포는 하지 않았습니다. Figma 변경 목록(노드 · 변수 ID): [figma-fix-requests.md S절](./figma-fix-requests.md#s-figma--storybook-전체-동기화-2026-10-19-밤-사용자-승인-작업),
컴포넌트별 상태표: [sync-status.md](./sync-status.md).

| # | 항목 | 결과 |
| --- | --- | --- |
| 1 | 수정한 컴포넌트 | **Chart**(툴팁 배치 · 렌더링, 토큰 개편 색 연결, 툴팁 계열 이름 40–80px, 범례 · 툴팁 글자 정수 px), **Chip**(`FilterChipSelect` · `filterChipText` 추가, 열린 필터 칩 모양), **Calendar**(날짜 칸 이름 · 머리줄 마크업), **DropdownMenu**(라벨 · 설명 마크업), **Table**(`TableEmptyColumn` 이름, Filter 편집 칸 = FilterChipSelect), **Select**(`SelectOption checkIcon`, md Disabled 글자), **SearchField**(Solid 오류 테두리), **아이콘**(`aria-label` → `role="img"`). 기존 Props는 모두 유지(추가만) |
| 2 | Figma Variables · Nodes | 변수 생성 1(`colors/search-field/solid/border/error` VariableID:1158:7281), code syntax 정정 4(VariableID:1135:16414 · 16415 · 16416 · 1052:6711). 노드: Rules 03 · 04 · 05 · 08 · 10 셀, 주석(693:9776 · 558:25704 · 558:26017), 필터 칩 다중 예시 이름(1011:12956) · 단일 예시 추가(1149:6756), option md Disabled 텍스트 스타일(97:2331), Search Field Solid Error 3변형(439:10252 · 10295 · 10338), 차트 삭제 변수 참조 91곳 재연결(698:4399 안), 점선 복원 3(703:4817 · 762:5858 · 1011:15054), 아이콘 원격 바인딩 7곳, Card 부품 이름 2(218:7173 · 218:7174). 삭제 없음 |
| 3 | 변경한 Storybook 파일 | 스토리 11개(새 파일 2: `FilterChipSelect.stories.tsx` · `stories/FilterChipSelect.showcase.stories.tsx`), Usage MDX 18개(Chart · Chip · Select · SearchField · Table · DatePicker · DropdownMenu · Breadcrumb · Pagination 외 Figma 속성 → Props 행) |
| 4 | 새 상태 · 인터랙션 · 사용 예 | 스토리 383 → **396**(+13): FilterChipSelect 10(기본 · 값 · 단일 · Disabled, 쇼케이스 Basic · 다중 · 단일 · 키보드 · Disabled · 필터 영역), Chart `MultipleCharts` · `TooltipLabelWidth`, Select `WithoutCheckIcon`. Table `EditableOpen`(Filter 편집 칸 목록), Search Field Solid Error 테두리, option md Disabled 정정 |
| 5 | 해결한 접근성 경고 | Storybook 사이드바 경고 **25개 스토리 · 6개 규칙 → 0** — 숨기거나 규칙을 끄지 않고 원인 수정(달력 날짜 칸 이름, 필터 칩 이름, 설명 있는 메뉴 항목 이름, 달력 머리줄 header → div, 여러 nav 고유 이름, 제목만 있는 메뉴 칸 정적 마크업, 빈 머리글 화면 낭독기 글자, 아이콘 이름 role=img). `verify:a11y`를 애드온과 같은 axe 기본 규칙 · 제외 없음으로 강화 |
| 6 | 차트 툴팁 원인 · 수정 | 원인: 툴팁이 `<body>` 포털(`position: fixed`)이라 화면 밖으로 스크롤된 차트의 툴팁이 화면 가장자리로 밀려 **다른 차트 위에 남음**(문서 · 쇼케이스의 hover 상태 차트 12개), 위치는 스크롤 · 크기 변경 때만 갱신. 수정: 툴팁을 **자기 그림 영역 안**(`position: absolute`)에 그리고, 보이는 부분(그림 영역 ∩ 화면 · `overflow` 조상, 가장자리 12px) 안에 배치 — 들어가지 않으면 뒤집기 · 이동, 보이는 부분이 작으면 그림 영역 안. z-index 상향 · overflow 잘라 내기 없음. Figma Rules 05 · 10과 chart-tooltip 주석에 정책 반영 |
| 7 | Chip Filter 예시 | `FilterChipSelect`: 다중(목록 유지 · 닫을 때 적용 · 모두 끄면 해제) · 단일(고르면 적용 · 닫힘 · "전체"로 해제), 칩 글자 "필터명: 값, 값"(3개 넘으면 "외 N"), 열린 칩은 Figma State=Default. 실제로 동작하는 예시(정적 아님) — 쇼케이스 필터 영역 · Table Filter 편집 칸. Figma 단일 선택 예시(1149:6756) · Rules 04 "필터 칩 선택" 행 |
| 8 | 동기화 검증 | [sync-status.md](./sync-status.md) — 검증 단위 **37개(Figma 세트 76 중 73 직접 + 3은 부모 세트 안)** 모두 6열 통과: Figma 정의(원본 실시간 조회 · 변형 수 일치) · Storybook 구현(검증 변형 전부 렌더링) · 시각 정합성 3 엔진(2,562 / 2,571 변형 통과, 나머지 9 = Table Textarea 두 줄 값 3변형 × 3 엔진 수동 검토 F58) · 인터랙션(스토리 테스트) · 접근성(경고 0) · 문서(Figma 속성 전부 Usage에 언급). 토큰: 변수 · 스타일 체크섬 8그룹 원본과 일치(Primitive 456 · 167, Theme 44, Semantic 69, Component 82 · 725, 텍스트 46, 효과 4), 생성 CSS 변수 1,536. 최신 Figma 변형: 차트 24 · 범례 3 · 툴팁 1을 개편 후 기준 이미지 · geometry로 다시 받아 비교 |
| 9 | 회귀 | typecheck · lint(oxlint 0 · CSS 주석 검사) · build · build-storybook 통과(기존 청크 크기 경고만) / 스토리 테스트 90 파일 · **396개** 통과, 콘솔 출력 없음 / a11y 리포터 396 스토리 경고 0 · `verify:a11y` 396 스토리 위반 0 / `verify:all` 36 컴포넌트 × 3 엔진 **108/108** / `verify:button` 352 변형 + 실제 포인터 36 × 3 엔진 / 키보드 포커스 링 24개 대상 × 3 엔진(WebKit 링크 2개는 Tab이 링크를 건너뛰는 기본 설정이라 키보드 방식 포커스로 확인) / 다중 차트 툴팁 탐침 3쪽 55차트 × 3 엔진 문제 0 · 콘솔 오류 0 / FilterChipSelect 실제 마우스 · 키보드 × 3 엔진(다중 닫을 때 적용 · 단일 고르면 닫힘 · 포커스 복귀 · 초기화) / 외부 Vite 8 + React 19 + TS 6 프로젝트(npm pack → strict 타입 · 빌드 · 3 엔진: 차트 툴팁이 자기 그림 영역 안 · `<body>` 아님, FilterChipSelect 선택 · 해제 · 단일 "전체", `checkIcon={false}`, 이전 정책 항목 그대로, 콘솔 오류 0 — Firefox는 Pretendard 글꼴 name 표 경고만) |
| 10 | 남은 문제 · 미검증 | **디자이너 확인 필요**: F85 점선 복원(개편에서 실선이 된 범례 Dash Line · 간단 선 비교 선을 이전 값으로 되돌림 — 실선이 의도였다면 Figma · 코드 · Rules 03 함께 변경), F77(가로 막대 hover=yes 비교 막대 5노드, 지시로 수정 제외 — 원본은 `bar/history`, 코드는 hover=no 짝과 같은 `bar/compare`, 픽셀 임계 이내), F82(Table Filter Hover · Empty 칩 State=Hover). **Figma 정리 권장**: F86 값이 다른 원격 바인딩(355:4444 · 355:4445, 손잡이 그림자), F87 연결 없는 table_value Boolean 속성. **호환성 변경**: 차트 토큰 이름 · 삭제(배포 전이라 별칭 없음 — [breaking-changes.md](./breaking-changes.md)). **미검증**: 실제 화면 낭독기 낭독 내용, 실제 터치 기기 · 모바일 브라우저, Figma 프로토타입 연결(대조 대상 아님), Figma Rules · 주석 문구의 의미 일치(사람 검토), Table Textarea 두 줄 값 3변형(F58 수동 검토). Figma 쓰기 실패 없음 |

## 14. Figma · Storybook 문서 · 정책 간소화 (2026-10-20, Figma 수정 허용 작업)

기준: "처음 보는 사람이 컴포넌트의 용도와 사용법을 빠르게 이해하고, 개발자는 필요한 기술 정보를 쉽게 찾을 수 있는가".
시작 체크포인트 `checkpoint/pre-docs-simplify`(df820dc). 원격 Push · npm 배포 · Storybook 배포는 하지 않았습니다.

| # | 항목 | 결과 |
| --- | --- | --- |
| 1 | 역할 분리 | **Figma** = 디자인 · 상태 · 토큰 · 짧은 사용 규칙 · 예시, **Storybook** = 목적 · 언제 쓰는지 · 종류 · 상태 · 실제 동작 · 코드 · Props · 접근성, **docs/** = 구현 상세 · Figma 매핑 · 노드/변수 ID · 예외 · 검증 · 동기화 절차([docs/README.md](./README.md)) |
| 2 | Figma 정책 간소화 | Design System Rules 02–09장을 "정책 · 적용 대상 / 사용 규칙 / 디자인 기준" 3열의 1–2문장 규칙으로(행 51 → 44), 장 제목 간소화, 10장(개발 구현 세부) 삭제. 표 디자인 · 셀 스타일 · 01장(디자이너 작성)은 그대로. 한국어 줄바꿈을 단어 단위로 맞춰 겹침 · 잘림 없음(재조회 · 스크린숏 확인) |
| 3 | Figma 기술 주석 제거 | Dev Mode 주석 17개 삭제, 컴포넌트 설명 34개 정리(영어 기술 문구 → 짧은 한국어, 디자이너 설명은 개발 · 임시 메모만 삭제). 삭제 전 전체 내용을 [policy-details.md](./policy-details.md)로 이관. 재조회: 주석 0, 정책 표 · 설명에 노드 ID · 개발 용어 없음, 변수 · 스타일 체크섬 변화 없음 |
| 4 | Storybook 사용자 문서 | 사용 방법 37쪽 + 디자인 토큰 페이지를 쉬운 한국어로 다시 씀(목적 → 언제 사용하나요 → 종류 → 상태 → 사용 방법(코드) → 접근성 → 주의사항 → Props). 자동 문서의 컴포넌트 설명 · Props 설명 · 스토리 설명(JSDoc · argTypes)도 한국어. 제거: Figma 경로 · 노드 · 변수 ID · 버전명 · 변형 수 · 변환 과정 · 정책 항목 ID · 날짜 · 이력 · 테스트 수치 · 내부 파일 경로 · MCP · 작업 과정 |
| 5 | 한국어 표현 | 사이드바 `컴포넌트` · `기초`, `사용 방법` · `전체 보기` · `개요` · `상태별 보기` · `모든 변형` · `동작 확인`, 스토리 이름 396개(`직접 체험` · `비활성` · `선택됨` · `펼침` …), 자동 문서 이름 `문서`, 매트릭스 상태 이름(기본 · 마우스 올림 · 누름 · 비활성 …), 토큰 표 머리글. 영어 유지: 컴포넌트명 · Props · 값 · 타입 · 코드 · import 경로 · CSS/Figma 변수 이름 |
| 6 | 노드 ID 의존 제거 | 사용자 문서 · 스토리 화면의 노드 ID 0(렌더링된 문서 83쪽 · 스토리 396개 자동 검사). 내부 식별자는 유지하되 이름 우선: 검증이 세트를 노드 ID로 못 찾으면 **세트 이름**으로 찾음(32개 세트 ID = 이름 결과 일치), `figma/component-map.json`(컴포넌트 ↔ 세트 이름), Figma 내보내기 스크립트 `SET_NAME`, 재매핑 순서 [figma-sync.md](./figma-sync.md) |
| 7 | 개발 문서 이관 | 컴포넌트별 개발 노트 37개([components/](./components/) — 이전 사용 방법 문서 전체 + 옮긴 JSDoc · 설명의 기술 정보 "구현 메모" 34개), 정책 상세 기준([policy-details.md](./policy-details.md)), 동기화 절차, 문서 안내. 지울 때 잃은 정보 없음(Figma 속성 ↔ Props 대조: 개발 노트에 76개 세트의 속성 전부 있음) |
| 8 | 기능 · API | 라이브러리 소스 80개 파일은 주석 · JSDoc만 바뀜(TypeScript로 주석을 뺀 코드 비교 — 동일). Props · 타입 · 토큰 · 동작 변화 없음. 스토리 ID 그대로(메타 `id` 고정), 자동 생성 컴포넌트 문서 45쪽만 `--docs` → `--문서` |
| 9 | 검증 | typecheck · lint · 라이브러리 빌드 · Storybook 빌드 통과(기존 청크 크기 경고만) / 스토리 테스트 90 파일 · **396개** 통과, 콘솔 출력 0 / a11y 경고 0 · `verify:a11y` 396 스토리 위반 0 / `verify:all` 36 컴포넌트 × 3 엔진 **108/108** / `verify:button` 352 변형 + 실제 포인터 36 × 3 엔진 / **화면 문구 재검사**: 빌드된 Storybook의 문서 83쪽 · 스토리 396개 렌더링 결과에서 노드 · 변수 ID · 버전명 · 날짜 · 파일 경로 · 정책 ID · MCP · 영어 문장 0(Storybook 자체 UI 문구와 예시 데이터 — 외부 링크 예시 "Figma 열기", 시각 값 `2026-10-14T09:30` — 제외) / Figma 재조회: 체크섬 8그룹 · 컴포넌트 속성 76세트 변화 없음, 주석 0, Rules 02–09장 / 점검표 [sync-status.md](./sync-status.md): 37개 단위 × 동기화 6열 + 문서 3열 모두 통과 |
| 10 | 남은 점 · 미검증 | **Storybook 자체 UI 문구**는 영어(Props 표 머리글 Name · Description · Default · Control, "Show code", 컨트롤 없음 안내, 시작 안내 패널) — Storybook에 번역 설정이 없어 그대로 둠. **사람 검토 권장**: 한국어 표현의 자연스러움, Figma Rules와 Storybook 설명의 의미 일치, 예시에서 옮긴 문장(Alert · Dialog · EmptyState의 버튼 종류, Tabs · DropdownMenu · Navigation · Stepper의 `aria-label` 권장, 각 페이지 "언제 사용하나요"의 쓰임 설명). 영어로 둔 이름: 컴포넌트명 · 속성 값이 이름인 스토리 8개(`Secondary` · `Solid` · `Filled` 등). 자동 생성 컴포넌트 문서 주소가 `--문서`로 바뀜(배포 전이라 외부 링크 영향 없음). 이전 결정 대기 그대로: F85(점선 복원 확인) · F77 · F82 · F86 · F87 |

## 15. v1.0 테스트 후보 (2026-10-20, Figma 수정 허용 작업)

기준: "현재 디자인 시스템만으로 실제 웹 서비스를 개발할 때 필요한 UI와 사용 규칙이 충분히 준비되어 있는가".
시작 체크포인트 `checkpoint/pre-v1-candidate`(2c7dc48), 끝 체크포인트 `checkpoint/v1.0-candidate`(로컬 태그). 원격 Push · npm 배포 · Storybook 배포 ·
정식 1.0.0 출시 · `package.json` 버전 변경은 하지 않았습니다. 전체 내용은 [v1.0-candidate.md](./v1.0-candidate.md).

| # | 항목 | 결과 |
| --- | --- | --- |
| 1 | Figma 점검 · 보완 | 변수 code syntax · 범위 정리, 필수 입력(4세트 80변형) · 파일 실패 상태와 토큰, 속성 연결 · 원격 변수 · 아이콘 대비 결함 수정, 사용 예시 화면 3개, 규칙 표 3행. QA에서 찾아 먼저 고친 것: F33 · F92 · F93, 대시보드 예시 범례 |
| 2 | Storybook 동기화 | `required`(Input · Textarea · Select · DatePicker), `FileUploaderItem status="error"`, 표 칸 가운데 정렬, Breadcrumb 펼친 항목 Hover 글자 색, 입력 칸 글자 · 효과 토큰, 사용 예시 3쪽, 기준 이미지 71세트 재캡처, 글자 색 비교 검사 |
| 3 | QA | 3 엔진 정합성 108/108 · Button 352 × 3 · 스토리 408 · axe 위반 0 · 외부 앱 3 엔진 · 콘솔 · 문서 문구 · Figma 최신 상태 — [v1.0-candidate.md 8절](./v1.0-candidate.md#8-시험-결과). 고친 것: 글자 색 엔진별 판정, `Table` `id` 타입, 상호작용 테스트 3개 |
| 4 | 남은 점 | 미검증(실제 화면 낭독기 · 실기기 Safari · 큰 데이터 · 확대 · 고대비, axe 검토 필요 항목), Firefox 글꼴 경고 · Storybook 자체 경고 — [9절](./v1.0-candidate.md#9-남은-문제--제약). 개발팀 검토 R-1 – R-7, 디자인 결정 V-1 – V-13 |

## 16. Codex 인수인계 · Storybook 콘텐츠 개선 (2026-10-20)

시작 HEAD `0aef52d`와 로컬 체크포인트, 작업 트리, progress·candidate·sync-status의 기록을 확인했습니다.
기존 미커밋 기능·QA·Figma 기준 변경은 보존하고 이번 콘텐츠 개선 커밋에서 제외했습니다.
이 절이 현재 콘텐츠와 검증 상태이며, 위의 396·408 Story 기록은 각 작업 당시 결과입니다.

| 항목 | 결과 |
| --- | --- |
| 메뉴 | `Foundations / Components / Examples`. 컴포넌트는 이름순, Usage를 먼저 배치하고 기존 그룹 깊이와 모든 Story를 유지 |
| 상태·예시 이름 | 직접 체험 → Playground, 모든 변형 → Variants, 전체 보기 → Gallery, 라벨만 → Label Only. 값 있음은 DatePicker의 Selected Date, Select의 Selected, FilterChipSelect의 필터 적용으로 구분. MetricTrend의 disabled는 비교 데이터 없음 |
| 문서 | 37개 Usage와 Design Tokens, 자동 문서의 컴포넌트·Props 설명, Story 설명과 예시 문구 검토. 키보드 포커스와 선택 상태를 구분하고 날짜 선택 가능 기간·지표의 방향과 의미를 명확히 설명 |
| 내부 정보 | 검증용 변형 수·Figma 참조·구현 이력은 기존 컴포넌트별 개발 문서 37개에 보존. 사용 문서는 목적·종류·상태·사용 예시·Props·사용 규칙에 집중 |
| 실제 제약 정정 | Table 편집 셀은 한 줄 입력 기준. 여러 줄 입력을 지원하는 것처럼 읽히던 안내를 수정하고 V-14/F58 결정은 미완료로 유지 |
| ID·링크 | 시작 시점과 정적 빌드의 **509개 ID 및 importPath 일치**, 추가·삭제 0. 자동 문서의 기존 `--문서` 주소와 MDX의 `--docs` 주소도 유지. 렌더링된 내부 링크 49개 유효 |
| 실제 화면 | 라이브 서버와 최종 정적 빌드에서 각각 **423 Story + 86 문서** 렌더링 확인. 최종 빌드 오류 0, 지정한 어색한 메뉴 표현·조사 오류·내부 식별자 패턴 검출 0. 스크린샷·별도 QA 결과 파일 생성 없음 |
| MCP 문서 | 전체 목록과 컴포넌트 문서 확인. 최종 FilterChipSelect·DatePicker·MetricTrend의 설명·Props·예시와 Table Usage 재조회 성공 |
| 검사 | TypeScript·oxlint/CSS 주석 검사·Storybook 빌드 통과. MCP `test-run`으로 **93개 파일·423개 Story 통과**, 접근성 검사 활성화. 마지막 전체 실행의 MCP 응답까지 확인 |
| 코드·디자인 | 라이브러리 컴포넌트의 이번 변경은 주석·문서뿐임을 TypeScript AST 출력 비교로 확인. 기존 미커밋 disabled 변경은 별도로 보존. 디자인 토큰·CSS·Figma 원본 수정 없음 |
| Figma | 원본 파일 읽기와 Variables 조회 성공. 로컬 Variables 1,551개(Primitive 623 / Semantic 69 / Component 815 / Theme 44). `use_figma` 읽기 실행과 편집 API 노출 확인. 실제 쓰기 동작·파일 편집 ACL은 비파괴 조회만으로 확정하지 않음 |
| 기존 QA | Chromium·Firefox·WebKit 각 36개 보고서, 864개 렌더링, issues·missing 0(2026-10-20 14:04–14:14 KST). 수동 검토 3개는 자동 통과에 포함하지 않음. 이번 문구 작업에서 전체 Figma 시각 정합성 검사는 재실행하지 않음 |

### 실행 환경 이슈

기존 서버가 종료된 뒤 6006 포트가 비어 있음을 확인하고 기존 npm 스크립트로 복구했습니다.
전체 테스트는 통과했지만 기본 약 4GB 힙 한도에서 서버가 `JavaScript heap out of memory`로 종료되어 MCP 응답이 실패했습니다.
Coverage를 UI에서 꺼도 재현되어 커버리지만의 문제로 단정하지 않았습니다.
현재 서버 프로세스에만 8GB 한도를 적용한 뒤 전체 테스트의 정상 MCP 응답과 후속 문서 조회를 확인했습니다.
영구 설정·npm 스크립트·의존성은 변경하지 않았습니다.

서버가 실행 중이면 그대로 재사용합니다. 종료된 경우에만 PowerShell에서 다음과 같이 실행할 수 있습니다.

```powershell
$env:NODE_OPTIONS = '--max-old-space-size=8192'
npm run storybook -- --ci
```

Storybook 테스트 UI의 Coverage는 꺼져 있고 Interactions·Accessibility는 유지했습니다.
빌드에는 청크 크기와 preview.tsx의 docgen 제외 안내가 남습니다. 라이브 화면 순회 중 React Aria의 Pressable 포커스 경고도 관찰했으며 컴포넌트 동작을 이번 문구 작업에서 변경하지 않았습니다.
기본 메모리 한도의 근본 원인 조사는 별도 환경 개선 과제입니다.

### 미완료 항목

- 디자인 검수: V-1–V-5 최종 화면 확인, V-6 차트 점선, V-12 Card 공개 여부, V-13 표 정렬, V-14/F58 여러 줄 편집 정책.
- 수동 QA: 실제 화면 낭독기, 실기기 Safari·모바일, 200% 확대·고대비, 대용량 데이터.
- 버전 결정·정식 v1.0 릴리스·원격 Push·Vercel·npm 배포는 진행하지 않았습니다.
