# 진행 기록 — 전체 컴포넌트 구축

후속 세션은 이 문서의 **다음 작업**부터 이어서 진행합니다. 완료 기준은 [component-inventory.md](./component-inventory.md)의 "완료" 정의를 따릅니다.

## 코드 정책 → Figma 공식 정책 작업 (2026-10-19 시작, 진행 중)

체크포인트 태그 `checkpoint/pre-policy-pass`. 정책 목록 원본: `docs/code-policy-audit.md`(145항목 — 상태 A 45 · 동작 B 85 · 기술 C 15).
그룹 순서: ① Focus 정책(토큰 `colors/border/focus`, 24개 세트 `Focus` 속성, Select Focus 변형, 코드 포커스 링) → ② Figma 정의 보완(Card 효과 · 원격 padding/배경 · Link 텍스트 스타일 · 요일 · Pagination · EmptyState 속성 · Dialog 덮개 · Table 예시) →
③ 동작 정책 코드 반영(그룹 간격 · Toast · Tooltip 지연) → ④ Figma "Design System Rules"(227:3774) 02–10장 + 컴포넌트 주석 → ⑤ Storybook 문서 재분류 → ⑥ 전체 회귀.
재개 방법: `git log --oneline checkpoint/pre-policy-pass..`로 끝난 그룹 확인, `docs/code-policy-audit.md`의 상태 열이 "진행 전"인 항목부터. Figma 쓰기 전 체크섬 · 세트 지문 재조회.

