# 접근성

각 컴포넌트의 시맨틱 · 키보드 · ARIA 구현과 자동 검사(Storybook a11y = axe-core, Storybook MCP `test-run`) 결과입니다.

## 미해결: Figma 토큰 색 대비

다음 텍스트 색은 Figma 변수 값 그대로 구현되어 있으며 WCAG 2.1 AA 일반 텍스트 기준(4.5:1)에 못 미칩니다.
토큰 값은 Figma가 기준이므로 코드에서 바꾸지 않았습니다 — 디자인 쪽 조정이 필요합니다.

| 용도 | 토큰 | 색 / 배경 | 대비 | 사용처 |
| --- | --- | --- | --- | --- |
| 안내(info) 메시지 | `colors/brand-status/information/strong` (sky/600) | #0086d3 / #fdfdfd | 3.85:1 | Input · Textarea · Select 메시지 |
| 성공(success) 메시지 | `colors/brand-status/success/strong` | #00a63e / #fdfdfd | 3.16:1 | Input · Textarea · Select 메시지 |
| 보조 텍스트 | `colors/text/tertiary` (gray/500) | #778191 / #fdfdfd | 3.87:1 | Textarea 카운터 최대값 |
| 선택 안 된 세그먼트 | `colors/segmented-control/unselected/label/default` (text/tertiary) | #778191 / #eff0f3 | 3.46:1 | Segmented Control |
| 플레이스홀더 | `colors/text/placeholder` (gray/400) | #a1a8b5 / #fdfdfd | 2.35:1 | Input · Textarea · Search Field · Select 플레이스홀더 |

비활성(Disabled) 요소는 WCAG 대비 기준에서 제외됩니다.

### 비텍스트 대비 (WCAG 1.4.11, 3:1)

| 용도 | 토큰 | 색 / 배경 | 대비 | 사용처 |
| --- | --- | --- | --- | --- |
| 선택 컨트롤 테두리 | `colors/checkbox/border/unchecked/default`, `colors/radio/border/unselected/default` (border/gray-subtle) | #a1a8b5 / #fdfdfd | 2.35:1 | Checkbox · Radio 선택 안 함 |
| 스위치 꺼짐 트랙 | `colors/switch/track/off/default` (brand-gray-400) | #a1a8b5 / #fdfdfd | 2.35:1 | Switch 꺼짐 |

라벨 텍스트가 함께 있어 컨트롤의 의미는 전달되지만, 컨트롤 경계 자체는 기준 미만입니다(디자인 조정 필요, figma-issues F12).

## 자동 검사 (axe-core)

`node scripts/a11y-audit.mjs`(Storybook 실행 중)가 모든 스토리를 WCAG 2.0 / 2.1 / 2.2 A · AA 규칙으로 검사합니다.
위 표의 토큰 색 대비는 "알려진 항목"으로 따로 집계하고, 그 밖의 위반은 실패로 처리합니다.

| 시점 | 스토리 | 알려진 토큰 대비 | 그 밖의 위반 |
| --- | --- | --- | --- |
| Phase 2 완료 | 148 | 102 (모두 color-contrast) | 0 |

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

### Slider
- react-aria-components: 핸들 안의 네이티브 `<input type="range">`(role slider, min · max · value)로 스크린리더와 키보드
  (화살표 · Page Up/Down · Home · End)를 지원합니다. Figma에 보이는 라벨이 없어 `aria-label` / `aria-labelledby`가 필요합니다.
- 숫자 필드는 `Input`(이름 `inputLabel`, 기본 "값 입력"), Enter · 포커스 이동 시 확정, ↑ · ↓로 한 단계 이동.
- 값 라벨 · 범위 라벨은 시각 정보이므로 `aria-hidden`(값은 range input이 전달).
- Focus: 핸들에 브라우저 기본 포커스 링 + 값 라벨 표시.

### Segmented Control
- `role="radiogroup"` + 시각적으로 숨긴 네이티브 라디오 — 방향키 이동(비활성 항목 건너뜀), 폼 전송.
- Focus: 선택된 세그먼트에 브라우저 기본 포커스 링.

