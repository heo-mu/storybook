# 전체 시스템 QA 기록 — 2026-11-03

Figma · Storybook · Docs · 코드를 한 번에 감사하고, 확인된 문제를 실제로 고친 기록입니다. 이 문서 하나로 무엇을 찾았고 무엇을 바꿨는지,
무엇을 왜 그대로 두었는지 확인할 수 있습니다. 시작 시점: `main` = `8446ffb`(배포 사이트와 같음), Figma 체크섬 8그룹 = 로컬 스냅샷.

## 1. 요약

| 항목 | 결과 |
| --- | --- |
| 점검 범위 | **Figma** 페이지 0:1 노드 16,584개(컴포넌트 세트 72 · 단독 컴포넌트 11, Rules 02–09장, 사용 예시 · 대시보드 · History 섹션), legacy 페이지 2,927개, 변수 1,506개(Primitive 622 · Theme 44 · Semantic 69 · Component 771) · 텍스트 스타일 46 · 효과 스타일 6. **Storybook** 스토리 464 · 문서 84쪽(시작 463 · 83). **Docs** `docs/*.md` 21 · `docs/components` 37 · 사용 문서 MDX 39. **코드** 리스너 · 관찰자 · 타이머 정리, 다른 세션의 미커밋 변경 24건 |
| 발견한 문제 | **39건** — A 실제 미해결 4 · B 해결됐는데 기록이 남음 5 · C 중복 · 오래된 정책 3 · D 디자인 ↔ 구현 불일치 6 · E 있는데 동작하지 않음 3 · F 접근성 · 사용성 5 · G 구조 · 유지보수 13 |
| 실제로 고친 문제 | **33건**(Figma 17 · Storybook · 코드 9 · 문서 7) |
| 이미 해결된 항목(기록만 정리) | **14건** |
| 보류 | **6건** — 디자인 결정 4 · 사용자 결정 1 · 다른 세션 미완료 1 — 그 밖에 자동화로 확인할 수 없는 실기기 · 화면 낭독기는 6절 |
| 문서 ↔ 구현 불일치 | **82건** — 모두 고침(정책 ID 누락 50 · code-policy-audit 오래된 행 10 · 없어진 Rules 10장 표기 1 · figma-fix-requests 상태 13 · 컴포넌트 문서 2 · v1.0 후보 1 · 진행 기록 · 분류 문서 · accessibility 제목 3 · CLAUDE.md 2) |
| Figma ↔ Storybook 정합성 | Figma 정합성 **108/108**(36개 컴포넌트 × 3 엔진, 수동 검토 3 그대로) · Button **400/400 × 3** · 참조 이미지 2개 재내보내기(바뀐 픽셀이 의도한 상자 안에만) · 체크섬 8그룹 일치 |
| 접근성 | axe 위반 23 → **18**(남은 18 = 사용자가 정한 Button Secondary / Solid Hover · Pressed 색, 6절 H5) · 문서 페이지 키보드 · 포인터 막힘 3쪽 → 0 · Storybook MCP a11y 8 스토리 통과 |
| 최종 배포 | GitHub `main` Push · Vercel 자동 배포(기존 프로젝트) — 결과와 배포 사이트 확인은 7절 "배포 후 확인". npm 배포 · v1.0 릴리스 없음 |

분류 기준: **A** 실제 미해결 문제 · **B** 이미 해결됐지만 기록이 남은 문제 · **C** 중복되거나 오래된 정책 · **D** 디자인과 구현이 다른 문제 ·
**E** 기능은 있지만 동작하지 않는 문제 · **F** 접근성 · 사용성 문제 · **G** 구조적 유지보수 문제. 한 문제가 여러 분류에 걸치면 주 분류 하나로 셉니다.

## 2. 판단 기준

브리프의 우선순위(최신 사용자 확정 요구 → Figma 확정 디자인 · 속성 → Rules → Storybook 동작 · Public API → 기록 → 토큰 원칙 → 접근성 관례)를 따랐습니다.

