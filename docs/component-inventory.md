# Component Inventory

Figma **[Platform] Web Design System** (`Ry3WecA6sP6lKPop1vXrTp`) · 페이지 `🔵 Ver 0.4` ·
Component 섹션 `58:5174`, Dashboard components 섹션 `728:25472`. 2026-10-16 Figma MCP(Plugin API)로 재조회.

상태: **완료** = 컴포넌트 + Storybook + 테스트 + Figma 정합성 검증 · **진행** · **미착수** · **구현 불가**(Figma 근거 없음)

## 재조회에서 달라진 점

- **Popover · Combobox · Drawer — Figma에서 삭제됨.** Component 섹션, `legacy`, `Cover` 페이지 어디에도 없고,
  관련 Component 변수(약 70개)도 함께 삭제됨([token-diff.md](./token-diff.md)). Figma 근거가 없으므로 구현하지 않음.
- **Loading · File Uploader — 정식 Component Set이 있음.** 이전 분석에서 "일반 레이어"로 본 것은 `get_metadata`가
  두 프레임의 하위 노드를 생략했기 때문(Plugin API로 확인: `loading` 2, `file-uploader` 5, `file-uploader-item` 3).
- **Accordion** — `accordion-single` 세트가 일반 프레임(`accordion-single/None`, `/1`)으로 바뀜. `accordion-item` 14개(이전 16).
- **Card** 프레임은 숨김 상태이며 컴포넌트 이름이 `Frame 2147239186`, `Wrapper`.
- 새 프레임 `Frame 2147240259`(815:7231) — Select 인스턴스 상태 모음(컴포넌트 아님).

## Forms / Inputs

| Figma 프레임 | Component Set (Variant 수) · 속성 | React | Phase | 상태 |
| --- | --- | --- | --- | --- |
| Button 58:4971 | `button_basic` (192) · `button_icon` (144) · `button_text` (16) — Secondary · Solid는 2026-10-19 동기화로 추가 | `Button`, `IconButton`, `TextButton` | — | 완료 |
| Input 72:4021 | `input` (21) Type=Outline · Size sm/md/lg · State Default/Hover/Focus/Completed/Error/Disabled/Read-only · Label, Alert, Icon-eye · `input_message` (3) Info/Success/Error | `Input` | 1 | 완료 |
| Textarea 86:2594 | `textarea` (14) Size md/sm · State 7종 · Label, Alert, Counter · `textarea_message` (3) | `Textarea` | 1 | 완료 |
| Search Field 216:6742 | `search-field` (36) Size sm/md/lg · State Default/Hover/Focus/Error/Disabled/Completed · Type Solid/Outline · Label | `SearchField` | 1 | 완료 |
| Select 95:2819 | `select` (21) Size · State Default/Hover/Open/Completed/Error/Disabled/Read-only · `select_message` (3) · `listbox` (3) · `option` (15) Default/Hover/Pressed/Selected/Disabled | `Select`, `SelectOption` | 2 | 완료 |
| Checkbox 98:2375 | `checkbox` (36) Selection Unchecked/Checked/Indeterminate · Size sm/md/lg · State 4 · Label | `Checkbox`, `CheckboxGroup` | 2 | 완료 |
| Radio 100:3180 | `radio` (24) Selection · Size · State · Label | `Radio`, `RadioGroup` | 2 | 완료 |
| Switch 107:188 | `switch` (16) Size sm/md · State 4 · Checked · Label | `Switch` | 2 | 완료 |
| Slider 379:1562 | `slider` (2) Default/Disabled · Show Input · `handle` (5) | `Slider` | 2 | 완료 |
| Segmented Control 476:21053 | `segmented-control` (3) Size md/sm/xs · `segmented-item` (18) Selected/Unselected · Size · State | `SegmentedControl`, `SegmentedControlItem` | 2 | 완료 |
| Chip 180:11829 | `chip-multi` (24) · `chip-input` (12) · `chip-filter` (48, Expanded) | `Chip`, `InputChip`, `FilterChip` | 2 | 완료 |
| Date Picker 149:831 | `date-picker_trigger` (21) · `_message` (3) · `_day` (7) · `_navigation` (8) · `date-picker_header` · `date-picker_calendar` | `DatePicker`, `Calendar` | 3 | 완료 |
| File Uploader 675:4910 | `file-uploader` (5) State Default/Hover/Pressed/Drag-over/Disabled · `file-uploader-item` (3) Completed/uploading/download | `FileUploader`, `FileUploaderItem` | 3 | 완료 |
| ~~Combobox~~ | Figma에서 삭제됨 | — | 3 | 구현 불가 |

## Navigation

