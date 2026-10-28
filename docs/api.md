# Public API

`platform-design-system`이 export 하는 전부입니다. **자동 생성 문서** — `npm run docs:api`로 다시 만듭니다(직접 수정하지 마세요).

- 어떤 컴포넌트를 써야 하는지와 사용 금지 목록은 [public-api.md](./public-api.md)에 있습니다. 각 컴포넌트 제목 아래에 분류를 적었습니다.
- Props 표는 각 컴포넌트가 직접 정의한 Prop만 보여 줍니다. 그 밖의 HTML 속성(`className`, `style`, `aria-*`, 이벤트 등)과
  react-aria-components 기반 컴포넌트의 react-aria Prop(`onPress` 등)은 그대로 전달됩니다(각 컴포넌트의 사용 방법 문서 참고).
- 모든 컴포넌트는 `ref`를 실제 DOM 요소로 전달합니다(`forwardRef`).

export 319개: 공개 컴포넌트 50 · 보조 컴포넌트 32 · 내부 부품 7 · 타입 131 · 상수 45 · 함수 3 · 아이콘 38 · 내부 API 13

## 목차

[Accordion](#accordion) · [Alert](#alert) · [Badge](#badge) · [Breadcrumb](#breadcrumb) · [Button](#button) · [Calendar](#calendar) · [Card](#card) · [Chart](#chart) · [Checkbox](#checkbox) · [Chip](#chip) · [Choice](#choice) · [DashboardFilterBar](#dashboardfilterbar) · [DataFreshness](#datafreshness) · [DataState](#datastate) · [DatePicker](#datepicker) · [Dialog](#dialog) · [DropdownMenu](#dropdownmenu) · [EmptyState](#emptystate) · [Field](#field) · [FileUploader](#fileuploader) · [Input](#input) · [Link](#link) · [Loading](#loading) · [MetricCard](#metriccard) · [MetricTrend](#metrictrend) · [Navigation](#navigation) · [Pagination](#pagination) · [Progress](#progress) · [Radio](#radio) · [SearchField](#searchfield) · [SegmentedControl](#segmentedcontrol) · [Select](#select) · [Skeleton](#skeleton) · [Slider](#slider) · [Stepper](#stepper) · [Switch](#switch) · [Table](#table) · [Tabs](#tabs) · [Textarea](#textarea) · [Toast](#toast) · [Tooltip](#tooltip) · [아이콘](#아이콘) · [기타](#기타)

## Accordion

### `Accordion`

**공개 컴포넌트**

관련 콘텐츠를 접고 펼쳐 필요한 정보부터 확인할 수 있는 컴포넌트입니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 안에 넣을 `AccordionItem` 항목들. |
| `allowsMultipleExpanded` | `boolean` | `false` | 여러 항목을 동시에 펼칠 수 있습니다. 끄면 한 번에 한 항목만 펼칩니다. |
| `className` | `string` |  |  |
| `defaultExpandedKeys` | `Iterable<Key>` |  | 처음 펼칠 항목의 `id` 목록. 직접 제어하지 않을 때 씁니다. |
| `expandedKeys` | `Iterable<Key>` |  | 펼친 항목의 `id` 목록. 직접 제어할 때 씁니다. |
| `onExpandedChange` | `((keys: Set<Key>) => void)` |  | 펼친 항목이 바뀌면 펼친 항목의 `id` 목록과 함께 호출됩니다. |
| `size` | `"sm" \| "md"` | `md` | 크기. 모든 항목에 적용됩니다. |

### `AccordionItem`

**공개 컴포넌트**

제목을 눌러 내용을 펼치거나 접는 아코디언 항목입니다. 마우스를 올리면 모양이 바뀌고, `disabled`이면 펼칠 수 없습니다. 보통 `Accordion` 안에 넣으며 단독으로도 쓸 수 있습니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 펼쳤을 때 보이는 내용. |
| `title` *(필수)* | `ReactNode` |  | 제목. |
| `className` | `string` |  |  |
| `defaultExpanded` | `boolean` |  | 처음 펼침 여부. 단독으로 쓰며 직접 제어하지 않을 때 씁니다. |
| `description` | `ReactNode` |  | 제목 아래 설명. |
| `disabled` | `boolean` |  | 비활성 — 펼칠 수 없고 키보드 포커스를 받지 않습니다. |
| `divider` | `boolean` | `true` | 아래 구분선을 표시합니다. 비활성 상태에서는 표시하지 않습니다. |
| `expanded` | `boolean` |  | 펼침 여부. `Accordion` 밖에서 단독으로 쓰며 직접 제어할 때 씁니다. |
| `headingLevel` | `3 \| 2 \| 4 \| 5 \| 6` | `3` | 제목의 제목 요소 수준(`h2` – `h6`). |
| `id` | `Key` |  | 항목 id. `expandedKeys` · `defaultExpandedKeys`에서 이 값을 씁니다. |
| `onExpandedChange` | `((expanded: boolean) => void)` |  | 항목을 펼치거나 접을 때 호출됩니다. |

- 상수: `ACCORDION_SIZES`
- 타입: `AccordionProps`, `AccordionItemProps`, `AccordionSize`

## Alert

### `Alert`

**공개 컴포넌트**

현재 화면에서 알아야 할 상태나 안내를 지속적으로 표시합니다. 일시적인 작업 결과는 Toast를 사용합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `title` *(필수)* | `ReactNode` |  | 제목. |
| `action` | `ReactNode` |  | 오른쪽에 놓는 버튼. 예: `<Button variant="tertiary" appearance="outline" size="xs">` |
| `description` | `ReactNode` |  | 제목 아래 설명. 길면 줄을 바꿔 모두 보여 줍니다. |
| `showIcon` | `boolean` | `true` | 상태 아이콘을 표시합니다. |
| `status` | `"success" \| "error" \| "warning" \| "information"` | `information` | 종류 — 안내 · 성공 · 주의 · 오류. 종류마다 아이콘과 색이 다릅니다. |

- 상수: `ALERT_STATUSES`
- 타입: `AlertProps`, `AlertStatus`

## Badge

### `Badge`

**공개 컴포넌트**

상태나 개수를 간결하게 표시합니다. 사용자 동작을 실행하는 버튼과 구분해 사용합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 배지 글자. |
| `appearance` | `"outline" \| "filled"` | `filled` | 모양 — 채움(filled) · 테두리(outline). 테두리 모양은 배경이 없습니다. |
| `dot` | `boolean` | `true` | 글자 앞에 점을 표시합니다. |
| `shape` | `"square" \| "rounded"` | `square` | 모서리 모양. |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | 크기. |
| `status` | `"success" \| "danger" \| "basic" \| "gray" \| "point" \| "warning" \| "information"` | `basic` | 종류 — 상태를 나타내는 색. |

### `BadgeDot`

**공개 컴포넌트**

글자 없이 점 하나로 상태를 알리는 배지입니다(예: 새 글 표시).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | 크기 — 점 지름 4 · 6 · 8px. |
| `status` | `"success" \| "danger" \| "basic" \| "gray" \| "point" \| "warning" \| "information"` | `basic` | 종류 — 상태를 나타내는 색. |

### `BadgeCount`

**공개 컴포넌트**

개수를 숫자로 알려 주는 배지입니다. `max`보다 큰 수는 "99+"처럼 줄여 보여 줍니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `count` *(필수)* | `number` |  | 표시할 숫자. |
| `max` | `number` | `99` | 이 값보다 큰 수는 "99+"처럼 줄여 표시합니다. |
| `status` | `"success" \| "danger" \| "basic" \| "gray" \| "point" \| "warning" \| "information"` | `basic` | 종류 — 상태를 나타내는 색. |

- 상수: `BADGE_STATUSES`, `BADGE_APPEARANCES`, `BADGE_SIZES`, `BADGE_SHAPES`
- 타입: `BadgeProps`, `BadgeDotProps`, `BadgeCountProps`, `BadgeStatus`, `BadgeAppearance`, `BadgeSize`, `BadgeShape`

## Breadcrumb

### `Breadcrumb`

**공개 컴포넌트**

홈에서 현재 페이지까지의 계층 경로를 표시하고 상위 페이지로 이동할 수 있게 합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `items` *(필수)* | `BreadcrumbEntry[]` |  | 맨 위 단계부터 현재 페이지의 바로 위 페이지까지의 경로. |
| `current` | `ReactNode` | `false` | 현재 페이지 이름. |
| `defaultExpanded` | `boolean` | `false` | 처음에 … 메뉴를 열어 둘지 여부. `expanded` 없이 스스로 관리할 때 씁니다. |
| `expanded` | `boolean` |  | … 메뉴가 열렸는지 여부. 넘기면 바깥에서 관리합니다. |
| `homeHref` | `string` | `/` | 홈 아이콘의 링크 주소. |
| `homeLabel` | `string` | `홈` | 화면 낭독기가 읽는 홈 이름. |
| `layout` | `"full" \| "collapsed"` | `full` | 배치. `collapsed`는 홈 · 상위 페이지 · 현재 페이지만 보여 주고 나머지 경로를 … 메뉴에 넣습니다. |
| `menuTitle` | `string` | `상위 경로` | … 메뉴의 제목. |
| `moreLabel` | `string` | `중간 경로 보기` | 화면 낭독기가 읽는 … 버튼 이름. |
| `onAction` | `((id: Key) => void)` |  | `href`가 없는 경로를 누르면(경로나 … 메뉴에서) 그 경로의 `id`로 호출됩니다. |
| `onExpandedChange` | `((expanded: boolean) => void)` |  | … 메뉴가 열리거나 닫히면 호출됩니다. |
| `showParent` | `boolean` | `true` | `collapsed`에서 상위 페이지를 현재 페이지 옆에 보여 줄지 여부. |
| `size` | `"sm" \| "md"` | `md` | 크기. |

### `BreadcrumbItem`

⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 `Breadcrumb` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).

경로의 한 단계입니다. `href`가 있으면 링크, 없으면 버튼이 됩니다. `Breadcrumb`이 안에서 그립니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | 항목 글자. 없으면 아이콘만 보이므로 `aria-label`을 붙입니다. |
| `current` | `boolean` | `false` | 현재 페이지 — 링크가 아닌 글자로 보이고, 화면 낭독기에 현재 페이지로 알려집니다. |
| `icon` | `ReactNode` |  | 글자 앞 아이콘(홈 아이콘, … 아이콘 등). |
| `open` | `boolean` | `false` | 메뉴가 열린 항목 — 강조된 글자로 보입니다. |
| `size` | `"sm" \| "md"` | `md` | 크기. |

