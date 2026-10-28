# 접근성

각 컴포넌트의 시맨틱 · 키보드 · ARIA 구현과 자동 검사(Storybook a11y = axe-core, Storybook MCP `test-run`) 결과입니다.

## 포커스 표시 — Figma 정의 (WCAG 2.4.7 · 2.4.11 · 1.4.11, 2026-10-19)

키보드 포커스(`:focus-visible`)는 Figma **Design System Rules 02**와 컴포넌트 속성 `Focus`(24개 세트, 숨김 링 레이어)로 정의되어 있고, 코드는 그 값을 씁니다.
링 색 `colors/border/focus`(brand/700 #007c56)는 흰 배경(#fdfdfd) 위 5.14:1, 회색 배경(#eff0f3) 위 4.59:1로 비텍스트 기준 3:1을 넘습니다.
마우스 클릭에는 그리지 않습니다. 모든 컴포넌트에 같은 모양을 쓰지 않고, 컴포넌트 형태에 맞춘 네 가지를 씁니다.

| 형태 | 표시 | 컴포넌트 |
| --- | --- | --- |
| 바깥 링 | 2px 선, 컨트롤 바깥 2px 간격, 모서리 = 컨트롤 모서리 + 4px | Button 3종 · Checkbox · Radio · Switch(상자 · 원 · 트랙만) · Chip 3종 · Link · Tabs(탭 · 패널) · Pagination · Segmented · Slider 손잡이 · File Uploader · Breadcrumb · 달력 날짜 · 이동 · 입력 칸 안 버튼 · Toast 닫기 · 차트 그림 영역 |
| 안쪽 링 | 2px 선, 행 가장자리 안쪽 — 폭을 채우는 행이 이웃 · 부모에 가려지지 않게 | Navigation 항목 · Accordion 트리거 · Table 행 · 칸 · 열 머리글 |
| 테두리 | 링 대신 테두리 `border/gray-darker`(Figma State=Focus), Error와 겹치면 Error 테두리 유지 | Input · Textarea · Search Field · Date Picker · Select |
| Hover 모양 | 목록 안에서 키보드로 이동 중인 항목 — 선택 표시가 우선 | Select 옵션 · Dropdown 메뉴 항목 |

확인: 스토리 `Foundations/Focus`(Keyboard — Tab 이동 중 링 두께 · 색 · 간격 검사), Chromium · Firefox · WebKit에서 17개 컴포넌트의 실제 키보드 포커스 측정,
Figma 링 레이어와 DOM 링의 화면 비교(2026-10-19).

## 시간 · 움직임 · 오버레이 (WCAG 2.2.1 · 2.3.3 · 1.4.13, 2026-10-19)

- **Toast**(Rules 06): 오류 토스트는 닫을 때까지 남고, 안내 · 성공은 5초 이상 · 마우스를 올리거나 포커스가 있는 동안 멈춥니다. 최대 3개, 같은 문구는 겹치지 않습니다.
- **Tooltip**(Rules 05): 마우스 0.5초, 키보드 포커스는 즉시. Esc로 닫힙니다.
- **Dialog**(Rules 05): 모달 덮개(검정 50%)로 뒤 화면 조작을 막고, 포커스를 대화상자 안에 가두며 닫히면 연 요소로 돌려보냅니다.
- **모션**(Rules 09): 상태 전환은 즉시, 반복 모션(스피너)은 `prefers-reduced-motion`에서 1초 → 3초/바퀴.

## 색 대비 — 해결 (A-1 · A-2, 2026-10-19)

Figma 원본과 코드를 함께 고쳤습니다(Figma 수정 허용 작업). 모두 기존 팔레트 안에서 고른 색이고, 기준을 낮추거나 경고를 숨기지 않았습니다.
흰 배경은 `surface/page` #fdfdfd 기준입니다.

### Button Secondary Solid Hover · Pressed — Figma 결정값으로 재발 (2026-10-28)

사용자가 Figma Semantic `colors/fill/secondary/strong/hover` · `pressed`를 brand/600 · 500으로 확정해(F100 종결) 코드를 동기화했습니다. 색은 Figma 값 그대로이며 기준을 낮추거나 `KNOWN_CONTRAST`에 넣지 않았습니다.
axe 감사(444 스토리) 색 대비 위반 **18건** — 모두 아래 두 상태의 흰 라벨(#fdfdfd, 14px normal)입니다. Default(brand/700 #007c56, 5.14:1) · Disabled · Outline은 영향이 없습니다.

| 상태 | 배경 | 흰 라벨 대비 | 기준 | 발견 위치 |
| --- | --- | --- | --- | --- |
| Secondary / Solid Hover | brand/600 #009b68 | **3.51:1** | 글자 4.5:1 미달(비텍스트 3:1은 충족) | Button · IconButton States · Variant Matrix 스토리의 pseudo-hover 칸 |
| Secondary / Solid Pressed | brand/500 #02bb7b | **2.46:1** | 글자 4.5:1 · 비텍스트 3:1 모두 미달 | 같은 스토리의 pseudo-active 칸 |

실제 사용 중에는 마우스를 올리거나 누르는 동안만 나타나는 색이지만, 그동안 라벨이 읽히기 어렵습니다. 디자인 결정(대비 수용 또는 brand/800 · 900 복귀)은 Figma 쪽 판단 대상입니다.

### 미해결 색 대비 위반 — `text/placeholder` brand-gray/400 동기화 이후 (2026-10-27)

**해결(2026-10-27 저녁, Figma 수정 승인 작업)**: `text/placeholder` → brand-gray/600 복귀, 용도 오류 3종은 `text/tertiary`로 재바인딩(R9–R11), Button Secondary Solid Hover · Pressed는 brand/800 · 900. 다시 감사한 결과 색 대비 위반 ****0건**(438 스토리, 알려진 목록 없이 통과)**. 아래 표는 수정 전 분류 기록입니다.

 axe 감사(438 스토리) 색 대비 위반 **105건**(수정 전). 색은 Figma 값 그대로이며 기준을 낮추거나 `KNOWN_CONTRAST`에 넣지 않았습니다.

| 구분 | 건수 | 요소 | 색 (흰 바탕 #fdfdfd) | 판정 |
| --- | ---: | --- | --- | --- |
| 플레이스홀더(용도 맞음) | 29 | Select `.ds-select__value[data-placeholder]` "내용 선택"(Form 예시 · 포커스 예시 포함) | #a1a8b5 2.35:1 | Figma 결정(F98)대로 유지 — 접근성 이슈로 기록. Input · Textarea · SearchField의 `::placeholder`도 같은 색(axe 미검사) |
| 플레이스홀더(용도 맞음) | 15 | Table 키-값 편집 칸의 빈 값 안내 `dd`(`table/key-value/value/label/default`, 코드는 `--ds-field-placeholder`) | #a1a8b5 2.35:1 | 위와 같음 |
| **용도 오류 — 일반 글자** | 27 | Breadcrumb 상위 경로 **링크** 라벨 `.ds-breadcrumb-item__label`(`breadcrumb/label/default` → `text/placeholder`) | #a1a8b5 2.35:1 | 내비게이션 글자가 플레이스홀더 토큰에 묶임 — Figma 바인딩 수정 요청(R9) |
| **용도 오류 — 상태 안내** | 11 | FileUploaderItem 파일 정보 `.ds-file-item__meta`("1.2 MB · 업로드 완료", `file-uploader/helper/default` → `text/placeholder`) | #a1a8b5 2.35:1 | 상태 글자 — Figma 바인딩 수정 요청(R10). 같은 토큰의 FileUploader 안내 문구(#f5f6f7 위 2.21:1)도 포함 |
| **용도 오류 — 단계 이름** | 5 | Stepper 잠긴 단계 제목 `.ds-stepper-indicator__label`(`stepper/label/title/locked` → `text/placeholder`) | #a1a8b5 2.35:1 | 잠긴 단계도 조작 대상이 아닐 뿐 읽어야 하는 글자 — Figma 바인딩 수정 요청(R11) |
| 이번 변경과 무관 | 18 | Button Secondary Solid Hover · Pressed 흰 라벨(`button/secondary/solid/background/hover` → `fill/secondary/strong/hover` brand/600 #009b68 3.2:1, `pressed` brand/500 #02bb7b 2.4:1) — States · Variant Matrix 스토리의 pseudo-hover · pseudo-active 칸 | #fdfdfd on #009b68 · #02bb7b | A-1 기록(brand/800 · 900)과 달리 스냅샷 · Figma 모두 600 · 500 — 별도 이슈(F100), 이번 커밋에서 손대지 않음 |

코드는 Figma 바인딩과 같게 유지합니다(토큰 구조 유지 원칙). 용도 오류 3종은 Figma에서 토큰을 바꾼 뒤 다시 동기화해야 하며, 그때까지 위 43건은 실제 사용자에게 보이는 글자의 대비 미달로 남습니다.

### 텍스트 (WCAG 1.4.3, 4.5:1)

| 용도 | 토큰 | 이전 | 이후 | 사용처 |
| --- | --- | --- | --- | --- |
| 보조 텍스트 | Semantic `text/tertiary` brand-gray/500 → **600** | #778191 3.87:1 (#eff0f3 위 3.46) | #596475 5.89:1 (#eff0f3 위 5.26 · #f5f6f7 위 5.54) | 도움말 · 카운터 · 설명 · Segmented 선택 안 함 · Stepper 설명 · Card · Alert · DataFreshness · 차트 툴팁 제목 등 |
| 플레이스홀더 · 정보 글자 | Semantic `text/placeholder` brand-gray/400 → **600** — **2026-10-27 Figma에서 400으로 되돌림(디자인 결정, F98)**: 코드도 #a1a8b5(2.35:1)로 동기화, A-5 재발 | #a1a8b5 2.35:1 | #596475 5.89:1 → 2026-10-27 #a1a8b5 2.35:1 | Input · Textarea · Select · DatePicker · SearchField 플레이스홀더, Breadcrumb 상위 경로, FileUploader 파일 정보, Table 단위, Stepper 잠긴 단계 제목 |
| 비활성 라벨(기준 제외) | 새 Semantic `text/inactive` = brand-gray/400 | (`text/placeholder`를 같이 씀) | #a1a8b5 그대로 | Button · TextButton · Chip · Table 편집 칸 · FileUploader · Accordion Disabled 라벨 — 플레이스홀더와 분리해 비활성 표시 유지 |
| 잠긴 단계 설명 | `stepper/label/description/locked` text/disabled → text/tertiary | #c9ced6 1.55:1 | #596475 5.89:1 | Stepper Locked(조작 대상이 아니라 비활성 예외 아님 — 잠김은 제목 · 표시 원 · "잠김" 낭독으로 구분) |
| 빈 상태 제목 · 설명 | `empty-state/title` tertiary → **secondary**, `description` placeholder → tertiary | #778191 3.87 · #a1a8b5 2.35 | #404b5d 8.67 · #596475 5.89 | EmptyState · DataState — 제목이 설명보다 한 단계 진한 위계 유지 |
| MetricTrend Disabled | 노드 바인딩 text/placeholder → **text/secondary** | #a1a8b5 / #d6dae0 1.70:1 | #404b5d / #d6dae0 6.28:1 | 회색 배경 · 회색 아이콘으로 비활성 표시 유지 |
| 상태 색(안내) | Theme `brand-status/information/strong` sky/600 → **700** | #0086d3 3.85:1 (배지 배경 위 3.40) | #006cab 5.53:1 (#def2fe 위 4.89) | 메시지 · 배지 · 배지 숫자 · 토스트 · 알림 |
| 상태 색(성공) | `brand-status/success/strong` green/600 → **700** | #00a63e 3.16:1 (#dcfce7 위 2.93) | #008236 4.86:1 (#dcfce7 위 4.50) | 〃 |
| 상태 색(경고) | `brand-status/warning/strong` orange/600 → **700** | #f54900 3.53:1 (#ffedd4 위 3.13) | #ca3500 5.13:1 (#ffedd4 위 4.56) | 〃 |
| 상태 색(포인트) | `brand-status/point/strong` rose/600 → **700** | #ec003f 4.45:1 (#ffe4e6 위 3.77) | #c70036 5.93:1 (#ffe4e6 위 5.02) | 배지 · 필수 표시 |
| 상태 색(위험 · 오류) | `brand-status/danger/strong` · `error/strong` red/600 → **700** | #e7000b 4.69:1 (#ffe2e2 위 3.91 · #f5f6f7 위 4.40) | #c10007 6.31:1 (#ffe2e2 위 5.27 · #f5f6f7 위 5.93) | 오류 메시지 · 테두리, 배지, MetricTrend 하락 — danger · error는 같은 의미라 함께 |
| Button Secondary · Solid Hover · Pressed | Semantic `fill/secondary/strong/hover` brand/600 → **800**, `pressed` brand/500 → **900** | 흰 글자 / #009b68 3.51 · #02bb7b 2.46 | 흰 글자 / #006247 7.27 · #004a38 10.14 | Button · IconButton Secondary · Solid — Default #007c56(5.14)보다 밝아지면 4.5:1을 넘지 못해 상호작용 때 진해지는 방향으로 바꿈 |

각 상태 색은 다음 한 단계(700)로 기준을 넘는 가장 밝은 값입니다. 옅은 배경(100)과 진한 글자(700)의 위계, `text/primary`(900) > `secondary`(700) >
`tertiary`(600) > `inactive`(400) > `disabled`(300) 순서를 유지합니다. 비활성(Disabled) 컨트롤의 글자는 WCAG 대비 기준에서 제외됩니다.

### 비텍스트 (WCAG 1.4.11, 3:1)

| 용도 | 토큰 | 이전 | 이후 |
| --- | --- | --- | --- |
| 입력 칸 테두리(Input · Textarea · Select · DatePicker · SearchField Outline) | default · completed · read-only `border/gray-subtle` → `border/gray`, hover `border/gray` → `border/gray-dark` | #a1a8b5 2.35:1 | #778191 3.87:1 (hover #596475 5.89) |
| Checkbox · Radio 선택 안 함 테두리 | unchecked · unselected default → `border/gray`, hover → `border/gray-dark` | #a1a8b5 2.35:1 | #778191 3.87:1 |
| Switch 꺼짐 트랙 | `switch/track/off` default · hover · pressed brand-gray 400 · 500 · 600 → 500 · 600 · 700 | #a1a8b5 2.35:1 | #778191 3.87:1 (흰 thumb 대비 같음) |
| Switch Disabled 라벨 | `switch/label/disabled` text/tertiary → text/disabled | — | Checkbox · Radio Disabled 라벨과 같게(비활성 예외) |

장식용 선(Dialog · Tab 밑줄 · Chip hover · 드롭 영역 테두리, 필터 막대 `|`)은 `border/gray-subtle` 그대로입니다.
측정: 실제 브라우저에서 각 컨트롤의 기본 테두리 · 트랙 색을 읽어 계산(모두 3.87:1).

### 남은 결정 사항 (자동 검사 대상 아님)

| 항목 | 현재 | 이유 |
| --- | --- | --- |
| 차트 비교 · 지난 기간 막대 | `bar/compare` #d6dae0 1.38:1 · `bar/history` #e2e5e9 1.24:1 (흰 배경) | 의도적으로 흐린 보조 계열 — 값은 툴팁 · 화면 낭독기 표로 제공. 3:1로 올리면 현재 기간 강조가 약해짐(디자인 결정) |
| SearchField Solid | 테두리 없이 채움(`surface/container-subtle` #f5f6f7, 1.06:1) | 채움형 변형의 정체성 — 돋보기 아이콘 · 플레이스홀더(5.89:1)로 식별 |
| Segmented Control 선택 표시 | 흰 칸 + 그림자 + 글자 600 → 700 | 상태 표시 대비 기준 적용 범위(디자인 결정) |

## 자동 검사 (axe-core)

`npm run verify:a11y`(Storybook 실행 중)가 모든 스토리를 **Storybook a11y 애드온과 같은 axe 기본 규칙**(WCAG 2.0 / 2.1 / 2.2 A · AA + 모범 사례)으로,
제외 영역 없이 검사합니다(2026-10-19 밤부터 — 그 전에는 WCAG 태그만, `[data-a11y-exclude]` 칸 제외). 알려진 항목 목록(토큰 대비 · react-aria 마크업)은 모두 비어 있어 모든 위반이 실패입니다.

| 시점 | 스토리 | 알려진 토큰 대비 | 알려진 react-aria 마크업 | 그 밖의 위반 |
| --- | --- | --- | --- | --- |
| Phase 2 완료 | 148 | 102 (모두 color-contrast) | — | 0 |
| Phase 4 완료 | 262 | 210 (모두 color-contrast) | 693 | 0 |
| Phase 6 완료 | 311 | 302 (모두 color-contrast) | 693 | 0 |
| 최종 배포 준비 (2026-10-19) | 376 | 423 (모두 color-contrast — Secondary · Solid Hover · Pressed 18 포함) | 693 | 0 |
| A-1 · A-2 대비 수정 (2026-10-19) | 378 | **0** (목록 삭제 — 이제 색 대비 위반은 실패) | 693 | 0 |
| 사이드바 경고 정리 (2026-10-19 밤, 기본 규칙 · 제외 없음) | 394 | 0 | **0** | **0** |

### Storybook 사이드바 경고(노란 삼각형) — 해결 (2026-10-19 밤)

`a11y.test: 'todo'`라서 Storybook 테스트(Vitest) 실행 때 axe 위반이 있는 스토리는 사이드바에 경고로 표시됩니다. 25개 스토리 · 6개 규칙을 원인부터 고쳤습니다
(규칙을 끄거나 제외하지 않음). 다시 실행한 결과 394개 스토리 모두 통과.

| 규칙 | 스토리 · 노드 | 원인 | 수정 |
| --- | --- | --- | --- |
| label-content-name-mismatch (WCAG 2.5.3, axe 4.14 정식) | 17 · 736 | 달력 날짜 칸 이름이 react-aria의 전체 날짜("2026년 9월 27일 일요일") — 한국어는 숫자가 "27일"로 붙어 보이는 "27"이 이름의 낱말이 아님. FilterChipSelect 칩 이름이 필터명뿐. 설명이 있는 메뉴 항목 이름이 라벨뿐 | 날짜 칸은 보이는 숫자 먼저 + react-aria 이름(`aria-labelledby`) → "27 2026년 9월 27일 일요일 선택됨". 칩 글자를 react-aria `SelectValue`로 → 이름에 지금 글자. 메뉴 항목은 라벨 + 설명 전체가 이름 |
| landmark-banner-is-top-level · no-duplicate-banner · unique | 8 · 25 | 달력 머리줄이 `<header>`(배너 랜드마크) · 한 화면의 여러 `nav`가 같은 이름 | 달력 머리줄 `div`. 여러 Breadcrumb · Pagination을 둔 스토리는 랜드마크마다 이름(앱에서도 같은 규칙) |
| aria-required-children | 1 · 1 | 제목만 있는 메뉴(시각 검증 칸) | 메뉴가 아닌 정적 제목 마크업으로 같은 모양 |
| empty-table-header | 3 · 11 | Figma Empty 머리글이 `aria-label`만, 아이콘만 있는 행 머리글 | `TableEmptyColumn`이 이름을 화면 낭독기용 글자로 함께 넣음. 의미 있는 아이콘은 `aria-label` → 아이콘이 `role="img"`(이전에는 `aria-hidden`이 이름을 가림) |
- Phase 3 · 4 검사에서 고친 코드 문제: FileUploader 드롭 영역 이름을 보이는 글자(제목 + 도움말)로 변경(2.5.3),
  Tabs 검증 스토리에 TabPanel 추가(aria-controls 대상).
- 시각 검증 칸도 유효한 마크업이어야 합니다 — `[data-a11y-exclude]` 제외는 2026-10-19 밤에 없앴습니다.

## 컴포넌트별

### Button · IconButton · TextButton
- 네이티브 `<button>`, 기본 `type="button"`. Disabled = `disabled`.
- IconButton은 `aria-label` 필수(Figma의 숨겨진 Label). 아이콘은 `aria-hidden`.
- Focus: Figma 속성 `Focus` — 바깥 2px 링(위 [포커스 표시](#포커스-표시--figma-정의-wcag-247--2411--1411-2026-10-19)).
- 자동 검사: 위반 0.

### Input · Textarea · Search Field
- `<label for>`로 라벨 연결, 라벨이 없으면 `aria-label` 사용.
- Error = `aria-invalid="true"`, 메시지(와 Textarea 카운터)는 `aria-describedby`로 연결.
- Input 비밀번호 표시 토글: `<button aria-pressed>` + "비밀번호 표시 / 숨기기" 레이블, Tab으로 접근 가능.
- 지우기(X) 버튼: 마우스 보조 기능이라 Tab 순서에서 제외(`tabIndex=-1`) — 키보드는 전체 선택 후 삭제로 대체.
- Search Field는 `<input type="search">`(검색 상자 역할), Enter로 `onSearch`.
- Focus 표시: Figma Focus 상태(테두리 colors/border/gray-darker)가 포커스 표시 역할을 합니다.
- 자동 검사: 위반 0.

### Checkbox · Radio · Switch
- 네이티브 `<input type="checkbox">` · `<input type="radio">` · `<input type="checkbox" role="switch">`를 `appearance: none`으로
  그대로 보이게 사용 — 체크 상태, 일부 선택(`mixed`), 비활성, 폼 전송, 레이블 클릭이 브라우저 기본 동작입니다.
- 루트가 `<label>`이라 라벨 텍스트가 접근 가능한 이름이 됩니다. 라벨이 없으면 `aria-label` 필요.
- 키보드: Space로 전환, Radio는 같은 그룹 안에서 방향키로 이동 · 선택.
- `CheckboxGroup`은 `role="group"`, `RadioGroup`은 `role="radiogroup"`(+ `aria-required` / `aria-disabled`) — `aria-label` 또는 `aria-labelledby`로 이름 지정.
- Focus: Figma 속성 `Focus` — 상자 · 원 · 트랙 바깥 2px 링(라벨 제외).
- 그룹 간격: 세로 8px · 가로 16px(Design System Rules 08).

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
- Focus: 손잡이에 2px 링(Figma 속성 `Focus`) + 값 라벨 표시.

### Segmented Control
- `role="radiogroup"` + 시각적으로 숨긴 네이티브 라디오 — 방향키 이동(비활성 항목 건너뜀), 폼 전송.
- Focus: 선택된 세그먼트 바깥 2px 링(Figma 속성 `Focus`).

### Chip · InputChip · FilterChip
- Chip: `<button aria-pressed>`(켜짐 / 꺼짐). 여러 개를 묶을 때는 사용처에서 `role="group"` + 이름.
- InputChip: 칩 전체가 삭제 버튼(이름 = 라벨 + "삭제"), Delete · Backspace로도 삭제 — 12px X 아이콘만 누르는 것보다 큰 대상(WCAG 2.5.8).
- FilterChip: react-aria `Button` — `aria-expanded`(직접 지정 또는 MenuTrigger 등 트리거가 설정), 화살표 방향이 이를 따라감.

### DatePicker · Calendar
- 필드는 `<input>`(라벨 · `aria-invalid` · 메시지 설명), 해석할 수 없거나 선택할 수 없는 날짜를 입력하면 Error 상태 + `aria-invalid`.
- 달력 버튼(이름 "달력 열기", `aria-expanded`)이 Dialog를 열고, Dialog 이름은 필드 라벨입니다. Alt + ↓로도 열립니다.
- Calendar(react-aria): `role="grid"` + 날짜 버튼(이름 예: "30 2026년 7월 30일 목요일" — 보이는 숫자 먼저, WCAG 2.5.3), 비활성 날짜 `aria-disabled`,
  이전 / 다음 달 버튼 이름은 로캘 문구. 방향키 · Page Up/Down · Home/End.
- `name`을 주면 숨은 input으로 ISO 날짜를 전송합니다.

### FileUploader · FileUploaderItem · Loading
- 드롭 영역은 `<button>`(이름 = 보이는 글자: 제목 + 도움말, WCAG 2.5.3), Enter · Space로 파일 선택 창. 숨은 `<input type="file">`이 폼 값.
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

### Stepper
- `<ol>`(이름은 `aria-label`) > `<li>`, 현재 단계 `aria-current="step"`.
- 원 안의 숫자 · 아이콘은 `aria-hidden`, 대신 숨은 문구 "N단계"와 상태(완료 · 오류 · 잠김)를 읽습니다.
- 연결선은 장식(`aria-hidden`). 상호작용 없음.

### Badge
- `Badge`는 글자가 그대로 읽히는 `<span>`(상태 점은 `aria-hidden`). 색만으로 뜻을 전하지 않도록 글자에 상태를 담으세요.
- `BadgeDot`은 장식(`aria-hidden`), `aria-label`을 주면 `role="img"`로 읽힙니다. `BadgeCount`는 숫자가 읽히며 필요하면 `aria-label`.

### Progress
- react-aria-components `ProgressBar`: `role="progressbar"`, `aria-valuenow` · `aria-valuemin` · `aria-valuemax` · `aria-valuetext`(기본 백분율, `valueLabel`로 변경).
- 보이는 라벨이 없으므로 `aria-label` 또는 `aria-labelledby` 필수.

### Alert
- 오류는 `role="alert"`(즉시 읽음), 안내 · 성공은 `role="status"`(`role`로 변경 가능). 상태 아이콘은 장식(`aria-hidden`) —
  상태는 제목 문구로 전달하세요.
- `action` 버튼은 일반 Tab 순서.

### Toast
- `ToastRegion`(react-aria-components Toast): 이름 있는 영역("알림"), 새 알림을 읽어 주고, 마우스를 올리거나 포커스가 있으면
  자동 닫힘 시간이 멈춥니다. Tab으로 알림과 닫기 버튼("알림 닫기")에 갈 수 있습니다.
- 정적 `Toast`는 `role="status"`. 상태 아이콘은 장식 — 상태는 메시지 문구로 전달하세요.
- 자동 닫힘은 최소 5초(`showToast`가 보정), 중요한 오류는 `timeout: null`로 유지하세요.

### Tooltip
- react-aria-components TooltipTrigger: 말풍선 `role="tooltip"`, 트리거 `aria-describedby`. 키보드 포커스 시 바로 표시, Esc로 닫기.
- 툴팁은 보조 설명입니다. 아이콘 버튼의 이름은 `aria-label`로 따로 주세요(툴팁은 설명으로만 연결).

### Empty State
- 제목 · 설명은 일반 텍스트(`<p>`), 아이콘은 장식(`aria-hidden`). `action` 버튼은 일반 Tab 순서.

### Accordion
- react-aria-components Disclosure: 제목은 `<h3>`(`headingLevel`) 안의 `<button aria-expanded aria-controls>`, 내용은 버튼 이름의 영역.
- Enter · Space로 펼침 · 접힘, 비활성 항목은 포커스 대상에서 빠짐. 구분선 · 화살표는 장식.

### Dialog
- react-aria-components Modal + Dialog: 열리면 포커스가 안으로 이동해 갇히고(Tab 순환), Esc로 닫히면 트리거로 돌아갑니다.
- `role="dialog"`(확인 질문은 `alertdialog`), 제목 = 이름(`aria-labelledby`), 설명 = `aria-describedby`. 배경 페이지는 react-aria가 숨깁니다.

### Table
- react-aria-components Table: `role="grid"`, 방향키로 칸 이동, 선택 체크박스(Space), 정렬 열 `aria-sort`, 행 동작은 Enter · 클릭.
- 선택 체크박스는 디자인 시스템 Checkbox(이름은 react-aria가 "선택" · "모두 선택" 등으로 지정).
- 열 정보 아이콘은 포커스할 수 있고 툴팁으로 설명을 보여 줍니다. 순서 바꾸기 손잡이 이름 "순서 이동".
- KeyValueTable은 `<dl>`(dt = 항목, dd = 값), 필수 점은 "필수"로 읽힙니다.

### Card
- 일반 `<div>` 묶음. 머리글 제목은 `<h3>`(`headingLevel`로 변경) — 페이지의 제목 단계에 맞추세요.

### Chart
- `<figure>`(이름 = `aria-label`). 그림(SVG) · 눈금 글자 · 범례 · 툴팁은 보조 기술에서 숨기고, 모든 값을 숨긴 표(`<table>` — 캡션 =
  `aria-label`, 열 머리 = 카테고리, 행 머리 = 계열 이름)로 제공합니다. 축 이름은 일반 글자로 읽힙니다.
- 기본 스타일의 그림 영역은 Tab으로 초점(`role="group"`, 이름 "차트 항목: 화살표 키로 값 확인", 바깥 2px 포커스 링 — Design System Rules 02, 차트에는 Figma 속성 없음).
  ←/→/↑/↓로 항목 이동, Home · End, Esc로 닫기. 이동한 항목의 값("104동: 조회 기간 305, 이전 기간 314")을 `aria-live="polite"`로 알립니다.
- 포인터 호버의 툴팁은 같은 값을 보여 주는 시각 보조입니다(낭독기는 표 · 알림으로 접근). 간단 스타일은 툴팁이 없어 초점을 받지 않습니다.
- 색만으로 계열을 구분하지 않도록 범례 · 툴팁에 계열 이름이 함께 나옵니다. 툴팁 제목 `text/tertiary`는 A-1 이후 #596475(5.89:1).

### Skeleton · Data State
- Skeleton은 장식(`aria-hidden`). DataState는 `role="status"`(상태가 바뀌면 정중하게 읽음), Loading은 `aria-busy="true"`와 문구
  "데이터를 불러오는 중입니다". 나머지 상태는 EmptyState(아이콘 장식, 제목 · 설명 글자)와 `onAction`이 있을 때만 TextButton.

### Metric Trend · Metric Card · Data Freshness
- MetricTrend: 방향 아이콘은 장식이고 "증가" · "감소" · "변동 없음"(`directionLabel`)을 화면 낭독기용으로 앞에 읽습니다. Tone(좋음 · 나쁨)은 색으로만
  구분되므로 비교 문구 등 주변 글자로 의미를 전하세요.
- MetricCard: 제목 `<h3>`(`headingLevel`)으로 이름 붙은 `role="group"`, 아이콘 장식.
- DataFreshness: 상태 배지 글자 + 시각(`dateTime`이면 `<time>`) + 갱신 주기, "·"는 숨김. 시각 갱신을 매번 읽지 않도록 알림 영역이 아닙니다.

### Dashboard Filter Bar
- `role="search"` 랜드마크(이름 "조회 조건"), 그룹은 라벨로 이름 붙은 `role="group"`, "|" · "~"는 숨김. Figma 컨트롤에는 보이는 라벨이 없으므로
  각 Select · SegmentedControl · DatePicker에 `aria-label`을 주세요(예시: "조회 대상", "시작일").

### Dropdown Menu
- react-aria-components menu: 트리거 `aria-haspopup="menu"` · `aria-expanded`, 패널 `role="menu"`, 항목 `menuitem`,
  `DropdownMenuSection title`은 `group`의 이름, 구분선 `separator`. 비활성 항목 `aria-disabled`.
  설명(`description`)이 있는 항목은 라벨 + 설명 전체가 이름입니다(보이는 글자가 모두 이름에 — WCAG 2.5.3).
- Enter · Space · ↓ / ↑로 열면 첫 / 마지막 항목에 포커스, 방향키 · Home · End · 글자 입력으로 이동, Esc로 닫고 트리거로 복귀.
- 키보드 포커스는 Hover 모양으로 표시합니다(Design System Rules 02 — 목록 항목 포커스).
