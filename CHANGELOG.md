# Changelog

[Semantic Versioning](https://semver.org/)을 따릅니다. 버전 규칙과 업데이트 절차는 [docs/developer-guide.md](docs/developer-guide.md#7-버전-관리와-업데이트-절차).
아직 레지스트리에 배포하지 않았습니다(`"private": true`).

## [Unreleased]

첫 배포 버전 제안: **0.1.0**(외부 배포 전이므로 아래 변경을 첫 버전에 포함) — [docs/breaking-changes.md](docs/breaking-changes.md).

### 접근성 전체 해결 — Figma 토큰 수정 · 전체 동기화 (2026-10-27, Figma 수정 승인 작업)

앞선 플레이스홀더 동기화(825335a)에서 미해결로 남긴 axe 색 대비 위반 105건을 Figma 원본에서 토큰 단위로 고치고 다시 동기화했습니다. 코드는 바인딩을 그대로 따르므로 컴포넌트 CSS 변경은 제거된 토큰을 쓰던 두 곳(Breadcrumb · Toast)뿐입니다.
Figma 변경 기록: [docs/figma-fix-requests.md X절](docs/figma-fix-requests.md).

- **플레이스홀더 · 안내 · 비활성 구분**: Semantic `text/placeholder` → brand-gray/600(#596475, 흰 바탕 5.89:1 · #f5f6f7 5.54:1)로 복귀(A-1). 안내 글자는 `text/tertiary`, 비활성 라벨은 `text/inactive`(gray/400)로 역할을 나눴습니다 —
  `breadcrumb/label/default` · `file-uploader/helper/default` · `stepper/label/title/locked` · `stepper/label/description/locked` → `text/tertiary`(R9–R11 적용). Select · Table 빈 값 안내는 placeholder 유지.
- **Button · IconButton Secondary Solid**: `fill/secondary/strong/hover` → brand/800(#006247, 흰 라벨 7.27:1), `pressed` → brand/900(#004a38, 10.14:1) — Primary Solid(900 → 800 → 700)와 같은 한 단계씩 어두워지는 규칙, 라벨 · 아이콘 흰색 유지. IconButton은 같은 `button/secondary/solid/*` 토큰을 씁니다.
- **F99 드리프트 12개 정리**: Checkbox · Radio 선택 안 함 테두리 `border/gray`(#778191, 비텍스트 3.87:1) · Hover `border/gray-dark`로 복구(A-2, Figma의 gray-subtle 2.35:1은 오류). Tab 밑줄 한 단계 연하게 · Stepper 현재 단계 배경 `fill/primary/strong/default`는 의도된 변경으로 동기화. Toast `label/title` · `label/body` 변수 추가(코드는 title 사용, `label/default` · `close-icon/default`는 삭제됨 → 닫기 아이콘 `icon/tertiary`).
- **Accordion 크기 토큰 복구(F80)**: Figma에서 지워져 바인딩이 끊겨 있던 `spacing·size·border-radius·border-width/accordion/*` 9개를 Component 컬렉션에 다시 만들고 accordion-item 10개 변형의 여백 · 최소 높이 · 구분선 두께 94곳에 다시 연결(값 변화 없음).
- **Breadcrumb**: Figma가 Role=Open 변형과 `label/focus` · `home-icon/current`를 없애 8개 변형만 남음 — 열린 트리거는 `label/pressed`, 현재 항목 아이콘은 라벨 색, 갤러리 Items 행에서 Open 칸 제거, 기하 · 참조 이미지 재내보내기.
- **스냅샷**: `figma/variables/semantic.txt` · `component-others.txt`가 Figma 체크섬과 전 그룹 일치(semantic 38439d42, compOthers 733 89299fb3). 참조 이미지 재내보내기 — button_basic · button_icon · checkbox · radio · tab_line · tab_filled · stepper_indicator(가로 · 세로) · breadcrumb · breadcrumb-item · input · select · textarea · search-field · file-uploader · file-uploader-item · table_value_editable(+4).
- **접근성 결과**: axe 438 스토리 색 대비 위반 105 → **0건**(438 스토리, 알려진 목록 없이 통과) — [docs/accessibility.md](docs/accessibility.md).
- **남은 항목**: Toast가 Figma에서 제목 + 본문 · "닫기" 텍스트 버튼 구조로 바뀜(F101, 별도 구현), `password_field` 새 세트(F99), empty-state · data-state · dashboard-filter-bar · table Date Range Picker의 기존 기하 불일치(이번 변경과 무관).

### 플레이스홀더 색 — Semantic `text/placeholder` 전체 동기화 (2026-10-27)

Figma Semantic 컬렉션(모드 1개)의 `colors/text/placeholder`가 brand-gray/**600 #596475 → 400 #a1a8b5**로 바뀌어(2026-10-19 A-1 대비 개선 이전 값) 스냅샷 · 토큰 · 참조 이미지를 갱신했습니다.
Figma MCP로 별칭 관계를 추적한 영향 범위 — Component 변수 13개(모두 직접 별칭, 간접 별칭 없음): `input/outline/placeholder/default` · `input/outline/label/default` ·
`textarea/outline/placeholder/default` · `select/outline/outline/placeholder/default` · `search-field/{outline,solid}/label/{default,hover}` · `date-picker/trigger/outline/placeholder/default` ·
`breadcrumb/label/default` · `file-uploader/helper/default` · `stepper/label/title/locked` · `table/key-value/value/label/default`.
연결된 Figma 컴포넌트: input · password_field(신규 세트, 코드 미구현) · select · textarea · date-picker_trigger(코드 없음) · search-field · breadcrumb · breadcrumb-item ·
file-uploader(안내 문구 5개 상태) · file-uploader-item(파일 정보) · stepper_indicator Locked · table_value_editable.

- **토큰**: `figma/variables/semantic.txt` 한 줄, `npm run tokens` 결과 `src/tokens/semantic.css`(`--colors-text-placeholder`) · `tokens.json`(해석값 16곳). 컴포넌트 CSS는 모두 토큰을 참조하므로 개별 수정 없음.
  FileUploader Disabled 안내 문구는 앞선 임시 규칙(`label/disabled`)을 걷어내고 Figma 바인딩 그대로 `helper/default`.
- **참조 이미지**: file-uploader · file-uploader-item · input · select · textarea · search-field · breadcrumb · breadcrumb-item · stepper_indicator(가로 · 세로) · table_value_editable(+ 변형 4개).
- **접근성(미해결 — 보고만, 색 재조정 없음)**: axe 감사 438 스토리에서 색 대비 위반 **105건**. 플레이스홀더 용도가 맞는 44건(Select 플레이스홀더 29, Table 편집 칸 빈 값 안내 15)은 Figma 결정으로 기록,
  **용도 오류 43건**(Breadcrumb 상위 경로 링크 27 · FileUploaderItem 파일 정보 11 · Stepper 잠긴 단계 제목 5)은 플레이스홀더 토큰에 잘못 묶인 일반 글자라 Figma 바인딩 수정 요청 R9–R11,
  나머지 18건은 Button Secondary Solid Hover · Pressed 흰 라벨(brand/600 · 500)로 이번 변경과 무관(F100). `KNOWN_CONTRAST`에는 넣지 않음 — [docs/accessibility.md](docs/accessibility.md).

### FileUploader Disabled — Figma 동기화 · 드롭 차단 (2026-10-27)

Figma `file-uploader`(651:3945) State=Disabled를 다시 읽어 비교: 배경 `background/disabled`(surface/container #eff0f3) · 점선 테두리 `border/disabled`(#c9ced6) ·
제목 `label/disabled`(text/inactive #a1a8b5) · 아이콘 `icon/default` · 불투명도 없음 — 구조와 여백은 다른 상태와 같고 코드도 이미 같았습니다.
유일한 차이는 안내 문구: Figma는 `helper/default`(= `text/placeholder`)인데 **Figma 파일의 `text/placeholder`가 brand-gray/400(#a1a8b5)으로 되돌아가 있어**
2026-10-19 승인된 A-1 대비 결정(gray/600 #596475, 5.89:1)과 충돌합니다(9개 컴포넌트 플레이스홀더 · 정보 글자가 2.35:1로 내려감 — [docs/figma-issues.md F98](docs/figma-issues.md)).

- **화면 변경 — Disabled 안내 문구**: 비활성일 때 안내 문구를 `label/disabled`(text/inactive, #a1a8b5)로 — Figma Disabled와 같은 색이며 비활성 컨트롤이라 대비 예외.
  공유 토큰 `text/placeholder`는 A-1 값(gray/600)을 유지해 다른 상태 · 다른 컴포넌트는 변화 없음(토큰 되돌림 여부는 결정 필요, 되돌릴 경우 작업 트리의 미커밋 내보내기 사용).
- **Fixed — 비활성 드롭 차단**: 전에는 비활성 영역에 파일을 놓으면 브라우저 기본 동작(파일 열기)이 그대로였음. 이제 비활성 버튼은 포인터를 받지 않고(`pointer-events: none`)
  바깥 `.ds-file-uploader__root`가 dragenter · dragover · drop을 막아(`dropEffect = 'none'`) "놓을 수 없음" 커서만 보입니다. 클릭 · Enter · Space · Tab 순서 제외 · 파일 선택 창은 기존대로 막힘.
  DOM에 래퍼 `div.ds-file-uploader__root`가 하나 추가됨(`className` · `style` · `id` · ref는 그대로 버튼 · 입력에).
- **스토리 · 문서**: `Disabled` 스토리에 상태 · 차단 검사(play), 사용 방법 문서의 상태 · 접근성 설명. 참조 이미지는 Disabled 변형만 현재 Figma로(나머지 4개는 A-1 상태 유지 — verify 설정 `//reference`).

### DropdownMenu — Figma 메뉴 패널 컴포넌트 동기화 (2026-10-27)

Figma Dropdown Menu(179:2465)에서 예시 프레임이던 메뉴 패널이 컴포넌트 `dropdown-menu`(1440:8454, 200px: 제목 · 아이콘 항목 · 구분선 · 화살표 항목)와
`dropdown-menu-sub`(1440:8455, 140px, 글자만 · "더보기...")로 바뀌었습니다. Figma MCP로 다시 읽어 비교한 결과 `dropdownmenu_item` 5개 변형 · `dropdownmenu_line` ·
`colors/dropdown-menu/*` 변수 20개 · 글자 스타일 · 여백(항목 8/4/8/10 · gap 8 · 모서리 4, 제목 8/8/2/8, 패널 p-1 · 테두리 1px · elevation-3)은 스냅샷과 같아 **컴포넌트 코드와 토큰은 변경 없음**.

- **검증 추가**: 두 패널 컴포넌트를 parity 검사에 포함 — `figma/geometry/dropdown-menu*.json` · `figma/reference/dropdown-menu*.png`(그림자 때문에 원점 8, 7) ·
  `figma/verify/dropdown-menu.json` 세트 2개(`figmaPrefix` menu: · sub:), 갤러리 스토리 `Menu`(components-dropdownmenu-showcase--menu-matrix). 항목 · 제목 · 구분선 · 아이콘 · 화살표 위치와 픽셀이 세 엔진에서 일치.
- **문서**: sync-status · component-inventory에 패널 컴포넌트 반영, Figma 관찰 사항 F97.

### DatePicker 연도 · 월 버튼 — Figma button_text 동기화 (2026-10-27)

Figma `date-picker_header`(144:1377)의 연도 · 월 `button_text` 인스턴스가 **Type=Primary, Size=md, Right Icon(CaretDown)만**으로 바뀌어(이전 Secondary) 그대로 반영했습니다.
Figma MCP로 원본을 다시 읽어 확인: 변수 체크섬(Primitive · Theme · Semantic · Component colors/button*)과 글자 · 효과 스타일은 스냅샷과 같고, button_text 변형 16개의 여백(sm 4/2 · gap 2, md 6/2 · gap 4) · 모서리 4px · 글자 스타일(xs · sm medium) · 토큰 바인딩도 변함없음.

- **화면 변경 — `DatePicker` · `Calendar` 헤더**: 연도 · 월 버튼 글자 `colors/button_text/primary/label/*`(기본 #404b5d, Hover · Pressed #131c2b),
  아이콘 `primary/icon/*`(기본 #778191, Hover · Pressed #404b5d). 전에는 secondary(글자 #596475, 아이콘 #a1a8b5). 배경 Hover · Pressed 토큰은 두 Type이 같아 변화 없음.
  Props · 공개 API · 연도 · 월 선택 동작 · 키보드 조작은 그대로이며, 공통 `TextButton`은 바꾸지 않음(헤더의 `data-variant`만 변경).
- **Focus**: Figma button_text에 새로 추가된 `Focus` 속성(포커스 테두리 — `colors/border/focus` 2px, 버튼 밖 2px, 모서리 8px)은 기존
  `.ds-button-base:focus-visible` 규칙(outline 2px · offset 2px)과 같은 모습이라 코드 변경 없음.
- **스냅샷 · 검증**: `figma/reference/date-picker_calendar.png`를 현재 Figma(세트 1339:6880)로 다시 내보냄(기하 스냅샷은 동일해 그대로). `Year / Month Selection` 스토리에 Primary 색 검사 추가.
  Figma 컴포넌트 설명 "Year/month use Secondary TextButton"은 이제 원본과 다름 — [docs/figma-issues.md F96](docs/figma-issues.md).

### 검수 준비 (2026-10-20, Figma와 함께 · 배포하지 않음)

디자이너 검수 전 남은 핵심 사항 — 디자인 결정 V-1 – V-5를 기존 Figma 디자인 시스템 기준으로 확정해 Figma에 먼저 만들고 코드에 반영했습니다.
Figma 기록: [docs/figma-fix-requests.md W절](docs/figma-fix-requests.md#w-검수-준비--v-1--v-5-디자인-정책-확정-2026-10-20-사용자-승인-작업).

- **Added — 도움말(V-1)**: `messageType` `'helper'`(아이콘 없는 회색 글자, 비활성 칸은 흐린 색) — `Input` · `Textarea` · `Select` · `DatePicker`.
  `FIELD_MESSAGE_TYPES`에 `'helper'` 추가.
- **화면 변경 — 메시지 기본 종류**: `messageType`을 정하지 않은 메시지는 이제 회색 도움말(`helper`)입니다(전에는 파란 `info`). 파란 안내가 필요하면
  `messageType="info"`. 오류(`invalid`)는 그대로 `error`.
- **Added — 주의(V-3)**: `Alert` · `Toast`의 `status="warning"`(주황 삼각형), `ALERT_STATUSES`에 `'warning'`, 아이콘 `WarningFillIcon`,
  토큰 `--colors-alert-status-icon-warning` · `--colors-toast-border-warning` · `--colors-toast-status-icon-warning`. `showToast(…, { status: 'warning' })`는 오류처럼 닫을 때까지 남습니다.
- **Added — 묶음 오류(V-5)**: `CheckboxGroup` · `RadioGroup`의 `invalid` · `message` — 묶음 아래 오류 메시지(메시지만 있으면 도움말), 항목에 `aria-invalid` · 설명.
- **정책 확정(코드 변화 없음)**: 처리 중은 Disabled 버튼 + 옆 `Loading`(sm)(V-2), `Dialog`는 한 가지 크기 420px · 입력이 많으면 화면으로(V-4) — 사용 방법 문서에 반영.
- **Fixed — 접근성**: `BadgeCount`에 `aria-label`이 있으면 `role="img"`(일반 `<span>`의 이름은 읽히지 않을 수 있었음), `FilterChipSelect` 칩 이름이
  라벨을 두 번 읽던 문제("상태 상태" → "상태").
- **Fixed — 콜백**: `DataState onAction` · `FileUploaderItem onRemove` · `onDownload` · `ImageUploadPreview onRemove` · `Toast onClose`에 클릭 이벤트가 넘어가던 문제
  (타입은 인자 없음 — 선택 인자가 있는 함수를 넘기면 이벤트가 들어갔음).
- **스토리**: 도움말 · 주의 · 묶음 오류 사용 예와 검사, 입력 화면 예시에 도움말 · 필수 동의 오류(Figma 예시와 같음).

### v1.0 테스트 후보 rc.1 (2026-10-20, Figma와 함께 · 배포하지 않음)

개발팀 검토용 후보입니다(로컬 태그 `checkpoint/v1.0-candidate`). npm · Storybook 배포와 정식 `1.0.0` 출시는 하지 않았고, `package.json` 버전도 바꾸지 않았습니다(버전 번호는 D2 결정). 후보 범위 · 시험 결과 · 남은 결정: [docs/v1.0-candidate.md](docs/v1.0-candidate.md).
Figma 변경 기록: [docs/figma-fix-requests.md V절](docs/figma-fix-requests.md#v-v10-후보--figma-디자인-시스템-독립-점검--보완-2026-10-20-사용자-승인-작업).

- **Added — 필수 입력**: `Input` · `Textarea` · `Select` · `DatePicker`의 `required` — 라벨 뒤 4px 점(Figma `Required`, 토큰
  `--colors-<칸>-…-required-default`) + 입력 요소 `required`. `Select`는 버튼 설명으로 "필수"를 전달합니다.
- **Added — 업로드 실패**: `FileUploaderItem status="error"`(Figma `State=Error`) — 파일 정보 오류 색, "삭제" 버튼 유지, 버튼 설명에 실패 이유.
  `FILE_UPLOADER_ITEM_STATUSES`에 `'error'` 추가.
- **Added — 사용 예시**: Storybook `사용 예시/입력 화면 · 대시보드 화면 · 목록 화면`(Figma 사용 예시 화면과 같은 구성).
- **Added — 토큰**: 필수 표시 4개 · `--colors-file-uploader-helper-error`, 효과 `--effect-elevation-segmented-selected` · `--effect-elevation-slider-handle`
  (기존 그림자와 같은 값).
- **화면 변경 — 표**: `Table` 머리글 · 본문 칸 내용을 가운데 정렬(모든 Figma 표 칸 · 예시와 같음). 열마다 다른 정렬(긴 글 왼쪽 · 숫자 오른쪽) 옵션은 검토 항목입니다(V-13).
- **Added — 표 `id`**: `TableProps`에 `id`(실행 시에는 이미 `<table>`에 전달됐지만 타입이 막고 있었음 — 외부 프로젝트 점검에서 발견). `aria-controls` 대상 등에 씁니다.
- **Fixed**: `BreadcrumbItem open`에 마우스를 올리거나 누를 때 글자 색이 기본 색으로 바뀌던 문제(Figma Role=Open Hover · Pressed는 `label/focus`).
- **내부**: 입력 칸 글자 색이 Figma가 연결한 `…-value-*` · `…-placeholder-*` 토큰을 씁니다(값 같음, 화면 변화 없음).
- **스토리**: 상호작용 테스트 3개(DropdownMenu 접근성 · Table 동작 · 목록 화면)가 React Aria 목록이 그려질 때까지 기다립니다 — Storybook 화면에서 실패로 표시되던 문제(테스트 실행은 통과).
- **검증 도구**: `verify-figma`가 글자 색도 비교합니다(글자 상자의 가장 진한 픽셀. Chromium은 채널 차 ≤ 40, Firefox · WebKit은 같은 색의 안티에일리어싱
  농도 차이만 허용). Figma 기준 이미지 전체(71세트) 재캡처.

### 문서 · 정책 간소화 (2026-10-20, Figma와 함께)
처음 보는 사람도 바로 이해할 수 있게 Figma · Storybook의 설명을 정리하고, 기술 정보는 개발 문서로 옮겼습니다([docs/README.md](docs/README.md)).
컴포넌트 · Props · 타입 · 토큰은 바뀌지 않았습니다.
- **Storybook**: 사이드바 · 스토리 이름 한국어(`컴포넌트/<Name>/사용 방법` · `전체 보기` · `직접 체험` · `비활성` …). 스토리 ID는 그대로(`id` 고정) —
  자동 생성 컴포넌트 문서 페이지만 `…--docs` → `…--문서`. 사용 방법 37쪽 · 디자인 토큰 페이지를 쉬운 한국어로 다시 썼고 Figma 노드 · 변수 ID,
  버전명, 변형 수, 작업 이력, 정책 항목 ID, 내부 파일 경로를 뺐습니다. Props 설명 · 컴포넌트 설명(JSDoc)도 한국어.
- **개발 문서**: 컴포넌트별 개발 노트 [docs/components/](docs/components/)(Figma ↔ Props, 토큰, 정책 항목, 구현 세부), 정책 상세 기준
  [docs/policy-details.md](docs/policy-details.md), Figma 동기화 · 재매핑 절차 [docs/figma-sync.md](docs/figma-sync.md).
- **Figma**: Design System Rules 02–09장을 짧은 규칙(정책 · 적용 대상 / 사용 규칙 / 디자인 기준)으로, 10장(개발 구현 세부) 삭제, 기술 주석 17개 삭제,
  컴포넌트 설명 정리 — [docs/figma-fix-requests.md T절](docs/figma-fix-requests.md#t-정책--설명-간소화-2026-10-20-사용자-승인-작업).
- **검증 도구**: Figma 세트를 노드 ID가 없으면 이름으로 찾음(복제 · 새 버전 파일), `figma/component-map.json`(컴포넌트 ↔ 세트 이름), Figma 내보내기 스크립트 `SET_NAME`.

### Figma × Storybook 전체 동기화 (2026-10-19 밤, Figma와 함께)
Figma 변경 기록: [docs/figma-fix-requests.md S절](docs/figma-fix-requests.md#s-figma--storybook-전체-동기화-2026-10-19-밤-사용자-승인-작업),
호환성: [docs/breaking-changes.md](docs/breaking-changes.md), 컴포넌트별 상태: [docs/sync-status.md](docs/sync-status.md).
- **Fixed — Chart 툴팁**: 화면 밖 차트의 툴팁이 화면 가장자리로 밀려 다른 차트 위에 남던 문제. 툴팁을 `<body>` 포털 대신 자기 그림 영역 안에 그리고,
  보이는 부분(화면 · 잘림 조상 ∩ 그림 영역) 안에 배치합니다(CHAR-01 · CHAR-08). 다중 차트 스토리 `MultipleCharts` 추가.
- **Added — `FilterChipSelect`**: 필터 칩 + 선택 목록(다중: 닫을 때 적용 / 단일: 고르면 적용 · "전체"로 해제), 칩 글자 "필터명: 값, 값"(`filterChipText`).
  Table 편집 칸 Filter 목록도 이 컴포넌트(F76).
- **Added**: `SelectOption checkIcon`(Figma Check Icon), `TableEmptyColumn aria-label`.
- **접근성**: Storybook 사이드바 경고 25개 스토리 → 0(원인 수정 — 달력 날짜 칸 이름, 메뉴 항목 이름, 빈 표 머리글, 아이콘 `role="img"`, 고유 nav 이름 등).
  `npm run verify:a11y`가 애드온과 같은 axe 기본 규칙 · 제외 없음.
- **화면**: Select 옵션 md Disabled 글자(F6), Search Field Solid 오류 테두리(E8, 새 토큰 `--colors-search-field-solid-border-error`).
- **Chart 토큰 개편 동기화(F84)** — **호환성 변경**: `--colors-chart-bar-*` → `-gradient-start/end-default`, `--colors-chart-line-*` → `-default`,
  `--colors-chart-legend-label-default` → `--colors-chart-label-legend-default`, Semantic `--colors-chart-grid-default` · `--colors-chart-simple-*` 삭제,
  계열 02 · 03 · 04 토큰 추가. 격자 · 기준선 #d6dae0, 툴팁 배경 불투명, 툴팁 계열 이름 최소 40 · 최대 80px. 토큰 생성기가 Figma 투명도 별칭을
  `color-mix()`로 생성.
- **Lint**: `npm run lint`가 CSS 주석이 `*/`로 일찍 닫히는 경우를 찾습니다(`scripts/check-css-comments.mjs` — 차트 그라디언트 규칙이 버려졌던 원인).

### 코드 정책 → Figma 공식 정책 (2026-10-19, Figma와 함께)
코드에만 있던 정책 152개를 Figma에 정의하거나(변형 · 속성 · 변수 · 스타일 39개, Design System Rules 02–09장 · 주석 96개) 개발 구현(15개)으로
나누었습니다. 남은 Figma 반영 대기 2개. 목록 · 출처 · 상태: [docs/code-policy-audit.md](docs/code-policy-audit.md).
- **Added**: 토큰 `--colors-border-focus`(brand/700) · `--colors-dialog-scrim-default`(→ `surface/scrim`). Storybook **Foundations / Focus**.
- **포커스 표시**: 모든 포커스 가능한 컨트롤에 키보드 포커스 링(2px `colors/border/focus`, 바깥 2px — 폭을 채우는 행은 안쪽) — Figma 속성 `Focus`.
  Select 닫힌 상태는 Figma State=Focus 테두리. 마우스 클릭에는 그리지 않습니다.
- **Dialog**: 모달 덮개 검정 50%(`colors/dialog/scrim/default`). 토큰 `--colors-surface-scrim` 검정 90% → 50%.
- **Toast**: 한 번에 최대 3개(이전 5), `showToast`의 `status: 'error'` 기본 `timeout`이 `null`(닫을 때까지 유지), 같은 문구 · 상태는 보이는 토스트를 대체.
- **Tooltip**: `delay` 기본값 1500 → 500ms(키보드 포커스는 그대로 즉시).
- **CheckboxGroup · RadioGroup**: 항목 간격 세로 8px · 가로 16px(이전 0 — `style` · `className`으로 준 간격은 그대로 우선).
- **토큰 값**: `--typography-sm-leading-normal-underline-line-height` 140% → 20px(`leading-5`, Link md — 화면은 이미 20px 줄).
- 문서: 모든 Usage의 "코드 정책" 절을 **정책** 절(Figma 정의 · Figma 문서화 · 개발 구현 세부 · Figma 반영 대기)로 재분류.

### 호환성 변경 (Figma 동기화 2026-10-19 — F31)
- **토큰 CSS 변수 삭제 · 이름 변경 17개**: `--colors-button_text-*` 12개 → `--colors-button_text-primary-*`(Secondary는 `-secondary-*` 새로 추가),
  `--colors-accordion-border-focus` → `--colors-accordion-border-hover`, `--colors-button-primary-solid-border-{default,disabled}` · `--colors-button-primary-outline-border-disabled` 3개 삭제
  (`--colors-button-primary-outline-border-default`는 Figma 복구로 유지)
  (Figma에서 변수 삭제). 별칭은 두지 않습니다.
- `BUTTON_TONES`에 Secondary · Solid 추가(3번째) — 이제 내부 API.

### 호환성 변경 — 토큰 이름 규칙 (F81)
- 대괄호가 들어간 Figma 변수 이름은 대괄호를 뺀 CSS 변수로 생성합니다(이스케이프 불필요):
  `--border-radius-rounded-\[2px\]` → `--border-radius-rounded-2px`, `\[5px\]` → `5px`, `\[12px\]` → `12px`. 별칭은 두지 않습니다(배포 전).

### Chart — Component 토큰 · hover 변형 (F78 · F79, 2026-10-19 정합성 개선)
- **Added**: Chart Component 토큰 19개 `--colors-chart-{bar,line,point,plot,label,legend,tooltip}-*`(`src/tokens/components/chart.css`, Figma
  `colors/chart/*` Component 변수). `Chart` · `ChartLegendItem` · `ChartTooltip`의 모든 색이 이 토큰을 씁니다.
- **동작 변경**: 간단 스타일(`variant="simple"`)도 호버 · 탭 · 키보드로 항목을 표시합니다(Figma hover=yes) — 그림 영역이 초점을 받는
  `role="group"`이 됨. 기본 스타일 포함 감지 영역은 데이터 영역만(값 눈금 열 · 가로 막대 눈금 줄 제외), 터치로 탭하면 표시되고 바깥을 누르면 닫힘.
- **화면 변경**: 간단 막대 현재 기간 비교 #0086d3 → #d6dae0(Figma `series/compare`), 간단 세로 막대 Group=no 지난 기간 #d6dae0 → #e2e5e9
  (가로와 같은 `bar/history`), 간단 선 마지막 점은 일반 점(빈 원은 활성 항목), 강조 영역 크기 Figma대로(세로 막대 Group=no 40px · 가로 막대
  32 · 46px 높이 · 간단 48 · 28px).
- `ChartLegendItem type="dash-line"`의 `color` 기본값 `brand` → `02`(Figma 메인 컴포넌트 `line/compare`).

### 접근성 — 색 대비 (A-1 · A-2, 2026-10-19, Figma와 함께 수정)
- **토큰 값 변경**: Theme `brand-status/{point,success,warning,danger,error,information}/strong` 600 → 700, Semantic `text/tertiary` ·
  `text/placeholder` gray/500 · 400 → gray/600, `fill/secondary/strong/hover` · `pressed` brand/600 · 500 → brand/800 · 900.
- **Added**: Semantic `--colors-text-inactive`(gray/400) — 비활성 라벨(Button · TextButton · Chip · Table 편집 칸 · FileUploader · Accordion).
- **Component 토큰 별칭 변경**: 입력 칸(Input · Textarea · Select · DatePicker · SearchField Outline) · Checkbox · Radio 테두리 default/completed/read-only
  `border/gray` · hover `border/gray-dark`, Switch 꺼짐 트랙 500 · 600 · 700, Switch Disabled 라벨 `text/disabled`, EmptyState 제목 `text/secondary` ·
  설명 `text/tertiary`, Stepper 잠긴 설명 `text/tertiary`. MetricTrend Disabled 글자 `text/secondary`, 필터 막대 `|` `border/gray-subtle`.
- 결과: axe 색 대비 423 → 0(알려진 대비 목록 삭제 — 이제 실패로 처리), 컨트롤 경계 2.35 → 3.87:1. 전후 표: [docs/accessibility.md](docs/accessibility.md).

### Fixed
- Component 토큰 파일 머리 주석이 `*/`로 일찍 닫혀 Button 외 Component 토큰 `:root` 규칙이 브라우저에서 버려지던 문제(F81 작업에서 생김, 같은 날 수정).

### Figma 수정 반영 (2026-10-19, [docs/figma-fix-requests.md](docs/figma-fix-requests.md))
- 화면 변화 없는 바인딩 복구: Button Primary · Outline 테두리가 `--colors-button-primary-outline-border-default` 사용(리터럴 #004a38 제거),
  12px 모서리는 Figma 변수에서 생성(등록 대기 목록 비움), `sm/leading-normal/underline`의 자간 · 굵기가 변수 참조(값 같음).
- Table 편집 칸 Filter · Editing 칩이 Selected(쇼케이스 · 기준 이미지).
- Chart 가로 막대 비교 막대: 원본이 `chart/series/compare`로 고쳐져 코드와 일치(개별 기준 이미지).

### 화면 변경
- **Button · IconButton Tertiary / Solid 배경**(Figma 2026-10-19 수정): 새 Semantic 토큰 `colors/fill/tertiary/*` — Default #f5f6f7 → #e9ebee,
  Hover #eff0f3 → #dcdfe4, Pressed #e9ebee → #d0d4db(Disabled 그대로). 페이지 대비 1.06 → 1.17:1 — [docs/analysis/tertiary-fill-2026-10-19.md](docs/analysis/tertiary-fill-2026-10-19.md).
- `fill/secondary/subtle/hover` #f9fafb → #f5f6f7(Figma에서 변경됨) — Button Tertiary / Outline Hover, Navigation 항목 Hover.
- Hover 배경(`fill/primary/subtle/hover`) #f9fafb → #f5f6f7 — Button Outline · TextButton · Checkbox · Radio · Chip · DatePicker · Link · Pagination · Select · Tabs · Table · Accordion.
- **TextButton** `variant="secondary"`: 글자 · 아이콘이 Primary보다 한 단계 연함(Figma `button_text/secondary`).
- **Accordion**: 모든 크기 Hover 배경, 펼친 항목 구분선 `border/hover`, Disabled 배경 `fill/disabled` · 제목 `text/placeholder`(F50 해소).
- **Chart**: 가로 막대 기본 스타일 비교 막대를 범례 · 툴팁과 같은 `chart/series/compare`로(F65 — Figma 수정 요청).

### Added
- 토큰 `--colors-fill-tertiary-default` · `-hover` · `-pressed`(Figma Semantic, Primitive gray/150 · 225 · 275 별칭).
  `--colors-button-tertiary-solid-background-{default,hover,pressed}`는 이 토큰의 별칭으로 바뀜(이름 그대로).
- Storybook **Components / Button / Tertiary Background** — Tertiary 배경 변경 전후 비교.
- **Button · IconButton**: Secondary · Solid(Figma 56개 변형, 352개 전체). `appearance`를 생략하면 Secondary는 이전처럼 Outline.
- `closeToast(key)` — `showToast()`가 돌려준 토스트를 코드에서 닫기.
- 공통 토큰 `--border-radius-rounded-12px`(F69, Figma `border-radius/rounded-[12px]`). MetricCard · DashboardFilterBar가 사용.
- 문서: `docs/public-api.md`(공개 49 · 보조 32 · 사용 금지 내부 API, 자동 생성), `docs/breaking-changes.md`, `docs/figma-fix-requests.md`,
  `docs/release-checklist.md`. `api.md`에 분류 표시.

### Deprecated
- 내부 API로 분류(`@internal`, export는 유지 — 1.0 전 제거 여부 결정): `toastQueue` · `resolveAppearance` · `BUTTON_STATES` · `BUTTON_TONES` ·
  `ButtonToneProps` · `ButtonDisabledProp`, 내부 부품 `PaginationItem` · `PaginationControl` · `BreadcrumbItem` · `BreadcrumbSeparator` ·
  `StepperIndicator` · `StepperConnector` · `NavParentItem`과 그 Props 타입.

### Changed
- **Chart**: 툴팁을 `<body>`로 포털(`position: fixed`)하고, 보이는 그림 영역과 화면 안으로 자동 배치(넘치면 뒤집기 · 가장자리에서 이동, 스크롤 · 창 크기 변경 추적). — 2026-10-19 밤 그림 영역 안 배치로 대체(위 "전체 동기화" 절).
  `overflow: hidden` 부모 안에서도 잘리지 않습니다. 테스트에서 툴팁을 찾을 때는 `document`에서 조회하세요.
- **SegmentedControl**: 라벨이 항목 내용 상자보다 넓으면 Figma처럼 좌우 padding까지 쓰고, 항목 전체보다 넓을 때만 말줄임
  (DashboardFilterBar의 "최근 30일"이 잘리던 문제).

### Added
- 개발자 문서: `docs/developer-guide.md`, 자동 생성 API 문서 `docs/api.md`(`npm run docs:api`), Figma 이슈 분류 `docs/figma-issue-triage.md`,
  재분석 `docs/analysis/`(F31 Button 동기화 영향, F65 차트 비교 색, F69 12px 모서리).

## [0.1.0] — 2026-10-16

첫 구현(배포 전). Figma Component 섹션(58:5174)과 Dashboard components 섹션(728:25472) 전체.

### Added
- 디자인 토큰(Figma Variables · Text · Effect Style 스냅샷에서 생성).
- 컴포넌트: Button · IconButton · TextButton, Input · Textarea · SearchField, Select · Checkbox · Radio · Switch · Slider · SegmentedControl ·
  Chip · InputChip · FilterChip, DatePicker · Calendar · FileUploader · Loading, Link · Navigation · Tabs · Pagination · Breadcrumb · Stepper ·
  DropdownMenu, Badge · Progress · Alert · Toast · Tooltip · EmptyState, Dialog · Accordion, Table · KeyValueTable · Card · Chart,
  Skeleton · MetricTrend · DataFreshness · MetricCard · DataState · DashboardFilterBar.
- Figma 정합성 검증(Button 296 + 842 변형, Chromium · Firefox · WebKit), 스토리 테스트, axe 접근성 감사, Storybook MCP.