### `BreadcrumbSeparator`

⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 `Breadcrumb` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).

경로 단계 사이의 오른쪽 화살표입니다. `Breadcrumb`이 안에서 그립니다.

- 상수: `BREADCRUMB_SIZES`, `BREADCRUMB_LAYOUTS`
- 타입: `BreadcrumbProps`, `BreadcrumbItemProps` *(내부 — 사용 금지)*, `BreadcrumbEntry`, `BreadcrumbSize`, `BreadcrumbLayout`

## Button

### `Button`

**공개 컴포넌트**

저장·조회·다음 단계 이동 등 사용자 동작을 실행합니다. 동작의 중요도에 맞춰 종류를 선택합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 버튼 글자. |
| `appearance` | `"solid" \| "outline"` | `'solid' (secondary는 'outline')` | 모양 — 채움(solid) · 테두리(outline). |
| `disabled` | `boolean` |  | 비활성 — 누를 수 없고 키보드로도 선택되지 않습니다. |
| `leftIcon` | `ReactNode` |  | 글자 왼쪽 아이콘. 넘기면 표시되며 버튼 크기에 맞춰집니다. |
| `rightIcon` | `ReactNode` |  | 글자 오른쪽 아이콘. 넘기면 표시되며 버튼 크기에 맞춰집니다. |
| `shape` | `"square" \| "rounded"` | `square` | 모서리 모양. |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `xs` | 크기. |
| `variant` | `"primary" \| "secondary" \| "tertiary"` | `primary` | 종류 — 행동의 중요도. |

### `IconButton`

**공개 컴포넌트**

아이콘으로 동작을 표현하는 버튼입니다. `aria-label`로 동작의 이름을 제공합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `aria-label` *(필수)* | `string` |  | 화면 낭독기가 읽는 버튼 이름(필수). |
| `icon` *(필수)* | `ReactNode` |  | 표시할 아이콘. 버튼 크기에 맞춰집니다. |
| `appearance` | `"solid" \| "outline"` | `'solid' (secondary는 'outline')` | 모양 — 채움(solid) · 테두리(outline). |
| `disabled` | `boolean` |  | 비활성 — 누를 수 없고 키보드로도 선택되지 않습니다. |
| `shape` | `"square" \| "rounded"` | `square` | 모서리 모양. |
| `size` | `"xs" \| "sm" \| "md"` | `xs` | 크기. |
| `variant` | `"primary" \| "secondary" \| "tertiary"` | `primary` | 종류 — 행동의 중요도. |

### `TextButton`

**공개 컴포넌트**

더보기 등 강조도가 낮은 보조 동작에 사용하는 텍스트 버튼입니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 버튼 글자. |
| `disabled` | `boolean` |  | 비활성 — 누를 수 없고 키보드로도 선택되지 않습니다. |
| `leftIcon` | `ReactNode` |  | 글자 왼쪽 아이콘. |
| `rightIcon` | `ReactNode` |  | 글자 오른쪽 아이콘. |
| `size` | `"sm" \| "md"` | `sm` | 크기. |
| `variant` | `"primary" \| "secondary"` | `primary` | 종류. |

- 상수: `BUTTON_VARIANTS`, `BUTTON_APPEARANCES`, `BUTTON_SHAPES`, `BUTTON_SIZES`, `ICON_BUTTON_SIZES`, `TEXT_BUTTON_VARIANTS`, `TEXT_BUTTON_SIZES`, `BUTTON_STATES` *(내부 — 사용 금지)*, `BUTTON_TONES` *(내부 — 사용 금지)*
- 함수: `resolveAppearance` *(내부 — 사용 금지)*
- 타입: `ButtonProps`, `IconButtonProps`, `TextButtonProps`, `ButtonVariant`, `ButtonAppearance`, `ButtonShape`, `ButtonSize`, `IconButtonSize`, `TextButtonVariant`, `TextButtonSize`, `ButtonState` *(내부 — 사용 금지)*, `ButtonToneProps` *(내부 — 사용 금지)*, `ButtonDisabledProp` *(내부 — 사용 금지)*

## Calendar

### `Calendar`

**공개 컴포넌트**

단일 날짜 또는 기간을 선택하는 달력입니다. 라벨과 안내가 필요하면 DatePicker를 사용합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `aria-describedby` | `string` |  |  |
| `aria-label` | `string` | `월 제목` | 화면 낭독기가 읽는 달력 이름. |
| `aria-labelledby` | `string` |  |  |
| `autoFocus` | `boolean` |  | 처음 그려질 때 키보드 위치를 날짜 칸으로 옮깁니다. |
| `className` | `string` |  |  |
| `defaultFocusedValue` | `string` | `오늘` | 값이 없을 때 처음 보여 줄 달(그 달의 아무 날짜). |
| `defaultRangeValue` | `DateRange \| null` | `null` |  |
| `defaultValue` | `string \| null` | `null` | 처음 선택된 날짜. `value` 없이 달력이 스스로 값을 관리할 때 씁니다. |
| `disabled` | `boolean` |  | 비활성 — 달력 전체를 고를 수 없게 합니다. |
| `id` | `string` |  |  |
| `invalid` | `boolean` |  |  |
| `isDateUnavailable` | `((date: string) => boolean)` |  | 날짜별로 고를 수 없는 날을 정합니다. 고를 수 없는 날은 비활성으로 보입니다. |
| `maxValue` | `string` |  | 고를 수 있는 가장 늦은 날짜. |
| `minValue` | `string` |  | 고를 수 있는 가장 이른 날짜. 이전 날짜는 비활성으로 보입니다. |
| `onChange` | `((value: string) => void)` |  | 날짜를 고르면 'YYYY-MM-DD' 값으로 호출됩니다. |
| `onRangeChange` | `((value: DateRange) => void)` |  |  |
| `rangeValue` | `DateRange \| null` |  | 선택한 기간. 시작일과 종료일은 YYYY-MM-DD입니다. |
| `readOnly` | `boolean` |  |  |
| `required` | `boolean` |  |  |
| `selectionMode` | `"range" \| "single"` | `single` | 단일 날짜 또는 연속된 기간. |
| `style` | `CSSProperties` |  |  |
| `value` | `string \| null` |  | 선택된 날짜 'YYYY-MM-DD'. 넘기면 바깥에서 값을 관리합니다. `null`이면 선택이 없습니다. |

- 타입: `CalendarProps`, `DateRange`, `ISODate`

## Card

### `Card`

**공개 컴포넌트**

관련 정보와 동작을 하나의 영역으로 묶습니다. 헤더·본문·푸터를 필요한 만큼 조합합니다.

### `CardHeader`

**보조 컴포넌트** — `Card` 안

카드 헤더입니다. 제목 · 설명 · 보조 동작을 담습니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `title` *(필수)* | `ReactNode` |  | 카드 제목. 제목 요소(기본 `<h3>`)로 표시됩니다. |
| `action` | `ReactNode` |  | 제목 오른쪽 버튼. 디자인 예시는 `Button variant="tertiary" appearance="outline" size="sm"`입니다. |
| `description` | `ReactNode` |  | 제목 아래 설명. 길면 줄바꿈됩니다. |
| `headingLevel` | `3 \| 2 \| 4 \| 5 \| 6` | `3` | 제목의 단계(h2–h6). |

### `CardContent`

**보조 컴포넌트** — `Card` 안

카드 본문입니다.

### `CardFooter`

**보조 컴포넌트** — `Card` 안

카드 아래쪽 버튼 영역입니다. 가로 배치에서는 버튼이 너비를 균등하게 나눕니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `layout` | `"horizontal" \| "vertical"` | `vertical` | 버튼 배치 방향. 기존 세로 배치를 기본으로 유지합니다. |

- 타입: `CardProps`, `CardHeaderProps`, `CardFooterProps`

## Chart

### `Chart`

**공개 컴포넌트**

수치의 추이와 항목 간 차이를 선 또는 막대 차트로 보여 줍니다. 툴팁으로 개별 값을 확인할 수 있습니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `categories` *(필수)* | `string[]` |  | 항목 이름. 가로 막대 차트는 세로축, 나머지는 가로축에 표시됩니다. |
| `series` *(필수)* | `ChartSeries[]` |  | 계열 1개 또는 2개. 두 번째는 비교 계열이며, 세 번째부터는 표시하지 않습니다. |
| `activeIndex` | `number \| null` |  | 툴팁을 표시할 항목 번호. 넘기면 직접 제어하며, `null`이면 툴팁을 숨깁니다. |
| `defaultActiveIndex` | `number \| null` | `null` | 처음 툴팁을 표시할 항목 번호(직접 제어하지 않을 때). |
| `formatValue` | `((value: number) => string)` | `(value: number) => value.toLocaleString('ko-KR')` | 값 표시 형식(눈금 · 툴팁 · 화면 낭독기용 표). |
| `highlightedIndex` | `number \| null` | `null` | 툴팁 없이 배경을 강조할 항목 번호. Hover 중에는 탐색 중인 항목을 우선 표시합니다. |
| `maxLabel` | `ReactNode` | `최고` | 첫 계열의 가장 큰 값 위에 붙는 배지(선 차트, 기본 스타일). `false`면 숨깁니다. |
| `onActiveIndexChange` | `((index: number \| null) => void)` |  | 마우스 · 탭 · 키보드로 툴팁 항목이 바뀔 때 호출됩니다. 닫히면 `null`을 받습니다. |
| `plotLabel` | `string` | `차트 항목: 화살표 키로 값 확인` | 키보드로 선택하는 그림 영역의 이름(화면 낭독기용). |
| `ticks` | `number[]` |  | 기본 스타일의 값 눈금(작은 값부터). 첫 값부터 끝 값까지가 축 범위입니다. 없으면 0부터 4칸으로 나눕니다. |
| `type` | `"line" \| "bar-vertical" \| "bar-horizontal"` | `bar-vertical` | 종류 — 선 · 세로 막대 · 가로 막대. |
| `variant` | `"default" \| "simple"` | `default` | 스타일. `default`는 축 이름 · 값 눈금 · 범례가 있고, `simple`은 축과 범례를 생략한 160px 높이의 차트입니다. |
| `xAxisLabel` | `ReactNode` |  | 가로축 이름(기본 스타일). |
| `yAxisLabel` | `ReactNode` |  | 세로축 이름(기본 스타일). |

### `ChartLegendItem`

**보조 컴포넌트** — 직접 만드는 범례(`Chart`는 범례를 스스로 그림)

