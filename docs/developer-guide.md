# 개발자 가이드 — platform-design-system

Figma **[Platform] Web Design System**(`Ry3WecA6sP6lKPop1vXrTp`, 페이지 `🔵 Ver 0.4`)을 구현한 React 컴포넌트 라이브러리입니다.
프론트엔드 개발팀이 패키지를 설치 · 사용 · 갱신하는 데 필요한 내용을 모았습니다.

| 문서 | 내용 |
| --- | --- |
| 이 문서 | 기술 스택 · 구조 · 설치 · Storybook · 토큰 · 브라우저 · 버전 관리 · Storybook MCP |
| [public-api.md](./public-api.md) | **쓸 것과 쓰지 말 것** — 공개 컴포넌트 49 · 보조 컴포넌트 32 · 사용 금지 내부 API(자동 생성) |
| [api.md](./api.md) | 전체 Public API(컴포넌트 Props · 상수 · 타입 · 아이콘, 분류 표시) — 소스에서 자동 생성 |
| [release-checklist.md](./release-checklist.md) | 배포 전 체크리스트 |
| [breaking-changes.md](./breaking-changes.md) | 2026-10-19 변경의 호환성 분석 · 버전 정책 제안 |
| [figma-fix-requests.md](./figma-fix-requests.md) | Figma 원본 수정 요청(노드 · 변수 ID) |
| [usage.md](./usage.md) | 외부 프로젝트 설치 상세 · 문제 해결 |
| [component-inventory.md](./component-inventory.md) | Figma 컴포넌트 ↔ React 컴포넌트 대응 · 상태 |
| [browser-support.md](./browser-support.md) | 엔진별 측정 결과 · Fallback |
| [accessibility.md](./accessibility.md) | 컴포넌트별 키보드 · 화면 낭독기 동작 |
| [figma-issue-triage.md](./figma-issue-triage.md) | Figma 이슈 분류(디자인 결정 · 개발 개선 · 허용 차이) |

## 1. 기술 스택과 프로젝트 구조

| 영역 | 사용 기술 |
| --- | --- |
| UI | React 19(peer: React 18.2 이상 또는 19), TypeScript 6 |
| 접근성 동작 | react-aria-components 1.22(스타일 없는 키보드 · 포커스 · ARIA — Select, DatePicker, Tabs, Dialog, Tooltip 등) |
| 날짜 | @internationalized/date |
| 글꼴 | Pretendard Variable(`pretendard` 패키지, `fonts.css`) |
| 스타일 | 일반 CSS + CSS Variables(디자인 토큰). CSS-in-JS 없음, 클래스 접두사 `ds-` |
| 빌드 | Vite 8 라이브러리 모드(ESM `dist/index.js` · CJS `dist/index.cjs` · `dist/styles.css` · `.d.ts`) |
| 문서 · 개발 환경 | Storybook 10.6(react-vite, addon-docs · a11y · vitest · mcp · pseudo-states) |
| 테스트 | Vitest 5 + Playwright(Chromium)로 스토리 실행(`play` 함수), axe-core 접근성 감사 |
| Figma 정합성 검증 | Playwright(Chromium · Firefox · WebKit) + pixelmatch — 크기 · 위치 · 픽셀 · 글자 위치를 Figma와 비교 |
| 린트 | oxlint |

