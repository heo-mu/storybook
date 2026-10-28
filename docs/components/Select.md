# Select — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Select / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Select** 프레임(95:2819)의 `select`(24개 — State=Focus 3개 포함), `listbox`(3개), `option`(15개), `select_message`(3개)를 구현한 단일 선택 필드입니다.
키보드 · 포커스 · 타입어헤드 · ARIA · 팝오버 위치 계산은 [react-aria-components](https://react-spectrum.adobe.com/react-aria/Select.html)
(스타일 없는 헤드리스 라이브러리)가 담당하고, 모든 시각 스타일은 Figma 변수입니다.

## 사용 예

```tsx
import { Select, SelectOption } from 'platform-design-system';

<Select label="과일" name="fruit" placeholder="과일 선택">
  <SelectOption id="apple">사과</SelectOption>
  <SelectOption id="banana">바나나</SelectOption>
  <SelectOption id="cherry" disabled>체리 (품절)</SelectOption>
</Select>

// 제어 컴포넌트 (값 = 옵션 id)
const [region, setRegion] = useState<Key | null>(null);
<Select label="지역" value={region} onChange={setRegion} invalid={!region} message={!region ? '지역을 선택하세요.' : undefined}>
  …
</Select>

// 데이터로 옵션 만들기
<Select label="국가" items={countries}>
  {(c) => <SelectOption id={c.code}>{c.name}</SelectOption>}
</Select>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Size sm · md · lg | `size` | 필드 높이 36 · 44 · 52px, 옵션 높이 36 · 40 · 44px |
| Label / Label Text | `label` | 생략하면 `aria-label` 지정 |
| Required | `required` | 라벨 뒤 4px 점(`colors/select/outline/outline/required/default`, 라벨과 m-2, `aria-hidden`). 버튼에는 필수 상태가 없어 "필수"를 버튼 설명(`aria-describedby`)으로 전달, 숨은 `<select>`는 `required` |
| Display Text | 선택한 옵션 텍스트 / `placeholder` | 기본 placeholder `'내용 선택'`, 한 줄 말줄임 |
| Alert / select_message Type | `message` · `messageType` | 기본: `invalid`면 `'error'`, 아니면 `'info'` |
| State Hover | 브라우저 `:hover` | |
| State Open | 목록이 열린 상태 (`open` · `defaultOpen` · `onOpenChange`) | 테두리 강조 + 위쪽 화살표 |
| State Completed | 값이 있을 때 자동 | |
| State Error · Disabled · Read-only | `invalid` · `disabled` · `readOnly` | Read-only는 화살표 없이 값만 표시, 목록이 열리지 않음 |
| option State Selected | 현재 값 | 굵은 브랜드 색 + 체크 아이콘 |
| option State Disabled | `SelectOption disabled` 또는 `disabledKeys` | 키보드 이동에서 건너뜀 |
| select_message Alert Text · Type Info · Success · Error | `message` · `messageType` | 기본: `invalid`면 `'error'`, 아니면 `'helper'` |
| select_message Type Helper · State Default · Disabled · 필드 `Helper` 속성 | `message`(종류를 정하지 않으면 `'helper'`) | 아이콘 없는 회색 글자 `colors/select/outline/outline/helper/default`, 비활성 칸은 `…/helper/disabled`(Rules 04 "도움말", 2026-10-20 V-1) |
| option Option Text | `SelectOption` children | |
| option Check Icon | `SelectOption checkIcon` | 기본 켬. 끄면 선택 표시는 굵은 브랜드 글자뿐(2026-10-19) |

`name`을 주면 숨겨진 네이티브 `<select>`가 함께 렌더링되어 폼 전송과 `required` 검증에 참여합니다.
`className` · `style`은 루트 요소에 적용됩니다. 목록 너비는 필드 너비와 같습니다.

## 키보드

| 키 | 동작 |
| --- | --- |
| Enter · Space · ↓ · ↑ | 목록 열기 |
| ↓ · ↑ · Home · End | 옵션 이동 (비활성 옵션 건너뜀) |
| 문자 입력 | 해당 글자로 시작하는 옵션으로 이동 (타입어헤드) |
| Enter · Space | 선택 후 닫기, 포커스는 필드로 복귀 |
| Esc · Tab | 선택 없이 닫기 |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `SELE-01` **닫힌 상태의 키보드 포커스**: Figma State=Focus(2026-10-19 추가) — 테두리가 `select/outline/outline/border/focus`(gray-darker)로 바뀝니다. Error와 겹치면 Error 테두리를 유지합니다.
- `SELE-07` **체크 아이콘**: Figma option "Check Icon"은 `SelectOption checkIcon`(기본 켬)입니다. 끄면 선택 표시는 굵은 브랜드 글자뿐입니다.
- `SELE-08` **md Disabled 글자**: 다른 md 상태와 같은 `base/leading-normal/normal`(밑줄 없음) — 2026-10-19 Figma의 잘못 적용된 텍스트 스타일을 고쳤습니다(F6).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `SELE-02` **키보드로 이동 중인 옵션**: Hover 모양입니다(마우스 Hover와 동일, Rules 02).
- `SELE-03` **선택된 옵션에 마우스를 올릴 때**: 배경은 Hover · Pressed 색, 글자는 Selected 스타일을 유지합니다 — 선택 표시가 Hover보다 우선합니다(Rules 02).
- `SELE-04` **목록 위치 · 최대 높이**: 필드 아래 4px(`spacing/margin/m-1`), 필드와 같은 너비. 화면 아래 공간이 부족하면 위로 열리고, 높이는 화면 안에 맞춰 줄어들며 목록이 스크롤됩니다(Rules 05 · select 주석).
- `SELE-06` **Read-only**: 스크린리더에 "읽기 전용" 설명을 함께 전달합니다(Rules 03).
- `SELE-09` **목록 열림 · 닫힘 애니메이션**: 없습니다 — 즉시 열리고 닫힙니다. Rules 09(2026-10-28 추가 행)는 "참고 링크(heroui dropdown)의 애니메이션"이지만 Figma에 값이 없고 "상태 변화는 바로" 행과 충돌해 미구현입니다(결정 대기, figma-issues F103).

### 개발 구현 세부 사항

디자인 컴포넌트에 넣지 않는 기술 구현입니다(Design System Rules 10).

- `SELE-05` **스크롤 표시**: Figma `scroll`(4px 둥근 막대)은 브라우저 스크롤바 스타일로 구현했습니다(Chromium · Safari 4px, Firefox는 `scrollbar-width: thin`). 내용이 넘칠 때만 보입니다.

## 상태

## Props

### SelectOption

## 구현 메모 (Storybook에서 옮김)

Storybook 컴포넌트 설명 · Props 주석에서 옮긴 내용입니다.

- Figma 컴포넌트 세트: `select`(95:4740), `listbox`(97:2665), `option`(97:2286), `select_message`(95:2960).
- react-aria-components 구성: 필드는 `Button`, 목록은 `Popover` 안의 `ListBox`, 옵션은 `ListBoxItem`입니다.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Select.showcase.stories.tsx / VariantMatrix`: 21 Figma select variants: Size (rows) × State (columns). "Open" needs an open list → see `Open`.
- `Select.showcase.stories.tsx / Open`: Figma State "Open" for one size (`size` arg): the field with its list open below it.
- `Select.showcase.stories.tsx / ListboxMatrix`: Figma `listbox` (3 sizes): five options, the third selected.
- `Select.showcase.stories.tsx / OptionMatrix`: Figma `option` (15): Size (rows) × State (columns).
- `Select.showcase.stories.tsx / MessageMatrix`: Figma `select_message` (Info · Success · Error · Helper; Helper also in a disabled field — State=Disabled).
- `Select.showcase.stories.tsx / LongList`: A long list scrolls inside the popover (Figma "scroll" indicator = the styled scrollbar).
- `Select.showcase.stories.tsx / RequiredMark`: Figma Required on (every size): the dot after the label; the trigger button is described as "필수" (a button has no required state).
- `Select.showcase.stories.tsx / HelperMessage`: Rules 04 "도움말": grey help text without an icon (Figma Type=Helper); helper/disabled in a disabled field.
