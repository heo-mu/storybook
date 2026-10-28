# MetricCard — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / MetricCard / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **metric-card**(697:4487)를 구현했습니다. 대시보드의 핵심 지표 하나를 제목, 값 · 단위, 비교(MetricTrend + 문구)로 보여 줍니다.

## 사용 예

```tsx
import { LightningIcon, MetricCard, MetricTrend } from 'platform-design-system';

<MetricCard
  title="누적 전력 사용량"
  icon={<LightningIcon />}
  value="1,248"
  unit="kWh"
  trend={<MetricTrend direction="down" tone="positive">4.8%p</MetricTrend>}
  comparison="이전 7일 대비"
/>
```

## Figma → Props

| Figma | 코드 | 비고 |
| --- | --- | --- |
| Header icon (Lightning) · Title | `icon` · `title` | 20px `icon/tertiary`, 제목은 `<h3>`(`headingLevel`) |
| Value · Unit | `value` · `unit` | 3xl semibold · sm, 기준선 정렬 |
| metric-trend · Comparison | `trend` · `comparison` | |
| Title Text · Value Text · Unit Text · Comparison Text | `title` · `value` · `unit` · `comparison` | |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `MCAR-01` **padding · 배경 · 모서리**: 2026-10-19 Figma가 원격 변수(`padding/6`, `color/background/white`, `radius/xlarge1`) 대신 로컬 `p-4` · `colors/surface/page` · `border-radius/rounded-[12px]`에 연결되어 코드와 같습니다(F69).
- `MCAR-02` **그림자**: 효과 스타일 `elevation-3`(0 1 8 / 12%). 2026-10-19 Figma에서도 같은 값의 효과 스타일로 연결했습니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `MCAR-03` **너비**: 부모 너비를 채웁니다. Figma의 386px은 예시 폭입니다(Rules 08).
- `MCAR-04` **접근성**: 카드 전체가 제목으로 이름 붙은 그룹(`role="group"`)입니다. 아이콘은 장식입니다(Rules 03).

## Props

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc(Storybook Props 표)을 한국어 사용 설명으로 바꾸면서 옮긴 기술 정보입니다.

- 머리글(아이콘 + 제목) · 값과 단위 · 비교 행(증감 + 문구)은 `m-3` 간격이며, 흰 카드(padding 16, 모서리 12, `elevation-3` 그림자) 안에 있습니다.
- 값은 `3xl/leading-normal/semibold`, 비교 행은 Figma comparison row(`trend` + "Comparison" 글자)입니다.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `MetricCard.showcase.stories.tsx / Figma`: The Figma metric card (386px).
