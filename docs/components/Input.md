# Input — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Input / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Input** 프레임(72:4021)의 `input` 세트(21개)와 `input_message`(3개), 그리고 `password_field` 세트(1440:8466, 24개 — 2026-10-28 동기화)를 구현한 한 줄 입력 필드입니다.
`password_field`는 `type="password"`로 씁니다. 라벨 · 컨테이너 · 메시지 · 간격 · 토큰은 `input`과 같고, 오른쪽 눈 아이콘과 지우기 버튼 유무만 다릅니다.

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
| input_message Type Info · Success · Error | `messageType` | 기본: `invalid`면 `'error'`, 아니면 `'helper'`(2026-10-20 전에는 `'info'`) |
| input_message Type Helper · State Default · Disabled · 필드 `Helper` 속성 | `message`(종류를 정하지 않으면 `'helper'`) | 아이콘 없는 회색 글자 `colors/input/outline/helper/default`, 비활성 칸은 `…/helper/disabled`(Rules 04 "도움말", 2026-10-20 V-1) |
| Icon-eye | `type="password"` + `revealable` | 비밀번호 표시/숨김 토글. `input` 세트의 Figma 기본값 끔(2026-10-20, F90) — 비밀번호 칸(`password_field`)에서만 켬 |
| password_field State Default · Hover · Focus · Completed · Error · Disabled · Read-only | `type="password"` + `input`과 같은 Props | 눈 아이콘은 Default에서 숨김, Hover · Focus · 값이 있을 때(Completed · Error · Read-only · Disabled) 표시 — 색 `colors/input/outline/icon/*` |
| password_field State Focus-on | `defaultRevealed` 또는 눈 버튼 클릭 | 값이 보이는 Focus 상태: 아이콘이 `icon/visibility_off`(`EyeSlashIcon`, 24 그리드)로 바뀜, 입력 `type`은 `text` |
| password_field Input Text `•••••••••` | `value` / `placeholder` | Figma의 마스킹 글자. 브라우저가 값을 가리므로 코드에서는 글자를 바꾸지 않음 — Firefox는 U+25CF로 가림(docs/browser-support.md) |
| password_field (지우기 아이콘 없음) | `clearable` 기본 끔 | 어떤 상태에도 `icon/X`가 없어 `type="password"`이면 `clearable`의 기본값이 `false`. 명시하면 그대로 동작 |
| State Hover · Focus | 브라우저 `:hover` · `:focus-within` | |
| State Completed | 값이 있을 때 자동 | |
| State Error | `invalid` | 2px 빨간 테두리, `aria-invalid` |
| State Disabled · Read-only | `disabled` · `readOnly` | |
| Input Text | `value` / `defaultValue`(입력값) · `placeholder`(빈 칸 글자) | |
| Type Outline | — | Figma 유형은 Outline 하나뿐 |

`value`, `onChange`, `name`, `type`, `autoComplete` 등 나머지 `<input>` 속성과 `ref`는 실제 `<input>`에 전달됩니다.
`className` · `style`은 루트 요소에 적용됩니다.

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `INPU-01` **지우기 버튼(X)**: Hover · Focus 상태에서 보입니다(Figma와 같음). 마우스 보조라 Tab 순서에서 제외됩니다(`tabIndex=-1`) — 키보드는 전체 선택 후 삭제. 필요 없으면 `clearable={false}`(Rules 04). 비밀번호 칸은 Figma `password_field`에 지우기 아이콘이 없어 기본으로 끕니다(2026-10-28).
- `INPU-02` **눈 아이콘**: Figma `Icon-eye`는 비밀번호 표시/숨김 토글입니다 — `type="password"`일 때만 렌더링합니다. 숨긴 상태는 `eye`, 보이는 상태(Figma `password_field` State=Focus-on)는 `icon/visibility_off` 아이콘이고, 상태는 `aria-pressed`와 레이블("비밀번호 표시" / "비밀번호 숨기기")로도 전달합니다(Rules 04).
- `INPU-03` **Error + Focus**: Error 테두리를 유지합니다 — 오류 표시가 포커스 표시보다 우선합니다(Rules 02).
- `INPU-05` **Figma 눈 아이콘(보이는 상태)의 토큰**(2026-10-28 QA): `password_field` Focus-on 변형의 `icon/visibility_off`는 외부 라이브러리 아이콘 인스턴스라 벡터 색이 다른 파일의 변수(`color/icon/gray` · `color/icon/inverse-static`)에 묶여 있었습니다. 디자인 시스템 토큰 `colors/input/outline/icon/focus`(가려진 눈과 같은 상태 색)와 흰 테두리는 `colors/input/outline/background/default`로 다시 연결했습니다(QA 승인 작업, Z절). 픽셀 변화 없음(참조 이미지 재대조), 코드 변화 없음. **해결(2026-10-28 저녁)**: 세 `icon/visibility_off` 인스턴스를 분리해 로컬 프레임으로 바꿨습니다 — 외부 컴포넌트 의존 0, 픽셀 · 코드 변화 없음([figma-fix-requests AB절](../figma-fix-requests.md)).
- `INPU-04` **눈 아이콘 포커스**: 키보드 포커스일 때 버튼 바깥 2px에 2px `colors/border/focus` 링(Design System Rules 02 — 입력 칸 안의 버튼에는 Figma `Focus` 속성이 없어 규칙이 기준). 입력 칸 자체는 Figma State=Focus 테두리입니다.
- `INPU-06` **삭제한 토큰**(2026-10-29): 라벨이 모든 상태에서 `text/secondary`라 `input/outline/label/*` 4개를 삭제했습니다([figma-fix-requests AC절](../figma-fix-requests.md)). 코드 변화 없음.

## 상태

## Props

## 구현 메모 (Storybook에서 옮김)

Storybook 컴포넌트 설명 · Props 주석에서 옮긴 내용입니다.

- Figma 컴포넌트 세트: `input`(76:2945), `input_message`(83:3009), `password_field`(1440:8466).
- 지우기 버튼 아이콘은 Figma `icon/X`, 비밀번호 표시 버튼 아이콘은 Figma `Icon-eye`(`eye` 벡터)와 `icon/visibility_off`(1440:10313, 보이는 동안)입니다.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Input.showcase.stories.tsx / VariantMatrix`: All 21 Figma variants: Size (rows) × State (columns).
- `Input.showcase.stories.tsx / PasswordMatrix`: All 24 Figma `password_field` variants (set `password_field` in figma/verify/input.json) — no clear button, eye-slash only while revealed.
- `Input.showcase.stories.tsx / RequiredMark`: Figma Required on (every size): the dot after the label; the input is required for assistive technology and form checks.
- `Input.showcase.stories.tsx / HelperMessage`: Rules 04 "도움말": grey help text without an icon (Figma Type=Helper); helper/disabled in a disabled field.
