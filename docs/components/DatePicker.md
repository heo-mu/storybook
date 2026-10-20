# DatePicker — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / DatePicker / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Date Picker** 프레임(149:831)의 `date-picker_trigger`(21개) · `date-picker_message`(3개)를 `DatePicker`로,
`date-picker_calendar` · `_header` · `_navigation`(8개) · `_day`(7개)를 `Calendar`로 구현했습니다.
달력의 키보드 · 포커스 · ARIA는 [react-aria-components](https://react-spectrum.adobe.com/react-aria/Calendar.html)가 담당합니다.

## 사용 예

```tsx
import { DatePicker, Calendar } from 'platform-design-system';

// 값은 ISO 날짜 문자열('YYYY-MM-DD'), 화면에는 YYYY.MM.DD
<DatePicker label="시작일" name="start" value={start} onChange={setStart} />

// 선택 가능 범위와 주말 제외
<DatePicker label="상담일" minValue="2026-07-06" maxValue="2026-08-31"
  isDateUnavailable={(iso) => [0, 6].includes(new Date(iso + 'T00:00').getDay())} />

// 달력만
<Calendar aria-label="일정" value={day} onChange={setDay} />

// 로캘 — 월 · 요일 이름은 react-aria I18nProvider를 따름 (없으면 브라우저 언어)
<I18nProvider locale="ko-KR"><App /></I18nProvider>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Size sm · md · lg | `size` | 필드 높이 36 · 44 · 52px |
| Label / Alert | `label` · `message` · `messageType` | |
| Display Text "YYYY.MM.DD" | `placeholder` | 값은 YYYY.MM.DD 형식으로 표시 |
| State Hover · Focus | 브라우저 `:hover` · `:focus-within` | |
| State Completed | 날짜가 있을 때 자동 | |
| State Error | `invalid`, 또는 해석할 수 없거나 선택할 수 없는 날짜를 입력했을 때 | `aria-invalid` |
| State Disabled · Read-only | `disabled` · `readOnly` | Read-only는 달력 버튼 없음 |
| day Today · Selected · Outside · Disabled | 오늘 · `value` · 다른 달 · `minValue`/`maxValue`/`isDateUnavailable` | |
| navigation Disabled | 범위 끝 달에서 이전 / 다음 비활성 | |
| Label Text | `label` | |
| date-picker_message Alert Text · Type Info · Success · Error | `message` · `messageType` | |
| date-picker_day Day Text · State Pressed | 날짜 숫자(로캘 형식) · 누르는 동안 | 이름은 "27 2026년 9월 27일 일요일"(정책 `DPCK-05`) |
| date-picker_navigation Direction Previous · Next · State Pressed | 이전 · 다음 달 버튼(이름 "이전 달" · "다음 달") · 누르는 동안 | |

`name`을 주면 숨겨진 input으로 `YYYY-MM-DD` 값이 폼에 전송됩니다.

## 키보드

| 위치 | 키 | 동작 |
| --- | --- | --- |
| 필드 | 숫자 입력 + Enter / Tab | 날짜 확정 (YYYY.MM.DD, YYYY-MM-DD, YYYY/MM/DD, YYYYMMDD) |
| 필드 | Alt + ↓ | 달력 열기 |
| 달력 | ← → ↑ ↓ | 하루 / 한 주 이동 |
| 달력 | Page Up · Page Down | 이전 · 다음 달 |
| 달력 | Enter · Space | 선택 후 닫기 |
| 달력 | Esc | 닫기 |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `DPCK-03` **요일 이름**: 로캘을 따릅니다(ko-KR: 일 월 화 …). 2026-10-19 Figma 달력 요일도 한국어로 바뀌어 같습니다.
- `DPCK-04` **포커스**: 날짜 · 이전/다음 달 · 달력 버튼은 키보드 포커스일 때 바깥 2px에 2px `colors/border/focus` 링, 마우스 클릭에는 그리지 않습니다(Figma 속성 `Focus` — date-picker_day · date-picker_navigation). 입력 칸은 Figma State=Focus 테두리입니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `DPCK-01` **직접 입력**: 지원합니다. 해석할 수 없는 날짜(2026.02.30 등)나 범위 밖 날짜는 값을 바꾸지 않고 Error 상태로 표시합니다(Rules 04 · date-picker_trigger 주석).
- `DPCK-02` **달력 위치**: 필드 아래 4px, 필드 왼쪽에 맞춤. 공간이 없으면 위로 열립니다(Rules 05).
- `DPCK-05` **날짜 칸 이름**: 보이는 숫자를 먼저, 이어서 react-aria의 전체 날짜를 읽습니다 — "27 2026년 9월 27일 일요일"(선택됨 · 오늘 문구 포함). 한국어 날짜는 숫자가 "27일"로 붙어 보이는 "27"이 이름의 낱말이 되지 않기 때문입니다(WCAG 2.5.3, Rules 03).

## 상태

## 달력

## Props

### DatePicker

### Calendar

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc · 스토리 설명에서 사용자 문서로 옮기지 않은 내용입니다.

- Figma 컴포넌트 세트: `date-picker_trigger`(144:723, 21개) · `date-picker_message`(144:888) → `DatePicker`, `date-picker_calendar`(144:1644) · `date-picker_header`(144:1377) · `date-picker_navigation`(144:1328) · `date-picker_day`(144:1033) → `Calendar`.
- `DatePicker` State: Hover · Focus = `:hover` · `:focus-within`, Completed = 날짜가 있을 때, Error = `invalid` 또는 쓸 수 없는 날짜 입력, Disabled = `disabled`, Read-only = `readOnly`.
- `Calendar` 키보드는 react-aria-components 달력 패턴입니다: 방향키, Page Up · Page Down(달), Home · End(주의 처음 · 끝), Enter · Space(선택). 월 · 요일 이름은 react-aria 로캘(`I18nProvider`, 없으면 브라우저)을 따릅니다.
- `Calendar`의 `autoFocus`는 `DatePicker`가 달력을 열 때 날짜 칸으로 포커스를 옮기는 데 씁니다.
- `Calendar`의 day 상태: Today(오늘) · Selected(`value`) · Outside(다른 달) · Disabled(`minValue` · `maxValue` · `isDateUnavailable`) · Hover · Pressed.