진행: ①–③ 완료(6b38274 · c1e78df). ④ Figma Rules 02–10장(227:3774 · 계속 1100:5082) · 주석 17개(13개 세트) · 대시보드 그림자 효과 스타일 연결 — 완료.
⑤ Usage MDX 37개 "정책" 절 재분류, `docs/code-policy-audit.md`(152항목), triage · issues · fix-requests · accessibility · CHANGELOG · breaking-changes, Select Focus 3변형 검증 추가 — 완료. ⑥ 전체 회귀 — 진행.

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
| 5 | Badge · Progress · Alert · Toast · Tooltip · Empty State | 완료 |
| 6 | Dialog · Accordion (Popover · Drawer: Figma 삭제) | 완료 (Popover · Drawer 구현 불가) |
| 7 | Table · Card · Chart · Loading | 완료 |
| 8 | Dashboard components | 완료 |
| 9 | 통합 QA · 최종 보고 | 완료 ([final-report.md](./final-report.md)) |
| 10 | 전달 전 안정화 (F31 · F65 · F69 분석, 차트 툴팁 · 필터 바 라벨, 이슈 분류, 개발자 문서) | 완료 |
| 11 | 최종 배포 준비 (F31 동기화 · Secondary/Solid, F65 색 통일, F69 토큰, 공개 API 분류, 배포 전 체크리스트) | 완료 — [final-report.md 8절](./final-report.md#8-최종-배포-준비-2026-10-19) |
| 12 | Tertiary 배경 Semantic Token (Figma 수정 + 코드 동기화) | 완료 — [final-report.md 9절](./final-report.md#9-tertiary-배경-semantic-token-2026-10-19-figma-수정-승인-작업) |

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
| Progress | 1 | 1/1 | 1/1 | 1/1 | 통과 |
| Alert | 3 | 3/3 | 3/3 | 3/3 | 통과 |
| Toast | 3 | 3/3 | 3/3 | 3/3 | 통과 |
| Tooltip (화살표 위치 포함) | 4 | 4/4 | 4/4 | 4/4 | 통과 |
| Empty State | 1 | 1/1 | 1/1 | 1/1 | 통과 |
| Accordion | 10 | 10/10 | 10/10 | 10/10 | 통과 |
| Dialog | 1 | 1/1 | 1/1 | 1/1 (제목 글자 위치 기록) | 통과 |
| Table (header · body · key · value · editable) | 3 + 8 + 2 + 2 + 52 | 64/64 (3 수동) | 64/64 (3 수동) | 64/64 (3 수동) | 통과 |
| Card (header · footer · 예시) | 1 + 1 + 1 | 3/3 (위치 · 크기만) | 3/3 (〃) | 3/3 (〃) | 통과 — Figma 프레임 숨김, 픽셀 수동 검토 |
| Chart (chart · legend-item · tooltip) | 12 + 3 + 1 | 16/16 | 16/16 | 16/16 | 통과 — 간단 선 차트 그림 영역 · 차트 안 툴팁 위치 수동 검토 |
| Skeleton | 4 | 4/4 | 4/4 | 4/4 | 통과 |
| Metric Trend | 12 | 12/12 | 12/12 | 12/12 | 통과 |
| Data Freshness | 3 | 3/3 | 3/3 | 3/3 | 통과 |
| Metric Card | 1 | 1/1 | 1/1 | 1/1 | 통과 |
| Data State | 6 | 6/6 | 6/6 | 6/6 | 통과 |
| Dashboard Filter Bar | 1 | 1/1 | 1/1 (calc-size 없음 0.6%) | 1/1 (〃) | 통과 — 초기화 버튼(F31) · "최근 30일" 말줄임(F71) 수동 검토 |

안정화 회귀 검증(2026-10-19): verify:all 108/108, verify:button 296/296 · 포인터 27/27, 스토리 테스트 86 파일 · 374개, typecheck · lint · build ·
build-storybook 통과, axe 374 스토리 그 밖의 위반 0, 외부 프로젝트 타입 검사 · 빌드 · 실행(툴팁 포털 · 화면 경계, "최근 30일" 잘림 없음, 콘솔 오류 0).

Phase 8 그룹 검증 · Phase 9 통합 QA(2026-10-16, 최종 코드): verify:all 36개 컴포넌트(71세트 · 842변형) × 3 엔진 108/108 통과,
verify:button 296/296 · 실제 포인터 27/27, 스토리 테스트 86 파일 · 370개 통과, typecheck · lint · build(토큰 변경 없음) · build-storybook 통과,
axe 370 스토리 — 그 밖의 위반 0(알려진 토큰 대비 400, react-aria 달력 이름 693), 외부 프로젝트(npm pack → Vite 8 + React 19 + TS 6)
타입 검사 · 빌드 · 브라우저 실행(콘솔 오류 0) 통과, Storybook MCP 컴포넌트 매니페스트 44 · 문서 37쪽.

Phase 7 그룹 검증(2026-10-16): verify:all 30개 컴포넌트 × 3 엔진 — 89/90 통과, Chromium date-picker_navigation 1개가 병렬 빌드 · 테스트
실행 중에 1회 실패 → 부하 없이 단독 재실행 2회 모두 40/40 통과. verify:button 296/296 · 실제 포인터 27/27, 스토리 테스트 74 파일 · 337개 통과,
typecheck · lint · build(토큰 재생성 변경 없음) · build-storybook 통과, axe 337 스토리 — 그 밖의 위반 0(알려진 토큰 대비 343, react-aria 달력 이름 693).

Phase 5 · 6 그룹 검증(2026-10-16): verify:all 25개 컴포넌트 × 3 엔진 통과(Phase 5까지), Accordion · Dialog 3 엔진 개별 통과,
verify:button 296/296 · 실제 포인터 27/27, 스토리 테스트 67 파일 · 311개 통과, typecheck · lint · build · build-storybook 통과,
axe 311 스토리 — 그 밖의 위반 0(알려진 토큰 대비 302: Badge Point · Warning · Danger 추가, react-aria 달력 이름 693).

Phase 4 그룹 검증(2026-10-16): verify:all 19개 컴포넌트 × 3 엔진 통과(Chromium Breadcrumb 1회 첫 로드 재렌더 실패 → 재실행 통과,
검증 도구에 detached 재시도 추가), verify:button 296/296 · 실제 포인터 27/27, 스토리 테스트 51 파일 · 257개 통과, typecheck · lint ·
build · build-storybook 통과, axe 262 스토리 — 그 밖의 위반 0(알려진 토큰 대비 210, react-aria 달력 이름 693 — accessibility.md).

수동 검토 필요: listbox `scroll` 표시(스크롤바로 구현, 자동 비교 제외 — figma-issues F9).
수동 검토 필요: File Uploader 점선 테두리(Figma는 변마다 대시 간격을 맞춤 — F30).
수동 검토 필요: Badge Outline 모서리(1px 안쪽 테두리의 모서리 안티에일리어싱이 Figma · 엔진마다 달라 모서리 4px · 둥근 끝만 픽셀 비교 제외).
수동 검토 필요: Table 관리 모드 — Textarea 두 줄 변형 3개(F58), 필드 위 · 아래 테두리 반 픽셀 행과 필드 안 글자(픽셀 비교 제외 영역).
수동 검토 필요: Chart — 간단 선 차트 2개의 그림 영역(Figma 샘플 점이 기간 가운데에 있지 않음, F64 — 픽셀 비교 제외, 화면 확인함),
차트 안 툴팁 위치(코드 정책, F63 — 검증 스토리에서 숨기고 Figma 툴팁 영역 제외, 툴팁 자체는 chart-tooltip 세트로 비교).
수동 검토 필요: Dashboard Filter Bar — 초기화 버튼(Figma Secondary · Solid는 스냅샷 이후 추가, F31 — 픽셀 제외), "최근 30일" 말줄임(F71).
수동 검토 필요: Breadcrumb 펼친 메뉴 위치(Figma는 경로 오른쪽 끝 정렬, 코드는 … 버튼 아래 — F33). 메뉴 크기 200 × 110은 스토리 테스트로 확인.
검증 스토리에서만 Figma 예시에 맞춘 항목: Slider 단위 상자 24px(F14) · 숫자 필드 23px(F15), 핸들 x 제외(F16).
알려진 렌더링 차이(실패 아님): option md Disabled 밑줄 위치(Figma auto 밑줄이 약 1.5px 아래, F6) ·
WebKit select md Disabled 저대비 글자의 무게중심 측정 노이즈(이미지 동일).

## 다음 작업

모든 Phase 완료. 남은 일은 [final-report.md 8절](./final-report.md#8-최종-배포-준비-2026-10-19)의 결정(D1 – D6)과 [Figma 수정 요청](./figma-fix-requests.md)(R1 – R8) 반영,
그리고 배포 승인 후 [release-checklist.md](./release-checklist.md)의 배포 단계입니다. 아래는 이전 결정 항목의 현재 상태입니다.

**F69 — 해결(2026-10-19)**: 공통 토큰 `rounded-[12px]`(Figma 등록 대기)을 추가해 MetricCard · DashboardFilterBar가 사용합니다.

**결정 필요 — Chart(F63 · F65-b)**: 툴팁 위치는 코드 정책입니다. 가로 막대 기본 스타일의 비교 막대는 2026-10-19부터 범례 · 툴팁과 같은
`chart/series/compare`(Figma 수정 요청 R3). 간단 스타일 지난 기간 색(세로 · 가로 다름)은 Figma 그대로입니다.

**결정 필요 — Card(F60 · F61)**: Figma Card 프레임이 숨김이고 그림자가 원격 스타일입니다.

**결정 필요 — Dialog 덮개(F51)**: Figma에 scrim이 없어 투명으로 두었습니다. **Accordion Hover(F50)**: 2026-10-19 Figma에서 통일되어 해소 · 반영.

**결정 필요 — Toast 표시 위치 · 간격 · 시간(F44)**: Figma에 없어 코드 정책으로 정했습니다.

**결정 필요 — Breadcrumb 펼친 상태(F33)**: Figma는 메뉴가 열린 동안 현재 페이지 항목을 Role=Open으로 그렸습니다. 코드는 … 버튼이
메뉴를 열고 현재 페이지는 Current로 둡니다.

**Figma 원본 변경(F31) — 동기화 완료(2026-10-19)**: 스냅샷 체크섬 8그룹이 원본과 일치하고 Button 352개 · 기준 이미지가 최신입니다.
Primary · Outline 테두리 변수(원본에서 삭제)만 결정 D1 대기입니다.

검증 도구: `npm run verify:all`(전 컴포넌트 × 3 엔진 요약), `npm run verify:a11y`(axe, 전 스토리), `npm run verify:button`.
`figma/verify/*.json` 옵션 — `story` 배열(`id&args=key:value`), `ignore`(수동 검토 레이어), `maskPixels`(픽셀만 제외),
`knownDifferences`(문자열 또는 엔진별 객체), `glyphDxTolerance`, `accumulatedFallback`(calc-size 없는 엔진에서 라벨 수만큼 너비 허용), `figmaPrefix`(한 스토리에 여러 세트), `maskRectsFor`(변형별 픽셀 제외 영역), `variantReferences`(소수점 위치 변형을 개별 스크린샷과 비교), `skipVariants`(비교 제외 · 수동 검토 표시), `glyphDyTolerance`, `glyphTolerances`(레이어 glob별 dx · dy 허용치와 이유), `pixelTolerance`(숫자 또는 엔진별 객체 + `//pixelTolerance` 이유), `hugNodes`, `geometryOnly`(기준 이미지 없음), part의 `compare` · `optional`.
레이어 경로 glob: `*`는 경로 한 단계 안, `**`는 여러 단계.

## 미해결 이슈

- 색 대비: Figma 토큰 일부가 WCAG AA(4.5:1) 미만 — [accessibility.md](./accessibility.md).
