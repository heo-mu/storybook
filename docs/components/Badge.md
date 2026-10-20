# Badge — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Badge / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Badge** 프레임(91:5943)의 `badge_status`(84개) · `badge_dot`(21개) · `badge_count`(14개)를 구현했습니다.
상태를 짧게 알리는 표시이며 클릭할 수 없습니다.

## 사용 예

```tsx
import { Badge, BadgeDot, BadgeCount } from 'platform-design-system';

<Badge status="success">완료</Badge>
<Badge status="warning" appearance="outline" shape="rounded" size="md">점검 필요</Badge>
<Badge status="information" dot={false}>안내</Badge>

<BadgeDot status="point" aria-label="새 글" />
<BadgeCount count={unread} status="point" aria-label={`읽지 않은 알림 ${unread}개\
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Status Basic · Gray · Point · Success · Warning · Danger · Information | `status` | 세 컴포넌트 공통 |
| Appearance Filled · Outline | `appearance` | Outline은 1px 테두리, 배경 없음 |
| Size sm · md · lg | `size` | 높이 20 · 24 · 28px, `BadgeDot`은 4 · 6 · 8px |
| Shape Square · Rounded | `shape` | |
| Dot | `dot` | |
| Label Text | `children` | |
| badge_count Digits Single · Multiple | `count` · `max` | `max`(기본 99)보다 크면 "99+" |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `BADG-01` **Outline 배경**: 투명. 2026-10-19 Figma에서 변수 없는 흰 채움(12개 변형)을 지워 모든 Outline이 배경 없음으로 같습니다(F42 해소).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `BADG-02` **접근성**: Badge는 글자가 그대로 읽힙니다. `BadgeDot`은 장식이며 의미가 있으면 `aria-label`을 주세요(`role="img"`). `BadgeCount`의 숫자만으로 뜻이 부족하면 `aria-label`로 설명하세요(Rules 03 — 색만으로 전하지 않기). `aria-label`이 있으면 `BadgeCount`도 `role="img"`(2026-10-20 — 일반 `<span>`의 `aria-label`은 ARIA상 금지라 화면 낭독기가 "99+"만 읽을 수 있었음).
- `BADG-03` **최대값 표시**: 99를 넘으면 "99+"(Rules 08). 기준은 `max`로 바꿀 수 있습니다.

## 상태

## Props

### BadgeDot · BadgeCount

## 구현 메모 (Storybook에서 옮김)

- Figma 컴포넌트 세트: `badge_status`(91:6152) · `badge_dot`(95:2681) · `badge_count`(95:2762).
- 상태 색은 `colors/badge/status/{filled|outline}/*` 변수를 씁니다.
- `BadgeDot`은 `aria-label`이 없으면 `aria-hidden`, 있으면 `role="img"`로 렌더링됩니다.
- `BadgeCount`의 Figma Digits Single · Multiple은 숫자에 따라 정해지며, Multiple은 "99+"(`{max}+`)입니다.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Badge.showcase.stories.tsx / StatusMatrix`: Figma `badge_status` (84): Status × Appearance × Size × Shape.
- `Badge.showcase.stories.tsx / DotMatrix`: Figma `badge_dot` (21): Status × Size.
- `Badge.showcase.stories.tsx / CountMatrix`: Figma `badge_count` (14): Status × Digits (Single "1", Multiple "99+").
