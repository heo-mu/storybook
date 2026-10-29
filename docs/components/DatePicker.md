# DatePicker — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / DatePicker / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.5)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Date Picker** 프레임(149:831)의 `date-picker_trigger`(24개 — 2026-10-28 State=Open 추가) · `date-picker_message`(5개)와
`date-picker_calendar`(5) · `date-picker_header` · `_navigation`(8) · `_day`(7) · `_range-day` · `_select-list`를 **`DatePicker` 하나**로 구현했습니다(2026-10-28 통합).

- `variant="input"`(기본): Select와 같은 필드(`date-picker_trigger`)를 누르면 아래 4px에 달력(`date-picker_calendar`)이 팝오버로 열립니다. 필드는 달력을 여는 버튼이고 직접 입력은 받지 않습니다.
- `variant="inline"`: 달력만 그립니다(이전 `DatePicker` · `Calendar`와 같음).
- `Calendar`는 호환을 위해 그대로 export합니다(같은 달력, `DatePicker variant="inline"` 권장). 달력의 키보드 · 포커스 · ARIA는 [react-aria-components](https://react-spectrum.adobe.com/react-aria/Calendar.html)가 담당합니다.

## 사용 예

```tsx
import { DatePicker } from 'platform-design-system';

// 필드 + 달력. 값은 ISO 날짜 문자열('YYYY-MM-DD'), 필드에는 2026.10.28
<DatePicker label="시작일" name="start" value={start} onChange={setStart} />

// 기간 — 필드에는 2026.10.28 ~ 2026.11.03
<DatePicker label="이용 기간" selectionMode="range" rangeValue={range} onRangeChange={setRange} />

// 선택 가능 범위와 주말 제외
<DatePicker label="상담일" minValue="2026-07-06" maxValue="2026-08-31"
  isDateUnavailable={(iso) => [0, 6].includes(new Date(iso + 'T00:00').getDay())} />

// 달력만
<DatePicker variant="inline" aria-label="일정" value={day} onChange={setDay} />

// 로캘 — 월 · 요일 이름은 react-aria I18nProvider를 따름 (없으면 브라우저 언어)
<I18nProvider locale="ko-KR"><App /></I18nProvider>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| date-picker_trigger Size sm · md · lg | `size` | 필드 높이 36 · 44 · 52px(Select와 같은 Field 레이아웃) |
| Label / Alert / Helper | `label` · `message` · `messageType` | |
| Required | `required` | 라벨 뒤 4px 점(`colors/date-picker/trigger/outline/required/default`, 라벨과 m-2) + 필드 설명 "필수" |
| Display Text "YYYY.MM.DD" | `placeholder` | 기본 `YYYY.MM.DD`, 기간은 `YYYY.MM.DD ~ YYYY.MM.DD`. 값은 `formatDateText`(YYYY.MM.DD)로 표시 |
| State Hover · Focus | `:hover` · `:focus-within` | Focus = 키보드 포커스 테두리 `border/focus` |
| State Open(2026-10-28 추가) | `open` · `defaultOpen` · `onOpenChange`, 열리면 `data-open` | 테두리 `border/focus`, 아이콘 `colors/icon/secondary`(Select Open과 같음) |
| State Completed | 값이 있을 때 자동(`data-filled`) | |
| State Error | `invalid` | 필드 `aria-invalid`(react-aria Button은 이 속성을 넘기지 않아 DOM에 직접 설정) |
| State Disabled · Read-only | `disabled` · `readOnly` | Read-only는 달력 아이콘이 없고 열리지 않음(설명 "읽기 전용") |
| calendar-dots 아이콘 | `CalendarDotsIcon` | 빈 필드 `colors/icon/placeholder`(F24), 값이 있으면 `…/icon/default`, 오류 `…/icon/error`, 비활성 `…/icon/disabled` |
| date-picker_calendar Mode Single · Range | `selectionMode` | Range는 `rangeValue` · `defaultRangeValue` · `onRangeChange` |
| date-picker_calendar State Default · Start · Selected · Preview | 선택 진행 상태(자동) | Start = 시작일만, Preview = 시작일 뒤 hover · 키보드 임시 범위 |
| day Today · Selected · Outside · Disabled | 오늘 · 값 · 다른 달 · `minValue` / `maxValue` / `isDateUnavailable` | |
| navigation Disabled | 범위 끝 달에서 이전 / 다음 비활성 | |
| select-list Year · Month | 헤더의 연도 · 월 Select | 표시 연도 ±10년, 제한 밖 제외 |
| date-picker_message Type Info · Success · Error · Helper(State Disabled) | `message` · `messageType` | 기본: 오류면 `'error'`, 아니면 `'helper'`; 비활성 칸은 `…/helper/disabled` |

`name`을 주면 숨겨진 input으로 `YYYY-MM-DD` 값이 폼에 전송됩니다(기간은 `name.start` · `name.end`).

라벨 색은 Figma 바인딩대로 모든 상태에서 `colors/text/secondary`(Field 공통)입니다 — Component 변수 `…/label/*`는 Figma 노드에 묶여 있지 않습니다(figma-issues F107).

## 키보드

| 위치 | 키 | 동작 |
| --- | --- | --- |
| 필드 | Enter · Space · ↓ · ↑ | 달력 열기(포커스는 선택된 날짜 또는 처음 보여 줄 날짜로) |
| 달력 | ← → ↑ ↓ | 하루 / 한 주 이동 |
| 달력 | Page Up · Page Down · Home · End | 이전 · 다음 달 · 주의 처음 · 끝 |
| 달력 | Enter · Space | 선택 — Single은 닫힘, Range는 종료일까지 고르면 닫힘 |
| 달력 | Esc · 바깥 클릭 | 고르지 않고 닫힘, 포커스는 필드로 |
| 연도 · 월 | Enter · Space · ↓ | 목록 열기 |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

- `DPCK-03` **요일 이름**: 로캘을 따릅니다(ko-KR: 일 월 화 …).
- `DPCK-04` **포커스**: 날짜 · 이전/다음 달 버튼은 키보드 포커스일 때 바깥 2px에 2px `colors/border/focus` 링(Figma 속성 `Focus` — date-picker_day · date-picker_navigation). 필드는 Figma State=Focus 테두리에 더해 Rules 02의 바깥 2px 링(`[data-focus-visible]`).

### Figma 문서화 정책

- `DPCK-01` **필드는 달력을 여는 트리거**(2026-10-28 개정): 글자를 직접 입력하지 않습니다. 날짜를 고르면 필드에 표시되고 닫힙니다(Single은 바로, Range는 종료일까지). 이전 규칙(직접 입력 · 해석 실패 시 Error)은 폐기 — 입력 검증은 달력이 담당합니다.
- `DPCK-02` **달력 위치**: 필드 아래 4px(`spacing/margin/m-1`), 필드 왼쪽에 맞춤. 공간이 없으면 위로 열립니다(Rules 05). `Popover placement="bottom start" offset={4}`.
- `DPCK-05` **날짜 칸 이름**: 보이는 숫자를 먼저, 이어서 react-aria의 전체 날짜를 읽습니다 — "27 2026년 9월 27일 일요일". 한국어 날짜는 숫자가 "27일"로 붙어 보이는 "27"이 이름의 낱말이 되지 않기 때문입니다(WCAG 2.5.3, Rules 03).
- `DPCK-06` **달력 열림 · 닫힘 애니메이션**: 없습니다 — 즉시 열리고 닫힙니다. Rules 09의 해당 행도 2026-10-28 저녁에 "즉시"로 고쳐 충돌이 없습니다(F103 해결).
- `DPCK-07` **닫기 · 포커스 복귀**(Rules 05): Esc · 바깥 클릭으로 닫히고 포커스는 필드로 돌아옵니다. 비활성 · 읽기 전용 필드는 클릭 · 키보드로 열리지 않습니다. 여러 필드는 각자 상태를 가집니다.

### 개발 구현 세부 사항

- `DPCK-08` **필드 이름 · 설명**: 필드 버튼의 이름은 "현재 값 + 라벨"(`aria-labelledby` = 값 span + 라벨), 메시지 · "읽기 전용" · "필수"는 `aria-describedby`. 열린 달력은 `Dialog`(라벨로 이름), `Calendar autoFocus`로 포커스가 들어가고 닫히면 react-aria가 필드로 돌려줍니다.
- `DPCK-09` **열림 상태 토큰**: `[data-open]`은 Figma State=Open — `…/border/focus` + `colors/icon/secondary`. 필드 글자 상태별 토큰은 DatePicker.css 머리말 참고.

## Storybook

- `Components/DatePicker/DatePicker` — Playground(필드) · Single Date · Date Range · Inline Calendar · Inline Date Range · Sizes · Required · Selected Date · Helper Text · Status Message · Date Limits · Disabled Dates · Error · Disabled · Read Only · Range Hover Preview · Year / Month Selection · Keyboard Interaction · Inline Keyboard.
- `Components/DatePicker/Gallery` — Input Variants(21) · Open(sm · md · lg) · States · Interaction · Outside Click · Independent · Accessibility · Required · Messages · Helper Text · Calendar(5) · Day States(7) · Navigation(8) · Inline Interaction · Inline Accessibility. 정합성 검사: `node scripts/verify-figma.mjs date-picker`(5개 세트, 2026-10-28 세 엔진 통과).
- `Components/DatePicker/Regression` — 달력 로직(연말 · 비활성 간격 · 제한 · 윤년 · 인스턴스 독립, `variant="inline"`).
- 2026-10-28: 최상위 `Calendar` 그룹과 `Examples` 그룹은 제거했습니다. Calendar 스토리는 위 Gallery · DatePicker 그룹으로 옮겼습니다.
