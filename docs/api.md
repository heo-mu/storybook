# Public API

`platform-design-system`이 export 하는 전부입니다. **자동 생성 문서** — `npm run docs:api`로 다시 만듭니다(직접 수정하지 마세요).

- 어떤 컴포넌트를 써야 하는지와 사용 금지 목록은 [public-api.md](./public-api.md)에 있습니다. 각 컴포넌트 제목 아래에 분류를 적었습니다.
- Props 표는 각 컴포넌트가 직접 정의한 Prop만 보여 줍니다. 그 밖의 HTML 속성(`className`, `style`, `aria-*`, 이벤트 등)과
  react-aria-components 기반 컴포넌트의 react-aria Prop(`onPress` 등)은 그대로 전달됩니다(각 Usage 문서 참고).
- 모든 컴포넌트는 `ref`를 실제 DOM 요소로 전달합니다(`forwardRef`).

export 314개: 공개 컴포넌트 50 · 보조 컴포넌트 32 · 내부 부품 7 · 타입 129 · 상수 45 · 함수 3 · 아이콘 35 · 내부 API 13

## 목차

[Accordion](#accordion) · [Alert](#alert) · [Badge](#badge) · [Breadcrumb](#breadcrumb) · [Button](#button) · [Calendar](#calendar) · [Card](#card) · [Chart](#chart) · [Checkbox](#checkbox) · [Chip](#chip) · [Choice](#choice) · [DashboardFilterBar](#dashboardfilterbar) · [DataFreshness](#datafreshness) · [DataState](#datastate) · [DatePicker](#datepicker) · [Dialog](#dialog) · [DropdownMenu](#dropdownmenu) · [EmptyState](#emptystate) · [Field](#field) · [FileUploader](#fileuploader) · [Input](#input) · [Link](#link) · [Loading](#loading) · [MetricCard](#metriccard) · [MetricTrend](#metrictrend) · [Navigation](#navigation) · [Pagination](#pagination) · [Progress](#progress) · [Radio](#radio) · [SearchField](#searchfield) · [SegmentedControl](#segmentedcontrol) · [Select](#select) · [Skeleton](#skeleton) · [Slider](#slider) · [Stepper](#stepper) · [Switch](#switch) · [Table](#table) · [Tabs](#tabs) · [Textarea](#textarea) · [Toast](#toast) · [Tooltip](#tooltip) · [아이콘](#아이콘) · [기타](#기타)

## Accordion

### `Accordion`

**공개 컴포넌트**

A group of `AccordionItem`s (react-aria-components DisclosureGroup).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | `AccordionItem` elements. |
| `allowsMultipleExpanded` | `boolean` | `false` | Several items may be open at once. |
| `className` | `string` |  |  |
| `defaultExpandedKeys` | `Iterable<Key>` |  | Ids of the items open at first (uncontrolled). |
| `expandedKeys` | `Iterable<Key>` |  | Ids of the open items (controlled). |
| `onExpandedChange` | `((keys: Set<Key>) => void)` |  | Called with the ids of the open items. |
| `size` | `"sm" \| "md"` | `md` | Figma "Size" for every item. |

### `AccordionItem`

**공개 컴포넌트**

Figma component set `accordion-item` (1035:15648): a heading button that shows or hides its panel (react-aria-components Disclosure: aria-expanded / aria-controls, Enter / Space). State Hover = :hover, Expanded = open, Disabled = `disabled`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Body" (accordion-content): the panel content. |
| `title` *(필수)* | `ReactNode` |  | Figma "Title Text". |
| `className` | `string` |  |  |
| `defaultExpanded` | `boolean` |  | Initial open state of a single item (uncontrolled). |
| `description` | `ReactNode` |  | Figma "Description Text" ("Show Description" on). |
| `disabled` | `boolean` |  | Figma State "Disabled". |
| `divider` | `boolean` | `true` | Figma "Show Divider". |
| `expanded` | `boolean` |  | Open state of a single item outside an `Accordion` (controlled). |
| `headingLevel` | `3 \| 2 \| 4 \| 5 \| 6` | `3` | Heading level of the title. |
| `id` | `Key` |  | Item id (for `expandedKeys`). |
| `onExpandedChange` | `((expanded: boolean) => void)` |  | Called when the item opens or closes. |

- 상수: `ACCORDION_SIZES`
- 타입: `AccordionProps`, `AccordionItemProps`, `AccordionSize`

## Alert

### `Alert`

**공개 컴포넌트**

Figma component set `alert` (179:6087): an inline message with a status icon, title, description and an optional action. Error alerts use role="alert" (announced at once), the others role="status".

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `title` *(필수)* | `ReactNode` |  | Figma "Alert Text". |
| `action` | `ReactNode` |  | Figma "Button": e.g. `<Button variant="tertiary" appearance="outline" size="xs">`. |
| `description` | `ReactNode` |  | Figma "Sub Text" ("Sub" on). |
| `showIcon` | `boolean` | `true` | Figma "Icon". |
| `status` | `"success" \| "error" \| "information"` | `information` | Figma "Status". |

- 상수: `ALERT_STATUSES`
- 타입: `AlertProps`, `AlertStatus`

## Badge

### `Badge`

**공개 컴포넌트**

Figma component set `badge_status` (91:6152): a status label with an optional dot. Status colours come from colors/badge/status/{filled\|outline}/*.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Label Text". |
| `appearance` | `"outline" \| "filled"` | `filled` | Figma "Appearance". |
| `dot` | `boolean` | `true` | Figma "Dot". |
| `shape` | `"square" \| "rounded"` | `square` | Figma "Shape". |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | Figma "Size". |
| `status` | `"success" \| "danger" \| "basic" \| "gray" \| "point" \| "warning" \| "information"` | `basic` | Figma "Status". |

### `BadgeDot`

**공개 컴포넌트**

Figma component set `badge_dot` (95:2681): a status dot (e.g. a new-item marker).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | Figma "Size": 4 · 6 · 8px. |
| `status` | `"success" \| "danger" \| "basic" \| "gray" \| "point" \| "warning" \| "information"` | `basic` | Figma "Status". |

### `BadgeCount`

**공개 컴포넌트**

Figma component set `badge_count` (95:2762): a count pill (Digits Single / Multiple follow the number).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `count` *(필수)* | `number` |  | The number shown. |
| `max` | `number` | `99` | Larger counts show "{max}+" (Figma Digits Multiple: "99+"). |
| `status` | `"success" \| "danger" \| "basic" \| "gray" \| "point" \| "warning" \| "information"` | `basic` | Figma "Status". |

- 상수: `BADGE_STATUSES`, `BADGE_APPEARANCES`, `BADGE_SIZES`, `BADGE_SHAPES`
- 타입: `BadgeProps`, `BadgeDotProps`, `BadgeCountProps`, `BadgeStatus`, `BadgeAppearance`, `BadgeSize`, `BadgeShape`

## Breadcrumb

### `Breadcrumb`

**공개 컴포넌트**

Figma component set `breadcrumb` (712:5106): `<nav>` > `<ol>` of breadcrumb-item + separator groups. Collapsed layout: home · overflow trigger (menu of the hidden ancestors) · parent · current page.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `items` *(필수)* | `BreadcrumbEntry[]` |  | Pages from the top level down to the parent of the current page (Figma ancestors · parent). |
| `current` | `ReactNode` | `false` | Current page name (Figma Role "Current"). |
| `defaultExpanded` | `boolean` | `false` | Initial overflow menu state (uncontrolled). |
| `expanded` | `boolean` |  | Figma "Expanded": overflow menu open (controlled). |
| `homeHref` | `string` | `/` | Link of the home item (Figma "Home": House icon). |
| `homeLabel` | `string` | `홈` | Accessible name of the home item. |
| `layout` | `"full" \| "collapsed"` | `full` | Figma "Layout". `collapsed` keeps home, the parent and the current page and moves the other ancestors into a menu behind the overflow trigger (DotsThree). |
| `menuTitle` | `string` | `상위 경로` | Title of the overflow menu (Figma dropdownmenu_item Type Title). |
| `moreLabel` | `string` | `중간 경로 보기` | Accessible name of the overflow trigger (Figma Label Text). |
| `onAction` | `((id: Key) => void)` |  | Called with the entry's `id` when an entry without `href` is chosen (in the trail or the menu). |
| `onExpandedChange` | `((expanded: boolean) => void)` |  | Called when the overflow menu opens or closes. |
| `showParent` | `boolean` | `true` | Figma "Show Parent": in the collapsed layout keep the parent page next to the current page. |
| `size` | `"sm" \| "md"` | `md` | Figma "Size". |

### `BreadcrumbItem`

⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 `Breadcrumb` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).

Figma component set `breadcrumb-item` (710:4794). Role Link = `href` (an `<a>`; without `href` a `<button>`), Current = `current`, Open = `open`. State Hover / Pressed = :hover / :active.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | Figma "Label Text" ("Show Label" on). Without it the item is icon-only and needs `aria-label`. |
| `current` | `boolean` | `false` | Figma Role "Current": the current page — rendered as text with `aria-current="page"`. |
| `icon` | `ReactNode` |  | Figma "Show Icon" + icon instance (House for home, DotsThree for the overflow trigger). |
| `open` | `boolean` | `false` | Figma Role "Open": the item whose menu is open (brand label). |
| `size` | `"sm" \| "md"` | `md` | Figma "Size". |

### `BreadcrumbSeparator`

⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 `Breadcrumb` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).

Figma `breadcrumb-modern-separator` (710:4795): CaretRight 12px between items.

- 상수: `BREADCRUMB_SIZES`, `BREADCRUMB_LAYOUTS`
- 타입: `BreadcrumbProps`, `BreadcrumbItemProps` *(내부 — 사용 금지)*, `BreadcrumbEntry`, `BreadcrumbSize`, `BreadcrumbLayout`

## Button

### `Button`

**공개 컴포넌트**

Figma component set `button_basic` (54:2904). State "Hover"/"Pressed" are the native :hover/:active states; "Disabled" is the `disabled` prop.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Label Text". |
| `appearance` | `"solid" \| "outline"` | `'solid' ('outline' for variant "secondary")` | Figma "Appearance". |
| `disabled` | `boolean` |  | Figma State "Disabled". |
| `leftIcon` | `ReactNode` |  | Figma "Left Icon" (boolean + icon instance): rendered when provided. Sized to 16px (20px at lg). |
| `rightIcon` | `ReactNode` |  | Figma "Right Icon" (boolean + icon instance): rendered when provided. Sized to 16px (20px at lg). |
| `shape` | `"square" \| "rounded"` | `square` | Figma "Shape". |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `xs` | Figma "Size". |
| `variant` | `"primary" \| "secondary" \| "tertiary"` | `primary` | Figma "Variant". |

### `IconButton`

**공개 컴포넌트**

Figma component set `button_icon` (67:2368). State "Hover"/"Pressed" are the native :hover/:active states; "Disabled" is the `disabled` prop.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `aria-label` *(필수)* | `string` |  | Accessible name — the Figma component keeps its "Label" text layer hidden. |
| `icon` *(필수)* | `ReactNode` |  | The icon instance. Sized to 16px (20px at md). |
| `appearance` | `"solid" \| "outline"` | `'solid' ('outline' for variant "secondary")` | Figma "Appearance". |
| `disabled` | `boolean` |  | Figma State "Disabled". |
| `shape` | `"square" \| "rounded"` | `square` | Figma "Shape". |
| `size` | `"xs" \| "sm" \| "md"` | `xs` | Figma "Size". |
| `variant` | `"primary" \| "secondary" \| "tertiary"` | `primary` | Figma "Variant". |

### `TextButton`

**공개 컴포넌트**

Figma component set `button_text` (432:8395). State "Hover"/"Pressed" are the native :hover/:active states; "Disabled" is the `disabled` prop.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Label Text". |
| `disabled` | `boolean` |  | Figma State "Disabled". |
| `leftIcon` | `ReactNode` |  | Figma "Left Icon" (boolean + icon instance): rendered when provided. Sized to 16px. |
| `rightIcon` | `ReactNode` |  | Figma "Right Icon" (boolean + icon instance): rendered when provided. Sized to 16px. |
| `size` | `"sm" \| "md"` | `sm` | Figma "Size". |
| `variant` | `"primary" \| "secondary"` | `primary` | Figma "Type" ("Primary" / "SecondarySecondary"). Both are bound to the same variables in Ver 0.4. |

- 상수: `BUTTON_VARIANTS`, `BUTTON_APPEARANCES`, `BUTTON_SHAPES`, `BUTTON_SIZES`, `ICON_BUTTON_SIZES`, `TEXT_BUTTON_VARIANTS`, `TEXT_BUTTON_SIZES`, `BUTTON_STATES` *(내부 — 사용 금지)*, `BUTTON_TONES` *(내부 — 사용 금지)*
- 함수: `resolveAppearance` *(내부 — 사용 금지)*
- 타입: `ButtonProps`, `IconButtonProps`, `TextButtonProps`, `ButtonVariant`, `ButtonAppearance`, `ButtonShape`, `ButtonSize`, `IconButtonSize`, `TextButtonVariant`, `TextButtonSize`, `ButtonState` *(내부 — 사용 금지)*, `ButtonToneProps` *(내부 — 사용 금지)*, `ButtonDisabledProp` *(내부 — 사용 금지)*

## Calendar

### `Calendar`

**공개 컴포넌트**

Figma `date-picker_calendar` (144:1644) with `date-picker_header` (144:1377), `date-picker_navigation` (144:1328) and `date-picker_day` (144:1033). Month grid with keyboard navigation (arrows, Page Up / Down, Home / End), from react-aria-components. Weekday and month names follow the locale (react-aria I18nProvider, otherwise the browser).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` | `the month heading` | Accessible name. |
| `autoFocus` | `boolean` |  | Moves focus into the grid on mount (used by DatePicker). |
| `className` | `string` |  |  |
| `defaultFocusedValue` | `string` | `today` | Month shown initially when there is no value (any day of that month). |
| `defaultValue` | `string \| null` | `null` | Initially selected date (uncontrolled). |
| `disabled` | `boolean` |  | Disables the whole calendar. |
| `isDateUnavailable` | `((date: string) => boolean)` |  | Marks individual days as unavailable (Disabled look). |
| `maxValue` | `string` |  | Latest selectable date. |
| `minValue` | `string` |  | Earliest selectable date; earlier days use the Disabled look. |
| `onChange` | `((value: string) => void)` |  | Called with the selected date ('YYYY-MM-DD'). |
| `style` | `CSSProperties` |  |  |
| `value` | `string \| null` |  | Selected date, 'YYYY-MM-DD' (controlled); `null` = none. |

- 타입: `CalendarProps`, `ISODate`

## Card

### `Card`

**공개 컴포넌트**

Figma Card (185:6512): header, content and footer in a container — padding p-5 top / bottom, m-4 between the parts, border-radius/rounded-lg, colors/card/background, 1px INSIDE colors/card/border, shadow (figma-issues F60).

### `CardHeader`

**보조 컴포넌트** — `Card` 안

Figma card_header (218:7173): title, description and an action above a divider.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `title` *(필수)* | `ReactNode` |  | Figma "Card Text". |
| `action` | `ReactNode` |  | Figma "Button" (Button Tertiary · Outline · sm in Figma). |
| `description` | `ReactNode` |  | Figma "Sub" · "Sub Text". |
| `headingLevel` | `3 \| 2 \| 4 \| 5 \| 6` | `3` | Heading level of the title. |

### `CardContent`

**보조 컴포넌트** — `Card` 안

Figma card_content: the body, padded p-5 left and right.

### `CardFooter`

**보조 컴포넌트** — `Card` 안

Figma card_footer (218:7174): full-width buttons m-2 apart (Figma: Primary · Solid · md and Tertiary · Outline · md).

- 타입: `CardProps`, `CardHeaderProps`

## Chart

### `Chart`

**공개 컴포넌트**

Figma component set `chart` (698:4399): line, vertical bar and horizontal bar charts in the default style (axis labels, value grid, legend) or the simple style (160px, the last category is the current period). One series is Figma Group=no, two are Group=yes. Both styles show the Figma hover=yes state for the active category — guide line and rings (line) or highlight band (bars) and the tooltip — on pointer hover, tap or keyboard (arrow keys, Home / End, Escape). The drawing is SVG sized to the container width; the values are also given to screen readers as a table.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `categories` *(필수)* | `string[]` |  | Category (x axis; y axis for `bar-horizontal`) labels. |
| `series` *(필수)* | `ChartSeries[]` |  | One series (Figma Group=no) or two (Group=yes: the second is the comparison). Further series are ignored. |
| `activeIndex` | `number \| null` |  | Category whose tooltip is shown (hover / keyboard / tap), or `null` (controlled). |
| `defaultActiveIndex` | `number \| null` | `null` | Initial `activeIndex` (uncontrolled). |
| `formatValue` | `((value: number) => string)` | `(value: number) => value.toLocaleString('ko-KR')` | Formats values (ticks, tooltip, data table). |
| `maxLabel` | `ReactNode` | `최고` | Badge over the highest value of the first series (line, default style); `false` hides it. |
| `onActiveIndexChange` | `((index: number \| null) => void)` |  |  |
| `plotLabel` | `string` | `차트 항목: 화살표 키로 값 확인` | Accessible name of the plot, which takes keyboard focus. |
| `ticks` | `number[]` |  | Value-axis ticks of the default style, lowest first; the axis spans the first to the last. Default: 4 steps from 0. |
| `type` | `"line" \| "bar-vertical" \| "bar-horizontal"` | `bar-vertical` | Figma "Type". |
| `variant` | `"default" \| "simple"` | `default` | Figma "Style": `default` has axes, a legend and a tooltip; `simple` is the compact 160px chart whose last category is the current period. |
| `xAxisLabel` | `ReactNode` |  | Figma "X Axis Label" (default style). |
| `yAxisLabel` | `ReactNode` |  | Figma "Y Axis Label" (default style). |

### `ChartLegendItem`

**보조 컴포넌트** — 직접 만드는 범례(`Chart`는 범례를 스스로 그림)

Figma component set `chart-legend-item` (697:4514): a series marker and its label, m-1_5 apart (label xs/leading-normal/normal, colors/chart/legend/label/default; marker colors/chart/bar/* for `bar`, colors/chart/line/* for the lines). `Chart` renders its own legend; use this for custom legends.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Label". |
| `color` | `"brand" \| "compare" \| "02" \| "history" \| "history-compare"` | `type === 'dash-line' ? '02' : 'brand'` | Series colour of the marker. |
| `type` | `"line" \| "dash-line" \| "bar"` | `bar` | Figma "Type": a line, a dashed line (5 / 3) or a 12px square. |

### `ChartTooltip`

**보조 컴포넌트** — 직접 만드는 차트의 값 표시(`Chart`는 툴팁을 스스로 그림)

Figma component `chart-tooltip` (693:9776): the values of one category — title (xs) above rows of an indicator, the series label and its value. Padding p-2_5, m-1_5 between the title and the rows, rows m-1 apart, alpha/white/800 background, rounded-sm, elevation-3. `Chart` shows it on hover / keyboard navigation.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `items` *(필수)* | `ChartTooltipItem[]` |  | One row per series: indicator, label and value. |
| `title` | `ReactNode` |  | Figma "Time" (the category or date). |

- 상수: `CHART_TYPES`, `CHART_VARIANTS`, `CHART_LEGEND_TYPES`, `CHART_COLORS`
- 타입: `ChartProps`, `ChartSeries`, `ChartLegendItemProps`, `ChartTooltipProps`, `ChartTooltipItem`, `ChartType`, `ChartVariant`, `ChartLegendType`, `ChartColor`

## Checkbox

### `Checkbox`

**공개 컴포넌트**

Figma component set `checkbox` (99:2389). Selection: Checked = `checked` / `defaultChecked`, Indeterminate = `indeterminate`. State: Hover / Pressed are the native :hover / :active, Disabled = `disabled`. Renders a native `<input type="checkbox">`; its props (name, value, checked, onChange, …) and the ref go to it.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  | Class name of the root `<label>`. |
| `indeterminate` | `boolean` | `false` | Figma Selection "Indeterminate" (mixed). Shown instead of the checked mark while true. |
| `label` | `ReactNode` |  | Figma "Label" + "Label Text". Without a label, give the checkbox an `aria-label`. |
| `size` | `"sm" \| "md" \| "lg"` | `'sm'` | Figma "Size". Inside a `CheckboxGroup` the group size is the default. |
| `style` | `CSSProperties` |  | Style of the root `<label>`. |
| `value` | `string` |  | Form value; inside a `CheckboxGroup` it identifies the checkbox in the group value. |

### `CheckboxGroup`

**공개 컴포넌트**

Groups `Checkbox`es that have a `value` (role="group") and manages the selected values. Not a Figma component — semantic wrapper only; label it with `aria-label` or `aria-labelledby`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `defaultValue` | `string[]` | `[]` | Initially selected values (uncontrolled). |
| `disabled` | `boolean` |  | Disables every checkbox in the group. |
| `name` | `string` |  | `name` given to every checkbox in the group (form submission). |
| `onChange` | `((value: string[]) => void)` |  | Called with the new list of selected values. |
| `orientation` | `"horizontal" \| "vertical"` | `vertical` | Stacking direction — items are 8px apart (16px in a row), Design System Rules 08. |
| `size` | `"sm" \| "md" \| "lg"` |  | Size applied to every checkbox that does not set its own. |
| `value` | `string[]` |  | Selected values (controlled). |

- 타입: `CheckboxProps`, `CheckboxGroupProps`

## Chip

### `Chip`

**공개 컴포넌트**

Figma component set `chip-multi` (201:12711) — a toggle chip for multi-select filters. Variant Selected = `selected` (check icon after the label); State Hover / Pressed are :hover / :active, Disabled = `disabled`. Renders `<button aria-pressed>`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Label Text". |
| `defaultSelected` | `boolean` | `false` | Initially selected (uncontrolled). |
| `onSelectedChange` | `((selected: boolean) => void)` |  | Called with the new selection when the chip is toggled. |
| `selected` | `boolean` |  | Figma Variant "Selected" (controlled). |
| `size` | `"xs" \| "sm" \| "md"` | `xs` | Figma "Size". |

### `InputChip`

**공개 컴포넌트**

Figma component set `chip-input` (558:26017) — an entered value that can be removed (X icon). The whole chip is the remove button, so the target is the full chip height. State Hover / Pressed are :hover / :active, Disabled = `disabled`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Label Text" — an entered value. |
| `onRemove` | `(() => void)` |  | Called when the chip is activated (click, Enter, Space) or Delete / Backspace is pressed on it. |
| `removeLabel` | `string` | `삭제` | Text appended to the label for screen readers. |
| `size` | `"xs" \| "sm" \| "md"` | `xs` | Figma "Size". |

### `FilterChip`

**공개 컴포넌트**

Figma component set `chip-filter` (558:25704) — a chip that opens a filter menu or panel. State Hover / Pressed are :hover / pressed, Disabled = `disabled`. Built on the react-aria `Button`, so it can be the trigger of react-aria overlays; `onPress` (or `onClick`) handles activation.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Label Text" — the filter name or its current value. |
| `className` | `string` |  |  |
| `disabled` | `boolean` |  | Figma State "Disabled". |
| `expanded` | `boolean` |  | Figma "Expanded": its menu or panel is open (caret up, `aria-expanded`). Inside a react-aria trigger (e.g. `MenuTrigger`, `DialogTrigger`) this is set automatically. |
| `selected` | `boolean` | `false` | Figma Variant "Selected": the filter has a value applied. |
| `size` | `"xs" \| "sm" \| "md"` | `xs` | Figma "Size". |

### `FilterChipSelect`

**공개 컴포넌트**

A filter chip with its option panel — Figma `chip-filter` (558:25704) + `listbox` / `option` Size=sm, as in the Figma "chip-filter 선택 예시" (Design System Rules 04 · 07). - Multiple (default): options toggle with a check while the panel stays open; the chip text follows the choice and   the choice is applied (`onChange`, Selected look) when the panel closes — Esc, a press outside or the chip.   Turning every option off and closing removes the filter. - Single: choosing an option applies it and closes the panel; the first option (`clearLabel`, "전체") removes it. The chip is Selected while a value is applied. Keyboard and screen readers follow the react-aria Select (button + listbox: Enter · Space · ↓ open, arrows · type-ahead move, Space · Enter choose, Esc close).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `label` *(필수)* | `string` |  | Filter name: the chip text while nothing is applied, then "name: value, value". |
| `options` *(필수)* | `FilterChipSelectOption[]` |  | The choices, in order. |
| `className` | `string` |  |  |
| `clearLabel` | `string` | `'전체'` | First option that clears the filter (`null` value). |
| `defaultOpen` | `boolean` | `false` | Open the panel on first render (e.g. the Figma Expanded state of a table filter being edited). |
| `defaultValue` | `Key \| Key[] \| null` | `[] null` | Initially applied values (uncontrolled). Initially applied value (uncontrolled). |
| `disabled` | `boolean` |  | Figma chip State "Disabled". |
| `maxDisplayed` | `number` | `3` | How many applied values the chip names before "외 N". |
| `name` | `string` |  | Form field name (a hidden native select carries the value). |
| `onChange` | `((value: Key[]) => void) \| ((value: Key \| null) => void)` |  | Called with the applied values when the panel closes with a changed choice. Called with the applied value (`null` when cleared). |
| `onOpenChange` | `((isOpen: boolean) => void)` |  | Called when the panel opens or closes. |
| `selectionMode` | `"multiple" \| "single"` |  | Several values (default): the panel stays open while choosing and the choice is applied when it closes. One value: choosing an option applies it and closes the panel. |
| `size` | `"xs" \| "sm" \| "md"` | `'md'` | Figma chip "Size". |
| `value` | `Key \| Key[] \| null` |  | Applied values (controlled). Applied value (controlled); `null` = no filter. |

- 상수: `CHIP_SIZES`
- 함수: `filterChipText`
- 타입: `ChipProps`, `InputChipProps`, `FilterChipProps`, `ChipSize`, `FilterChipSelectProps`, `FilterChipSelectMultipleProps`, `FilterChipSelectSingleProps`, `FilterChipSelectOption`

## Choice

- 상수: `CHOICE_SIZES`, `CHOICE_GROUP_ORIENTATIONS`
- 타입: `ChoiceSize`, `ChoiceGroupOrientation`

## DashboardFilterBar

### `DashboardFilterBar`

**공개 컴포넌트**

Figma component `dashboard-filter-bar` (698:4163): the query conditions of a dashboard — filter groups m-6 apart with "\|" dividers, and actions p-3 apart at the right, m-4 from the filters, in a white card (padding 16, radius 12, elevation-3 shadow). A `search` landmark.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `actions` | `ReactNode` |  | Buttons at the right end (Figma: reset icon button and "조회"). |

### `DashboardFilterGroup`

**보조 컴포넌트** — `DashboardFilterBar` 안

A labelled group of controls in a `DashboardFilterBar` (`role="group"`, named by its label).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | Figma group label ("조회 대상", "조회 기간" …, sm/leading-normal/medium, text/tertiary); names the group. |

### `DashboardFilterRange`

**보조 컴포넌트** — `DashboardFilterGroup` 안(기간 등 두 값)

Two controls joined by "~" (text/tertiary), m-2 apart — the Figma date range.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `from` *(필수)* | `ReactNode` |  | Start control (e.g. a DatePicker with `aria-label="시작일"`). |
| `to` *(필수)* | `ReactNode` |  | End control. |

- 타입: `DashboardFilterBarProps`, `DashboardFilterGroupProps`, `DashboardFilterRangeProps`

## DataFreshness

### `DataFreshness`

**공개 컴포넌트**

Figma component set `data-freshness` (697:4543): how current the data is — a status badge (Outline · sm · Rounded, with dot) and the last-received time with the refresh interval (xs/leading-normal/normal; time text/secondary, "·" and interval text/tertiary, m-0_5 apart), p-2 after the badge.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `timestamp` *(필수)* | `ReactNode` |  | Figma "Timestamp Text" — when the data was last received. |
| `dateTime` | `string` |  | Machine-readable `timestamp` (renders a `<time datetime>`). |
| `interval` | `ReactNode` |  | Figma "Interval Text" — after a "·", e.g. "자동 갱신 1분". |
| `label` | `ReactNode` | `LABELS[state]` | Badge text. |
| `state` | `"fresh" \| "stale" \| "offline"` | `fresh` | Figma "State": Fresh (Success badge), Stale (Warning), Offline (Gray). |

- 상수: `DATA_FRESHNESS_STATES`
- 타입: `DataFreshnessProps`, `DataFreshnessState`

## DataState

### `DataState`

**공개 컴포넌트**

Figma component set `data-state` (698:4359): what a data area shows instead of its content — Loading (three skeleton bars and a label) or an empty-state message (Empty · No-results · Error · No-access · Partial) with an icon, title, description and a TextButton. The region is a polite live region (`role="status"`).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `state` *(필수)* | `"error" \| "loading" \| "empty" \| "no-results" \| "no-access" \| "partial"` |  | Figma "State". |
| `action` | `ReactNode` |  | A custom element instead of the button. |
| `actionLabel` | `ReactNode` |  | Text of the button below the message (TextButton Primary · sm). Defaults to the Figma text of the state. |
| `description` | `ReactNode` |  | Figma "Empty Description", "Error Description" … of the state. Defaults to the Figma text of the state (Partial: none — pass the counts); `null` hides it. |
| `loadingLabel` | `ReactNode` | `데이터를 불러오는 중입니다` | Loading text. |
| `onAction` | `(() => void)` |  | Shows the button and is called when it is pressed. |
| `title` | `ReactNode` |  | Figma "Empty Title", "Error Title" … of the state. Defaults to the Figma text of the state. |

- 상수: `DATA_STATES`
- 타입: `DataStateProps`, `DataStateValue`

## DatePicker

### `DatePicker`

**공개 컴포넌트**

Figma component sets `date-picker_trigger` (144:723) and `date-picker_message` (144:888) with the `Calendar` (date-picker_calendar) in a popover. The field accepts typed dates (YYYY.MM.DD, YYYY-MM-DD, YYYYMMDD …, committed on Enter or blur); the calendar button (or Alt + ↓) opens the calendar. State: Hover / Focus = :hover / :focus-within, Completed = has a date, Error = `invalid` or an unusable typed date, Disabled = `disabled`, Read-only = `readOnly`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `aria-describedby` | `string` |  |  |
| `aria-label` | `string` |  |  |
| `calendarButtonLabel` | `string` | `달력 열기` | Accessible name of the calendar button. |
| `className` | `string` |  | Class name of the root element. |
| `defaultValue` | `string \| null` | `null` | Initial date (uncontrolled). |
| `disabled` | `boolean` | `false` | Figma State "Disabled". |
| `id` | `string` |  |  |
| `invalid` | `boolean` | `false` | Figma State "Error". Text that is not a valid, selectable date also shows the Error state. |
| `isDateUnavailable` | `((date: string) => boolean)` |  | Marks individual days as unavailable. |
| `label` | `ReactNode` |  | Figma "Label" + "Label Text". Without a label, set `aria-label`. |
| `maxValue` | `string` |  | Latest selectable date. |
| `message` | `ReactNode` |  | Figma "Alert" + date-picker_message text. |
| `messageType` | `"info" \| "success" \| "error"` | `'error' when invalid, otherwise 'info'` | Figma date-picker_message "Type". |
| `minValue` | `string` |  | Earliest selectable date. |
| `name` | `string` |  | Form field name — submitted as 'YYYY-MM-DD' through a hidden input. |
| `onChange` | `((value: string \| null) => void)` |  | Called with the new date, or null when the field is cleared. |
| `onOpenChange` | `((open: boolean) => void)` |  | Called when the calendar opens or closes. |
| `open` | `boolean` |  | Calendar popover open (controlled). |
| `placeholder` | `string` | `YYYY.MM.DD` | Figma "Display Text" while empty. |
| `readOnly` | `boolean` | `false` | Figma State "Read-only": shows the date without the calendar button. |
| `required` | `boolean` |  |  |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | Figma "Size". |
| `style` | `CSSProperties` |  | Style of the root element. |
| `value` | `string \| null` |  | Selected date 'YYYY-MM-DD' (controlled); `null` = empty. |

- 타입: `DatePickerProps`

## Dialog

### `Dialog`

**공개 컴포넌트**

Figma component `dialog` (149:2838): a modal panel with title, description and buttons (react-aria-components Modal + Dialog: focus moves in and is trapped, Escape closes, focus returns).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `title` *(필수)* | `ReactNode` |  | Figma "title". |
| `actions` | `ReactNode \| ((close: () => void) => ReactNode)` |  | Figma "dialog_footer": the buttons (Figma: Button Tertiary · Solid · lg and Primary · Solid · lg, equal width). A function receives `close`. |
| `children` | `ReactNode` |  | Content between the header and the buttons (not in the Figma component — see Dialog.mdx). |
| `className` | `string` |  | Class of the dialog panel. |
| `defaultOpen` | `boolean` |  | Initial open state (uncontrolled). |
| `description` | `ReactNode` |  | Figma "description" — read as the dialog description. |
| `dismissable` | `boolean` | `false` | Close by clicking outside. Escape always closes unless `keyboardDismissDisabled`. |
| `keyboardDismissDisabled` | `boolean` | `false` | Keep the dialog open on Escape. |
| `onOpenChange` | `((open: boolean) => void)` |  | Called when the dialog opens or closes. |
| `open` | `boolean` |  | Open state (controlled). |
| `role` | `"dialog" \| "alertdialog"` | `dialog` | `alertdialog` for confirmations that interrupt the user. |
| `trigger` | `ReactElement<unknown, string \| JSXElementConstructor<any>>` |  | Element that opens the dialog (forwards its ref and props, e.g. `Button`). Without it use `open`. |

- 타입: `DialogProps`

## DropdownMenu

### `DropdownMenu`

**공개 컴포넌트**

Dropdown menu built from the Figma `dropdownmenu_item` (179:4819) and `dropdownmenu_line` (179:5082) components and the menu panel of the Figma examples (Menu Container): padding p-1, 1px border, border-radius/rounded, effect elevation-3. Keyboard, focus and ARIA (menu / menuitem) come from react-aria-components; Escape closes and focus returns to the trigger.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | `DropdownMenuItem`, `DropdownMenuSection` and `DropdownMenuSeparator` elements. |
| `trigger` *(필수)* | `ReactElement<unknown, string \| JSXElementConstructor<any>> \| ReactElement<DOMAttributes<HTMLElement>, string>` |  | The element that opens the menu: a react-aria Button / FilterChip, or any element that forwards its ref and props (e.g. the design-system `Button`). |
| `aria-label` | `string` |  | Accessible name of the menu. |
| `className` | `string` |  |  |
| `disabledKeys` | `Iterable<Key>` |  | Item ids that cannot be activated (Figma State "Disabled"). |
| `offset` | `number` | `4` | Gap between the trigger and the panel in px (4 as Select / Date Picker; the Figma breadcrumb menu uses 2). |
| `onAction` | `((key: Key) => void)` |  | Called with the id of the activated item. |
| `onOpenChange` | `((open: boolean) => void)` |  | Called when the menu opens or closes. |
| `open` | `boolean` |  | Open state (controlled). |
| `placement` | `Placement` | `bottom start` | Position relative to the trigger. |

### `DropdownMenuItem`

**보조 컴포넌트** — `DropdownMenu` 안

Figma `dropdownmenu_item` Type Content. State: Hover = pointer hover or keyboard focus, Alert = `danger`, Disabled = `disabled`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Item" (label). |
| `chevron` | `boolean` | `false` | Figma "Right Icon" — the caret, for items that open a submenu or a next step. |
| `className` | `string` |  |  |
| `danger` | `boolean` | `false` | Figma State "Alert": a destructive action (danger colours). |
| `description` | `ReactNode` |  | Figma "Sub" text under the label ("Sub Text" on). |
| `disabled` | `boolean` |  | Figma State "Disabled". |
| `icon` | `ReactNode` |  | Figma "Left Icon". |

### `DropdownMenuSection`

**보조 컴포넌트** — `DropdownMenu` 안

A group of items with an optional title (Figma Type Title).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Items of the group. |
| `aria-label` | `string` |  | Accessible name when there is no visible title. |
| `id` | `Key` |  | Section id. |
| `title` | `ReactNode` |  | Figma `dropdownmenu_item` Type Title (group title). |

### `DropdownMenuSeparator`

**보조 컴포넌트** — `DropdownMenu` 안

Figma `dropdownmenu_line`: divider between groups.

- 타입: `DropdownMenuProps`, `DropdownMenuItemProps`, `DropdownMenuSectionProps`

## EmptyState

### `EmptyState`

**공개 컴포넌트**

Figma component `empty-state` (724:14963): a centred message for an empty area — icon, title, description (m-1 apart) and an action m-3 below. 320px wide as in Figma, narrower when the parent is.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `title` *(필수)* | `ReactNode` |  | Figma "Title Text". |
| `action` | `ReactNode` |  | The Figma button below the text, e.g. `<TextButton rightIcon={<CaretRightIcon />}>`. |
| `description` | `ReactNode` |  | Figma "Description Text" ("Description" on). |
| `icon` | `ReactNode` |  | Figma "Icon" (16px; the Figma placeholder is Database). Decorative. |

- 타입: `EmptyStateProps`

## Field

- 상수: `FIELD_SIZES`, `FIELD_MESSAGE_TYPES`
- 타입: `FieldSize`, `FieldMessageType`

## FileUploader

### `FileUploader`

**공개 컴포넌트**

Figma component set `file-uploader` (651:3945): a drop area that also opens the file dialog. State: Hover / Pressed = :hover / :active, Drag-over = files dragged over it, Disabled = `disabled`. The area is a `<button>` (Enter / Space open the dialog); a hidden `<input type="file">` holds the selection for forms.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `accept` | `string` |  | Accepted file types, as for `<input type="file" accept>` (e.g. '.pdf,image/*'). Dropped files are filtered too. |
| `className` | `string` |  | Class name of the drop area. |
| `disabled` | `boolean` | `false` | Figma State "Disabled". |
| `helperText` | `ReactNode` |  | Figma "Helper Text" (allowed types, size limits …). |
| `id` | `string` |  |  |
| `multiple` | `boolean` | `false` | Allows several files. |
| `name` | `string` |  | Form field name of the underlying file input. |
| `onFilesSelected` | `((files: File[]) => void)` |  | Called with the files chosen in the dialog or dropped on the area. |
| `showIcon` | `boolean` | `true` | Figma "Show Icon". |
| `style` | `CSSProperties` |  | Style of the drop area (e.g. its width — Figma 353px). |
| `title` | `ReactNode` | `파일을 끌어다 놓거나 선택하세요` | Figma "Title Text". |

### `FileUploaderItem`

**보조 컴포넌트** — `FileUploader` 아래 파일 목록

Figma component set `file-uploader-item` (651:3999): one file in an upload list. The actions are the TextButton (button_text Primary sm) with the file name as their description.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `fileName` *(필수)* | `ReactNode` |  | Figma "File Name". |
| `downloadLabel` | `string` | `다운로드` |  |
| `fileInfo` | `ReactNode` |  | Figma "File Info" (size, status text …). |
| `onDownload` | `(() => void)` |  | Called by the "다운로드" button (status 'download'). |
| `onRemove` | `(() => void)` |  | Called by the "삭제" button (status 'completed'). |
| `removeLabel` | `string` | `삭제` |  |
| `status` | `"download" \| "completed" \| "uploading"` | `completed` | Figma State: Completed (remove button), uploading (spinner), download (download button). |
| `uploadingLabel` | `string` | `업로드 중` | Accessible name of the spinner. |

### `ImageUploadPreview`

**보조 컴포넌트** — `KeyValueItem`의 이미지 업로드 칸

The uploaded image of the Figma key-value File Upload cell (`table_value_editable`, 503:23264): a 100px square with a round remove button (18px, padding p-0_5, colors/fill/secondary/subtle/default, 1px colors/border/gray-subtler, X 12px colors/icon/secondary) centred on its top-right corner.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `alt` *(필수)* | `string` |  | Text alternative of the image. |
| `src` *(필수)* | `string` |  | Image to show (e.g. an object URL of the chosen file). |
| `onRemove` | `(() => void)` |  | Called by the remove button; without it there is no button. |
| `removeLabel` | `string` | `이미지 삭제` | Accessible name of the remove button. |

- 상수: `FILE_UPLOADER_ITEM_STATUSES`
- 타입: `FileUploaderProps`, `FileUploaderItemProps`, `FileUploaderItemStatus`, `ImageUploadPreviewProps`

## Input

### `Input`

**공개 컴포넌트**

Figma component set `input` (76:2945) with `input_message` (83:3009). State: Hover / Focus are the native :hover / :focus-within, Completed = the field has a value, Error = `invalid`, Disabled = `disabled`, Read-only = `readOnly`. Native input props (value, onChange, name, …) and the ref go to the `<input>`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  | Class name of the root element. |
| `clearable` | `boolean` | `true` | Clear button (Figma icon/X, shown on hover and focus). |
| `defaultRevealed` | `boolean` | `false` | Initial visibility of a password value. |
| `invalid` | `boolean` | `false` | Figma State "Error": red 2px border, `aria-invalid`. |
| `label` | `ReactNode` |  | Figma "Label" + "Label Text". |
| `message` | `ReactNode` |  | Figma "Alert" + "Alert Text" (input_message). |
| `messageType` | `"info" \| "success" \| "error"` | `'error' when invalid, otherwise 'info'` | Figma input_message "Type". |
| `onClear` | `(() => void)` |  | Called after the clear button empties the field. |
| `revealable` | `boolean` | `true` | For `type="password"`: show/hide toggle (Figma "Icon-eye"). |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | Figma "Size". |
| `style` | `CSSProperties` |  | Style of the root element. |

- 타입: `InputProps`

## Link

### `Link`

**공개 컴포넌트**

Figma component set `link` (111:1509). State: Hover / Pressed / Visited are :hover / :active / :visited, Disabled = `disabled`. Renders a native `<a>`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Label Text". |
| `disabled` | `boolean` | `false` | Figma State "Disabled": rendered without `href`, `aria-disabled`, not focusable. |
| `external` | `boolean` | `false` | Opens in a new tab (`target="_blank"`, `rel="noopener noreferrer"`) and announces it. |
| `newTabLabel` | `string` | `(새 창)` | Text read after the label for external links. |
| `showIcon` | `boolean` | ``external`` | Figma "Icon" (arrow-square-out). |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | Figma "Size". |

- 상수: `LINK_SIZES`
- 타입: `LinkProps`, `LinkSize`

## Loading

### `Loading`

**공개 컴포넌트**

Figma component set `loading` (675:5644): a spinning arc (gradient from colors/border/transparency to colors/border/brand) with an optional label. Renders `role="status"`, so the label (or `aria-label`, default '로딩 중') is announced politely.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | Figma "text" (Loading text under the spinner). Without it, `aria-label` names the status. |
| `size` | `"sm" \| "md"` | `md` | Figma "size". |

- 상수: `LOADING_SIZES`
- 타입: `LoadingProps`, `LoadingSize`

## MetricCard

### `MetricCard`

**공개 컴포넌트**

Figma component `metric-card` (697:4487): a key figure — header (icon + title), value with unit, and a comparison row (trend + text), m-3 apart inside a white card (padding 16, radius 12, elevation-3 shadow).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `title` *(필수)* | `ReactNode` |  | Figma "Title" — what the metric is. Rendered as a heading. |
| `value` *(필수)* | `ReactNode` |  | Figma "Value" (3xl/leading-normal/semibold). |
| `comparison` | `ReactNode` |  | Figma "Comparison" text after the trend, e.g. "이전 7일 대비". |
| `headingLevel` | `3 \| 2 \| 4 \| 5 \| 6` | `3` | Heading level of the title. |
| `icon` | `ReactNode` |  | Figma header icon (20px, icon/tertiary; Lightning in Figma). Decorative. |
| `trend` | `ReactNode` |  | Figma comparison row: the change, usually a `MetricTrend`. |
| `unit` | `ReactNode` |  | Figma "Unit", baseline-aligned after the value. |

- 타입: `MetricCardProps`

## MetricTrend

### `MetricTrend`

**공개 컴포넌트**

Figma component set `metric-trend` (697:4482): the change of a metric — a 12px direction icon and the change text (xs/leading-normal/medium) on dashboard/background, p-1 padding and gap, rounded-sm.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Change Text", e.g. "4.8%p". |
| `direction` | `"disabled" \| "flat" \| "up" \| "down"` | `up` | Figma "Direction" — the icon (TrendUp · TrendDown · Minus); Disabled is greyed out. |
| `directionLabel` | `string` | `LABELS[direction]` | Text read before the change for screen readers, since the direction is only an icon. |
| `tone` | `"positive" \| "negative" \| "neutral"` | `positive` | Figma "Tone" — the colour: positive (text/brand), negative (status/danger/strong), neutral. |

- 상수: `METRIC_TREND_DIRECTIONS`, `METRIC_TREND_TONES`
- 타입: `MetricTrendProps`, `MetricTrendDirection`, `MetricTrendTone`

## Navigation

### `Navigation`

**공개 컴포넌트**

LNB container from the Figma Navigation example (180:2023): padding p-5, colors/navigation/lnb/background, items m-1_5 apart. Width comes from the layout (240px in the Figma example).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `header` | `ReactNode` |  | Area above the menu (the Figma example's logo area), m-4 above the items. |

### `NavLink`

**보조 컴포넌트** — `Navigation` 안

Figma component set `item_link` (180:6174): a top-level page link. State Hover = :hover.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `icon` | `ReactNode` |  | Figma "Icon" (20px; the Figma placeholder is List). |
| `selected` | `boolean` | `false` | Figma Variant "Selected": the current page (`aria-current="page"`). |

### `NavGroup`

**보조 컴포넌트** — `Navigation` 안

Menu group: `item_parent` and, when expanded, its `item_child` list — indented p-4 with a 1px line (…/child/selected/indicator/selected) and m-2_5 to the items, as in the Figma LNB example.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `label` *(필수)* | `ReactNode` |  | Group label (Figma "Menu Text" of item_parent). |
| `children` | `ReactNode` |  | Figma "Menu Text". `NavChild` elements shown when expanded. |
| `className` | `string` |  |  |
| `defaultExpanded` | `boolean` | `false` | Initial state (uncontrolled). |
| `expanded` | `boolean` | `false` | Expanded (controlled). |
| `icon` | `ReactNode` |  | Figma "Icon" (20px; the Figma placeholder is List). |
| `onExpandedChange` | `((expanded: boolean) => void)` |  | Called when the group opens or closes. |

### `NavChild`

**보조 컴포넌트** — `NavGroup` 안

Figma component set `item_child` (180:6249): a second-level page link. State Hover = :hover.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `selected` | `boolean` | `false` | Figma Variant "Selected": the current page (`aria-current="page"`). |

### `NavParentItem`

⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 `NavGroup` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).

Figma component set `item_parent` (180:5246): the button of a menu group. State Hover = :hover.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Menu Text". |
| `expanded` | `boolean` | `false` | Figma "Expanded". |
| `icon` | `ReactNode` |  | Figma "Icon" (20px; the Figma placeholder is List). |

- 타입: `NavigationProps`, `NavLinkProps`, `NavGroupProps`, `NavChildProps`, `NavParentItemProps` *(내부 — 사용 금지)*

## Pagination

### `Pagination`

**공개 컴포넌트**

Figma component set `pagination` (132:871) built from `pagination_control` and `pagination_item`: previous, a window of page numbers (Figma shows five, the first current), next. Renders `<nav aria-label="페이지 이동">` with buttons; the current page has `aria-current="page"`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `totalPages` *(필수)* | `number` |  | Number of pages. |
| `defaultPage` | `number` | `1` | Initial page (uncontrolled). |
| `onPageChange` | `((page: number) => void)` |  | Called with the new page. |
| `page` | `number` |  | Current page, 1-based (controlled). |
| `shape` | `"square" \| "rounded"` | `square` |  |
| `size` | `"sm" \| "md" \| "lg"` | `sm` |  |
| `visiblePages` | `number` | `5` | How many page numbers are shown at once (a window around the current page). |

### `PaginationItem`

⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 `Pagination` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).

Figma component set `pagination_item` (132:520): one page number button.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `page` *(필수)* | `number` |  | Figma "Number". |
| `current` | `boolean` | `false` | Figma State "Current". |
| `shape` | `"square" \| "rounded"` | `square` |  |
| `size` | `"sm" \| "md" \| "lg"` | `sm` |  |

### `PaginationControl`

⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 `Pagination` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).

Figma component set `pagination_control` (132:604): previous / next page button.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `direction` *(필수)* | `"next" \| "previous"` |  | Figma "Direction". |
| `shape` | `"square" \| "rounded"` | `square` |  |
| `size` | `"sm" \| "md" \| "lg"` | `sm` |  |

- 상수: `PAGINATION_SIZES`, `PAGINATION_SHAPES`
- 타입: `PaginationProps`, `PaginationItemProps` *(내부 — 사용 금지)*, `PaginationControlProps` *(내부 — 사용 금지)*, `PaginationSize`, `PaginationShape`

## Progress

### `Progress`

**공개 컴포넌트**

Figma component `progress` (185:6518): a 6px track (border-radius/rounded-full, colors/progress/border/surface) with the bar (…/indicator) clipped by it. `value` between `minValue` and `maxValue` (0 – 100 by default); role="progressbar" and its values come from react-aria-components. Name it with `aria-label` or `aria-labelledby`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |
| `style` | `CSSProperties` |  |  |

- 타입: `ProgressProps`

## Radio

### `Radio`

**보조 컴포넌트** — `RadioGroup` 안

Figma component set `radio` (102:2677). Selection "Selected" = checked; State: Hover / Pressed are the native :hover / :active, Disabled = `disabled`. Renders a native `<input type="radio">` (arrow keys move between radios of the same name). Use inside `RadioGroup`, or standalone with `name` / `checked`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `value` *(필수)* | `string` |  | Value of this option (required inside a `RadioGroup`). |
| `className` | `string` |  | Class name of the root `<label>`. |
| `label` | `ReactNode` |  | Figma "Label" + "Label Text". Without a label, give the radio an `aria-label`. |
| `size` | `"sm" \| "md" \| "lg"` | `'sm'` | Figma "Size". Inside a `RadioGroup` the group size is the default. |
| `style` | `CSSProperties` |  | Style of the root `<label>`. |

### `RadioGroup`

**공개 컴포넌트**

Groups `Radio`s (role="radiogroup") and manages the selected value. Not a Figma component — semantic wrapper only; label it with `aria-label` or `aria-labelledby`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `defaultValue` | `string \| null` | `null` | Initially selected value (uncontrolled). |
| `disabled` | `boolean` |  | Disables every radio in the group. |
| `name` | `string` | `generated` | `name` of the radios (form submission and arrow-key grouping). |
| `onChange` | `((value: string) => void)` |  | Called with the newly selected value. |
| `orientation` | `"horizontal" \| "vertical"` | `vertical` | Stacking direction — items are 8px apart (16px in a row), Design System Rules 08. |
| `required` | `boolean` |  | Marks the choice as required (native validation). |
| `size` | `"sm" \| "md" \| "lg"` |  | Size applied to every radio that does not set its own. |
| `value` | `string \| null` |  | Selected value (controlled); `null` = nothing selected. |

- 타입: `RadioProps`, `RadioGroupProps`

## SearchField

### `SearchField`

**공개 컴포넌트**

Figma component set `search-field` (216:6570). State: Hover / Focus = :hover / :focus-within, Completed = has a value, Error = `invalid`, Disabled = `disabled`. The clear (X) button appears in Focus and Error as in Figma. Native input props and the ref go to the `<input type="search">`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `appearance` | `"solid" \| "outline"` | `outline` | Figma "Type" (Outline / Solid). |
| `className` | `string` |  | Class name of the root element. |
| `invalid` | `boolean` | `false` | Figma State "Error". |
| `label` | `ReactNode` |  | Figma "Label" + "Label Text". Without a label, pass `aria-label`. |
| `onClear` | `(() => void)` |  | Called after the clear button empties the field. |
| `onSearch` | `((value: string) => void)` |  | Called with the current value when Enter is pressed. |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | Figma "Size". |
| `style` | `CSSProperties` |  | Style of the root element. |

- 상수: `SEARCH_FIELD_APPEARANCES`
- 타입: `SearchFieldProps`, `SearchFieldAppearance`

## SegmentedControl

### `SegmentedControl`

**공개 컴포넌트**

Figma component set `segmented-control` (531:24471) with `segmented-item` (524:24397): one choice out of a few options. Items share the width equally (Figma: items fill the control). Built from native radios (role="radiogroup"): arrow keys move the selection, forms receive the value. Label the control with `aria-label` or `aria-labelledby`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `defaultValue` | `string \| null` | `null` | Initially selected item value (uncontrolled). |
| `disabled` | `boolean` |  | Disables every item (Figma State "Disabled"). |
| `name` | `string` | `generated` | `name` of the underlying radios (form submission). |
| `onChange` | `((value: string) => void)` |  | Called with the newly selected value. |
| `size` | `"xs" \| "sm" \| "md"` | `md` | Figma "Size". |
| `value` | `string \| null` |  | Selected item value (controlled). |

### `SegmentedControlItem`

**보조 컴포넌트** — `SegmentedControl` 안

One segment (Figma `segmented-item`). Variant Selected = the control's value; State Hover / Pressed are :hover / :active, Disabled = `disabled` here or on the control. Renders a visually hidden native radio.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Label". |
| `value` *(필수)* | `string` |  | Value of this item in the SegmentedControl. |
| `className` | `string` |  | Class name of the item `<label>`. |
| `style` | `CSSProperties` |  | Style of the item `<label>`. |

- 상수: `SEGMENTED_CONTROL_SIZES`
- 타입: `SegmentedControlProps`, `SegmentedControlItemProps`, `SegmentedControlSize`

## Select

### `Select`

**공개 컴포넌트**

Figma component set `select` (95:4740) with `listbox` (97:2665), `option` (97:2286) and `select_message` (95:2960). Keyboard, focus, typeahead and ARIA come from react-aria-components (button + listbox popover); all styles are the Figma variables. State: Hover = :hover, Open = list open, Completed = has a value, Error = `invalid`, Disabled = `disabled`, Read-only = `readOnly`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode \| ((item: T) => ReactNode)` |  | `SelectOption` elements, or a render function when `items` is given. |
| `aria-describedby` | `string` |  |  |
| `aria-label` | `string` |  |  |
| `aria-labelledby` | `string` |  |  |
| `autoFocus` | `boolean` |  |  |
| `className` | `string` |  | Class name of the root element. |
| `defaultOpen` | `boolean` |  | Initially open (uncontrolled). |
| `defaultValue` | `Key \| null` | `null` | Initially selected option id (uncontrolled). |
| `disabled` | `boolean` | `false` | Figma State "Disabled". |
| `disabledKeys` | `Iterable<Key>` |  | Option ids that cannot be selected. |
| `form` | `string` |  | Id of the form the hidden `<select>` belongs to. |
| `id` | `string` |  |  |
| `invalid` | `boolean` | `false` | Figma State "Error". |
| `items` | `Iterable<T>` |  | Data for dynamic options; `children` is then a function `(item) => <SelectOption id={…}>…</SelectOption>`. |
| `label` | `ReactNode` |  | Figma "Label" + "Label Text". Without a label, set `aria-label`. |
| `message` | `ReactNode` |  | Figma "Alert" + select_message text. |
| `messageType` | `"info" \| "success" \| "error"` | `'error' when invalid, otherwise 'info'` | Figma select_message "Type". |
| `name` | `string` |  | Form field name (renders a hidden native `<select>`). |
| `onChange` | `((value: Key \| null) => void)` |  | Called with the newly selected option id. |
| `onOpenChange` | `((open: boolean) => void)` |  | Called when the list opens or closes. |
| `open` | `boolean` |  | Figma State "Open" (controlled). |
| `placeholder` | `string` | `내용 선택` | Figma "Display Text" while nothing is selected. |
| `readOnly` | `boolean` | `false` | Figma State "Read-only": shows the value without the caret; the list does not open. |
| `required` | `boolean` |  | Requires a selection (native form validation through the hidden `<select>`). |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | Figma "Size". |
| `style` | `CSSProperties` |  | Style of the root element (e.g. its width — the list is as wide as the field). |
| `value` | `Key \| null` |  | Selected option id (controlled); `null` = nothing selected. |

### `SelectOption`

**보조 컴포넌트** — `Select` 안

Figma component set `option` (97:2286) — one choice of a `Select`; `id` identifies it in the Select value. State: Hover / Pressed = pointer hover / press (keyboard focus uses the Hover look), Selected = the Select value (semibold brand text + check icon), Disabled = `disabled`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Option Text". |
| `checkIcon` | `boolean` | `true` | Figma "Check Icon": the check after the text of the selected option. Off: the semibold brand text alone marks it. |
| `className` | `string` |  |  |
| `disabled` | `boolean` |  | Figma State "Disabled". |
| `style` | `CSSProperties` |  |  |

- 타입: `SelectProps`, `SelectOptionProps`

## Skeleton

### `Skeleton`

**공개 컴포넌트**

Figma component set `skeleton` (697:4486): a placeholder shape (colors/skeleton/background, border-radius/rounded; Circle rounded-xl) while content loads. Decorative — announce the loading state on the surrounding region (e.g. `DataState state="loading"`). Static, as in Figma (no animation).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `shape` | `"circle" \| "line" \| "shape4" \| "block"` | `line` | Figma "Shape": Line 60 × 8, Shape4 100 × 10, Block 140 × 12, Circle 24. Set `style` width / height to resize. |

- 상수: `SKELETON_SHAPES`
- 타입: `SkeletonProps`, `SkeletonShape`

## Slider

### `Slider`

**공개 컴포넌트**

Figma component set `slider` (391:1988) with `handle` (391:2013). Pointer, touch and keyboard (arrows, Page Up / Down, Home / End) come from react-aria-components; the optional number field (Figma "Show Input") is the Input component and commits on Enter or blur.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` |  | Accessible name — Figma shows no label, so one of `aria-label` / `aria-labelledby` is required. |
| `aria-labelledby` | `string` |  |  |
| `className` | `string` |  | Class name of the root element. |
| `defaultValue` | `number` | `minValue` | Initial value (uncontrolled). |
| `disabled` | `boolean` | `false` | Figma State "Disabled". |
| `formatOptions` | `NumberFormatOptions` |  | Number formatting of the range labels, value label and field. |
| `id` | `string` |  |  |
| `inputLabel` | `string` | `값 입력` | Accessible name of the number field. |
| `maxValue` | `number` | `100` | Largest value, shown at the right end of the range row. |
| `minValue` | `number` | `0` | Smallest value, shown at the left end of the range row. |
| `name` | `string` |  | Form field name (the slider's range input). |
| `onChange` | `((value: number) => void)` |  | Called continuously while the value changes. |
| `onChangeEnd` | `((value: number) => void)` |  | Called when the user finishes a change (pointer up, key press, input committed). |
| `showInput` | `boolean` | `true` | Figma "Show Input": number field next to the slider. |
| `step` | `number` | `1` | Step between values. |
| `style` | `CSSProperties` |  | Style of the root element (e.g. its width). |
| `unit` | `ReactNode` |  | Unit after the number field and in the value label (Figma "명"). |
| `value` | `number` |  | Current value (controlled). |
| `valueLabel` | `boolean` | `true` | Figma handle "Value Label": value tag above the handle on hover, drag and keyboard focus. |

- 타입: `SliderProps`

## Stepper

### `Stepper`

**공개 컴포넌트**

Figma component sets `stepper_horizontal` (179:2043) and `stepper_vertical` (203:3949): indicators joined by connectors; a connector is Completed after a completed step. Progress display only (not interactive).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `steps` *(필수)* | `StepperStep[]` |  | The steps, in order (Figma "Steps": 3 – 5). |
| `currentStep` | `number` | `0` | Index of the current step (0-based). Earlier steps are completed, later ones upcoming. |
| `orientation` | `"horizontal" \| "vertical"` | `horizontal` | Figma "Type". |

### `StepperIndicator`

⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 `Stepper` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).

Figma component sets `stepper_indicator_horizontal` (179:1621) and `stepper_indicator_vertical` (203:3708): 20px circle (number, CheckCircle when completed, WarningCircle on error) with label and sub label. The root is as wide (horizontal) or as tall (vertical) as the circle; the text overflows it centred, as in Figma.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `step` *(필수)* | `number` |  | Step number in the circle (Upcoming · Current · Locked). |
| `description` | `ReactNode` |  | Figma "Sub-Label Text" ("Sub-Label" on). |
| `label` | `ReactNode` |  | Figma "Label Text" ("Label" on). |
| `orientation` | `"horizontal" \| "vertical"` | `horizontal` | Figma set: stepper_indicator_horizontal (text under the circle) or _vertical (text beside it). |
| `status` | `"error" \| "current" \| "completed" \| "upcoming" \| "locked"` | `upcoming` | Figma "Variant". |

### `StepperConnector`

⚠️ **내부 부품 — 사용 금지**: 상위 컴포넌트 `Stepper` 안에서 그려집니다([public-api.md](./public-api.md#3-사용-금지--내부-api)).

Figma component sets `stepper_connector_horizontal` (179:1614) and `stepper_connector_vertical` (203:4253). The line is an SVG rect so it keeps the Figma geometry (1px centred on the band, i.e. on a half pixel).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `completed` | `boolean` | `false` | Figma "State" Completed. |
| `orientation` | `"horizontal" \| "vertical"` | `horizontal` | Figma "Type". |

- 상수: `STEPPER_ORIENTATIONS`, `STEPPER_STATUSES`
- 타입: `StepperProps`, `StepperStep`, `StepperIndicatorProps` *(내부 — 사용 금지)*, `StepperConnectorProps` *(내부 — 사용 금지)*, `StepperOrientation`, `StepperStatus`

## Switch

### `Switch`

**공개 컴포넌트**

Figma component set `switch` (107:409). Checked = `checked` / `defaultChecked`; State: Hover / Pressed are the native :hover / :active, Disabled = `disabled`. Renders `<input type="checkbox" role="switch">`; its props (name, checked, onChange, …) and the ref go to it. Space toggles it.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  | Class name of the root `<label>`. |
| `label` | `ReactNode` |  | Figma "Label" + "Label Text". Without a label, give the switch an `aria-label`. |
| `size` | `"sm" \| "md"` | `sm` | Figma "Size". |
| `style` | `CSSProperties` |  | Style of the root `<label>`. |

- 상수: `SWITCH_SIZES`
- 타입: `SwitchProps`, `SwitchSize`

## Table

### `Table`

**공개 컴포넌트**

Data table built from the Figma `table_header` (351:3452) and `table_body` (355:3739) cells, composed as in the Figma table_data example (react-aria-components Table: grid keyboard navigation, selection, sorting, row actions). Rows are clickable when `onRowAction` is set (Figma example Hover / Pressed).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

### `TableHeader`

**보조 컴포넌트** — `Table` 안

Header row of `TableColumn`s.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

### `TableColumn`

**보조 컴포넌트** — `TableHeader` 안

Figma `table_header` Type Text. "Filter" = `allowsSorting` (CaretUpDown; the sort order is announced with aria-sort, the icon turns …/icon/active while sorted), "Info" = `info`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Title". |
| `className` | `string` |  |  |
| `info` | `ReactNode` |  | Figma "Info": help text shown in a tooltip on the info icon. |
| `infoLabel` | `string` | `도움말` | Accessible name of the info icon. |

### `TableSelectionColumn`

**보조 컴포넌트** — `TableHeader` 안(다중 선택 표)

Figma `table_header` Type Checkbox: the select-all column (selectionMode="multiple").

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

### `TableEmptyColumn`

**보조 컴포넌트** — `TableHeader` 안(제목 없는 열)

Figma `table_header` Type Empty: a column without a visible title (e.g. for actions); name it with `aria-label`. The name is also inside the header cell as text for screen readers only, so the header is not empty for assistive technology (axe empty-table-header) while it stays blank on screen as in Figma.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` |  |  |
| `className` | `string` |  |  |

### `TableBody`

**보조 컴포넌트** — `Table` 안

Rows of the table; `renderEmptyState` shows e.g. an `EmptyState` when there are no rows.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

### `TableRow`

**보조 컴포넌트** — `TableBody` 안

A body row. Hover / Pressed backgrounds (Figma example) apply when the row has an action.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

### `TableCell`

**보조 컴포넌트** — `TableRow` 안

Figma `table_body` cell.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |
| `variant` | `"strong" \| "text"` | `text` | Figma `table_body` Type: Text (default) or Strong Text. Other types are their components inside the cell. |

### `TableSelectionCell`

**보조 컴포넌트** — `TableRow` 안(다중 선택 표)

Figma `table_body` Type Checkbox: the row selection cell.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

### `TableDragHandle`

**보조 컴포넌트** — `TableCell` 안(순서 변경 표)

Figma `table_body` Type Reorder: drag handle (List icon) for tables with `dragAndDropHooks`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` | `순서 이동` |  |

### `KeyValueTable`

**공개 컴포넌트**

Figma table_key-value (example 855:9118): `KeyValueItem`s in a two-column list (`<dl>`). Keys share one column (at least 160px), values fill the rest; only the first row has a top border.

### `KeyValueItem`

**보조 컴포넌트** — `KeyValueTable` 안

One row: Figma `table_key` (355:4193) + `table_value` (355:4460).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma `table_value` content: text (Type Text) or a component such as `Badge` (Type Badge). |
| `label` *(필수)* | `ReactNode` |  | Figma `table_key` "Title". |
| `disabled` | `boolean` | `false` | Figma `table_value_editable` State Disabled: the cell background (the controls inside take `disabled`). |
| `editable` | `boolean` | `false` | Figma `table_value_editable` (management mode) with a field — Input, Select, DatePicker (or two for a range): the field shows no frame until it is hovered or focused, so the value reads like text. |
| `keyProps` | `(Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & { [dataAttribute: `data-${string}`]: string; })` |  | Data attributes for the key cell (e.g. test ids). |
| `required` | `boolean` | `false` | Figma `table_key` Type Required: red dot after the label (and `requiredLabel` for screen readers). |
| `requiredLabel` | `string` | `필수` | Text read for the required dot. |
| `stack` | `boolean` | `false` | Stack the value content vertically, m-2 apart (Figma File Upload cell). |
| `unit` | `ReactNode` |  | Text after the value (Figma "단위", "Show unit"). |
| `valueProps` | `(Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & { [dataAttribute: `data-${string}`]: string; })` |  | Data attributes for the value cell. |

### `KeyValueGroup`

**보조 컴포넌트** — `KeyValueItem` 안(값 여러 개를 한 줄로)

A row of value content m-2 apart (e.g. a button and its hint, or chips and a reset button).

- 타입: `TableProps`, `TableHeaderProps`, `TableColumnProps`, `TableBodyProps`, `TableRowProps`, `TableCellProps`, `KeyValueTableProps`, `KeyValueItemProps`

## Tabs

### `Tabs`

**공개 컴포넌트**

Figma component sets `tab_filled` (91:5000) and `tab_line` (91:5241). Arrow keys move between tabs, Home / End jump to the ends (react-aria-components tablist pattern). State: Hover / Pressed = :hover / press, Selected = the selected tab, Disabled = `disabledKeys` or `Tab disabled`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | `TabList` and `TabPanel`s. |
| `appearance` | `"line" \| "filled"` | `line` | Figma set: `tab_filled` (filled) or `tab_line` (line). |
| `className` | `string` |  |  |
| `defaultSelectedKey` | `Key` |  | Initially selected tab id (uncontrolled). |
| `disabledKeys` | `Iterable<Key>` |  | Tab ids that cannot be selected (Figma State "Disabled"). |
| `keyboardActivation` | `"manual" \| "automatic"` | `'automatic'` | Activate a tab on focus (automatic) or on Enter / Space (manual). |
| `onSelectionChange` | `((key: Key) => void)` |  | Called with the newly selected tab id. |
| `selectedKey` | `Key` |  | Selected tab id (controlled). |
| `shape` | `"square" \| "rounded"` | `square` | Figma "Shape" (filled only). |
| `size` | `"sm" \| "md" \| "lg"` | `sm` | Figma "Size". |
| `style` | `CSSProperties` |  |  |
| `variant` | `"primary" \| "secondary"` | `primary` | Figma "Variant" — the Selected colour (Primary #004a38 · Secondary #007c56). |

### `TabList`

**보조 컴포넌트** — `Tabs` 안

The row of tabs. Figma defines no spacing between tabs, so they sit side by side.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

### `Tab`

**보조 컴포넌트** — `TabList` 안

One tab (Figma tab_filled / tab_line variant). `id` links it to its `TabPanel`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Label Text". |
| `className` | `string` |  |  |
| `disabled` | `boolean` |  | Figma State "Disabled". |

### `TabPanel`

**보조 컴포넌트** — `Tabs` 안

Content of a tab (not styled in Figma).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  |  |

- 상수: `TABS_APPEARANCES`, `TABS_VARIANTS`, `TABS_SIZES`, `TABS_SHAPES`
- 타입: `TabsProps`, `TabListProps`, `TabProps`, `TabPanelProps`, `TabsAppearance`, `TabsVariant`, `TabsSize`, `TabsShape`

## Textarea

### `Textarea`

**공개 컴포넌트**

Figma component set `textarea` (86:2597) with `textarea_message` (86:2733). The container is 100px high as in Figma; the text scrolls inside it. Native textarea props and the ref go to the `<textarea>`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `className` | `string` |  | Class name of the root element. |
| `invalid` | `boolean` | `false` | Figma State "Error". |
| `label` | `ReactNode` |  | Figma "Label" + "Label Text". |
| `message` | `ReactNode` |  | Figma "Alert" + "Alert Text" (textarea_message). |
| `messageType` | `"info" \| "success" \| "error"` | `'error' when invalid, otherwise 'info'` | Figma textarea_message "Type". |
| `showCount` | `boolean` | `true` | Figma "Counter": shows `current/maxLength` when `maxLength` is set. |
| `size` | `"sm" \| "md"` | `sm` | Figma "Size". |
| `style` | `CSSProperties` |  | Style of the root element. |

- 상수: `TEXTAREA_SIZES`
- 타입: `TextareaProps`, `TextareaSize`

## Toast

### `Toast`

**공개 컴포넌트**

Figma component set `toast` (91:5927) as a static element (e.g. inside a page). For notifications that appear and disappear use `<ToastRegion />` with `showToast()`.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactNode` |  | Figma "Alert Text". |
| `closeLabel` | `string` | `알림 닫기` | Accessible name of the close button. |
| `onClose` | `(() => void)` |  | Called by the close button. |
| `showClose` | `boolean` | `true` | Figma "Close Icon". |
| `status` | `"success" \| "error" \| "information"` | `information` | Figma "Status". |

### `ToastRegion`

**공개 컴포넌트**

Shows queued toasts (react-aria-components Toast — UNSTABLE in 1.22, wrapped here so the package API stays stable): a labelled region, each toast announced, timers paused while hovered or focused, close button dismisses.

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` | `알림` | Accessible name of the region. |
| `className` | `string` |  |  |
| `closeLabel` | `string` | `알림 닫기` | Accessible name of the close buttons. |
| `queue` | `ToastQueue<ToastContent>` | `new ToastQueue<ToastContent>({ maxVisibleToasts: 3 })` | Queue to show. |

- 함수: `showToast`, `closeToast`
- 타입: `ToastProps`, `ToastRegionProps`, `ToastContent`
- 기타 값: `toastQueue` *(내부 — 사용 금지)*

## Tooltip

### `Tooltip`

**공개 컴포넌트**

Figma component set `tooltip` (149:1111): a short label shown on hover and keyboard focus (react-aria-components TooltipTrigger: role="tooltip", aria-describedby on the trigger, Escape closes).

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `children` *(필수)* | `ReactElement<unknown, string \| JSXElementConstructor<any>>` |  | The element that shows the tooltip on hover and keyboard focus (must forward its ref and props, e.g. `Button`). |
| `content` *(필수)* | `ReactNode` |  | Figma "Message Text". |
| `className` | `string` |  | Class of the tooltip bubble. |
| `closeDelay` | `number` | `500` | Delay before hiding, in ms. |
| `defaultOpen` | `boolean` |  | Initial open state (uncontrolled). |
| `delay` | `number` | `500` | Hover delay before showing, in ms (keyboard focus shows it at once) — Design System Rules 05. |
| `disabled` | `boolean` |  | Disables the tooltip. |
| `onOpenChange` | `((open: boolean) => void)` |  | Called when the tooltip opens or closes. |
| `open` | `boolean` |  | Open state (controlled). |
| `placement` | `"bottom" \| "top" \| "left" \| "right"` | `top` | Figma "Placement": side of the trigger. Flips when there is no room. |
| `showArrow` | `boolean` | `true` | Figma "Arrow". |

- 상수: `TOOLTIP_PLACEMENTS`
- 타입: `TooltipProps`, `TooltipPlacement`

## 아이콘

Figma 아이콘 벡터(16 또는 32 그리드). Prop: `size`(기본 viewBox 크기) + SVG 속성. 색은 `currentColor`.

`CaretLeftIcon`, `CaretRightIcon`, `PlusIcon`, `XIcon`, `EyeIcon`, `MagnifyingGlassIcon`, `InfoFillIcon`, `CheckCircleFillIcon`, `XCircleFillIcon`, `CheckBoldIcon`, `MinusBoldIcon`, `CaretDownIcon`, `CaretUpIcon`, `CheckIcon`, `CalendarDotsIcon`, `UploadSimpleIcon`, `DownloadSimpleIcon`, `FileTextIcon`, `ArrowSquareOutIcon`, `FolderSimpleDashedIcon`, `HouseIcon`, `DotsThreeIcon`, `ListIcon`, `CheckCircleIcon`, `WarningCircleIcon`, `DatabaseIcon`, `InfoIcon`, `CaretUpDownIcon`, `NotePencilIcon`, `ArrowCounterClockwiseIcon`, `TrendUpIcon`, `TrendDownIcon`, `MinusIcon`, `LightningIcon`, `WarningIcon`

## 기타

- `IconProps` (type, `src/icons/createIcon.tsx`)