- **사용자가 정한 것은 그대로**: Button Secondary / Solid Hover · Pressed를 한 단계씩 밝게(2026-10-30 결정, 대비 3.51 · 2.46:1 기록), Accordion 직각, 움직임 참고 링크.
- **Rules와 예시가 다르면 Rules**: dropdown-menu 사용 예시의 8px → Rules 05의 4px(Select · Date Picker와 같음).
- **Rules끼리 다르면 최신 + 실제 컴포넌트**: 05장 "하위 메뉴를 두지 않음" → 09장 · `dropdown-menu-sub` · 사용 예시(2026-10-29 이후)대로.
- **같은 값의 외부 변수 · 스타일 없는 효과 → 로컬**: 값이 같은지 먼저 확인하고, 다르면 바꾸지 않음(오류 0).
- **이름 오류는 고치되 ID 유지**: 변수 이름 변경은 바인딩이 따라가고, CSS 변수 이름 변화는 배포 전 원칙(별칭 없음)대로 [breaking-changes.md](../breaking-changes.md)에 기록.
- **삭제는 참조 0일 때만**: 노드 · 별칭 · 스타일을 두 페이지에서 확인(`colors/gray 2`), 연결 레이어가 없는 속성(file-uploader `Show Button`, data-state 글자 10개).
- **새 정책을 만들지 않음**: 움직임 변수(F115) · Table 안내 글자 토큰(A-3)은 만들지 않음. 휴대폰 너비 줄바꿈(DFBR-08)은 Rules 08 "좁은 화면"의 범위 안에서 카드 밖으로 넘치는 결함만 고침.
- **테스트 기준은 낮추지 않음**: 시간 고정 대기를 조건 대기로 바꾼 것 외에 허용치 · 예외 목록 변화 없음.

## 3. 변경 히스토리

