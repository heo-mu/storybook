# 정책 상세 기준 (개발용)

Figma **Design System Rules** 표는 처음 보는 사람도 읽을 수 있게 짧은 규칙만 남겼습니다(2026-10-20).
이 문서는 그 규칙의 **세부 수치 · 조건 · 예외 · 구현 방식**을 모은 개발 기준입니다. 컴포넌트별 세부는 [components/](./components/),
정책 항목 목록과 출처는 [code-policy-audit.md](./code-policy-audit.md)에 있습니다.

> 장 번호는 Figma Rules와 같습니다. 10장(개발 구현 세부)은 Figma에서 빼고 이 문서에만 둡니다.

## 02. 상태 표현

| 정책 | 상세 기준 | 토큰 · 근거 |
| --- | --- | --- |
| 포커스 링(바깥) | 키보드 포커스(`:focus-visible`)일 때만 2px 선을 컨트롤 바깥 2px 간격에 그림. 모서리 = 컴포넌트 모서리 + 4px. 마우스 클릭에는 그리지 않음. Checkbox · Radio · Switch는 상자 · 원 · 트랙에만. 대상: Button 3종 · Checkbox · Radio · Switch · Chip 3종 · Link · Tabs · Pagination · Segmented · Slider 손잡이 · File Uploader · Breadcrumb · Calendar. Figma 속성이 없는 부분도 같은 링 — 탭 패널 · 입력 칸 안 버튼(비밀번호 표시 · 달력) · Toast 닫기 · Chart 그림 영역 | `colors/border/focus`(brand/700, 페이지 배경 대비 5.14:1) · `border-width/border-2` · Figma Boolean 속성 `Focus`(24개 세트) · WCAG 2.4.7 · Storybook Foundations/Focus |
| 포커스 링(안쪽) | 폭을 채우는 행(Navigation 항목 · Accordion 트리거 · Table 행 · 칸 · 열 머리글)은 가장자리 안쪽 2px에 그려 부모 · 이웃에 가려지지 않게 함 | 같은 토큰. Table은 Figma 속성 없이 이 규칙이 기준 |
| 입력 칸 포커스 | Input · Textarea · Search Field · Date Picker · Select는 링 대신 테두리를 `border/gray-darker`로(Figma State=Focus). Error와 겹치면 Error 테두리 유지 | `*/border/focus` · Select State=Focus |
| 목록 항목 포커스 | Select 옵션 · Dropdown 메뉴에서 키보드로 이동 중인 항목은 Hover 모양. 선택 표시(글자 · 체크)가 Hover보다 우선 | `*/option/background/hover` · react-aria 키보드 탐색 |
| Pressed 없음 | Pressed 상태가 없는 컴포넌트(Navigation)는 누르는 동안 Hover 모양 | — |
| Disabled | 누를 수 없고 Tab 순서에서 빠짐. 라벨은 `text/inactive` · `text/disabled` — 대비 기준 예외(비활성) | `text/inactive`(gray/400) · WCAG 1.4.3 예외 |
| 데이터 강조 | Chart `hover=yes` 표시(선: 안내선 · 빈 원, 막대: 강조 영역, 툴팁)를 모든 항목에 같게 | `colors/chart/plot/*/hover` |

## 03. 접근성 (WCAG 2.2 AA)

