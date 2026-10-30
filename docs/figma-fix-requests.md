# Figma 원본 수정 요청 · 처리 결과

디자인 시스템 Figma 파일(`Ry3WecA6sP6lKPop1vXrTp`, 페이지 🔵 Ver 0.4)에서 원본을 고쳐야 하는 항목입니다.
**2026-10-19 Figma 수정 작업(사용자 승인)** 으로 자동 수정 대상은 직접 고쳤고, 나머지는 노드 · 변수 ID와 함께 승인 대상으로 남겼습니다.

수정 원칙: 삭제된 변수의 명확한 대체 · 의미가 틀린 바인딩 · 같은 컴포넌트 안의 명백한 상태 매핑 오류만 자동 수정하고,
색 · 글꼴 값 변경, 새 Variant · 구조 변경, 기준이 불명확한 항목은 바꾸지 않았습니다. 지정된 노드 외에는 수정하지 않았습니다.

## 처리 현황

| # | 항목 | 상태 | 결과 |
| --- | --- | --- | --- |
| R1 | Button Primary · Outline 테두리가 삭제된 변수를 가리킴 | **완료** | 변수 복구 + 42노드 재연결, #004a38 그대로 |
| R2 | Button Secondary · Outline 테두리 바인딩이 Shape마다 다름 | **완료** | 8노드 재연결, #007c56 그대로 |
| R3 | 차트 가로 막대 비교 막대 바인딩 오류 (F65) | **완료** | 지정 5노드 `chart/series/compare` |
| R4 | 12px 모서리 로컬 변수 등록 (F69) | **완료** | 변수 등록 + 본 페이지 5노드 재연결(legacy 인스턴스 10개 자동) |
| R5 | Accordion md · Hover · Expanded 위치 | **완료(재등록 후)** | 1035:15685 y 40 → 20 |
| R6 | Table 편집 칸 Filter 칩 상태 | **완료(693:7165)** · 693:7167 오류 아님 | Editing · Filled 칩 Selected로 |
| R7 | Table 편집 칸 Filter · Editing의 다중 선택 목록 | 결정 대기 (D3) | 변경 없음 |
| R8 | Table 편집 칸 안내 글자가 삭제된 변수에 바인딩 (F57) | **완료** | 3노드 `text/tertiary`, #778191 그대로 |
| C3 | 텍스트 스타일 `sm/leading-normal/underline`이 삭제된 변수에 바인딩 | **완료** — 바인딩(R) · 줄 높이 20px(A-4, 2026-10-19 정책 작업) | 같은 값 변수로 교체 |

작업 전 안전 조치: 로컬 Git 태그 `checkpoint/pre-figma-fixes`, 변경 전 바인딩 · 값 기록(아래 표). Figma 이름 있는 버전 저장은
MCP에서 지원되지 않아(`saveVersionHistoryAsync` 미지원) 만들지 못했습니다 — Figma 자동 버전 기록과 아래 변경 전 값으로 복구할 수 있습니다.

검증: 변경 후 두 섹션 10,475개 노드 · 전체 텍스트 스타일에서 **삭제된 변수 참조 0개**, 세트 지문 비교에서 바뀐 세트는 `button_basic` · `button_icon` ·
`table_value_editable`뿐(의도한 변경), 변수 · 스타일 체크섬 8그룹이 로컬 스냅샷과 일치.

---

## R1. Button Primary · Outline 테두리 — 완료

| | 변경 전 | 변경 후 |
| --- | --- | --- |
| 변수 | 삭제된 `VariableID:59:2221` `colors/button/primary/outline/border/default`(컬렉션 Component, ALL_SCOPES, 별칭 `fill/primary/strong/default`) | **`VariableID:1033:4608`** 같은 이름 · 컬렉션 · scopes · 별칭(`VariableID:28:6598`)으로 재생성 — 같은 의미의 유효한 토큰이 없어 중복 아님 |
| 노드 | 42개 stroke가 삭제된 변수, #004a38, 1px INSIDE | 42개 stroke가 새 변수, **#004a38, 1px INSIDE 그대로** |

노드: button_basic 67:1938 67:1944 67:1950 67:2038 67:2044 67:2050 · 59:1949 59:1955 59:1961 59:2095 59:2101 59:2107 · 59:1919 59:1925 59:1931 59:2065 59:2071 59:2077 ·
59:1943 59:1973 59:1979 59:2089 59:2119 59:2125 / button_icon 67:2485 67:2489 67:2493 67:2518 67:2522 67:2526 · 67:2386 67:2390 67:2394 67:2452 67:2456 67:2460 · 67:2551 67:2555 67:2559 67:2584 67:2588 67:2592.
Disabled 14개는 원래 테두리 없음(변경 없음). 이전 결정 D1은 이 복구로 해소.

## R2. Button Secondary · Outline 테두리 — 완료

| | 변경 전 | 변경 후 |
| --- | --- | --- |
| 67:1994 67:2000 59:2028 59:2034 59:1998 59:2004 59:2046 59:2052 (Square Hover · Pressed) | `colors/button/secondary/solid/border/default`(`VariableID:54:2047`) #007c56 | `colors/button/secondary/outline/border/default`(`VariableID:59:2228`) **#007c56 그대로**, 1px INSIDE |

Rounded 전부 · Square Default · `button_icon` 전부가 이미 outline 토큰을 써서, Square Hover · Pressed만 다른 상태였습니다.

## R3. 차트 가로 막대 · 기본 · Group=yes 비교 막대 — 완료 (지정 5노드)

