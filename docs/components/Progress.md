# Progress — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Progress / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Progress** 프레임(185:6435)의 `progress`(185:6518)를 구현했습니다. 6px 트랙과 그 안에서 잘리는 막대입니다.

## 사용 예

```tsx
import { Progress } from 'platform-design-system';

<Progress aria-label="업로드" value={percent} />
<Progress aria-labelledby="job-title" value={done} maxValue={total} valueLabel={`${total}개 중 ${done}개\
```

## Figma → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Progressbar 너비 | `value` · `minValue` · `maxValue` | 백분율로 계산 |
| 트랙 너비 430px | 레이아웃 | 부모 너비를 채움 |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `PROG-01` **값을 모르는 진행(indeterminate)**: 제공하지 않습니다 — 진행률을 모르면 Loading을 씁니다(Rules 06).
- `PROG-02` **라벨 · 수치 표시**: 시각 요소는 없고, `aria-label` · `valueLabel`로 스크린 리더에 전달합니다(Rules 03).
- `PROG-03` **애니메이션**: 막대 너비는 즉시 바뀝니다(Rules 09).

## Props

## 구현 메모 (Storybook에서 옮김)

- 트랙: 높이 6px, `border-radius/rounded-full`, 색 `colors/progress/border/surface/default`. 막대(`colors/progress/border/indicator/default`)는 트랙 안에서 잘립니다.
- react-aria-components `ProgressBar` 기반입니다. `role="progressbar"`와 `aria-valuenow` · `aria-valuetext`가 자동으로 붙습니다.
- react-aria 쪽 Props(`value` · `minValue` · `maxValue` · `valueLabel` · `aria-label` 등)는 docgen `propFilter`(node_modules 제외)로 MDX Props 표에 나오지 않습니다. 자동 문서(autodocs)의 설명은 `Progress.stories.tsx`의 `argTypes`에 적혀 있습니다.
