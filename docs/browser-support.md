# 브라우저 지원과 Fallback — Button

`src/components/Button/Button.css`가 사용하는 CSS 기능과 엔진별 실제 측정 결과입니다.
목표는 **Figma와의 픽셀 정합성을 유지하면서, 특정 브라우저가 없어도 깨지지 않는 것**입니다.

- 지원 정보: MDN browser-compat-data (2026-10-16 기준)
- 측정: Playwright로 Chromium 156, Firefox 157, WebKit 27.2(Windows)에서 296개 Variant 전부를
  `npm run verify:button -- --browser=<engine>`으로 Figma 사양과 비교

## 측정 결과

| 항목 | Chromium 156 | Firefox 157 | WebKit 27.2 |
| --- | --- | --- | --- |
| 높이 · padding · gap · radius · 테두리 · 색 · 타이포그래피 | 296/296 일치 | 296/296 일치 | 296/296 일치 |
| 버튼 너비 (텍스트 포함 Variant) | Figma와 동일 (80 / 88 / 101 / 114px) | 1px 미만 좁음 (예: 79.10px) | 1px 미만 좁음 (예: 79.13px) |
| 라벨 글자 위치 (Figma 대비) | 가로 ≤ 0.33px, 세로 ≤ 0.12px | 가로 ≤ 0.70px, 세로 ≤ 0.09px | 가로 ≤ 0.60px, 세로 ≤ 0.09px |
| 실제 마우스 Default / Hover / Pressed | 27/27 | 27/27 | 27/27 |
| IconButton (텍스트 없음) | 120/120 | 120/120 | 120/120 |

Firefox·WebKit의 차이는 아래 `calc-size()` 한 가지가 원인이며 모두 1px 미만입니다.

## 사용한 CSS 기능

| 기능 | 용도 | Chrome / Edge | Firefox | Safari | 미지원 시 동작 |
| --- | --- | --- | --- | --- | --- |
| `calc-size(fit-content, round(up, size, 1px))` | 라벨 너비를 Figma처럼 정수 px로 올림 | 129+ | 미지원 | 미지원 | `@supports`로 감싸 선언 자체를 건너뜀 → 자연 너비(1px 미만 좁음) |
| `round()` | 위 `calc-size` 안에서만 사용 | 125+ | 118+ | 15.4+ | — |
| `-webkit-user-select` / `user-select` | 버튼 라벨 드래그 선택 방지 | 54+ | 69+ | 접두사만 지원 → `-webkit-` 병기 | 텍스트 선택 가능(시각 영향 없음) |
| `-webkit-tap-highlight-color` | 모바일 탭 하이라이트 제거 | 지원 | 무시 | iOS 지원 | 무시됨(시각 영향 없음) |
| Flexbox `gap`, CSS Variables, `inset box-shadow`, `:hover` `:active` `:disabled` | 레이아웃 · 토큰 · 테두리 · 상태 | 지원 | 지원 | 지원 | — |

## 엔진 의존 보정 두 가지

### 1. 라벨 너비 — `calc-size()` (점진적 향상)

Figma의 auto-width 텍스트 상자는 정수 px입니다("라벨명" 12px → 32px, 14px → 37px, 16px → 42px).
브라우저는 실제 글자 폭(31.13px)을 그대로 쓰므로, `calc-size()`로 올림해야 버튼 너비가 Figma와 같아집니다.

- 지원 엔진(Chromium): Figma와 완전히 같은 너비.
- 미지원 엔진(Firefox, Safari): `@supports`가 거짓이라 규칙이 적용되지 않고 자연 너비로 그려집니다.
  버튼 너비, 오른쪽 아이콘 위치, 가운데 정렬된 글자가 1px 미만 차이 납니다. 높이·색·간격은 동일합니다.
- 다른 방법을 쓰지 않은 이유: CSS만으로 글자 폭을 올림하는 다른 방법은 없고, JS로 측정해 보정하면
  모든 버튼에서 레이아웃 측정(reflow)과 폰트 로드 후 재계산이 필요해집니다. 1px 미만 차이를 위해 런타임 의존성을 추가하지 않았습니다.
  Firefox·Safari가 `calc-size()`를 지원하면 코드 변경 없이 자동으로 Figma와 같아집니다.

### 2. lg 라벨 기준선 — `padding-top: 1px` + `line-height: 23px`

16px / 24px 텍스트는 위아래 여백(half-leading)이 2.5px입니다. Chromium은 폰트 지표를 정수로 반올림한 뒤
이 0.5px를 내려 글자를 Figma보다 1px 위에 그립니다. 같은 24px 줄 상자를 1px + 23px로 나누면 기준선이 정수 위치가 됩니다.

| 엔진 | 보정 없음 | 보정 적용 |
| --- | --- | --- |
| Chromium 156 | 세로 −1.04px | −0.04px |
| Firefox 157 | +0.01px | +0.01px |
| WebKit 27.2 | +0.08px | +0.08px |

