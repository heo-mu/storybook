# Pagination — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Pagination / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Pagination** 프레임(149:1030)의 `pagination`(3개) · `pagination_item`(24개) · `pagination_control`(48개)를 구현했습니다.

## 사용 예

```tsx
import { Pagination } from 'platform-design-system';

<Pagination totalPages={pageCount} page={page} onPageChange={setPage} />

// 크기 · 모양
<Pagination totalPages={20} size="md" shape="rounded" visiblePages={7} />
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Size sm · md · lg | `size` | 버튼 20 · 24 · 28px, 간격 6 · 8 · 10px |
| Shape Square · Rounded | `shape` | |
| item State Current | `page` / `defaultPage` | `aria-current="page"` |
| item State Hover · Pressed · control Hover · Pressed | 브라우저 `:hover` · `:active` | |
| control State Disabled | 첫 · 마지막 페이지에서 자동 | |
| 페이지 번호 개수 (Figma 5개) | `visiblePages` | 현재 페이지를 가운데 두는 창 |
| pagination_item Number | 페이지 번호(`totalPages` · `visiblePages`로 그림) | |
| pagination_control Direction Previous · Next | 이전 · 다음 버튼 | 첫 · 마지막 페이지에서 Disabled |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `PAGI-02` **첫 · 마지막 페이지의 이전 · 다음 버튼**: 이동할 곳이 없으면 Disabled입니다. 2026-10-19 Figma 예시도 1페이지에서 이전 버튼이 Disabled로 바뀌었습니다.
- `PAGI-03` **포커스**: 키보드 포커스(`:focus-visible`)일 때 번호 · 이동 버튼 바깥 2px에 2px `colors/border/focus` 링, 마우스 클릭에는 그리지 않습니다(Figma 속성 `Focus` — pagination_item · pagination_control).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `PAGI-01` **생략 표시(…) · 처음/끝 이동**: 두지 않습니다. 페이지가 많으면 현재 페이지 주변 `visiblePages`개만 보입니다(Rules 07).

## 상태

## Props

### PaginationItem · PaginationControl

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc · 스토리 설명에서 사용자 문서로 옮기지 않은 내용입니다.

- Figma 컴포넌트 세트: `pagination`(132:871) · `pagination_item`(132:520) · `pagination_control`(132:604).
- `Pagination`은 `<nav aria-label="페이지 이동">` 안에 이전 버튼 · 페이지 번호 창 · 다음 버튼을 그립니다. Figma 예시는 번호 5개, 첫 번호가 Current입니다.
- 예전 스토리 설명은 "`PaginationItem` · `PaginationControl`은 직접 배치용으로 export"라고 했지만, 지금 분류는 내부 부품(사용 금지, `@internal`)이라 사용자 문서는 `Pagination`만 안내합니다.
