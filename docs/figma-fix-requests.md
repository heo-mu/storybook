# Figma 원본 수정 요청 (2026-10-19)

디자인 시스템 Figma 파일(`Ry3WecA6sP6lKPop1vXrTp`, 페이지 🔵 Ver 0.4)에서 **원본을 고쳐야 하는 항목**을 노드 · 변수 단위로 모았습니다.
모두 읽기 전용으로 조회했고 원본은 수정하지 않았습니다. 코드가 지금 어떻게 처리하는지도 함께 적었습니다.

| # | 항목 | 성격 | 코드 현재 처리 |
| --- | --- | --- | --- |
| R1 | Button Primary · Outline 테두리가 삭제된 변수를 가리킴 | **결정 + 수정** (D1) | Figma에 남은 색 #004a38을 그대로 사용 |
| R2 | Button Secondary · Outline 테두리 바인딩이 Shape마다 다름 | 수정 | `secondary/outline/border/default` 하나 |
| R3 | 차트 가로 막대 비교 막대 바인딩 오류 (F65) | 수정 | `chart/series/compare`로 통일 |
| R4 | 12px 모서리 로컬 변수 등록 (F69) | 등록 + 재바인딩 | 등록 대기 토큰 `rounded-[12px]` |
| R5 | Accordion md · Hover · Expanded 변형 위치 | 정리 | 영향 없음(위치만) |
| R6 | Table 편집 칸 Filter 변형의 칩 상태 | 확인 + 수정 | Figma 그대로 |
| R7 | Table 편집 칸 Filter · Editing의 다중 선택 목록 | **결정** (D3) | 목록은 그리지 않음 |
| R8 | Table 편집 칸 안내 글자가 삭제된 변수에 바인딩 (F57) | 수정 | 같은 값 `colors/text/tertiary` |

결정이 필요한 항목(D1 · D3 등)은 [final-report.md](./final-report.md)의 결정 목록과 같은 번호입니다.

---

## R1. Button Primary · Outline 테두리 — 삭제된 변수