범례 항목 하나(표시 모양과 계열 이름)입니다. `Chart`는 범례를 직접 그리므로, 범례를 따로 만들 때만 씁니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 범례 글자(계열 이름). |
| `color` | `"brand" \| "compare" \| "02" \| "history" \| "history-compare"` | `type === 'dash-line' ? '02' : 'brand'` | 표시 색. |
| `type` | `"line" \| "dash-line" \| "bar"` | `bar` | 표시 모양 — 선(`line`) · 점선(`dash-line`) · 네모(`bar`). |

### `ChartTooltip`

**보조 컴포넌트** — 직접 만드는 차트의 값 표시(`Chart`는 툴팁을 스스로 그림)

한 항목의 계열별 값을 보여 주는 툴팁입니다. `Chart`는 툴팁을 직접 표시하므로, 툴팁 모양을 따로 쓸 때만 씁니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `items` *(필수)* | `ChartTooltipItem[]` |  | 계열마다 한 줄씩 표시할 색 · 이름 · 값. |
| `title` | `ReactNode` |  | 툴팁 제목(항목 이름이나 날짜). |

- 상수: `CHART_TYPES`, `CHART_VARIANTS`, `CHART_LEGEND_TYPES`, `CHART_COLORS`
- 타입: `ChartProps`, `ChartSeries`, `ChartLegendItemProps`, `ChartTooltipProps`, `ChartTooltipItem`, `ChartType`, `ChartVariant`, `ChartLegendType`, `ChartColor`

## Checkbox

### `Checkbox`

**공개 컴포넌트**

독립적인 옵션을 선택하거나 여러 옵션을 함께 선택할 때 사용합니다. CheckboxGroup으로 선택값을 함께 관리할 수 있습니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  | 라벨을 포함한 바깥 요소의 클래스 이름. |
| `indeterminate` | `boolean` | `false` | 일부 선택 — 켜져 있는 동안 체크 표시 대신 가로줄을 보여 줍니다. |
| `label` | `ReactNode` |  | 상자 옆에 보이는 라벨. 없으면 `aria-label`로 이름을 붙입니다. |
| `size` | `"sm" \| "md" \| "lg"` | `'sm'` | 크기. `CheckboxGroup` 안에서는 그룹 크기를 따릅니다. |
| `style` | `CSSProperties` |  | 라벨을 포함한 바깥 요소의 스타일. |
| `value` | `string` |  | 폼 값. `CheckboxGroup` 안에서는 그룹 값에서 이 체크박스를 구분합니다. |

### `CheckboxGroup`

**공개 컴포넌트**

`value`가 있는 체크박스들을 묶어 선택한 값 목록을 관리합니다. `aria-label` 또는 `aria-labelledby`로 그룹 이름을 붙입니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `defaultValue` | `string[]` | `[]` | 처음 선택된 값 목록(비제어). |
| `disabled` | `boolean` |  | 그룹 안 모든 체크박스를 비활성으로 만듭니다. |
| `invalid` | `boolean` | `false` | 선택이 올바르지 않음(예: 필수 항목을 고르지 않음) — 항목에 오류 상태를 알리고 `message`를 오류 메시지로 보여 줍니다. |
| `message` | `ReactNode` |  | 묶음 아래에 보이는 메시지. `invalid`이면 오류 메시지, 아니면 회색 도움말입니다. 화면 낭독기는 각 항목의 설명으로 읽습니다. |
| `name` | `string` |  | 그룹 안 모든 체크박스에 주는 `name`(폼 전송용). |
| `onChange` | `((value: string[]) => void)` |  | 새 선택값 목록과 함께 호출됩니다. |
| `orientation` | `"horizontal" \| "vertical"` | `vertical` | 배치 방향 — 세로(vertical) · 가로(horizontal). 항목 사이 간격은 자동으로 맞춰집니다. |
| `size` | `"sm" \| "md" \| "lg"` |  | 크기를 따로 정하지 않은 체크박스에 적용할 크기. |
| `value` | `string[]` |  | 선택한 값 목록(제어). |

- 타입: `CheckboxProps`, `CheckboxGroupProps`

## Chip

### `Chip`

**공개 컴포넌트**

필터 선택, 입력된 태그 삭제, 옵션 목록 열기에 사용하는 컴포넌트입니다. 목적에 따라 Chip·InputChip·FilterChip·FilterChipSelect를 선택합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 칩 글자. |
| `defaultSelected` | `boolean` | `false` | 처음 선택됨 여부. `selected` 없이 칩이 스스로 상태를 관리할 때 씁니다. |
| `onSelectedChange` | `((selected: boolean) => void)` |  | 칩을 눌러 선택이 바뀌면 새 값으로 호출됩니다. |
| `selected` | `boolean` |  | 선택됨 여부. 넘기면 선택 상태를 바깥에서 관리합니다. |
| `size` | `"xs" \| "sm" \| "md"` | `xs` | 크기. |

### `InputChip`

**공개 컴포넌트**

입력된 태그를 표시하고 삭제할 수 있는 칩입니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 칩 글자 — 입력한 값. |
| `onRemove` | `(() => void)` |  | 칩을 누르거나(클릭 · Enter · Space) Delete · Backspace를 누르면 호출됩니다. |
| `removeLabel` | `string` | `삭제` | 화면 낭독기가 라벨 뒤에 읽는 말. |
| `size` | `"xs" \| "sm" \| "md"` | `xs` | 크기. |

### `FilterChip`

**공개 컴포넌트**

필터 메뉴나 패널을 여는 칩입니다. 적용된 조건과 펼침 상태를 표시하며 메뉴는 별도로 연결합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 칩 글자 — 필터 이름이나 지금 적용된 값. |
| `className` | `string` |  |  |
| `disabled` | `boolean` |  | 비활성 — 누를 수 없고 키보드 포커스를 받지 않습니다. |
| `expanded` | `boolean` |  | 펼침 — 메뉴나 패널이 열린 상태로, 위쪽 화살표가 보입니다. `MenuTrigger` · `DialogTrigger` 안에서는 자동으로 정해집니다. |
| `selected` | `boolean` | `false` | 선택됨 — 필터 값이 적용된 상태입니다. |
| `size` | `"xs" \| "sm" \| "md"` | `xs` | 크기. |

### `FilterChipSelect`

**공개 컴포넌트**

필터 칩과 옵션 목록을 함께 제공합니다. 다중 선택은 목록을 닫을 때, 단일 선택은 항목을 선택하는 즉시 적용됩니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `label` *(필수)* | `string` |  | 필터 이름. 적용된 값이 없을 때 칩 글자이고, 값이 있으면 "필터명: 값, 값"이 됩니다. |
| `options` *(필수)* | `FilterChipSelectOption[]` |  | 고를 수 있는 옵션 목록(보이는 순서대로). |
| `className` | `string` |  |  |
| `clearLabel` | `string` | `'전체'` | 필터를 푸는 첫 옵션의 글자. |
| `defaultOpen` | `boolean` | `false` | 처음부터 목록을 연 채로 보여 줄지 여부. |
| `defaultValue` | `Key \| Key[] \| null` | `[] null` | 처음 적용된 값. `value` 없이 필터가 스스로 값을 관리할 때 씁니다. |
| `disabled` | `boolean` |  | 비활성 — 누를 수 없고 키보드 포커스를 받지 않습니다. |
| `maxDisplayed` | `number` | `3` | 칩에 이름을 보여 줄 값의 수. 넘치면 "외 N"으로 줄입니다. |
| `name` | `string` |  | 폼으로 값을 보낼 때 쓰는 필드 이름. |
| `onChange` | `((value: Key[]) => void) \| ((value: Key \| null) => void)` |  | 고른 값이 바뀐 채로 목록이 닫히면 적용된 값으로 호출됩니다. 적용된 값으로 호출됩니다. 필터를 풀면 `null`입니다. |
| `onOpenChange` | `((isOpen: boolean) => void)` |  | 목록이 열리거나 닫히면 호출됩니다. |
| `selectionMode` | `"multiple" \| "single"` |  | 여러 개 고르기(기본). 목록이 열린 채로 고르고, 닫을 때 적용됩니다. 하나 고르기. 옵션을 고르면 바로 적용되고 목록이 닫힙니다. |
| `size` | `"xs" \| "sm" \| "md"` | `'md'` | 크기. |
| `value` | `Key \| Key[] \| null` |  | 적용된 값. 넘기면 바깥에서 값을 관리합니다. 적용된 값. 넘기면 바깥에서 값을 관리합니다. `null`이면 필터가 없습니다. |

- 상수: `CHIP_SIZES`
- 함수: `filterChipText`
- 타입: `ChipProps`, `InputChipProps`, `FilterChipProps`, `ChipSize`, `FilterChipSelectProps`, `FilterChipSelectMultipleProps`, `FilterChipSelectSingleProps`, `FilterChipSelectOption`

## Choice

- 상수: `CHOICE_SIZES`, `CHOICE_GROUP_ORIENTATIONS`
- 타입: `ChoiceSize`, `ChoiceGroupOrientation`

## DashboardFilterBar

### `DashboardFilterBar`

**공개 컴포넌트**

대시보드의 조회 조건과 실행 버튼을 한곳에 배치합니다. 조건을 그룹으로 구성할 수 있습니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `actions` | `ReactNode` |  | 오른쪽 끝 버튼(예: 초기화 아이콘 버튼과 "조회"). |

### `DashboardFilterGroup`

**보조 컴포넌트** — `DashboardFilterBar` 안

`DashboardFilterBar` 안의 라벨이 붙은 컨트롤 묶음입니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | 묶음 라벨(예: "조회 대상", "조회 기간"). 화면 낭독기도 이 라벨을 묶음 이름으로 읽습니다. |

### `DashboardFilterRange`

**보조 컴포넌트** — `DashboardFilterGroup` 안(기간 등 두 값)

두 컨트롤을 "~"로 이어 기간을 나타냅니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `from` *(필수)* | `ReactNode` |  | 시작 컨트롤(예: `aria-label="시작일"`인 DatePicker). |
| `to` *(필수)* | `ReactNode` |  | 끝 컨트롤. |

- 타입: `DashboardFilterBarProps`, `DashboardFilterGroupProps`, `DashboardFilterRangeProps`

## DataFreshness

### `DataFreshness`

**공개 컴포넌트**

데이터의 최신 상태, 마지막 수신 시각, 갱신 주기를 표시합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `timestamp` *(필수)* | `ReactNode` |  | 마지막으로 데이터를 받은 시각. |
| `dateTime` | `string` |  | `timestamp`의 표준 형식 시각. 넘기면 `<time>` 요소로 표시합니다. |
| `interval` | `ReactNode` |  | 갱신 주기. "·" 뒤에 표시합니다(예: "자동 갱신 1분"). |
| `label` | `ReactNode` | `LABELS[state]` | 배지 글자. |
| `state` | `"fresh" \| "stale" \| "offline"` | `fresh` | 상태 — 최근 수신(`fresh`, 성공 배지) · 수신 지연(`stale`, 경고 배지) · 연결 끊김(`offline`, 회색 배지). |