| 정책 | 상세 기준 | 토큰 · 근거 |
| --- | --- | --- |
| 대비 | 글자 4.5:1, 큰 글자 3:1, 컨트롤 경계 · 상태 표시 3:1. 비활성 컨트롤은 예외 | `text/tertiary` · `text/placeholder` gray/600, 상태 강조 700, 컨트롤 테두리 `border/gray`(3.87:1). 측정표: [accessibility.md](./accessibility.md) |
| 색만으로 전하지 않기 | Badge Dot · MetricTrend · Stepper · Chart의 상태 · 방향 · 계열은 글자 · 아이콘 · 숨은 문구를 함께. MetricTrend의 좋음 · 나쁨은 주변 문장에서 설명. 차트 비교 선은 점선 | MetricTrend `directionLabel` · Stepper "N단계, 완료" · Chart 화면 낭독기 표 |
| 이름과 설명 | 보이는 라벨이 없으면 `aria-label` 필수. 이름에는 보이는 글자가 그대로 들어감(WCAG 2.5.3) — 달력 날짜는 "28 2026년 7월 28일 화요일"처럼 숫자 먼저, 설명이 있는 메뉴 항목은 라벨 + 설명, 필터 칩은 지금 보이는 글자. 목록 버튼은 대상(파일 이름 등)을 설명으로. 카드 묶음은 제목을 이름으로. 비어 보이는 표 머리글 · 의미 있는 아이콘도 이름(`role="img"`). 같은 종류의 랜드마크(nav 등)가 한 화면에 여럿이면 서로 다른 이름 | IconButton `aria-label` · FileUploaderItem · MetricCard `role=group` · Calendar · DropdownMenuItem · TableEmptyColumn · 아이콘 `aria-label` |
| 상태 알림 | 오류는 `role="alert"`(즉시), 안내 · 성공 · 상태 변화는 `role="status"`. 계속 바뀌는 시각(DataFreshness)은 읽지 않음 | `aria-live` · 로딩은 `aria-busy` |
| 오류 안내 | 오류 문구를 `aria-describedby`로 연결하고 `aria-invalid`. 읽기 전용은 "읽기 전용"을 함께 읽음 | Input · Select · Date Picker · Textarea |
| 동작 줄이기 | `prefers-reduced-motion`에서 반복 모션을 느리게(스피너 1초 → 3초/바퀴) | Loading CSS |

## 04. 키보드 · 입력

| 정책 | 상세 기준 | 토큰 · 근거 |
| --- | --- | --- |
| 기본 키 | Tab 이동, Enter · Space 실행, Esc 닫기. 목록 · 탭 · 라디오 · 달력은 방향키 + Home · End. Select · Dropdown은 글자를 입력하면 그 글자로 시작하는 항목으로 이동(typeahead) | react-aria · 네이티브 요소 |
| 탭 선택 방식 | 방향키로 이동하면 바로 선택(`keyboardActivation="automatic"`). 내용이 무거우면 `manual`(Enter · Space) | Tabs `keyboardActivation` |
| 입력 검증 | 입력을 마친 뒤(blur) 또는 제출할 때 검증, 입력 중에는 오류 해제만. Date Picker 직접 입력: 해석할 수 없거나 범위 밖이면 Error, 값은 바꾸지 않음 | `invalid` · `message` props |
| 지우기 · 비밀번호 | 지우기(X)는 마우스 보조 — Input은 Hover · Focus, Search Field는 Focus · Error에서 보이고 Tab 순서 제외, 키보드는 전체 선택 후 삭제. 눈 아이콘은 비밀번호 칸에서만, 상태는 `aria-pressed` | `clearable` · `type="password"` |
| 선택 · 삭제 | Indeterminate를 누르면 전체 선택(Checked). InputChip은 칩 전체가 삭제 대상(클릭 · Enter · Space · Delete · Backspace). 드롭 영역은 버튼(Enter · Space) | — |
| 필터 칩 선택 | 다중(기본): 옵션을 켜고 끄는 동안 패널 유지, 칩 글자 "필터명: 값, 값"(3개를 넘으면 "외 N"), 닫을 때(Esc · 바깥 · 칩) 적용되어 Selected. 모두 끄고 닫으면 해제. 단일: 고르면 바로 적용 · 닫힘, 첫 옵션 "전체"로 해제. 패널은 칩 아래 4px · 시작 정렬 · 최소 160px. 키보드: Enter · Space · ↓ 열기, 방향키 · 글자 이동, Space · Enter 선택, Esc 닫고 칩으로. 열린 칩은 State=Default · Expanded=True | `FilterChipSelect` · `aria-expanded` · listbox(`aria-multiselectable`) |
| 값 표시 | Slider 값 라벨은 Hover · 드래그 · 키보드 포커스 중 표시, 숫자 칸은 가장 긴 값 폭(트랙 길이 고정). Textarea 카운터는 실제 길이 / 최대 길이(`maxLength` 강제) | — |
| 외부 링크 | 화살표 아이콘은 새 창으로 여는 링크에만, 숨은 "(새 창)" 문구 | Link `external` |

