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
