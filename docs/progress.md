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
| 2 | Select · Checkbox · Radio · Switch · Slider · Segmented Control · Chip | 완료 |
| 3 | Date Picker · File Uploader (Combobox: Figma 삭제) | 완료 (Loading 포함) |
| 4 | Link · Navigation · Tab · Pagination · Breadcrumb · Stepper · Dropdown Menu | 진행 (Link · Tab · Pagination 완료) |
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
| Checkbox | 36 | 36/36 | 36/36 | 36/36 | 통과 |
| Radio | 24 | 24/24 | 24/24 | 24/24 | 통과 |
| Switch | 16 | 16/16 | 16/16 | 16/16 | 통과 |
| Select (select · listbox · option · select_message) | 21 + 3 + 15 + 3 | 42/42 | 42/42 | 42/42 | 통과 |
| Slider (slider · handle) | 2 + 5 | 7/7 | 7/7 | 7/7 | 통과 |
| Segmented Control (control · item) | 3 + 18 | 21/21 | 21/21 | 21/21 | 통과 |
| Chip (chip-multi · chip-input · chip-filter) | 24 + 12 + 48 | 84/84 | 84/84 | 84/84 | 통과 |
| Date Picker (trigger · message · calendar · day · navigation) | 21 + 3 + 1 + 7 + 8 | 40/40 | 40/40 | 40/40 | 통과 |
| File Uploader (dropzone · item) · Loading | 5 + 3 · 2 | 10/10 | 10/10 | 10/10 | 통과 |
| Link | 15 | 15/15 | 15/15 | 15/15 | 통과 |
| Tabs (tab_filled · tab_line) | 60 + 30 | 90/90 | 90/90 | 90/90 | 통과 |
| Pagination (pagination · item · control) | 3 + 24 + 48 | 75/75 | 75/75 | 75/75 | 통과 |

수동 검토 필요: listbox `scroll` 표시(스크롤바로 구현, 자동 비교 제외 — figma-issues F9).
수동 검토 필요: File Uploader 점선 테두리(Figma는 변마다 대시 간격을 맞춤 — F30).
검증 스토리에서만 Figma 예시에 맞춘 항목: Slider 단위 상자 24px(F14) · 숫자 필드 23px(F15), 핸들 x 제외(F16).
알려진 렌더링 차이(실패 아님): option md Disabled 밑줄 위치(Figma auto 밑줄이 약 1.5px 아래, F6) ·
WebKit select md Disabled 저대비 글자의 무게중심 측정 노이즈(이미지 동일).

## 다음 작업

Phase 4 나머지 — Navigation(item_parent 180:5246, item_link 180:6174, item_child 180:6249) → Tab(tab_filled 91:5000, tab_line 91:5241) →
Pagination(132:871, 132:520, 132:604) → Breadcrumb(712:5106, 710:4794) → Stepper(179:2043, 203:3949, 179:1621, 203:3708, 179:1614, 203:4253) →
Dropdown Menu(dropdownmenu_item 179:4819, line 179:5082).

**결정 필요 — Figma 원본 변경**: Phase 3 중 원본이 바뀌었습니다(Button Secondary Solid 신설 등, [token-diff.md](./token-diff.md)
"Figma 원본 변경 감지"). 스냅샷은 동결(Primitive 추가 7개만 반영)했고, 이후 받은 기준 이미지의 Hover 배경(#f5f6f7)과 코드(#f9fafb)는
채널당 4 단계 다를 수 있습니다(현재 픽셀 임계값으로는 실패하지 않음).

검증 도구: `npm run verify:all`(전 컴포넌트 × 3 엔진 요약), `npm run verify:a11y`(axe, 전 스토리), `npm run verify:button`.
`figma/verify/*.json` 옵션 — `story` 배열(`id&args=key:value`), `ignore`(수동 검토 레이어), `maskPixels`(픽셀만 제외),
`knownDifferences`(문자열 또는 엔진별 객체), `glyphDxTolerance`, part의 `compare` · `optional`.

## 미해결 이슈

- 색 대비: Figma 토큰 일부가 WCAG AA(4.5:1) 미만 — [accessibility.md](./accessibility.md).