| | 변경 전 | 변경 후 |
| --- | --- | --- |
| 733:4967 · 742:31980 · 742:31986 · 742:31992 · 742:31998 (변형 733:4930, 현재 이름 `…, hover=no`) | 그라디언트 정지점 0 `colors/chart/simple/history`(`VariableID:762:5825`, #e2e5e9), 정지점 1 바인딩 없음 #e2e5e9 · 40% | 정지점 0 **`colors/chart/series/compare`(`VariableID:697:4134`, #d6dae0)**, 정지점 1 #d6dae0 · 40% — 세로 막대 비교 막대(728:31488 등)와 같은 값. 그라디언트 방향 · 위치는 그대로 |

범례(I746:33346;746:33293) · 툴팁 표시 · 세로 막대와 색이 일치합니다. 다른 계열 색은 바꾸지 않았습니다.
같은 오류가 원본에 새로 추가된 hover 변형에도 복제되어 있습니다 — N1(승인 대상).

## R4. 12px 모서리 변수 — 완료

- 신규 Primitive 변수 **`border-radius/rounded-[12px]`** = 12(`VariableID:1033:6620`), scopes `CORNER_RADIUS`, WEB code syntax `var(--border-radius-rounded-12px)`(코드의 실제 CSS 변수 — F81 생성 규칙 개선 후),
  설명 기재. 기존 `rounded-[2px]` · `rounded-[5px]`와 같은 이름 규칙. 값 12인 기존 모서리 변수 없음(중복 아님).
- 원격 `radius/xlarge1`(`VariableID:51661197…/138:631`)은 원격 라이브러리의 다른 변수를 다시 가리키는 별칭이며 값 12 — 로컬 변수로 대체.
- 재연결(4개 모서리 모두, 값 12 그대로): 697:4487 `metric-card` · 698:4163 `dashboard-filter-bar` · 773:6944 · 773:7038 `chart-panel`(원격) · 773:9908 `chart-panel`(바인딩 없던 12).
- legacy 페이지: 컴포넌트 인스턴스 10개(773:13550 · 773:13552–13555 · 868:10955 · 868:10957–10960)는 자동으로 로컬 변수를 따름. 나머지 19개 화면 시안 프레임은 원격 변수 그대로(N7).
- 코드: `figma-pending/primitive.txt`의 등록 대기 항목을 지우고 스냅샷에서 생성(CSS 변수 이름 같음).

## R5. Accordion md · Hover · Expanded 위치 — 미확인 (수정 불가)

대상 796:5903이 속한 `accordion-item`(796:6071)은 페이지에서 분리되어 있고 Accordion 프레임(796:5813)이 원본에서 삭제되어 있습니다(이번 작업 전, 다른 편집).
캔버스에 없는 노드라 위치를 비교 · 수정할 수 없습니다 — N4 참고. 코드 · 검증 기준은 이전 Accordion 그대로입니다.

## R6. Table 편집 칸 Filter 칩 상태 — 693:7165 완료, 693:7167 오류 아님

같은 세트의 다른 Type은 칸 상태를 다음처럼 매핑합니다: Hover · Empty → 컨트롤 Default, Hover · Filled → 채워진 상태(Completed), Editing → Focus / Open.
Filter의 Filled 변형(Default · Disabled · Hover)은 모두 칩 **Selected**입니다.

| 노드 | 변경 전 | 판단 | 변경 후 |
| --- | --- | --- | --- |
| 693:7165 Editing · Filled (칩 인스턴스 977:12767) | `Variant=Unselected, Expanded=True`(558:25884), 라벨 "선택유형: 옵션명, 옵션명" | Filled인데 Unselected — 명백한 상태 매핑 오류 | **`Variant=Selected, Size=md, State=Default, Expanded=True`(570:26566)**, 라벨 · 크기 · 위치 그대로 |
| 693:7167 Hover · Filled | 칩 Selected · State=Default | 다른 Type의 Hover · Filled(컨트롤 자체는 Hover 아님)와 일치 — 오류 아님 | 변경 없음 |

Editing 변형이 1px 위(y 894)인 것은 모든 Type의 Editing 변형에 공통이라 의도된 배치로 보고 바꾸지 않았습니다.
Hover · Empty(693:7163)의 칩만 State=Hover인 점은 N6.

## R7. Table 편집 칸 Filter · Editing의 다중 선택 목록 — 결정 대기 (D3)

693:7165 아래의 `listbox / Size=sm`(97:2664) + `option`(Selected 2개)은 칩 트리거 + 다중 선택 목록입니다. 라이브러리에 해당 컴포넌트가 없어
① 새 컴포넌트 ② `DropdownMenu` 선택 모드 대체 ③ 다른 패턴 중 결정이 필요합니다. 쇼케이스는 목록을 그리지 않습니다.

## R8. Table 편집 칸 안내 글자 — 완료

| | 변경 전 | 변경 후 |
| --- | --- | --- |
| 355:4281 · 540:24708(Switch 「설명」), 355:4223(File Upload 안내) | 삭제된 `VariableID:355:4282` `colors/table/key-value/value/label/hover` — 마지막 값이 `colors/text/tertiary`의 별칭, 표시 #778191 | **`colors/text/tertiary`(`VariableID:47:7518`)** #778191 그대로, 텍스트 스타일 `xs/leading-normal/normal` 그대로 |

삭제된 변수의 원래 연결 대상이자 이 DS에서 보조 · 설명 글자에 쓰는 Semantic 토큰입니다(Dialog · Card · Alert 설명도 같은 값).
Table에는 안내 글자 전용 토큰이 없습니다 — 컴포넌트 계층 토큰(예: `colors/table/key-value/value/description`)을 둘지는 승인 대상(A-3).
인스턴스 안의 같은 글자 2개(I507:23880;355:4281, I507:23893;355:4223)는 메인을 따라 바뀌었습니다.

## C3. 텍스트 스타일 `sm/leading-normal/underline` — 바인딩 완료

| 속성 | 변경 전 | 변경 후 |
| --- | --- | --- |
| letterSpacing | 삭제된 `font/tracking/normal`(`VariableID:359:7941`) = 0 | `font/tracking/tracking-normal`(`VariableID:369:8669`) = 0 |
| 굵기 | 삭제된 `font/weight/font-500`(`VariableID:359:7905`, fontStyle "Medium") | fontStyle 바인딩 해제, `font/weight/font-medium`(`VariableID:369:8622`) = 500 |

같은 계열 `xs` · `base/leading-normal/underline`과 같은 바인딩입니다. 글꼴 Medium · 14 · 자간 0 그대로, 사용 노드는 Link md 5개.
줄 높이 140%(19.6px, 바인딩 없음)는 2026-10-19 정책 작업에서 `font/line-height/leading-5`(20px)로 연결했습니다(A-4 완료).

---

## P. 코드 정책 → Figma 공식 정책 (2026-10-19 밤, 사용자 승인 작업)

코드에만 있던 정책을 Figma에 정의했습니다. 쓰기 전마다 대상 노드 · 체크섬을 다시 읽었고(공동 편집 파일), 기존 이름 · 크기 · 레이아웃 · 바인딩 ·
인스턴스 호환을 유지했습니다. 항목별 출처와 처리 상태는 [code-policy-audit.md](./code-policy-audit.md).

| 대상 | 변경 | ID |
| --- | --- | --- |
| Semantic 변수 | `colors/border/focus` 추가(→ `colors/brand/700`, STROKE_COLOR) | VariableID:1080:6697 |
| 포커스 속성 | Boolean 속성 `Focus`(기본 꺼짐) + 숨김 "Focus ring" 레이어(2px, `colors/border/focus` · `border-width/border-2` 바인딩) — 24개 세트 766개 변형. 바깥형: Button 3종 · Checkbox · Radio · Switch · Link · Tabs 2종 · Pagination 2종 · Chip 3종 · Segmented 항목 · Slider 손잡이 · File Uploader · 달력 날짜 · 이동 · Breadcrumb 항목, 안쪽형: Navigation 3종 · Accordion | 54:2904 · 67:2368 · 432:8395 · 99:2389 · 102:2677 · 107:409 · 111:1509 · 91:5000 · 91:5241 · 132:520 · 132:604 · 201:12711 · 558:26017 · 558:25704 · 524:24397 · 391:2013 · 651:3945 · 144:1033 · 144:1328 · 710:4794 · 180:5246 · 180:6174 · 180:6249 · 1035:15648 |
| Select | State=Focus 변형 3개(테두리 `select/outline/outline/border/focus`), 세트 아래 새 줄 — 세트 너비 2400 유지 | 1081:7873 · 1081:7878 · 1081:7883 |
| Dialog 덮개 | `colors/surface/scrim` → `colors/alpha/black/500`(검정 50%), Component 변수 `colors/dialog/scrim/default`(→ surface/scrim) 추가, 덮개가 있는 "Modal example" | VariableID:789:5712 · VariableID:1091:7124 · 1091:7126 |
| Card | 예시 그림자: 원격 shadow-sm → 로컬 효과 스타일 `elevation-1`(F60) | 185:8050 |
| 대시보드 | metric-card · dashboard-filter-bar · data-state의 원격 `padding/6` · `color/background/white` → 로컬 `p-4` · `colors/surface/page`(F69), metric-card · dashboard-filter-bar 그림자 → 같은 값의 효과 스타일 `elevation-3`(인스턴스 10개 모두 따라감) | 697:4487 · 698:4163 · 698:4359 |
| 텍스트 스타일 | `sm/leading-normal/underline` 줄 높이 140% → `font/line-height/leading-5`(20px, A-4) | — |
| Date Picker | 달력 요일 이름 한국어(일 월 화 …, F25) | 144:1644 |
| Pagination | 1페이지 예시의 이전 버튼 Disabled | 132:871 |
| Empty State | Boolean 속성 `Show Button` | 724:14963 (`Show Button#1091:0`) |
| Table | 예시 행 Hover · Pressed를 Component 변수 `table/data/background/*`로(F54) | 355:3739 예시 |
| 규칙 문서 | "Design System Rules" 02–06장 추가(01장 다음, 같은 표 스타일) · "Design System Rules (계속)" 07–10장(같은 스타일, x 1020 · Variables 사용 가이드 아래) | 227:3774(02 1097:5009 · 03 1097:5110 · 04 1097:5204 · 05 1097:5312 · 06 1100:5009) · 1100:5082(07 1100:5398 · 08 1100:5492 · 09 1100:5579 · 10 1100:5645) |
| Dev Mode 주석 | 컴포넌트 고유 동작 · 접근성 규칙 17개(Interaction · Accessibility · Development · Content 분류) | 1035:15648 · 179:6087 · 712:5106 · 698:4399 · 693:9776 · 558:26017 · 144:723 · 91:5927 · 149:1111 · 149:2838 · 95:4740 · 391:1988 · 503:23264 |

남긴 것(Figma 반영 대기): Segmented 선택 항목 그림자(0 1 2 / 9%, 같은 값의 효과 스타일 없음 — 등록은 디자인 결정, F18), Table Textarea 유형 두 줄 예시(F58).

## S. Figma × Storybook 전체 동기화 (2026-10-19 밤, 사용자 승인 작업)

쓰기 전마다 대상 노드를 다시 읽고 변경 전 값을 기록했습니다. 이름 · 크기 · 레이아웃 · 인스턴스 호환을 유지했고, 대량 삭제는 없습니다.
변경 후 변수 · 스타일 체크섬 8그룹이 로컬 스냅샷과 일치(Primitive 456 · 167, Theme 44, Semantic 69, Component 82 · 725, 텍스트 46, 효과 4).

| 단계 | 대상 | 변경 | ID |
| --- | --- | --- | --- |
| ① 차트 툴팁 | Rules 05 위치 셀 · Rules 10 포털 셀, chart-tooltip 주석 | 툴팁은 자기 차트 그림 영역 안 · 보이는 부분 우선 · 다른 차트와 공유 · 겹침 없음, 포털 대상에서 제외 | 1097:5368 · 1100:5699 · 1100:5701 · 693:9776 |
| ② 필터 칩 | 다중 선택 예시 이름 "Calendar Container" → "chip-filter 다중 선택 예시"(구조 그대로) | 이름만 | 1011:12956 |
| ② 필터 칩 | 단일 선택 예시 추가(원본 복제 — chip-filter · listbox · option 인스턴스) | 새 프레임 | 1149:6756(열 1149:6761 · 6768 · 6786 · 6793 · 6811) |
| ② 필터 칩 | Rules 04 "필터 칩 선택" 행, chip-filter 주석, Rules 08 칩 간격 8 → 4px(예시 바인딩 m-1에 맞춤) · chip-input 주석 정정 | 문서 | 1149:6982(셀 1149:6984 · 6986 · 6988) · 558:25704 · 558:26017 |
| ③ 접근성 | Rules 03 "이름과 설명" 행 — 보이는 글자가 이름에 포함(WCAG 2.5.3), 같은 종류 랜드마크는 서로 다른 이름 | 문서 | 1097:5110 안 |
| ④ 상태 | option md Disabled 텍스트 스타일 `base/leading-normal/underline` → `base/leading-normal/normal`(F6) | 스타일 | 97:2331 |
| ④ 상태 | Component 변수 `colors/search-field/solid/border/error`(→ `brand-status/error/strong`, STROKE_COLOR, WEB code syntax) · Solid Error 3변형에 2px 안쪽 테두리(E8) | 변수 1 · 3변형 | VariableID:1158:7281 · 439:10252 · 439:10295 · 439:10338 |
| ⑤ 차트 | 개편 뒤 삭제된 변수 5개를 가리키던 차트 노드 91곳 → 같은 색의 현재 변수(`line/primary` · `line/02` · `surface/container-subtle` · `chart/series/02` · `bar/compare/gradient/start`) | 바인딩만, 색 그대로 | 698:4399 안 · 삭제 변수 VariableID:1129:5009 · 1129:5011 · 1113:5029 · 1113:5030 · 1052:6698 |
| ⑤ 차트 | WEB code syntax 4개 정정 — `line/02 · 03 · 04/default`(→ `var(--colors-chart-line-0N-default)`), `label/legend/default`(→ `var(--colors-chart-label-legend-default)`) | code syntax | VariableID:1135:16414 · 1135:16415 · 1135:16416 · 1052:6711 |
| ⑤ 차트 | **점선 복원**: 범례 Dash Line 표시선 5 / 3, 간단 선 Group=yes 비교 선 3 / 3(개편에서 실선이 됨, F85 — 디자이너 확인 필요) | `dashPattern` | 703:4817 · 762:5858 · 1011:15054 |
| ⑤ 원격 | 컴포넌트 안 아이콘 7곳의 원격 `colors/icon/secondary` → 같은 값의 로컬 변수(값이 다른 355:4444 · 355:4445는 그대로, F86) | 바인딩만 | I476:20465 · I476:20410 · I476:20390 · I693:8187 · I675:4864 · I773:6950 · I773:7044 하위 |
| ⑤ Card | 부품 컴포넌트 이름 "Frame 2147239186" · "Wrapper" → `card_header` · `card_footer`, 설명 추가(F88) | 이름 · 설명 | 218:7173 · 218:7174 |

관찰된 다른 편집(이번 작업이 한 것 아님 — 코드 · 스냅샷을 맞춤): 차트 토큰 개편(F84 — Semantic 4개 삭제, Component chart 변수 재구성,
샘플 글자 · 툴팁 계열 이름 너비 규칙).

## T. 정책 · 설명 간소화 (2026-10-20, 사용자 승인 작업)

처음 보는 사람도 읽을 수 있게 Figma의 정책 표를 짧은 규칙으로 바꾸고, 기술 주석을 지웠습니다. 지우기 전에 전체 내용을
[policy-details.md](./policy-details.md)로 옮겼습니다. 표 디자인(열 너비 · 셀 스타일 · 텍스트 스타일)과 01장(디자이너 작성)은 그대로입니다.

| 대상 | 변경 | ID (Ver 0.4) |
| --- | --- | --- |
| Rules 02–09장 | 머리글을 "정책 · 적용 대상 / 사용 규칙 / 디자인 기준"으로, 셀을 1–2문장의 쉬운 한국어로(토큰 이름은 디자인 기준 열에만). 장 제목 간소화(05 "팝업 · 메뉴 · 툴팁", 06 "알림 · 진행 표시", 07 "데이터 표시", 09 "움직임"). 행 수 정리: 02 7→6, 04 9→8, 05 7→8(복제 1), 그 외 같음. 한국어 줄바꿈을 단어 단위로 맞춤(겹침 · 잘림 없음) | 227:3774 · 1100:5082 안 1097:5009 · 1097:5110 · 1097:5204 · 1097:5312 · 1100:5009 · 1100:5398 · 1100:5492 · 1100:5579, 삭제 행 1097:5103 · 1097:5305, 추가 행 1198:5155 |
| Rules 10장(개발 구현 세부) | 삭제 — 개발 문서로만 관리 | 1100:5645 |
| Dev Mode 주석 | 17개 모두 삭제(동작 · 접근성 · 개발 · 콘텐츠 기술 설명) | 95:4740 · 91:5927 · 149:1111 · 149:2838 · 144:723 · 179:6087(2) · 558:26017 · 558:25704 · 503:23264 · 391:1988 · 712:5106 · 698:4399(2) · 693:9776 · 1035:15648(2) |
| 컴포넌트 설명 | 34개: 영어 Focus 설명 → "Focus: 키보드로 선택했을 때 보이는 포커스 테두리입니다.", Select · Empty State · Pagination · Card 부품 설명을 짧은 한국어로, 디자이너 설명에서 개발 · 임시 메모만 삭제(목록: policy-details.md 마지막 절) | Focus 속성 세트 22개 · 95:4740 · 724:14963 · 132:871 · 218:7173 · 218:7174 · 651:3945 · 651:3999 · 712:5106 · 710:4794 · 697:4487 · 698:4163 · 698:4359 |

그대로 둔 것: 컴포넌트 · 변형 · 토큰 · 스타일 · 예시, 01장, "Variables 구조 한눈에 보기" · "Variables 사용 가이드"(디자이너 안내), 애니메이션 참고 링크.
재조회 결과: 두 섹션 주석 0개, 정책 표 · 설명에 개발 용어 · 노드 ID 없음, 변수 · 스타일 체크섬 변화 없음.

## V. v1.0 후보 — Figma 디자인 시스템 독립 점검 · 보완 (2026-10-20, 사용자 승인 작업)

Figma를 Product Designer 관점에서 따로 점검하고(Storybook을 정답으로 보지 않음) 명확한 문제는 직접 고쳤습니다. 수정 전마다 대상을 다시 읽었고,
기존 인스턴스 연결 · 토큰 참조를 유지했습니다. 변경 후 변수 · 스타일 체크섬 8그룹을 로컬 스냅샷과 맞췄습니다.

| 영역 | 변경 | ID (Ver 0.4) |
| --- | --- | --- |
| 토큰 — Dev Mode | 모든 변수(1,543 → 1,548)에 WEB code syntax `var(--…)`(코드 생성 규칙과 같음, 기존 98개 일치 확인) | 전체 |
| 토큰 — 범위(scopes) | 색 변수 1,367개의 "모든 속성" 범위를 실제 사용처(글자 · 면 · 선 · 그림자)와 이름 역할로 좁힘. Primitive · Theme 색은 직접 쓰인 13개 외에 숨김(디자이너 가이드: Component 토큰을 연결) | 전체 색 변수 |
| 토큰 — 새 변수 | `colors/{input/outline, textarea/outline, select/outline/outline, date-picker/trigger/outline}/required/default`(→ Semantic `status/point/strong`, 표 키의 필수 표시와 같은 색), `colors/file-uploader/helper/error`(→ `status/error/strong`) | VariableID:1215:7283 – 7286 · 1215:7502 |
| 토큰 — 효과 스타일 | `elevation-segmented-selected`(0 1 2 #00000017) · `elevation-slider-handle`(0 4 6 −1 #051b3c33) — 지금 값 그대로 스타일화(F18 · F13), 손잡이의 원격 효과 · 보이지 않던 배경 흐림 정리 | 524:24397 변형 6 · 391:2013 안 5 |
| 바인딩 | 입력 칸 값 · 빈 글자 72곳 → `value/*` · `placeholder/*`(E1 · E3, 값 같음), 체크박스 숨김 체크 아이콘 12곳 → 체크박스 아이콘 토큰, F77 비교 막대 5곳, 누름 원 · 이미지 자리표시 · 값 라벨 글꼴 10곳, 초기화 아이콘 3곳(원격 → 버튼 아이콘 토큰 — 대비 문제 해결) | 76:2945 · 86:2597 · 95:4740 · 144:723 · 99:2389 · 1011:14280 – 14310 · 684:6472 · 355:4443 – 4445 · 391:2013 · 698:4163 · 698:4359 |
| 상태 — 필수 입력 | input · textarea · select · date-picker_trigger에 Boolean 속성 `Required`(기본 끔) — 라벨을 "Label row"(가로, m-2 간격)로 감싸고 4px 점 추가. 변형 80개 | `Required#1215:0` · `#1215:22` · `#1215:37` · `#1215:62` |
| 상태 — 파일 실패 | file-uploader-item `State=Error`(파일 정보 오류 색 · "업로드 실패", 삭제 버튼 유지) | 1215:7503 |
| 컴포넌트 결함 | select Focus 변형 3개의 끊긴 속성 연결 복구(F89), input `Icon-eye` 기본값 끔(F90), table_value의 연결 없는 속성 2개 삭제(F87), file-uploader-item Error 변형 파일 이름 → `File Name` 속성 연결(F92), 누름 원 불투명도 20% 복구(F93 — 이 점검의 바인딩 때 빠짐), breadcrumb 펼침 변형을 정책대로(F33 — 현재 페이지 Current, 메뉴는 … 아래) | 1081:7873 · 7878 · 7883 · 76:2945 · 355:4460 · 1215:7507 · 684:6472 · 724:13746 · 724:13752 · 719:13052 · 719:13085 |
| 사용 예시 — 새로 | 섹션 "사용 예시 화면": **Form 사용 예시**(필수 · 오류 · 선택 · 날짜 · 라디오 · 메모 · 동의 · 저장/취소 · 저장 중), **Dashboard 화면 예시**(조회 조건 · 지표 카드 4 · 선/막대 차트(툴팁) · 결과 없음 · 불러오는 중 · 기준 시각), **Table 목록 화면 예시**(검색 · 필터 · 등록 · 표 · 페이지 이동 · 결과 없음) — 모두 실제 컴포넌트 인스턴스와 토큰 | 섹션 1216:5171, 1216:5172 · 1217:5240 · 1217:7720 |
| 사용 예시 — 정리 | 예시 프레임 19개 이름(F91), 잘못 복사된 설명 2개(Accordion · Chip), Dialog 모달 예시 설명을 쉬운 문장으로 | 1035:15742 · 570:26820 · 1091:7125 |
| 정책 표 | 04장 "필수 입력", 06장 "처리 중" 행 추가, 07장 "파일 첨부"에 실패 표시 추가 | 1217:7941 · 1217:7948 · 1100:5478 |

결정이 필요한 항목은 [v1.0-candidate.md](./v1.0-candidate.md#남은-결정-사항)에 모았습니다.

## W. 검수 준비 — V-1 – V-5 디자인 정책 확정 (2026-10-20, 사용자 승인 작업)

사용자 지시: "V-1~V-5의 디자인 정책을 기존 Figma 디자인 시스템 기준으로 확정하고 필요한 상태를 Figma에 직접 제작". 수정 직전 변수 · 컴포넌트
지문(변수 1,548 · 컴포넌트 76개 속성 해시)이 아침 동기화와 같음을 확인했고, 기존 인스턴스 연결 · 토큰 참조를 유지했습니다(필드 인스턴스 40개 높이 · 속성 그대로).

| # | 결정 (기존 디자인 시스템 근거) | Figma 변경 | ID (Ver 0.4) |
| --- | --- | --- | --- |
| V-1 | 입력 칸 아래 **회색 도움말(Helper)** 로 입력 방법을 알림 — 쓰이지 않던 `helper/default` · `helper/disabled` 토큰이 근거. 아이콘 없음(상태가 아니라 설명). 상태를 알릴 때만 안내 · 성공 · 오류 | 메시지 세트 4개에 `State`(Default · Disabled) 속성과 `Type=Helper` 2변형. input · textarea · select · date-picker_trigger에 Boolean `Helper`(기본 끔) — 메시지가 없던 상태(Default · Hover · Disabled · Read-only, select는 Focus도) 47곳에 도움말 인스턴스(비활성은 Helper/Disabled). 기본 끔이라 기존 인스턴스 · 변형 크기 그대로 | 83:3009 · 86:2733 · 95:2960 · 144:888(Helper 1252:7839 – 7867), `Helper#1252:15` · `#1252:84` · `#1252:37` · `#1252:62` |
| V-2 | **처리 중 = Disabled 버튼 + 옆에 Loading(sm)** — 이미 Rules 06 "처리 중" 행과 Form 예시 "저장 중일 때"에 있음. 버튼 안 스피너는 버튼 6가지 색마다 새 색이 필요해 만들지 않음 | 변경 없음(확인) | 1217:7948 · 1216:7451 |
| V-3 | **주의(Warning)** — Badge의 Warning 색(`brand-status/warning/strong`, orange/700, 흰 바탕 5.1:1)과 DataState Partial의 삼각형 아이콘. 토스트의 주의는 오류처럼 사용자가 닫을 때까지 남김 | 변수 3개, alert · toast `Status=Warning`(Error 변형 복제 → 아이콘을 라이브러리 Warning Fill 벡터로, 토큰 연결), 순서 안내 · 성공 · 주의 · 오류 | VariableID:1251:5692 – 5694, 1252:5696 · 1252:5705 |
| V-4 | **Dialog 한 가지 크기(420px)** — 기존 Dialog는 가운데 정렬 확인용 구조(제목 · 설명 · 240px 버튼). 큰 크기는 왼쪽 정렬 입력 대화상자라는 새 컴포넌트 설계가 필요해 만들지 않음. 입력이 많은 작업은 화면으로 | Rules 05 "대화상자 크기" 행 | 1255:7481 |
| V-5 | **묶음 오류 = 묶음 아래 오류 메시지**(입력 칸 오류 메시지와 같은 `input_message` Error), 체크박스 · 라디오에는 오류 상태가 없으므로 상자 색은 그대로 | Rules 04 "묶음 오류" 행, Form 예시에 "필수 동의를 하지 않고 저장했을 때" | 1255:7474 · 1255:7497 |

정책 표: 04장 "도움말" · "묶음 오류", 05장 "대화상자 크기", 06장 "주의" 행 추가(1255:7467 · 7474 · 7481 · 7488), 06장 토스트 행 "오류 · 주의는 사용자가 닫을 때까지",
03장 상태 알림 행에 주의 추가. 줄바꿈은 단어 단위로 맞췄고(글자 높이 = 줄 수 × 16 확인) Rules 프레임이 커져도 겹침 없음. Form 예시: 부서 Select에 도움말
"인사 정보에 등록된 부서를 고릅니다.", 설명 문장 갱신.

함께 고친 결함: **F94** textarea Completed · Error의 메시지 줄 전체(글자 수 포함)가 `Alert`를 따라 숨던 연결 → 메시지만 `Alert`(Focus와 같게),
**F95** toast `Close Icon` 속성이 어느 레이어에도 연결되지 않음 → 닫기 아이콘 4곳 연결. 작업 중 복제한 변형의 속성 연결이 끊기는 것을 확인해 Warning · Helper
변형의 연결을 원본과 같게 복구했습니다(자동 대조).

검증: 변수 · 스타일 체크섬 8그룹 로컬 스냅샷과 일치(Component 733), 필드 세트 4개 geometry가 변경 전과 같은 해시(도움말은 기본 숨김),
기준 이미지 alert · toast · select_message · date-picker_message 재캡처.

## 새로 발견한 오류 (승인 대상 — 변경하지 않음)

| # | 노드 · 변수 | 현재 | 권장 | 영향 |
| --- | --- | --- | --- | --- |
| N1 | `chart` 새 변형 `Type=Bar Horizontal, Style=Default, Group=yes, hover=yes`(1011:14261)의 비교 막대 1011:14280 · 1011:14288 · 1011:14296 · 1011:14303 · 1011:14310 | R3와 같은 오류(`simple/history`) — **2026-10-19 지시로 수정 제외(F77, 회귀 확인만)** | R3와 같은 수정 | 차트 hover 변형 |
| N2 | `chart` `Type=Bar Vertical, Style=Simple, Group=yes, hover=yes`의 1011:14873 | **해결** — 원본에서 짝 762:5921도 `series/compare`로 바뀌어 일치(가로 막대 간단 Group=yes도 같음), F78로 `colors/chart/bar/compare` 연결 · 코드 동기화 | — | — |
| N3 | `chart` 세트 구조 변경 | **해결(F79)** — 코드 · 스토리 · 검증을 24개 변형으로 동기화, 기준 이미지 · geometry 재생성 | — | — |
| N4 | Accordion 프레임 삭제 | **해결** — 재등록(1035:15645) 후 F80으로 토큰 연결 · 동기화 | — | — |
| N5 | `border-radius/rounded-[2px]`(`VariableID:873:4798`) WEB code syntax | **해결(F81)** — `var(--border-radius-rounded-2px)` | 생성 규칙 개선 | — |
| N6 | 693:7163 Filter · Hover · Empty 칩(693:8205) | 칩 State=Hover — 다른 Type의 Hover · Empty는 컨트롤 Default | 의도 확인 후 Default로 | Table 쇼케이스 1칸 |
| N7 | legacy 화면 시안 19개 프레임 | 원격 `radius/xlarge1` | 로컬 `rounded-[12px]`로(값 같음) | 시각 변화 없음, 원격 의존 제거 |

작업 중 관찰된 다른 편집(이번 작업이 한 것 아님, 같은 값 — 동기화함): `colors/button/secondary/outline/background/default` · `/hover`가 `fill/secondary/subtle/*`로,
`colors/chip-filter/background/unselected/default`가 `fill/primary/subtle/default`로 별칭 변경.

## X. 접근성 전체 해결 — 토큰 수정 (2026-10-27 저녁, 사용자 승인 작업)

| 항목 | Figma 변경 | 변수 · 노드 |
| --- | --- | --- |
| 플레이스홀더 | `colors/text/placeholder` brand-gray/400 → **600** (A-1 복귀, 5.89:1) | VariableID:47:7521 |
| Button Secondary Solid | `colors/fill/secondary/strong/hover` brand/600 → **800**, `pressed` brand/500 → **900** (흰 라벨 7.27 · 10.14:1, Primary와 같은 단계 규칙) | VariableID:44:7324 · 44:7323 |
| R9–R11 적용 | `breadcrumb/label/default` · `file-uploader/helper/default` · `stepper/label/title/locked` → `text/tertiary`; `stepper/label/description/locked` text/disabled → `text/tertiary`(A-1 복귀) | VariableID:111:1700 · 650:3867 · 203:3935 · 203:3939 |
| A-2 복구 | `checkbox/border/unchecked/default` · `radio/border/unselected/default` gray-subtle → `border/gray`, `hover` gray → `border/gray-dark` | VariableID:100:2512 · 100:2513 · 102:2387 · 102:2388 |
| F80 복구 | Component 컬렉션에 `spacing/accordion/trigger-padding-x/{md,sm}` · `spacing/accordion/padding/{md,sm}` · `spacing/accordion/body-padding` · `size/accordion/trigger-height/{md,sm}` · `border-radius/accordion/default` · `border-width/accordion/default` 재생성(원래 별칭 · 스코프 · WEB 코드 문법), accordion-item(1035:15648) 10개 변형의 Trigger · Body · Divider 94곳 재연결 | VariableID:1499:7382 – 7390 |
| F96 | date-picker_calendar(1339:6880) 설명 "Secondary TextButton" → "Primary TextButton" | 1339:6880 |

> **2026-10-28**: 사용자가 Figma에서 `colors/fill/secondary/strong/hover` · `pressed`를 다시 **brand/600 · brand/500**으로 되돌렸습니다(F100 종결, 이 작업은 Figma를 수정하지 않고 동기화만). 흰 라벨 대비 3.51:1 · 2.46:1은 [accessibility.md](./accessibility.md)에 기록.

유지한 Figma 변경(동기화만): Tab 밑줄 `gray-subtler · gray-subtle · gray`, Stepper 현재 단계 배경 `fill/primary/strong/default`, Toast `label/title` · `label/body`, Breadcrumb Role=Open 삭제.

## Y. Chip Filter 선택값 표시 규칙 — 사용 예시 글자 수정 (2026-10-28, 사용자 요청 작업)

필터 칩 글자 규칙이 "필터명: 값, 값"(3개 초과 시 "외 N")에서 **0개 "필터명" · 1개 "필터명: 값" · 2개 이상 "필터명: 첫 값 외 n개"** 로 바뀌어, `chip-filter 다중 선택 예시`(1011:12956)의 인스턴스 `Label Text` 속성을 코드와 같은 글자로 고쳤습니다. 컴포넌트 세트 · 변수는 바꾸지 않았습니다.

| 인스턴스 | 이전 | 이후 |
| --- | --- | --- |
| 1011:13442 · 1011:13401 · 1011:13541 · 1011:13675 | 나이대: 옵션명, 옵션명 | 나이대: 옵션명 외 1개 |
| 1011:13556 | 나이대: 옵션명, 옵션명, 옵션명 | 나이대: 옵션명 외 2개 |

바꾸지 않은 곳: `table_value_editable` Type=Filter · Content=Filled 변형 4개의 "선택유형: 옵션명, 옵션명"(컴포넌트 변형 안의 예시 — 코드 예시는 `maxDisplayed={2}`로 같은 글자 유지), `dashboard-filter-bar`의 "비교: 이전 7일"(값 1개라 규칙과 같음). 표 변형도 새 규칙으로 맞출지는 결정 대상입니다.

## AA. DatePicker Input — date-picker_trigger 복귀 · Open 상태 · 사용 예시 (2026-10-28, 사용자 요청 작업)

Calendar와 DatePicker를 `DatePicker` 하나로 통합하면서 Figma의 Select형 날짜 필드 `date-picker_trigger`(144:723)를 다시 기준 디자인으로 썼습니다. 변수 · 스타일은 만들지 않았고(기존 `colors/date-picker/trigger/outline/*` 그대로, 체크섬 8그룹 동일) 세트 · 예시만 고쳤습니다.

| 항목 | Figma 변경 | 노드 |
| --- | --- | --- |
| 세트 표시 | 숨겨져 있던(`visible=false`, 설명 "Legacy … calendar-only") `date-picker_trigger` 세트와 제목 글자를 다시 보이게 하고, 설명을 DatePicker Input 규칙(Select 구조 + calendar-dots 아이콘, 아래 4px 팝오버, Display Text 형식, 직접 입력 아님)으로 교체 | 144:723 · 149:834 |
| State=Open 추가 | Focus 변형을 복제해 `Size=sm · md · lg, State=Open` 3개 추가(테두리 `…/border/focus` 유지, 아이콘 `colors/icon/secondary` — Select Open과 같음, 메시지 없음). 세트 2740×356으로 확장 | 1609:7471 · 1609:7480 · 1609:7489 |
| 사용 예시 | "date-picker 사용 예시" 프레임을 "DatePicker 사용 예시 — Input / Inline"으로 재구성: Input · Single(필드 Completed "2026.10.28" + Single 달력), Input · Range("2026.10.28 ~ 2026.11.03" + Range Selected 달력), Input · Open(State=Open 필드 + 달력), Inline(달력만). 필드와 달력은 세로 자동 레이아웃 4px 간격 | 149:840 · 149:844 · 1609:7513 · 1609:7699 · 1609:7870 |

코드: 기하 `figma/geometry/date-picker_trigger.json`(24개, 위치 포함) 재추출, 참조 이미지에 Open 3칸 추가, `figma/verify/date-picker.json`에 트리거 세트 복귀.

## AB. 잔여 이슈 통합 개선 — Variables · 효과 · Rules 글 · 구조 정리 (2026-10-28 저녁, 사용자 요청 작업)

"Figma 디자인 오류는 Figma 먼저" 원칙으로 아래를 고쳤습니다. 변수 삭제는 하지 않았고(미사용 변수 일괄 삭제 금지), 변경 뒤 체크섬 8그룹이 스냅샷과 일치합니다(semantic · primScalars는 스냅샷 쪽을 함께 갱신).

| 항목 | Figma 변경 | 노드 · 변수 | 전 → 후 |
| --- | --- | --- | --- |
| F100 Button Secondary / Solid 대비 | Semantic `colors/fill/secondary/strong/hover` 별칭 brand/600 → **brand/800**, `pressed` brand/500 → **brand/900**(Component `button/secondary/solid/background/*`는 그대로 참조) | Semantic 2개 | 흰 라벨(#fdfdfd) 대비 Hover #009b68 3.51:1 → #006247 **7.42:1**, Pressed #02bb7b 2.46:1 → #004a38 **10.2:1** |
| F102 accordion 외톨이 그림자 | `Size=sm, State=Default, Expanded=True` Trigger의 `elevation-3` 효과 스타일 제거(다른 Expanded 변형 3개와 같게) | accordion-item 1035:15648 | 세트 스크린샷 픽셀 동일 |
| F103 Rules 글 | 06장 "처리 중": "저장처럼 시간이 걸리는 동작은 끝날 때까지 버튼 안에 로딩 표시를 보여 주고, 다시 누를 수 없게 합니다." / "버튼 안 Loading(sm), 버튼 색은 그대로 — Form 사용 예시 \"저장 중\"". 09장: Segmented Control · Stepper · 펼침 · 닫힘(select · calendar · breadcrumb · chip-filter) 행 → "즉시 바뀜", dropdown-menu-sub 행 → "기본 메뉴(200px) · 글자만 있는 좁은 메뉴(140px), 하위 메뉴 없음(05장)", 반복 움직임 행에 "스피너 1초 · 스켈레톤 2초" | 1217:7952 · 1217:7954, 1530:10724 · 10726 · 10732 · 10734 · 10740 · 10742 · 10748 · 10750, 1280:8204 | 구현과 같은 말(코드 변화 없음) |
| F105 외부 인스턴스 | password_field Focus-on 3개 변형의 `icon/visibility_off` 인스턴스 → 로컬 프레임으로 분리; slider handle 값 라벨의 `Tag/state` 인스턴스 2개 → 로컬 글자 "Value label"로 분리(텍스트 스타일 `xxs/leading-normal/semibold` 재적용) | 1625:7980 · 7989 · 7998, 1625:8007 · 8009 | 외부 바인딩 0, 픽셀 변화 없음 |
| F106 card 예시 상자 | `Frame 2147240282` → 이름 "Content placeholder", 채움 #ededed → `colors/surface/container` 바인딩 | I1304:5732;1351:11925 | gray/100 #eff0f3 |
| F108 스코프 | Primitive `font/size/*` · `shadows/scale/*` · `pro/screen-size/*` · `meta/library-version` · `font/family/basic` 55개 ALL_SCOPES → 스코프 없음 | Primitive 55개 | 값 변화 없음, 선택기에서 숨김 |
| F110 table_value_editable Date Range Picker | Default · Disabled × Empty · Filled: 글자 두 개 + "~" → 글자 하나 "YYYY.MM.DD ~ YYYY.MM.DD"(FILL, 288px); Hover Empty · Filled · Editing Filled: `date-picker_trigger` 두 개 + "~" → 트리거 하나(298px, Display Text "… ~ …") | 507:23354 · 540:24701 · 507:23692 · 540:24639, 503:23283 · 507:23416 · 513:24048 | 통합 DatePicker Range(필드 하나)와 같은 구조 |

하지 않은 것: 이름이 잘못 만들어진 Component 변수 7개(`default` · `hover` · `pressed` · `disabled` · `active` · `selected` · `disabled-selected`, 바인딩 · 참조 없음)는 삭제 대상이지만 이 세션에서 삭제 실행이 허용되지 않아 그대로 두고 보고합니다(F107). DatePicker Open 사용 예시 필드는 이미 메시지 줄 없는 70px라 변경하지 않았습니다.

코드: `figma/variables/semantic.txt` · `primitive-scalars.txt` 스냅샷, `src/tokens` 재생성, `figma/button-spec.json`, 참조 이미지(button_basic · button_icon · table_value_editable · empty-state · data-state), 기하(table_value_editable · empty-state · data-state), `figma/verify/table.json`.

## AC. 변수 · 구조 정리 — 잘못 만든 변수 7 · 미사용 67 · Semantic 쌍 · 레이어 이름 · Rules 06 주의 (2026-10-29, 사용자 승인 작업)

수정 직전마다 최신 상태를 다시 읽고(두 페이지 바인딩 스캔 15,604 · 2,927 노드, 별칭 참조, 코드 참조), 삭제는 참조 0건인 변수만 했습니다. 변경 뒤 체크섬: compButton 79 `795ac638` · compOthers 684 `fc8a95d0`(그 외 6그룹 변화 없음), 삭제된 변수를 가리키는 바인딩 0건, Component 819 → 763.

### 1. 잘못 만들어진 Component 변수 7개 — 삭제

| 변수 | ID | 값(별칭) | 참조 | 처리 |
| --- | --- | --- | --- | --- |
| `hover` | 151:1022 | `S:colors/fill/primary/subtle/hover` | legacy 페이지 화면 시안 프레임 4곳(773:12493 · 773:12739 · 773:13510 · 868:10915) | 4곳을 별칭 대상 Semantic으로 옮긴 뒤 삭제(같은 색) |
| `default` | 151:1021 | `S:colors/surface/page` | legacy 4곳(773:12689 · 773:12708 · 773:13511 · 868:10916) | 같은 방식으로 옮긴 뒤 삭제 |
| `pressed` · `disabled` · `active` · `selected` · `disabled-selected` | 151:1023 · 151:1024 · 151:1046 · 180:12183 · 201:12970 | `fill/primary/subtle/pressed` · `surface/container` · `text/inverse` · `fill/primary/strong/default` · `fill/disabled/default` | 바인딩 0 · 별칭 0 · 코드 0(토큰 생성기 제외 항목) | 삭제 |

### 2. 노드에 묶이지 않은 Component 변수 67개 — 삭제 49 · 바인딩 6 · 유지 12

판단 기준: Figma 변형이 실제로 그리는 색, 다른 변수의 별칭 참조, 코드 CSS 참조, 향후 상태 · Variant에서의 역할.

| 처리 | 변수 | 근거 |
| --- | --- | --- |
| 삭제 7 | `button/secondary/solid/border/default` · `disabled`, `tertiary/solid/border/default` · `disabled`, `secondary/outline/border/disabled`, `tertiary/outline/border/disabled`, `button/progress/border` | Solid 버튼과 Outline Disabled 변형은 테두리가 없고(stroke none), progress는 대응 Variant 없음 |
| 삭제 16 | input · textarea · select · date-picker_trigger의 `label/default` · `completed` · `error` · `disabled` | 네 필드 모두 모든 상태의 라벨을 Semantic `text/secondary`에 묶음(값도 `text/primary` 등으로 어긋나 있었음) |
| 삭제 6 | `search-field/outline/value/default`, `solid/value/default`, `outline/helper/information` · `error`, `solid/helper/info` · `error` | 값은 `label/completed`와 중복, search-field 36개 변형에 도움말 없음(코드도 없음) |
| 삭제 8 | `date-picker/weekday/label/default`, `date-picker/day/border/*` 7개 | 요일 글자는 `text/tertiary` 직접 바인딩, 날짜 칸에는 stroke 속성이 없음 |
| 삭제 12 | `select/…/option/background/selected`, `dialog/body/default`, `loading/spinner/indicator/start` · `end`, `empty-state/background/default`, `card/divider/default`, `navigation/…/child/unselected/indicator/selected`, `breadcrumb/background/focus` · `border/focus` · `border/menu`, `file-uploader/icon/drag-over`, `dashboard/border/default` | Selected 옵션은 채움 없음, dialog는 title · description만, 스피너는 `border/brand` · `transparency` · `inverse` 사용, 카드 구분선 없음, 포커스는 공통 `border/focus`, 메뉴 테두리는 dropdown-menu 토큰, 드래그 아이콘은 모든 상태 `icon/default`, 대시보드 구분선은 `border/gray-subtle` |
| 바인딩 3 | `button/tertiary/solid/background/default` · `hover` · `pressed` | button_basic · button_icon Tertiary · Solid 42개 변형이 Semantic `fill/tertiary/*`를 직접 쓰던 것을 Component 토큰으로(같은 별칭, 색 동일). 코드 Button.css도 같은 토큰 |
| 바인딩 2 | `textarea/outline/counter/completed` · `error` | 현재 글자 수 13곳(`text/brand` → completed), 초과 글자 수 2곳(input `helper/error` → counter/error, 같은 #c10007). 코드 Textarea.css도 같은 토큰 |
| 바인딩 1 | `empty-state/icon/default` | 아이콘 벡터(`icon/placeholder` → 같은 값의 Component 토큰). 코드 EmptyState.css도 같은 토큰 |
| 유지 12 | `textarea/outline/counter/disabled`, `table/data/icon/hover` · `pressed`, `navigation/lnb/item/link/unselected/icon/hover`, `slider/background/handle/outline` · `border/handle/brand`, `chart/bar/03` · `04/gradient/start` · `end`, `chart/line/03` · `04` | 향후 상태(F113), legacy 페이지 slider-outline 대안이 바인딩 중(24곳), 차트 시리즈 3 · 4 확장용(Semantic `chart/series/03` · `04` 존재) |

코드 CSS가 쓰는 나머지 23개(필드 `value/disabled` 4, `input/outline/icon/default`, `search-field/solid/label/hover`, select `check-icon/disabled`, dropdown-menu `item/icon/hover`, table 머리글 아이콘 2, segmented selected hover · pressed 4, breadcrumb home-icon 2, chart history · compare · 02 그라데이션 6, `chart/line/compare`)는 Figma 변형이 그리지 않는 상태 토큰이라 그대로 둡니다.

### 3. 같은 값의 Semantic 토큰 — 통합 없음

값 · 스코프가 같은 11묶음(쌍 8 · 셋 3)은 모두 뜻이 다른 토큰이라 유지합니다: `surface/page` = `fill/primary/subtle/default` = `fill/secondary/subtle/default`(페이지 표면 ↔ Subtle 버튼 배경; hover · pressed 2묶음도 같은 관계), `border/focus` = `border/gray`(포커스 링 ↔ 회색 테두리), `icon/placeholder` = `icon/disabled`, `text/tertiary` = `text/placeholder`(F98 결정), `icon/brand` = `chart/series/brand`, `surface/overlay` = `fill/tertiary/default`, `fill/primary/strong/hover` = `fill/secondary/strong/hover` · `fill/primary/strong/default` = `fill/secondary/strong/pressed` · `fill/secondary/strong/default` = `fill/primary/strong/pressed`(Primary는 밝아지고 Secondary는 어두워지는 서로 다른 단계가 겹친 것). 잘못된 별칭은 없었습니다.

### 4. 레이어 이름 정리 — 370개

| 범위 | 변경 | 노드 |
| --- | --- | --- |
| 컴포넌트 48 | empty-state `Content`; alert `Text group`(4); table_value_editable `Select open` · `Date picker open` · `Remove icon`; slider `Track group` · `Track control` · `Track` · `Indicator` · `Range labels` · `Value input`(2변형); handle `Handle`(5) · `Interaction ring`; file-uploader `Text group`(5); chart-tooltip `Content` · `Label column` · `Value column`; chart `Magnitude labels`(3); chart-legend-item `Series swatch`; card_header `Heading`; card_content `Content placeholder`; dashboard-filter-bar `Filters` · `Date range` · `Interval` · `Actions`; data-state `Skeleton group`; data-freshness `Details`(3) | 724:14949, 179:5988 · 5984 · 5908 · 1252:5700, 507:23792 · 524:24207 · 371:5202, 391:1990–2007 · 2063, 391:2015 · 2018 · 2020 · 2022 · 684:6472 · 6474, 675:4581–4607, 742:31790 · 693:9777 · 742:31767, 742:32020 · 1406:13890 · 1011:14276, 746:33293, 217:7089, 1351:11925, 693:10154 · 10449 · 705:11678 · 693:9814, 705:11805, 693:9690 · 9699 · 9704 |
| 사용 예시 57 | `Child menu`(4) · `Divider`(2) · `Text actions` · `Actions` · `Date action`, Dropdown Menu `Menu examples` · `Default menu` · `Sub menu`, Chip `Chip row` · `Input chip row` · `Filter chip row` · `Chip states` · `Chip multi states` · `Chip input states` · `Chip filter states` · `Example step`(12) · `Filter chip row`(11) · `Chips and list`(7), Table `Date grids`, File Uploader `Uploader with files` · `File list section` · `File list header` · `File count` · `File list`, Card `Heading`(2) | 1508:10364 · 476:19832 · 476:18670 · 180:5204, 1440:8413 · 8411 · 8412, 570:26771 · 26772 · 26758, 1011:13711 · 13707 · 13708 · 13709, 1011:13700–13674 · 1149:6761–6813, 507:23868, 746:34176–34184, 218:7167 · 1351:12805 |
| Design System Rules 표 265 | 표 9개의 프레임을 `Table` · `Header row` · `Row` · `Policy cell` · `Rule cell` · `Basis cell`로(Information container 포함) | 227:3801 …, 1097:5011 …, 1100:5011 …, 1280:8084 … |

인스턴스는 메인 컴포넌트 이름을 따르므로 따로 바꾸지 않았고(이름 재정의 0건), 크기 · 배치 · Auto Layout · 컴포넌트 연결은 손대지 않았습니다. 코드: 기하 14개 · 검증 설정 10개 파일의 부품 이름 갱신.

### 5. Rules 06 "주의" 행 추가

알림(Alert) 행을 복제해 그 아래에 넣었습니다(1656:7954, 글자 1656:7956 · 7957 · 7959 · 7961). 정책 · 적용 대상 "주의 / Alert · Toast (Warning)", 사용 규칙 "작업은 이어갈 수 있지만 확인이 필요한 일을 알립니다. 예: 일부 데이터만 표시, 곧 만료되는 설정. 작업을 막는 문제는 오류, 잘 끝난 일은 성공, 참고할 내용은 안내로 보여 줍니다. 무엇을 확인하면 되는지 한 문장으로 쓰고, 바로 확인할 수 있으면 버튼을 함께 둡니다.", 디자인 기준 "Warning 상태 — 주황 삼각형 아이콘과 warning 색. 자리와 크기는 다른 상태와 같습니다. 화면에 남겨야 하면 Alert, 잠깐 알리면 Toast(5초)." Rules 프레임은 세로 자동 레이아웃이라 아래 장은 자동으로 밀렸습니다(06장 296 → 388px).

## AG. Button Secondary / Solid 상태 밝기 — 한 단계씩 밝게 (2026-10-30, 사용자 승인 작업)

| 변수 | 변경 전 | 변경 후 | ID |
| --- | --- | --- | --- |
| Semantic `colors/fill/secondary/strong/hover` | → Theme `colors/brand/800` (emerald/800 #006247) | → Theme **`colors/brand/600`** (emerald/600 #009b68) | VariableID:44:7324 |
| Semantic `colors/fill/secondary/strong/pressed` | → Theme `colors/brand/900` (emerald/900 #004a38) | → Theme **`colors/brand/500`** (emerald/500 #02bb7b) | VariableID:44:7323 |

그대로: Semantic `…/strong/default`(brand/700 #007c56), Component `button/secondary/solid/background/hover` · `pressed`(42:1929 · 42:1930, 별칭 그대로), 라벨 · 아이콘 토큰
(`label` · `icon` default · hover · pressed 모두 `text/inverse` · `icon/inverse` #fdfdfd), 스코프 · WEB 코드 문법, 노드 바인딩(button_basic 32 · button_icon 24 Secondary / Solid 변형).
변경 전 확인: 체크섬 8그룹이 스냅샷과 일치, 두 Semantic 변수를 별칭으로 참조하는 변수는 위 Component 2개뿐, 0:1 페이지에서 직접 바인딩한 노드 없음.
legacy 페이지의 직접 바인딩 2개(`Slider · 디자인 대안 2종`, `slider-value` — `…/strong/hover`)도 함께 밝아집니다(코드 무관).

변경 후 확인: Secondary / Solid 변형의 실제 채움 Default #007c56 → Hover #009b68 → Pressed #02bb7b(Button · IconButton 모든 크기 · 모양), 다른 변형 색 변화 없음,
체크섬은 semantic만 38439d42 → efc7719c(스냅샷 동기화 후 8그룹 일치). 흰 라벨 대비 3.51:1 · 2.46:1 미달은 [accessibility.md](./accessibility.md)에 보고(요청: 밝기 우선).

## AF. Badge Count 숫자 가운데 정렬 (2026-10-30, 사용자 요청 작업)

| 항목 | Figma 변경 | 노드 |
| --- | --- | --- |
| badge_count 숫자 글자 14개 | 가로 정렬 Left → Center(`textAlignHorizontal`). 글자 상자(Single 5×12 Hug · Multiple 19×12 Fill) · 텍스트 스타일 · 색 · 배지 크기 그대로 | Single 91:6117, 95:2768, 95:2776, 95:2784, 95:2792, 95:2800, 95:2808 · Multiple 91:6120, 95:2770, 95:2778, 95:2786, 95:2794, 95:2802, 95:2810 |

원인: 글자 상자가 왼쪽 정렬이라 정수 픽셀로 올림한 상자의 나머지가 모두 오른쪽 여백이 되어 숫자가 왼쪽으로 치우쳤습니다. 4배 렌더의 잉크 좌/우 여백 "1" 6 / 7px → 6.25 / 6.75px,
"99+" 4.5 / 5px → 4.5 / 4.75px(남은 차이는 글리프 옆 여백). 세로는 12px 줄 상자가 배지 가운데(위 2 · 아래 2)이고 숫자 잉크는 Pretendard 기준선 때문에 0.375px 아래(4.75 / 4px)인데,
코드도 같아 바꾸지 않았습니다(figma-issues F116).

변수 · 스타일 변화 없음. 참조 이미지 `figma/reference/badge_count.png` 다시 내보냄(바뀐 602px 모두 글자 상자 안). 코드: Badge.css `.ds-badge-count__label { text-align: center }`,
Badge Gallery "Count Digits" 스토리.

## AE. Tooltip 거리 2px 추가 · 사용 예시 제작 (2026-10-29, 사용자 요청 작업)

| 항목 | Figma 변경 | 노드 |
| --- | --- | --- |
| Rules 05 "열리는 위치" 디자인 기준 | "4px 간격(툴팁은 화살표를 포함해 8px)" → "4px 간격(툴팁은 화살표를 포함해 10px — 화살표 끝과 요소 사이 2px)" | 1097:5370 |
| Tooltip 사용 예시 | Tooltip 프레임(149:780) 아래에 세로 자동 레이아웃 프레임 추가 — DatePicker 사용 예시와 같은 머리글(Example 배지 + 설명) · 격자(emerald/50, 20px 여백, 32px 간격, 488px 폭에서 줄바꿈). 무대 6개: 기본(화살표 끝과 2px — 주황 2px 표시 + "2px 간격" 글자), 위치(Top · Bottom · Left · Right), Hover(버튼 Hover 변형), Focus(버튼 Focus 속성), 화면 가장자리(위쪽에 공간이 없어 아래로 열림, 테두리 있는 화면 프레임), 여러 툴팁(아이콘 버튼 3개 중 Hover인 하나만). 모든 말풍선은 tooltip 변형 인스턴스, 버튼은 button_basic Secondary · Outline · sm / button_icon Tertiary · Outline · sm 인스턴스(연결 유지, 재정의는 글자 · 위치뿐) | 1668:7954 (프레임 588×1236으로 커짐, 이웃 프레임과 겹침 없음) |

변수 · 스타일 변화 없음(체크섬 8그룹 동일). 코드: Tooltip.tsx `offset` 8 → 10(`TOOLTIP_OFFSET`), 검증 스토리 · 흐름 · 문서.

## AD. F112 · F113 — SearchField 토큰 이름 구조화, 상태 토큰 바인딩 수정 (2026-10-29, 사용자 승인 작업)

변경 뒤 체크섬 compOthers 688 `70863118`(그 외 7그룹 변화 없음), 삭제된 · 끊어진 참조 0건, Component 763 → 767.

### F112 search-field 토큰

| 처리 | 변수(ID) | 전 → 후 |
| --- | --- | --- |
| 이름 변경(ID · 바인딩 유지) | outline 451:11335 · 11336 · 11339 · 11337 · 11338, solid 447:11189 · 451:11334 · 447:11192 · 11190 · 11191 | `label/default` → `placeholder/default`(text/placeholder), `label/hover` → `placeholder/hover`(text/placeholder), `label/disabled` → `placeholder/disabled`(text/disabled), `label/completed` → `value/completed`(text/primary), `label/error` → `value/error`(text/primary). WEB code syntax도 새 이름 |
| 신규 | `outline/value/default` 1660:7954 · `solid/value/default` 1660:7956 → `S:colors/text/primary`; `outline/value/disabled` 1660:7955 · `solid/value/disabled` 1660:7957 → `S:colors/text/disabled` (TEXT_FILL) | input · textarea · select · date-picker와 같은 `placeholder/*` · `value/*` 구조 |
| 재바인딩 | Focus 변형 Input 글자 6곳(216:6586 · 6629 · 6672, 439:10239 · 10282 · 10325) → `value/default`; solid Hover 3곳(439:10233 · 10276 · 10319) → `solid/placeholder/hover` | 색 동일(text/primary · text/placeholder) |

상태별 색은 그대로입니다: Default · Hover placeholder(brand-gray/600), Focus · Completed · Error 값(brand-gray/900), Disabled placeholder(brand-gray/300).

### F113 상태 토큰

| 항목 | Figma 변경 | 전 → 후 |
| --- | --- | --- |
| textarea Disabled 카운터 | 86:3036 · 3037 · 3038(sm), 86:3042 · 3043 · 3044(md) → `colors/textarea/outline/counter/disabled` | 현재 수 `counter/completed` brand/700 #007c56, "/" · 최대 수 `counter/default` brand-gray/600 #778191 → 모두 text/disabled brand-gray/300 #c2c7d0 (비활성 value · placeholder · helper와 같은 규칙) |
| navigation item_link Hover · Unselected 아이콘 | I476:18731;128:1335;2:44340;8899:59372 → `…/link/unselected/icon/hover` | icon/tertiary brand-gray/500 → icon/secondary brand-gray/700 (item_parent Hover와 같음) |
| table `data/icon/hover` 별칭 | 변수 355:3807 값 `S:colors/icon/tertiary` → `S:colors/icon/primary` | hover가 기본(icon/secondary 700)보다 연한 500이던 위계를 900으로 — header `icon/active` · 다른 컴포넌트의 hover 단계와 같은 방향. 세트에 Hover 변형이 없어 노드 바인딩 없음(코드: 행 hover · pressed가 끌기 손잡이 아이콘을 칠함) |

유지: `slider/background/handle/outline` · `slider/border/handle/brand` — legacy 페이지 "Slider · 디자인 대안 2종"의 slider-outline 세트와 그 인스턴스 24곳이 바인딩(채택되지 않은 대안이지만 삭제하면 legacy 노드가 풀림).

## Z. 전체 품질 감사 — 끊어진 · 외부 변수 바인딩 수정 (2026-10-28, QA 브리프의 "명확한 오류는 직접 수정" 승인)

Component 섹션 68개 세트를 모두 훑어(use_figma 읽기) 하드코딩 색 · 삭제된 변수 참조 · 외부 라이브러리 변수 참조를 찾았습니다. 변수 · 스타일 자체는 바꾸지 않았고(체크섬 8그룹 동일) 노드 바인딩만 고쳤습니다.

| 세트 | 문제 | 수정 | 시각 변화 |
| --- | --- | --- | --- |
| accordion-item(1035:15648) | 10개 변형의 Trigger 네 모서리가 삭제된 변수 `VariableID:1042:6704`(값 0)에 묶임 — F80 복구 누락 | 복구된 `border-radius/accordion/default`(1499:7389 → rounded 4px)로 재연결(40곳) | 트리거 모서리 0 → 4px(코드 · 참조 이미지 동기화) |
| card(1306:10075) | 루트 테두리 두께 4곳이 외부 라이브러리 변수 `border-width`(1)에 묶임 | `border-width/border`(17:1970)로 재연결 | 없음 |
| password_field(1440:8466) | Focus-on 3개 변형의 `icon/visibility_off`(외부 아이콘 인스턴스) 벡터 6곳이 외부 변수 `color/icon/gray` · `color/icon/inverse-static`에 묶임 | 회색 5곳 → `colors/input/outline/icon/focus`, 흰 테두리 1곳 → `colors/input/outline/background/default`(18곳) | 없음(참조 이미지 재대조 0픽셀) |
| handle(391:2013) | 값 라벨 "Description Top"(외부 `Tag/state` 인스턴스)의 글자 속성 5개가 외부 폰트 변수에 묶임 | 로컬 텍스트 스타일 `xxs/leading-normal/semibold` 재적용 — 인스턴스 내부 바인딩은 이 파일에서 풀리지 않아 그대로 남음(F105) | 없음 |

수정하지 않고 기록만 한 것: card Content의 하드코딩 회색 상자(F106), 바인딩되지 않은 Component 변수 97개(F107), Primitive의 ALL_SCOPES 55개 · 같은 값을 가리키는 Semantic 쌍 9개(F108), 이름 없는 프레임(`Frame 2147…`) — alert · slider · file-uploader · table_value_editable · card(F109).

## 플레이스홀더 토큰 오용 — 바인딩 수정 요청 (2026-10-27, 적용 완료 — X절)

`text/placeholder`가 brand-gray/400(#a1a8b5)으로 바뀌면서(F98) 플레이스홀더가 아닌 글자에 이 토큰을 묶어 둔 곳이 대비 2.35:1로 내려갔습니다. 코드는 Figma 바인딩을 그대로 따르므로 Figma에서 바꾼 뒤 재동기화합니다.

| # | 변수 | 현재 | 제안 | 영향 |
| --- | --- | --- | --- | --- |
| R9 | `colors/breadcrumb/label/default` | `text/placeholder` | `text/tertiary`(#596475, 5.89:1) — 현재 경로 `label/current`(text/secondary)보다 한 단계 연함 | breadcrumb · breadcrumb-item Link Default 라벨(27건) |
| R10 | `colors/file-uploader/helper/default` | `text/placeholder` | `text/tertiary` — 다른 컴포넌트 helper/default와 같음 | file-uploader 안내 문구 5개 상태, file-uploader-item 파일 정보 3개 상태(11건) |
| R11 | `colors/stepper/label/title/locked` | `text/placeholder` | `text/tertiary`(또는 `text/inactive` 유지 시 접근성 이슈로 수용) | stepper_indicator Locked 제목(5건) |

## 플레이스홀더 토큰 오용 — 바인딩 수정 요청 (2026-10-27, 변경하지 않음)

`text/placeholder`가 brand-gray/400(#a1a8b5)으로 바뀌면서(F98) 플레이스홀더가 아닌 글자에 이 토큰을 묶어 둔 곳이 대비 2.35:1로 내려갔습니다. 코드는 Figma 바인딩을 그대로 따르므로 Figma에서 바꾼 뒤 재동기화합니다.

| # | 변수 | 현재 | 제안 | 영향 |
| --- | --- | --- | --- | --- |
| R9 | `colors/breadcrumb/label/default` | `text/placeholder` | `text/tertiary`(#596475, 5.89:1) — 현재 경로 `label/current`(text/secondary)보다 한 단계 연함 | breadcrumb · breadcrumb-item Link Default 라벨(27건) |
| R10 | `colors/file-uploader/helper/default` | `text/placeholder` | `text/tertiary` — 다른 컴포넌트 helper/default와 같음 | file-uploader 안내 문구 5개 상태, file-uploader-item 파일 정보 3개 상태(11건) |
| R11 | `colors/stepper/label/title/locked` | `text/placeholder` | `text/tertiary`(또는 `text/inactive` 유지 시 접근성 이슈로 수용) | stepper_indicator Locked 제목(5건) |

## 승인이 필요한 값 · 정책 변경 (변경하지 않음)

| # | 내용 | 권장안 | 영향 범위 |
| --- | --- | --- | --- |
| A-1 | **대비 개선 — 텍스트** | **완료(2026-10-19)** — 상태 강조 색 6종 700, `text/tertiary` · `text/placeholder` gray/600, 비활성 라벨용 `text/inactive`(gray/400) 신설, EmptyState 위계 · Stepper 잠긴 설명 · MetricTrend Disabled 조정 | [accessibility.md](./accessibility.md) |
| A-2 | **대비 개선 — 비텍스트 · 상태** | **완료(2026-10-19)** — 입력 칸 · Checkbox · Radio 테두리 `border/gray`(hover `gray-dark`), Switch 꺼짐 트랙 500 · 600 · 700, Secondary · Solid Hover brand/800 · Pressed brand/900(7.27 · 10.14:1) | [accessibility.md](./accessibility.md) |
| A-3 | Table 안내 글자 전용 컴포넌트 토큰 | `colors/table/key-value/value/description` → `text/tertiary` 신설 | 표 편집 칸 안내 3노드 |
| ~~A-4~~ | `sm/leading-normal/underline` 줄 높이 140%(19.6px) — **완료(2026-10-19)** | 다른 sm 스타일처럼 `font/line-height/leading-5`(20px)로 | Link md 높이 0.4px |
| A-5 | placeholder `gray/400`(2.35:1) | **해결(A-1)** — 플레이스홀더 gray/600(5.89:1), 비활성 라벨은 `text/inactive`로 분리 | — |
| D3 · D4 | R7 다중 선택 목록 · 간단 스타일 차트 지난 기간 색(F65-b) | [final-report](./final-report.md) 결정 목록 | — |

이미 알려진 그 밖의 원본 이슈는 [figma-issue-triage.md](./figma-issue-triage.md)에 있습니다.
