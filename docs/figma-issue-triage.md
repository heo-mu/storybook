# Figma 이슈 분류 (2026-10-19)

[figma-issues.md](./figma-issues.md)의 남은 항목 전부(A · B · C · E · F 섹션)를 세 가지로 분류했습니다.

| 분류 | 뜻 | 이슈 ID 수 |
| --- | --- | --- |
| **디자인 결정 필요** | Figma에 정책이 없거나 서로 맞지 않아, 디자인이 정해야 코드가 확정됨. 지금은 코드 정책(임시)으로 동작 | 37 |
| **개발 개선 필요** | 코드 쪽에서 할 일이 있음(일부는 위 결정이 나야 진행) | 7 (이번에 완료 2) |
| **허용 가능한 차이** | 화면 · 동작에 문제가 없거나, 렌더링 엔진 · 샘플 데이터 차이로 코드가 처리함. "Figma 정리 권장"은 원본 바인딩 · 이름 정리만 하면 되는 항목 | 74 |

전체 113개 ID를 모두 분류했습니다. F31 · F63 · F65 · F69는 결정(1절)과 그 뒤의 코드 작업(2절)에, F6은 결정(1절)과 렌더링 차이(3절)에 함께 나옵니다.

코드는 Figma에 명시된 값만 쓰며, 아래 결정이 나기 전에 원본을 고치거나 새 디자인 정책을 확정하지 않습니다.

## 1. 디자인 결정 필요

