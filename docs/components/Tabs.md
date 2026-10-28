# Tabs — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Tabs / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Tab** 프레임(86:3121)의 `tab_filled`(60개) · `tab_line`(30개)를 구현한 탭입니다.
키보드 · ARIA(tablist / tab / tabpanel)는 react-aria-components가 담당합니다.

## 사용 예

```tsx
import { Tabs, TabList, Tab, TabPanel } from 'platform-design-system';

<Tabs appearance="line" selectedKey={tab} onSelectionChange={setTab}>
  <TabList aria-label="주문 상태">
    <Tab id="all">전체</Tab>
    <Tab id="paid">결제 완료</Tab>
    <Tab id="canceled" disabled>취소</Tab>
  </TabList>
  <TabPanel id="all">…</TabPanel>
  <TabPanel id="paid">…</TabPanel>
  <TabPanel id="canceled">…</TabPanel>
</Tabs>

// 채워진 둥근 탭 (Secondary · md)
<Tabs appearance="filled" shape="rounded" variant="secondary" size="md">…</Tabs>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| 세트 tab_line · tab_filled | `appearance` | `'line'`(기본) · `'filled'` |
| Variant Primary · Secondary | `variant` | 선택 색 #004a38 · #007c56 |
| Size sm · md · lg | `size` | 높이 line 28 · 32 · 40, filled 28 · 36 · 40px |
| Shape Square · Rounded | `shape` | filled만 |
| State Hover · Pressed | 브라우저 `:hover` · 누름 | |
| State Selected | `selectedKey` / `defaultSelectedKey` | |
| State Disabled | `Tab disabled` | 키보드 이동에서 건너뜀 |
| Label Text | `Tab` children | |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `TABS-03` **포커스**: 키보드 포커스(`:focus-visible`)일 때 탭 바깥 2px에 2px `colors/border/focus` 링, 마우스 클릭에는 그리지 않습니다(Figma 속성 `Focus` — tab_filled · tab_line).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `TABS-01` **탭 간격 · 정렬**: 간격 없이 나란히 둡니다 — line 탭은 이웃 탭의 밑줄이 이어져 하나의 선이 됩니다(Rules 08).
- `TABS-02` **활성화 방식**: 방향키로 이동하면 바로 선택(automatic). 내용이 무거우면 `keyboardActivation="manual"`(Enter · Space로 선택, Rules 04).
- `TABS-05` **패널 포커스**: 키보드 포커스일 때 패널 바깥 2px에 2px `colors/border/focus` 링(Design System Rules 02 — 탭 패널에는 Figma `Focus` 속성이 없어 규칙이 기준).

### 개발 구현 세부 사항

디자인 컴포넌트에 넣지 않는 기술 구현입니다(Design System Rules 10).

- `TABS-04` **패널**: 스타일 없이 내용만 렌더링합니다.

## 상태

## Props

### Tab

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc · 스토리 설명에서 사용자 문서로 옮기지 않은 내용입니다.

- Figma 컴포넌트 세트: `tab_filled`(91:5000, 60개) → `appearance="filled"`, `tab_line`(91:5241, 30개) → `appearance="line"`.
- 키보드는 react-aria-components tablist 패턴입니다(방향키 · Home · End). State: Hover · Pressed = `:hover` · press, Selected = 선택된 탭, Disabled = `disabledKeys` 또는 `Tab disabled`.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Tabs.showcase.stories.tsx / FilledMatrix`: Figma `tab_filled` (60): Variant × Shape × Size (rows) × State (columns).
- `Tabs.showcase.stories.tsx / LineMatrix`: Figma `tab_line` (30): Variant × Size (rows) × State (columns).