- 상수: `DATA_FRESHNESS_STATES`
- 타입: `DataFreshnessProps`, `DataFreshnessState`

## DataState

### `DataState`

**공개 컴포넌트**

데이터 영역의 로딩·빈 결과·오류·접근 제한·일부 데이터 누락 상태를 안내합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `state` *(필수)* | `"error" \| "loading" \| "empty" \| "no-results" \| "no-access" \| "partial"` |  | 상태 — 불러오는 중 · 빈 상태 · 결과 없음 · 오류 · 권한 없음 · 일부만 표시. |
| `action` | `ReactNode` |  | 버튼 대신 넣을 요소. |
| `actionLabel` | `ReactNode` |  | 문구 아래 버튼의 글자. 지정하지 않으면 상태별 기본 문구를 씁니다. |
| `description` | `ReactNode` |  | 설명. 지정하지 않으면 상태별 기본 문구를 쓰고(`partial`은 없음 — 실제 수치를 넣습니다), `null`이면 숨깁니다. |
| `loadingLabel` | `ReactNode` | `데이터를 불러오는 중입니다` | 불러오는 중 문구. |
| `onAction` | `(() => void)` |  | 넘기면 버튼이 나타나고, 버튼을 누를 때 호출됩니다. |
| `title` | `ReactNode` |  | 제목. 지정하지 않으면 상태별 기본 문구를 씁니다. |

- 상수: `DATA_STATES`
- 타입: `DataStateProps`, `DataStateValue`

## DatePicker

### `DatePicker`

**공개 컴포넌트**

입력창 없이 날짜 또는 기간을 선택합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `aria-describedby` | `string` |  |  |
| `aria-label` | `string` | `월 제목` | 화면 낭독기가 읽는 달력 이름. |
| `aria-labelledby` | `string` |  |  |
| `autoFocus` | `boolean` |  | 처음 그려질 때 키보드 위치를 날짜 칸으로 옮깁니다. |
| `className` | `string` |  |  |
| `defaultFocusedValue` | `string` | `오늘` | 값이 없을 때 처음 보여 줄 달(그 달의 아무 날짜). |
| `defaultRangeValue` | `DateRange \| null` | `null` |  |
| `defaultValue` | `string \| null` | `null` | 처음 선택된 날짜. `value` 없이 달력이 스스로 값을 관리할 때 씁니다. |
| `disabled` | `boolean` |  | 비활성 — 달력 전체를 고를 수 없게 합니다. |
| `id` | `string` |  |  |
| `invalid` | `boolean` |  |  |
| `isDateUnavailable` | `((date: string) => boolean)` |  | 날짜별로 고를 수 없는 날을 정합니다. 고를 수 없는 날은 비활성으로 보입니다. |
| `label` | `ReactNode` |  | 달력 위 라벨. 없으면 aria-label을 지정합니다. |
| `maxValue` | `string` |  | 고를 수 있는 가장 늦은 날짜. |
| `message` | `ReactNode` |  | 달력 아래 도움말 또는 상태 메시지. |
| `messageType` | `"helper" \| "info" \| "success" \| "error"` |  |  |
| `minValue` | `string` |  | 고를 수 있는 가장 이른 날짜. 이전 날짜는 비활성으로 보입니다. |
| `name` | `string` |  | Range는 name.start / name.end로 전송합니다. |
| `onChange` | `((value: string \| null) => void)` |  |  |
| `onRangeChange` | `((value: DateRange) => void)` |  |  |
| `rangeValue` | `DateRange \| null` |  | 선택한 기간. 시작일과 종료일은 YYYY-MM-DD입니다. |
| `readOnly` | `boolean` |  |  |
| `required` | `boolean` |  |  |
| `selectionMode` | `"range" \| "single"` | `single` | 단일 날짜 또는 연속된 기간. |
| `style` | `CSSProperties` |  |  |
| `value` | `string \| null` |  | 선택된 날짜 'YYYY-MM-DD'. 넘기면 바깥에서 값을 관리합니다. `null`이면 선택이 없습니다. |

- 타입: `DatePickerProps`

## Dialog

### `Dialog`

**공개 컴포넌트**

사용자의 확인이나 선택이 필요할 때 여는 모달 대화상자입니다. 열린 동안 배경 화면의 조작을 제한합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `title` *(필수)* | `ReactNode` |  | 제목. 화면 낭독기가 대화상자의 이름으로 읽습니다. |
| `actions` | `ReactNode \| ((close: () => void) => ReactNode)` |  | 아래쪽 버튼들. 같은 너비로 나란히 놓입니다(예: 취소는 Tertiary · Solid · lg, 주 행동은 Primary · Solid · lg). 함수로 넘기면 대화상자를 닫는 `close`를 받습니다. |
| `children` | `ReactNode` |  | 제목과 버튼 사이에 넣는 내용. |
| `className` | `string` |  | 대화상자 패널의 클래스. |
| `defaultOpen` | `boolean` |  | 처음 열림 여부. 직접 제어하지 않을 때 씁니다. |
| `description` | `ReactNode` |  | 제목 아래 설명. 화면 낭독기가 대화상자의 설명으로 읽습니다. |
| `dismissable` | `boolean` | `false` | 바깥을 누르면 닫힙니다. Esc는 `keyboardDismissDisabled`가 아니면 항상 닫습니다. |
| `keyboardDismissDisabled` | `boolean` | `false` | Esc를 눌러도 닫히지 않게 합니다. |
| `onOpenChange` | `((open: boolean) => void)` |  | 대화상자가 열리거나 닫힐 때 호출됩니다. |
| `open` | `boolean` |  | 열림 여부. 직접 제어할 때 씁니다. |
| `role` | `"dialog" \| "alertdialog"` | `dialog` | 삭제 확인처럼 사용자의 흐름을 멈추는 확인에는 `alertdialog`를 씁니다. |
| `trigger` | `ReactElement<unknown, string \| JSXElementConstructor<any>>` |  | 누르면 대화상자를 여는 요소. ref와 props를 전달하는 컴포넌트여야 합니다(예: `Button`). 없으면 `open`으로 엽니다. |

- 타입: `DialogProps`

## DropdownMenu

### `DropdownMenu`

**공개 컴포넌트**

버튼을 누르면 관련 동작 목록이 열립니다. 이동·복제·삭제처럼 같은 대상에 적용할 작업을 모아 제공합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | `DropdownMenuItem` · `DropdownMenuSection` · `DropdownMenuSeparator`들. |
| `trigger` *(필수)* | `ReactElement<unknown, string \| JSXElementConstructor<any>> \| ReactElement<DOMAttributes<HTMLElement>, string>` |  | 메뉴를 여는 요소. `Button`이나 `FilterChip`처럼 ref와 props를 그대로 전달하는 요소를 넘깁니다. |
| `aria-label` | `string` |  | 화면 낭독기가 읽는 메뉴 이름. |
| `className` | `string` |  |  |
| `disabledKeys` | `Iterable<Key>` |  | 고를 수 없는 항목의 `id` 목록(비활성). |
| `offset` | `number` | `4` | 트리거와 메뉴 사이 간격(px). |
| `onAction` | `((key: Key) => void)` |  | 항목을 고르면 그 항목의 `id`로 호출됩니다. |
| `onOpenChange` | `((open: boolean) => void)` |  | 메뉴가 열리거나 닫히면 호출됩니다. |
| `open` | `boolean` |  | 메뉴가 열렸는지 여부. 넘기면 바깥에서 관리합니다. |
| `placement` | `Placement` | `bottom start` | 트리거를 기준으로 한 메뉴 위치. |

### `DropdownMenuItem`

**보조 컴포넌트** — `DropdownMenu` 안

메뉴 항목 하나입니다. 마우스를 올리거나 키보드 포커스를 받으면 같은 모양으로 바뀝니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 항목 이름. |
| `chevron` | `boolean` | `false` | 오른쪽 화살표 — 다른 화면으로 이동하는 항목이라는 표시입니다. |
| `className` | `string` |  |  |
| `danger` | `boolean` | `false` | 삭제처럼 위험한 작업 — 경고 색으로 보입니다. |
| `description` | `ReactNode` |  | 이름 아래 설명. |
| `disabled` | `boolean` |  | 비활성 — 고를 수 없고, 방향키로 옮길 때도 건너뜁니다. |
| `icon` | `ReactNode` |  | 이름 앞 아이콘. |

### `DropdownMenuSection`

**보조 컴포넌트** — `DropdownMenu` 안

메뉴 항목 묶음입니다. 위에 제목을 붙일 수 있습니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 묶음 안의 항목들. |
| `aria-label` | `string` |  | 보이는 제목이 없을 때 화면 낭독기가 읽는 묶음 이름. |
| `id` | `Key` |  | 묶음 `id`. |
| `title` | `ReactNode` |  | 묶음 제목. |

### `DropdownMenuSeparator`

**보조 컴포넌트** — `DropdownMenu` 안

메뉴 항목 묶음 사이의 구분선입니다.

- 타입: `DropdownMenuProps`, `DropdownMenuItemProps`, `DropdownMenuSectionProps`

## EmptyState

### `EmptyState`

**공개 컴포넌트**

목록이나 차트에 표시할 내용이 없을 때 이유와 다음 행동을 안내합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `title` *(필수)* | `ReactNode` |  | 제목. |
| `action` | `ReactNode` |  | 글 아래 버튼. 할 일이 없으면 넣지 않습니다. 예: `<TextButton rightIcon={<CaretRightIcon />}>` |
| `description` | `ReactNode` |  | 제목 아래 설명. 가운데 정렬되며 길면 줄을 바꿉니다. |
| `icon` | `ReactNode` |  | 제목 위 아이콘(16px). 꾸밈으로 처리되어 화면 낭독기가 읽지 않습니다. |

- 타입: `EmptyStateProps`

## Field

- 상수: `FIELD_SIZES`, `FIELD_MESSAGE_TYPES`
- 타입: `FieldSize`, `FieldMessageType`

## FileUploader

### `FileUploader`

**공개 컴포넌트**

