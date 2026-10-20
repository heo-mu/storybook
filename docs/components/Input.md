# Input — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Input / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Input** 프레임(72:4021)의 `input` 세트(21개)와 `input_message`(3개)를 구현한 한 줄 입력 필드입니다.

## 사용 예

```tsx
import { Input } from 'platform-design-system';

<Input label="이메일" type="email" name="email" placeholder="example@domain.com" />

// 제어 컴포넌트
const [value, setValue] = useState('');
<Input label="이름" value={value} onChange={(e) => setValue(e.target.value)} />

// 검증 메시지
<Input label="전화번호" value={phone} invalid={!valid} message={valid ? undefined : '전화번호 형식이 아닙니다.'} />

// 비밀번호 (눈 아이콘으로 표시/숨김)
<Input label="비밀번호" type="password" autoComplete="current-password" />
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Size sm · md · lg | `size` | 기본 `'sm'`. 컨테이너 높이 36 · 44 · 52px |
| Label / Label Text | `label` | 생략하면 라벨 없음 → `aria-label` 지정 |
| Required | `required` | 라벨 뒤 4px 점(`colors/input/outline/required/default`, 라벨과 m-2) + 입력 요소 `required`. 점은 `aria-hidden` |
| Alert / Alert Text | `message` | `input_message` |
| input_message Type Info · Success · Error | `messageType` | 기본: `invalid`면 `'error'`, 아니면 `'info'` |
| Icon-eye | `type="password"` + `revealable` | 비밀번호 표시/숨김 토글. Figma 기본값 끔(2026-10-20, F90) — 비밀번호 칸에서만 켬 |
| State Hover · Focus | 브라우저 `:hover` · `:focus-within` | |
| State Completed | 값이 있을 때 자동 | |
| State Error | `invalid` | 2px 빨간 테두리, `aria-invalid` |
| State Disabled · Read-only | `disabled` · `readOnly` | |
| Input Text | `value` / `defaultValue`(입력값) · `placeholder`(빈 칸 글자) | |
| Type Outline | — | Figma 유형은 Outline 하나뿐 |

`value`, `onChange`, `name`, `type`, `autoComplete` 등 나머지 `<input>` 속성과 `ref`는 실제 `<input>`에 전달됩니다.
`className` · `style`은 루트 요소에 적용됩니다.

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `INPU-01` **지우기 버튼(X)**: Hover · Focus 상태에서 보입니다(Figma와 같음). 마우스 보조라 Tab 순서에서 제외됩니다(`tabIndex=-1`) — 키보드는 전체 선택 후 삭제. 필요 없으면 `clearable={false}`(Rules 04).
- `INPU-02` **눈 아이콘**: Figma `Icon-eye`는 비밀번호 표시/숨김 토글입니다 — `type="password"`일 때만 렌더링합니다. 아이콘이 하나뿐이라 상태는 `aria-pressed`와 레이블로 전달합니다(Rules 04).
- `INPU-03` **Error + Focus**: Error 테두리를 유지합니다 — 오류 표시가 포커스 표시보다 우선합니다(Rules 02).
- `INPU-04` **눈 아이콘 포커스**: 키보드 포커스일 때 버튼 바깥 2px에 2px `colors/border/focus` 링(Design System Rules 02 — 입력 칸 안의 버튼에는 Figma `Focus` 속성이 없어 규칙이 기준). 입력 칸 자체는 Figma State=Focus 테두리입니다.

## 상태

## Props

## 구현 메모 (Storybook에서 옮김)

Storybook 컴포넌트 설명 · Props 주석에서 옮긴 내용입니다.

- Figma 컴포넌트 세트: `input`(76:2945), `input_message`(83:3009).
- 지우기 버튼 아이콘은 Figma `icon/X`, 비밀번호 표시 버튼 아이콘은 Figma `Icon-eye`입니다.