- 대상: `button_basic`(54:2904)의 Primary · Outline Default · Hover · Pressed **24개**, `button_icon`(67:2368)의 같은 **18개** — 변형 루트의 stroke.
- 현재: stroke가 `VariableID:59:2221`(`colors/button/primary/outline/border/default`)을 가리키지만 이 변수는 **Component 컬렉션에서 삭제됨**
  (컬렉션 `variableIds`에 없음). 마지막 값은 `colors/fill/primary/strong/default`(`VariableID:28:6598`, #004a38)의 별칭이고, 화면에는 색 #004a38만 남아 있습니다.
  같은 때 `primary/outline/border/disabled`, `primary/solid/border/default` · `/disabled`도 삭제되었습니다.
- 요청: 바인딩할 변수를 정해 42개 노드를 다시 연결해 주세요. 후보:

| 안 | 변수 | 비고 |
| --- | --- | --- |
| a | `colors/button/primary/outline/border/default` 다시 만들기 → `colors/fill/primary/strong/default` | Secondary · Tertiary처럼 컴포넌트 전용 테두리 변수를 둠(구조 일관) |
| b | `colors/fill/primary/strong/default` (`VariableID:28:6598`) 직접 | 변수 추가 없음 |
| c | `colors/button/primary/outline/label/default` (`VariableID:59:2217`) | 글자색과 같은 변수 — 의미상 어색 |

- 노드 ID
  - button_basic: 67:1938 67:1944 67:1950 67:2038 67:2044 67:2050 · 59:1949 59:1955 59:1961 59:2095 59:2101 59:2107 ·
    59:1919 59:1925 59:1931 59:2065 59:2071 59:2077 · 59:1943 59:1973 59:1979 59:2089 59:2119 59:2125 (xs · sm · md · lg, Square 3 · Rounded 3)
  - button_icon: 67:2485 67:2489 67:2493 67:2518 67:2522 67:2526 · 67:2386 67:2390 67:2394 67:2452 67:2456 67:2460 ·
    67:2551 67:2555 67:2559 67:2584 67:2588 67:2592 (xs · sm · md)
- 결정 후 코드: `Button.css`의 `--ds-button-stroke-color: #004a38`을 해당 토큰으로 바꾸고 스냅샷 재추출 → `npm run tokens` → `npm run verify:button`.

## R2. Button Secondary · Outline 테두리 — Shape마다 다른 변수

- 대상: `button_basic`의 Secondary · Outline **Square Hover · Pressed 8개** — 67:1994 67:2000 59:2028 59:2034 59:1998 59:2004 59:2046 59:2052.
- 현재: `colors/button/secondary/solid/border/default`(`VariableID:54:2047`). 나머지 Secondary · Outline(Rounded 전부, Square Default,
  `button_icon` 전부)은 `colors/button/secondary/outline/border/default`(`VariableID:59:2228`). 두 변수 값은 같습니다(#007c56).
- 요청: 8개를 `colors/button/secondary/outline/border/default`로 다시 바인딩.

## R3. 차트 가로 막대 · 기본 · Group=yes 비교 막대 (F65)

- 대상 변형 733:4930 `Type=Bar Horizontal, Style=Default, Group=yes`(세트 `chart` 698:4399)의 비교 막대 5개:
  733:4967 · 742:31980 · 742:31986 · 742:31992 · 742:31998.
- 현재: 그라디언트 정지점 0이 `colors/chart/simple/history`(`VariableID:762:5825`, #e2e5e9), 정지점 1은 바인딩 없는 #e2e5e9 · 40%.
  같은 차트의 범례(746:33346) · 툴팁(`I742:31704;693:9774`)과 세로 막대 비교 막대는 `colors/chart/series/compare`(`VariableID:697:4134`, #d6dae0).
- 요청: 정지점 0 → `colors/chart/series/compare`, 정지점 1 → #d6dae0 · 40%. 자세한 근거: [F65 분석](./analysis/F65-chart-compare-color.md).
- 별도 결정(F65-b): 간단 스타일 Group=no의 지난 기간 막대가 세로 `series/compare` · 가로 `simple/history`로 다름 — 하나로 통일할지.

## R4. 12px 모서리 변수 등록 (F69)

- 요청: Primitive에 `border-radius/rounded-[12px]` = 12(`CORNER_RADIUS`) 추가, 원격 `radius/xlarge1`
  (`VariableID:51661197e51223702f7df7f651a203c9ea6ec323/138:631`)을 쓰는 노드를 새 변수로 재바인딩.
- Ver 0.4: 697:4487 `metric-card` · 698:4163 `dashboard-filter-bar` · 773:6944 · 773:7038 `chart-panel`, 바인딩 없는 773:9908 `chart-panel`.
- legacy 페이지 29개: [F69 분석](./analysis/F69-radius-12.md#figma-등록-요청-원본은-수정하지-않음)에 노드 ID 전체.
- 등록 후 코드: 스냅샷 재추출 → `npm run tokens`가 이름 중복으로 실패 → `figma-pending/primitive.txt`의 해당 줄 삭제(이름이 같아 코드 수정 없음).

## R5. Accordion md · Hover · Expanded 위치

- 대상: `accordion-item`(796:6071)의 796:5903 `Size=md, State=Hover, Expanded=True` — y 40. 같은 줄의 다른 변형은 y 20.
- 요청: y 20으로 정렬(화면 표현과 무관한 세트 배치 문제). 코드 검증 기준은 실제 위치를 따릅니다.

## R6. Table 편집 칸 Filter 변형의 칩 상태

세트 `table_value_editable`(503:23264), 2026-10-19 원본 갱신분.

| 노드 | 변형 | 현재 | 확인 · 요청 |
| --- | --- | --- | --- |
| 693:7165 | Type=Filter, State=Editing, Content=Filled | 칩이 `Variant=Unselected, Expanded=True`(558:25884)인데 라벨은 선택 요약("선택유형: 옵션명, 옵션명") | 값이 있으므로 `Variant=Selected, Size=md, State=Default, Expanded=True`(570:26566)가 맞는지 확인 |
| 693:7167 | Type=Filter, State=Hover, Content=Filled | 칩 State=Default | Hover · Empty(693:7163)는 칩 State=Hover — 둘 중 하나로 통일할지 확인 |
| 693:7165 | (위치) | y 894, 같은 줄 다른 변형 y 895 | 1px 정렬 |

코드(쇼케이스 스토리)는 지금 Figma 그대로(Editing은 Unselected · Expanded) 그립니다.

## R7. Table 편집 칸 Filter · Editing의 다중 선택 목록 (결정 D3)

- 693:7165 아래에 `listbox / Size=sm`(97:2664)과 `option`(Selected 2개, Check 아이콘)이 열려 있습니다 — **칩을 눌러 여러 값을 고르는 목록**입니다.
- 라이브러리에는 칩 트리거 + 다중 선택 목록 컴포넌트가 없습니다(`Select`는 단일 선택, `DropdownMenu`는 `dropdownmenu_item` 모양).
- 결정 필요: ① 새 컴포넌트(예: 다중 선택 필터 메뉴)로 만들지 ② `DropdownMenu`(선택 모드)로 대신할지 ③ 표 편집 칸에서는 다른 패턴을 쓸지.
  결정 전에는 쇼케이스에서 목록을 그리지 않고, 정합성 검증에서 목록 영역(위 4.5px)만 제외했습니다.

## R8. Table 편집 칸 안내 글자 — 삭제된 변수 (F57)

- 대상: `table_value_editable`(503:23264)의 텍스트 3개 — 355:4281(Type=Switch, State=Default 「설명」) · 540:24708(Type=Switch, State=Disabled 「설명」) ·
  355:4223(File Upload 안내 「권장 비율 1:1, JPG/PNG, …」).
- 현재: `VariableID:355:4282` `colors/table/key-value/value/label/hover`에 바인딩 — 이 변수는 Component 컬렉션에 없습니다(삭제). 남은 색은 #778191.
- 요청: 같은 값의 현재 변수(예: `colors/text/tertiary`, 또는 `colors/table/key-value/value/label/*`에 안내용 변수 추가)로 다시 바인딩.

---

이미 알려진 그 밖의 원본 이슈(변수 이름 · 미사용 변수 · 예시 데이터 등)는 [figma-issue-triage.md](./figma-issue-triage.md)의 "디자인 결정 필요"에 있습니다.