드래그 앤 드롭 또는 파일 선택 창으로 파일을 받습니다. 선택한 파일은 FileUploaderItem으로 표시합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `accept` | `string` |  | 받을 파일 형식(예: '.pdf,image/*'). 끌어다 놓은 파일에도 똑같이 적용됩니다. |
| `className` | `string` |  | 업로드 영역의 클래스 이름. |
| `disabled` | `boolean` | `false` | 비활성 — 누를 수 없고 파일을 놓아도 받지 않습니다. |
| `helperText` | `ReactNode` |  | 제목 아래 안내 문구(허용 형식 · 크기 제한 등). |
| `id` | `string` |  |  |
| `multiple` | `boolean` | `false` | 여러 파일을 한 번에 받을지 여부. |
| `name` | `string` |  | 폼으로 파일을 보낼 때 쓰는 필드 이름. |
| `onFilesSelected` | `((files: File[]) => void)` |  | 선택 창에서 고르거나 끌어다 놓은 파일로 호출됩니다. |
| `showIcon` | `boolean` | `true` | 업로드 아이콘 표시 여부. |
| `style` | `CSSProperties` |  | 업로드 영역의 스타일(예: 너비). |
| `title` | `ReactNode` | `파일을 끌어다 놓거나 선택하세요` | 제목. |

### `FileUploaderItem`

**보조 컴포넌트** — `FileUploader` 아래 파일 목록

파일 이름·정보와 업로드 상태를 표시합니다. 상태에 따라 삭제 또는 다운로드 동작을 제공합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `fileName` *(필수)* | `ReactNode` |  | 파일 이름. 길면 말줄임표로 줄입니다. |
| `downloadLabel` | `string` | `다운로드` | 다운로드 버튼 글자. |
| `fileInfo` | `ReactNode` |  | 파일 정보(크기, 진행 상태 글자 등). `error`이면 실패 이유를 적습니다(예: '1.2 MB · 업로드 실패'). |
| `onDownload` | `(() => void)` |  | "다운로드" 버튼을 누르면 호출됩니다(`download`일 때). |
| `onRemove` | `(() => void)` |  | "삭제" 버튼을 누르면 호출됩니다(`completed` · `error`일 때). |
| `removeLabel` | `string` | `삭제` | 삭제 버튼 글자. |
| `status` | `"error" \| "download" \| "completed" \| "uploading"` | `completed` | 상태 — 삭제 버튼(`completed`), 업로드 중 표시(`uploading`), 다운로드 버튼(`download`), 업로드 실패(`error` — 파일 정보를 오류 색으로 보여 주고 삭제 버튼은 그대로). |
| `uploadingLabel` | `string` | `업로드 중` | 화면 낭독기가 읽는 업로드 중 표시의 이름. |

### `ImageUploadPreview`

**보조 컴포넌트** — `KeyValueItem`의 이미지 업로드 칸

업로드한 이미지를 정사각형 미리보기로 보여 줍니다. 오른쪽 위 모서리에 둥근 삭제 버튼이 붙습니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `alt` *(필수)* | `string` |  | 이미지 대체 글자. |
| `src` *(필수)* | `string` |  | 보여 줄 이미지 주소(예: 고른 파일의 object URL). |
| `onRemove` | `(() => void)` |  | 삭제 버튼을 누르면 호출됩니다. 넘기지 않으면 삭제 버튼이 없습니다. |
| `removeLabel` | `string` | `이미지 삭제` | 화면 낭독기가 읽는 삭제 버튼 이름. |

- 상수: `FILE_UPLOADER_ITEM_STATUSES`
- 타입: `FileUploaderProps`, `FileUploaderItemProps`, `FileUploaderItemStatus`, `ImageUploadPreviewProps`

## Input

### `Input`

**공개 컴포넌트**

이름·이메일 등 한 줄의 텍스트를 입력받습니다. 라벨, 도움말, 오류 메시지와 비밀번호 표시 기능을 제공합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  | 바깥 요소의 클래스 이름. |
| `clearable` | `boolean` | `type이 'password'가 아니면 true` | 마우스를 올리거나 키보드 포커스를 받으면 지우기 버튼(X)을 보여 줍니다. 비밀번호 칸(Figma `password_field`)에는 지우기 버튼이 없어 `type="password"`이면 기본으로 꺼집니다. |
| `defaultRevealed` | `boolean` | `false` | 비밀번호를 처음부터 보이게 할지 정합니다. |
| `invalid` | `boolean` | `false` | 오류 — 빨간 테두리로 표시하고 화면 낭독기에도 오류 상태를 알립니다. |
| `label` | `ReactNode` |  | 입력 필드 위에 보이는 라벨. 없으면 `aria-label`로 이름을 붙입니다. |
| `message` | `ReactNode` |  | 입력 필드 아래에 보이는 도움말 메시지. |
| `messageType` | `"helper" \| "info" \| "success" \| "error"` | `오류이면 'error', 그 밖에는 'helper'` | 도움말 메시지 종류 — 입력 방법은 회색 도움말(`helper`), 상태를 알릴 때만 `info` · `success` · `error`. |
| `onClear` | `(() => void)` |  | 지우기 버튼으로 값을 비운 뒤 호출됩니다. |
| `required` | `boolean` | `false` | 꼭 입력해야 하는 칸 — 라벨 뒤에 점을 붙이고, 입력 필드에 `required`를 넘겨 화면 낭독기가 "필수"로 읽고 폼 제출 때 빈 값을 검사합니다. |
| `revealable` | `boolean` | `true` | `type="password"`일 때 비밀번호를 보이거나 숨기는 눈 아이콘 버튼을 보여 줍니다(보이는 동안은 눈 가림 아이콘). |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | 크기. |
| `style` | `CSSProperties` |  | 바깥 요소의 스타일. |

- 타입: `InputProps`

## Link

### `Link`

**공개 컴포넌트**

다른 페이지나 문서로 이동하는 텍스트 링크입니다. 현재 화면에서 동작을 실행할 때는 Button을 사용합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 링크 글자. |
| `disabled` | `boolean` | `false` | 비활성 — 누를 수 없고 키보드 포커스를 받지 않습니다. |
| `external` | `boolean` | `false` | 새 창으로 엽니다. 화면 낭독기는 글자 뒤에 `newTabLabel`을 함께 읽습니다. |
| `newTabLabel` | `string` | `(새 창)` | 새 창 링크에서 화면 낭독기가 글자 뒤에 읽는 말. |
| `showIcon` | `boolean` | ``external`` | 새 창 아이콘 표시 여부. |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | 크기. |

- 상수: `LINK_SIZES`
- 타입: `LinkProps`, `LinkSize`

## Loading

### `Loading`

**공개 컴포넌트**

데이터를 불러오거나 작업을 처리 중임을 표시합니다. 진행률을 알 수 있는 작업에는 Progress를 사용합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | 회전 표시 아래 글자. 없으면 `aria-label`이 이름이 됩니다. |
| `size` | `"sm" \| "md"` | `md` | 크기. |

- 상수: `LOADING_SIZES`
- 타입: `LoadingProps`, `LoadingSize`

## MetricCard

### `MetricCard`

**공개 컴포넌트**

핵심 지표의 값과 단위, 이전 기간 대비 변화를 요약합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `title` *(필수)* | `ReactNode` |  | 지표 이름. 카드 제목 요소로 표시됩니다. |
| `value` *(필수)* | `ReactNode` |  | 값. |
| `comparison` | `ReactNode` |  | 증감 뒤에 붙는 비교 기준 문구(예: "이전 7일 대비"). |
| `headingLevel` | `3 \| 2 \| 4 \| 5 \| 6` | `3` | 제목의 단계(h2–h6). |
| `icon` | `ReactNode` |  | 제목 앞 아이콘. 꾸밈으로 처리되어 화면 낭독기가 읽지 않습니다. |
| `trend` | `ReactNode` |  | 증감. 보통 `MetricTrend`를 넣습니다. |
| `unit` | `ReactNode` |  | 값 뒤에 붙는 단위. |

- 타입: `MetricCardProps`

## MetricTrend

### `MetricTrend`

**공개 컴포넌트**

지표의 증감과 그 의미를 함께 표시합니다. 증가·감소 방향과 긍정·부정 평가는 별도로 지정합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 증감 글자(예: "4.8%p"). |
| `direction` | `"disabled" \| "flat" \| "up" \| "down"` | `up` | 방향 — 아이콘이 바뀝니다. `disabled`(비교할 값이 없음)는 회색으로 표시합니다. |
| `directionLabel` | `string` | `LABELS[direction]` | 방향이 아이콘으로만 보이므로 화면 낭독기가 증감 앞에 읽는 글자. |
| `tone` | `"positive" \| "negative" \| "neutral"` | `positive` | 긍정·부정 의미 — 색이 바뀝니다. 좋음(`positive`) · 나쁨(`negative`) · 중립(`neutral`). |

- 상수: `METRIC_TREND_DIRECTIONS`, `METRIC_TREND_TONES`
- 타입: `MetricTrendProps`, `MetricTrendDirection`, `MetricTrendTone`

## Navigation

### `Navigation`

**공개 컴포넌트**

화면의 주요 페이지로 이동하는 사이드 내비게이션입니다. 링크와 펼칠 수 있는 메뉴 그룹으로 구성합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `header` | `ReactNode` |  | 메뉴 위 영역(로고 등). |

### `NavLink`

**보조 컴포넌트** — `Navigation` 안

누르면 바로 페이지로 이동하는 첫 단계 메뉴입니다. 마우스를 올리면 모양이 바뀝니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `icon` | `ReactNode` |  | 메뉴 이름 앞 아이콘. |
| `selected` | `boolean` | `false` | 선택됨 — 현재 페이지입니다. 화면 낭독기에 현재 페이지로 알려집니다. |

### `NavGroup`

**보조 컴포넌트** — `Navigation` 안

눌러서 펼치고 접는 메뉴 그룹입니다. 펼치면 하위 메뉴(`NavChild`)가 왼쪽 선과 함께 안쪽으로 들여 보입니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `label` *(필수)* | `ReactNode` |  | 그룹 이름. |
| `children` | `ReactNode` |  | 메뉴 이름. 펼쳤을 때 보이는 `NavChild`들. |
| `className` | `string` |  |  |
| `defaultExpanded` | `boolean` | `false` | 처음에 펼쳐 둘지 여부. `expanded` 없이 스스로 관리할 때 씁니다. |
| `expanded` | `boolean` | `false` | 펼침 여부. 넘기면 바깥에서 관리합니다. |
| `icon` | `ReactNode` |  | 메뉴 이름 앞 아이콘. |
| `onExpandedChange` | `((expanded: boolean) => void)` |  | 그룹이 펼쳐지거나 접히면 호출됩니다. |

