# Link — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Link / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Link** 프레임(111:960)의 `link` 세트(15개)를 구현한 밑줄 텍스트 링크입니다. 네이티브 `<a>`를 사용합니다.

## 사용 예

```tsx
import { Link } from 'platform-design-system';

<Link href="/terms">이용약관</Link>

// 새 창 (아이콘 + 스크린리더 "(새 창)")
<Link href="https://www.figma.com" external>Figma 열기</Link>

// 라우터 링크 — 다른 컴포넌트로 렌더링이 필요하면 클래스만 재사용
<a className="ds-link" data-size="sm" href="/docs">문서</a>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Size sm · md · lg | `size` | 글자 12 · 14 · 16px, 밑줄 |
| Label Text | children | |
| Icon (arrow-square-out) | `showIcon` | 기본값은 `external` |
| State Hover · Pressed · Visited | 브라우저 `:hover` · `:active` · `:visited` | |
| State Disabled | `disabled` | href 제거, `aria-disabled`, Tab 순서에서 빠짐 |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `LINK-02` **포커스**: 키보드 포커스(`:focus-visible`)일 때 링크 바깥 2px에 2px `colors/border/focus` 링, 마우스 클릭에는 그리지 않습니다(Figma 속성 `Focus` — link).
- `LINK-03` **md 줄 높이**: 20px. 2026-10-19 Figma 텍스트 스타일 `sm/leading-normal/underline`의 줄 높이를 `font/line-height/leading-5`(20px)에 연결해 코드와 같습니다(C3 해소).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `LINK-01` **외부 링크**: 화살표 아이콘은 새 창으로 여는 링크에만 씁니다 — `external`(`target="_blank"`, `rel="noopener noreferrer"`, 숨은 "(새 창)" 텍스트). 아이콘만 필요하면 `showIcon`(Rules 04).

## 상태

## Props

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc · 스토리 설명에서 사용자 문서로 옮기지 않은 내용입니다.

- Figma 컴포넌트 세트: `link`(111:1509, 15개). 네이티브 `<a>`를 그립니다.
- State: Hover · Pressed · Visited = `:hover` · `:active` · `:visited`, Disabled = `disabled`(`href` 없음, `aria-disabled`, `role="link"`, 포커스되지 않음).


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Link.showcase.stories.tsx / VariantMatrix`: All 15 Figma variants (Figma "Icon" on): Size (rows) × State (columns).
