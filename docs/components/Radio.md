# Radio — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Radio / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Radio** 프레임(100:3180)의 `radio` 세트(24개)를 구현한 라디오 버튼입니다. 네이티브 `<input type="radio">`를 사용하므로
같은 그룹 안에서 방향키로 선택이 이동하고, 폼 전송·필수 검증이 브라우저 기본 동작으로 처리됩니다.

## 사용 예

```tsx
import { Radio, RadioGroup } from 'platform-design-system';

<RadioGroup aria-label="배송 방법" defaultValue="normal" name="delivery">
  <Radio value="normal" label="일반 배송" />
  <Radio value="express" label="빠른 배송" />
</RadioGroup>

// 제어 컴포넌트
<RadioGroup aria-label="기간" value={period} onChange={setPeriod} orientation="horizontal">
  <Radio value="7d" label="7일" />
  <Radio value="30d" label="30일" />
</RadioGroup>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Selection Unselected · Selected | `RadioGroup`의 `value` / `defaultValue` | 단독 사용 시 `checked` / `defaultChecked` |
| Size sm · md · lg | `size` | 원 14 · 16 · 18px, 점 8 · 9 · 10px. 기본 `'sm'` |
| Label / Label Text | `label` | 생략하면 `aria-label` 지정 |
| State Hover · Pressed | 브라우저 `:hover` · `:active` | |
| State Disabled | `disabled` | 그룹 전체는 `RadioGroup disabled` |

## RadioGroup

Figma에는 그룹 컴포넌트가 없습니다. `RadioGroup`은 `role="radiogroup"`, 공통 `name`(생략 시 자동 생성), 선택값 관리만 하는
시맨틱 래퍼입니다. `aria-label` 또는 `aria-labelledby`로 이름을 붙입니다.

**묶음 오류 · 메시지**(Rules 04 "묶음 오류", 2026-10-20 V-5): `invalid` · `message` — 묶음 아래 Figma `input_message`(Error, 메시지만 있으면 Helper)를
6px(`p-1_5`) 아래에 둡니다. 색은 Figma 예시가 연결한 `colors/input/outline/helper/*`. `radiogroup`에 `aria-invalid` · `aria-describedby`, 각 라디오 버튼에도 메시지 `aria-describedby`를 붙입니다. 래퍼 `.ds-choice-field`는 메시지가 없으면
`display: contents`(배치 그대로), 메시지가 생겨도 같은 요소라 묶음이 다시 만들어지지 않고 포커스가 유지됩니다. 상자 · 원의 오류 모양은 Figma에 없어 만들지 않았습니다.

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `RADI-01` **포커스**: 키보드 포커스(`:focus-visible`)일 때 원 바깥 2px에 2px `colors/border/focus` 링, 마우스 클릭에는 그리지 않습니다(Figma 속성 `Focus` — radio). 라벨에는 그리지 않습니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `RADI-02` **항목 간격**: `RadioGroup`은 세로 8px(`spacing/margin/m-2`), 가로(`orientation="horizontal"`) 16px(`m-4`), 줄바꿈 시 줄 사이 8px(Rules 08).

## 상태

## Props

### RadioGroup

## 구현 메모 (Storybook에서 옮김)

Storybook 컴포넌트 설명 · Props 주석에서 옮긴 내용입니다.

- Figma 컴포넌트 세트: `radio`(102:2677).


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Radio.showcase.stories.tsx / VariantMatrix`: All 24 Figma variants: Selection × Size (rows) × State (columns).
- `Radio.showcase.stories.tsx / GroupSpacing`: Design System Rules 08: items 8px apart when stacked; 16px apart in a row, 8px between wrapped rows (the group's own CSS — no `style`).
