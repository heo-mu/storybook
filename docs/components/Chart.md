# Chart — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Chart / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **chart**(698:4399, 24개 변형 = Type 3 × Style 2 × Group 2 × hover 2)와 **chart-legend-item**(697:4514),
**chart-tooltip**(693:9776)을 구현했습니다. 선 · 세로 막대 · 가로 막대 차트를 기본 스타일(축 이름, 값 눈금, 범례)과 간단 스타일(160px,
마지막 항목이 현재 기간)로 그리고, 두 스타일 모두 Figma `hover=yes` 상태(안내선 · 빈 원 / 강조 영역 · 툴팁)를 보여 줍니다.
그림은 컨테이너 너비에 맞춘 SVG이고, 같은 값을 화면 낭독기용 표로도 제공합니다.

## 사용 예

```tsx
import { Chart } from 'platform-design-system';

<Chart
  aria-label="동별 전력 사용량"
  type="bar-vertical"
  yAxisLabel="Y축: 전력 사용량 (kWh)"
  xAxisLabel="X축: 동별 구분"
  categories={['101동', '102동', '103동', '104동', '105동']}
  series={[
    { label: '조회 기간', data: [320, 265, 301, 305, 384] },
    { label: '이전 기간', data: [330, 273, 311, 314, 396] },
  ]}
/>

<Chart variant="simple" type="line" aria-label="월별 사용량"
  categories={['6월', '7월', '8월', '9월', '10월']}
  series={[{ label: '사용량', data: [148, 198, 136, 224, 184] }]} />
```

## Figma → Props

| Figma | 코드 | 비고 |
| --- | --- | --- |
| Type (Line · Bar Vertical · Bar Horizontal) | `type` (`line` · `bar-vertical` · `bar-horizontal`) | |
| Style (Default · Simple) | `variant` (`default` · `simple`) | |
| Group (no · yes) | `series` 1개 · 2개 | 두 번째가 비교 계열, 3개째부터는 무시 |
| Y Axis Label · X Axis Label | `yAxisLabel` · `xAxisLabel` | 기본 스타일 |
| 값 눈금(0–400, 0–240) | `ticks` | 없으면 0부터 4칸(1 · 1.5 · 2 · 2.5 · 3 · 4 · 5 · 6 · 8 × 10ⁿ 간격) |
| 카테고리 · 기간 이름 | `categories` | |
| hover (no · yes) — hover=yes가 그린 항목 | `activeIndex` · `defaultActiveIndex` · `onActiveIndexChange` | 포인터 · 탭 · 키보드로 바뀜, 두 스타일 모두 |
| "최고" 배지 | `maxLabel` | 선 차트 기본 스타일, `false`로 숨김 |
| chart-legend-item | `ChartLegendItem` (`type` line · dash-line · bar, `color`) | `Chart`가 범례를 직접 그림 — 별도 범례용. `color` 기본값: dash-line `02`, 나머지 `brand`(Figma 메인 컴포넌트) |
| chart-tooltip | `ChartTooltip` (`title`, `items`) | `Chart`가 직접 표시 — 별도 사용용. 계열 이름은 최소 40 · 최대 80px(Figma "Pressure label" min / max width, 2026-10-19 개편) — 더 길면 줄바꿈 |
| chart-legend-item Label Text · Type Line · Dash Line · Bar | `ChartLegendItem` children · `type="line" \| "dash-line" \| "bar"` | |

## 색 — Chart Component 토큰 (Figma 차트 토큰 개편, 2026-10-19 동기화)

모든 차트 노드가 Chart 전용 Component 변수에 바인딩되어 있습니다(Primitive → Semantic → Component). 세로 · 가로 막대는 같은 규칙,
범례 표시 · 툴팁 표시는 그 계열의 막대(그라디언트 시작) · 선 토큰을 그대로 씁니다.