## 05. 팝업 · 메뉴 · 툴팁 (오버레이)

| 정책 | 상세 기준 | 토큰 · 근거 |
| --- | --- | --- |
| 위치 | 트리거 아래 4px(Breadcrumb 메뉴 2px, Tooltip은 화살표 끝이 닿는 8px). Select 목록은 필드 너비, 나머지는 시작 정렬. 공간이 없으면 반대쪽으로 뒤집고 화면 안으로 이동 | `spacing/margin/m-1` · react-aria `placement` |
| 차트 툴팁 위치 | 자기 차트의 그림 영역 안. 선 · 가로 막대는 기준점 오른쪽 12px(넘치면 왼쪽), 세로 막대는 항목 가운데 위쪽. 보이는 부분(그림 영역 ∩ 화면 · 스크롤 영역, 가장자리 12px)을 우선하고, 차트가 화면 밖이면 함께 사라짐 — 다른 차트 위에 남거나 툴팁을 공유하지 않음. 계열 이름 칸 최소 40 · 최대 80px | Chart CHAR-01 · CHAR-08 |
| 크기 | Select 목록 높이는 화면에 맞추고 내부 스크롤, 공간이 없으면 위로. Dropdown은 내용 폭. Breadcrumb 메뉴 최소 200px(내용에 맞춰 넓어짐) | — |
| 열기 · 닫기 | Esc로 닫힘. 바깥 클릭: 메뉴 · 목록 · 달력은 닫힘, Dialog는 닫히지 않음(`isDismissable`일 때만). Tooltip은 포인터 · 포커스가 떠나면 닫힘. 트리거 모양은 바뀌지 않고 `aria-expanded`로 전달 | — |
| 포커스 이동 · 복귀 | 열리면 오버레이 안으로, 닫히면 연 요소로 돌아감. Dialog는 열린 동안 포커스를 가둠. Date Picker 달력이 닫히면 트리거로 | react-aria `FocusScope` |
| 모달 덮개 | 모달은 검정 50% 덮개로 뒤 화면을 가리고 조작 · 스크롤을 막음 | `colors/dialog/scrim/default` → `surface/scrim`(black 50%) · Dialog "Modal example" |
| Tooltip 지연 | 마우스 0.5초 뒤, 키보드 포커스는 즉시 | Tooltip `delay` 500 |
| 하위 메뉴 | 지원하지 않음 — chevron은 다른 화면으로 이동한다는 표시 | — |

## 06. 피드백 — 알림 · 진행

| 정책 | 상세 기준 | 토큰 · 근거 |
| --- | --- | --- |
| Toast | 화면 아래 가운데(아래 20px), 토스트 사이 8px, 최대 3개(새 토스트가 보이고 오래된 것은 대기). 안내 · 성공 5초, 오류는 닫을 때까지(닫기 아이콘). Hover · 포커스 중 정지. 같은 문구 · 상태는 겹치지 않고 다시 표시 | `spacing/padding/p-5` · `spacing/margin/m-2` · `role=status` |
| Alert | 화면 상태를 설명하는 고정 메시지 — 사용자가 닫지 않음(닫아야 하면 Toast). 설명은 줄바꿈, 자르지 않음. 폭은 부모를 채움 | 오류 `role=alert`, 그 밖 `status` |
| 진행 · 로딩 | 진행률을 알면 Progress, 모르면 Loading. Skeleton은 장식이며 감싸는 영역(DataState)이 불러오는 중을 알림 | `aria-busy` · `role=status` |

