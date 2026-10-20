# Textarea — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Textarea / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Textarea** 프레임(86:2594)의 `textarea` 세트(14개)와 `textarea_message`(3개)를 구현한 여러 줄 입력 필드입니다.

## 사용 예

```tsx
import { Textarea } from 'platform-design-system';

<Textarea label="요청 사항" name="memo" maxLength={100} placeholder="내용 입력" />

<Textarea label="사유" value={reason} onChange={(e) => setReason(e.target.value)}
  maxLength={200} invalid={reason.length < 10} message={reason.length < 10 ? '10자 이상 입력하세요.' : undefined} />
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Size sm · md | `size` | 기본 `'sm'` |
| Label / Label Text | `label` | |
| Required | `required` | 라벨 뒤 4px 점(`colors/textarea/outline/required/default`, 라벨과 m-2) + 입력 요소 `required`. 점은 `aria-hidden` |
| Alert / Alert Text, textarea_message Type | `message`, `messageType` | |
| Counter | `showCount` + `maxLength` | `현재/최대`. `maxLength`가 있을 때 표시 |
| State Hover · Focus · Completed · Error · Disabled · Read-only | 브라우저 상태 · 값 유무 · `invalid` · `disabled` · `readOnly` | |
| Input Text | `value` / `defaultValue` · `placeholder` | |
| textarea_message Type Info · Success · Error | `message` · `messageType` | 기본: `invalid`면 `'error'`, 아니면 `'helper'` |
| textarea_message Type Helper · State Default · Disabled · 필드 `Helper` 속성 | `message`(종류를 정하지 않으면 `'helper'`) | 아이콘 없는 회색 글자 `colors/textarea/outline/helper/default`, 비활성 칸은 `…/helper/disabled`(Rules 04 "도움말", 2026-10-20 V-1) |
| Character count 줄(메시지 · 글자 수) | `.ds-textarea__footer` | F94(2026-10-20): Completed · Error에서 줄 전체가 `Alert`를 따르던 연결을 메시지만 따르게 고침 — 코드는 원래 메시지와 글자 수가 따로 보임 |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `TEXT-01` **높이 · 스크롤**: 컨테이너 높이는 Figma와 같은 100px 고정, 내용이 넘치면 내부 스크롤됩니다. 크기 조절 핸들은 두지 않습니다(Rules 08).
- `TEXT-02` **카운터**: 숫자는 실제 입력 길이 / 최대 길이입니다(Figma의 1 · 50 · 200은 예시 값). `maxLength`는 브라우저가 강제합니다(Rules 04).

## 상태

## Props

## 구현 메모 (Storybook에서 옮김)

Storybook 컴포넌트 설명 · Props 주석에서 옮긴 내용입니다.

- Figma 컴포넌트 세트: `textarea`(86:2597), `textarea_message`(86:2733).


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Textarea.showcase.stories.tsx / VariantMatrix`: All 14 Figma variants: Size (rows) × State (columns).
- `Textarea.showcase.stories.tsx / RequiredMark`: Figma Required on (every size): the dot after the label; the textarea is required for assistive technology and form checks.
- `Textarea.showcase.stories.tsx / HelperMessage`: Rules 04 "도움말": grey help text without an icon (Figma Type=Helper); helper/disabled in a disabled field.
