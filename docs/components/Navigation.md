# Navigation — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Navigation / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Navigation** 프레임(180:2023)의 `item_parent` · `item_link` · `item_child`(각 4개)와 LNB 예시 구성을 구현했습니다.
parent는 펼침(Expanded), link와 child는 현재 위치(Selected)를 표시합니다.

## 사용 예

```tsx
import { Navigation, NavGroup, NavChild, NavLink } from 'platform-design-system';

<Navigation aria-label="주 메뉴" header={<Logo />} style={{ width: 240 }}>
  <NavGroup label="에너지 관리" icon={<ChartIcon />} defaultExpanded>
    <NavChild href="/energy/usage">사용량</NavChild>
    <NavChild href="/energy/saving" selected>에너지 절약</NavChild>
  </NavGroup>
  <NavLink href="/dashboard" icon={<HomeIcon />}>대시보드</NavLink>
</Navigation>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| item_link Variant Selected | `NavLink selected` | `aria-current="page"`, 굵게 · 브랜드 색 |
| item_parent Expanded | `NavGroup expanded` / `defaultExpanded` / `onExpandedChange` | 버튼 `aria-expanded`, 화살표 위 · 아래 |
| item_child Variant Selected | `NavChild selected` | `aria-current="page"` |
| State Hover | 브라우저 `:hover` | |
| Icon (Boolean) · 아이콘 | `icon` | 20px, Figma 자리표시 아이콘은 List |
| Menu Text | `children` / `label` | 긴 이름은 줄바꿈 |
| LNB 예시 로고 영역 | `Navigation header` | 메뉴 위 m-4 |
| item_parent Expanded True · False | `NavGroup expanded` / `defaultExpanded` / `onExpandedChange` | 하위 목록 펼침 |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `NAVI-04` **포커스**: 키보드 포커스일 때 항목 안쪽 가장자리에 2px `colors/border/focus` 링(Figma 속성 `Focus`, 안쪽형 — item_parent · item_link · item_child).
- `NAVI-05` **link Hover 아이콘 색**: Figma 바인딩대로 Unselected Hover에서도 `…/icon/default`를 씁니다(`…/icon/hover` 미사용 — F36).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `NAVI-01` **너비**: 항목은 컨테이너 너비를 채웁니다. Figma 예시의 LNB 240px(항목 200px + 좌우 p-5)은 레이아웃에서 지정합니다(Rules 08).
- `NAVI-03` **Pressed**: Pressed 상태가 없어 Hover와 같은 모양입니다(Rules 02).

### 개발 구현 세부 사항

디자인 컴포넌트에 넣지 않는 기술 구현입니다(Design System Rules 10).

- `NAVI-02` **하위 목록 선**: Figma는 1px 선을 반 픽셀 위치(x 15.5–16.5)에 그려 두 열에 흐리게 나뉩니다. 코드도 같은 기하(SVG rect)로 그려 같은 모양입니다(F37).

## 키보드

| 키 | 동작 |
| --- | --- |
| Tab · Shift+Tab | 메뉴 항목 사이 이동 (접힌 그룹의 하위 항목은 건너뜀) |
| Enter · Space (그룹) | 펼치기 · 접기 |
| Enter (링크) | 페이지 이동 |

## Props

### NavLink · NavGroup · NavChild

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc · 스토리 설명에서 사용자 문서로 옮기지 않은 내용입니다.

- Figma 컴포넌트 세트: `item_parent`(180:5246) → `NavGroup` 버튼(`NavParentItem`), `item_link`(180:6174) → `NavLink`, `item_child`(180:6249) → `NavChild`.
- `Navigation` 컨테이너: padding p-5, `colors/navigation/lnb/background`, 항목 사이 m-1_5. 너비는 레이아웃이 정합니다(Figma 예시 240px).
- `NavGroup` 하위 목록: p-4 들여쓰기, 1px 선(`…/child/selected/indicator/selected`), 선과 항목 사이 m-2_5 — Figma LNB 예시와 같습니다.
- `NavLink` · `NavChild`의 State Hover는 `:hover`입니다. 그룹은 `aria-expanded`가 있는 버튼이고, 선택된 항목은 `aria-current="page"`입니다.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Navigation.showcase.stories.tsx / Overview`: The Figma LNB example: two groups (one expanded with a selected child) and two links, 240px wide.
- `Navigation.showcase.stories.tsx / ParentMatrix`: Figma `item_parent` (4): State × Expanded, 200px wide.
- `Navigation.showcase.stories.tsx / LinkMatrix`: Figma `item_link` (4): State × Variant, 200px wide.
- `Navigation.showcase.stories.tsx / ChildMatrix`: Figma `item_child` (4): State × Variant, 200px wide.