## 07. 데이터 — 차트 · 표 · 목록 · 빈 상태

| 정책 | 상세 기준 | 토큰 · 근거 |
| --- | --- | --- |
| 차트 Hover | 포인터 기준 가장 가까운 항목(값 눈금 열 제외). 터치는 탭으로 고정, 바깥을 누르면 해제. 키보드 ← → · Home · End · Esc. 0 이상 값만 지원, 범위 밖 값은 축 끝. 숨김 레이어(간단 스타일 Current values · 가로 막대 Axis unit)는 명세 아님. 화면 낭독기용 표를 함께 제공 | `colors/chart/*` · Figma chart `hover=yes` |
| 표 | 편집 칸은 Hover · 포커스일 때 입력 상자. 선택한 행은 배경 강조 없이 체크박스로. 정렬 방향은 `aria-sort`, 활성 열 아이콘 색 `header/icon/active`. 누를 수 있는 아이콘은 버튼 + 이름 | `table/data/*` |
| 페이지 이동 | 현재 페이지 주변 고정 개수, 생략 기호 없음. 처음 · 끝에서는 이전 · 다음 Disabled | — |
| 빈 · 오류 상태 | 할 일이 없으면 버튼을 두지 않음(Figma `Show Button` 끔, 코드 `action` 생략). 설명은 사용처의 실제 수치로 | — |
| 파일 | `accept`에 맞지 않는 파일은 받지 않음. 여러 개가 아니면 첫 파일만 | — |
| 펼침 · 경로 | Accordion은 기본 하나만 펼침(비교 화면만 `allowsMultipleExpanded`). Breadcrumb `Show Parent`는 Collapsed에만, Full은 전체 경로 | — |

## 08. 레이아웃 · 콘텐츠

| 정책 | 상세 기준 | 토큰 · 근거 |
| --- | --- | --- |
| 폭 | Alert · Card · Accordion · Data State · Metric Card · Navigation 항목은 부모 폭을 채움(Figma 폭은 예시). Empty State는 최대 320px, Dropdown 메뉴는 내용 폭, LNB 폭(240px)은 레이아웃에서 | — |
| 간격 | 선택 그룹 세로 8px · 가로 16px, 칩 사이 4px(Figma 예시와 같음), 탭 사이 0(밑줄 연결). Dialog 본문은 설명과 버튼 사이 같은 간격 | `spacing/margin/m-1` · `m-2` · `m-4` · `m-8` |
| 넘침 | 설명은 줄바꿈(자르지 않음). Toast는 한 줄 말줄임. Textarea 100px 고정 + 내부 스크롤. 가로 Stepper 바깥에 라벨 폭 절반 여백, 연결선은 남는 폭을 채움 | — |
| 로캘 · 숫자 | 요일 · 월은 로캘(한국어 일 월 화 …). Badge Count는 99를 넘으면 "99+" | — |
| 줄바꿈 | Dashboard Filter Bar는 좁으면 그룹 단위로 줄바꿈(줄 사이 m-6). Slider 숫자 칸은 가장 긴 값 폭이라 트랙 길이가 바뀌지 않음 | — |

## 09. 모션

| 정책 | 상세 기준 | 토큰 · 근거 |
| --- | --- | --- |
| 상태 전환 | 색 · 배경 · 펼침 · 열림 · 썸 이동 · 진행 막대 · 단계 이동은 즉시(애니메이션 없음) | — |
| 반복 모션 | 스피너 1초/바퀴, 동작 줄이기 설정에서 3초/바퀴. Skeleton은 정적 | `prefers-reduced-motion` |

## 10. 개발 구현 세부 (디자인 컴포넌트에 넣지 않는 항목)

