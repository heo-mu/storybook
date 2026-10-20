# DataFreshness — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / DataFreshness / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **data-freshness**(697:4543, 3개 변형)를 구현했습니다. 데이터가 얼마나 최신인지(상태 배지, 마지막 수신 시각, 갱신 주기)를 보여 줍니다.

## 사용 예

```tsx
import { DataFreshness } from 'platform-design-system';

<DataFreshness state="fresh" timestamp="2026.10.14 09:30" dateTime="2026-10-14T09:30" interval="자동 갱신 1분" />
```

## Figma → Props

| Figma | 코드 | 비고 |
| --- | --- | --- |
| State Fresh · Stale · Offline | `state` | Badge Outline · sm · Rounded(점 포함) — Success · Warning · Gray |
| 배지 글자 | `label` | 기본 "최근 수신" · "수신 지연" · "연결 끊김" |
| Timestamp Text | `timestamp` (+ `dateTime`) | `text/secondary` |
| Interval Text | `interval` | "·" 다음, `text/tertiary` |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `DFRE-03` **배지 배경**: 투명. 2026-10-19 Figma 배지 인스턴스의 흰 채움(변수 없음)을 지워 Badge Outline과 같습니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `DFRE-02` **알림 영역 아님**: 시각이 바뀔 때마다 읽어 주지 않도록 `aria-live`로 만들지 않았습니다. 상태 변화를 알려야 하면 사용처에서 알리세요(Rules 03).

### 개발 구현 세부 사항

디자인 컴포넌트에 넣지 않는 기술 구현입니다(Design System Rules 10).

- `DFRE-01` **마크업**: `dateTime`을 주면 시각을 `<time datetime>`으로 표시합니다. "·"는 장식으로 숨깁니다.

## Props

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc(Storybook Props 표)을 한국어 사용 설명으로 바꾸면서 옮긴 기술 정보입니다.

- 시각 · "·" · 갱신 주기는 `xs/leading-normal/normal`, 서로 `m-0_5` 간격이며 배지 뒤 간격은 `p-2`입니다.