| # | 영역 | 분류 | 발견한 문제 | 수정 | 판단 근거 | Figma | Storybook · 코드 | 검증 | 커밋 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Input · password_field | D | 눈 아이콘 21개가 외부 라이브러리 `colors/icon/secondary`에 묶여 Figma의 비활성 · 읽기 전용 눈이 진한 색(F117 · AH) | 상태별 로컬 `colors/input/outline/icon/*`로 재연결, 참조 이미지 재내보내기 | 이전 바인딩 · 같은 세트의 다른 아이콘이 상태 토큰, 코드는 원래 상태 색 | ✓ | 참조 이미지(바뀐 794픽셀 모두 그 눈 상자 안) | 정합성 input 45/45 × 3 | `247c75f` |
| 2 | DropdownMenu | G | 메뉴 · 하위 메뉴 테두리 두께와 구분선 세로 여백이 외부 `border-width` · `py-1`(F97) | 같은 값의 로컬 `border-width/border` · `spacing/padding/p-1`(24곳) | 값이 같은지 먼저 확인(다르면 바꾸지 않음 — 0건) | ✓ | — | dropdown-menu 8/8 × 3 | Figma |
| 3 | DashboardFilterBar | G | 달력 아이콘이 외부 `colors/icon/secondary` | 같은 이름 · 값의 로컬 변수 | 위와 같음 | ✓ | — | 1/1 × 3 | Figma |
| 4 | Card | G | 그림자가 `elevation-3`과 같은 값인데 효과 스타일 연결 없음 | 효과 스타일 `elevation-3` | 같은 값의 기존 스타일 재사용 | ✓ | — | card 3/3 × 3 | Figma |
| 5 | Toast | E | `Alert Text` · `Show Icon` 속성이 어떤 레이어에도 연결되지 않아 인스턴스에서 제목 · 아이콘을 바꿀 수 없음, 레이어 이름이 file-uploader-item에서 복사된 "File …" | 제목 → `Alert Text`, 아이콘 표시 → `Show Icon`(인스턴스 글자 그대로 — 전후 비교), 레이어 `Content` · `Title` · `Description` | 코드 `message` · `showIcon`과 같은 쓰임 | ✓ | 기하 · 검증 경로 | toast 4/4 × 3 | `247c75f` |
| 6 | DataState | E | 상태별 제목 · 설명 속성 10개가 연결 레이어 없음 | 속성 삭제, 각 상태의 empty-state 인스턴스 노출 | 중첩 인스턴스 안 글자에는 속성을 걸 수 없음(Plugin API 오류로 확인) | ✓ | — | data-state 6/6 × 3 | Figma |
| 7 | FileUploader | E | `Show Button` 속성의 연결 레이어 없음(F26) | 속성 삭제 | 세트에 버튼 레이어가 없음(영역 자체가 버튼), 코드에도 없음 | ✓ | 문서 | file-uploader 11/11 × 3 | Figma |
| 8 | Rules 05 · 09 | C | 05장 "메뉴 안에 하위 메뉴를 두지 않습니다" ↔ 09장 `dropdown-menu-sub` · 사용 예시 217:6478 · 코드(F114) | 05장 행: 한 단계까지 · 여는 항목 옆 · 오른쪽 화살표 두 뜻 | 최신 규칙(09장, 2026-10-29)과 실제 컴포넌트 | ✓ | 사용 문서 "하위 메뉴 안에 다시 두지 않음" | Rules 다른 행 글자 지문 같음 | `247c75f` |
| 9 | Rules 09 | C | 첫 행 "상태 변화는 애니메이션 없이 바로" ↔ 같은 장의 움직임 행(F103 ①) | "아래 행에 따로 정한 움직임은 예외입니다." 추가 | 기존 문장 유지 | ✓ | — | 위와 같음 | Figma |
| 10 | Rules 09 | D | 내비게이션 · Switch · 툴팁 움직임 행 없음 — 코드는 2026-11-02부터 움직임(요청 AO · AM · AN) | 3개 행 추가(요청 문구 그대로, 기존 행 복제) | 사용자 요청으로 구현된 동작을 Figma 정책으로 | ✓ | 문서 "반영 대기" 해소 | 스크린샷 · 겹침 0 | Figma |
| 11 | Rules 09 | G | 프레임 이름 "Chapter 10"(제목 09), 행 프레임 기본 이름(F115) | "Chapter 09" · 정책 이름 | — | ✓ | — | — | Figma |
| 12 | Figma 페이지 구성 | G | Rules가 길어져 Component 섹션 아래로 162px 넘침 | 섹션 높이 4448 → 4710, 아래 두 섹션 300px 이동 | 겹침 0 확인 | ✓ | — | — | Figma |
| 13 | DropdownMenu 사용 예시 | D | 트리거 ↔ 메뉴 8px — Rules 05는 4px(AP) | 메뉴 · 하위 메뉴를 4px 위로 | 규칙이 예시보다 우선, Select · Date Picker도 4px | ✓ | — | Gallery 196 · 222 그대로 | Figma |
| 14 | Table 편집 칸 | D | Filter · Hover · Empty 칩만 State=Hover(F82 · V-7) | 칩 Default, 검증 스토리의 강제 Hover 삭제 | 다른 유형의 Hover · Empty와 같은 규칙 | ✓ | 스토리 · 참조 이미지(바뀐 899픽셀 모두 그 칩 안) | table_value_editable 49/52 × 3(수동 검토 3 그대로) | `247c75f` |
| 15 | 토큰 이름 | G | `colors/select/outline/outline/*` 39(분류 단계 중복), toast `succeess` 2, stepper `dafault` 1(F120 · F45 · F38) | 이름 수정(ID 유지) → 스냅샷 · 토큰 재생성 · CSS 45곳 | 다른 필드와 같은 구조, 오타 | ✓ | CSS 변수 이름 변경(호환성 변경 기록) | 체크섬 8그룹 일치, select · toast · stepper × 3 | `523f9ed` |
| 16 | 변형 이름 | G | chart State `Hilighted` 9, button_text Type `SecondarySecondary` 32(F121 · A1) | `Highlighted` · `Secondary` | 디자인 이름만 — 코드 API 무관 | ✓ | 검증 설정 · 스토리 이름 | chart 37/37 · Button 400/400 × 3 | `523f9ed` |
| 17 | Primitive | G | `colors/gray 2` — `colors/gray`와 같은 값, 이름에 공백, 참조 0(B2) | 삭제 | 두 페이지 노드 · 별칭 · 스타일 참조 0 | ✓ | `--colors-gray-2` 삭제 | 체크섬 일치 | `523f9ed` |
| 18 | DropdownMenu · DatePicker 문서 페이지 | F | 처음부터 열린 스토리 5개의 모달 덮개 · 스크롤 잠금이 문서 페이지 3쪽 전체를 덮음 — 첫 클릭이 메뉴 닫기, 스크롤 불가 | 문서 페이지에서만 iframe(`docs.story.inline: false`) | 스토리 · 동작 그대로, 덮개만 틀 안으로 | — | 스토리 parameters | 배포본(이전) `docs-blocked` 2 실패 → 0 | `3b734d8` |
| 19 | 렌더 감사 도구 | G | iframe Canvas는 안이 비어도 통과로 셀 수 있고, 문서 페이지 덮개를 잡지 못함 | iframe 안 내용까지 확인, `docs-blocked` 검사 | 회귀 검사 | — | render-audit.mjs | 이전 결함에서 실패하는 것 확인 | `3b734d8` · `c8e512b` |
| 20 | 입력 필드 6종 | F | 비활성 칸 도움말(#c9ced6)이 axe 색 대비 위반 5건 — 비활성 컨트롤의 일부(WCAG 1.4.3 예외)인데 표시 없음 | 메시지에 `aria-disabled`(다른 세션의 완성된 작업을 그대로 커밋) | 라벨과 같은 예외 | — | FieldMessage · 7개 필드 · 스토리 검사 | axe 23 → 18 | `178efbb` |
| 21 | Pagination | D | Figma 현재 번호 레이어 이름 `Page Number`, 검증 설정은 `Number` | 기하 · 검증 설정(다른 세션 작업) | Figma 재조회 | — | 검증 설정 | pagination 75/75 × 3 | `178efbb` |
| 22 | DashboardFilterBar | D | 넓은 화면에서도 조회 기간 SegmentedControl이 132px로 눌려 "최근 …"(Figma 220px) | 묶음 안 컨트롤은 줄어들지 않고, 너비 없는 필드는 내용 너비 | 원인: 필드 `width: 100%`가 내용 너비 묶음에서 순환 백분율 | — | CSS · 검사 play | play가 이전 CSS에서 실패, 1/1 × 3 | `ba0f216` · `89b557a` |
| 23 | DashboardFilterBar | F | 휴대폰 너비(375px)에서 조회 기간 묶음이 카드 밖으로 넘침 | 묶음 하나보다 좁으면 묶음 안에서도 다음 줄 | Rules 08 "좁은 화면"(묶음 단위 줄바꿈 먼저) 안에서 | — | CSS · "휴대폰 너비" 스토리 | 320 · 375 · 768 · 1400px 넘침 0 | `ba0f216` |
| 24 | Progress · Table 스토리 | F | 휴대폰 너비에서 스토리 틀(430 · 480px 고정)이 화면 밖으로 | 틀에 `max-width: 100%` | 컴포넌트는 부모 너비를 따름 | — | 스토리 | 375px 넘침 0 | `ba0f216` |
| 25 | Loading | G | 컴포넌트 중 Loading만 사용 문서(Usage)가 없음 | 사용 시점 · 예시 · 움직임 · 접근성 · Props | 다른 사용 문서와 같은 구조 | — | Loading.mdx | 렌더 감사 실패 0 | `520622a` |
| 26 | 상호작용 감사 | G | Select · Dropdown 닫힘 뒤 고정 150ms 대기 — 부하 때 포커스 복귀를 몇 ms 차이로 놓쳐 실패 | 닫힘 · 포커스 도착을 조건으로 대기(≤ 2초) | 검사 내용 그대로(기준 완화 아님) | — | interaction-audit.mjs | 45/45 × 3 | `b5b5414` |
| 27 | code-policy-audit | G | `docs/components`의 정책 ID 50개가 목록에 없음(각 문서는 "출처 · 상태는 code-policy-audit"라고 안내) | 컴포넌트별 표에 50개 + 새 ID 10개, 합계를 표에서 다시 계산(168 → 228) | — | — | 문서 | 합계 = 행 수 | 이 기록과 같은 커밋 |
| 28 | code-policy-audit | B | 오래된 행 10개 — ACCO-04 "즉시", SKEL-01 "정적", COMM-07, TOAS-01 "아래 가운데", TOAS-02 "오류는 유지", DROP-05 "미지원", SEGM-03 · SWIT-02 · TOOL-05 · NAVI-08 "반영 대기" | 현재 구현 · Rules대로(반영 대기 5 → 1) | — | — | 문서 | — | 이 기록과 같은 커밋 |
| 29 | code-policy-audit | C | 없어진 Rules 10장 · 옛 노드를 가리킴 | 장 위치 표를 현재 노드로, "Rules 10" = 코드 문서에만 있는 항목으로 명시 | 디자이너가 10장을 뺀 결정(2026-10-28)을 되돌리지 않음 | — | 문서 | — | 이 기록과 같은 커밋 |
| 30 | figma-fix-requests | B | R5 "미확인" · R7 "결정 대기" · N1 · N6 · N7 · A-3 · D3 · D4 · AM – AP · AH의 상태가 오래됨, 플레이스홀더 절 중복 | 상태 줄 · AQ절(이번 Figma 변경 17건 · 노드 ID), 중복 표 정리 | — | — | 문서 | — | 이 기록과 같은 커밋 |
| 31 | figma-issues | B | A1 · B2 · F26 · F38 · F45 · F82 · F83 · F97 · F114 – F117이 열린 상태 | 결과 기록, 새 항목 F118 – F123 | — | — | 문서 | — | 이 기록과 같은 커밋 |
| 32 | 컴포넌트 문서 · v1.0 후보 · 진행 기록 | B | Navigation · Tooltip · Switch · SegmentedControl "Figma 반영 대기", DropdownMenu "하위 메뉴 미지원" 메모, v1.0 V-2(버튼 옆 Loading) · V-7, 진행 기록 "미해결: 색 대비", 2026-10-19 분류 · 보고서 | 현재 상태로, 새 ID(INPU-07 · TABL-16 · TOAS-11 · DSTA-07 · DROP-08 · DROP-09 · DPCK-11 · BUTT-06 · DFBR-08), 안내 줄 | — | — | 문서 | — | 이 기록과 같은 커밋 |
| 33 | CLAUDE.md | B | 페이지 이름 `Ver 0.4`(현재 0.5), 보조 컴포넌트 32(현재 33) | 고침, QA 기록 · `docs-blocked` 안내 | — | — | 문서 | — | 이 기록과 같은 커밋 |

## 4. 이미 해결됐는데 기록이 남아 있던 항목 (B)

문서에는 열린 문제로 남아 있었지만 실제로는 이미 해결된 항목입니다. 다시 작업하지 않고 기록만 고쳤습니다(위 28 · 30 – 33).

| # | 항목 | 실제 상태(확인 방법) |
| --- | --- | --- |
| 1 | SEGM-03 Segmented 선택 그림자 "효과 스타일 등록 대기" | 효과 스타일 `elevation-segmented-selected`가 2026-10-20부터 있고 코드가 사용(Figma 스타일 목록 · CSS) |
| 2 | N1 · F77 차트 가로 막대 hover 비교 막대 `simple/history` | 5노드 모두 `chart/bar/compare` 그라데이션(노드 바인딩 재조회) |
| 3 | R7 · D3 표 편집 칸 다중 선택 목록 "결정 대기" | `FilterChipSelect`로 결정 · 구현(2026-10-19 밤, F76) |
| 4 | R5 Accordion 위치 "미확인" 제목 | 처리 현황 표는 완료(재등록 후 1035:15685 y 40 → 20) — 제목만 남음 |
| 5 | D4 · F65-b 간단 차트 지난 기간 색 | F78 `colors/chart/bar/history`(2026-10-19) |
| 6 | 플레이스홀더 토큰 오용 R9 – R11 "변경하지 않음" 절 | 바로 위 절(X절, 2026-10-27 저녁)에서 적용 완료 — 같은 표의 적용 전 사본 |
| 7 | v1.0 V-2 "처리 중 = Disabled 버튼 + 옆에 Loading" | Rules 06 "처리 중"(2026-10-28 개정) = 버튼 안 Loading, `Button loading`(BUTT-03) |
| 8 | TOAS-01 · 02 "아래 가운데 · 오류는 닫을 때까지" | Rules 06(2026-10-28 개정) 아래 오른쪽 · 모든 종류 5초, 코드 `MAX_VISIBLE_TOASTS` 3 · `TOAST_TIMEOUT` 5000 |
| 9 | ACCO-04 Accordion "즉시 전환" | 2026-11-02부터 200ms 높이 움직임(Rules 09 1762:8739) |
| 10 | SKEL-01 Skeleton "정적" | 2026-10-28부터 맥동(Rules 09 "반복 움직임") |
| 11 | DROP-05 하위 메뉴 "미지원" | 2026-10-29부터 `DropdownMenuSub` |
| 12 | 진행 기록 "미해결: 토큰 일부가 AA 미만" | 2026-10-27 · 28에 해결 — 남은 것은 사용자가 정한 Secondary / Solid 색뿐 |
| 13 | accessibility.md "미해결 색 대비 위반" 제목 | 본문 첫 줄이 "해결(2026-10-27 저녁)" |
| 14 | CLAUDE.md 페이지 `Ver 0.4` | Figma 페이지 이름 `🔵 Ver 0.5`(2026-10-27부터, F96) |

## 5. 바꾸지 않은 것 — 판단과 이유

| 항목 | 이유 |
| --- | --- |
| legacy 페이지 원격 변수(F83 · N7) | 이전 라이브러리의 화면 시안. 원격 바인딩 약 1,700곳이라 반지름 19개만 바꾸는 이득이 없고, 원격 값을 읽을 수 없어 같은 값인지 확인할 수 없음 |
| 노드에 묶이지 않은 Component 변수 36개 | 모두 코드 CSS가 상태 색으로 씀(입력 칸 value/disabled · 아이콘 상태, 표 아이콘 hover, Segmented 선택 hover 등). 차트 시리즈 3 · 4는 확장용(CHAR-09). Semantic `status/*` 8 · Theme 17은 팔레트 |
| 숨은 Focus ring 프레임의 반지름(바인딩 없음) | 컴포넌트 반지름 + 간격에서 나온 값, 화면에 보이지 않음 — 코드가 같은 규칙으로 계산 |
| chart-tooltip 그림자 | elevation-3 + 배경 흐림 두 효과 — 둘을 함께 담는 스타일 없음(스타일을 새로 만들지 않음) |
| 소수점 좌표 | 홀수 크기를 짝수 상자 가운데 둔 값(badge 점 3px · dialog 머리글 · empty-state 버튼 · file-uploader 아이콘), 표 칸(F56) · 차트 데이터 · 슬라이더 채움(F16) — 코드도 같은 가운데 정렬 |
| 빠진 변형 조합(14세트) | 모두 의도된 조합 — 비활성 링크의 Visited, 비활성 메시지의 상태 종류, 현재 경로의 Hover, 비활성 Accordion 펼침 등 |
| 예시 프레임의 `#ffffff` · `#dddddd` | 문서용 바탕 · 머리줄(디자인 시스템 컴포넌트가 아님) |
| `Vector 1`(476:18668) · 상단 메모 프레임(1277:7982) | 1 × 32px 선의 의도를 알 수 없음 · 디자이너 메모("예시 하나는 남겨놔 주세요") |
| F116 badge 숫자 세로 0.4–0.5px | Figma와 코드 모두 Pretendard 기준선 때문에 같음, CSS `text-box`는 Chromium에서 효과 없음 — 텍스트 스타일을 바꾸지 않음 |
| 문서 페이지의 휴대폰 너비 가로 넘침(40쪽) | Storybook 문서 블록(Props 표 · 코드)이 넘침 — 컴포넌트 요소가 넘치는 곳은 0 |
| Stepper 가로형 · Breadcrumb Full의 좁은 화면 | 컴포넌트가 정한 대안이 있음(세로형, Collapsed "…") — 사용 문서 그대로 |

## 6. 미해결 · 보류

실제로 해결하지 못했거나 일부러 두고 온 항목만 적습니다.

| # | 항목 | 분류 | 보류 이유 | 다음에 할 일 |
| --- | --- | --- | --- | --- |
| H1 | V-6 차트 점선(F85 — 범례 Dash Line · 간단 선 비교 선을 2026-10-19에 점선으로 복원) | A | 실선이 의도였는지 디자이너 확인이 필요 — 바꾸면 Figma · 코드 · Rules 03이 함께 바뀜 | 디자이너 결정 후 Figma → 코드 |
| H2 | V-12 Card 프레임 숨김(F61) — 공개 여부 | A | 공개 컴포넌트 여부는 디자인 소유자 결정 | 결정 후 Figma 표시 · 참조 이미지 |
| H3 | V-13 표 칸 정렬 규칙(Figma는 모두 가운데) | A | 긴 글 · 숫자 열 정렬은 새 규칙과 `TableColumn` 옵션이 필요 — 새 정책을 만들지 않음 | Rules 07에 정하면 구현 |
| H4 | V-14 · TABL-02 표 편집 칸 Textarea 유형(읽기는 두 줄, 편집은 한 줄 Input) | A | 편집 컨트롤을 바꾸는 디자인 결정 | 결정 후 Figma 변형 · 코드 |
| H5 | Button Secondary / Solid Hover · Pressed 흰 라벨 3.51 · 2.46:1 | F | 2026-10-30 사용자 결정(밝기 우선) — 접근성 관례만으로 되돌리지 않음(axe 18건) | 사용자가 바꾸기로 하면 Semantic `fill/secondary/strong/hover · pressed` |
| H6 | 다른 세션의 글자 색 정확 비교 도구(`scripts/verify-text-*.mjs` · `figma/text-fills*.json`) | G | `text-fills.json`이 F112(2026-10-29) 이전 추출 — 실행하면 검색 필드 옛 이름 · 링크 상태 색 등 오래된 값으로 실패(현재 Figma와 코드는 같음을 재조회로 확인) | 텍스트 레이어 채움을 다시 내보낸 뒤 그 세션에서 커밋 |

**자동으로 확인할 수 없는 것(범위 밖)**: 실제 화면 낭독기(NVDA · JAWS · VoiceOver) 읽기 순서, macOS · iOS Safari 실기기 · 터치, 200% 확대 · 고대비 전체, 수천 행 표 성능 — [v1.0-candidate.md](../v1.0-candidate.md) 9절.
npm 배포 · 버전 번호(R-1) · v1.0 정식 릴리스는 이번 작업에서 하지 않았습니다(지시).

## 7. 검증 결과

실제 종료 코드를 로그에서 회수했습니다(AGENTS.md 3-1). 시작 기준선은 배포 사이트(= `8446ffb`)에서 측정했습니다 — 렌더 546 · 실패 0, 상호작용 45/45, axe 위반 23.

| 검사 | 범위 | 결과 | 종료 코드 |
| --- | --- | --- | --- |
| Figma 체크섬 | 변수 · 스타일 8그룹 | 작업 전 · 후 모두 스냅샷과 일치(후: primColors 455 `0308b6f1` · compOthers 692 `b1993741`) | — |
| Figma 정합성 `verify:all` | 36개 컴포넌트 × Chromium · Firefox · WebKit | **108/108 통과** — 수동 검토 3(table_value_editable, 이전과 같음). 뒤에 붙은 글자 색 단계는 다른 세션의 미완료 도구로 실패(옛 추출 — 6절 H6), 현재 Figma와 코드는 재조회로 같음 확인 | 1(그 단계) |
| Button `verify:button` | 400 변형 × 3 엔진 | **400/400 × 3**(button_text 이름 변경 후) | 0 · 0 · 0 |
| 스토리 테스트 `npm test` | 90개 파일 | **464/464** | 0 |
| Storybook MCP `test-run`(a11y) | 바뀐 스토리 8 | 모두 통과 | — |
| axe `verify:a11y` | 464 스토리 | 위반 **18**(시작 23 — 비활성 칸 도움말 5건 해소, 남은 18 = 6절 H5 사용자 결정 색), 알려진 목록 추가 없음 | 1(그 18건) |
| 렌더 감사 `verify:render`(정적 빌드) | 548(스토리 464 · 문서 84) × 3 엔진 | **Chromium 0 · Firefox 0 · WebKit 0 실패**(¹) — 정보: 넓은 검증 매트릭스 14, Firefox 문서 iframe 알림 3쪽(`docs-iframe-load-notice`) | 0 · 0 · ¹ |
| 상호작용 감사 `verify:interaction`(정적 빌드) | 45개 흐름 × 3 엔진 | **45/45 × 3** | 0 · 0 · 0 |
| 반응형(375px) | 사용 스토리 · 문서 302 | 컴포넌트가 화면 밖으로 넘치는 곳: DashboardFilterBar · Progress · 표 키-값 스토리 → **0**(320 · 375 · 768 · 1400px). Stepper 가로형 · Breadcrumb Full은 정해진 대안(세로형 · Collapsed), 문서 블록 넘침은 Storybook 화면 | — |
| 문서 페이지 막힘(`docs-blocked`) | 84 문서 | 배포본(이전) 3쪽 → **0** | — |
| typecheck · lint · build · build-storybook | 격리 worktree(`89b557a`, 다른 세션 변경 없이) | 모두 통과, lint 경고 0, 토큰 재생성 차이 0 | 0 · 0 · 0 · 0 |
| 외부 React 소비자 | `npm pack` → 압축 해제 → ESM · CJS · 서버 렌더 · CSS 토큰 이름 · 타입 | **12/12** | 0 |
| 배포 사이트 | https://storybook-heo-mu.vercel.app | 아래 "배포 후 확인" | — |

(¹) WebKit 전체 실행 한 번에서 움직임 프레임 수를 세는 play 2개(Switch Interaction · DropdownMenu 하위 메뉴, 오늘 바꾸지 않은 동작)가 실패했고, 같은 정적 빌드에서
네 탭 · 한 탭 재실행이 모두 통과했습니다(바로 전 전체 실행도 통과). 동시 탭 부하로 프레임이 덜 그려진 경우로 기록합니다 — 기준은 바꾸지 않았습니다.

**검증 도구를 고친 것**(기준을 낮춘 것이 아님): 문서 페이지 iframe은 `loading="lazy"`라 화면에 가져와 확인, iframe 안 표시 여부는 그 문서의 스타일로, 문서 항목은 iframe 스토리가
다 그려질 때까지 기다리고 항목마다 `about:blank`로 비움(다른 페이지에서 늦게 온 메시지를 다음 스토리에 씌우지 않음), Firefox가 문서 iframe에서만 내는 페이지 로드 알림은 정보로 —
Chromium · WebKit · 스토리 화면에서는 없고, 겹침을 `load` 뒤에 열어도 같아 컴포넌트가 아닌 내장 미리보기에서 나옴을 확인. 상호작용 감사의 고정 150ms 대기 → 조건 대기.

### 배포 후 확인

배포 뒤 이 절을 채웁니다(다음 커밋).

## 8. 다른 세션의 미커밋 변경

시작할 때 다른 세션(2026-10-20 – 28 작업)의 미커밋 변경 24건이 있었습니다(마지막 수정 2026-10-28, 그 뒤 진행 없음).

- **커밋함(완성된 작업)**: 비활성 칸 메시지의 `aria-disabled`(`FieldMessage` `disabled` · 7개 필드 · 매트릭스 스토리 · `helperMessage` 검사)와 Pagination 현재 번호 레이어 이름 `Page Number`
  (Figma 재조회로 확인). axe 색 대비 위반 5건(비활성 칸 도움말 #c9ced6 — 비활성 컨트롤의 일부라 WCAG 1.4.3 예외)이 이 작업으로 0이 됩니다. 작업 트리 내용을 그대로 커밋했습니다(덮어쓰지 않음).
- **커밋하지 않음(미완료)**: 글자 색 정확 비교 도구(`scripts/verify-text-tokens.mjs` · `verify-text-colour-parity.mjs` · `figma/text-fills*.json` · `verify-all.mjs` · `verify-figma.mjs` 변경)와
  그 문서 변경 — `text-fills.json`이 F112(2026-10-29) 이전 추출이라 다시 내보내야 합니다. 공유 문서(CHANGELOG · CLAUDE.md · accessibility · browser-support · figma-issues · v1.0-candidate)는
  "HEAD + 이번 변경"만 커밋해 그 세션의 변경이 작업 트리에 그대로 남습니다.