```
platform-design-system/
├─ src/
│  ├─ index.ts                     # Public API (모든 export) — build-entry.ts가 styles.css와 함께 번들
│  ├─ styles.css                   # 토큰 + 모든 컴포넌트 CSS (@import)
│  ├─ tokens/                      # 디자인 토큰 CSS · tokens.json — 자동 생성, 직접 수정 금지
│  ├─ icons/                       # Figma 아이콘 벡터 (createIcon)
│  ├─ utils/                       # cx, useControllableState 등 내부 유틸
│  ├─ storybook/                   # 스토리 전용 도우미(FigmaMatrix, pseudo 상태) — 패키지에 포함 안 됨
│  └─ components/<Name>/
│     ├─ <Name>.tsx                # 컴포넌트 (forwardRef, Props 타입, JSDoc = 문서)
│     ├─ <Name>.css                # 스타일 (토큰만 사용, 머리 주석에 Figma 값 기록)
│     ├─ <Name>.options.ts         # Figma Variant 값 배열 · 유니온 타입 (예: BUTTON_SIZES)
│     ├─ <Name>.stories.tsx        # 사용 예 스토리 — Storybook MCP 매니페스트에 포함
│     ├─ <Name>.mdx                # Usage 문서 (Figma → Props 표, 코드 정책, 접근성)
│     ├─ stories/<Name>.showcase.stories.tsx   # Figma 검증 · 테스트 스토리 (`!manifest`)
│     └─ index.ts
├─ figma-pending/                  # Figma 등록 대기 토큰(결정된 값, 스냅샷 · 체크섬 밖) — 5절
├─ figma/                          # Figma에서 읽어 온 읽기 전용 자료
│  ├─ variables/ · styles/         # 토큰 스냅샷 (토큰 생성의 원본)
│  ├─ geometry/ · reference/       # 변형별 레이어 위치 · 크기, 기준 스크린샷
│  ├─ verify/<component>.json      # 정합성 검증 설정
│  └─ metadata/                    # 섹션 구조 (변형 위치)
├─ scripts/                        # 토큰 생성, 정합성 검증, 접근성 감사, API 문서 생성
├─ docs/                           # 문서
└─ .storybook/                     # Storybook 설정
```

## 2. 컴포넌트 목록과 Public API

**어떤 컴포넌트를 써야 하는지는 [public-api.md](./public-api.md)**, 전체 Props · 타입 · 상수 · 아이콘은 [api.md](./api.md)에 있습니다(둘 다 자동 생성).
컴포넌트는 모두 `ref`를 실제 DOM 요소로 전달하고, 문서화된 Prop 외의 HTML 속성(`className`, `style`, `aria-*`, `data-*`, 이벤트)을 그대로 넘깁니다.

`src/index.ts`의 export 308개는 다음처럼 나뉩니다(분류표: `scripts/generate-api-docs.mjs` 맨 위 — 분류하지 않은 컴포넌트 export는 문서 생성이 실패).

| 분류 | 개수 | 쓰는 법 |
| --- | ---: | --- |
| 공개 컴포넌트 | 49 | 화면에 바로 배치 |
| 보조 컴포넌트 | 32 | 정해진 상위 컴포넌트 안에서 조합(`SelectOption`, `TabList`, `TableRow` …) |
| 타입 · 상수 · 함수 · 아이콘 | 125 · 45 · 2 · 35 | Props 타입, Figma 속성 값 목록, `showToast` · `closeToast`, 아이콘 |
| **내부 부품 — 사용 금지** | 7 | `PaginationItem` · `PaginationControl` · `BreadcrumbItem` · `BreadcrumbSeparator` · `StepperIndicator` · `StepperConnector` · `NavParentItem` — 상위 컴포넌트를 씁니다 |
| **내부 API — 사용 금지** | 13 | `toastQueue`, `resolveAppearance`, `BUTTON_STATES` · `BUTTON_TONES`, 보조 Props 타입 등 — JSDoc `@internal` |

