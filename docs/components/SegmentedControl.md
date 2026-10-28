# SegmentedControl — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / SegmentedControl / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Segmented Control** 프레임(476:21053)의 `segmented-control`(3개)와 `segmented-item`(18개)을 구현한 단일 선택 컨트롤입니다.
항목은 숨겨진 네이티브 라디오이므로 방향키 이동, 폼 전송, 스크린리더의 "라디오 버튼 n개 중 n번째"가 브라우저 기본 동작입니다.

## 사용 예

```tsx
import { SegmentedControl, SegmentedControlItem } from 'platform-design-system';

<SegmentedControl aria-label="기간" value={period} onChange={setPeriod} size="sm">
  <SegmentedControlItem value="day">일간</SegmentedControlItem>
  <SegmentedControlItem value="week">주간</SegmentedControlItem>
  <SegmentedControlItem value="month" disabled>월간</SegmentedControlItem>
</SegmentedControl>

// 너비 지정 — 항목이 너비를 똑같이 나눔
<SegmentedControl aria-label="보기" defaultValue="list" style={{ width: 316 }}>…</SegmentedControl>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Size md · sm · xs | `size` | 높이 44 · 36 · 28px. 기본 `'md'` |
| segmented-item Label | `SegmentedControlItem` children | 한 줄. 내용 상자보다 넓으면 좌우 padding까지 쓰고(Figma와 같음), 항목 전체보다 넓을 때만 말줄임 |
| Variant Selected · Unselected | `value` / `defaultValue` / `onChange` | 항목 `value`로 식별 |
| State Hover · Pressed | 브라우저 `:hover` · `:active` | |
| State Disabled | 항목 `disabled` 또는 컨트롤 `disabled` | 방향키 이동에서 건너뜀 |

컨트롤 너비를 지정하지 않으면 가장 긴 항목에 맞춰 모든 항목이 같은 너비가 됩니다(Figma: 항목 Fill).

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `SEGM-01` **포커스**: 키보드 포커스일 때 선택된 항목 바깥 2px에 2px `colors/border/focus` 링(Figma 속성 `Focus` — segmented-item).
- `SEGM-02` **선택된 항목의 Hover · Pressed**: Variant는 없지만 같은 값의 Component 변수(`…/selected/background/hover` 등)가 Figma에 있어 그대로 사용합니다(시각 변화 없음).
- `SEGM-04` **선택 이동 애니메이션**: 없습니다 — 선택은 즉시 바뀝니다. Rules 09(2026-10-28 추가 행)는 "참고 링크(heroui.pro segment)대로 움직임"이지만 Figma에 시간 · 곡선 값이 없고(세트의 프로토타입 전환도 모두 즉시) "상태 변화는 바로" 행과 충돌해 미구현입니다(결정 대기, figma-issues F103).

### Figma 반영 대기

Figma 정리를 기다리는 항목입니다. 정리될 때까지 아래처럼 구현합니다.

- `SEGM-03` **선택 항목 그림자**: Figma에서 변수 · 효과 스타일에 연결되지 않은 값(`0 1px 2px #00000017`)을 그대로 씁니다. 같은 값의 효과 스타일이 없어 등록(디자인 결정)을 기다립니다(F18).

## 상태

## Props

### SegmentedControlItem

## 구현 메모 (Storybook에서 옮김)

Storybook 컴포넌트 설명 · Props 주석에서 옮긴 내용입니다.

- Figma 컴포넌트 세트: `segmented-control`(531:24471), `segmented-item`(524:24397).


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `SegmentedControl.showcase.stories.tsx / VariantMatrix`: Figma `segmented-control` (md · sm · xs): 316px wide, four items, the first selected.
- `SegmentedControl.showcase.stories.tsx / ItemMatrix`: Figma `segmented-item` (18): each item on its own (the control's padding and background are removed in this story so the item is compared as in the Figma set).
- `SegmentedControl.showcase.stories.tsx / LabelOverflow`: Narrow segments (the Figma dashboard filter bar: 220px, sm): a label wider than the content box runs into the segment's padding like in Figma; only a label wider than the whole segment is truncated.