| 정책 | 상세 기준 | 참고 |
| --- | --- | --- |
| 오버레이 포털 | Select · Tooltip · Dialog · Dropdown …은 `<body>`로 포털, z-index 100000(react-aria 오버레이와 같음), 스크롤 · 창 크기 변경을 따라감. Chart 툴팁은 포털 없이 그림 영역 안(`position: absolute`) | — |
| 제어 · 비제어 | 상태가 있는 컴포넌트는 `value` · `defaultValue` · `onChange`(또는 `open` · `page` · `activeIndex`) 패턴을 모두 지원 | Props |
| DOM · 이벤트 | 네이티브 `input` · `button` 사용, Hover · Pressed는 `:hover` · `:active`. react-aria 컴포넌트(Select · Tabs · Slider · Dialog …) | [public-api.md](./public-api.md) |
| 브라우저 대응 | `calc-size()` 미지원 엔진의 1px 미만 폭 차이, 점선 테두리 SVG, Tooltip 화살표 그림자 생략, 차트 바깥 선 · 슬라이더 손잡이 위치 계산 | [browser-support.md](./browser-support.md) |
| 불안정 API | react-aria UNSTABLE Toast를 `showToast` · `closeToast`로 감쌈 — 사용 코드는 바뀌지 않음 | [components/Toast.md](./components/Toast.md) |

## 컴포넌트 주석 (Figma에서 옮김)

2026-10-19 Figma 컴포넌트에 달았던 Dev Mode 주석입니다. 내용은 위 표와 컴포넌트 노트에 반영되어 있어 Figma에서는 지웠습니다(2026-10-20).

| 컴포넌트 | 분류 | 내용 |
| --- | --- | --- |
| select | 동작 | 목록 — 필드 아래 4px, 필드 너비, 높이는 화면에 맞추고 내부 스크롤, 공간이 없으면 위로. 글자 입력으로 항목 이동. 키보드 포커스는 State=Focus(테두리), Error와 겹치면 Error 테두리 유지 |
| toast | 동작 | 화면 아래 가운데(아래 20px), 토스트 사이 8px. 최대 3개. Information · Success는 5초 뒤 닫힘, Error는 닫을 때까지. Hover · 포커스 중 정지. 같은 문구 · 상태는 다시 표시 |
| tooltip | 동작 | 마우스 0.5초 뒤, 키보드 포커스 즉시. 포인터 · 포커스가 떠나거나 Esc로 닫힘. 화살표 끝이 트리거에 닿게(8px) |
| dialog | 동작 | 덮개 `colors/dialog/scrim/default`(검정 50%). 포커스가 안으로 이동 · 갇힘, Esc로 닫힘, 바깥 클릭은 닫지 않음(dismissable일 때만), 닫히면 연 요소로 복귀 |
| date-picker_trigger | 동작 | 직접 입력 허용. 해석할 수 없거나 범위 밖 날짜는 State=Error, 값은 바꾸지 않음. 달력은 트리거 아래 4px(공간이 없으면 위), 닫히면 포커스는 트리거로 |
| alert | 접근성 | Status=Error는 `role="alert"`, Information · Success는 `role="status"` |
| alert | 콘텐츠 | 고정 메시지(사용자가 닫지 않음), 설명은 줄바꿈 · 자르지 않음, 폭은 부모를 채움 |
| chip-input | 동작 | 칩 전체가 삭제 대상: 클릭 · Enter · Space · Delete · Backspace. 칩 사이 4px(`spacing/margin/m-1`) |
| chip-filter | 동작 | 다중: 패널 유지 · 닫을 때 적용 → Variant=Selected("필터명: 값, 값"). 단일: 고르면 적용 · 닫힘, "전체"로 해제. 열린 칩은 State=Default · Expanded=True |
| table_value_editable | 동작 | 편집 칸은 Hover · 포커스일 때 입력 상자. 선택 행은 체크박스로. 정렬 `aria-sort`, 활성 열 아이콘 `header/icon/active` |
| slider | 동작 | 값 라벨은 Hover · 드래그 · 키보드 포커스 중 표시. 숫자 칸은 가장 긴 값 폭. 손잡이 키보드 포커스는 Focus=true |
| breadcrumb | 동작 | … 메뉴 — 트리거 아래 2px, 시작 정렬, 최소 200px. Esc · 바깥 클릭으로 닫히고 포커스는 트리거로. Show Parent는 Collapsed에만 |
| chart | 동작 | 포인터에서 가장 가까운 항목(값 눈금 열 제외)을 hover=yes 모양으로. 터치는 탭 고정 · 바깥을 누르면 해제. 키보드 ← → · Home · End · Esc |
| chart | 개발 | 0 이상 값만, 범위 밖 값은 축 끝. 숨김 레이어는 명세 아님. 화면 낭독기용 표 |
| chart-tooltip | 동작 | 자기 차트 그림 영역 안(포털 아님). 선 · 가로 막대는 기준점 오른쪽 12px(넘치면 왼쪽), 세로 막대는 가운데 위쪽. 보이는 부분 우선, 차트가 화면 밖이면 함께 사라짐 |
| accordion-item | 동작 | 기본 한 항목만 펼침, 비교 화면만 여러 개(`allowsMultipleExpanded`). 즉시 펼침 · 접힘. 폭은 부모를 채움(320px은 예시) |
| accordion-item | 접근성 | 트리거는 button + `aria-expanded`. 키보드 포커스는 Focus=true(안쪽 2px 링) |