| 분류 | 컴포넌트 (하위 부품) |
| --- | --- |
| 버튼 | `Button` · `IconButton` · `TextButton` |
| 입력 | `Input` · `Textarea` · `SearchField` · `Select`(`SelectOption`) · `Checkbox` · `CheckboxGroup` · `RadioGroup`(`Radio`) · `Switch` · `Slider` · `SegmentedControl`(`SegmentedControlItem`) · `Chip` · `InputChip` · `FilterChip` · `DatePicker` · `Calendar` · `FileUploader`(`FileUploaderItem`, `ImageUploadPreview`) |
| 탐색 | `Link` · `Navigation`(`NavLink` · `NavGroup` · `NavChild`) · `Tabs`(`TabList` · `Tab` · `TabPanel`) · `Pagination` · `Breadcrumb` · `Stepper` · `DropdownMenu`(`DropdownMenuItem` · `DropdownMenuSection` · `DropdownMenuSeparator`) |
| 피드백 · 오버레이 | `Badge` · `BadgeDot` · `BadgeCount` · `Progress` · `Loading` · `Alert` · `Toast` · `ToastRegion` + `showToast()` · `closeToast()` · `Tooltip` · `EmptyState` · `Dialog` · `Accordion` · `AccordionItem` |
| 데이터 | `Table`(Header · Column · Body · Row · Cell …) · `KeyValueTable`(`KeyValueItem` · `KeyValueGroup` · `ImageUploadPreview`) · `Card`(Header · Content · Footer) · `Chart`(직접 만드는 범례 · 툴팁용 `ChartLegendItem` · `ChartTooltip`) |
| 대시보드 | `MetricCard` · `MetricTrend` · `DataFreshness` · `DataState` · `Skeleton` · `DashboardFilterBar`(`DashboardFilterGroup` · `DashboardFilterRange`) |
| 아이콘 | `CaretDownIcon` 등 Figma 아이콘 컴포넌트(`size`, `currentColor`) |

API 규칙

- Figma 속성 → Prop: Variant 값은 소문자(`Size=xs` → `size="xs"`), State Hover · Pressed는 실제 `:hover` · `:active`, Disabled는 `disabled`.
- Figma에 없는 조합은 타입에서 막습니다. Button은 2026-10-19 동기화로 Variant × Appearance 6개 조합이 모두 있습니다 — `appearance`를 생략하면
  Secondary는 Outline(이전과 같음), 나머지는 Solid입니다.
- Variant 값 배열(`*_SIZES`, `CHART_TYPES` …)과 유니온 타입이 함께 export 됩니다.
- 열림 · 선택 등 상태는 제어(`value`/`open`/`activeIndex` + `on…Change`)와 비제어(`default…`)를 모두 지원합니다.
- 보이는 라벨이 없는 컨트롤(IconButton, 필터 바 안의 Select 등)은 `aria-label`이 필요합니다.

API 문서 다시 만들기: `npm run docs:api` (Props의 JSDoc 주석이 설명이 됩니다 — 주석을 고친 뒤 실행).

## 3. 패키지 설치와 사용

아직 레지스트리에 배포하지 않았습니다(`package.json`의 `"private": true`). 패키지 파일로 설치합니다.

```bash
# 디자인 시스템 저장소
npm ci
npm run build           # 토큰 생성 → 타입 검사 → dist/
npm pack                # → platform-design-system-0.1.0.tgz

# 사용하는 프로젝트
npm install ./platform-design-system-0.1.0.tgz
```

```tsx
// 앱 진입점에서 한 번
import 'platform-design-system/fonts.css';   // Pretendard Variable (이미 로드한다면 생략)
import 'platform-design-system/styles.css';  // 토큰 + 컴포넌트 스타일 (필수)

import { Button, MetricCard, MetricTrend } from 'platform-design-system';

export function Summary() {
  return (
    <MetricCard
      title="누적 전력 사용량"
      value="1,248"
      unit="kWh"
      trend={<MetricTrend direction="down" tone="positive">4.8%p</MetricTrend>}
      comparison="이전 7일 대비"
    />
  );
}
```

| 경로 | 내용 |
| --- | --- |
| `platform-design-system` | 컴포넌트 · 상수 · 타입(ESM + CJS + `.d.ts`) |
| `platform-design-system/styles.css` | 모든 토큰 + 컴포넌트 스타일 |
| `platform-design-system/fonts.css` | Pretendard Variable |
| `platform-design-system/tokens.css` · `tokens/tokens.json` | 토큰만(CSS Variables) · 토큰 목록 |

- 의존성 `react-aria-components` · `@internationalized/date` · `pretendard`는 함께 설치되고, `react` · `react-dom`은 앱의 것을 씁니다.
- 검증: 새 Vite 8 + React 19 + TypeScript 6 프로젝트에서 strict 타입 검사 · 빌드 · 브라우저 실행(콘솔 오류 0)을 확인했습니다.
- 상세 · 문제 해결: [usage.md](./usage.md).