Firefox·WebKit에서는 결과가 같으므로(중립) 모든 엔진에 그대로 적용합니다. 라벨 상자 크기(24px)는 변하지 않습니다.

## 입력 필드 (Input · Textarea · Search Field)

`node scripts/verify-figma.mjs <input|textarea|search-field> --browser=…` 결과: 세 엔진 모두 전 Variant 통과(Input 21, Textarea 14, Search Field 36).

- **WebKit 검색 입력**: `type="search"`에 WebKit 자체 지우기 버튼(⌫)과 검색 상자 스타일이 그려져, `::-webkit-search-*` 의사 요소를 `display: none`으로 숨기고 입력에 `appearance: none`을 지정했습니다.
- **기준선 보정**: 한 줄 값 텍스트 md(16/24px)는 Button lg와 같은 1px 패딩 + 23px 줄 높이, lg(18/28px)는 27px 줄 높이 + 아래 1px 패딩
  (Firefox · WebKit이 1px 아래에 그리던 것을 보정, Chromium은 변화 없음). Textarea md는 여러 줄이므로 위 0.5px 패딩만 사용합니다.
- 라벨 · 메시지 텍스트 너비는 Button 라벨과 같은 `calc-size()` 점진적 향상입니다.
- 비기준 엔진(Firefox · WebKit)의 1px 미만 글리프 가로 차이는 글자 래스터화 차이로 기록만 하고 실패로 보지 않습니다(Chromium 기준 0.5px).

## 선택 컨트롤 (Checkbox · Radio · Switch · Select)

세 엔진 모두 전 Variant 통과(Checkbox 36, Radio 24, Switch 16, Select 21 · listbox 3 · option 15 · select_message 3).

- 컨트롤은 네이티브 `<input>`에 `appearance: none`을 지정해 그립니다 — 세 엔진 모두 지원, 포커스 링도 브라우저 기본.
- 라벨 너비가 내용에 맞춰지는 루트(Checkbox · Radio · Switch)는 `calc-size()`가 없는 Firefox · WebKit에서 1px 미만 좁습니다(Button과 같은 fallback).
- **listbox 스크롤 표시**: Chromium · Safari는 `::-webkit-scrollbar`(4px, 둥근 막대, 토큰 색), Firefox는
  `@supports not selector(::-webkit-scrollbar)`로 `scrollbar-width: thin` + `scrollbar-color`(두께는 브라우저가 결정).
  macOS의 "스크롤 막대 자동 숨김" 설정에서는 스크롤할 때만 보입니다.
- 목록 테두리는 `outline` + 음수 `outline-offset`(스크롤된 옵션이 테두리를 덮지 않도록) — 둥근 모서리를 따르는 outline은 Chrome 94+, Firefox 88+, Safari 16.4+.
- option md Disabled의 밑줄: Figma가 offset · 두께를 auto로 두어 엔진 폰트 지표를 따르며, Figma보다 약 1.5px 위에 그려집니다(렌더링 차이로 기록).

## Slider · Segmented Control · Chip

세 엔진 모두 전 Variant 통과(Slider 2 · handle 5, Segmented Control 3 · item 18, Chip 24 · 12 · 48).

- 너비가 라벨에 맞춰지는 칩은 `calc-size()`가 없는 Firefox · WebKit에서 1px 미만 좁아 라벨 오른쪽(아이콘 · 끝 곡선)이 그만큼 당겨집니다.
  검증기는 이 경우의 픽셀 차이(5% 이하)를 fallback 기록으로 남기고, 색 · 모양은 Chromium에서 엄격히 비교합니다.
- Chip · InputChip의 1px 테두리는 테두리 색 배경 레이어(border-box) 위에 채움 레이어(padding-box)를 겹쳐 그립니다.
  inset 그림자로 그리면 둥근 가장자리가 두 번 합성되어 채움과 테두리 색이 같은 Selected 칩의 가장자리가 Figma보다 진해집니다(세 엔진 공통).
- Slider 핸들의 Pressed 원은 `color-mix(in srgb, …)`(Chrome 111+, Firefox 113+, Safari 16.2+)로 핸들 색 20%를 만듭니다.
- Segmented Control은 `inline-grid` + `grid-auto-columns: 1fr`로 항목 너비를 같게 맞춥니다.

## Date Picker · File Uploader · Loading

세 엔진 모두 전 Variant 통과(Date Picker 트리거 21 · 메시지 3 · 달력 1 · 날짜 7 · 이동 8, File Uploader 5 · 항목 3, Loading 2).

