# Breadcrumb — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Breadcrumb / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Breadcrumb** 프레임(721:13374)의 `breadcrumb`(6개) · `breadcrumb-item`(12개) · `breadcrumb-modern-separator`를 구현했습니다.
접힌 경로의 메뉴는 [Dropdown Menu](./DropdownMenu.md)를 사용합니다.

## 사용 예

```tsx
import { Breadcrumb } from 'platform-design-system';

<Breadcrumb
  homeHref="/"
  items={[
    { label: '에너지 관리', href: '/energy' },
    { label: '에너지 절약', href: '/energy/saving' },
    { label: '프로그램 목록', href: '/energy/saving/programs' },
  ]}
  current="프로그램 등록"
/>

// 경로가 길면 접기 — 홈 · … · 상위 페이지 · 현재 페이지
<Breadcrumb layout="collapsed" items={items} current="프로그램 등록" />
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Size md · sm | `size` | 높이 32 · 28px |
| Layout Full · Collapsed | `layout` | Collapsed: 중간 경로를 … 메뉴로 |
| Expanded | `expanded` / `defaultExpanded` / `onExpandedChange` | … 메뉴 열림 |
| Show Parent | `showParent` | Collapsed에서 상위 페이지 표시 |
| Home (House 아이콘) | `homeHref` · `homeLabel` | 아이콘만 표시, 이름 "홈" |
| item Role Link · Current · Open | `BreadcrumbItem` `href` · `current` · `open` | |
| item State Hover · Pressed | 브라우저 `:hover` · `:active` | |
| item Show Icon · Show Label | `icon` · `children` | 아이콘만 쓰면 `aria-label` 필요 |
| Expanded True · False | `expanded` / `onExpandedChange`(… 메뉴 열림) | |
| breadcrumb-item Label Text | `items[].label` · `current` | |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `BREA-02` **아이콘 상태 색**: Hover · Pressed · Current에서 Figma 변수 `breadcrumb/home-icon/hover` · `pressed` · `current`를 씁니다(F34).
- `BREA-05` **포커스**: 키보드 포커스(`:focus-visible`)일 때 항목 바깥 2px에 2px `colors/border/focus` 링, 마우스 클릭에는 그리지 않습니다(Figma 속성 `Focus` — breadcrumb-item).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `BREA-01` **펼친 상태(… 메뉴)**: 메뉴는 연 트리거(… 버튼) 아래 2px, 시작 정렬로 열리고 현재 페이지 항목은 Current 그대로입니다(Rules 05 · breadcrumb 주석, 2026-10-20부터 Figma 펼침 변형도 같음 — F33). Figma Role=Open은 `BreadcrumbItem open`으로 쓸 수 있고, Hover · Pressed에서도 `label/focus` 색을 유지합니다.
- `BREA-03` **Show Parent**: Collapsed에만 적용합니다. Full은 항상 전체 경로를 보여 줍니다 — 상위 페이지를 숨기면 경로가 끊기기 때문입니다(Rules 07).
- `BREA-04` **메뉴 너비**: 최소 200px, 더 긴 이름은 넓어집니다(Rules 05).
- `BREA-06` **메뉴 열림 · 닫힘 애니메이션**: 없습니다 — 즉시 열리고 닫힙니다. Rules 09(2026-10-28 추가 행)는 "참고 링크(heroui dropdown)의 애니메이션"이지만 Figma에 값이 없고 "상태 변화는 바로" 행과 충돌해 미구현입니다(결정 대기, figma-issues F103).

## 상태

## Props

### BreadcrumbItem

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc · 스토리 설명에서 사용자 문서로 옮기지 않은 내용입니다.

- Figma 컴포넌트 세트: `breadcrumb`(712:5106, 6개) · `breadcrumb-item`(710:4794, 12개) · `breadcrumb-modern-separator`(710:4795 — CaretRight 12px).
- 구조는 `<nav>` > `<ol>`이며, 각 `<li>`에 항목과 구분선이 함께 들어갑니다.
- `BreadcrumbItem`: Role Link = `href`(`<a>`, `href`가 없으면 `<button>`), Current = `current`(`<span aria-current="page">`), Open = `open`. State Hover · Pressed = `:hover` · `:active`.
- `BreadcrumbEntry.id`를 주지 않으면 `items` 안의 순서(index)가 `onAction` 값입니다.
- `moreLabel`은 Figma … 트리거의 Label Text, `menuTitle`은 `dropdownmenu_item` Type Title에 해당합니다.
- 예전 스토리 설명은 "`BreadcrumbItem`은 직접 배치용으로 export"라고 했지만, 지금 분류는 내부 부품(사용 금지, `@internal`)입니다.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Breadcrumb.showcase.stories.tsx / ItemMatrix`: Figma `breadcrumb-item` (12): Role Link / Current / Open × State × Size ("Show Icon" off as in the set).
- `Breadcrumb.showcase.stories.tsx / BreadcrumbMatrix`: Figma `breadcrumb` Layout Full / Collapsed (Expanded False). Expanded True: `BreadcrumbExpanded`.
- `Breadcrumb.showcase.stories.tsx / BreadcrumbExpanded`: Figma `breadcrumb` Layout Collapsed, Expanded True (one size per story so the open menus do not overlap). The menu panel is 200 × 110 like the Figma `dropdownmenu` frame.