### `NavChild`

**보조 컴포넌트** — `NavGroup` 안

`NavGroup` 안의 하위 메뉴 링크입니다. 마우스를 올리면 모양이 바뀝니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `selected` | `boolean` | `false` | 선택됨 — 현재 페이지입니다. 화면 낭독기에 현재 페이지로 알려집니다. |

### `NavParentItem`

⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 `NavGroup` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).

메뉴 그룹을 펼치고 접는 버튼입니다. `NavGroup`이 안에서 그립니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 메뉴 이름. |
| `expanded` | `boolean` | `false` | 펼침 — 하위 메뉴가 열린 상태입니다. |
| `icon` | `ReactNode` |  | 메뉴 이름 앞 아이콘. |

- 타입: `NavigationProps`, `NavLinkProps`, `NavGroupProps`, `NavChildProps`, `NavParentItemProps` *(내부 — 사용 금지)*

## Pagination

### `Pagination`

**공개 컴포넌트**

여러 페이지로 나뉜 목록에서 현재 페이지를 표시하고 다른 페이지로 이동합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `totalPages` *(필수)* | `number` |  | 전체 페이지 수. |
| `defaultPage` | `number` | `1` | 처음 페이지. `page` 없이 스스로 관리할 때 씁니다. |
| `onPageChange` | `((page: number) => void)` |  | 페이지가 바뀌면 새 페이지 번호로 호출됩니다. |
| `page` | `number` |  | 현재 페이지(1부터 셈). 넘기면 바깥에서 관리합니다. |
| `shape` | `"square" \| "rounded"` | `square` |  |
| `size` | `"sm" \| "md" \| "lg"` | `sm` |  |
| `visiblePages` | `number` | `5` | 한 번에 보이는 페이지 번호 수. 현재 페이지를 가운데 두고 보여 줍니다. |

### `PaginationItem`

⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 `Pagination` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).

페이지 번호 버튼 하나입니다. `Pagination`이 안에서 그립니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `page` *(필수)* | `number` |  | 페이지 번호. |
| `current` | `boolean` | `false` | 현재 페이지인지 여부. |
| `shape` | `"square" \| "rounded"` | `square` |  |
| `size` | `"sm" \| "md" \| "lg"` | `sm` |  |

### `PaginationControl`

⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 `Pagination` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).

이전 · 다음 페이지 버튼입니다. `Pagination`이 안에서 그립니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `direction` *(필수)* | `"next" \| "previous"` |  | 방향 — 이전(`previous`) · 다음(`next`). |
| `shape` | `"square" \| "rounded"` | `square` |  |
| `size` | `"sm" \| "md" \| "lg"` | `sm` |  |

- 상수: `PAGINATION_SIZES`, `PAGINATION_SHAPES`
- 타입: `PaginationProps`, `PaginationItemProps` *(내부 — 사용 금지)*, `PaginationControlProps` *(내부 — 사용 금지)*, `PaginationSize`, `PaginationShape`

## Progress

### `Progress`

**공개 컴포넌트**

작업의 진행률을 막대로 표시합니다. 진행률을 알 수 없는 작업에는 Loading을 사용합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |
| `style` | `CSSProperties` |  |  |

- 타입: `ProgressProps`

## Radio

### `Radio`

**보조 컴포넌트** — `RadioGroup` 안

여러 옵션 중 하나를 선택할 때 사용합니다. RadioGroup으로 관련 옵션을 묶어 선택값을 관리합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `value` *(필수)* | `string` |  | 이 옵션의 값. `RadioGroup` 안에서는 그룹 값에서 이 옵션을 구분합니다. |
| `className` | `string` |  | 라벨을 포함한 바깥 요소의 클래스 이름. |
| `label` | `ReactNode` |  | 원 옆에 보이는 라벨. 없으면 `aria-label`로 이름을 붙입니다. |
| `size` | `"sm" \| "md" \| "lg"` | `'sm'` | 크기. `RadioGroup` 안에서는 그룹 크기를 따릅니다. |
| `style` | `CSSProperties` |  | 라벨을 포함한 바깥 요소의 스타일. |

### `RadioGroup`

**공개 컴포넌트**

라디오 버튼들을 묶어 선택한 값 하나를 관리합니다. `aria-label` 또는 `aria-labelledby`로 그룹 이름을 붙입니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `defaultValue` | `string \| null` | `null` | 처음 선택된 값(비제어). |
| `disabled` | `boolean` |  | 그룹 안 모든 라디오 버튼을 비활성으로 만듭니다. |
| `invalid` | `boolean` | `false` | 선택이 올바르지 않음(예: 필수 항목을 고르지 않음) — 항목에 오류 상태를 알리고 `message`를 오류 메시지로 보여 줍니다. |
| `message` | `ReactNode` |  | 묶음 아래에 보이는 메시지. `invalid`이면 오류 메시지, 아니면 회색 도움말입니다. 화면 낭독기는 각 항목의 설명으로 읽습니다. |
| `name` | `string` | `자동 생성` | 그룹 안 라디오 버튼들의 `name`(폼 전송 · 방향키 이동 묶음). |
| `onChange` | `((value: string) => void)` |  | 새로 고른 값과 함께 호출됩니다. |
| `orientation` | `"horizontal" \| "vertical"` | `vertical` | 배치 방향 — 세로(vertical) · 가로(horizontal). 항목 사이 간격은 자동으로 맞춰집니다. |
| `required` | `boolean` |  | 꼭 골라야 하는 항목으로 표시합니다(폼을 보낼 때 검사). |
| `size` | `"sm" \| "md" \| "lg"` |  | 크기를 따로 정하지 않은 라디오 버튼에 적용할 크기. |
| `value` | `string \| null` |  | 선택한 값(제어). `null`이면 선택 없음입니다. |

- 타입: `RadioProps`, `RadioGroupProps`

## SearchField

### `SearchField`

**공개 컴포넌트**

검색어를 입력하고 Enter 키로 검색을 요청합니다. 일반 텍스트 입력에는 Input을 사용합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `appearance` | `"solid" \| "outline"` | `outline` | 모양 — 테두리(outline) · 채움(solid). |
| `className` | `string` |  | 바깥 요소의 클래스 이름. |
| `invalid` | `boolean` | `false` | 오류 — 오류 테두리로 표시합니다. |
| `label` | `ReactNode` |  | 입력 필드 위에 보이는 라벨. 없으면 `aria-label`로 이름을 붙입니다. |
| `onClear` | `(() => void)` |  | 지우기 버튼으로 값을 비운 뒤 호출됩니다. |
| `onSearch` | `((value: string) => void)` |  | Enter 키를 누르면 현재 검색어와 함께 호출됩니다. |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | 크기. |
| `style` | `CSSProperties` |  | 바깥 요소의 스타일. |

- 상수: `SEARCH_FIELD_APPEARANCES`
- 타입: `SearchFieldProps`, `SearchFieldAppearance`

## SegmentedControl

### `SegmentedControl`

**공개 컴포넌트**

관련 옵션을 나란히 표시하고 하나를 선택합니다. 일간·주간·월간처럼 소수의 옵션을 전환할 때 사용합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `defaultValue` | `string \| null` | `null` | 처음 선택된 옵션의 값(비제어). |
| `disabled` | `boolean` |  | 모든 옵션을 비활성으로 만듭니다. |
| `name` | `string` | `자동 생성` | 폼 전송에 쓰는 이름. |
| `onChange` | `((value: string) => void)` |  | 새로 고른 값과 함께 호출됩니다. |
| `size` | `"xs" \| "sm" \| "md"` | `md` | 크기. |
| `value` | `string \| null` |  | 선택한 옵션의 값(제어). |

### `SegmentedControlItem`

**보조 컴포넌트** — `SegmentedControl` 안

`SegmentedControl` 안의 옵션 하나입니다. 컨트롤의 값이 이 옵션의 `value`와 같으면 선택됨으로 표시됩니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 옵션 글자. |
| `value` *(필수)* | `string` |  | `SegmentedControl` 안에서 이 옵션을 구분하는 값. |
| `className` | `string` |  | 옵션 요소의 클래스 이름. |
| `style` | `CSSProperties` |  | 옵션 요소의 스타일. |

- 상수: `SEGMENTED_CONTROL_SIZES`
- 타입: `SegmentedControlProps`, `SegmentedControlItemProps`, `SegmentedControlSize`

## Select

### `Select`

**공개 컴포넌트**

