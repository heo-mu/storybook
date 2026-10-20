# SearchField — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / SearchField / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Search Field** 프레임(216:6742)의 `search-field` 세트(36개)를 구현한 검색 입력입니다.

## 사용 예

```tsx
import { SearchField } from 'platform-design-system';

<SearchField label="입주민 검색" placeholder="이름 또는 동·호수" onSearch={(q) => runSearch(q)} />

// 라벨 없는 검색창
<SearchField aria-label="전체 검색" appearance="solid" size="md" />
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Size sm · md · lg | `size` | 기본 `'sm'` |
| Type Outline · Solid | `appearance` | 기본 `'outline'` |
| Label / Label Text | `label` | 생략 시 `aria-label` 필수 |
| State Hover · Focus · Completed · Error · Disabled | 브라우저 상태 · 값 유무 · `invalid` · `disabled` | Figma에 Read-only 상태 없음 |
| Value Text | `value` / `defaultValue` · `placeholder` | |

## 동작

- `<input type="search">`이며, Enter 키에서 `onSearch(value)`가 호출됩니다. 브라우저 기본 지우기 아이콘은 숨깁니다.
- 지우기 버튼(X)은 Figma처럼 Focus · Error 상태에서 보입니다(마우스용, `tabIndex=-1`). 누르면 값을 비우고 `onClear`를 호출하며 포커스를 유지합니다.
- Solid 타입의 Error는 Figma에 테두리가 없습니다(글자색만 변경) — [figma-issues](../../../docs/figma-issues.md) 참고.

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `SEAR-02` **Solid Error**: Outline Error처럼 2px 안쪽 오류 테두리(`colors/search-field/solid/border/error`, 2026-10-19 Figma 변수 · 변형 추가) — 이전에는 Solid 오류가 화면에 드러나지 않았습니다(E8).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `SEAR-01` **지우기 버튼**: Focus · Error 상태에서 보이고 Tab 순서에서 제외됩니다(Input과 같은 규칙). Enter로 `onSearch`가 호출됩니다(Rules 04).

## 상태

## Props
