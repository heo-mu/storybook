# 접근성

각 컴포넌트의 시맨틱 · 키보드 · ARIA 구현과 자동 검사(Storybook a11y = axe-core, Storybook MCP `test-run`) 결과입니다.

## 미해결: Figma 토큰 색 대비

다음 텍스트 색은 Figma 변수 값 그대로 구현되어 있으며 WCAG 2.1 AA 일반 텍스트 기준(4.5:1)에 못 미칩니다.
토큰 값은 Figma가 기준이므로 코드에서 바꾸지 않았습니다 — 디자인 쪽 조정이 필요합니다.

| 용도 | 토큰 | 색 / 배경 | 대비 | 사용처 |
| --- | --- | --- | --- | --- |
| 안내(info) 메시지 | `colors/brand-status/information/strong` (sky/600) | #0086d3 / #fdfdfd | 3.85:1 | Input · Textarea 메시지 |
| 보조 텍스트 | `colors/text/tertiary` (gray/500) | #778191 / #fdfdfd | 3.87:1 | Textarea 카운터 최대값 |
| 플레이스홀더 | `colors/text/placeholder` (gray/400) | #a1a8b5 / #fdfdfd | 2.4:1 | 입력 필드 플레이스홀더 |

비활성(Disabled) 요소는 WCAG 대비 기준에서 제외됩니다.

### 비텍스트 대비 (WCAG 1.4.11, 3:1)

| 용도 | 토큰 | 색 / 배경 | 대비 | 사용처 |
| --- | --- | --- | --- | --- |
| 선택 컨트롤 테두리 | `colors/checkbox/border/unchecked/default`, `colors/radio/border/unselected/default` (border/gray-subtle) | #a1a8b5 / #fdfdfd | 2.35:1 | Checkbox · Radio 선택 안 함 |
| 스위치 꺼짐 트랙 | `colors/switch/track/off/default` (brand-gray-400) | #a1a8b5 / #fdfdfd | 2.35:1 | Switch 꺼짐 |

라벨 텍스트가 함께 있어 컨트롤의 의미는 전달되지만, 컨트롤 경계 자체는 기준 미만입니다(디자인 조정 필요, figma-issues F12).

## 컴포넌트별

### Button · IconButton · TextButton
- 네이티브 `<button>`, 기본 `type="button"`. Disabled = `disabled`.
- IconButton은 `aria-label` 필수(Figma의 숨겨진 Label). 아이콘은 `aria-hidden`.
- Focus: Figma에 정의 없음 → 브라우저 기본 포커스 링 유지.
- 자동 검사: 위반 0.

### Input · Textarea · Search Field
- `<label for>`로 라벨 연결, 라벨이 없으면 `aria-label` 사용.
- Error = `aria-invalid="true"`, 메시지(와 Textarea 카운터)는 `aria-describedby`로 연결.
- Input 비밀번호 표시 토글: `<button aria-pressed>` + "비밀번호 표시 / 숨기기" 레이블, Tab으로 접근 가능.
- 지우기(X) 버튼: 마우스 보조 기능이라 Tab 순서에서 제외(`tabIndex=-1`) — 키보드는 전체 선택 후 삭제로 대체.
- Search Field는 `<input type="search">`(검색 상자 역할), Enter로 `onSearch`.
- Focus 표시: Figma Focus 상태(테두리 colors/border/gray-darker)가 포커스 표시 역할을 합니다.
- 자동 검사: 위 색 대비 항목 외 위반 0.

### Checkbox · Radio · Switch
- 네이티브 `<input type="checkbox">` · `<input type="radio">` · `<input type="checkbox" role="switch">`를 `appearance: none`으로
  그대로 보이게 사용 — 체크 상태, 일부 선택(`mixed`), 비활성, 폼 전송, 레이블 클릭이 브라우저 기본 동작입니다.
- 루트가 `<label>`이라 라벨 텍스트가 접근 가능한 이름이 됩니다. 라벨이 없으면 `aria-label` 필요.
- 키보드: Space로 전환, Radio는 같은 그룹 안에서 방향키로 이동 · 선택.
- `CheckboxGroup`은 `role="group"`, `RadioGroup`은 `role="radiogroup"`(+ `aria-required` / `aria-disabled`) — `aria-label` 또는 `aria-labelledby`로 이름 지정.
- Focus: Figma 정의 없음 → 입력 요소 자체의 브라우저 기본 포커스 링.

### Select
- react-aria-components의 버튼 + 리스트박스 팝업 패턴: 트리거 `<button aria-haspopup="listbox" aria-expanded>`, 목록 `role="listbox"`, 항목 `role="option"` + `aria-selected` / `aria-disabled`.
- 라벨(`<label>`)과 선택값이 트리거의 이름, 메시지가 설명(`aria-describedby`). Read-only는 숨은 "읽기 전용" 설명 추가.
- 키보드: Enter · Space · ↓ · ↑로 열기, 방향키 · Home · End · 타입어헤드 이동, Enter 선택, Esc 닫기, 닫히면 포커스가 트리거로 복귀.
- `name`이 있으면 숨은 네이티브 `<select>`로 폼 값 · `required` 검증.