## 컴포넌트 설명에서 옮긴 개발 메모

Figma 컴포넌트 설명(Description)에서 개발 · 임시 메모와 영어 기술 문구를 빼고 디자이너가 쓴 설명은 그대로 두었습니다(2026-10-20). Focus 속성 설명은 "Focus: 키보드로 선택했을 때 보이는 포커스 테두리입니다."로 바꿨습니다. 뺀 내용:

| 컴포넌트 | 옮긴 내용 |
| --- | --- |
| Focus 속성이 있는 24개 세트 | "Focus (boolean): keyboard focus ring — 2px colors/border/focus, 2px outside / inside the row edge. Design System Rules 02." → 02장 포커스 링 |
| select | "State=Focus: keyboard focus while closed — border colors/select/outline/outline/border/focus (same as Input Focus)." → 02장 입력 칸 포커스 |
| empty-state | "Show Button (boolean): the action is optional — hide it when there is nothing to do (code: `action` prop)." → 07장 빈 · 오류 상태 |
| pagination | "Previous / Next are Disabled when there is no page to move to (page 1 / last page)." → 07장 페이지 이동 |
| card_header · card_footer | "Code: CardHeader (title · description · action)" · "Code: CardFooter" → [components/Card.md](./components/Card.md) |
| file-uploader | "기존 button_basic과 Phosphor 아이콘 사용. 색상은 Component → Semantic 별칭." · "새 텍스트는 도구 제약으로 Noto Sans KR 임시 사용."(지난 임시 메모 — 지금은 Pretendard 텍스트 스타일) |
| file-uploader-item | "(…표현하며) 실제 파일 처리 및 진행률 연동은 개발 구현 대상입니다." — 앞 문장은 "…표현합니다."로 마침 |
| breadcrumb | "웹 구현: nav aria-label=현재 위치, 현재 항목 aria-current=page. 자동 폭 감지와 URL 이동은 별도 연결." · "펼침/축약 메뉴가 같은 경로 레이어를 사용합니다." |
| breadcrumb-item | "아이콘은 기존 외부 icon_size의 노출 속성에서 교체합니다." |
| metric-card | "내부 metric-trend와 icon_size 속성을 노출했습니다." |
| dashboard-filter-bar | "기존 select, date-picker_trigger, segmented-control, chip-filter, button_basic 조합." · "조건 변경의 데이터 연동은 개발 구현 대상입니다." |
| data-state | "실제 조회·재시도·권한 요청은 개발 구현 대상입니다." |
