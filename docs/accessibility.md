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