## 4. Storybook 접근 방법

```bash
npm run storybook          # http://localhost:6006 (개발 서버, Storybook MCP 엔드포인트 /mcp 포함)
npm run build-storybook    # storybook-static/ — 정적 사이트 (서버 배포는 아직 하지 않음)
```

| 사이드바 | 내용 |
| --- | --- |
| `Foundations/Design Tokens` | 전체 토큰 목록 |
| `Components/<Name>/Usage` | 사용 가이드: 예제 코드, Figma → Props 표, 코드 정책(Figma에 없는 부분), 접근성 |
| `Components/<Name>/<Component>` | Props 표(Docs), Playground, 사용 예 스토리 |
| `Components/<Name>/Showcase` | Figma 변형 매트릭스 · 상태 · 상호작용 · 접근성 테스트 스토리(검증용, MCP 매니페스트 제외) |

- Playground의 Controls로 Prop을 바꿔 볼 수 있고, Accessibility 패널(axe)에서 위반을 확인할 수 있습니다.
- 스토리의 `play` 함수가 곧 테스트입니다(`npm test`가 같은 스토리를 실행).
- 정적 빌드에는 MCP 엔드포인트가 없습니다 — MCP는 개발 서버(`npm run storybook`)에서만 동작합니다.

## 5. 디자인 토큰 관리 구조

```
Figma Variables · Styles ──(읽기 전용 추출)──▶ figma/variables/*.txt · figma/styles/*.txt   (스냅샷)
                                              │  npm run tokens  (scripts/build-tokens.mjs)
                                              ▼
src/tokens/primitive.css · theme.css · semantic.css · typography.css · effects.css · components/*.css · tokens.json
                                              │  @import
                                              ▼
src/components/<Name>/<Name>.css  →  var(--colors-…), var(--spacing-…), var(--typography-…)
```

| 계층(Figma 컬렉션) | 예 | CSS 변수 |
| --- | --- | --- |
| Primitive | `colors/gray/200`, `spacing/padding/p-4`, `border-radius/rounded` | `--colors-gray-200`, `--spacing-padding-p-4`, `--border-radius-rounded` |
| Theme | `colors/brand/700` | `--colors-brand-700` |
| Semantic | `colors/text/primary`, `colors/fill/primary/subtle/hover` | `--colors-text-primary` |
| Component | `colors/button/primary/solid/background/default` | `--colors-button-primary-solid-background-default` |
| Text Style | `sm/leading-normal/medium` | `--typography-sm-leading-normal-medium-*` + `.ds-typography-…` 클래스 |
| Effect Style | `elevation-3` | `--effect-elevation-3` |

규칙

- 이름은 Figma 경로의 `/`를 `-`로 바꾼 것. 별칭은 `var()` 참조로 유지되어 상위 토큰을 바꾸면 따라 바뀝니다.
- `src/tokens/*`는 **생성물**입니다. 직접 수정하지 말고 Figma 변수를 고친 뒤 스냅샷 갱신 → `npm run tokens`.
- Figma에 없는 토큰을 추가하지 않습니다. 예외는 **Figma 등록 대기 토큰**(`figma-pending/primitive.txt`)뿐입니다 — 팀이 공통 토큰으로
  결정했지만 Figma에 아직 로컬 변수가 없는 값으로, 지금은 `border-radius/rounded-[12px]`(`--border-radius-rounded-\[12px\]`, F69) 1개입니다.
  `primitive.css` 끝 별도 블록으로 생성되고 `tokens.json`에 `"pending"`이 붙습니다. Figma에 등록되어 스냅샷에 들어오면 `npm run tokens`가
  이름 중복으로 실패하므로 그때 해당 줄을 지웁니다(체크섬 대상 아님).
