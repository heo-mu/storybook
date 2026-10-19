# 공개 API 가이드 — 쓸 것과 쓰지 말 것

**자동 생성 문서** — `npm run docs:api`(분류표는 `scripts/generate-api-docs.mjs` 맨 위). Props 상세는 [api.md](./api.md).

## 요약

| 분류 | 개수 | 쓰는 법 |
| --- | ---: | --- |
| 공개 컴포넌트 | 49 | 화면에 바로 배치합니다. |
| 보조 컴포넌트 | 32 | 적힌 상위 컴포넌트 안에서만 조합합니다. |
| 타입 | 125 | `<컴포넌트>Props`와 값 타입(`ISODate`, `BreadcrumbEntry`, `ChartSeries` …) |
| 상수 | 45 | Figma 속성 값 목록(`BUTTON_VARIANTS` 등) — 선택지 UI · 값 검증용 |
| 함수 | 2 | `showToast()` · `closeToast()` |
| 아이콘 | 35 | `<이름>Icon` 컴포넌트 |
| **내부 부품 — 사용 금지** | 7 | 상위 컴포넌트가 그립니다. |
| **내부 API — 사용 금지** | 13 | 아래 대체 수단을 씁니다. |
| 합계 | 308 | `src/index.ts`의 export 전체 |

내부 부품 · 내부 API는 하위 호환을 보장하지 않으며 다음 메이저 버전에서 export 목록에서 빠질 수 있습니다.

## 가져오는 경로

- 컴포넌트 · 타입 · 아이콘: `import { … } from 'platform-design-system'` 하나만 씁니다.
- 스타일: `platform-design-system/styles.css`(컴포넌트 + 토큰), 글꼴 `platform-design-system/fonts.css`, 토큰만 `platform-design-system/tokens.css` · `platform-design-system/tokens/*`.
- 그 밖의 경로(`platform-design-system/dist/...`, `src/...`)는 `package.json` `exports`에 없어 가져올 수 없고, 가져와서도 안 됩니다.

## 1. 공개 컴포넌트 (49)