옵션 목록에서 항목 하나를 선택합니다. SelectOption으로 목록을 구성합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode \| ((item: T) => ReactNode)` |  | `SelectOption` 요소들. `items`를 쓰면 옵션을 만드는 함수입니다. |
| `aria-describedby` | `string` |  |  |
| `aria-label` | `string` |  |  |
| `aria-labelledby` | `string` |  |  |
| `autoFocus` | `boolean` |  |  |
| `className` | `string` |  | 바깥 요소의 클래스 이름. |
| `defaultOpen` | `boolean` |  | 처음에 목록을 펼쳐 둘지 정합니다(비제어). |
| `defaultValue` | `Key \| null` | `null` | 처음 선택된 옵션의 `id`(비제어). |
| `disabled` | `boolean` | `false` | 비활성 — 고를 수 없고 키보드 포커스를 받지 않습니다. |
| `disabledKeys` | `Iterable<Key>` |  | 고를 수 없는 옵션의 `id` 목록. |
| `form` | `string` |  | 선택값을 보낼 폼의 `id`. |
| `id` | `string` |  |  |
| `invalid` | `boolean` | `false` | 오류 — 오류 테두리로 표시합니다. |
| `items` | `Iterable<T>` |  | 옵션을 데이터로 만들 때 쓰는 목록. 이때 `children`은 `(item) => <SelectOption id={…}>…</SelectOption>` 함수입니다. |
| `label` | `ReactNode` |  | 선택 필드 위에 보이는 라벨. 없으면 `aria-label`로 이름을 붙입니다. |
| `message` | `ReactNode` |  | 선택 필드 아래에 보이는 도움말 메시지. |
| `messageType` | `"helper" \| "info" \| "success" \| "error"` | `오류이면 'error', 그 밖에는 'helper'` | 도움말 메시지 종류 — 입력 방법은 회색 도움말(`helper`), 상태를 알릴 때만 `info` · `success` · `error`. |
| `name` | `string` |  | 폼 필드 이름. 주면 폼을 보낼 때 선택값이 함께 전송됩니다. |
| `onChange` | `((value: Key \| null) => void)` |  | 새로 고른 옵션의 `id`와 함께 호출됩니다. |
| `onOpenChange` | `((open: boolean) => void)` |  | 목록이 펼쳐지거나 닫힐 때 호출됩니다. |
| `open` | `boolean` |  | 목록 펼침 여부(제어). |
| `placeholder` | `string` | `내용 선택` | 아무것도 고르지 않았을 때 보이는 글자. |
| `readOnly` | `boolean` | `false` | 읽기 전용 — 화살표 없이 값만 보이고 목록이 펼쳐지지 않습니다. |
| `required` | `boolean` | `false` | 꼭 골라야 하는 칸 — 라벨 뒤에 점을 붙이고 화면 낭독기에 "필수"를 알립니다. `name`과 함께 쓰면 폼을 보낼 때 선택 여부를 검사합니다. |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | 크기. 옵션 높이도 함께 맞춰집니다. |
| `style` | `CSSProperties` |  | 바깥 요소의 스타일. 너비를 정하면 목록도 같은 너비로 펼쳐집니다. |
| `value` | `Key \| null` |  | 선택한 옵션의 `id`(제어). `null`이면 선택 없음입니다. |

### `SelectOption`

**보조 컴포넌트** — `Select` 안

`Select` 목록 안의 옵션 하나입니다. `id`로 옵션을 구분하고, 선택되면 굵은 글자와 체크 아이콘으로 표시됩니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 옵션 글자. |
| `checkIcon` | `boolean` | `true` | 선택된 옵션 글자 뒤에 체크 아이콘을 보여 줍니다. 끄면 굵은 글자로만 선택을 표시합니다. |
| `className` | `string` |  |  |
| `disabled` | `boolean` |  | 비활성 — 고를 수 없고 키보드로 이동할 때 건너뜁니다. |
| `style` | `CSSProperties` |  |  |

- 타입: `SelectProps`, `SelectOptionProps`

## Skeleton

### `Skeleton`

**공개 컴포넌트**

콘텐츠를 불러오는 동안 표시할 영역의 형태를 미리 보여 줍니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `shape` | `"circle" \| "line" \| "shape4" \| "block"` | `line` | 모양 — line(60 × 8) · shape4(100 × 10) · block(140 × 12) · circle(24 × 24). 크기는 `style`의 width · height로 바꿀 수 있습니다. |

- 상수: `SKELETON_SHAPES`
- 타입: `SkeletonProps`, `SkeletonShape`

## Slider

### `Slider`

**공개 컴포넌트**

정해진 범위에서 수치를 조절합니다. 드래그와 키보드를 지원하며 숫자 입력 필드를 함께 사용할 수 있습니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` |  | 화면 낭독기가 읽는 이름. 보이는 라벨이 없으므로 `aria-label` 또는 `aria-labelledby`가 꼭 필요합니다. |
| `aria-labelledby` | `string` |  |  |
| `className` | `string` |  | 바깥 요소의 클래스 이름. |
| `defaultValue` | `number` | `minValue` | 초깃값(비제어). |
| `disabled` | `boolean` | `false` | 비활성 — 값을 바꿀 수 없습니다. |
| `formatOptions` | `NumberFormatOptions` |  | 범위 · 값 라벨 · 숫자 입력 필드의 숫자 형식. |
| `id` | `string` |  |  |
| `inputLabel` | `string` | `값 입력` | 숫자 입력 필드의 이름(화면 낭독기용). |
| `maxValue` | `number` | `100` | 가장 큰 값. 슬라이더 아래 오른쪽 끝에 보입니다. |
| `minValue` | `number` | `0` | 가장 작은 값. 슬라이더 아래 왼쪽 끝에 보입니다. |
| `name` | `string` |  | 폼 필드 이름. |
| `onChange` | `((value: number) => void)` |  | 값이 바뀌는 동안 계속 호출됩니다. |
| `onChangeEnd` | `((value: number) => void)` |  | 드래그를 마치거나, 키를 누르거나, 숫자 입력 필드의 값을 확정하면 호출됩니다. |
| `showInput` | `boolean` | `true` | 슬라이더 오른쪽에 숫자 입력 필드를 보여 줍니다. |
| `step` | `number` | `1` | 값 사이 간격. |
| `style` | `CSSProperties` |  | 바깥 요소의 스타일(예: 너비). |
| `unit` | `ReactNode` |  | 숫자 입력 필드 뒤와 값 라벨에 붙는 단위(예: 명). |
| `value` | `number` |  | 현재 값(제어). |
| `valueLabel` | `boolean` | `true` | 마우스를 올리거나 드래그하거나 키보드 포커스를 받으면 손잡이 위에 값을 보여 줍니다. |

- 타입: `SliderProps`

## Stepper

### `Stepper`

**공개 컴포넌트**

여러 단계로 이루어진 과정의 현재 위치와 진행 상태를 표시합니다. 단계 이동 버튼으로 사용하지 않습니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `steps` *(필수)* | `StepperStep[]` |  | 단계 목록(순서대로). |
| `currentStep` | `number` | `0` | 현재 단계의 순서(0부터 셈). 앞 단계는 완료, 뒤 단계는 예정으로 보입니다. |
| `orientation` | `"horizontal" \| "vertical"` | `horizontal` | 방향 — 가로(`horizontal`) · 세로(`vertical`). |

### `StepperIndicator`

⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 `Stepper` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).

단계 하나를 나타내는 원과 글자입니다. 원 안에는 번호가 보이고, 완료이면 체크 아이콘, 오류이면 경고 아이콘이 보입니다. `Stepper`가 안에서 그립니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `step` *(필수)* | `number` |  | 원 안에 보이는 단계 번호(`upcoming` · `current` · `locked`일 때). |
| `description` | `ReactNode` |  | 제목 아래 설명. |
| `label` | `ReactNode` |  | 단계 제목. |
| `orientation` | `"horizontal" \| "vertical"` | `horizontal` | 방향 — 가로이면 글자가 원 아래, 세로이면 원 옆에 놓입니다. |
| `status` | `"error" \| "current" \| "completed" \| "upcoming" \| "locked"` | `upcoming` | 단계 상태. |

### `StepperConnector`

⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 `Stepper` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).

단계 사이를 잇는 선입니다. `Stepper`가 안에서 그립니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `completed` | `boolean` | `false` | 완료 모양으로 그릴지 여부. |
| `orientation` | `"horizontal" \| "vertical"` | `horizontal` | 방향. |

- 상수: `STEPPER_ORIENTATIONS`, `STEPPER_STATUSES`
- 타입: `StepperProps`, `StepperStep`, `StepperIndicatorProps` *(내부 — 사용 금지)*, `StepperConnectorProps` *(내부 — 사용 금지)*, `StepperOrientation`, `StepperStatus`

## Switch

### `Switch`

**공개 컴포넌트**

알림·자동 저장 등 두 상태를 갖는 설정을 켜거나 끕니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  | 라벨을 포함한 바깥 요소의 클래스 이름. |
| `label` | `ReactNode` |  | 스위치 옆에 보이는 라벨. 없으면 `aria-label`로 이름을 붙입니다. |
| `size` | `"sm" \| "md"` | `sm` | 크기. |
| `style` | `CSSProperties` |  | 라벨을 포함한 바깥 요소의 스타일. |

- 상수: `SWITCH_SIZES`
- 타입: `SwitchProps`, `SwitchSize`

## Table

### `Table`

**공개 컴포넌트**

여러 항목의 데이터를 비교하고 선택·정렬할 수 있는 표입니다. 단일 항목의 상세 정보는 KeyValueTable을 사용합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |
| `id` | `string` |  | `<table>`의 `id`. 다른 요소의 `aria-controls` 등에서 표를 가리킬 때 씁니다. |

### `TableHeader`

**보조 컴포넌트** — `Table` 안

열 헤더 행입니다. 안에 `TableColumn`을 넣습니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

### `TableColumn`

**보조 컴포넌트** — `TableHeader` 안

열 헤더입니다. `info`를 주면 도움말 아이콘, `allowsSorting`을 주면 정렬 아이콘이 붙습니다. 정렬 중인 열은 아이콘 색이 바뀌고, 정렬 방향은 화면 낭독기에 전달됩니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 열 제목. |
| `className` | `string` |  |  |
| `info` | `ReactNode` |  | 도움말. 넘기면 정보 아이콘이 붙고, 아이콘에 마우스를 올리거나 키보드 포커스를 받으면 툴팁으로 보입니다. |
| `infoLabel` | `string` | `도움말` | 화면 낭독기가 읽는 정보 아이콘 이름. |

### `TableSelectionColumn`

**보조 컴포넌트** — `TableHeader` 안(다중 선택 표)

전체 선택 체크박스 열입니다. `selectionMode="multiple"`일 때 씁니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

### `TableEmptyColumn`

**보조 컴포넌트** — `TableHeader` 안(제목 없는 열)

제목이 보이지 않는 열입니다(예: 작업 · 편집 아이콘 열). `aria-label`로 열 이름을 붙이면 화면에는 보이지 않고 화면 낭독기가 읽습니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` |  |  |
| `className` | `string` |  |  |

### `TableBody`

**보조 컴포넌트** — `Table` 안

표의 본문입니다. 행이 없을 때 보여 줄 내용(예: `EmptyState`)은 `renderEmptyState`로 넘깁니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

### `TableRow`

**보조 컴포넌트** — `TableBody` 안

본문 행입니다. 행 동작(`onRowAction`)이 있으면 마우스를 올리거나 누를 때 배경이 바뀝니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

### `TableCell`

**보조 컴포넌트** — `TableRow` 안

본문 칸입니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |
| `variant` | `"strong" \| "text"` | `text` | 글자 모양 — 보통(`text`, 기본) · 굵게(`strong`). 배지 · 버튼 같은 다른 내용은 칸 안에 그 컴포넌트를 넣습니다. |

### `TableSelectionCell`

**보조 컴포넌트** — `TableRow` 안(다중 선택 표)

행 선택 체크박스 칸입니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

### `TableDragHandle`

**보조 컴포넌트** — `TableCell` 안(순서 변경 표)

행을 끌어서 순서를 바꾸는 손잡이입니다. `dragAndDropHooks`가 있는 표에서 씁니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` | `순서 이동` |  |

### `KeyValueTable`

**공개 컴포넌트**

한 항목의 속성을 이름(키)과 값으로 보여 주는 표입니다. 안에 `KeyValueItem`을 넣습니다. 키 열은 같은 너비(최소 160px)로 맞춰지고, 값 열이 나머지를 채웁니다.

### `KeyValueItem`

**보조 컴포넌트** — `KeyValueTable` 안