### Chip · InputChip · FilterChip
- Chip: `<button aria-pressed>`(켜짐 / 꺼짐). 여러 개를 묶을 때는 사용처에서 `role="group"` + 이름.
- InputChip: 칩 전체가 삭제 버튼(이름 = 라벨 + "삭제"), Delete · Backspace로도 삭제 — 12px X 아이콘만 누르는 것보다 큰 대상(WCAG 2.5.8).
- FilterChip: react-aria `Button` — `aria-expanded`(직접 지정 또는 MenuTrigger 등 트리거가 설정), 화살표 방향이 이를 따라감.

### DatePicker · Calendar
- 필드는 `<input>`(라벨 · `aria-invalid` · 메시지 설명), 해석할 수 없거나 선택할 수 없는 날짜를 입력하면 Error 상태 + `aria-invalid`.
- 달력 버튼(이름 "달력 열기", `aria-expanded`)이 Dialog를 열고, Dialog 이름은 필드 라벨입니다. Alt + ↓로도 열립니다.
- Calendar(react-aria): `role="grid"` + 날짜 버튼(이름 예: "2026년 7월 30일 목요일"), 비활성 날짜 `aria-disabled`,
  이전 / 다음 달 버튼 이름은 로캘 문구. 방향키 · Page Up/Down · Home/End.
- `name`을 주면 숨은 input으로 ISO 날짜를 전송합니다.

### FileUploader · FileUploaderItem · Loading
- 드롭 영역은 `<button>`(이름 = 제목, 설명 = 도움말), Enter · Space로 파일 선택 창. 숨은 `<input type="file">`이 폼 값.
- 항목의 "삭제" · "다운로드"는 TextButton, 설명(`aria-describedby`)이 파일 이름. 업로드 중 항목은 `aria-busy` + 스피너.
- Loading은 `role="status"`(라벨 또는 `aria-label`, 기본 "로딩 중"). 회전은 `prefers-reduced-motion`에서 느려집니다.

### Link
- 네이티브 `<a href>`. Visited는 브라우저 `:visited`. `external`이면 `target="_blank"` + `rel="noopener noreferrer"`와
  숨은 안내 문구("(새 창)", `newTabLabel`), 아이콘은 `aria-hidden`.
- Disabled는 `href` 없이 `role="link"` + `aria-disabled="true"` — 포커스되지 않습니다.

### Tabs
- react-aria-components tablist: `role="tablist"` / `tab` / `tabpanel`, `aria-selected`, 패널은 탭 이름으로 연결.
- ← → (세로 배치는 ↑ ↓) · Home · End로 이동, 비활성 탭은 건너뜀. `TabList`에 `aria-label` 필요.

### Pagination
- `<nav aria-label="페이지 이동">` 안의 `<button>`들. 번호 이름 "N 페이지", 현재 페이지 `aria-current="page"`.
- 이전 · 다음 버튼 이름 "이전 페이지" · "다음 페이지", 끝에서는 `disabled`.

### Breadcrumb
- `<nav aria-label="이동 경로">` > `<ol>` > `<li>`. 현재 페이지는 링크가 아닌 텍스트 + `aria-current="page"`.
- 홈 항목은 아이콘만 보이므로 이름 "홈"(`homeLabel`), 구분선(›)은 `aria-hidden`.
- 접힌 경로의 … 버튼: 이름 "중간 경로 보기", `aria-haspopup` · `aria-expanded`, 메뉴 이름은 버튼 이름, 그룹 이름 "상위 경로".
  키보드는 Dropdown Menu와 같습니다.

### Navigation
- `<nav>`(이름은 `aria-label`로 지정) > `<ul>` > `<li>`. 링크는 `<a href>`, 현재 페이지는 `aria-current="page"`.
- 그룹(item_parent)은 `<button aria-expanded aria-controls>`, 접힌 하위 목록은 `hidden`이라 Tab 순서와 접근성 트리에서 빠집니다.
- 아이콘은 `aria-hidden`(장식).

### Dropdown Menu
- react-aria-components menu: 트리거 `aria-haspopup="menu"` · `aria-expanded`, 패널 `role="menu"`, 항목 `menuitem`,
  `DropdownMenuSection title`은 `group`의 이름, 구분선 `separator`. 비활성 항목 `aria-disabled`.
- Enter · Space · ↓ / ↑로 열면 첫 / 마지막 항목에 포커스, 방향키 · Home · End · 글자 입력으로 이동, Esc로 닫고 트리거로 복귀.
- 키보드 포커스는 Figma Hover 모양으로 표시합니다(Figma에 Focus 상태 없음).
