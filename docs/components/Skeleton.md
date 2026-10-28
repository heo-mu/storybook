# Skeleton — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Skeleton / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **skeleton**(697:4486, 4개 변형)을 구현했습니다. 내용을 불러오는 동안 자리를 표시하는 도형이며, 밝기가 맥동합니다(Rules 09, 2026-10-28).

## 사용 예

```tsx
import { Skeleton } from 'platform-design-system';

<div role="status" aria-label="불러오는 중">
  <Skeleton shape="circle" />
  <Skeleton shape="block" />
  <Skeleton shape="line" style={{ width: 200 }} />
</div>
```

## Figma → Props

| Figma Shape | `shape` | 크기 |
| --- | --- | --- |
| Line | `line` | 60 × 8 |
| Shape4 | `shape4` | 100 × 10 (Figma 값 이름 그대로 — figma-issues F70) |
| Block | `block` | 140 × 12 |
| Circle | `circle` | 24 × 24 |

색 `colors/skeleton/background`, 모서리 `border-radius/rounded`(Circle `rounded-xl`).

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `SKEL-01` **맥동**(2026-10-28 개정, 이전: 정적): Rules 09 "Skeleton은 참고 링크(shadcn/ui Skeleton)대로 움직입니다" — Tailwind `animate-pulse`와 같은 불투명도 1 → 0.5 → 1, 2초, `cubic-bezier(0.4, 0, 0.6, 1)` 반복(`ds-skeleton-pulse`). `prefers-reduced-motion`에서는 6초(Rules 03 "느리게", Loading의 3배 규칙과 같음). 색 · 크기 · Props는 그대로이고, 정합성 검사는 애니메이션을 멈춘 상태(`animations: 'disabled'`, 불투명도 1)로 비교합니다.
- `SKEL-03` **접근성**: 장식(`aria-hidden`)입니다. 불러오는 중이라는 사실은 감싸는 영역에서 알리세요(`DataState state="loading"`은 `role="status"`, Rules 06).

### 개발 구현 세부 사항

디자인 컴포넌트에 넣지 않는 기술 구현입니다(Design System Rules 10).

- `SKEL-02` **크기 조절**: `style`의 width / height로 바꿀 수 있습니다(색 · 모서리는 그대로).

## Props


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Skeleton.showcase.stories.tsx / Figma`: The 4 Figma variants.
