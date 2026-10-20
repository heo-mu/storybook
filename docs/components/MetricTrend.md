# MetricTrend — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / MetricTrend / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **metric-trend**(697:4482, 12개 변형)를 구현했습니다. 지표의 변화량을 방향 아이콘과 함께 보여 줍니다.

## 사용 예

```tsx
import { MetricTrend } from 'platform-design-system';

// 사용량이 줄어든 것이 좋은 지표
<MetricTrend direction="down" tone="positive">4.8%p</MetricTrend>
```

## Figma → Props

| Figma | 코드 | 비고 |
| --- | --- | --- |
| Direction (Up · Down · Flat · Disabled) | `direction` | 아이콘 TrendUp · TrendDown · Minus(Flat · Disabled) |
| Tone (Positive · Negative · Neutral) | `tone` | 색: `text/brand` · `status/danger/strong` · `text/secondary` |
| Change Text | children | xs/leading-normal/medium |

Disabled는 Tone과 관계없이 `dashboard/background/disabled` 배경, `icon/disabled` · `text/secondary`(회색 배경 위 6.28:1 — A-1 2026-10-19, 이전 `text/placeholder` 1.70:1)입니다.

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `MTRE-03` **Disabled 글자**: `text/secondary`(배경 대비 6.28:1). 2026-10-19 Figma도 같은 변수로 고쳐 같습니다(A-1).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `MTRE-01` **방향 읽기**: 방향은 아이콘으로만 보이므로 화면 낭독기용 글자("증가" · "감소" · "변동 없음", `directionLabel`)를 앞에 넣습니다. Disabled는 넣지 않습니다(Rules 03).
- `MTRE-02` **좋음 · 나쁨(Tone)**: 색으로만 구분됩니다. 의미가 중요하면 주변 문장(예: MetricCard의 비교 문구)에서 설명하세요(Rules 03 — 색만으로 전하지 않기).

## Props