| 역할 | Component 토큰 | 값 |
| --- | --- | --- |
| 막대 — 첫 계열 · 간단 스타일 현재 기간 | `colors/chart/bar/primary/gradient/start · end/default` | `chart/series/brand` · 같은 색 40% |
| 막대 — 비교 계열(Group=yes) · 간단 스타일 현재 기간 비교 | `colors/chart/bar/compare/gradient/start · end/default` | `chart/series/compare` · 40% |
| 막대 — 간단 스타일 지난 기간(첫 계열 · 비교) | `colors/chart/bar/history · history-compare/gradient/start · end/default` | `surface/overlay` · `surface/container` · 40% |
| 막대 — 계열 02 · 03 · 04(앞으로 쓸 계열) | `colors/chart/bar/02 · 03 · 04/gradient/start · end/default` | `chart/series/02 · 03 · 04` · 40% |
| 선 · 점 · 아래 면 — 첫 계열 / 두 번째 계열 | `colors/chart/line/primary/default` · `line/02/default` | `chart/series/brand` · `series/02` (간단 스타일 비교 선: 점선 3 / 3) |
| 선 — 비교 · 03 · 04 | `colors/chart/line/compare · 03 · 04/default` | `chart/series/compare · 03 · 04` |
| 점 테두리 · 호버 빈 원 안쪽 | `colors/chart/point/border/default` · `point/background/hover` | `border/inverse` · `surface/page` |
| 값 격자 · 축 기준선 · 간단 기준선 | `colors/chart/plot/grid/default` · `plot/axis/default` · `plot/baseline/default` | `border/gray-subtler` |
| 호버 안내선 · 호버 강조 영역 | `colors/chart/plot/guide/hover` · `plot/highlight/hover` | `border/gray` · `fill/transparent/hover` |
| 축 이름 · 눈금 · 항목 이름 / 범례 글자 | `colors/chart/label/default` / `label/legend/default` | `text/secondary` |
| 툴팁 배경 · 제목 · 계열 이름 · 값 | `colors/chart/tooltip/background · title · label · value/default` | `surface/page` · `text/tertiary` · `text/secondary` · `text/primary` |

그라디언트 끝 토큰은 Figma의 "투명도가 있는 별칭"(시작 색 40%)이며, CSS에서는 `color-mix(in srgb, var(시작 색) 40%, transparent)`로 생성됩니다.

막대는 값 쪽 끝의 계열 색에서 축 쪽 40%로 흐려지는 그라디언트, 한 계열 선 차트는 아래 면(계열 색 20% → 0%)이 있습니다.
(Figma 그라디언트의 끝 색은 변수에 묶으면 투명도를 잃어 값으로 남아 있습니다 — 시작 색과 같은 색의 40% · 0%.)
`ChartLegendItem` · `ChartTooltip`을 따로 쓸 때 그 표시에 맞는 토큰이 없는 색(예: 선 범례에 `compare`)은 Semantic 계열 색을 씁니다.

## 상호작용 · 접근성

- 그림 영역은 키보드로 초점을 받습니다(`role="group"`, 이름 `plotLabel`, 두 스타일 모두). ←/→(↑/↓)로 항목 이동,
  Home / End, Esc로 툴팁을 닫습니다. 이동한 항목의 값은 `aria-live` 영역으로 읽어 줍니다.
- 포인터를 올리면 가장 가까운 항목의 Figma hover=yes 표시가 보입니다 — 선: 점선 안내선 · 계열마다 빈 원, 막대: 강조 영역, 그리고 툴팁.
  감지 영역은 데이터 영역입니다: 기본 스타일 값 눈금 열(왼쪽 32px)과 가로 막대의 눈금 줄 위에서는 표시하지 않습니다.
- 터치: 탭하면 그 항목이 표시되고, 그림 영역 밖을 누르면 닫힙니다(손가락을 떼도 유지). 끌면 따라 움직입니다.
- 그림(SVG · 눈금 글자 · 범례 · 툴팁)은 보조 기술에서 숨기고, 모든 값을 표(`<table>`, 캡션 = `aria-label`)로 제공합니다.

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `CHAR-02` **호버 표시**: Figma `hover=yes` 변형 그대로입니다(강조 영역: 세로 막대 40 · 64px, 간단 48px / 가로 막대 32 · 46px, 간단 28px). 모든 항목에 같은 표시를 씁니다(Rules 02).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `CHAR-01` **툴팁 위치**: 툴팁은 자기 차트의 그림 영역 안에 그립니다. 선 · 가로 막대는 기준점(점 · 가장 긴 막대 끝)의 오른쪽 `p-3`(12px), 세로 막대는 항목 가운데에서 그림 영역 위쪽. **보이는 부분(그림 영역 ∩ 화면 · 스크롤 영역, 화면 가장자리에서 12px)** 안에 들어가지 않으면 왼쪽으로 뒤집고, 양쪽 모두 들어가지 않으면 여유가 큰 쪽에서 영역 안으로 옮깁니다. 보이는 부분이 툴팁보다 작으면 그림 영역 안에 둡니다 — 화면에 고정하지 않으므로 차트가 화면 밖으로 나가면 툴팁도 함께 나가고, 다른 차트 위에 남지 않습니다(Rules 05 · chart-tooltip 주석).
- `CHAR-03` **Hover 대상 · 입력**: 포인터에서 가장 가까운 항목(값 눈금 열 제외)을 강조합니다. 터치는 탭으로 고정하고 바깥을 누르면 해제, 키보드는 ← → · Home · End · Esc(Rules 07 · chart 주석).
- `CHAR-05` **값 범위**: 0 이상 값만 지원합니다. 눈금 범위를 벗어나는 값은 범위 끝에 그립니다. 간단 스타일은 가장 큰 값을 위(세로) · 트랙의 90%(가로, Figma 224 → 280px 중 252px)에 둡니다(Rules 07).
- `CHAR-06` **숨김 레이어**: 간단 스타일의 "Current values"(현재 값 칩)와 가로 막대의 "Axis unit"은 Figma에서 숨김이며 명세가 아니므로 구현하지 않습니다(Rules 07 · chart 주석).
- `CHAR-07` **포커스**: 키보드 포커스일 때 그림 영역 바깥 2px에 2px `colors/border/focus` 링(Design System Rules 02 — 차트에는 Figma `Focus` 속성이 없어 규칙이 기준).

