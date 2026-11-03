# 코드 정책 감사 — Figma 공식 정책화 (2026-10-19)

Storybook · 문서 · 코드에 "코드 정책(Figma에 정의되지 않은 부분)"으로 남아 있던 항목을 모두 모아, 항목마다 UX/UI 정책을 정하고 Figma에 반영한 기록입니다.
각 항목의 출처(컴포넌트 · Storybook 문서 ID), 이전 코드 정책, Figma에 없던 것, 결정한 정책, Figma 반영 방법 · 노드 · 변수 ID, 처리 상태를 적었습니다.
Storybook 각 Usage 문서의 **정책** 절은 이 표의 ID를 그대로 씁니다.


> **2026-10-20**: Figma Rules 표는 짧은 사용 규칙만 남기고(10장 삭제), Dev Mode 주석은 모두 지웠습니다. 아래 "Figma 위치" 열의 주석 · 10장 ID는 그 이전 버전의 기록이며, 세부 기준은 [policy-details.md](./policy-details.md)에 있습니다. Storybook 사용 방법 문서의 "정책" 절(항목 ID 포함)은 컴포넌트별 개발 노트 [components/](./components/)로 옮겼고, Storybook에는 쉬운 설명만 남겼습니다. 아래 `문서:` 줄의 ID는 그대로 유효합니다.

## 조사 범위

- 문서: 모든 Usage MDX(37개)와 `docs/*.md`에서 "코드 정책", "Figma에 정의되지 않은 부분", "Figma 미정의", "개발 정책", "구현 정책", "Figma 미반영", "임의 정의", "Fallback", "미지원 상태", "브라우저 기본 포커스"를 검색.
- 코드: 컴포넌트 CSS · TSX 주석("code policy", "not defined in Figma"), Props 기본값(지연 · 개수 · 시간 · 간격), 상태 · 상호작용(`:focus-visible` · `data-focus-visible` · 키보드 처리 · 오버레이 배치).
- Figma: Component 섹션(58:5174)의 세트 · 변수 · 스타일 · 기존 문서 프레임("Design System Rules" 227:3774, "Variables · 사용 가이드" 227:3834 · "구조 한눈에 보기" 148:2714)을 다시 읽어 확인.

## 요약

전체 **228개** — 분류 A 100 · B 109 · C 19.

| 처리 상태 | 뜻 | 개수 |
| --- | --- | --- |
| **Figma 정의 정책** | Figma 변형 · 컴포넌트 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씀(Figma 재조회로 확인) | 89 |
| **Figma 문서화 정책** | 변형으로 그리지 않는 동작 · 규칙 — Figma "Design System Rules" 02–09장 표와 컴포넌트 Dev Mode 주석에 기록(Figma 재조회로 확인) | 119 |
| **개발 구현 세부 사항** | 디자인 컴포넌트에 넣지 않는 기술 구현 — 코드 문서(docs/components · Storybook "개발 구현 세부 사항")에만 둠. Figma Rules 10장은 2026-10-28 디자이너 개정으로 없어졌고 되살리지 않음 | 19 |
| **Figma 반영 대기** | Figma 정리가 필요하지만 아직 반영하지 않은 항목 — 반영 완료로 표시하지 않음 | 1 |

| 분류 \ 상태 | Figma 정의 | Figma 문서화 | 개발 구현 | 반영 대기 |
| --- | --- | --- | --- | --- |
| A 시각 상태 | 89 | 10 | 0 | 1 |
| B 동작 · 상호작용 | 0 | 109 | 0 | 0 |
| C 기술 구현 | 0 | 0 | 19 | 0 |

분류 원칙: **A** 시각 상태는 가능한 한 Figma 변형 · 속성(기존 토큰 사용), **B** 동작은 불필요한 변형 대신 규칙 문서 · 주석, **C** 기술 구현은 개발 문서에만.

## Figma 위치

규칙 문서는 기존 "Design System Rules" 프레임(01장 "디자인 시스템의 목적" 다음)에 같은 표 스타일로 이어 붙였고, 섹션 높이 안에 들어가지 않는 07–10장은
같은 스타일의 "Design System Rules (계속)" 프레임(1100:5082, Variables 사용 가이드 아래)에 두었습니다. 각 행: 정책 · 적용 컴포넌트 / 적용 조건 · 규칙 · 예외 / 토큰 · 접근성 · Storybook.

| 장 | 내용 | 노드 |
| --- | --- | --- |
| 02 | 상태 표현 — Hover · Pressed · Focus · Disabled · Selected · Error | 1097:5009 |
| 03 | 접근성 — WCAG 2.2 AA | 1097:5110 |
| 04 | 키보드 · 입력 | 1097:5204 |
| 05 | 오버레이 — 위치 · 열기 · 닫기 · 포커스 | 1097:5312 |
| 06 | 피드백 — 알림 · 진행 | 1100:5009 |
| 07 | 데이터 표시 — 차트 · 표 · 페이지 · 빈 상태 · 파일 · 펼침 | 1280:8082 |
| 08 | 레이아웃 · 콘텐츠 | 1280:8135 |
| 09 | 움직임 | 1674:8110(프레임 이름 "Chapter 09" — 2026-11-03까지 "Chapter 10") |

2026-11-03 재조회: 02–09장 모두 Rules 프레임 227:3774 안(02 1097:5009 · 03 1097:5110 · 04 1097:5204 · 05 1097:5312 · 06 1100:5009). 10장(개발 구현 세부)은 없음 — 아래 표의 "Rules 10"은 코드 문서에만 있는 항목이라는 뜻입니다.

> **2026-10-28 재조회**: 07–09장은 Rules 프레임(227:3774) 안의 1280:8082 · 1280:8135 · 1280:8181(09장은 이후 1674:8110)로 옮겨졌고, "(계속)" 프레임 1100:5082와 10장은 없어졌습니다(위 노드는 2026-10-19 기록). 바뀐 행과 구현 상태는 [policy-details.md](./policy-details.md)(04 · 06 · 09장), 충돌은 [figma-issues.md F103](./figma-issues.md).

컴포넌트 고유 규칙은 Dev Mode 주석(Interaction · Accessibility · Development · Content)으로 세트에 붙였습니다 — 13개 세트, 주석 17개:

Accordion `accordion-item 1035:15648` · Alert `alert 179:6087` · Breadcrumb `breadcrumb 712:5106` · Chart `chart 698:4399 · chart-tooltip 693:9776` · Chip `chip-input 558:26017` · DatePicker `date-picker_trigger 144:723` · Toast `toast 91:5927` · Tooltip `tooltip 149:1111` · Dialog `dialog 149:2838` · Select `select 95:4740` · Slider `slider 391:1988` · Table `table_value_editable 503:23264`.