- 컴포넌트 CSS 안의 `--_…`(밑줄)는 그 컴포넌트 전용 지역 변수입니다.
- 스냅샷이 원본과 같은지 확인: `npm run figma:checksum` 결과를 Figma에서 `figma/checksum.figma.js`를 실행한 값과 비교.
- 현재 스냅샷은 2026-10-19에 원본과 다시 맞췄습니다(체크섬 8그룹 일치 — [F31](./analysis/F31-button-sync.md)).
- 토큰 CSS 변수 이름은 앱에서도 쓸 수 있는 **공개 API**입니다 — 이름이 바뀌면 호환성이 깨지는 변경으로 다룹니다(7절).

## 6. 브라우저 호환성

| 엔진 | 측정 버전 | 결과 |
| --- | --- | --- |
| Chromium (Chrome · Edge) | 156 | 전 컴포넌트 Figma 정합성 통과(기준 엔진) |
| Firefox | 157 | 통과 — 글자 상자 너비 1px 미만 차이 등 기록된 렌더링 차이만 |
| WebKit (Safari) | 27.2 (Playwright, Windows) | 통과 — 위와 같음 |

최소 지원 버전(사용한 CSS 기능 기준, MDN): **Chrome/Edge 111, Firefox 113, Safari 16.2** — 가장 늦게 지원된 기능은 `color-mix()`(Loading · Slider).

| 기능 | 미지원 시 |
| --- | --- |
| `calc-size()`(라벨 너비를 Figma처럼 정수 px로) | `@supports`로 건너뜀 → 1px 미만 좁아짐(현재 Chromium만 지원) |
| `backdrop-filter`(차트 툴팁 배경 흐림, `-webkit-` 병기) | 흐림 없이 80% 흰 배경 |
| `ResizeObserver`(차트 너비) | 미지원 환경에서는 첫 측정값으로 고정 |
| `:focus-visible`, CSS 변수, flex/grid `gap`, `clip-path` | 위 최소 버전에서 모두 지원 |

모바일 브라우저 · 스크린 리더 실기기 검증은 하지 않았습니다. 상세: [browser-support.md](./browser-support.md).

## 7. 버전 관리와 업데이트 절차

**버전 규칙(제안)** — 자세한 근거와 2026-10-19 변경 목록은 [breaking-changes.md](./breaking-changes.md).

- 첫 배포: 외부 사용자가 없으므로 동기화된 현재 상태를 **0.1.0**으로 배포(권장). 삭제 · 이름 변경된 토큰 17개에 별칭은 두지 않습니다.
- 0.x: MINOR = 호환 깨짐 · Figma 값 변경 · 추가, PATCH = 수정. 내부 부품 · 내부 API는 1.0 전에 export 제거 여부를 결정합니다.
- 1.0 이후(SemVer):

| 변경 | 1.0 이후 | 예 |
| --- | --- | --- |
| 호환 깨짐 | MAJOR | Prop 삭제 · 이름 변경, 기본값 변경, **토큰 CSS 변수 이름 변경 · 삭제**(직전 MINOR에서 별칭 · `@deprecated`로 예고) |
| 기능 · 값 변경 | MINOR | 새 컴포넌트 · Prop · Variant · 토큰, Figma 원본 값(색 · 간격) 변경 — CHANGELOG "화면 변경" |
| 수정 | PATCH | 버그 · 접근성 · 렌더링 수정, 문서 |

변경 내역은 [CHANGELOG.md](../CHANGELOG.md)에 남기고, 릴리스는 `v<버전>` git 태그로 표시합니다.

**Figma가 바뀌었을 때**

1. 변경 확인
   - 변수 · 스타일: Figma에서 `figma/checksum.figma.js` 실행 ↔ `npm run figma:checksum` 비교 → 다른 그룹만 줄 단위로 비교([F31 분석](./analysis/F31-button-sync.md) 방법)
   - **노드(변형 구조 · 바인딩 · 배치)**: 체크섬에는 드러나지 않습니다. 기준 이미지가 있는 세트를 Figma MCP `get_screenshot`으로 다시 캡처해
     `figma/reference/*.png`와 픽셀 비교합니다(2026-10-19에 이 방법으로 Accordion · Table Filter 칸 변경을 찾음 — F31 분석 7절).
