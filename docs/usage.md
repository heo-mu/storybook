# 외부 React 프로젝트에서 사용하기

`platform-design-system`의 `Button`, `IconButton`, `TextButton`을 다른 React 프로젝트에서 쓰는 방법입니다.
아래 예제는 새 Vite + React 19 + TypeScript 프로젝트에 패키지를 설치해 타입 검사, 빌드, 브라우저 실행까지 확인한 코드입니다.

## 요구 사항

- React 18.2 이상 또는 19 (`react`, `react-dom`은 peer dependency)
- CSS `import`를 처리하는 번들러 (Vite에서 검증)
- 브라우저별 차이는 [browser-support.md](./browser-support.md) 참고

## 설치

아직 패키지 레지스트리에 배포하지 않았으므로, 디자인 시스템 저장소에서 패키지 파일을 만들어 설치합니다.

```bash
# 디자인 시스템 저장소
npm run build
npm pack                      # → platform-design-system-0.1.0.tgz

# 사용하는 프로젝트
npm install ../platform-design-system/platform-design-system-0.1.0.tgz
```

`pretendard`(폰트), `react-aria-components`(Select · Slider · FilterChip 등의 키보드 · 포커스 · ARIA 동작, 스타일 없음),
`@internationalized/date`(날짜)는 패키지 의존성으로 함께 설치됩니다. 컴포넌트별 사용법은 Storybook의 각 "사용 방법" 문서를 참고하세요.
저장소 폴더를 `file:` 링크로 직접 연결하는 방식은 검증하지 않았습니다(React가 두 벌 로드될 수 있음).

## 1. 스타일 불러오기 (앱 진입점에서 한 번)

```tsx
// src/main.tsx
import 'platform-design-system/fonts.css';  // Pretendard Variable — 토큰 font/family/basic
import 'platform-design-system/styles.css'; // 디자인 토큰 + 컴포넌트 스타일
```

| 경로 | 내용 |
| --- | --- |
| `platform-design-system/styles.css` | 모든 토큰(CSS Variables) + 컴포넌트 스타일. 컴포넌트를 쓰면 필수 |
| `platform-design-system/fonts.css` | Pretendard Variable(dynamic subset). 앱이 이미 이 폰트를 로드하면 생략 가능 |
| `platform-design-system/tokens.css` | 토큰만 필요할 때 (`styles.css`에 이미 포함) |
| `platform-design-system/tokens/tokens.json` | 토큰 목록(이름·CSS 변수·값) |

## 2. Button

```tsx
import { Button } from 'platform-design-system';

export function SaveBar({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="tertiary" appearance="outline" size="md">취소</Button>
      <Button variant="primary" size="md" disabled={saving} onClick={onSave}>
        저장
      </Button>
    </div>
  );
}
```

| Prop | 값 | 기본값 | Figma |
| --- | --- | --- | --- |
| `variant` | `'primary'` · `'secondary'` · `'tertiary'` | `'primary'` | Variant |
| `appearance` | `'solid'` · `'outline'` | `'solid'` (secondary는 생략 시 `'outline'`) | Appearance |
| `size` | `'xs'` · `'sm'` · `'md'` · `'lg'` | `'xs'` | Size |
| `shape` | `'square'` · `'rounded'` | `'square'` | Shape |
| `leftIcon` / `rightIcon` | 아이콘 엘리먼트 | 없음 | Left / Right Icon |
| `children` | 라벨 | — | Label Text |
| `disabled` | `boolean` | `false` | State = Disabled |

그 밖의 `<button>` 속성(`onClick`, `type`, `form`, `aria-*`, `className` 등)은 그대로 전달됩니다.
`type`의 기본값은 `"button"`이므로, 폼 제출 버튼은 `type="submit"`을 명시하세요.

```tsx
<form onSubmit={handleSubmit}>
  <Button type="submit" size="lg">제출</Button>
</form>
```

`ref`는 실제 `<button>` 요소를 가리킵니다.

```tsx
const ref = useRef<HTMLButtonElement>(null);
<Button ref={ref}>포커스 대상</Button>;
```

## 3. IconButton

라벨이 보이지 않으므로 `aria-label`이 **필수**입니다(Figma의 숨겨진 Label 레이어에 해당).

```tsx
import { IconButton } from 'platform-design-system';

<IconButton icon={<PlusIcon />} aria-label="항목 추가" />
<IconButton variant="tertiary" appearance="outline" shape="rounded" size="md" icon={<PlusIcon />} aria-label="추가" />
```

`size`는 `'xs'` · `'sm'` · `'md'`입니다(Figma에 lg 없음). 아이콘 크기는 xs·sm 16px, md 20px입니다.

## 4. TextButton

```tsx
import { TextButton } from 'platform-design-system';

<TextButton size="md" rightIcon={<CaretRightIcon />}>더보기</TextButton>
```

| Prop | 값 | 기본값 | Figma |
| --- | --- | --- | --- |
| `variant` | `'primary'` · `'secondary'` | `'primary'` | Type (Secondary는 글자 · 아이콘이 한 단계 연함 — 2026-10-19 Figma) |
| `size` | `'sm'` · `'md'` | `'sm'` | Size |
| `leftIcon` / `rightIcon`, `children`, `disabled` | Button과 동일 | | |

## 5. 아이콘 준비하기