| 컴포넌트 | 용도 | Figma | 함께 쓰는 보조 컴포넌트 |
| --- | --- | --- | --- |
| [`Button`](./api.md#button) | 기본 버튼 — Primary · Secondary · Tertiary × Solid · Outline | `button_basic` 54:2904 |  |
| [`IconButton`](./api.md#button) | 아이콘만 있는 버튼(`aria-label` 필수) | `button_icon` 67:2368 |  |
| [`TextButton`](./api.md#button) | 배경 없는 텍스트 버튼 | `button_text` 432:8395 |  |
| [`Input`](./api.md#input) | 한 줄 입력 | `input` 76:2945 · `input_message` 83:3009 |  |
| [`Textarea`](./api.md#textarea) | 여러 줄 입력 | `textarea` 86:2597 · `textarea_message` 86:2733 |  |
| [`SearchField`](./api.md#searchfield) | 검색 입력 | `search-field` 216:6570 |  |
| [`Checkbox`](./api.md#checkbox) | 체크박스(단독 또는 `CheckboxGroup` 안) | `checkbox` 99:2389 |  |
| [`CheckboxGroup`](./api.md#checkbox) | 체크박스 묶음(라벨 · 방향 · 크기) | — |  |
| [`RadioGroup`](./api.md#radio) | 라디오 묶음 | — | `Radio` |
| [`Switch`](./api.md#switch) | 켜기 · 끄기 | `switch` 107:409 |  |
| [`Select`](./api.md#select) | 목록에서 하나 선택 | `select` 95:4740 · `listbox` 97:2665 · `option` 97:2286 | `SelectOption` |
| [`Slider`](./api.md#slider) | 범위 값 선택 | `slider` 391:1988 · `handle` 391:2013 |  |
| [`SegmentedControl`](./api.md#segmentedcontrol) | 세그먼트 선택 | `segmented-control` 531:24471 · `segmented-item` 524:24397 | `SegmentedControlItem` |
| [`Chip`](./api.md#chip) | 선택 칩 | `chip-multi` 201:12711 |  |
| [`InputChip`](./api.md#chip) | 지울 수 있는 입력값 칩 | `chip-input` 558:26017 |  |
| [`FilterChip`](./api.md#chip) | 필터 칩(메뉴 · 패널을 여는 트리거) | `chip-filter` 558:25704 |  |
| [`Calendar`](./api.md#calendar) | 달력(화면에 펼쳐 둔 형태) | `date-picker_calendar` 144:1644 · `date-picker_header` 144:1377 · `date-picker_day` 144:1033 |  |
| [`DatePicker`](./api.md#datepicker) | 날짜 입력 + 달력 | `date-picker_trigger` 144:723 · `date-picker_message` 144:888 |  |
| [`Loading`](./api.md#loading) | 로딩 표시 | `loading` 675:5644 |  |
| [`FileUploader`](./api.md#fileuploader) | 파일 업로드 영역 | `file-uploader` 651:3945 | `FileUploaderItem` |
| [`Link`](./api.md#link) | 텍스트 링크 | `link` 111:1509 |  |
| [`Tabs`](./api.md#tabs) | 탭 | `tab_filled` 91:5000 · `tab_line` 91:5241 | `TabList` `TabPanel` |
| [`Pagination`](./api.md#pagination) | 페이지 이동 | `pagination` 132:871 |  |
| [`DropdownMenu`](./api.md#dropdownmenu) | 동작 메뉴 | `dropdownmenu_item` 179:4819 · `dropdownmenu_line` 179:5082 | `DropdownMenuItem` `DropdownMenuSection` `DropdownMenuSeparator` |
| [`Breadcrumb`](./api.md#breadcrumb) | 현재 위치 경로(`items`) | `breadcrumb` 712:5106 |  |
| [`Navigation`](./api.md#navigation) | 좌측 메뉴(LNB) | — | `NavLink` `NavGroup` |
| [`Stepper`](./api.md#stepper) | 단계 진행 표시(`steps`) | `stepper_horizontal` 179:2043 · `stepper_vertical` 203:3949 |  |
| [`Badge`](./api.md#badge) | 상태 배지 | `badge_status` 91:6152 |  |
| [`BadgeDot`](./api.md#badge) | 점 배지(새 항목 표시 등) | `badge_dot` 95:2681 |  |
| [`BadgeCount`](./api.md#badge) | 숫자 배지 | `badge_count` 95:2762 |  |
| [`Progress`](./api.md#progress) | 진행 막대 | `progress` 185:6518 |  |
| [`Alert`](./api.md#alert) | 화면 안 알림 메시지 | `alert` 179:6087 |  |
| [`Toast`](./api.md#toast) | 화면 안에 고정해 두는 토스트(정적) | `toast` 91:5927 |  |
| [`ToastRegion`](./api.md#toast) | 토스트 표시 영역 — 앱에 1개, `showToast()` · `closeToast()`와 함께 | — |  |
| [`Tooltip`](./api.md#tooltip) | 툴팁 | `tooltip` 149:1111 |  |
| [`EmptyState`](./api.md#emptystate) | 빈 상태 안내 | `empty-state` 724:14963 |  |
| [`Accordion`](./api.md#accordion) | 아코디언 묶음 | — |  |
| [`AccordionItem`](./api.md#accordion) | 아코디언 항목(단독 사용 가능) | `accordion-item` 1035:15648 |  |
| [`Dialog`](./api.md#dialog) | 대화 상자 | `dialog` 149:2838 |  |
| [`Table`](./api.md#table) | 데이터 표(정렬 · 선택 · 순서 변경) | `table_header` 351:3452 · `table_body` 355:3739 | `TableHeader` `TableBody` |
| [`KeyValueTable`](./api.md#table) | 항목명–값 표(조회 · 관리 모드) | — | `KeyValueItem` |
| [`Card`](./api.md#card) | 카드 컨테이너 | — | `CardHeader` `CardContent` `CardFooter` |
| [`Chart`](./api.md#chart) | 차트(선 · 세로 막대 · 가로 막대) | `chart` 698:4399 |  |
| [`Skeleton`](./api.md#skeleton) | 로딩 자리 표시 | `skeleton` 697:4486 |  |
| [`MetricTrend`](./api.md#metrictrend) | 증감 표시 | `metric-trend` 697:4482 |  |
| [`DataFreshness`](./api.md#datafreshness) | 데이터 기준 시각 · 갱신 상태 | `data-freshness` 697:4543 |  |
| [`MetricCard`](./api.md#metriccard) | 대시보드 지표 카드 | `metric-card` 697:4487 |  |
| [`DataState`](./api.md#datastate) | 데이터 상태(로딩 · 오류 · 결과 없음 등) | `data-state` 698:4359 |  |
| [`DashboardFilterBar`](./api.md#dashboardfilterbar) | 대시보드 조회 조건 막대 | `dashboard-filter-bar` 698:4163 | `DashboardFilterGroup` |

## 2. 보조 컴포넌트 (32)

| 컴포넌트 | 쓰는 곳 | Figma |
| --- | --- | --- |
| `Radio` | `RadioGroup` 안 | `radio` 102:2677 |
| `SelectOption` | `Select` 안 | `option` 97:2286 |
| `SegmentedControlItem` | `SegmentedControl` 안 | — |
| `TabList` | `Tabs` 안 | — |
| `Tab` | `TabList` 안 | — |
| `TabPanel` | `Tabs` 안 | — |
| `DropdownMenuItem` | `DropdownMenu` 안 | — |
| `DropdownMenuSection` | `DropdownMenu` 안 | — |
| `DropdownMenuSeparator` | `DropdownMenu` 안 | — |
| `NavLink` | `Navigation` 안 | `item_link` 180:6174 |
| `NavGroup` | `Navigation` 안 | — |
| `NavChild` | `NavGroup` 안 | `item_child` 180:6249 |
| `TableHeader` | `Table` 안 | — |
| `TableColumn` | `TableHeader` 안 | — |
| `TableSelectionColumn` | `TableHeader` 안(다중 선택 표) | — |
| `TableEmptyColumn` | `TableHeader` 안(제목 없는 열) | — |
| `TableBody` | `Table` 안 | — |
| `TableRow` | `TableBody` 안 | — |
| `TableCell` | `TableRow` 안 | — |
| `TableSelectionCell` | `TableRow` 안(다중 선택 표) | — |
| `TableDragHandle` | `TableCell` 안(순서 변경 표) | — |
| `KeyValueItem` | `KeyValueTable` 안 | `table_key` 355:4193 · `table_value` 355:4460 |
| `KeyValueGroup` | `KeyValueItem` 안(값 여러 개를 한 줄로) | — |
| `CardHeader` | `Card` 안 | — |
| `CardContent` | `Card` 안 | — |
| `CardFooter` | `Card` 안 | — |
| `DashboardFilterGroup` | `DashboardFilterBar` 안 | — |
| `DashboardFilterRange` | `DashboardFilterGroup` 안(기간 등 두 값) | — |
| `FileUploaderItem` | `FileUploader` 아래 파일 목록 | `file-uploader-item` 651:3999 |
| `ImageUploadPreview` | `KeyValueItem`의 이미지 업로드 칸 | — |
| `ChartLegendItem` | 직접 만드는 범례(`Chart`는 범례를 스스로 그림) | `chart-legend-item` 697:4514 |
| `ChartTooltip` | 직접 만드는 차트의 값 표시(`Chart`는 툴팁을 스스로 그림) | `chart-tooltip` 693:9776 |

## 3. 사용 금지 — 내부 API

### 내부 부품 (7)

Figma 하위 세트를 그대로 옮긴 부품으로, 상위 컴포넌트가 상태 · 라벨 · 키보드 동작과 함께 그립니다. 직접 쓰면 이 동작이 빠집니다.

| 이름 | 대신 쓸 것 | Figma |
| --- | --- | --- |
| `PaginationItem` | `Pagination` | `pagination_item` 132:520 |
| `PaginationControl` | `Pagination` | `pagination_control` 132:604 |
| `BreadcrumbItem` | `Breadcrumb` | `breadcrumb-item` 710:4794 |
| `BreadcrumbSeparator` | `Breadcrumb` | `breadcrumb-modern-separator` 710:4795 |
| `StepperIndicator` | `Stepper` | `stepper_indicator_horizontal` 179:1621 · `stepper_indicator_vertical` 203:3708 |
| `StepperConnector` | `Stepper` | `stepper_connector_horizontal` 179:1614 · `stepper_connector_vertical` 203:4253 |
| `NavParentItem` | `NavGroup` | `item_parent` 180:5246 |

### 내부 함수 · 상수 · 타입 (13)

| 이름 | 종류 | 대신 쓸 것 | 이유 |
| --- | --- | --- | --- |
| `resolveAppearance` | function | `Button` · `IconButton`의 `appearance` 생략 | Button 내부의 기본값 계산 |
| `toastQueue` | value | `showToast()` · `closeToast()` | react-aria UNSTABLE_ToastQueue 그대로 — 라이브러리 업데이트 때 바뀔 수 있음 |
| `BUTTON_STATES` | constant | — | Figma State 목록(Hover · Pressed는 Prop이 아니라 `:hover` · `:active`) — 스토리 · 검증용 |
| `ButtonState` | type | — | `BUTTON_STATES`의 타입 |
| `BUTTON_TONES` | constant | `BUTTON_VARIANTS` · `BUTTON_APPEARANCES` | Figma Variant × Appearance 조합 목록 — 스토리 · 검증용 |
| `ButtonToneProps` | type | `ButtonProps` / `IconButtonProps` | Props 구성용 보조 타입 |
| `ButtonDisabledProp` | type | `ButtonProps` / `IconButtonProps` / `TextButtonProps` | Props 구성용 보조 타입 |
| `PaginationItemProps` | type | `PaginationProps` | 내부 부품의 Props |
| `PaginationControlProps` | type | `PaginationProps` | 내부 부품의 Props |
| `BreadcrumbItemProps` | type | `BreadcrumbProps` · `BreadcrumbEntry` | 내부 부품의 Props |
| `StepperIndicatorProps` | type | `StepperProps` · `StepperStep` | 내부 부품의 Props |
| `StepperConnectorProps` | type | `StepperProps` | 내부 부품의 Props |
| `NavParentItemProps` | type | `NavGroupProps` | 내부 부품의 Props |

### export 되지 않는 내부 구현

- CSS 클래스(`.ds-…`), 컴포넌트 CSS의 지역 변수(`--_…`, `--ds-button-…` 등), `data-*` 속성: 구조 · 이름이 예고 없이 바뀔 수 있습니다.
  모양을 바꿀 때는 Prop · `className`(바깥 여백 · 배치)과 **토큰 CSS 변수**(`--colors-…`, `--spacing-…`; 공개 API)를 씁니다.
- `src/components/*/stories/`의 스토리 도우미, `figma/` · `figma-pending/` · `scripts/`는 패키지에 들어가지 않습니다.
- react-aria-components의 UNSTABLE API(토스트 큐 등)는 이 패키지의 래퍼로만 씁니다.

## 4. 상수 · 아이콘

- 상수: `FIELD_SIZES`, `FIELD_MESSAGE_TYPES`, `CHOICE_SIZES`, `CHOICE_GROUP_ORIENTATIONS`, `BUTTON_VARIANTS`, `BUTTON_APPEARANCES`, `BUTTON_SHAPES`, `BUTTON_SIZES`, `ICON_BUTTON_SIZES`, `TEXT_BUTTON_VARIANTS`, `TEXT_BUTTON_SIZES`, `TEXTAREA_SIZES`, `SEARCH_FIELD_APPEARANCES`, `SWITCH_SIZES`, `SEGMENTED_CONTROL_SIZES`, `CHIP_SIZES`, `LOADING_SIZES`, `FILE_UPLOADER_ITEM_STATUSES`, `LINK_SIZES`, `TABS_APPEARANCES`, `TABS_VARIANTS`, `TABS_SIZES`, `TABS_SHAPES`, `PAGINATION_SIZES`, `PAGINATION_SHAPES`, `BREADCRUMB_SIZES`, `BREADCRUMB_LAYOUTS`, `STEPPER_ORIENTATIONS`, `STEPPER_STATUSES`, `BADGE_STATUSES`, `BADGE_APPEARANCES`, `BADGE_SIZES`, `BADGE_SHAPES`, `ALERT_STATUSES`, `TOOLTIP_PLACEMENTS`, `ACCORDION_SIZES`, `CHART_TYPES`, `CHART_VARIANTS`, `CHART_LEGEND_TYPES`, `CHART_COLORS`, `SKELETON_SHAPES`, `METRIC_TREND_DIRECTIONS`, `METRIC_TREND_TONES`, `DATA_FRESHNESS_STATES`, `DATA_STATES`
- 아이콘: `CaretLeftIcon`, `CaretRightIcon`, `PlusIcon`, `XIcon`, `EyeIcon`, `MagnifyingGlassIcon`, `InfoFillIcon`, `CheckCircleFillIcon`, `XCircleFillIcon`, `CheckBoldIcon`, `MinusBoldIcon`, `CaretDownIcon`, `CaretUpIcon`, `CheckIcon`, `CalendarDotsIcon`, `UploadSimpleIcon`, `DownloadSimpleIcon`, `FileTextIcon`, `ArrowSquareOutIcon`, `FolderSimpleDashedIcon`, `HouseIcon`, `DotsThreeIcon`, `ListIcon`, `CheckCircleIcon`, `WarningCircleIcon`, `DatabaseIcon`, `InfoIcon`, `CaretUpDownIcon`, `NotePencilIcon`, `ArrowCounterClockwiseIcon`, `TrendUpIcon`, `TrendDownIcon`, `MinusIcon`, `LightningIcon`, `WarningIcon`
