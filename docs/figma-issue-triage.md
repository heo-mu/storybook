# Figma 이슈 분류 (2026-10-19)

> **정합성 개선 작업 반영(2026-10-19 저녁, Figma 수정 허용)** — 해결: F78(Chart Component 토큰) · F79(hover 24변형 · Hover 결함) · F80(Accordion 토큰) ·
> F81(토큰 이름 규칙) · A-1 · A-2(색 대비 — E12 · F12 · F23 · A-5) · F64(원본 점 위치) · F65-b(간단 막대 색 통일) · F66(툴팁 원격 변수) · F68(Dash Line 색) ·
> F73(배지 흰 채움) · B10(code syntax 11) · F13 · F28 · F32 · F52(원격 변수 사본) · progress 별칭. F77은 지시로 수정 제외(회귀 확인만).
> 상세: [analysis/consistency-pass-2026-10-19.md](./analysis/consistency-pass-2026-10-19.md).

> **Figma 수정 작업 반영(2026-10-19 오후)**: R1 · R2(A6) · R3(F65-a) · R4(F69) · R6(F75 일부) · R8(F57) · C3 바인딩을 Figma에서 직접 고쳤습니다.
> R5(F74)는 Accordion이 원본에서 삭제되어 미확인. 새 항목 F77 – F83과 대비 개선안(A-1 · A-2)은 [figma-fix-requests.md](./figma-fix-requests.md) 참고.

> **최종 배포 준비 갱신(2026-10-19)**: F31 동기화 · F65 코드 통일 · F69 토큰 · F50 해소(원본 변경)를 반영했고, 원본 갱신에서 새로 찾은 F74 – F76을 추가했습니다.
> Figma 원본에서 고칠 항목은 노드 · 변수 ID와 함께 [figma-fix-requests.md](./figma-fix-requests.md)에 있습니다.

[figma-issues.md](./figma-issues.md)의 남은 항목 전부(A · B · C · E · F 섹션)를 세 가지로 분류했습니다.

| 분류 | 뜻 | 이슈 ID 수 |
| --- | --- | --- |
| **디자인 결정 필요** | Figma에 정책이 없거나 서로 맞지 않아, 디자인이 정해야 코드가 확정됨. 지금은 코드 정책(임시)으로 동작 | 37 (A4 · F50 해소, F75 · F76 추가) |
| **개발 개선 필요** | 코드 쪽에서 할 일이 있음(일부는 위 결정이 나야 진행) | 9 (완료 8, F57은 코드 변경 없이 Figma 재바인딩 요청) |
| **허용 가능한 차이** | 화면 · 동작에 문제가 없거나, 렌더링 엔진 · 샘플 데이터 차이로 코드가 처리함. "Figma 정리 권장"은 원본 바인딩 · 이름 정리만 하면 되는 항목 | 76 (F57 · F74 추가) |

전체 116개 ID를 모두 분류했습니다(2026-10-16의 113개 + F74 · F75 · F76). F31 · F63 · F65 · F69는 결정(1절)과 코드 작업(2절)에,
F6은 결정(1절)과 렌더링 차이(3절)에, F57은 코드 작업(2절)과 Figma 정리(3절)에 함께 나옵니다.

코드는 Figma에 명시된 값만 쓰며, 아래 결정이 나기 전에 원본을 고치거나 새 디자인 정책을 확정하지 않습니다.

## 1. 디자인 결정 필요

