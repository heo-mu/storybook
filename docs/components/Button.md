# Button — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Button / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **[Platform] Web Design System → 🔵 Ver 0.4 → Component → Button** 프레임(58:4971)의 컴포넌트 352개를
3개의 React 컴포넌트로 구현했습니다. 352개를 각각 만들지 않고, Figma Variant Property를 그대로 Props로 옮겼습니다.

| React 컴포넌트 | Figma Component Set | Variant 수 | 구성 |
| --- | --- | --- | --- |
| `Button` | `button_basic` (54:2904) | 192 | Variant×Appearance 6 × Size 4 × Shape 2 × State 4 |
| `IconButton` | `button_icon` (67:2368) | 144 | Variant×Appearance 6 × Size 3 × Shape 2 × State 4 |
| `TextButton` | `button_text` (432:8395) | 16 | Type 2 × Size 2 × State 4 |

## 설치 및 Import

```tsx
// 앱 진입점에서 한 번만
import 'platform-design-system/fonts.css';  // Pretendard Variable (font/family/basic)
import 'platform-design-system/styles.css'; // 디자인 토큰 + 컴포넌트 스타일

import { Button, IconButton, TextButton } from 'platform-design-system';

<Button variant="primary" size="md" leftIcon={<MyIcon />}>저장</Button>
<IconButton variant="tertiary" appearance="outline" icon={<PlusIcon />} aria-label="추가" />
<TextButton size="md" rightIcon={<CaretRightIcon />}>더보기</TextButton>
```

토큰만 필요하면 `platform-design-system/tokens.css`(CSS Variables)를 import 하세요.

## Figma 속성 → Props

### Button / IconButton

| Figma 속성 | 값 | Prop | 기본값 |
| --- | --- | --- | --- |
| Variant | Primary · Secondary · Tertiary | `variant` | `'primary'` |
| Appearance | Solid · Outline | `appearance` | `'solid'` (Secondary는 `'outline'`) |
| Size | xs · sm · md · lg (IconButton: xs · sm · md) | `size` | `'xs'` |
| Shape | Square · Rounded | `shape` | `'square'` |
| State | Default · Hover · Pressed · Disabled | 브라우저 상태 `:hover` · `:active`, `disabled` | — |
| Left Icon / Right Icon (boolean) | true · false | `leftIcon` / `rightIcon` (넘기면 표시) | 없음 |
| Label Text | 텍스트 | `children` (IconButton: `aria-label`) | — |

### TextButton

| Figma 속성 | 값 | Prop | 기본값 |
| --- | --- | --- | --- |
| Type | Primary · SecondarySecondary | `variant` (`'primary'` · `'secondary'`) | `'primary'` |
| Size | sm · md | `size` | `'sm'` |
| State | Default · Hover · Pressed · Disabled | `:hover` · `:active`, `disabled` | — |
| Left Icon / Right Icon, Label Text | | `leftIcon` / `rightIcon`, `children` | |

## Variant × Appearance

2026-10-19 Figma 동기화로 **Secondary / Solid가 추가**되어 6개 조합이 모두 있습니다(이전 296개 → 352개).
`appearance`를 생략하면 Secondary는 이전과 같이 **Outline**, 나머지는 Solid입니다(기존 코드 호환).

```tsx
<Button variant="secondary">OK</Button>                     // appearance 생략 → 'outline' (이전과 같음)
<Button variant="secondary" appearance="outline">OK</Button> // Outline
<Button variant="secondary" appearance="solid">OK</Button>   // Solid (녹색 채움, 2026-10-19 추가)
```

Storybook의 Variant Matrix는 Figma와 같은 조합만 렌더링하고, 개수(192 / 144 / 16)를 테스트로 검증합니다.

### Tertiary / Solid 배경 (2026-10-19)

