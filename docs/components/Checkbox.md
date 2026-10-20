# Checkbox — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Checkbox / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Checkbox** 프레임(98:2375)의 `checkbox` 세트(36개)를 구현한 체크박스입니다. 네이티브 `<input type="checkbox">`를 그대로 사용하므로
폼 전송, 레이블 클릭, Space 키, 스크린리더의 체크 상태(일부 선택 = `mixed`)가 브라우저 기본 동작으로 처리됩니다.

## 사용 예

```tsx
import { Checkbox, CheckboxGroup } from 'platform-design-system';

<Checkbox label="이용약관 동의" name="terms" required />

// 제어 컴포넌트
<Checkbox label="자동 로그인" checked={remember} onChange={(e) => setRemember(e.target.checked)} />

// 전체 선택 (일부만 선택되면 Indeterminate)
<Checkbox label="전체" checked={all} indeterminate={some && !all} onChange={toggleAll} />

// 그룹 — 선택된 value 배열을 관리
<CheckboxGroup aria-label="수신 채널" value={channels} onChange={setChannels} name="channel">
  <Checkbox value="email" label="이메일" />
  <Checkbox value="sms" label="SMS" />
</CheckboxGroup>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Selection Unchecked · Checked | `checked` / `defaultChecked` | 그룹 안에서는 `CheckboxGroup`의 `value` |
| Selection Indeterminate | `indeterminate` | DOM `indeterminate` 속성 → 스크린리더에 "일부 선택" |
| Size sm · md · lg | `size` | 상자 14 · 16 · 18px. 기본 `'sm'` (그룹 안에서는 그룹 `size`) |
| Label / Label Text | `label` | 생략하면 상자만 렌더링 → `aria-label` 지정 |
| State Hover · Pressed | 브라우저 `:hover` · `:active` | 레이블 영역 포함 |
| State Disabled | `disabled` | |

`name`, `value`, `required`, `onChange` 등 나머지 `<input>` 속성과 `ref`는 실제 `<input>`에 전달됩니다.
`className` · `style`은 루트 `<label>`에 적용됩니다.

## CheckboxGroup

Figma에는 그룹 컴포넌트가 없습니다. `CheckboxGroup`은 `role="group"`과 선택값 배열 관리만 하는 시맨틱 래퍼이며,
`aria-label` 또는 `aria-labelledby`로 이름을 붙입니다. `value`를 가진 하위 `Checkbox`가 그룹 값에 연결됩니다.

**묶음 오류 · 메시지**(Rules 04 "묶음 오류", 2026-10-20 V-5): `invalid` · `message` — 묶음 아래 Figma `input_message`(Error, 메시지만 있으면 Helper)를
6px(`p-1_5`) 아래에 둡니다. 색은 Figma 예시가 연결한 `colors/input/outline/helper/*`. `role="group"`에는 `aria-invalid`를 쓸 수 없어 각 체크박스에 `aria-invalid`와 메시지 `aria-describedby`를 붙입니다. 래퍼 `.ds-choice-field`는 메시지가 없으면
`display: contents`(배치 그대로), 메시지가 생겨도 같은 요소라 묶음이 다시 만들어지지 않고 포커스가 유지됩니다. 상자 · 원의 오류 모양은 Figma에 없어 만들지 않았습니다.

| Prop | 설명 |
| --- | --- |
| `value` / `defaultValue` / `onChange` | 선택된 value 배열 (제어 / 비제어) |
| `name` · `size` · `disabled` | 모든 하위 체크박스에 적용 |
| `orientation` | `'vertical'`(기본) · `'horizontal'` |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `CHEC-01` **포커스**: 키보드 포커스(`:focus-visible`)일 때 상자 바깥 2px에 2px `colors/border/focus` 링, 마우스 클릭에는 그리지 않습니다(Figma 속성 `Focus` — checkbox). 라벨에는 그리지 않습니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `CHEC-02` **항목 간격**: `CheckboxGroup`은 세로 8px(`spacing/margin/m-2`), 가로(`orientation="horizontal"`) 16px(`m-4`), 줄바꿈 시 줄 사이 8px(Rules 08).
- `CHEC-03` **Indeterminate 클릭**: 누르면 전체 선택(Checked)이 됩니다 — 브라우저가 Indeterminate를 해제하고 체크합니다. 제어 컴포넌트라면 `onChange`에서 다시 계산하세요(Rules 04).

## 상태

## Props

### CheckboxGroup

## 구현 메모 (Storybook에서 옮김)

Storybook 컴포넌트 설명 · Props 주석에서 옮긴 내용입니다.

- Figma 컴포넌트 세트: `checkbox`(99:2389).