키-값 표의 한 행입니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 값. 글자나 `Badge` 같은 컴포넌트를 넣습니다. |
| `label` *(필수)* | `ReactNode` |  | 키(항목 이름). |
| `disabled` | `boolean` | `false` | 비활성 칸 배경. 안의 입력 컴포넌트에는 `disabled`를 따로 줍니다. |
| `editable` | `boolean` | `false` | 편집 칸. Input · Select · DatePicker(기간이면 두 개)를 넣으면 평소에는 글자처럼 보이고, 마우스를 올리거나 편집하는 동안 입력 상자가 보입니다. |
| `keyProps` | `(Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & { [dataAttribute: `data-${string}`]: string; })` |  | 키 칸에 넘길 속성(예: 테스트 id). |
| `required` | `boolean` | `false` | 필수 표시. 이름 뒤에 빨간 점이 붙고, 화면 낭독기는 `requiredLabel`을 읽습니다. |
| `requiredLabel` | `string` | `필수` | 필수 점을 화면 낭독기가 읽는 글자. |
| `stack` | `boolean` | `false` | 값 내용을 세로로 쌓습니다(예: 파일 첨부 칸). |
| `unit` | `ReactNode` |  | 값 뒤에 붙는 단위 글자. |
| `valueProps` | `(Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & { [dataAttribute: `data-${string}`]: string; })` |  | 값 칸에 넘길 속성. |

### `KeyValueGroup`

**보조 컴포넌트** — `KeyValueItem` 안(값 여러 개를 한 줄로)

값 칸 안에서 여러 내용을 가로로 나란히 둡니다(예: 버튼과 안내 글자, 필터 칩과 초기화 버튼).

- 타입: `TableProps`, `TableHeaderProps`, `TableColumnProps`, `TableBodyProps`, `TableRowProps`, `TableCellProps`, `KeyValueTableProps`, `KeyValueItemProps`

## Tabs

### `Tabs`

**공개 컴포넌트**

같은 화면의 관련 콘텐츠를 구분하고 탭을 선택해 전환합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | `TabList`와 `TabPanel`들. |
| `appearance` | `"line" \| "filled"` | `line` | 모양 — 밑줄(`line`) · 채움(`filled`). |
| `className` | `string` |  |  |
| `defaultSelectedKey` | `Key` |  | 처음 선택할 탭의 `id`. `selectedKey` 없이 탭이 스스로 선택을 관리할 때 씁니다. |
| `disabledKeys` | `Iterable<Key>` |  | 고를 수 없는 탭의 `id` 목록(비활성). |
| `keyboardActivation` | `"manual" \| "automatic"` | `'automatic'` | 방향키로 옮기면 바로 선택(`automatic`)할지, Enter · Space를 눌러야 선택(`manual`)할지 정합니다. |
| `onSelectionChange` | `((key: Key) => void)` |  | 선택이 바뀌면 새로 선택된 탭의 `id`로 호출됩니다. |
| `selectedKey` | `Key` |  | 선택된 탭의 `id`. 넘기면 선택을 바깥에서 관리합니다. |
| `shape` | `"square" \| "rounded"` | `square` | 모서리 모양(`filled`에만 적용). |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | 크기. |
| `style` | `CSSProperties` |  |  |
| `variant` | `"primary" \| "secondary"` | `primary` | 종류 — 선택된 탭의 색. |

### `TabList`

**보조 컴포넌트** — `Tabs` 안

탭을 한 줄로 늘어놓는 탭 목록입니다. 탭은 간격 없이 나란히 놓입니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

### `Tab`

**보조 컴포넌트** — `TabList` 안

탭 하나입니다. 같은 `id`를 가진 `TabPanel`과 짝을 이룹니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 탭 글자. |
| `className` | `string` |  |  |
| `disabled` | `boolean` |  | 비활성 — 고를 수 없고, 방향키로 옮길 때도 건너뜁니다. |

### `TabPanel`

**보조 컴포넌트** — `Tabs` 안

탭 하나의 내용입니다. 따로 꾸밈이 없으므로 내용의 여백 등은 직접 정합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

- 상수: `TABS_APPEARANCES`, `TABS_VARIANTS`, `TABS_SIZES`, `TABS_SHAPES`
- 타입: `TabsProps`, `TabListProps`, `TabProps`, `TabPanelProps`, `TabsAppearance`, `TabsVariant`, `TabsSize`, `TabsShape`

## Textarea

### `Textarea`

**공개 컴포넌트**

요청 사항·사유 등 여러 줄의 텍스트를 입력받습니다. 글자 수 제한과 현재 입력량을 표시할 수 있습니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  | 바깥 요소의 클래스 이름. |
| `invalid` | `boolean` | `false` | 오류 — 오류 테두리로 표시합니다. |
| `label` | `ReactNode` |  | 입력 필드 위에 보이는 라벨. 없으면 `aria-label`로 이름을 붙입니다. |
| `message` | `ReactNode` |  | 입력 필드 아래에 보이는 도움말 메시지. |
| `messageType` | `"helper" \| "info" \| "success" \| "error"` | `오류이면 'error', 그 밖에는 'helper'` | 도움말 메시지 종류 — 입력 방법은 회색 도움말(`helper`), 상태를 알릴 때만 `info` · `success` · `error`. |
| `required` | `boolean` | `false` | 꼭 입력해야 하는 칸 — 라벨 뒤에 점을 붙이고, 입력 필드에 `required`를 넘겨 화면 낭독기가 "필수"로 읽고 폼 제출 때 빈 값을 검사합니다. |
| `showCount` | `boolean` | `true` | `maxLength`가 있을 때 `입력한 글자 수/최대 글자 수`를 보여 줍니다. |
| `size` | `"sm" \| "md"` | `sm` | 크기. |
| `style` | `CSSProperties` |  | 바깥 요소의 스타일. |

- 상수: `TEXTAREA_SIZES`
- 타입: `TextareaProps`, `TextareaSize`

## Toast

### `Toast`

**공개 컴포넌트**

작업 결과를 화면 아래에 알립니다. 안내·성공은 자동으로 닫히고, 주의·오류는 사용자가 닫을 때까지 유지됩니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | 메시지. 한 줄로 보이며 길면 말줄임으로 잘립니다. |
| `closeLabel` | `string` | `알림 닫기` | 화면 낭독기가 읽는 닫기 버튼 이름. |
| `onClose` | `(() => void)` |  | 닫기 버튼을 누르면 호출됩니다. |
| `showClose` | `boolean` | `true` | 닫기 버튼을 표시합니다. |
| `status` | `"success" \| "error" \| "warning" \| "information"` | `information` | 종류 — 안내 · 성공 · 주의 · 오류. |

### `ToastRegion`

**공개 컴포넌트**

`showToast()`로 띄운 토스트가 나타나는 영역입니다. 앱에 한 번만 둡니다. 토스트가 나타나면 화면 낭독기가 읽고, 마우스를 올리거나 키보드 포커스가 있는 동안에는 자동으로 닫히지 않습니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` | `알림` | 화면 낭독기가 읽는 토스트 영역 이름. |
| `className` | `string` |  | 영역의 클래스. 토스트가 나타나는 위치를 바꿀 때 씁니다. |
| `closeLabel` | `string` | `알림 닫기` | 화면 낭독기가 읽는 닫기 버튼 이름. |
| `queue` | `ToastQueue<ToastContent>` | `new ToastQueue<ToastContent>({ maxVisibleToasts: 3 })` | 보여 줄 토스트 목록. 지정하지 않으면 `showToast`가 쓰는 기본 목록을 보여 줍니다. |

- 함수: `showToast`, `closeToast`
- 타입: `ToastProps`, `ToastRegionProps`, `ToastContent`
- 기타 값: `toastQueue` *(내부 — 사용 금지)*

## Tooltip

### `Tooltip`

**공개 컴포넌트**

요소에 마우스를 올리거나 키보드 포커스를 두면 짧은 보충 설명을 표시합니다.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactElement<unknown, string \| JSXElementConstructor<any>>` |  | 툴팁을 띄울 요소. ref와 props를 전달하는 컴포넌트여야 합니다(예: `Button`). |
| `content` *(필수)* | `ReactNode` |  | 툴팁에 보여 줄 설명. |
| `className` | `string` |  | 툴팁 말풍선의 클래스. |
| `closeDelay` | `number` | `500` | 마우스나 포커스가 떠난 뒤 닫히기까지의 시간(ms). |
| `defaultOpen` | `boolean` |  | 처음 열림 여부. 직접 제어하지 않을 때 씁니다. |
| `delay` | `number` | `500` | 마우스를 올린 뒤 나타나기까지의 시간(ms). 키보드 포커스를 받으면 바로 나타납니다. |
| `disabled` | `boolean` |  | 툴팁을 끕니다. |
| `onOpenChange` | `((open: boolean) => void)` |  | 툴팁이 열리거나 닫힐 때 호출됩니다. |
| `open` | `boolean` |  | 열림 여부. 직접 제어할 때 씁니다. |
| `placement` | `"bottom" \| "top" \| "left" \| "right"` | `top` | 나타날 쪽. 공간이 없으면 반대쪽에 나타납니다. |
| `showArrow` | `boolean` | `true` | 화살표를 표시합니다. |

- 상수: `TOOLTIP_PLACEMENTS`
- 타입: `TooltipProps`, `TooltipPlacement`

## 아이콘

Figma 아이콘 벡터(16 또는 32 그리드). Prop: `size`(기본 viewBox 크기) + SVG 속성. 색은 `currentColor`.

`CaretLeftIcon`, `CaretRightIcon`, `PlusIcon`, `XIcon`, `EyeIcon`, `EyeSlashIcon`, `MagnifyingGlassIcon`, `InfoFillIcon`, `CheckCircleFillIcon`, `XCircleFillIcon`, `CheckBoldIcon`, `MinusBoldIcon`, `CaretDownIcon`, `CaretUpIcon`, `CheckIcon`, `CalendarDotsIcon`, `UploadSimpleIcon`, `DownloadSimpleIcon`, `FileTextIcon`, `ArrowSquareOutIcon`, `FolderSimpleDashedIcon`, `HouseIcon`, `DotsThreeIcon`, `ListIcon`, `CheckCircleIcon`, `ExclamationMarkIcon`, `WarningCircleIcon`, `DatabaseIcon`, `InfoIcon`, `CaretUpDownIcon`, `NotePencilIcon`, `ArrowCounterClockwiseIcon`, `TrendUpIcon`, `TrendDownIcon`, `MinusIcon`, `LightningIcon`, `WarningFillIcon`, `WarningIcon`

## 기타

- `IconProps` (type, `src/icons/createIcon.tsx`)