Tertiary / Solid의 배경은 Semantic 토큰 **`colors/fill/tertiary/*`** 를 씁니다(Figma에서 Button · IconButton의 Default · Hover · Pressed 채우기를 이 토큰에 바인딩).
이전 배경(`surface/container-subtle` #f5f6f7)은 페이지(#fdfdfd)와 대비가 1.06:1로 거의 보이지 않아, 같은 회색 단계 체계를 유지하며 진하게 조정했습니다.

| State | 토큰 | Primitive | 값 | 이전 |
| --- | --- | --- | --- | --- |
| Default | `--colors-fill-tertiary-default` | `gray/150` | #e9ebee | #f5f6f7 |
| Hover | `--colors-fill-tertiary-hover` | `gray/225` | #dcdfe4 | #eff0f3 |
| Pressed | `--colors-fill-tertiary-pressed` | `gray/275` | #d0d4db | #e9ebee |
| Disabled | `--colors-button-tertiary-solid-background-disabled`(fill/disabled) | `gray/250` | #d6dae0 | 변경 없음 |

Props · 사용법은 그대로이고 색만 바뀝니다. 비교: Storybook **Components / Button / Tertiary Background**.

## 상태 (State)

- **Hover / Pressed**는 별도 Prop이 아니라 실제 포인터 상태(`:hover`, `:active`)로 표현됩니다.
- **Disabled**는 네이티브 `disabled` 속성입니다. Outline의 Disabled는 Figma와 동일하게 테두리가 없습니다.
- **Focus**: 키보드 포커스일 때 2px 포커스 링 — Figma 속성 `Focus`(아래 [정책](#정책)).

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `BUTT-01` **포커스**: 키보드 포커스(`:focus-visible`)일 때 버튼 바깥 2px에 2px `colors/border/focus` 링, 마우스 클릭에는 그리지 않습니다(Figma 속성 `Focus` — button_basic · button_icon · button_text). 모서리는 버튼 모서리 + 4px.

### 개발 구현 세부 사항

디자인 컴포넌트에 넣지 않는 기술 구현입니다(Design System Rules 10).

- `BUTT-02` **상태 표현**: Hover · Pressed는 실제 포인터 상태(`:hover`, `:active`), Disabled는 네이티브 `disabled`(Tab 순서에서 빠짐).
- `BUTT-03` **처리 중(`loading`)** (2026-10-28, Figma Form 사용 예시 "저장 중" 1216:7451): 버튼은 Default 팔레트 · 크기를 유지하고(Hover · Pressed 변화 없음), 글자 · 아이콘은 자리만 남기고 투명(`opacity: 0`), 가운데에 Figma `loading` size=sm · Type=Inverse(16px, 2px 호, `colors/border/inverse` = 버튼 글자색)를 그립니다. `aria-busy` · `aria-disabled`로 상태를 알리고 포커스는 유지하며, 클릭 · Enter · Space를 무시해 중복 제출을 막습니다(`disabled`가 아님). 버튼 안의 `role="status"` 글자(`loadingLabel`)가 상태를 읽어 주고, 이름은 `aria-labelledby`로 라벨에 고정됩니다. Figma 예시의 저장 중 버튼은 글자를 지워 40px이지만 코드는 레이아웃이 흔들리지 않도록 원래 너비(49px)를 유지합니다. Figma `button_basic` 세트에는 Loading 변형이 없어 공통 상태로 추가하지 않았습니다(사용 예시 기준).
- `BUTT-04` **Secondary / Solid Hover · Pressed 배경**(2026-10-28, Figma 결정값 F100 종결): Semantic `colors/fill/secondary/strong/hover` → brand/600(#009b68), `pressed` → brand/500(#02bb7b) — Component `button/secondary/solid/background/hover` · `pressed`가 그대로 참조하므로 코드는 별칭 변경 없이 `src/tokens/semantic.css` 재생성만으로 따라갑니다(Button · IconButton 공통, TextButton 무관). 흰 라벨(#fdfdfd) 대비 Hover 3.51:1 · Pressed 2.46:1(14px 본문 4.5:1 미달, Pressed는 비텍스트 3:1도 미달)로 axe 색 대비 18건(States · Variant Matrix의 pseudo-hover · active 칸)이 남습니다 — 색은 Figma 값 그대로 두고 [accessibility.md](../accessibility.md)에 기록.

## 아이콘

- 아이콘은 슬롯입니다. 어떤 SVG든 넘기면 Figma `icon_size` 프레임과 같은 크기로 맞춰집니다
  (Button xs–md 16px · lg 20px, IconButton xs·sm 16px · md 20px, TextButton 16px).
- 아이콘 색은 `color`로 지정되므로 SVG는 `fill="currentColor"`를 사용하세요.
- 아이콘은 `aria-hidden` 처리됩니다. `IconButton`은 `aria-label`이 필수입니다(Figma의 숨겨진 Label 레이어에 해당).

## Props

### Button

### IconButton

### TextButton

## Figma 원본 데이터 메모 (Ver 0.4)

구현은 Figma 바인딩을 그대로 따릅니다. 아래 항목은 디자인 쪽 정리가 필요할 수 있는 부분입니다.

1. `button_text`의 Type 값 이름이 **`SecondarySecondary`** 입니다. 2026-10-19 동기화로 Secondary는 `colors/button_text/secondary/*`(Primary보다 연한 글자 · 아이콘)를 씁니다.
2. **Primary / Outline 테두리**: 삭제되었던 변수 `colors/button/primary/outline/border/default`(→ `fill/primary/strong/default`, #004a38)를 2026-10-19 Figma에 복구하고 42개 변형을 다시 연결했습니다. Secondary / Outline Square Hover · Pressed 테두리도 `secondary/outline/border/default`로 통일(값 같음).
3. `button_basic`의 **Secondary / Outline Hover·Pressed** 테두리는 Square 변형에서 `secondary/solid/border/default`,
   Rounded 변형에서 `secondary/outline/border/default` 에 바인딩되어 있습니다(값은 동일 #007c56). 구현은 `secondary/outline/border/default` 를 사용합니다.
4. `*/solid/border/*`, `*/outline/border/disabled` 토큰은 존재하지만 컴포넌트에는 테두리가 적용되어 있지 않습니다(Solid 전체, Outline Disabled).
5. `colors/button/progress/border` 토큰에 대응하는 Variant는 없습니다.
6. Focus 상태가 정의되어 있지 않습니다.

토큰·타이포그래피를 포함한 전체 목록과 정리 제안은 저장소의 `docs/figma-issues.md`에 있습니다.

## 브라우저 지원

Chromium(Chrome · Edge 129+)에서는 352개 Variant가 Figma와 픽셀 단위로 같습니다.
Firefox · Safari는 `calc-size()`를 지원하지 않아 텍스트가 있는 버튼의 너비가 1px 미만 좁게 그려지고, 그 외(높이 · 간격 · 색 · 테두리 · 상태)는 같습니다.
측정 결과와 Fallback은 `docs/browser-support.md`, 외부 프로젝트 사용 예제는 `docs/usage.md`를 참고하세요.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Overview.stories.tsx / Overview`: The whole Button family (Figma frame "Button", 58:4971) at a glance.
- `TertiaryBackground.stories.tsx / BeforeAfter`: Tertiary / Solid on the page surface (#fdfdfd): before and after the Figma change, with the token values and their contrast to the page.
- `Tests.stories.tsx / CssCheck`: The token stylesheet is loaded: computed styles equal Figma Primary/Solid/xs/Square/Default.
- `Tests.stories.tsx / PropTransitions`: Changing props re-renders the button into the matching Figma variant.
- `Tests.stories.tsx / IconButtonAccessibleName`: The hidden Figma label becomes the accessible name; the icon itself is aria-hidden.

- `VariantMatrix.stories.tsx / ButtonMatrix`: `button_basic` — 6 Variant×Appearance × 4 States (rows) × 4 Sizes × 2 Shapes (columns) = 192.
- `VariantMatrix.stories.tsx / IconButtonMatrix`: `button_icon` — 6 Variant×Appearance × 4 States × 3 Sizes × 2 Shapes = 144.
- `VariantMatrix.stories.tsx / TextButtonMatrix`: `button_text` — 2 Types × 4 States (rows) × 2 Sizes (columns) = 16.
