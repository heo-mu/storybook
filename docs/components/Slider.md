# Slider — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Slider / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Slider** 프레임(379:1562)의 `slider`(Default · Disabled)와 `handle`(5개)을 구현한 범위 입력입니다.
드래그 · 터치 · 키보드는 [react-aria-components](https://react-spectrum.adobe.com/react-aria/Slider.html)가 처리하고,
오른쪽 숫자 필드(Figma "Show Input")는 `Input` 컴포넌트를 그대로 사용합니다.

## 사용 예

```tsx
import { Slider } from 'platform-design-system';

<Slider aria-label="인원" minValue={1} maxValue={200} defaultValue={100} unit="명" />

// 제어 컴포넌트 + 변경 완료 시점에만 저장
<Slider aria-label="투명도" value={opacity} onChange={setOpacity} onChangeEnd={save} step={10} unit="%" />

// 숫자 필드 없이
<Slider aria-label="볼륨" defaultValue={70} showInput={false} />
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| 범위 라벨 "1" · "200" | `minValue` · `maxValue` | 기본 0 · 100, `formatOptions`로 숫자 형식 |
| 채움 · 핸들 위치 | `value` / `defaultValue` / `onChange` | `onChangeEnd`는 드래그 종료 · 키 입력 · 필드 확정 시 |
| Show Input | `showInput` | 기본 `true`. Enter 또는 포커스 이동 시 확정, 범위 밖 값은 잘라내고 `step`에 맞춤 |
| 단위 텍스트 "명" | `unit` | 필드 오른쪽과 값 라벨에 표시 |
| handle Value Label | `valueLabel` | 기본 `true`. Hover · 드래그 중 핸들 위 값 표시 |
| handle Pressed | 드래그 중 | 핸들 주위 반투명 원 |
| State Disabled | `disabled` | |
| handle Value Label yes · no | 값 라벨 — Hover · 드래그 · 키보드 포커스 중 표시 | |

Figma에는 보이는 라벨이 없으므로 `aria-label` 또는 `aria-labelledby`가 필요합니다. 숫자 필드 이름은 `inputLabel`(기본 "값 입력").

## 키보드

| 키 | 동작 |
| --- | --- |
| ← · → · ↑ · ↓ | 한 `step` 이동 |
| Page Up · Page Down | 큰 단위 이동 |
| Home · End | 최솟값 · 최댓값 |
| 숫자 필드에서 ↑ · ↓ | 한 `step` 이동 |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `SLID-04` **포커스**: 핸들은 키보드 포커스일 때 2px `colors/border/focus` 링(Figma 속성 `Focus` — handle)이고, 값 라벨도 함께 보입니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `SLID-01` **값 라벨**: Hover · 드래그 · 키보드 포커스 중 표시합니다(Rules 04 · slider 주석).
- `SLID-03` **숫자 필드 너비**: 가장 긴 값(최솟값 · 최댓값의 자릿수)이 들어가는 고정 너비 — 값이 바뀌어도 트랙 길이가 변하지 않습니다(Figma 예시는 "100"에 맞춘 너비, Rules 08).

### 개발 구현 세부 사항

디자인 컴포넌트에 넣지 않는 기술 구현입니다(Design System Rules 10).

- `SLID-02` **핸들 위치**: 값 위치에 핸들 중심을 맞춥니다(Figma 예시는 손으로 배치되어 채움 끝보다 2px 오른쪽).

## 상태

## Props

## 구현 메모 (Storybook에서 옮김)

Storybook 컴포넌트 설명 · Props 주석에서 옮긴 내용입니다.

- Figma 컴포넌트 세트: `slider`(391:1988), `handle`(391:2013).