| Figma 프레임 | Component Set (Variant 수) · 속성 | React | Phase | 상태 |
| --- | --- | --- | --- | --- |
| Link 111:960 | `link` (15) Size lg/sm/md · State Default/Hover/Pressed/Visited/Disabled · Icon | `Link` | 4 | 완료 |
| Navigation 180:2023 | `item_parent` (4) Expanded · `item_link` (4) Selected · `item_child` (4) · State Default/Hover | `Navigation`, `NavLink`, `NavGroup`, `NavChild`, `NavParentItem` | 4 | 완료 |
| Tab 86:3121 | `tab_filled` (60) Variant · Size · Shape · State 5 · `tab_line` (30) | `Tabs`, `TabList`, `Tab`, `TabPanel` | 4 | 완료 |
| Pagination 149:1030 | `pagination` (3) · `pagination_item` (24) · `pagination_control` (48) | `Pagination`, `PaginationItem`, `PaginationControl` | 4 | 완료 |
| Breadcrumb 721:13374 | `breadcrumb` (6) Size · Layout Full/Collapsed · Expanded · `breadcrumb-item` (12) Role Link/Current/Open | `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbSeparator` | 4 | 완료 |
| Stepper 151:697 | `stepper_horizontal` (3) · `stepper_vertical` (3) Steps 3/4/5 · indicators (5+5) Upcoming/Current/Completed/Locked/Error · connectors (2+2) | `Stepper`, `StepperIndicator`, `StepperConnector` | 4 | 완료 |
| Dropdown Menu 179:2465 | `dropdownmenu_item` (5) Type Content/Title · State Default/Hover/Disabled/Alert/None · `dropdownmenu_line` | `DropdownMenu`, `DropdownMenuItem`, `DropdownMenuSection`, `DropdownMenuSeparator` | 4 | 완료 |

## Feedback / Overlay

| Figma 프레임 | Component Set (Variant 수) · 속성 | React | Phase | 상태 |
| --- | --- | --- | --- | --- |
| Badge 91:5943 | `badge_dot` (21) · `badge_status` (84) Status 7 · Appearance · Size · Shape · `badge_count` (14) | `Badge`, `BadgeDot`, `BadgeCount` | 5 | 완료 |
| Progress 185:6435 | `progress` (단일) | `Progress` | 5 | 완료 |
| Alert 179:5471 | `alert` (3) Information/Success/Error · Sub, Button, Icon | `Alert` | 5 | 완료 |
| Toast 91:5557 | `toast` (3) Information/Success/Error · Close Icon | `Toast`, `ToastRegion`, `showToast` | 5 | 완료 |
| Tooltip 149:780 | `tooltip` (4) Placement Top/Right/Bottom/Left · Arrow | `Tooltip` | 5 | 완료 |
| Empty State 174:1480 | `empty-state` (단일) Description, Icon | `EmptyState` | 5 | 완료 |
| Dialog 149:1287 | `dialog` (단일, 420×228) | `Dialog` | 6 | 완료 |
| ~~Popover~~ | Figma에서 삭제됨 | — | 6 | 구현 불가 |
| ~~Drawer~~ | Figma에서 삭제됨 | — | 6 | 구현 불가 |

## Data Display / Layout

| Figma 프레임 | Component Set (Variant 수) · 속성 | React | Phase | 상태 |
| --- | --- | --- | --- | --- |
| Accordion 796:5813 | `accordion-item` (10, 작업 중 14→10: Focus 상태 삭제) Size md/sm · State Default/Hover/Disabled · Expanded | `Accordion`, `AccordionItem` | 6 | 완료 |
| Table 351:3340 | `table_header` (3) · `table_body` (8) · `table_key` (2) · `table_value` (2) · `table_value_editable` (52) | `Table` (+ Header · Column · Body · Row · Cell), `KeyValueTable`, `KeyValueItem`, `KeyValueGroup`, `ImageUploadPreview` | 7 | 완료 (editable 3개 수동 검토 — F58) |
| Card 185:6512 (숨김) | `Frame 2147239186` · `Wrapper` | `Card`, `CardHeader`, `CardContent`, `CardFooter` | 7 | 완료 (Figma 프레임 숨김 — 위치 · 크기만 검증, F61) |
| Chart 773:6723 | `chart` (12) Type Line/Bar Vertical/Bar Horizontal · Style Default/Simple · Group no/yes · `chart-legend-item` (3) Line/Dash Line/Bar · `chart-tooltip` (단일) | `Chart`, `ChartLegendItem`, `ChartTooltip` | 7 | 완료 (간단 선 차트 그림 영역 · 차트 안 툴팁 위치는 수동 검토 — F63 · F64) |
| Loading 149:3000 | `loading` (2) size md/sm · text | `Loading` | 7 | 완료 (Phase 3에서 File Uploader와 함께) |

## Dashboard components (별도 섹션 728:25472)

| Component Set (Variant 수) · 속성 | React | Phase | 상태 |
| --- | --- | --- | --- |
| `metric-trend` (12) Direction Up/Down/Flat/Disabled · Tone Positive/Negative/Neutral | `MetricTrend` | 8 | 완료 |
| `data-state` (6) Loading/Empty/No-results/Error/No-access/Partial | `DataState` | 8 | 완료 |
| `skeleton` (4) Shape Line/Block/Circle/Shape4 | `Skeleton` | 8 | 완료 |
| `data-freshness` (3) Fresh/Stale/Offline | `DataFreshness` | 8 | 완료 |
| `metric-card` (단일) | `MetricCard` | 8 | 완료 |
| `dashboard-filter-bar` (단일) | `DashboardFilterBar`, `DashboardFilterGroup`, `DashboardFilterRange` | 8 | 완료 (초기화 버튼 Secondary · Solid — 2026-10-19 F31 동기화로 반영, "최근 30일" F71 해결) |

## 컴포넌트가 아닌 프레임

`Rules`, `Rules2`, `Design System Rules` — 토큰 계층 규칙 문서(Component는 Component Variable → Semantic 연결).
`History` 섹션, `데이터 대시보드 · JH × shadcn` 화면, `Vector 1` — 화면 예시·장식.