포커스: Semantic `colors/border/focus`(VariableID:1080:6697 → brand/700) · 24개 세트의 Boolean 속성 `Focus`(766개 변형) · Select State=Focus(1081:7873 · 1081:7878 · 1081:7883).
나머지 Figma 변경과 ID는 [figma-fix-requests.md P절](./figma-fix-requests.md#p-코드-정책--figma-공식-정책-2026-10-19-밤-사용자-승인-작업).

## 코드 동작 변경 (이번 작업)

- 포커스: 브라우저 기본 표시 → 2px `colors/border/focus` 링(바깥 · 안쪽형), Select 닫힌 상태는 Focus 테두리.
- Dialog: 투명 → 모달 덮개 `colors/dialog/scrim/default`(검정 50%).
- Toast: 최대 5개 → 3개, 오류는 기본으로 닫을 때까지 유지, 같은 문구 · 상태는 겹치지 않음.
- Tooltip: 마우스 지연 1.5초(react-aria 기본) → 0.5초.
- CheckboxGroup · RadioGroup: 간격 없음 → 세로 8px · 가로 16px.
- Link md: 줄 높이 19.6px → 20px(Figma 텍스트 스타일 수정 · 토큰 재생성, 화면은 이미 20px 줄).
호환성 영향은 [breaking-changes.md](./breaking-changes.md).

## 항목

열: **이전** = 이 작업 전 코드 정책, **Figma에 없던 것**, **결정** = 정한 정책, **Figma 반영** = 방법 · 위치, **ID** = 노드 · 변수 ID, **장** = Design System Rules 장.

### Accordion

문서: `components-accordion-usage--docs` · Figma 주석: accordion-item 1035:15648

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ACCO-01 | A | Hover · Expanded: Hover 배경 `background/hover` + 구분선 `border/hover`, 펼침은 진한 구분선 | (해소) 2026-10-19 Figma 갱신으로 모든 크기에 정의 | Figma 변형 그대로 | 이미 Figma 변형(State=Hover · Expanded) | Figma 정의 정책 | accordion-item 1035:15648 · Rules 02 |
| ACCO-02 | A | Disabled: 배경 fill/disabled, 제목 text/inactive | (해소) Figma State=Disabled | Figma 변형 그대로 | 이미 Figma 변형 | Figma 정의 정책 | accordion-item 1035:15648 · Rules 02 |
| ACCO-03 | B | 기본은 하나만 펼침, `allowsMultipleExpanded`로 여러 개 | 여러 항목 동시 펼침 규칙 없음 | 기본 하나만(다른 항목을 열면 이전 항목이 닫힘). 설정 화면처럼 비교가 필요한 곳만 여러 개 허용 | Rules 07 · Accordion 주석 | Figma 문서화 정책 | Rules 04 |
| ACCO-04 | B | 펼침 애니메이션 없음(즉시) | 모션 정의 없음 | 2026-11-02: 내용 높이 200ms 펼침 · 접힘, 아래 항목 이동, 화살표 회전, 움직임 줄이기면 즉시 | Rules 09 "Accordion 펼침·접힘" | Figma 문서화 정책 | Rules 09 1762:8739 |
| ACCO-05 | B | 부모 너비를 채움(Figma 320px 예시) | 너비 규칙 없음 | 레이아웃 정책(08): 폭은 부모를 채움, Figma 320px은 예시 폭 | Rules 08 | Figma 문서화 정책 | Rules 08 |
| ACCO-06 | A | 키보드 포커스: 브라우저 기본 링 | Focus 상태 없음 | 포커스 링(안쪽형): 2px `colors/border/focus`를 행 안쪽 가장자리에 — 폭을 채우는 행은 이웃 · 부모에 가려지지 않도록 안쪽에 그림 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | accordion-item 1035:15648 · Rules 02 |
| ACCO-07 | A | 트리거 모서리 4px | — | 직각(0) — 2026-11-02 사용자 결정 | `border-radius/accordion/default` → rounded-none | Figma 정의 정책 | VariableID:1499:7389 |
| ACCO-08 | A | sm Expanded 트리거만 그림자 | — | 그림자 없음(다른 Expanded 변형과 같게, F102) | 효과 스타일 제거(AB) | Figma 정의 정책 | accordion-item 1035:15648 |

### Alert

문서: `components-alert-usage--docs` · Figma 주석: alert 179:6087

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ALER-01 | B | 부모 너비를 채움(Figma 320px) | 너비 규칙 없음 | 폭은 부모를 채움 | Rules 08 | Figma 문서화 정책 | Rules 08 |
| ALER-02 | B | 설명은 자르지 않음(예시 문구 "최대 2줄") | 줄 수 제한 설정 없음 | 설명은 줄바꿈하며 자르지 않음 — 길면 문구를 줄이는 것이 원칙 | Rules 08 | Figma 문서화 정책 | Rules 08 |
| ALER-03 | B | Error `role="alert"`, 그 밖 `role="status"` | 스크린 리더 알림 규칙 없음 | 오류만 즉시 읽음(alert), 안내 · 성공은 정중히(status) | Rules 03 · Alert 주석 | Figma 문서화 정책 | Rules 03 |
| ALER-04 | B | 닫기 버튼 없음(필요하면 action) | 닫힘 조건 없음 | Alert는 화면 상태를 설명하는 고정 메시지 — 사용자가 닫지 않음. 닫아야 하는 알림은 Toast | Rules 06 | Figma 문서화 정책 | Rules 06 |
| ALER-05 | B | — | 주의(Warning) 사용 기준 없음 | 확인이 필요한 일, 주황 삼각형, 확인할 것 한 문장 + 버튼 | Rules 06 "주의" | Figma 문서화 정책 | Rules 06 1656:7954 |

### Badge

문서: `components-badge-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BADG-01 | A | Outline 배경 투명(변수 없는 흰 채움 무시) | sm Outline 12개 변형만 흰 채움 | Outline은 투명 | 2026-10-19 Figma 12개 변형 흰 채움 삭제 | Figma 정의 정책 | badge_status 91:6152 (91:6180 … 95:2617) · Rules 02 |
| BADG-02 | B | `BadgeDot`은 장식, 의미가 있으면 aria-label · BadgeCount 설명 | 접근성 규칙 없음 | 상태를 색만으로 전하지 않음 — Dot 단독 사용 시 aria-label 필수, Count는 단위를 붙인 이름 | Rules 03 | Figma 문서화 정책 | Rules 03 |
| BADG-03 | B | 최대값 "99+"(`max`로 변경) | Figma는 "99+" 예시만 | 99 초과는 "99+", 맥락에 따라 max 조정 가능 | Rules 08 | Figma 문서화 정책 | Rules 08 |

### Breadcrumb

문서: `components-breadcrumb-usage--docs` · Figma 주석: breadcrumb 712:5106

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BREA-01 | B | 메뉴를 … 버튼 아래 2px에 열고 현재 페이지는 Current 유지 | ~~Figma Expanded는 현재 페이지를 Open(브랜드 색)으로, 메뉴를 경로 끝에 그림(F33)~~ — 2026-10-20 Figma도 정책대로 고침 | 메뉴는 연 트리거(…) 아래 2px, 시작 정렬. 현재 페이지 표시는 바뀌지 않음 | Rules 05 · Breadcrumb 주석 | Figma 문서화 정책 | Rules 05 |
| BREA-02 | A | 아이콘 상태색: Hover · Pressed · Current에 같은 이름 변수 사용 | Link Default 외 변형에 아이콘 없음(F34) | Figma 변수(`breadcrumb/home-icon/*`) 그대로 | Figma 변수로 정의됨 | Figma 정의 정책 | breadcrumb-item 710:4794 · Rules 02 |
| BREA-03 | B | Show Parent는 Collapsed에만 | Full에서의 동작 없음 | Full은 전체 경로를 항상 표시 | Rules 07 | Figma 문서화 정책 | Rules 07 |
| BREA-04 | B | 메뉴 너비 200px, 긴 이름은 넓어짐 | 너비 규칙 없음 | 최소 200px, 내용에 맞춰 넓어짐 | Rules 05 | Figma 문서화 정책 | Rules 05 |
| BREA-05 | A | 포커스: 브라우저 기본 링 | Focus 상태 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | breadcrumb-item 710:4794 · Rules 02 |
| BREA-06 | B | 즉시 열림 · 닫힘 | 모션 값 없음 | 경로 메뉴 열림 150ms · 닫힘 100ms(HeroUI Dropdown), 움직임 줄이기면 즉시 | Rules 09 "펼침·닫힘" | Figma 문서화 정책 | Rules 09 1674:8152 |
| BREA-07 | A | — | — | 쓰지 않는 포커스 · 메뉴 토큰 3개 삭제(공통 `border/focus` · dropdown-menu 토큰 사용) | 변수 삭제(AC) | Figma 정의 정책 | breadcrumb 712:5106 |

### Button

문서: `components-button-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUTT-01 | A | 포커스: 브라우저 기본 표시(임의 스타일 없음) | Button 세트에 Focus 상태 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | button_basic 54:2904 · button_icon 67:2368 · button_text 432:8395 · Rules 02 |
| BUTT-02 | C | Hover · Pressed는 실제 포인터 상태, Disabled는 네이티브 disabled | — | 개발 구현 | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| BUTT-03 | A | 처리 중 표시 없음 | 버튼 안 로딩 모양 | `loading`: Default 팔레트 유지, 내용 투명, 가운데 Loading sm Inverse, 다시 누를 수 없음 | Rules 06 "처리 중" · Form 사용 예시 "저장 중" | Figma 정의 정책 | 1216:7451 · Rules 06 1217:7948 |
| BUTT-04 | A | Hover 800 · Pressed 900 | — | Hover brand/600 · Pressed brand/500(한 단계씩 밝게, 2026-10-30 사용자 결정 — 흰 라벨 3.51 · 2.46:1은 accessibility.md에 기록) | Semantic `fill/secondary/strong/*`(AG) | Figma 정의 정책 | button_basic 54:2904 |
| BUTT-05 | A | Tertiary Solid가 Semantic 직접 | — | Component `button/tertiary/solid/background/*` 경유, 쓰지 않는 Solid 테두리 토큰 삭제 | 바인딩 · 변수(AC) | Figma 정의 정책 | button_basic · button_icon |
| BUTT-06 | A | TextButton Type 값 "SecondarySecondary" | — | Figma 변형 값 이름을 `Secondary`로(2026-11-03, A1) — 코드 `variant="secondary"` 그대로 | 변형 이름(AQ) | Figma 정의 정책 | button_text 432:8395 |

### Card

문서: `components-card-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CARD-01 | A | 그림자: 원격 shadow-sm 대신 로컬 elevation-1 | Figma Card가 원격 라이브러리 효과 스타일(F60) | 로컬 `elevation-1` 사용 | Figma Card 효과 스타일을 로컬 elevation-1로 | Figma 정의 정책 | card 185:6512 내부 · Rules 02 |
| CARD-02 | B | 부모 너비를 채움 | 너비 규칙 없음 | 폭은 부모를 채움 | Rules 08 | Figma 문서화 정책 | Rules 08 |
| CARD-03 | B | 설명 자르지 않음 | 줄 수 제한 없음 | 줄바꿈, 자르지 않음 | Rules 08 | Figma 문서화 정책 | Rules 08 |
| CARD-04 | A | — | 외부 `border-width` | 로컬 `border-width/border` | 바인딩(Z) | Figma 정의 정책 | card 1306:10075 |
| CARD-05 | A | — | 기본 이름 레이어 | `Heading` · `Content placeholder`, `card/divider/default` 삭제; 2026-11-03 그림자를 효과 스타일 `elevation-3`에 연결(같은 값) | 레이어 · 변수 · 효과 스타일(AC · AQ) | Figma 정의 정책 | card 1304:5733 |

### Chart

문서: `components-chart-usage--docs` · Figma 주석: chart 698:4399 · chart-tooltip 693:9776

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CHAR-01 | B | 툴팁: 기준점 옆 p-3, 보이는 그림 영역 안으로 뒤집기 · 이동, body 포털(화면 밖 차트의 툴팁이 화면 가장자리에 남아 다른 차트와 겹침 — 2026-10-19 수정) | Figma는 변형마다 손으로 배치(F63) | 선 · 가로 막대: 기준점 오른쪽 12px(넘치면 왼쪽), 세로 막대: 항목 가운데에서 위쪽. 화면 · 그림 영역 밖으로 나가지 않음 | Rules 05 · Chart 주석 | Figma 문서화 정책 | Rules 05 |
| CHAR-02 | A | 호버 표시: 모든 항목에 hover=yes 모습 | Figma는 간단 스타일에서 현재 기간 호버만 | hover=yes 표시를 모든 항목에 적용 | Figma 변형 hover + Rules 07 | Figma 정의 정책 | chart 698:4399 · Rules 07 |
| CHAR-03 | B | 감지 영역 = 데이터 영역, 터치 탭 · 바깥 누름, 키보드 화살표 · Home · End · Esc | 차트 Hover 기준 없음 | 포인터는 가장 가까운 항목(값 눈금 열 제외), 탭하면 고정 · 바깥 누르면 해제, 키보드 동일 | Rules 07 · Chart 주석 | Figma 문서화 정책 | Rules 07 |
| CHAR-04 | C | 간단 선 차트 바깥 선은 첫 · 마지막 구간 기울기로 | Figma 바깥 선은 손으로 그림(F64) | 개발 구현(그리기 규칙) | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| CHAR-05 | B | 값 범위: 0 이상, 범위 밖은 끝에 그림, 간단 스타일 최대값 위치 | 음수 · 범위 밖 값 정의 없음 | 0 이상 값만 지원, 범위 밖 값은 축 끝에 표시 | Rules 07 | Figma 문서화 정책 | Rules 07 |
| CHAR-06 | B | 숨김 레이어(Current values · Axis unit) 미구현 | Figma 숨김 레이어의 용도 없음 | 명세 아님(숨김 레이어는 쓰지 않음) | Chart 주석 | Figma 문서화 정책 | Rules 07 |
| CHAR-07 | A | 포커스: 그림 영역에 브라우저 기본 링 | Focus 표시 없음 | 포커스 링(02)을 그림 영역에 적용 | Rules 02(Figma 컴포넌트 속성 없음 — 규칙이 기준) | Figma 문서화 정책 | Rules 02 |
| CHAR-08 | C | 툴팁을 <body>로 포털(position: fixed), 스크롤 · 크기 변경 때만 재배치 | — | 툴팁은 자기 그림 영역 안 position: absolute(포털 없음) — 차트와 함께 움직이고, 보이는 부분(화면 · 잘림 조상)만 다시 계산 | Rules 10 · chart-tooltip 주석 | 개발 구현 세부 사항 | chart-tooltip 693:9776 · Rules 10 |
| CHAR-09 | A | — | — | 시리즈 3 · 4 토큰 유지(확장용), 툴팁 레이어 이름; 2026-11-03 State 값 `Hilighted` → `Highlighted` | 변수 유지 · 레이어 · 변형 이름(AC · AQ) | Figma 정의 정책 | chart 698:4399 |
| CHAR-10 | B | 즉시 표시 | 그리기 움직임 없음 | 처음 30% 보일 때 선 0.7초 · 막대 0.5초(항목마다 0.05초), 한 번, 움직임 줄이기면 즉시 | Rules 09 "차트 그리기" · 사용 예시 "그리기 순서" | Figma 문서화 정책 | Rules 09 1757:8379 · 1757:8392 |

### Checkbox

문서: `components-checkbox-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CHEC-01 | A | 포커스: 브라우저 기본 링 | Focus 상태 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 — 상자에만 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | checkbox 99:2389 · Rules 02 |
| CHEC-02 | B | 그룹 간격 없음(사용처에서 지정) | 그룹 간격 정의 없음 | 그룹 기본 간격: 세로 8px(`spacing/margin/m-2`), 가로 16px(`m-4`) | Rules 08 + 코드 기본값 | Figma 문서화 정책 | Rules 08 |
| CHEC-03 | B | Indeterminate 클릭 → 브라우저가 해제 후 체크 | 전환 규칙 없음 | Indeterminate를 누르면 전체 선택(Checked) | Rules 04 | Figma 문서화 정책 | Rules 04 |

### Chip

문서: `components-chip-usage--docs` · Figma 주석: chip-input 558:26017

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CHIP-01 | B | InputChip 칩 전체가 삭제 버튼, Enter · Space · Delete · Backspace | X 아이콘(12px)만 그려짐 | 터치 대상 확보를 위해 칩 전체가 삭제 대상 | Rules 04 · Chip 주석 | Figma 문서화 정책 | Rules 04 |
| CHIP-02 | A | 포커스: 브라우저 기본 링 | Focus 상태 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | chip-multi 201:12711 · chip-input 558:26017 · chip-filter 558:25704 · Rules 02 |
| CHIP-03 | B | Chip 그룹: 사용처에서 role="group"과 간격 | 그룹 컴포넌트 · 간격 없음 | 칩 사이 4px(`m-1`, Figma 예시 바인딩), 줄바꿈 시 같은 간격 — 2026-10-19 밤 8px에서 정정 | Rules 08 | Figma 문서화 정책 | Rules 08 |
| CHIP-04 | B | FilterChip은 트리거만 — 선택 패널 · 선택 방식 · 적용 시점 · 해제는 사용처마다 직접 구현 | Figma에 다중 선택 예시(1011:12956)만, 단일 선택 · 해제 규칙 없음 | 다중(기본): 패널 유지 · 닫을 때 적용 · 모두 끄면 해제, 단일: 고르면 적용 · 닫힘 · "전체"로 해제, 칩 글자 "필터명: 값, 값"(3개 넘으면 "외 N") — FilterChipSelect | Figma 단일 선택 예시 추가(1149:6756) · Rules 04 행 · chip-filter 주석 | Figma 문서화 정책 | chip-filter 558:25704 · 예시 1011:12956 · 1149:6756 · Rules 04 1149:6982 · Rules 04 |
| CHIP-05 | A | 열린 필터 칩이 Pressed 모양(react-aria가 열린 동안 트리거를 눌림으로 둠) | Figma는 열린 칩을 State=Default · Expanded=True로 그림 | Figma 그대로 — 실제로 누르는 동안만 Pressed | 이미 Figma 변형(Expanded=True) | Figma 정의 정책 | chip-filter 558:25704 · Rules 02 |
| CHIP-06 | A | 선택 패널 없음 | — | listbox · option Size=sm, 칩 아래 4px · 시작 정렬 · 최소 160px | Figma 선택 예시의 배치 · 인스턴스 | Figma 정의 정책 | listbox 97:2665 · option 97:2286 (예시 1011:13310) · Rules 05 |
| CHIP-07 | B | 즉시 열림 · 닫힘 | 모션 값 없음 | `FilterChipSelect` 목록 열림 150ms · 닫힘 100ms | Rules 09 "펼침·닫힘" | Figma 문서화 정책 | Rules 09 1674:8152 |

### DashboardFilterBar

문서: `components-dashboardfilterbar-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DFBR-01 | B | 좁은 화면에서 그룹 줄바꿈(m-6) | 1616px 한 줄만 | 좁으면 그룹 단위로 줄바꿈 | Rules 08 | Figma 문서화 정책 | Rules 08 |
| DFBR-02 | A | padding · 배경이 원격 변수 → 같은 값 로컬 사용 | 원격 라이브러리 변수(F69) | 로컬 `p-4` · `surface/page` | Figma 바인딩을 로컬 변수로 | Figma 정의 정책 | dashboard-filter-bar 698:4163 · Rules 02 |
| DFBR-03 | A | 초기화 버튼 Secondary · Solid | (해소) Figma 예시 | Figma 그대로 | 이미 Figma | Figma 정의 정책 | dashboard-filter-bar 698:4163 (button_icon Secondary · Solid) · Rules 02 |
| DFBR-04 | A | 그림자 0 1 8 / 12%: Figma는 효과 스타일 없이 값만, 코드는 같은 값의 `elevation-3` | 효과 스타일 미연결(F69) | `elevation-3` 효과 스타일 | Figma 효과 스타일 연결(값 동일, 2026-10-19) | Figma 정의 정책 | dashboard-filter-bar 698:4163 · effect elevation-3 · Rules 02 |
| DFBR-05 | B | role="search" 랜드마크, 그룹 이름, 컨트롤 aria-label | 보이는 라벨 없음 | 컨트롤마다 접근 가능한 이름 필수 | Rules 03 | Figma 문서화 정책 | Rules 03 |
| DFBR-06 | A | — | 기간 필드 구성 | 기간 = 136px 날짜 필드 두 개 + "~"(스토리 예시) | Figma 예시 그대로 | Figma 정의 정책 | dashboard-filter-bar 698:4163 |
| DFBR-07 | A | — | 기본 이름 · 미사용 토큰 | 레이어 이름 정리, `dashboard/border/default` 삭제; 2026-11-03 달력 아이콘의 외부 변수를 같은 이름의 로컬 `colors/icon/secondary`로 | 레이어 · 변수 · 바인딩(AC · AQ) | Figma 정의 정책 | dashboard-filter-bar 698:4163 |
| DFBR-08 | B | 묶음 안 SegmentedControl이 넓은 화면에서도 눌려 라벨이 잘림, 휴대폰 너비에서 묶음이 카드 밖으로 나감 | 묶음 안 컨트롤 너비 규칙 없음 | 묶음 안 컨트롤은 자기 너비 유지(필드는 내용 너비), 묶음 하나보다 좁으면 묶음 안에서도 다음 줄로(2026-11-03) | Rules 08 "좁은 화면"(묶음 단위 줄바꿈 그대로) | Figma 문서화 정책 | Rules 08 1280:8173 · dashboard-filter-bar 698:4163 |

### DataFreshness

문서: `components-datafreshness-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DFRE-01 | C | `<time datetime>`, "·" 장식 | — | 개발 구현 | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| DFRE-02 | B | aria-live 아님 | 갱신 알림 규칙 없음 | 시각이 바뀔 때마다 읽지 않음 — 상태(Stale · Offline) 변화는 화면에서 알림 | Rules 03 | Figma 문서화 정책 | Rules 03 |
| DFRE-03 | A | 배지 흰 배경 무시 | (해소) 2026-10-19 Figma 흰 채움 삭제 | Outline 투명 | Figma 수정 완료 | Figma 정의 정책 | data-freshness 697:4543 · Rules 02 |
| DFRE-04 | A | — | 기본 이름 레이어 | `Details` | 레이어(AC) | Figma 정의 정책 | data-freshness |

### DataState

문서: `components-datastate-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DSTA-01 | B | 동작이 있을 때만 버튼 | 버튼 표시 조건 없음 | 동작 없는 버튼을 두지 않음 | Rules 07 | Figma 문서화 정책 | Rules 07 |
| DSTA-02 | B | Partial 설명 기본값 없음 | Figma 기본 문구에 실제 수치(F73) | 설명은 사용처가 실제 수치로 작성 | Rules 07 | Figma 문서화 정책 | Rules 07 |
| DSTA-03 | B | role="status", Loading은 aria-busy | 알림 규칙 없음 | 상태 변경은 status로 알림 | Rules 03 | Figma 문서화 정책 | Rules 03 |
| DSTA-04 | A | 원격 흰 배경 대신 surface/page, 부모 너비 | 원격 `color/background/white`(F69) | `colors/surface/page` | Figma 바인딩을 로컬로 | Figma 정의 정책 | data-state 698:4359 · Rules 02 |
| DSTA-05 | A | 상하 여백 0 | — | Loading 상하 `p-3`(높이 90) | Figma 값 | Figma 정의 정책 | data-state 698:4262 |
| DSTA-06 | A | — | 기본 이름 레이어 | `Skeleton group` · `Content` | 레이어(AC) | Figma 정의 정책 | data-state 698:4359 |
| DSTA-07 | A | 상태별 제목 · 설명 속성 10개가 어떤 레이어에도 연결되지 않음 | — | 속성 10개 삭제, 각 상태의 empty-state 인스턴스를 노출(제목 · 설명을 인스턴스 패널에서 바로 수정) — 코드 `title` · `description` 그대로(2026-11-03) | 컴포넌트 속성(AQ) | Figma 정의 정책 | data-state 698:4359 |

### DatePicker

문서: `components-datepicker-usage--docs` · Figma 주석: date-picker_trigger 144:723

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DPCK-01 | B | 직접 입력 지원, 잘못된 날짜는 값 유지 + Error | 입력 검증 규칙 없음 | 직접 입력 허용, 해석 불가 · 범위 밖 날짜는 Error 상태로 안내하고 값은 바꾸지 않음 | Rules 04 · DatePicker 주석 | Figma 문서화 정책 | Rules 04 |
| DPCK-02 | B | 달력: 필드 아래 4px, 왼쪽 정렬, 공간 없으면 위로 | 위치 규칙 없음 | 오버레이 공통 규칙(05) | Rules 05 | Figma 문서화 정책 | Rules 05 |
| DPCK-03 | A | 요일 이름 로캘(ko-KR 일 월 …) | Figma 요일 영어 자리표시(Su Mo …) | 요일은 로캘 — 한국어 "일 월 화 수 목 금 토" | Figma 달력 요일 글자를 한국어로 | Figma 정의 정책 | date-picker_calendar 144:1644 · Rules 08 |
| DPCK-04 | A | 포커스: 날짜 · 달력 버튼에 브라우저 기본 링 | Focus 상태 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | date-picker_day 144:1033 · date-picker_navigation 144:1328 · Rules 02 |
| DPCK-05 | B | 날짜 칸 이름 = react-aria 전체 날짜("2026년 9월 27일 일요일") — 보이는 "27"이 이름의 낱말이 아님(axe 2.5.3, 한국어 "27일") | 이름 규칙 없음 | 보이는 숫자 먼저 + 전체 날짜: "27 2026년 9월 27일 일요일"(선택됨 · 오늘 문구 유지) | Rules 03 이름과 설명 행 | Figma 문서화 정책 | Rules 03 |
| DPCK-06 | B | 즉시 열림 · 닫힘 | 모션 값 없음 | 달력 · 연월 목록 열림 150ms · 닫힘 100ms | Rules 09 "펼침·닫힘" | Figma 문서화 정책 | Rules 09 1674:8152 |
| DPCK-07 | B | — | — | Esc · 바깥 클릭으로 닫힘, 포커스는 필드로, 비활성 · 읽기 전용은 열리지 않음 | Rules 05 "닫기" · "포커스 이동" | Figma 문서화 정책 | Rules 05 1097:5385 · 1097:5392 |
| DPCK-08 | B | — | — | 필드 이름 = 값 + 라벨, 메시지 · 상태는 설명, 열린 달력은 Dialog | Rules 03 "이름 붙이기" | Figma 문서화 정책 | Rules 03 1097:5176 |
| DPCK-09 | A | — | — | 열림(State=Open) = `…/border/focus` + `icon/secondary` | date-picker_trigger State=Open | Figma 정의 정책 | date-picker_trigger |
| DPCK-10 | A | — | 미사용 토큰 | `day/border/*` 7 · `weekday/label/default` · `trigger/outline/label/*` 4 삭제 | 변수(AC) | Figma 정의 정책 | date-picker |
| DPCK-11 | C | 문서 페이지에서 열린 달력이 페이지 전체를 덮음 | — | 처음부터 열린 스토리(날짜 제한 · 선택 불가 날짜)는 문서 페이지에서 자기 틀(iframe) 안에 그림 — 덮개 · 스크롤 잠금이 그 틀 안에만 | — | 개발 구현 세부 사항 | — |

### Dialog

문서: `components-dialog-usage--docs` · Figma 주석: dialog 149:2838

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DIAL-01 | A | 배경 덮개 없음(투명) | scrim 정의 없음(F51) | 모달은 배경 덮개 `colors/dialog/scrim/default`(→ `surface/scrim`, 검정 50%)를 깔고 뒤 화면 조작 차단 | Component 토큰 + Dialog 예시(덮개 포함) | Figma 정의 정책 | dialog 149:2838 · Rules 05 |
| DIAL-02 | B | children은 헤더와 버튼 사이 m-8 | 내용 영역 없음 | 본문 내용은 설명과 버튼 사이 같은 간격 | Rules 08 | Figma 문서화 정책 | Rules 08 |
| DIAL-03 | B | Esc로 닫힘, 바깥 클릭은 dismissable일 때만, X 버튼 없음 | 닫힘 조건 없음 | Esc 닫힘(기본), 바깥 클릭은 기본 닫히지 않음(입력 유실 방지), 닫히면 포커스가 연 요소로 돌아감, 열린 동안 포커스 가둠 | Rules 05 | Figma 문서화 정책 | Rules 05 |
| DIAL-04 | B | 열림 · 닫힘 즉시 | 모션 없음 | 모션 정책(09) | Rules 09 | Figma 문서화 정책 | Rules 09 |
| DIAL-05 | A | — | 미사용 토큰 | `dialog/body/default` 삭제 | 변수(AC) | Figma 정의 정책 | dialog 149:2838 |

### DropdownMenu

문서: `components-dropdownmenu-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DROP-01 | B | 열린 트리거 모양 = 트리거 그대로, aria-expanded | 열림 상태 트리거 없음 | 트리거 모양은 바뀌지 않음, 열림은 aria-expanded로 전달 | Rules 05 | Figma 문서화 정책 | Rules 05 |
| DROP-02 | A | 키보드 포커스 항목 = Hover 모양 | Focus 상태 없음 | 목록형 항목(옵션 · 메뉴)의 키보드 포커스는 Hover 모양(포커스 링 대신) | Rules 02 | Figma 문서화 정책 | Rules 02 |
| DROP-03 | B | 트리거 아래 4px, 시작 정렬, 화면 밖이면 뒤집기 | 위치 규칙 없음 | 오버레이 공통 규칙(05) | Rules 05 | Figma 문서화 정책 | Rules 05 |
| DROP-04 | B | 너비는 내용에 맞춤 | 예시 고정 너비만 | 내용에 맞춤(최소 트리거 너비 없음) | Rules 08 | Figma 문서화 정책 | Rules 08 |
| DROP-05 | B | 하위 메뉴 열림 미구현(chevron 모양만) | 하위 메뉴 패널 없음 | 2026-10-29: 하위 메뉴 한 단계(`DropdownMenuSub`, 140px 글자 메뉴) — 여는 항목 옆에 붙여 열고 → · Enter · Space로 열기, ← · Esc로 닫기. 하위 메뉴가 없는 오른쪽 화살표(`chevron`)는 다른 화면으로 이동 | Rules 05 "하위 메뉴"(2026-11-03 Rules 09와 맞춤) · Rules 09 "dropdown-menu" | Figma 문서화 정책 | Rules 05 1198:5155 · Rules 09 1674:8144 |
| DROP-07 | B | 메뉴 · 하위 메뉴 즉시 열림 · 닫힘 | 모션 없음 | Rules 09 "dropdown-menu · dropdown-menu-sub — 참고 링크 대로 움직임"(shadcn/ui Base Dropdown Menu): 나타남 150ms · 사라짐 100ms 페이드 + 0.95 크기, 연 쪽 기준점, 위치는 움직임과 분리, 움직임 줄이기면 즉시 | Rules 09 | Figma 문서화 정책 | Rules 09 1674:8144 |
| DROP-06 | B | 설명이 있는 항목: 이름 = 라벨, 설명 = aria-describedby — 보이는 설명이 이름에 없음(axe 2.5.3) | — | 라벨 + 설명 전체가 이름 | Rules 03 이름과 설명 행 | Figma 문서화 정책 | Rules 03 |
| DROP-08 | C | 문서 페이지에서 열린 메뉴가 페이지 전체를 덮음 | — | 처음부터 열린 스토리(Open · With Description · Gallery Overview)는 문서 페이지에서 자기 틀(iframe) 안에 그림. `verify:render`에 `docs-blocked` 검사 | — | 개발 구현 세부 사항 | — |
| DROP-09 | A | — | 외부 `border-width` · `py-1` | 메뉴 · 하위 메뉴 테두리 두께와 구분선 세로 여백을 같은 값의 로컬 `border-width/border` · `spacing/padding/p-1`로(2026-11-03) | 바인딩(AQ) | Figma 정의 정책 | dropdown-menu 1440:8454 · dropdown-menu-sub 1440:8455 · dropdownmenu_line 179:5082 |

### EmptyState

문서: `components-emptystate-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| EMPT-01 | A | `action` 선택(버튼 없음 가능) | 버튼을 끄는 속성 없음 | 버튼은 선택 | Figma 컴포넌트 속성 `Show Button`(boolean) 추가 | Figma 정의 정책 | empty-state 724:14963 · Rules 07 |
| EMPT-02 | B | 폭 320px, 좁으면 줄어듦 | — | 최대 320px | Rules 08 | Figma 문서화 정책 | Rules 08 |
| EMPT-03 | A | — | — | 현재 Figma(320×120, 상하 12px) 기준 재검사 1/1 | 기하 · 참조 재추출 | Figma 정의 정책 | empty-state 724:14963 |
| EMPT-04 | A | — | — | 아이콘 `empty-state/icon/default`, 배경 토큰 삭제 | 바인딩 · 변수(AC) | Figma 정의 정책 | empty-state 724:14963 |

### FileUploader

문서: `components-fileuploader-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FILE-01 | B | 드롭 영역 = 버튼(클릭 · Enter · Space), 도움말이 설명 | 조작 규칙 없음 | 드롭 영역은 버튼으로 동작 | Rules 04 | Figma 문서화 정책 | Rules 04 |
| FILE-02 | B | 드롭 파일도 accept로 거름, multiple 아니면 첫 파일만 | 필터 규칙 없음 | 형식이 맞지 않는 파일은 받지 않음 | Rules 07 | Figma 문서화 정책 | Rules 07 |
| FILE-03 | B | 항목 버튼 설명 = 파일 이름 | — | 목록 버튼은 대상 파일 이름으로 설명 | Rules 03 | Figma 문서화 정책 | Rules 03 |
| FILE-04 | B | 스피너 1초/바퀴, 동작 줄이기 3초 | 모션 없음 | 모션 정책(09) | Rules 09 | Figma 문서화 정책 | Rules 09 |
| FILE-05 | C | 점선 테두리 SVG 6/4 | Figma 변마다 대시 맞춤 | 개발 구현 | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| FILE-06 | A | 포커스: 드롭 영역에 브라우저 기본 링 | Focus 상태 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | file-uploader 651:3945 · Rules 02 |
| FILE-07 | A | — | — | 글자 묶음 `Text group`, `icon/drag-over` 삭제 | 레이어 · 변수(AC) | Figma 정의 정책 | file-uploader 651:3945 |
| FILE-08 | A | `Show Button` 속성이 어떤 레이어에도 연결되지 않음(F26) | — | 속성 삭제 — 업로드 영역 자체가 버튼이고 별도 버튼 레이어가 없음(코드도 버튼 없음, 2026-11-03) | 컴포넌트 속성(AQ) | Figma 정의 정책 | file-uploader 651:3945 |

### Input

문서: `components-input-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| INPU-01 | B | 지우기(X): Hover · Focus에서 보임, Tab 제외 | 조작 규칙 없음 | 지우기는 마우스 보조, 키보드는 전체 선택 후 삭제 | Rules 04 | Figma 문서화 정책 | Rules 04 |
| INPU-02 | B | 눈 아이콘 = 비밀번호 표시 토글(aria-pressed) | 아이콘 하나뿐 | 비밀번호 필드에서만, 상태는 aria-pressed | Rules 04 | Figma 문서화 정책 | Rules 04 |
| INPU-03 | A | Error + Focus: Error 테두리 유지 | 조합 없음 | 오류 상태가 포커스보다 우선(입력 칸 공통) | Rules 02 | Figma 문서화 정책 | Rules 02 |
| INPU-04 | A | 눈 아이콘(비밀번호 표시) 버튼 포커스: 브라우저 기본 링 | Focus 상태 없음(입력 칸 Focus는 테두리) | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 | Rules 02(Figma 컴포넌트 속성 없음 — 규칙이 기준) | Figma 문서화 정책 | Rules 02 |
| INPU-05 | A | — | 외부 아이콘 인스턴스 | 눈 아이콘 로컬화(2026-10-28) → 아이콘 라이브러리 `icon/Eye` · `Eye-close`(2026-10-30) | 구조 | Figma 정의 정책 | password_field 1440:8466 |
| INPU-06 | A | — | 미사용 토큰 | `input/outline/label/*` 4 삭제 | 변수(AC) | Figma 정의 정책 | input |
| INPU-07 | A | 눈 아이콘이 외부 `colors/icon/secondary`에 묶여 비활성 · 읽기 전용도 진한 색(F117) | — | 상태별 로컬 `input/outline/icon/{hover,focus,completed,error,disabled,read-only}`로 재연결 — 비활성 · 읽기 전용 눈 #a1a8b5(코드는 원래 이 색, 2026-11-03) | 바인딩(AH → AQ) | Figma 정의 정책 | password_field 1440:8466 |

### Link

문서: `components-link-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LINK-01 | B | 화살표 아이콘 = 새 창(external, 숨은 "(새 창)") | 아이콘 의미 없음 | 외부 · 새 창 링크에만 화살표 아이콘 | Rules 04 | Figma 문서화 정책 | Rules 04 |
| LINK-02 | A | 포커스: 브라우저 기본 링 | Focus 상태 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | link 111:1509 · Rules 02 |
| LINK-03 | A | md 줄 높이 20px | 텍스트 스타일 underline 140%(19.6px, C3 · A-4) | `sm/leading-normal/underline` 줄 높이 `leading-5`(20px) | Figma 텍스트 스타일 수정 | Figma 정의 정책 | text style sm/leading-normal/underline · Rules 02 |

### MetricCard

문서: `components-metriccard-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MCAR-01 | A | 원격 padding · 배경 → 로컬 | 원격 변수(F69) | 로컬 `p-4` · `surface/page` | Figma 바인딩을 로컬로 | Figma 정의 정책 | metric-card 697:4487 · Rules 02 |
| MCAR-02 | A | 그림자 0 1 8 / 12%: Figma는 효과 스타일 없이 값만, 코드는 같은 값의 `elevation-3` | 효과 스타일 미연결(F69) | `elevation-3` 효과 스타일 | Figma 효과 스타일 연결(값 동일, 2026-10-19) | Figma 정의 정책 | metric-card 697:4487 · effect elevation-3 · Rules 02 |
| MCAR-03 | B | 부모 너비 | — | 폭은 부모를 채움 | Rules 08 | Figma 문서화 정책 | Rules 08 |
| MCAR-04 | B | 카드 = 제목으로 이름 붙은 group | — | 카드 묶음은 제목을 이름으로 | Rules 03 | Figma 문서화 정책 | Rules 03 |

### MetricTrend

문서: `components-metrictrend-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MTRE-01 | B | 방향을 숨은 글자로("증가" 등) | 아이콘만 | 방향은 아이콘 + 숨은 글자 | Rules 03 | Figma 문서화 정책 | Rules 03 |
| MTRE-02 | B | Tone은 색으로만 | 색만으로 구분 | 좋음 · 나쁨 판단은 주변 문장에서 설명(색만으로 전하지 않음) | Rules 03 | Figma 문서화 정책 | Rules 03 |
| MTRE-03 | A | (A-1) Disabled 글자 text/secondary | (해소) 2026-10-19 Figma 수정 | Figma 그대로 | Figma 수정 완료 | Figma 정의 정책 | metric-trend 697:4482 · Rules 02 |

### Navigation

문서: `components-navigation-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| NAVI-01 | B | 항목은 컨테이너 폭 | — | LNB 240px는 레이아웃에서 | Rules 08 | Figma 문서화 정책 | Rules 08 |
| NAVI-02 | C | 하위 목록 선 반 픽셀 기하 | — | 개발 구현 | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| NAVI-03 | A | Pressed = Hover | Pressed 상태 없음 | 내비게이션 항목은 Pressed를 Hover와 같게 | Rules 02 | Figma 문서화 정책 | Rules 02 |
| NAVI-04 | A | 포커스: 브라우저 기본 링 | Focus 상태 없음 | 포커스 링(안쪽형): 2px `colors/border/focus`를 행 안쪽 가장자리에 — 폭을 채우는 행은 이웃 · 부모에 가려지지 않도록 안쪽에 그림 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | item_parent 180:5246 · item_link 180:6174 · item_child 180:6249 · Rules 02 |
| NAVI-05 | A | link Hover 아이콘은 icon/default(F36) | — | Figma 바인딩 그대로 | 이미 Figma | Figma 정의 정책 | item_link 180:6174 · Rules 02 |
| NAVI-06 | A | — | 이름 모순 토큰 | `lnb/item/child/unselected/indicator/selected` 삭제 | 변수(AC) | Figma 정의 정책 | item_child 180:6249 |
| NAVI-07 | A | Hover 아이콘 icon/default | — | Hover 아이콘 `…/link/unselected/icon/hover`(icon/secondary) | 바인딩(AD, F113) | Figma 정의 정책 | item_link 180:6174 |
| NAVI-08 | B | 하위 메뉴 즉시 펼침 · 접힘 | 모션 없음 | 2026-11-02 사용자 요청(shadcn/ui Base Accordion): 실제 높이로 200ms 펼침 · 접힘, 아래 항목 이동, 화살표 회전, 움직임 줄이기면 즉시 | Rules 09 "내비게이션 펼침·접힘" 행(2026-11-03 추가, AO → AQ) | Figma 문서화 정책 | Rules 09 1807:8738 |

### Pagination

문서: `components-pagination-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PAGI-01 | B | 생략 · 처음/끝 없음, visiblePages 창 | 많은 페이지 규칙 없음 | 현재 페이지 주변 고정 개수만, 생략 기호 없음 | Rules 07 | Figma 문서화 정책 | Rules 07 |
| PAGI-02 | A | 첫 페이지 이전 버튼 Disabled | Figma 예시는 Default | 이동할 곳이 없으면 이전 · 다음은 Disabled | Figma pagination 세트의 이전 버튼을 Disabled로 | Figma 정의 정책 | pagination 132:871 · Rules 07 |
| PAGI-03 | A | 포커스: 브라우저 기본 링 | Focus 상태 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | pagination_item 132:520 · pagination_control 132:604 · Rules 02 |

### Progress

문서: `components-progress-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PROG-01 | B | 값을 모르는 진행 없음 | — | 진행률을 아는 경우만 Progress, 모르면 Loading | Rules 06 | Figma 문서화 정책 | Rules 06 |
| PROG-02 | B | 라벨 · 수치는 aria로만 | 보이는 라벨 없음 | 접근 가능한 이름 · 값 필수 | Rules 03 | Figma 문서화 정책 | Rules 03 |
| PROG-03 | B | 막대 즉시 변경 | 모션 없음 | 모션 정책(09) | Rules 09 | Figma 문서화 정책 | Rules 09 |

### Radio

문서: `components-radio-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RADI-01 | A | 포커스: 브라우저 기본 링 | Focus 상태 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 — 원에만 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | radio 102:2677 · Rules 02 |
| RADI-02 | B | 그룹 간격 없음 | 그룹 간격 정의 없음 | 세로 8px · 가로 16px(Checkbox와 같음) | Rules 08 + 코드 기본값 | Figma 문서화 정책 | Rules 08 |

### SegmentedControl

문서: `components-segmentedcontrol-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SEGM-01 | A | 포커스: 선택 항목에 브라우저 기본 링 | Focus 상태 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | segmented-item 524:24397 · Rules 02 |
| SEGM-02 | A | 선택 항목 Hover · Pressed = 같은 값 Component 변수 | 변형 없음, 변수만 | Figma 변수 그대로 | 이미 Figma 변수 | Figma 정의 정책 | segmented-item 524:24397 · VariableID:532:24494 · Rules 02 |
| SEGM-03 | A | 선택 항목 그림자: 값 그대로(0 1 2 / 9%) | 효과 스타일 없음 | 효과 스타일 `elevation-segmented-selected`(0 1 2 / 9%) — 코드 `--effect-elevation-segmented-selected` | Figma 효과 스타일(2026-10-20 등록, 2026-11-03 재확인 — 이전 "등록 대기"는 기록 누락) | Figma 정의 정책 | Rules 02 |
| SEGM-04 | B | 즉시 이동 | 모션 값 없음 | 선택 배경이 미끄러져 이동(250ms), 움직임 줄이기면 즉시 | Rules 09 "Segmented Control" | Figma 문서화 정책 | Rules 09 1674:8128 |

### Select

문서: `components-select-usage--docs` · Figma 주석: select 95:4740

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SELE-01 | A | 닫힌 상태 키보드 포커스: 브라우저 기본 링 | Focus 상태 없음 | 입력 칸과 같은 Focus(테두리 `border/gray-darker`) | Figma State=Focus 변형 3개 추가 | Figma 정의 정책 | select 95:4740 · Rules 02 |
| SELE-02 | A | 키보드 이동 옵션 = Hover 모양 | Focus 상태 없음 | 목록형 항목의 키보드 포커스는 Hover 모양 | Rules 02 | Figma 문서화 정책 | Rules 02 |
| SELE-03 | A | 선택된 옵션 Hover: 배경 Hover, 글자 Selected | 조합 없음 | 선택 표시는 Hover보다 우선(글자 · 체크) | Rules 02 | Figma 문서화 정책 | Rules 02 |
| SELE-04 | B | 목록: 필드 아래 4px, 같은 너비, 공간 없으면 위로, 높이는 화면에 맞춤 | 위치 · 최대 높이 없음 | 오버레이 공통 규칙(05) | Rules 05 | Figma 문서화 정책 | Rules 05 |
| SELE-05 | C | 스크롤 표시 = 브라우저 스크롤바(4px) | — | 개발 구현 | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| SELE-06 | B | Read-only "읽기 전용" 설명 | — | 읽기 전용은 화면 낭독기에 알림 | Rules 03 | Figma 문서화 정책 | Rules 03 |
| SELE-07 | A | Selected 옵션에 항상 체크 아이콘 | Figma option 속성 Check Icon(끌 수 있음)이 코드에 없음 | SelectOption checkIcon(기본 켬) | 이미 Figma 속성(Check Icon) | Figma 정의 정책 | option 97:2286 · Rules 02 |
| SELE-08 | A | option md Disabled만 밑줄 · Medium(Figma 그대로 재현) | Figma 텍스트 스타일 오적용(F6) | 다른 md 상태와 같은 base/leading-normal/normal | Figma 텍스트 스타일 수정(97:2331) | Figma 정의 정책 | option 97:2330 · Rules 02 |
| SELE-09 | B | 즉시 열림 · 닫힘 | 모션 값 없음 | 목록 열림 150ms · 닫힘 100ms | Rules 09 "펼침·닫힘" | Figma 문서화 정책 | Rules 09 1674:8152 |
| SELE-10 | A | — | 미사용 토큰 | `option/background/selected` · `label/*` 4 삭제; 2026-11-03 `select/outline/outline/*` 39개를 `select/outline/*`로(이름 중복 수정, ID 유지) | 변수(AC · AQ) | Figma 정의 정책 | select 95:2819 |

### Skeleton

문서: `components-skeleton-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SKEL-01 | B | 애니메이션 없음 | 모션 없음 | 2026-10-28: 맥동(shadcn/ui Skeleton), 움직임 줄이기면 느리게 | Rules 09 "반복 움직임" | Figma 문서화 정책 | Rules 09 1674:8160 |
| SKEL-02 | C | style로 크기 조절 | — | 개발 구현 | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| SKEL-03 | B | 장식(aria-hidden), 감싸는 영역이 알림 | — | 불러오는 중은 영역(DataState)이 알림 | Rules 03 | Figma 문서화 정책 | Rules 03 |

### Slider

문서: `components-slider-usage--docs` · Figma 주석: slider 391:1988

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SLID-01 | B | 값 라벨: Hover · 드래그 · 키보드 포커스 | Figma Hover · Pressed만 | 값 라벨은 Hover · 드래그 · 포커스 중 표시 | Rules 04 | Figma 문서화 정책 | Rules 04 |
| SLID-02 | C | 핸들 중심 = 값 위치 | Figma 예시 2px 어긋남 | 개발 구현 | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| SLID-03 | B | 숫자 필드 고정 너비(최장 값) | 예시 너비만 | 값이 바뀌어도 트랙 길이 고정 | Rules 08 | Figma 문서화 정책 | Rules 08 |
| SLID-04 | A | 포커스: 핸들에 브라우저 기본 링 | Focus 상태 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | handle 391:2013 · Rules 02 |
| SLID-05 | A | — | 외부 Tag/state 인스턴스 | 값 라벨을 로컬 글자로(AB) | 구조 | Figma 정의 정책 | handle 391:2013 |
| SLID-06 | A | — | 기본 이름 레이어 | 레이어 이름 정리 | 레이어(AC) | Figma 정의 정책 | slider · handle |
| SLID-07 | A | — | — | legacy 대안용 handle 토큰 2개 유지 | 변수 유지 | Figma 정의 정책 | legacy 684:6491 |

### Stepper

문서: `components-stepper-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| STEP-01 | B | 연결선 180px(가로), 너비를 주면 늘어남, 세로 48px | — | 연결선은 남는 폭을 채움(기본 180px) | Rules 08 | Figma 문서화 정책 | Rules 08 |
| STEP-02 | B | "N단계, 완료" 숨은 문구 | 색 · 아이콘만 | 상태를 글자로도 전달 | Rules 03 | Figma 문서화 정책 | Rules 03 |
| STEP-03 | B | 애니메이션 없음 | 참고 링크만 | 모션 정책(09) | Rules 09 | Figma 문서화 정책 | Rules 09 |
| STEP-04 | B | 라벨이 원 밖으로 넘침, 양 끝 여백 필요 | — | 가로 Stepper 바깥에 라벨 폭 절반 여백 | Rules 08 | Figma 문서화 정책 | Rules 08 |

### Switch

문서: `components-switch-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SWIT-01 | A | 포커스: 브라우저 기본 링 | Focus 상태 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 — 트랙에만 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | switch 107:409 · Rules 02 |
| SWIT-02 | B | 썸 즉시 이동 | 모션 없음 | 2026-11-02 사용자 요청(HeroUI Native Switch): 누름 0.96 축소 · 썸 스프링 · 트랙 색 175ms 블렌드, 움직임 줄이기면 즉시 | Rules 09 "Switch 켜기·끄기" 행(2026-11-03 추가, figma-fix-requests AM → AQ) | Figma 문서화 정책 | Rules 09 1807:8746 |

### Table

문서: `components-table-usage--docs` · Figma 주석: table_value_editable 503:23264

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TABL-01 | B | 관리 모드: 칸 Hover · 포커스 · 열린 목록에서 입력 상자 | 칸 단위 상태만 | 편집 칸은 Hover 또는 포커스일 때 입력 상자 표시 | Rules 07 | Figma 문서화 정책 | Rules 07 |
| TABL-02 | A | Textarea 유형 한 줄 Input | Figma 편집 · 채움 모양 불일치(F58) | 한 줄 Input(두 줄 채움은 표시만) | Figma 정리 대기(F58) | Figma 반영 대기 | Rules 07 |
| TABL-03 | A | (해소) 안내 글자 text/tertiary | (해소) F57 · R8 | Figma 그대로 | Figma 수정 완료 | Figma 정의 정책 | table_value_editable 503:23264 · Rules 02 |
| TABL-04 | A | 행 Hover · Pressed는 Component 변수 table/data/background/* | Figma 예시가 Semantic 직접(F54) | Component 변수 사용 | Figma 예시 바인딩을 Component 변수로 | Figma 정의 정책 | table_body 355:3739 예시 · Rules 02 |
| TABL-05 | B | 선택된 행은 체크박스로만 | 선택 행 모습 없음 | 선택 행 배경 강조 없음 — 체크박스 상태가 기준 | Rules 07 | Figma 문서화 정책 | Rules 07 |
| TABL-06 | B | 정렬: aria-sort, 아이콘은 활성 색만 | 방향 아이콘 하나 | 정렬 방향은 aria-sort, 활성 열 아이콘은 `header/icon/active` | Rules 07 | Figma 문서화 정책 | Rules 07 |
| TABL-07 | B | 편집 아이콘은 버튼으로 감싸 이름 지정 | 아이콘만 | 누를 수 있는 아이콘은 버튼 + 이름 | Rules 03 | Figma 문서화 정책 | Rules 03 |
| TABL-08 | A | 행 · 칸 · 열 머리글 키보드 포커스: 브라우저 기본 링 | Focus 상태 없음 | 포커스 링(안쪽형): 2px `colors/border/focus`를 행 안쪽 가장자리에 — 폭을 채우는 행은 이웃 · 부모에 가려지지 않도록 안쪽에 그림 | Rules 02(Figma 컴포넌트 속성 없음 — 규칙이 기준) | Figma 문서화 정책 | Rules 02 |
| TABL-09 | B | Empty 머리글은 aria-label만 — 머리글 칸에 글자 없음(axe empty-table-header) | Figma Empty는 빈 머리글 | 화면에는 비우고 이름을 화면 낭독기용 글자로 함께 넣음(TableEmptyColumn) | Rules 03 이름과 설명 행 | Figma 문서화 정책 | Rules 03 |
| TABL-10 | A | Filter · Editing의 다중 선택 목록을 그리지 않음(라이브러리에 없음, R7 · D3) | — | FilterChipSelect(chip-filter + listbox · option sm)로 목록 표시 | 이미 Figma 변형(Editing에 listbox) | Figma 정의 정책 | table_value_editable 503:23264 · 693:7165 · Rules 07 |
| TABL-11 | B | 전체 선택 체크박스 클릭이 되돌려짐 | — | 머리글 체크박스 클릭이 정상 동작 | Rules 07 "표" | Figma 문서화 정책 | Rules 07 1280:8099 |
| TABL-12 | A | 날짜 범위 두 필드 | — | 필드 하나 "시작 ~ 종료" | 변형 재구성(AB, F110) | Figma 정의 정책 | table_value_editable 503:23264 |
| TABL-13 | A | — | 기본 이름 레이어 | 레이어 이름, 행 아이콘 상태 토큰 유지 | 레이어(AC) | Figma 정의 정책 | table_value_editable |
| TABL-14 | A | hover 아이콘이 기본보다 연함 | — | `data/icon/hover` · `pressed` → icon/primary | 변수 별칭(AD, F113) | Figma 정의 정책 | table_body 355:3739 |
| TABL-15 | B | 일부 선택 머리글이 모두 선택 | — | 일부 · 모두 선택된 머리글을 누르면 선택 해제 | Rules 04 "선택 · 삭제" | Figma 문서화 정책 | Rules 04 1097:5284 |
| TABL-16 | A | 편집 칸 Filter · Hover · Empty 칩만 State=Hover(F82 · V-7) | — | 다른 유형처럼 칩 Default — 칸 Hover는 칸 배경으로만(2026-11-03) | 인스턴스 상태(AQ) | Figma 정의 정책 | table_value_editable 693:7163 |

### Tabs

문서: `components-tabs-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TABS-01 | B | 간격 없이 나란히(line은 밑줄 연결) | 목록 레이아웃 없음 | 탭 사이 간격 없음 | Rules 08 | Figma 문서화 정책 | Rules 08 |
| TABS-02 | B | 방향키 이동 = 즉시 선택, manual 옵션 | 활성화 방식 없음 | 자동 선택(내용이 무거우면 manual) | Rules 04 | Figma 문서화 정책 | Rules 04 |
| TABS-03 | A | 포커스: 브라우저 기본 링 | Focus 상태 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 | Figma 컴포넌트 속성 `Focus`(boolean) + 숨김 "Focus ring" 레이어 | Figma 정의 정책 | tab_filled 91:5000 · tab_line 91:5241 · Rules 02 |
| TABS-04 | C | 패널 스타일 없음 | 패널 없음 | 개발 구현 | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| TABS-05 | A | 탭 패널 포커스: 브라우저 기본 링 | 패널 정의 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 | Rules 02(Figma 컴포넌트 속성 없음 — 규칙이 기준) | Figma 문서화 정책 | Rules 02 |

### Textarea

문서: `components-textarea-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TEXT-01 | B | 높이 100px 고정, 내부 스크롤, 크기 조절 없음 | — | 고정 높이 + 내부 스크롤 | Rules 08 | Figma 문서화 정책 | Rules 08 |
| TEXT-02 | B | 카운터 = 실제 길이, maxLength 강제 | 예시 값 | 카운터는 실제 길이 / 최대 길이 | Rules 04 | Figma 문서화 정책 | Rules 04 |
| TEXT-03 | A | Semantic 직접 · input 토큰 | — | `textarea/outline/counter/completed` · `error` | 바인딩(AC) | Figma 정의 정책 | textarea |
| TEXT-04 | A | 비활성 카운터 brand 색 | — | `counter/disabled`(text/disabled) | 바인딩(AD, F113) | Figma 정의 정책 | textarea |

### Toast

문서: `components-toast-usage--docs` · Figma 주석: toast 91:5927

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TOAS-01 | B | 화면 아래 가운데(p-5), 사이 m-2 | 위치 없음(F44) | 2026-10-28 개정: 아래 오른쪽(오른쪽 · 아래 p-5), 사이 m-2, 최신이 아래에 붙고 위로 쌓임, 최대 3개 — 4번째가 오면 가장 오래된 것이 밀려 사라짐 | Rules 06 "토스트" | Figma 문서화 정책 | Rules 06 1100:5061 |
| TOAS-02 | B | 기본 5초, null이면 유지, Hover · 포커스 중 정지 | 지속 시간 없음 | 2026-10-28 개정: 모든 종류 5초(더 짧게 정할 수 없음), `timeout: null`이면 닫을 때까지, Hover · 포커스 중 정지 | Rules 06 "토스트" | Figma 문서화 정책 | Rules 06 1100:5061 |
| TOAS-03 | B | 같은 문구를 다시 보내면 겹쳐 쌓임 | 중복 규칙 없음 | 같은 문구 · 상태는 겹치지 않고 다시 표시(보이는 토스트를 닫고 새로 표시) | Rules 06 · Toast 주석 | Figma 문서화 정책 | Rules 06 |
| TOAS-04 | B | 긴 메시지 한 줄 말줄임 | 높이 36px 고정 | 한 줄, 넘치면 말줄임 | Rules 08 | Figma 문서화 정책 | Rules 08 |
| TOAS-05 | C | react-aria UNSTABLE Toast를 감쌈 | — | 개발 구현 | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| TOAS-06 | A | 닫기 아이콘 포커스: 브라우저 기본 링 | Focus 상태 없음 | 포커스 링: 2px `colors/border/focus`(brand/700), 바깥 2px 간격, 모서리는 컴포넌트 모서리 + 4px. `:focus-visible`(키보드)일 때만 | Rules 02(Figma 컴포넌트 속성 없음 — 규칙이 기준) | Figma 문서화 정책 | Rules 02 |
| TOAS-07 | A | — | 남은 시간 표시 | 진행 표시줄 없음(Figma에 없음) | Figma 그대로 | Figma 정의 정책 | toast 91:5927 |
| TOAS-08 | B | — | 주의 사용 기준 | 잠깐(5초) 알림, 남겨야 하면 Alert | Rules 06 "주의" | Figma 문서화 정책 | Rules 06 1656:7954 |
| TOAS-09 | C | 표시 규칙 스토리가 빈 화면 | — | 버튼 + 개수 표시로 다시 만듦(스토리) | — | 개발 구현 세부 사항 | — |
| TOAS-10 | B | 즉시 쌓임 | — | 새 토스트가 아래에서 올라와 위로 밀림, 4번째가 오면 가장 오래된 것이 밀려 사라짐(0.5초) | Rules 09 "토스트 쌓임" · 사용 예시 | Figma 문서화 정책 | Rules 09 1713:8145 |
| TOAS-11 | A | `Alert Text` · `Show Icon` 속성이 어떤 레이어에도 연결되지 않음, 글자 레이어 이름이 "File name" · "File metadata" | — | 제목 글자 → `Alert Text`, 상태 아이콘 표시 → `Show Icon` 연결(코드 `showIcon` 그대로), 레이어 `Content` · `Title` · `Description`; 토큰 `succeess` → `success`(2026-11-03) | 컴포넌트 속성 · 레이어 · 변수 이름(AQ) | Figma 정의 정책 | toast 91:5927 |

### Tooltip

문서: `components-tooltip-usage--docs` · Figma 주석: tooltip 149:1111

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TOOL-01 | B | 트리거와 10px(화살표 8px + 2px, 2026-10-29 개정) | 거리 없음 | 화살표 끝이 트리거에서 2px(화살표 포함 10px) | Rules 05 | Figma 문서화 정책 | Rules 05 |
| TOOL-02 | B | 지연: 마우스 1.5초, 포커스 즉시 | 지연 없음 | 마우스 0.5초, 키보드 포커스 즉시, Esc로 닫힘 | Rules 05 | Figma 문서화 정책 | Rules 05 |
| TOOL-03 | C | 그림자는 말풍선에만(화살표 생략) | Figma는 화살표에도 그림자(F47) | 개발 구현(CSS 한계) | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| TOOL-04 | C | 트리거는 ref · props 전달 요소 | — | 개발 구현 | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| TOOL-05 | B | 즉시 나타남 · 사라짐 | 모션 없음 | 2026-11-02 사용자 요청(shadcn/ui Base Tooltip): 나타남 150ms · 사라짐 100ms 페이드 + 0.95 크기, 트리거 쪽 기준점, 연속 이동은 즉시 교체, 움직임 줄이기면 즉시 | Rules 09 "툴팁 나타남·사라짐" 행(2026-11-03 추가, AN → AQ) | Figma 문서화 정책 | Rules 09 1807:8754 |

### SearchField

문서: `components-searchfield-usage--docs`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SEAR-01 | B | 지우기 버튼: Focus · Error에서 보임(Tab 제외), Enter → onSearch | 조작 규칙 없음 | Input과 같은 지우기 규칙, Enter로 검색 | Rules 04 | Figma 문서화 정책 | Rules 04 |
| SEAR-02 | A | Solid Error는 테두리 없음 — 오류 표현 없음(E8) | Figma Solid Error 변형에 오류 표시 없음 | Outline Error처럼 2px 안쪽 오류 테두리 | Figma 새 변수 colors/search-field/solid/border/error · Solid Error 3변형 테두리 | Figma 정의 정책 | VariableID:1158:7281 · 439:10252 · 439:10295 · 439:10338 · Rules 02 |
| SEAR-03 | A | — | 미사용 토큰 | helper 4 · value/default 2 삭제 | 변수(AC) | Figma 정의 정책 | search-field |
| SEAR-04 | A | `label/*` = 입력 글자 | — | `placeholder/*` · `value/*`(다른 필드와 같은 구조) | 변수 이름(AD, F112) | Figma 정의 정책 | search-field |

### 공통

문서: `모든 Usage 문서 · foundations-focus`

| ID | 분류 | 이전 | Figma에 없던 것 | 결정 | Figma 반영 | 상태 | ID · 장 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| COMM-01 | C | value / defaultValue / onChange — 제어 · 비제어 모두 지원 | — | 개발 구현(모든 상태 컴포넌트 공통) | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| COMM-02 | C | 오버레이(Select · Tooltip · Dialog · Dropdown)는 <body> 포털, z-index 100000, 스크롤 · 크기 변경 따라감 | — | 개발 구현 | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| COMM-03 | B | 오버레이 닫힘 후 포커스가 트리거로 돌아감(react-aria) | 포커스 복귀 규칙 없음 | 모든 오버레이는 닫히면 연 요소로 포커스 복귀 | Rules 05 | Figma 문서화 정책 | Rules 05 |
| COMM-04 | B | Disabled는 포커스 · 클릭 불가(네이티브 disabled) | — | Disabled는 Tab 순서에서 빠짐, 대비 기준 예외(text/inactive) | Rules 02 | Figma 문서화 정책 | Rules 02 |
| COMM-05 | B | 입력 오류는 사용처가 error · message로 지정 | 검증 시점 없음 | 검증은 입력을 마친 뒤(blur) 또는 제출 시, 입력 중에는 오류만 해제. 오류 문구는 aria-describedby로 연결 | Rules 04 | Figma 문서화 정책 | Rules 04 |
| COMM-06 | B | 목록 · 메뉴 글자 입력으로 항목 찾기(typeahead) | — | Select · Dropdown은 글자 입력으로 항목 이동 | Rules 04 | Figma 문서화 정책 | Rules 04 |
| COMM-07 | B | 애니메이션 · prefers-reduced-motion | 모션 토큰 없음 | 상태 전환은 즉시(Rules 09 첫 행). Rules 09에 행이 있는 움직임(Segmented · Stepper · 드롭다운 · 펼침·닫힘 · Accordion · 내비게이션 · Switch · 툴팁 · 반복 · 토스트 · 차트)은 그 행대로, 움직임 줄이기면 즉시(반복 모션은 느리게). 시간 · 곡선은 참고 링크 값을 컴포넌트 CSS에(Figma에 움직임 변수 없음 — F115) | Rules 09 | Figma 문서화 정책 | Rules 09 1674:8110 |
| COMM-08 | C | calc-size() 미지원 엔진 fallback(1px 미만) | — | 개발 구현 | Rules 10 | 개발 구현 세부 사항 | Rules 10 |
| COMM-09 | B | 아이콘은 항상 aria-hidden — aria-label을 줘도 이름이 가려짐 | — | 장식 아이콘은 aria-hidden, 의미 있는 아이콘은 aria-label → role="img" | Rules 03 이름과 설명 행 | Figma 문서화 정책 | Rules 03 |
| COMM-10 | B | 같은 화면의 여러 nav(Breadcrumb · Pagination) 이름이 같음(axe landmark-unique) | — | 같은 종류의 랜드마크가 여럿이면 aria-label로 서로 다른 이름 | Rules 03 이름과 설명 행 | Figma 문서화 정책 | Rules 03 |

## Figma 반영 대기

- **TABL-02** Table: Textarea 유형 한 줄 Input — Figma 안에서 읽기(두 줄 + 말줄임)와 편집(한 줄 Input) 모양이 다릅니다(F58). 편집 컨트롤을 바꾸는 디자인 결정이라 보류합니다(v1.0-candidate V-14).

SEGM-03(효과 스타일은 2026-10-20에 이미 등록 — 기록 누락)과 SWIT-02 · TOOL-05 · NAVI-08(Rules 09 행)은 2026-11-03 전체 QA에서 반영했습니다([figma-fix-requests AQ절](./figma-fix-requests.md)).
같은 날 `docs/components`에만 있던 ID 50개와 새 ID 10개를 각 컴포넌트 표에 더했습니다([QA 기록](./qa/full-system-audit-2026-11-03.md)).
