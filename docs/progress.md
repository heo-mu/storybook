# 진행 기록 — 전체 컴포넌트 구축

후속 세션은 이 문서의 **다음 작업**부터 이어서 진행합니다. 완료 기준은 [component-inventory.md](./component-inventory.md)의 "완료" 정의를 따릅니다.

## 작업 방식 (모든 컴포넌트 공통)

1. Figma 분석 — `figma/scripts/analyze-set.figma.js`를 `use_figma`로 실행(SET_ID 교체, 읽기 전용).
   대표 Variant의 레이어 트리 + 속성별 차이 + 상호작용 잔차를 받는다.
2. 아이콘 — 필요한 아이콘을 `exportAsync({format:'SVG_STRING'})`로 받아 `src/icons/index.ts`에 추가(fill → currentColor).
3. 구현 — `src/components/<Name>/`에 컴포넌트, CSS(Figma 변수 바인딩 그대로), `index.ts`. `src/index.ts`, `src/styles.css`에 등록.
4. 스토리 — `<Name>.stories.tsx`(매니페스트용 사용 스토리), `stories/<Name>.showcase.stories.tsx`
   (Overview · VariantMatrix · States · Interaction · Accessibility, `!manifest`), `<Name>.mdx`(Usage).
   Variant Matrix의 각 셀은 `data-figma="<정확한 Figma Variant 이름>"` 래퍼로 감싼다.
5. 검증 데이터 — `figma/scripts/export-geometry.figma.js` 결과를 `figma/geometry/<set>.json`에, `get_screenshot`을
   `figma/reference/<set>.png`에 저장. `figma/verify/<component>.json`에 Figma 레이어 경로 → DOM 선택자 매핑.
6. 검증 — `node scripts/verify-figma.mjs <component>`(Chromium 기준), `--browser=firefox|webkit`, `npm test`,
   MCP `test-run`(a11y 포함). 그룹 완료 시 `npm run verify:button`, typecheck, lint, build 회귀.
7. 문서 — 인벤토리 상태, figma-issues, accessibility, 이 문서 갱신 후 커밋.

> `get_metadata`는 이제 컴포넌트 내부 레이어를 돌려주지 않으므로(심볼만) 파트 위치는 5번 스크립트로 받는다.

## Phase 상태

| Phase | 대상 | 상태 |
| --- | --- | --- |
| 0 | 토큰 최신화 · 인벤토리 | 완료 (0c7fcfa) |
| 1 | Input · Textarea · Search Field | 완료 |
| 2 | Select · Checkbox · Radio · Switch · Slider · Segmented Control · Chip | 미착수 |
| 3 | Date Picker · File Uploader (Combobox: Figma 삭제) | 미착수 |
| 4 | Link · Navigation · Tab · Pagination · Breadcrumb · Stepper · Dropdown Menu | 미착수 |
| 5 | Badge · Progress · Alert · Toast · Tooltip · Empty State | 미착수 |
| 6 | Dialog · Accordion (Popover · Drawer: Figma 삭제) | 미착수 |
| 7 | Table · Card · Chart · Loading | 미착수 |
| 8 | Dashboard components | 미착수 |
| 9 | 통합 QA | 미착수 |

## 검증 현황

| 컴포넌트 | Figma Variant | Chromium | Firefox | WebKit | 스토리 테스트 |
| --- | --- | --- | --- | --- | --- |
| Button / IconButton / TextButton | 296 | 296/296 | 296/296 (너비 <1px fallback) | 296/296 (〃) | 통과 |
| Input | 21 | 21/21 | 21/21 | 21/21 | 통과 |
| Textarea | 14 | 14/14 | 14/14 | 14/14 | 통과 |
| Search Field | 36 | 36/36 | 36/36 | 36/36 | 통과 |

## 다음 작업

Phase 2 — Select부터. `react-aria-components`(헤드리스, 스타일 없음)를 설치해 Select · Checkbox · Radio · Switch ·
Slider · Segmented Control의 키보드·포커스·ARIA 동작에 사용하고, 시각 스타일은 Figma 변수만 사용한다.

## 미해결 이슈

- 색 대비: Figma 토큰 일부가 WCAG AA(4.5:1) 미만 — [accessibility.md](./accessibility.md).
