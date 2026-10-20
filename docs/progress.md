# 진행 기록 — 전체 컴포넌트 구축

후속 세션은 이 문서의 **다음 작업**부터 이어서 진행합니다. 완료 기준은 [component-inventory.md](./component-inventory.md)의 "완료" 정의를 따릅니다.

## Codex 인수인계 · Storybook 콘텐츠 개선 (2026-10-20)

- 시작 HEAD: `0aef52d`. 기존 체크포인트와 작업 트리의 도움말 비활성 상태·검증 스크립트·Figma 기준 변경을 보존했습니다. 이번 커밋에는 콘텐츠 개선분만 포함합니다.
- 인수인계 정정: 아래 검수 준비의 ② Storybook 동기화는 `0aef52d`에서 완료됐습니다. 기존 보고서의 396·408 Story 수는 과거 시점 기록이며, 현재는 **423 Story + 86 문서**입니다.
- 기존 3엔진 정합성 보고서 확인: Chromium·Firefox·WebKit 각각 36개 보고서, 864개 렌더링, issues·missing 0. 생성 시각은 2026-10-20 14:04–14:14 KST입니다. 수동 검토 예외를 자동 PASS로 바꾸지 않았으며, 이번 문구 작업에서는 전체 시각 정합성 검사를 재실행하지 않았습니다.
- 메뉴: `Foundations / Components / Examples`, 컴포넌트 탐색은 이름순, Usage를 먼저 배치합니다. Playground·States·Variants·Gallery와 의미별 상태 이름을 사용하고 기존 509개 ID를 유지합니다.
- 문서: 목적·사용 예시·Props·사용 규칙 중심으로 정리했습니다. Figma 변형 수·내부 참조는 기존 `docs/components/`로 옮겼습니다. Table의 여러 줄 편집 미지원 사항은 명확히 밝혔습니다.
- Figma 읽기 및 편집 API 노출 확인: 로컬 Variables 1,551개(Primitive 623 / Semantic 69 / Component 815 / Theme 44). 읽기 전용 실행만 했으며, 실제 쓰기 성공이나 편집 권한 변경은 검증하지 않았습니다. 토큰·디자인·인터랙션 수정 없음.
- 최종 검증과 실행 환경 이슈는 [final-report.md 16절](./final-report.md#16-codex-인수인계--storybook-콘텐츠-개선-2026-10-20)에 기록합니다.

### 다음 작업

1. **디자인 검수 우선**: 확정한 V-1–V-5의 실제 화면 승인, V-6 차트 점선, V-12 Card 공개 여부, V-13 표 정렬, V-14/F58 여러 줄 편집 정책. 이번 문구 개선으로 디자인 결정을 대신하지 않았습니다.
2. **수동 QA**: 실제 화면 낭독기, 실기기 Safari·모바일, 200% 확대·고대비, 큰 데이터. 기존 자동 검사 통과와 구분합니다.
3. **개발 환경**: Storybook MCP 전체 테스트는 프로세스 힙 한도를 8GB로 늘린 뒤 정상 응답을 확인했습니다. 기본 4GB 한도에서의 메모리 문제는 추후 조사 대상으로 남깁니다. 실행 방법은 최신 보고서를 참고합니다.
4. 버전·배포·정식 릴리스는 별도 승인 후 진행합니다.

## Vercel 검수 준비 (2026-10-20, 진행 중)

체크포인트 `checkpoint/pre-review-prep`(6c9dc87). 순서: ① Figma 수정(V-1 – V-5) → ② Storybook 동기화 → ③ 변경 범위 검증(F58 · 글자 색 기준 · 접근성 미판정 · 경고) → ④ 문서 · QA 체크리스트.
- ① **완료** — 정책 확정과 Figma 제작: 도움말 Helper(메시지 4세트 · 필드 4세트 `Helper` 속성), 주의 Warning(alert · toast, 변수 3개), 처리 중 · Dialog 크기는 기존 구조로 확정(Rules 행),
  묶음 오류(Rules 행 · Form 예시), F94 · F95 결함 수정. 체크섬 8그룹 일치, 필드 세트 geometry 변화 없음, 기준 이미지 4개 재캡처 — [figma-fix-requests.md W절](./figma-fix-requests.md#w-검수-준비--v-1--v-5-디자인-정책-확정-2026-10-20-사용자-승인-작업).

## v1.0 테스트 후보 준비 (2026-10-20, 완료)

체크포인트 `checkpoint/pre-v1-candidate`(2c7dc48). 순서: ① Figma 독립 점검 · 보완 → ② Storybook 동기화 → ③ 전체 QA → ④ v1.0 후보 정리.
재개: `git log --oneline checkpoint/pre-v1-candidate..`, 이 절과 [v1.0-candidate.md](./v1.0-candidate.md).
- ① **완료** — 토큰: 모든 변수 WEB code syntax, 색 변수 범위(scopes) 정리, 필수 표시 · 파일 실패 토큰 5개, 효과 스타일 2개(같은 값).
  바인딩: 입력 칸 값 · 빈 글자 72곳(E1 · E3), F77 · F13 · F18 · F86(컴포넌트) · F87 해결, 초기화 아이콘 대비 문제 해결. 상태: 필수 입력(`Required`, 4세트 80변형),
  파일 실패(`State=Error`). 결함: select Focus 속성 연결(F89), input 눈 아이콘 기본값(F90), 예시 이름 · 설명(F91).
  예시: Form · Dashboard · Table 목록 화면(섹션 "사용 예시 화면"). 정책 표 3행. 검증: 컴포넌트 결합 감사 0건(손잡이 레이어 흐림은 의도), 색 변수 ALL_SCOPES 0,
  code syntax 누락 0, 체크섬 8그룹 일치, 화면 확인(스크린숏). 남은 결정 V-1 – V-12.
- ② **완료** — 코드: 입력 칸 글자 색을 Figma가 쓰는 `value/*` · `placeholder/*` 토큰으로(값 같음), Slider · Segmented 그림자 → 효과 스타일 토큰,
  `required`(Input · Textarea · Select · DatePicker — 라벨 뒤 점 + 입력 요소 required, Select는 버튼 설명 "필수"), FileUploaderItem `status="error"`,
  표 칸 내용 가운데 정렬(모든 Figma 표 칸이 CENTER), Breadcrumb Open Hover · Pressed 글자 색(`label/focus`) 특이도 버그 수정.
  스토리: 필수 표시 검증 스토리 4개, 항목 매트릭스 Error, 사용 예시 3쪽(`사용 예시/입력 화면 · 대시보드 화면 · 목록 화면`, Figma 예시와 같은 구성 · 상호작용 테스트).
  기준: 71세트 기준 이미지 재캡처(10-19 글자 색 변경이 기준 이미지에 빠져 있었음 — 글자는 픽셀 비교에서 제외돼 놓침), 입력 칸 4세트 · 파일 항목 · Breadcrumb geometry.
  검증 강화: verify-figma에 **글자 색 비교** 추가(글자 상자의 가장 진한 픽셀, 채널 차 ≤ 40 — 옛 기준 이미지로 실패하는지 먼저 확인).
  이 검사와 전체 검증으로 찾은 Figma 문제를 Figma에서 먼저 고침: F33(Breadcrumb 펼침 변형을 정책대로), F92(파일 실패 변형 이름 속성 연결), F93(① 바인딩 때 빠진 누름 원 불투명도),
  Dashboard 예시 범례 "유형" → "이번달 · 저번달". 결과: 스토리 테스트 408/408, Chromium 정합성 전체 통과(Breadcrumb · Slider 수정 후).
- ③ **완료** — 3 엔진 정합성 108/108(71세트 · 858변형, 수동 검토 3), Button 352 × 3, 스토리 408 · axe 위반 0, 포커스 · 툴팁 · FilterChipSelect 탐침, 외부 앱(npm pack) 3 엔진,
  정적 빌드 문서 · 스토리 문구 · 콘솔 검사, Figma 체크섬 · 컴포넌트 속성 76개 재확인(QA 중 변경 없음). 고친 것: 글자 색 판정의 엔진별 기준(Firefox · WebKit은 같은 색의 농도 차만),
  `Table` `id` 타입(외부 앱에서 발견), 브라우저에서 React Aria 목록보다 먼저 찾던 상호작용 테스트 3개, browser-support.md 갱신. 결과 표: [v1.0-candidate.md 8절](./v1.0-candidate.md#8-시험-결과).
- ④ **완료** — [v1.0-candidate.md](./v1.0-candidate.md)(범위 · 토큰 · 상태 · 사용법 · API · 동기화 · 시험 결과 · 남은 문제 · 검토 항목 R-1 – R-7 · 결정 V-1 – V-13),
  CHANGELOG "v1.0 테스트 후보 rc.1", sync-status.md 재생성, 로컬 태그 `checkpoint/v1.0-candidate`. 배포 · Push · 버전 변경 없음.

## Figma · Storybook 문서 · 정책 간소화 (2026-10-20, 완료)

체크포인트 `checkpoint/pre-docs-simplify`(df820dc). 기준: 처음 보는 사람이 용도 · 사용법을 빠르게 이해하고, 개발자는 기술 정보를 쉽게 찾는가.
- 개발 문서 먼저(5540bad): 이전 사용 방법 문서 전체 → `docs/components/<Name>.md`, Figma Rules 상세 · 주석 · 설명 메모 → `docs/policy-details.md`,
  `docs/figma-sync.md`(재매핑) · `docs/README.md`(문서 안내). 검증은 노드 ID가 없으면 세트 이름으로 찾음, Figma 내보내기 스크립트 `SET_NAME`.
- Figma(b791605): Rules 02–09 쉬운 3열 규칙, 10장 · 주석 17개 삭제, 설명 34개 정리, 단어 단위 줄바꿈 — 재조회 · 스크린숏 · 체크섬 확인.
- Storybook: 한국어 사이드바 · 스토리 이름(ID 고정), 사용 방법 37쪽 · 토큰 페이지 · JSDoc · argTypes 한국어 재작성(병렬 4그룹 + Button 기준 예시),
  매트릭스 캡션 한국어(`koLabel` + 정수 px 폭), `figma/component-map.json`으로 API 문서의 Figma 열 유지. 결과 · 검증: [final-report.md 14절](./final-report.md#14-figma--storybook-문서--정책-간소화-2026-10-20-figma-수정-허용-작업).

## Figma × Storybook 전체 동기화 · 완성도 개선 (2026-10-19 밤, 완료)

체크포인트 `checkpoint/pre-full-sync`(4ebef48). 순서: ① Chart 툴팁 버그 → ② Chip Filter 예시 → ③ Storybook 접근성 경고 → ④ 누락 상태 · 동작 · 사용 예
→ ⑤ Figma ↔ Storybook 전체 동기화(차트 토큰 개편 포함) → ⑥ 회귀 · 최종 보고. 재개: `git log --oneline checkpoint/pre-full-sync..`, 이 절의 상태 줄.

- ① **완료**(2397da1) — 원인: `<body>` 포털(position: fixed) 툴팁이 화면 밖 차트에서 화면 가장자리로 밀려 다른 차트 위에 남음(문서 · 쇼케이스의 hover 상태 차트 12개),
  위치는 스크롤 · 크기 변경 때만 갱신. 수정: 툴팁을 그림 영역 안(position: absolute)으로, 배치는 보이는 부분(화면 · 잘림 조상) → 그림 영역 순.
  검증: 다중 차트 페이지 3개(55차트) × 3 엔진 실제 마우스 · 스크롤 · 크기 변경, 스토리 MultipleCharts(마우스 · 빠른 전환 · 키보드 · 스크롤 영역), chart 정합성 통과.
- ② **완료** — `FilterChipSelect`(공개, 추가): chip-filter + listbox · option sm, 다중(닫을 때 적용) · 단일("전체"로 해제), 칩 글자 "필터명: 값, 값".
  Figma: 다중 예시 이름 정리, 단일 선택 예시 추가(1149:6756), Rules 04 "필터 칩 선택" 행, chip-filter 주석, 칩 간격 8 → 4px 정정(Rules 08 · Figma 예시 m-1).
  열린 필터 칩은 Figma처럼 State=Default(react-aria 눌림 무시). 검증: 스토리 테스트 31(다중 흐름 · 단일 · 키보드 · Disabled · 필터 영역), 3 엔진 실제 마우스 · 키보드, chip 정합성 84/84.
- ③ **완료** — 사이드바 경고 25개 스토리(Vitest a11y 'todo' 결과를 수집하는 리포터로 확인) · 6개 규칙을 원인부터 수정: 달력 날짜 칸 이름(숫자 먼저),
  FilterChipSelect 이름(SelectValue), 설명 있는 메뉴 항목 이름, 달력 머리줄 header → div, 여러 nav 고유 이름, 제목만 있는 메뉴 칸 → 정적 마크업,
  Empty 머리글 화면 낭독기 글자, 아이콘 aria-label → role=img. 재실행 394개 모두 통과. verify:a11y를 애드온과 같은 axe 기본 규칙 · 제외 없음으로 강화 → 0.
- ④ **완료** — Figma 76개 세트의 속성 전체를 Usage 문서와 대조(빠진 속성 설명 추가, 남은 것은 이름 없는 Card 부품 2개 → ⑤에서 이름 정리).
  코드 · Figma 보완: SelectOption `checkIcon`(Figma Check Icon), option md Disabled 텍스트 스타일 정정(F6, Figma · 코드), Search Field Solid Error
  오류 테두리(E8, 새 변수 + 3변형), Table Filter 편집 칸 목록 = FilterChipSelect(F76 · R7 · D3, 검증 가림 제거). 남은 디자인 결정 17 → 2
  (F65-a · F75는 ⑤ 차트 · 표 확인). 스토리 395 · a11y 경고 0.
- ⑤ **완료** — 다른 편집자의 차트 토큰 개편(F84) 동기화: 스냅샷(Semantic 69 · Component 725), 생성기 투명도 별칭 → `color-mix()`, 차트 CSS 색 연결,
  범례 · 툴팁 · 간단 선 샘플(“유형” · 10.07–10.11), 툴팁 계열 이름 40–80px, 범례 · 툴팁 글자 정수 px, 기준 이미지 · geometry 재생성 → chart 24 · 범례 3 · 툴팁 1
  3 엔진 통과. Figma: 삭제 변수 참조 91곳 재연결 · code syntax 4개 · 점선 복원 3노드(F85, 확인 필요) · 아이콘 원격 바인딩 7곳 · Card 부품 이름(F88).
  CSS 주석 조기 종료 검사(`npm run lint`), 문서: breaking-changes · CHANGELOG · token-diff · figma-fix-requests S절 · figma-issues F84–F88 · triage,
  Figma 속성 ↔ 문서 대조 전부 언급, 컴포넌트별 상태표 [sync-status.md](./sync-status.md)(37개 단위 6열). 체크섬 8그룹 원본과 일치, 스토리 396 · a11y 경고 0.
- ⑥ **완료** — 전체 회귀: typecheck · lint · build · build-storybook, 스토리 396 · a11y 경고 0 · axe 위반 0, verify:all 108/108, verify:button 352 + 포인터 36 × 3 엔진,
  키보드 포커스 24 × 3 엔진, 다중 차트 툴팁 55차트 × 3 엔진, FilterChipSelect 실제 마우스 · 키보드 × 3 엔진, 외부 프로젝트(npm pack) × 3 엔진, 체크섬 8그룹 일치.
  sync-status 재생성(37개 단위 6열 통과), 결과 [final-report.md 13절](./final-report.md#13-figma--storybook-전체-동기화--완성도-개선-2026-10-19-밤-figma-수정-허용-작업).

## 코드 정책 → Figma 공식 정책 작업 (2026-10-19, 완료)

체크포인트 태그 `checkpoint/pre-policy-pass`. 정책 목록 원본: `docs/code-policy-audit.md`(145항목 — 상태 A 45 · 동작 B 85 · 기술 C 15).
그룹 순서: ① Focus 정책(토큰 `colors/border/focus`, 24개 세트 `Focus` 속성, Select Focus 변형, 코드 포커스 링) → ② Figma 정의 보완(Card 효과 · 원격 padding/배경 · Link 텍스트 스타일 · 요일 · Pagination · EmptyState 속성 · Dialog 덮개 · Table 예시) →
③ 동작 정책 코드 반영(그룹 간격 · Toast · Tooltip 지연) → ④ Figma "Design System Rules"(227:3774) 02–10장 + 컴포넌트 주석 → ⑤ Storybook 문서 재분류 → ⑥ 전체 회귀.
재개 방법: `git log --oneline checkpoint/pre-policy-pass..`로 끝난 그룹 확인, `docs/code-policy-audit.md`의 상태 열이 "진행 전"인 항목부터. Figma 쓰기 전 체크섬 · 세트 지문 재조회.

진행: ①–③ 완료(6b38274 · c1e78df). ④ Figma Rules 02–10장(227:3774 · 계속 1100:5082) · 주석 17개(13개 세트) · 대시보드 그림자 효과 스타일 연결 — 완료.
⑤ Usage MDX 37개 "정책" 절 재분류, `docs/code-policy-audit.md`(152항목), triage · issues · fix-requests · accessibility · CHANGELOG · breaking-changes, Select Focus 3변형 검증 추가 — 완료. ⑥ 전체 회귀 — 완료(결과 [final-report.md 12절](./final-report.md#12-코드-정책--figma-공식-정책-2026-10-19-밤-figma-수정-허용-작업)).

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
| Select (select · listbox · option · select_message) | 24 + 3 + 15 + 3 (State=Focus 3 추가, 2026-10-19) | 45/45 | 45/45 | 45/45 | 통과 |
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

**v1.0 테스트 후보(2026-10-20)**: 개발팀 검토 — [v1.0-candidate.md](./v1.0-candidate.md) 10절 R-1 – R-7(버전 번호 포함)과 11절 남은 결정 V-1 – V-13.
디자인 결정이 나면 Figma → 코드 순서로 반영하고 이 문서에 기록합니다.

모든 Phase 완료. 남은 일은 [final-report.md 8절](./final-report.md#8-최종-배포-준비-2026-10-19)의 결정(D1 – D6)과 [Figma 수정 요청](./figma-fix-requests.md)(R1 – R8) 반영,
그리고 배포 승인 후 [release-checklist.md](./release-checklist.md)의 배포 단계입니다. 아래는 이전 결정 항목의 현재 상태입니다.

**F69 — 해결(2026-10-19)**: 공통 토큰 `rounded-[12px]`(Figma 등록 대기)을 추가해 MetricCard · DashboardFilterBar가 사용합니다.

**결정 필요 — Chart(F63 · F65-b)**: 툴팁 위치는 코드 정책입니다. 가로 막대 기본 스타일의 비교 막대는 2026-10-19부터 범례 · 툴팁과 같은
`chart/series/compare`(Figma 수정 요청 R3). 간단 스타일 지난 기간 색(세로 · 가로 다름)은 Figma 그대로입니다.

**결정 필요 — Card(F60 · F61)**: Figma Card 프레임이 숨김이고 그림자가 원격 스타일입니다.

**결정 필요 — Dialog 덮개(F51)**: Figma에 scrim이 없어 투명으로 두었습니다. **Accordion Hover(F50)**: 2026-10-19 Figma에서 통일되어 해소 · 반영.

**결정 필요 — Toast 표시 위치 · 간격 · 시간(F44)**: Figma에 없어 코드 정책으로 정했습니다.

**Breadcrumb 펼친 상태(F33) — 해결(2026-10-20)**: Figma 펼침 변형을 정책(Rules 05)대로 고쳤습니다 — 현재 페이지 항목 Role=Current, 메뉴는 … 항목 아래 2px 시작 정렬(figma-issues.md F33).

**Figma 원본 변경(F31) — 동기화 완료(2026-10-19)**: 스냅샷 체크섬 8그룹이 원본과 일치하고 Button 352개 · 기준 이미지가 최신입니다.
Primary · Outline 테두리 변수(원본에서 삭제)만 결정 D1 대기입니다.

검증 도구: `npm run verify:all`(전 컴포넌트 × 3 엔진 요약), `npm run verify:a11y`(axe, 전 스토리), `npm run verify:button`.
`figma/verify/*.json` 옵션 — `story` 배열(`id&args=key:value`), `ignore`(수동 검토 레이어), `maskPixels`(픽셀만 제외),
`knownDifferences`(문자열 또는 엔진별 객체), `glyphDxTolerance`, `accumulatedFallback`(calc-size 없는 엔진에서 라벨 수만큼 너비 허용), `figmaPrefix`(한 스토리에 여러 세트), `maskRectsFor`(변형별 픽셀 제외 영역), `variantReferences`(소수점 위치 변형을 개별 스크린샷과 비교), `skipVariants`(비교 제외 · 수동 검토 표시), `glyphDyTolerance`, `glyphTolerances`(레이어 glob별 dx · dy 허용치와 이유), `pixelTolerance`(숫자 또는 엔진별 객체 + `//pixelTolerance` 이유), `hugNodes`, `geometryOnly`(기준 이미지 없음), part의 `compare` · `optional`.
레이어 경로 glob: `*`는 경로 한 단계 안, `**`는 여러 단계.

## 미해결 이슈

- 색 대비: Figma 토큰 일부가 WCAG AA(4.5:1) 미만 — [accessibility.md](./accessibility.md).