| # | 내용 | 현재 코드(임시 정책) | 우선 |
| --- | --- | --- | --- |
| F31 · A4 | 최신 Figma Button 변경 동기화(Secondary · Solid 56개, 색 36개, 토큰 이름 변경) — [분석](./analysis/F31-button-sync.md) | 동결 스냅샷 | 높음 |
| C1 | tracking 변수가 px로 적용(3xl 굵기별 자간 3배 차이) | Figma 적용값 그대로 | 높음 |
| E12 · F12 · F23 | 대비 부족: info(#0086d3) · tertiary 글자, Checkbox · Radio · Switch 테두리(2.35:1), success(#00a63e) | Figma 값 그대로, [accessibility.md](./accessibility.md)에 기록 | 높음 |
| A11 · F1 · F22 | Focus 상태 없음(Button, 선택 컨트롤, Chip, Segmented, Slider) | 브라우저 기본 포커스 링 | 높음 |
| F65-a | 가로 막대 기본 Group=yes 비교 막대 `simple/history` ↔ 범례 · 툴팁 `series/compare` — **Figma 수정 필요로 판단** — [분석](./analysis/F65-chart-compare-color.md) | Figma 변형 그대로 | 중간 |
| F65-b | 간단 스타일 Group=no 지난 기간 색이 세로 · 가로에서 다름 | Figma 변형 그대로 | 중간 |
| F69 | 대시보드 카드 모서리 12px(원격 변수, 로컬 토큰 없음) — [분석 · 제안](./analysis/F69-radius-12.md) | 12px 값 | 중간 |
| F60 | Card 그림자(원격 shadow-sm 10%) | elevation-1(12%) | 중간 |
| F61 | Card 프레임 숨김 — 사용 여부 | 레이어 값으로 구현, 위치 · 크기만 검증 | 중간 |
| F33 | Breadcrumb 펼친 상태(Role=Open, 메뉴 위치) | … 버튼 아래 메뉴, 현재 항목은 Current | 중간 |
| F44 | Toast 위치 · 간격 · 표시 시간 | 화면 아래 가운데, m-2, 5초 | 중간 |
| F48 | Tooltip 거리 · 지연 | 화살표 8px, react-aria 기본 지연 | 중간 |
| F50 | Accordion Hover 표현이 변형마다 다름 | Figma 그대로 | 중간 |
| F51 | Dialog 뒤 덮개(scrim) | 투명 | 중간 |
| F63 | Chart 툴팁 위치 규칙(코드 쪽 자동 조정은 이번에 구현 — 아래 2절) | 기준점 옆 p-3, 보이는 그림 영역 · 화면 안 | 낮음 |
| E6 | Input 눈 아이콘의 용도 · 숨김 상태 아이콘 | 비밀번호 표시 토글(`aria-pressed`) | 중간 |
| E7 | 지우기(X) 표시 규칙이 Input · Search Field마다 다름 | 각 Figma 규칙 | 중간 |
| E8 | Search Field Solid Error에 오류 표현 없음 | Figma 그대로 | 중간 |
| F2 | 비활성 라벨 색(Switch tertiary · Checkbox/Radio disabled) | 각 바인딩 | 중간 |
| F10 | listbox 최대 높이 · 위로 열기 | react-aria 기본(화면 공간에 맞춤) | 중간 |
| F11 | 옵션 Hover + Selected · 키보드 이동 표현 | 키보드 = Hover 모양 | 중간 |
| F20 | Chip 아이콘 크기(16 · 12px) 통일 | 세트별 그대로 | 중간 |
| C5 | File Uploader 라벨 · 안내 글꼴 Noto Sans KR | 생성값 그대로 | 중간 |
| F3 | Checkbox · Radio 그룹 간격 · 방향 | 간격 없는 래퍼 | 낮음 |
| A12 | 비활성 라벨에 `text/placeholder`(`text/disabled` 아님) | Figma 그대로 | 낮음 |
| F6 | option md Disabled만 밑줄 · Medium | Figma 그대로 | 낮음 |
| F8 | option Selected 배경 없음 | 투명 | 낮음 |
| F21 | chip-filter Selected · Disabled 배경 투명 | 세트 그대로 | 낮음 |
| F35 | Breadcrumb Show Parent가 Full에서도 상위 숨김 | Collapsed에만 적용 | 낮음 |
| F36 | item_link Hover 아이콘 바인딩 | Figma 그대로 | 낮음 |
| F40 | Stepper Current가 Completed보다 밝음 | Figma 그대로 | 낮음 |
| F41 | Stepper 애니메이션 값 | 미구현 | 낮음 |
| B8 | 모드 1개(다크 모드 등 계획 시) | 단일 테마 | 낮음 |

## 2. 개발 개선 필요

| # | 내용 | 상태 |
| --- | --- | --- |
| F63 | 차트 툴팁이 그래프 영역 · 화면 경계를 넘지 않도록 자동 조정, 잘림 방지(포털) | **완료(2026-10-19)** — `placeTooltip`, 스토리 테스트 3개 |
| F71 | DashboardFilterBar "최근 30일" 말줄임 | **완료(2026-10-19)** — SegmentedControl 라벨이 Figma처럼 항목 padding까지 사용, 항목 전체보다 길 때만 말줄임. 검증에서 해당 라벨 비교 재개 |
| F31 | 동기화 결정 후: 토큰 재생성, `Button.css` 토큰 참조 수정, Secondary · Solid 추가, 기준 재캡처(352) | 결정 대기 |
| F53 · Accordion | 원본 변경 반영: `border/focus` → `border/hover`, Disabled 배경 `fill/disabled`, 제목 `text/placeholder`(2026-10-19 확인) | F31 동기화와 함께 |
| F57 | `table/key-value/value/label/hover` 변수(스냅샷 이후 추가) 반영 | F31 동기화와 함께 |
| F65-a | Figma 수정 후 `Chart.tsx` `markColor`의 가로 막대 예외 삭제 · 기준 재캡처 | Figma 수정 대기 |
| F69 | 토큰 추가(A안) 후 MetricCard · DashboardFilterBar의 `12px`를 토큰으로 | 결정 대기 |
| F71 · F31 | DashboardFilterBar 예시의 초기화 버튼을 Secondary · Solid로(현재 Outline 대체, 검증에서 그 영역 제외) | F31 동기화 후 |

## 3. 허용 가능한 차이

### 렌더링 · 엔진 차이 (코드 처리 완료, 자동 검증에 허용치와 이유 기록)

F6(밑줄 위치), F9(listbox 스크롤 표시), F16(Slider 핸들 위치), F30(점선 간격), F37 · F56(반 픽셀 선 · 글자), A9(반 픽셀 배치), F47(Tooltip 화살표 그림자),
Badge Outline 모서리 안티에일리어싱, 한글 글자 농도 차이 · calc-size 미지원 엔진의 1px 미만 너비([browser-support.md](./browser-support.md)).

### 샘플 · 예시 데이터 차이 (코드는 실제 데이터로 동작)

E5(카운터 예시 값), F14 · F15(Slider 상자 너비), F58 · F59(Table 관리 모드 예시), F62 · F64 · F67 · F68(Chart 예시), F73(DataState 예시 수치), F55(빈 헤더 너비).

### Figma 정리 권장 (화면 영향 없음 — 원본 바인딩 · 이름만 정리)

| 묶음 | 항목 |
| --- | --- |
| 다른 변수 · 상위 레이어 직접 참조 | A5(최신 원본에서 해결됨), A6, B7, E1 · E2 · E3 · E4, E10, F5, F7, F24, F27, F29, F34, F54 |
| 원격 라이브러리 변수 | F13(Slider), F28(Loading), F32(Dropdown), F52(Accordion), F66(Chart tooltip) — 같은 값의 로컬 토큰 사용 중 |
| 쓰이지 않거나 어긋난 변수 · 속성 | A7, A8, B1, B10, F19, F26, F49, F72 |
| 이름 · 오타 · 정렬 | A1 · A2 · A3(최신 원본에서 A1 색 분리됨), B2 · B3 · B4, B9, C4, F38 · F45(이름 수정 시 토큰 CSS 변수 이름도 바뀜), F70 |
| 값 지정 방식 | C2 · C3(삭제된 변수 바인딩 — 코드는 적용값 사용), C6, F17 · F18(효과 · 원 변수 미연결), F42 · F43(배지 채움 · 크기), F46(Toast 높이 · padding) |
| 값 · 의도 확인(현재 일관됨) | A10(IconButton 숨김 라벨 → 필수 `aria-label`), B5(white #fdfdfd · black #222222), B6(danger · error 같은 값), F4(Radio 점 9px), F25(요일 영어 표기 — 코드는 로캘), F39(connector padding), E9 · E11 |
