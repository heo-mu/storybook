# 최종 보고 — Platform Web Design System React 컴포넌트

Figma **[Platform] Web Design System**(`Ry3WecA6sP6lKPop1vXrTp`, 페이지 `🔵 Ver 0.4`)의 Component 섹션(58:5174)과
Dashboard components 섹션(728:25472)을 React 라이브러리 + Storybook으로 구현한 결과입니다. (2026-10-16)

Figma 원본은 읽기 전용으로만 조회했고 수정하지 않았습니다. 원격 Push · 배포는 하지 않았고, 커밋은 로컬에만 있습니다.

## 1. 요약

| 항목 | 결과 |
| --- | --- |
| 구현 컴포넌트 | Figma Component Set · Component 74개(Button 3 포함) → React 컴포넌트 44종(+ 하위 부품), Storybook 사용 문서 37쪽 |
| 구현 불가 | Popover · Combobox · Drawer — 작업 중 Figma에서 삭제되어 근거 없음 |
| Figma 정합성 | Button 296 + 그 밖의 842개 변형, Chromium · Firefox · WebKit 3개 엔진 모두 통과 |
| 스토리 테스트 | 86 파일 · 370개 통과 |
| 접근성(axe) | 370 스토리 — 그 밖의 위반 0 (알려진 Figma 토큰 대비 400 · react-aria 달력 이름 693, [accessibility.md](./accessibility.md)) |
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

Figma에 정의가 없거나 서로 맞지 않아 코드 정책으로 정한 것입니다. 자세한 내용은 [figma-issues.md](./figma-issues.md).

| # | 내용 | 현재 코드 |
| --- | --- | --- |
| F31 | 작업 중 Figma 원본 변경(Button Secondary · Solid 신설 등) 동기화 여부 | 스냅샷 동결. Dashboard Filter Bar 초기화 버튼은 Secondary · Outline으로 대체 |
| F33 | Breadcrumb 펼친 상태 표현(Role=Open, 메뉴 위치) | … 버튼이 메뉴를 열고 현재 항목은 Current |
| F44 | Toast 위치 · 간격 · 표시 시간 | 화면 아래 가운데, 간격 m-2, 5초 |
| F48 | Tooltip 거리 · 지연 | 화살표 길이 8px, react-aria 기본 지연 |
| F50 | Accordion Hover 표현이 변형마다 다름 | Figma 그대로 |
| F51 | Dialog 뒤 덮개(scrim) 색 | 투명 |
| F58 | Table 관리 모드 샘플 불일치 | 한 줄 Input · 실제 날짜, 두 줄 변형 수동 검토 |
| F60 | Card 그림자(원격 스타일 10%) | 로컬 elevation-1(12%) |
| F61 | Card 프레임 숨김 | 레이어 값으로 구현 |
| F63 | Chart 툴팁 위치 규칙 | 기준점 오른쪽 p-3(넘치면 왼쪽), 세로 막대는 항목 가운데 · 그림 영역 위 |
| F65 | Chart 비교 계열 색(가로 막대 막대 · 범례 색이 다름) | Figma 변형별 그대로 |
| F69 | 대시보드 원격 변수(padding 16 · 모서리 12 · 흰 배경) | p-4 · 12px(로컬 토큰 없음) · surface/page |
| F71 | Dashboard Filter Bar 예시 크기(세그먼트 220px) | 말줄임 |

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