2. 영향 판단: 바뀐 변수를 쓰는 컴포넌트 · 새 Variant · 삭제된 변수, 디자인 결정이 필요한지([분류표](./figma-issue-triage.md))
3. 스냅샷 갱신: `figma/variables/*`(읽기 전용 추출) → `npm run tokens`
4. 코드 반영: 컴포넌트 CSS · `*.options.ts`(Variant 값) · 스토리
5. 기준 갱신: 바뀐 세트의 `figma/geometry` · `figma/reference` · `figma/metadata` 재추출. Figma에서 고쳐야 할 부분은 수정하지 말고
   [figma-fix-requests.md](./figma-fix-requests.md) 형식(노드 ID · 변수 ID)으로 요청
6. 회귀 검증(아래) → CHANGELOG · 버전 · 태그

**릴리스 전 검증** — 전체 항목: [release-checklist.md](./release-checklist.md)

```bash
npm run typecheck && npm run lint && npm test
npm run build && npm run build-storybook
npm run storybook            # 다른 터미널에서 실행한 채로
npm run verify:all           # 전 컴포넌트 × Chromium · Firefox · WebKit (다른 무거운 작업과 동시에 돌리지 말 것)
npm run verify:button        # Button 352 변형 + 실제 포인터 상태(-- --browser=firefox · webkit도)
npm run verify:a11y          # 전 스토리 axe 감사 ("other violations: 0")
npm run docs:api             # Public API 문서 갱신
npm pack                     # 외부 프로젝트에 설치해 타입 검사 · 빌드 · 실행 확인
```

배포(npm publish · Storybook 서버 배포)는 아직 하지 않습니다. 배포할 때 `"private": true`를 바꾸고 레지스트리 설정을 추가합니다.

## 8. Storybook MCP를 Claude Code에서 활용하기

Storybook의 `@storybook/addon-mcp`가 컴포넌트 문서 · 스토리를 MCP 도구로 제공합니다. 저장소의 `.mcp.json`에 등록되어 있습니다.

```json
{ "mcpServers": { "platform-ds-storybook": { "type": "http", "url": "http://localhost:6006/mcp" } } }
```

1. `npm run storybook`을 실행해 둡니다(MCP는 개발 서버가 떠 있을 때만 연결).
2. 저장소 폴더에서 Claude Code를 실행하고, 처음 한 번 프로젝트 MCP 서버 `platform-ds-storybook` 사용을 승인합니다(`claude mcp list`에서 Connected 확인).
3. `CLAUDE.md`의 지침에 따라 Claude가 UI 작업 전에 문서를 조회합니다.

| 도구 | 용도 |
| --- | --- |
| `docs-list` | 컴포넌트 · 문서 목록(컴포넌트 매니페스트 44, Usage 문서 37) |
| `docs-show` · `docs-show-story` | 컴포넌트의 설명 · Props · 스토리 코드 / 특정 스토리 |
| `stories-find-by-component` | 컴포넌트의 스토리 찾기 |
| `get-storybook-story-instructions` | 이 저장소의 스토리 작성 규칙 |
| `stories-preview` · `stories-changed` | 바꾼 스토리의 미리보기 URL |
| `test-run` | 스토리 테스트 실행 |

요청 예

- "Storybook MCP로 DataState 문서를 확인하고, 로딩 · 오류 상태를 처리하는 목록 화면을 만들어 줘."
- "Select와 DatePicker를 DashboardFilterBar에 넣은 조회 영역을 만들어 줘. 문서에 없는 Prop은 쓰지 마."
- "방금 만든 화면의 스토리를 추가하고 test-run으로 확인해 줘."

규칙: 문서에 없는 Prop · Variant를 만들어 쓰지 않습니다. 필요하면 디자인 시스템 쪽에 요청합니다(검증용 Showcase 스토리는 매니페스트에서 제외되어 있어 예시로 섞이지 않습니다).