| # | 내용 | 현재 코드(임시 정책) | 우선 |
| --- | --- | --- | --- |
| F31 (D1) | Button Primary · Outline 테두리 변수 — Figma에서 변수가 삭제되어 색만 남음([R1](./figma-fix-requests.md#r1-button-primary--outline-테두리--완료)). 동기화 자체는 2026-10-19 완료 | 원본에 남은 #004a38 | 높음 |
| C1 | tracking 변수가 px로 적용(3xl 굵기별 자간 3배 차이) | Figma 적용값 그대로 | 높음 |
| ~~E12 · F12 · F23~~ | 대비 부족 — **해결(2026-10-19, A-1 · A-2)**: Figma · 코드 함께 수정, axe 색 대비 0([accessibility.md](./accessibility.md)) | — | — |
| A11 · F1 · F22 | Focus 상태 없음(Button, 선택 컨트롤, Chip, Segmented, Slider) | 브라우저 기본 포커스 링 | 높음 |
| F65-a | 가로 막대 기본 Group=yes 비교 막대 `simple/history` ↔ 범례 · 툴팁 `series/compare` — **Figma 수정 요청**([R3](./figma-fix-requests.md#r3-차트-가로-막대--기본--groupyes-비교-막대--완료-지정-5노드)) | **코드는 `series/compare`로 통일(2026-10-19)** | 중간 |
| ~~F65-b~~ | 간단 스타일 Group=no 지난 기간 색 — **해결(2026-10-19, F78)**: 세로 · 가로 같은 `colors/chart/bar/history`(Figma · 코드) | — | — |
| F69 | 대시보드 카드 모서리 12px — Figma에 로컬 변수 등록 · 재바인딩([R4](./figma-fix-requests.md#r4-12px-모서리-변수--완료)) 완료. 남은 것: data-state · 예시 프레임의 원격 흰 배경 `color/background/white`(#ffffff, 로컬은 #fdfdfd) | 토큰 `--border-radius-rounded-12px`(F81 이름) | 낮음 |
| F60 | Card 그림자(원격 shadow-sm 10%) | elevation-1(12%) | 중간 |
| F61 | Card 프레임 숨김 — 사용 여부 | 레이어 값으로 구현, 위치 · 크기만 검증 | 중간 |
| F33 | Breadcrumb 펼친 상태(Role=Open, 메뉴 위치) | … 버튼 아래 메뉴, 현재 항목은 Current | 중간 |
| F44 | Toast 위치 · 간격 · 표시 시간 | 화면 아래 가운데, m-2, 5초 | 중간 |
| F48 | Tooltip 거리 · 지연 | 화살표 8px, react-aria 기본 지연 | 중간 |
| F76 (D3) | Table 편집 칸 Filter · Editing의 다중 선택 목록 — 컴포넌트 없음([R7](./figma-fix-requests.md#r7-table-편집-칸-filter--editing의-다중-선택-목록--결정-대기-d3)) | 목록 그리지 않음 | 중간 |
| F75 | Table 편집 칸 Filter 칩 상태(Editing이 Unselected, Hover 칩 상태 불일치 — [R6](./figma-fix-requests.md#r6-table-편집-칸-filter-칩-상태--6937165-완료-6937167-오류-아님)) | Figma 그대로 | 낮음 |
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
| F31 · A4 | 토큰 재생성, `Button.css` 토큰 참조 수정, Secondary · Solid 추가(A4 해소), 기준 재캡처(352) | **완료(2026-10-19)** — 352/352 · 3 엔진. Primary · Outline 테두리 변수만 D1 대기 |
| F53 · F50 · Accordion | 원본 변경 반영: `border/hover`, Disabled 배경 · 제목, 모든 Hover 배경, 펼친 항목 구분선 | **완료(2026-10-19)** — 3 엔진 통과 |
| F57 | `table/key-value/value/label/hover` — 확인 결과 **삭제된 변수**(로컬 컬렉션에 없음) | 코드 변경 없음(같은 값 `text/tertiary`). Figma 재바인딩 요청 [R8](./figma-fix-requests.md#r8-table-편집-칸-안내-글자--완료) |
| F65-a | `Chart.tsx` `markColor`의 가로 막대 예외 삭제 | **완료(2026-10-19)** — Figma가 고쳐지면 기준 이미지만 재캡처 |
| F69 | 토큰 `rounded-[12px]` 추가, MetricCard · DashboardFilterBar 적용 | **완료(2026-10-19)** — Figma 등록 후 `figma-pending/`에서 삭제 |
| F71 · F31 | DashboardFilterBar 예시의 초기화 버튼을 Secondary · Solid로 | **완료(2026-10-19)** — 픽셀 비교 제외 영역 제거 |
| Table Filter 칸 | 원본 갱신(칩 1개 구성) 반영 | **완료(2026-10-19)** — 쇼케이스 · 기준 갱신 |

## 3. 허용 가능한 차이

### 렌더링 · 엔진 차이 (코드 처리 완료, 자동 검증에 허용치와 이유 기록)

F6(밑줄 위치), F9(listbox 스크롤 표시), F16(Slider 핸들 위치), F30(점선 간격), F37 · F56(반 픽셀 선 · 글자), A9(반 픽셀 배치), F47(Tooltip 화살표 그림자),
Badge Outline 모서리 안티에일리어싱, 한글 글자 농도 차이 · calc-size 미지원 엔진의 1px 미만 너비([browser-support.md](./browser-support.md)).

### 샘플 · 예시 데이터 차이 (코드는 실제 데이터로 동작)

E5(카운터 예시 값), F14 · F15(Slider 상자 너비), F58 · F59(Table 관리 모드 예시), F62 · F67(Chart 예시 — F64 점 위치는 원본에서 해결, F68 색은 F78로 해결), F73(DataState 예시 수치), F55(빈 헤더 너비).

### Figma 정리 권장 (화면 영향 없음 — 원본 바인딩 · 이름만 정리)

| 묶음 | 항목 |
| --- | --- |
| 다른 변수 · 상위 레이어 직접 참조 | A5(2026-10-19 원본에서 해결 · 코드 반영), A6([R2](./figma-fix-requests.md#r2-button-secondary--outline-테두리--완료)), B7, E1 · E2 · E3 · E4, E10, F5, F7, F24, F27, F29, F34, F54 |
| 원격 라이브러리 변수 | **2026-10-19 정리** — 컴포넌트 안 원격 사본 92곳을 같은 이름 · 값의 로컬로(F13 · F28 · F32 · F52 · F66). 남은 것: Slider 손잡이 그림자(로컬 없음), data-state 흰 배경 `color/background/white` #ffffff(로컬 #fdfdfd — F69와 같은 결정), 문서 · legacy 프레임 |
| 쓰이지 않거나 어긋난 변수 · 속성 | A7, A8, B1, ~~B10~~(2026-10-19 해결), F19, F26, F49, F72 |
| 이름 · 오타 · 정렬 | A1 · A2 · A3(A1은 2026-10-19 동기화로 색 분리 반영), B2 · B3 · B4, B9, C4, F38 · F45(이름 수정 시 토큰 CSS 변수 이름도 바뀜), F70, F74(Accordion 변형 위치 — [R5](./figma-fix-requests.md#r5-accordion-md--hover--expanded-위치--미확인-수정-불가)) |
| 값 지정 방식 | C2 · C3(삭제된 변수 바인딩 — 코드는 적용값 사용), F57(삭제된 변수 — [R8](./figma-fix-requests.md#r8-table-편집-칸-안내-글자--완료)), C6, F17 · F18(효과 · 원 변수 미연결), F42 · F43(배지 채움 · 크기), F46(Toast 높이 · padding) |
| 값 · 의도 확인(현재 일관됨) | A10(IconButton 숨김 라벨 → 필수 `aria-label`), B5(white #fdfdfd · black #222222), B6(danger · error 같은 값), F4(Radio 점 9px), F25(요일 영어 표기 — 코드는 로캘), F39(connector padding), E9 · E11 |