아이콘은 어떤 SVG 컴포넌트든 넘길 수 있습니다. 버튼이 크기(16 / 20px)와 색을 정합니다.

- 크기: 아이콘 슬롯이 SVG를 100%로 맞추므로 `width`/`height`를 지정하지 않아도 됩니다. `viewBox`는 필요합니다.
- 색: 버튼 상태(기본·Hover·Pressed·Disabled)에 맞는 아이콘 색 토큰이 `color`로 적용되므로 `currentColor`를 쓰세요.

```tsx
export function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}
```

아이콘에는 자동으로 `aria-hidden="true"`가 적용됩니다.

## 6. TypeScript

Figma에 없는 조합은 컴파일 단계에서 막힙니다.

```tsx
<Button variant="secondary">OK</Button>                      // appearance 생략 → 'outline'
<Button variant="secondary" appearance="solid">OK</Button>   // Secondary / Solid (2026-10-19 Figma 추가)
<IconButton size="lg" icon={<PlusIcon />} aria-label="X" />  // ✗ 타입 오류 — IconButton에 lg 없음
<IconButton icon={<PlusIcon />} />                           // ✗ 타입 오류 — aria-label 필수
```

타입과 옵션 배열도 함께 export 됩니다.

```tsx
import { BUTTON_SIZES, BUTTON_VARIANTS, type ButtonProps, type ButtonSize } from 'platform-design-system';

// 옵션 배열: Figma 속성 값 목록(선택지 UI · 값 검증용). BUTTON_TONES · BUTTON_STATES는 내부 API입니다(docs/public-api.md).
BUTTON_VARIANTS.map((variant) => <Button key={variant} variant={variant}>{variant}</Button>);
```

## 6-1. 그 밖의 컴포넌트

버튼과 같은 방식으로 `platform-design-system`에서 import 합니다(스타일은 1의 `styles.css` 하나로 모두 포함).

| 분류 | 컴포넌트 |
| --- | --- |
| 입력 | `Input` · `Textarea` · `SearchField` · `Select` · `Checkbox` · `Radio` · `Switch` · `Slider` · `SegmentedControl` · `Chip` · `InputChip` · `FilterChip` · `DatePicker` · `Calendar` · `FileUploader` |
| 탐색 | `Link` · `Navigation` · `Tabs` · `Pagination` · `Breadcrumb` · `Stepper` · `DropdownMenu` |
| 피드백 · 오버레이 | `Badge` · `Progress` · `Loading` · `Alert` · `Toast` · `Tooltip` · `EmptyState` · `Dialog` · `Accordion` |
| 데이터 | `Table` · `KeyValueTable` · `Card` · `Chart` |
| 대시보드 | `MetricCard` · `MetricTrend` · `DataFreshness` · `DataState` · `Skeleton` · `DashboardFilterBar` |

Props · 접근성 메모는 Storybook의 각 **사용 방법** 문서에, Figma 대응은 [components/](./components/) 개발 노트에 있습니다. 보이는 라벨이 없는 컨트롤(Select · SegmentedControl ·
DatePicker를 필터 바에 넣을 때 등)에는 `aria-label`을 주세요.

## 7. 토큰 사용하기

앱 스타일에서도 같은 토큰을 CSS Variables로 쓸 수 있습니다. 이름은 Figma 변수 경로의 `/`를 `-`로 바꾼 것입니다.

```css
.card {
  background: var(--colors-surface-page);
  color: var(--colors-text-primary);
  padding: var(--spacing-padding-p-4);
  border-radius: var(--border-radius-rounded-md);
  box-shadow: var(--effect-elevation-1);
}
```

Text Style은 클래스 또는 변수로 씁니다.

```tsx
<p className="ds-typography-sm-leading-normal-medium">본문</p>
```

전체 목록은 Storybook의 **기초 / 디자인 토큰** 페이지에서 볼 수 있습니다.

## 8. 상태와 접근성

- **Hover / Pressed**: 실제 포인터 상태(`:hover`, `:active`)로 표현됩니다. 별도 Prop은 없습니다.
- **Disabled**: `disabled` Prop. 클릭 이벤트가 발생하지 않습니다.
- **Focus**: 키보드 포커스일 때 2px `colors/border/focus` 링(Figma 속성 `Focus`, Design System Rules 02). 전역 CSS에서 `outline: none`으로 지우지 마세요.
- **정책**: 상세 기준은 [policy-details.md](./policy-details.md), 항목별 출처 · 상태는 [code-policy-audit.md](./code-policy-audit.md).

## 9. 문제 해결

| 증상 | 원인 / 해결 |
| --- | --- |
| 버튼이 기본 브라우저 버튼처럼 보임 | `styles.css`를 import 하지 않음 |
| 글꼴이 다르고 너비가 Figma와 다름 | `fonts.css`(또는 Pretendard Variable 로드) 누락 |
| 앱 전역 `button { ... }` 스타일이 섞임 | 라이브러리는 클래스 선택자라 대부분 우선하지만, 라이브러리가 지정하지 않는 속성(`width` 등)은 전역 스타일이 적용됩니다. 전역 `button` 규칙을 범위로 한정하세요. |
| 디자인 값을 바꾸고 싶음 | 컴포넌트 CSS를 덮어쓰지 말고 Figma 변수를 수정한 뒤 토큰을 다시 생성하세요 (`npm run tokens`). |