- 달력 제목(18 / 28px)은 lg 필드 값과 같은 27px 줄 높이 + 아래 1px 보정(Firefox · WebKit이 1px 아래에 그리던 것).
- 달력 그리드는 `<table>` 그대로 `border-spacing`으로 간격을 만들어 표 시맨틱(react-aria grid)을 유지합니다.
- Loading 스피너: `conic-gradient` + SVG 마스크(`mask` / `-webkit-mask`), 중간 정지점은 `color-mix()`(Chrome 111+, Firefox 113+, Safari 16.2+).
- File Uploader 점선: SVG `<rect>`의 `x` · `y` · `width` · `height` · `rx`를 CSS로 지정(SVG 2 기하 속성 — 세 엔진에서 동작 확인).

## Link · Tabs · Pagination · Dropdown Menu · Breadcrumb · Navigation · Stepper

세 엔진 모두 전 Variant 통과(Link 15, Tabs 90, Pagination 75, Dropdown Menu 항목 5 · 구분선 1, Breadcrumb 6 + 항목 12, Navigation 4 + 4 + 4, Stepper 20).

- Link md(14px, 행간 140%)의 줄 높이는 `round(up, …, 1px)`로 Figma와 같은 20px(Chrome 125+, Firefox 118+, Safari 15.4+).
- Link lg 밑줄: Figma AUTO 밑줄이 브라우저보다 약 1.5px 아래 — 알려진 렌더링 차이(글자 위치는 일치).
- Breadcrumb: 라벨 너비를 `calc-size()`로 올림하므로 Firefox · Safari에서는 라벨마다 1px 미만 좁아지고, 한 줄에 라벨이 여럿이면
  누적됩니다(md Full 433 → 431.8px). 검증 설정 `accumulatedFallback`은 앞선 라벨 수만큼(라벨당 1px) 허용하고 기록합니다.
- Navigation 1뎁스 라벨(16 / 24)은 Button lg와 같은 기준선 보정(1px + 23px)을 씁니다.
- 반 픽셀 선(Stepper 연결선, Navigation 하위 목록 선): CSS 배경 · 그라데이션은 엔진이 정수 픽셀로 맞추고,
  `transform`은 Firefox에서 맞춰지므로, SVG `<rect>`(`x` · `y` · `width` · `height` CSS 속성)로 그립니다 — 세 엔진 모두
  Figma와 같은 50% 두 줄.
- Dropdown Menu 구분선은 1px 배경 그라데이션(테두리 대신)이라 엔진마다 같은 픽셀 행에 그려집니다.

## Badge

세 엔진 모두 전 Variant 통과(badge_status 84 · badge_dot 21 · badge_count 14).

- Outline 1px 안쪽 테두리(inset box-shadow)의 모서리 안티에일리어싱은 Figma와 엔진마다 다릅니다(border · outline · 배경 겹침도 측정했지만
  어느 것도 세 엔진 모두 Figma와 같지 않음). 작은 배지에서는 이 몇 픽셀이 0.5% 기준을 넘어, Outline 변형의 모서리(4px)와
  Rounded의 둥근 끝만 픽셀 비교에서 빼고(`maskRectsFor`) 곧은 테두리는 그대로 비교합니다.
- sm 점(3px)은 세로 8.5px 위치(가운데 정렬)이지만 세 엔진 모두 Figma와 같은 픽셀로 그려집니다.

## Badge 이후 (Progress · Alert · Toast · Tooltip · Empty State · Accordion · Dialog)

세 엔진 모두 전 Variant 통과. 엔진 차이로 기록한 항목:

- Tooltip: 트리거 너비가 소수점이면 말풍선 위치도 소수점이 되어 검증 하네스에서 트리거 너비를 정수로 고정(`harnessCss`).
- Accordion: 14px 한글의 글자 위치는 같고 안티에일리어싱 농도만 달라 글자 중심 허용치를 1px로 둠(`glyphDxTolerance`).
- Dialog(WebKit): calc-size가 없어 가운데 정렬된 제목 상자가 Figma보다 좁아 제목 글자 중심이 약 1.1px 차이(`knownDifferences`).
- Accordion 구분선: Figma 선(LINE)은 y 아래 줄이 아니라 위 줄(트리거 마지막 줄)에 그려지므로 트리거의 `::after`로 그립니다.

## 검증하지 못한 환경

- 실제 macOS / iOS Safari, macOS Firefox, Android 브라우저 — Playwright WebKit은 같은 엔진이지만 운영체제의 글꼴 렌더러가 다릅니다.
- iOS Safari는 터치 이벤트 리스너가 없는 요소에 `:active`를 적용하지 않는 동작이 알려져 있습니다. Pressed 상태를 실기기에서 확인하지 않았습니다.

## 다시 측정하기

```bash
npx playwright install firefox webkit     # 최초 1회
npm run storybook                         # 다른 터미널
npm run verify:button                     # Chromium (기준)
npm run verify:button -- --browser=firefox
npm run verify:button -- --browser=webkit
```

`calc-size()`가 없는 엔진에서는 너비 관련 1px 미만 차이를 "known sub-pixel fallback"으로 따로 표시하고,
그보다 큰 차이나 다른 항목의 차이는 실패로 처리합니다.
