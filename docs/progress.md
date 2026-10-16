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
| 4 | Link · Navigation · Tab · Pagination · Breadcrumb · Stepper · Dropdown Menu | 완료 |
| 5 | Badge · Progress · Alert · Toast · Tooltip · Empty State | 진행 (Badge 완료) |
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
| Dropdown Menu (item · line) | 5 + 1 | 6/6 | 6/6 | 6/6 | 통과 |
| Breadcrumb (breadcrumb · item) | 6 + 12 | 18/18 | 18/18 (너비 누적 fallback) | 18/18 (〃) | 통과 |
| Navigation (item_parent · item_link · item_child) | 4 + 4 + 4 | 12/12 | 12/12 | 12/12 | 통과 |
| Stepper (stepper · indicator · connector × 가로/세로) | 6 + 10 + 4 | 20/20 | 20/20 | 20/20 | 통과 |
| Badge (status · dot · count) | 84 + 21 + 14 | 119/119 | 119/119 | 119/119 | 통과 |

Phase 4 그룹 검증(2026-10-16): verify:all 19개 컴포넌트 × 3 엔진 통과(Chromium Breadcrumb 1회 첫 로드 재렌더 실패 → 재실행 통과,
검증 도구에 detached 재시도 추가), verify:button 296/296 · 실제 포인터 27/27, 스토리 테스트 51 파일 · 257개 통과, typecheck · lint ·
build · build-storybook 통과, axe 262 스토리 — 그 밖의 위반 0(알려진 토큰 대비 210, react-aria 달력 이름 693 — accessibility.md).

수동 검토 필요: listbox `scroll` 표시(스크롤바로 구현, 자동 비교 제외 — figma-issues F9).
수동 검토 필요: File Uploader 점선 테두리(Figma는 변마다 대시 간격을 맞춤 — F30).
수동 검토 필요: Badge Outline 모서리(1px 안쪽 테두리의 모서리 안티에일리어싱이 Figma · 엔진마다 달라 모서리 4px · 둥근 끝만 픽셀 비교 제외).
수동 검토 필요: Breadcrumb 펼친 메뉴 위치(Figma는 경로 오른쪽 끝 정렬, 코드는 … 버튼 아래 — F33). 메뉴 크기 200 × 110은 스토리 테스트로 확인.
검증 스토리에서만 Figma 예시에 맞춘 항목: Slider 단위 상자 24px(F14) · 숫자 필드 23px(F15), 핸들 x 제외(F16).
알려진 렌더링 차이(실패 아님): option md Disabled 밑줄 위치(Figma auto 밑줄이 약 1.5px 아래, F6) ·
WebKit select md Disabled 저대비 글자의 무게중심 측정 노이즈(이미지 동일).

## 다음 작업

Phase 5 나머지 — Progress(185:6518) → Alert(179:6087) → Toast(91:5927) → Tooltip(149:1111) → Empty State(724:14963).

**결정 필요 — Breadcrumb 펼친 상태(F33)**: Figma는 메뉴가 열린 동안 현재 페이지 항목을 Role=Open으로 그렸습니다. 코드는 … 버튼이
메뉴를 열고 현재 페이지는 Current로 둡니다.

**결정 필요 — Figma 원본 변경**: Phase 3 중 원본이 바뀌었습니다(Button Secondary Solid 신설 등, [token-diff.md](./token-diff.md)
"Figma 원본 변경 감지"). 스냅샷은 동결(Primitive 추가 7개만 반영)했고, 이후 받은 기준 이미지의 Hover 배경(#f5f6f7)과 코드(#f9fafb)는
채널당 4 단계 다를 수 있습니다(현재 픽셀 임계값으로는 실패하지 않음).

검증 도구: `npm run verify:all`(전 컴포넌트 × 3 엔진 요약), `npm run verify:a11y`(axe, 전 스토리), `npm run verify:button`.
`figma/verify/*.json` 옵션 — `story` 배열(`id&args=key:value`), `ignore`(수동 검토 레이어), `maskPixels`(픽셀만 제외),
`knownDifferences`(문자열 또는 엔진별 객체), `glyphDxTolerance`, `accumulatedFallback`(calc-size 없는 엔진에서 라벨 수만큼 너비 허용), `figmaPrefix`(한 스토리에 여러 세트), `maskRectsFor`(변형별 픽셀 제외 영역), part의 `compare` · `optional`.

## 미해결 이슈

- 색 대비: Figma 토큰 일부가 WCAG AA(4.5:1) 미만 — [accessibility.md](./accessibility.md).