### 개발 구현 세부 사항

디자인 컴포넌트에 넣지 않는 기술 구현입니다(Design System Rules 10).

- `CHAR-04` **간단 선 차트의 점 · 선**: Figma 샘플 점은 기간 이름 가운데에 있지 않습니다(F64). 코드는 각 기간 가운데에 두고, 선은 첫 · 마지막 구간의 기울기로 양 끝까지 이어 그립니다.
- `CHAR-08` **툴팁 렌더링**: 툴팁은 포털 없이 그림 영역 안에 `position: absolute`(z-index 1)로 그려 스크롤 · 레이아웃 변화 · transform에 차트와 함께 움직입니다. 열려 있는 동안 스크롤 · 창 크기 변경 때 보이는 부분만 다시 계산합니다(`overflow`가 있는 조상과 화면). 각 차트의 상태는 독립적이며 다른 차트와 툴팁을 공유하지 않습니다(2026-10-19 — 이전의 `<body>` 포털은 화면 밖 차트의 툴팁이 화면 가장자리에 남는 문제가 있었음).

## Props

### ChartLegendItem

### ChartTooltip

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc(Storybook Props 표)을 한국어 사용 설명으로 바꾸면서 옮긴 기술 정보입니다.

- `ChartLegendItem`(chart-legend-item 697:4514): 표시와 글자 사이 `m-1_5`, 글자 `xs/leading-normal/normal` · `colors/chart/legend/label/default`.
  표시는 `line` 선, `dash-line` 점선(5 / 3), `bar` 12px 네모이며 색은 `bar`가 `colors/chart/bar/*`, 선이 `colors/chart/line/*`입니다.
  `color` 기본값은 `dash-line`이 `02`(Figma: `colors/chart/line/compare`), 나머지가 `brand`입니다. 글자는 Figma "Label"입니다.
- `ChartTooltip`(chart-tooltip 693:9776): 제목(xs) 아래 표시 · 계열 이름 · 값 행. padding `p-2_5`, 제목과 행 사이 `m-1_5`, 행 사이 `m-1`,
  배경 `alpha/white/800`, `rounded-sm`, `elevation-3`. `title`은 Figma "Time", 행의 `label`은 "Pressure label", `color`는 "Indicator"입니다.
- `CHART_COLORS`는 Figma 차트 부품이 쓰는 계열 색 `colors/chart/series/{brand, compare, 02}`와 `colors/chart/simple/{history, history-compare}`에 대응합니다.
- `CHART_TYPES` · `CHART_VARIANTS` · `CHART_LEGEND_TYPES`는 Figma chart "Type" · "Style", chart-legend-item "Type" 값입니다.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Chart.showcase.stories.tsx / Figma`: The 24 Figma variants with the Figma sample data (hover=yes: the active category drawn in Figma).
- `Chart.showcase.stories.tsx / FigmaParts`: chart-legend-item (3 variants, Figma sample label "유형" since the 2026-10-19 chart rework) and chart-tooltip on their own.
- `Chart.showcase.stories.tsx / SimpleInteraction`: Simple style: the plot takes focus too (Figma hover=yes) — arrow keys show the highlight and the tooltip.
- `Chart.showcase.stories.tsx / TooltipLabelWidth`: Series names in the tooltip are at least 40 and at most 80px wide (Figma "Pressure label" min / max width): a short name keeps the 40px column, a longer one wraps, and the values stay in one column.
- `Chart.showcase.stories.tsx / TooltipInClippingContainer`: Inside a container that clips its content (overflow: hidden) the tooltip stays in the part that can be seen: it belongs to its chart (no portal) and is placed inside the visible part of the plot (Design System Rules 05).
