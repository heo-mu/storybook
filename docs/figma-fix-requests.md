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
