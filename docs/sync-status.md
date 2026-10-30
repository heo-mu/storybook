# Figma ↔ Storybook 동기화 상태 (컴포넌트별)

생성: 2026-10-20 03:23 UTC · 근거: Figma 실시간 속성 조회(`use_figma`), `node scripts/verify-figma.mjs` 보고서 3 엔진(가장 오래된 보고서 2026-10-20 02:38 UTC), 스토리 테스트 + a11y 리포터 실행, 개발 노트(docs/components)의 Figma 속성 대조.

| 열 | 기준 |
| --- | --- |
| Figma 정의 확인 | 검증 설정의 모든 Figma 세트가 원본에 있음 — 세트 · ID · 검증 변형 수 / 원본 변형 수 |
| Storybook 구현 확인 | 쇼케이스가 검증 대상 변형을 모두 렌더링(Chromium 보고서 rendered = expected) |
| 시각적 정합성 확인 | 변형별 DOM · 픽셀 · 글자 위치 검사 통과 수 — Chromium / Firefox / WebKit. "수동 검토"는 검증 설정에 이유와 함께 비교에서 뺀 변형(Table Textarea 두 줄 값, F58)으로, 통과로 세지 않음 |
| 인터랙션 검증 | 컴포넌트 스토리의 `play` 함수 수와 스토리 테스트 결과(실제 브라우저 Vitest) |
| 접근성 검증 | Storybook a11y(axe 기본 규칙) 경고가 있는 스토리 수 — 사이드바 삼각형과 같은 결과 |
| 문서 동기화 완료 | Storybook 사용 방법 문서가 있고, 모든 Figma 속성(변형 축 · Boolean · 글자 · 인스턴스)이 개발 노트의 Figma ↔ Props 대응에 있음 |

| 컴포넌트 | Figma 정의 확인 | Storybook 구현 확인 | 시각적 정합성 확인 (C / F / W) | 인터랙션 검증 | 접근성 검증 | 문서 동기화 완료 |
| --- | --- | --- | --- | --- | --- | --- |
| button (Button) | ✓ button_basic 54:2904 · 192/192 (2026-10-28 저녁 Secondary Solid Hover · Pressed brand/800 · 900, 2026-10-29 Tertiary Solid 배경 Component 토큰)<br>button_icon 67:2368 · 144/144<br>button_text 432:8395 · 16/16 | ✓ | ✓ 352/352 / 352/352 / 352/352 | ✓ play 8 · 스토리 24 | ✓ 경고 0 | ✓ |
| accordion (Accordion) | ✓ accordion-item 1035:15648 · 10/10 (2026-10-28 펼침 하단 구분선 · 트리거 모서리 4px 동기화, 저녁 sm Default Expanded 외톨이 그림자 제거 F102) | ✓ | ✓ 10/10 / 10/10 / 10/10 | ✓ play 2 · 스토리 7 | ✓ 경고 0 | ✓ |
| alert (Alert) | ✓ alert 179:6087 · 3/3 (2026-10-29 레이어 이름 정리) | ✓ | ✓ 3/3 / 3/3 / 3/3 | ✓ play 2 · 스토리 7 | ✓ 경고 0 | ✓ |
| badge (Badge) | ✓ badge_status 91:6152 · 84/84<br>badge_dot 95:2681 · 21/21<br>badge_count 95:2762 · 14/14 (2026-10-30 숫자 가운데 정렬) | ✓ | ✓ 119/119 / 119/119 / 119/119 | ✓ play 2 · 스토리 10 | ✓ 경고 0 | ✓ |
| breadcrumb (Breadcrumb) | ✓ breadcrumb-item 710:4794 · 8/8 (Role=Open 삭제, 2026-10-27)<br>breadcrumb 712:5106 · 6/6 (2026-10-29 메뉴 펼침 · 닫힘 모션) | ✓ | ✓ 14/14 / 14/14 / 14/14 | ✓ play 3 · 스토리 10 | ✓ 경고 0 | ✓ |
| card (Card) | ✓ card_header 218:7173 · 1/1<br>card_footer 218:7174 · 1/1<br>card 185:8050 (예시 프레임, 2026-10-28 Content placeholder → surface/container) | ✓ | ✓ 3/3 / 3/3 / 3/3 | ✓ play 1 · 스토리 4 | ✓ 경고 0 | ✓ |
| chart (Chart) | ✓ chart 698:4399 · 24/24<br>chart-legend-item 697:4514 · 3/3<br>chart-tooltip 693:9776 · 1/1 | ✓ | ✓ 28/28 / 28/28 / 28/28 | ✓ play 8 · 스토리 16 | ✓ 경고 0 | ✓ |
| checkbox (Checkbox) | ✓ checkbox 99:2389 · 36/36 | ✓ | ✓ 36/36 / 36/36 / 36/36 | ✓ play 4 · 스토리 13 | ✓ 경고 0 | ✓ |
| chip (Chip) | ✓ chip-multi 201:12711 · 24/24<br>chip-input 558:26017 · 12/12<br>chip-filter 558:25704 · 48/48 (2026-10-29 필터 목록 펼침 · 닫힘 모션) | ✓ | ✓ 84/84 / 84/84 / 84/84 | ✓ play 9 · 스토리 31 | ✓ 경고 0 | ✓ |
| dashboard-filter-bar (DashboardFilterBar) | ✓ dashboard-filter-bar 698:4163 · 1/1 (2026-10-28 스토리 기간 입력 DashboardFilterRange + DatePicker 136px ×2) | ✓ | ✓ 1/1 / 1/1 / 1/1 | ✓ play 1 · 스토리 4 | ✓ 경고 0 | ✓ |
| data-freshness (DataFreshness) | ✓ data-freshness 697:4543 · 3/3 | ✓ | ✓ 3/3 / 3/3 / 3/3 | ✓ play 1 · 스토리 5 | ✓ 경고 0 | ✓ |
| data-state (DataState) | ✓ data-state 698:4359 · 6/6 (2026-10-28 Loading 상하 12px 동기화 · 기하 재추출) | ✓ | ✓ 6/6 / 6/6 / 6/6 | ✓ play 2 · 스토리 8 | ✓ 경고 0 | ✓ |
| date-picker (DatePicker — Input · Inline, Calendar 호환) | ✓ date-picker_trigger 144:723 · 24/24 (2026-10-28 Open 3 추가, Input 복귀)<br>date-picker_message 144:888 · 3/3<br>date-picker_calendar 144:1644 · 1/1<br>date-picker_day 144:1033 · 7/7<br>date-picker_navigation 144:1328 · 8/8 (2026-10-29 펼침 · 닫힘 모션) | ✓ | ✓ 40/40 / 40/40 / 40/40 | ✓ play 7 · 스토리 26 | ✓ 경고 0 | ✓ |
| dialog (Dialog) | ✓ dialog 149:2838 · 1/1 | ✓ | ✓ 1/1 / 1/1 / 1/1 | ✓ play 1 · 스토리 5 | ✓ 경고 0 | ✓ |
| dropdown-menu (DropdownMenu) | ✓ dropdownmenu_item 179:4819 · 5/5<br>dropdownmenu_line 179:5082 · 1/1<br>dropdown-menu 1440:8454 · 1/1 · dropdown-menu-sub 1440:8455 · 1/1 (2026-10-27 추가) (2026-10-29 하위 메뉴 DropdownMenuSub) | ✓ | ✓ 8/8 / 8/8 / 8/8 | ✓ play 2 · 스토리 10 | ✓ 경고 0 | ✓ |
| empty-state (EmptyState) | ✓ empty-state 724:14963 · 1/1 (2026-10-28 기하 · 참조 재추출, 2026-10-29 아이콘 토큰 바인딩) | ✓ | ✓ 1/1 / 1/1 / 1/1 | ✓ play 2 · 스토리 7 | ✓ 경고 0 | ✓ |
| file-uploader (FileUploader · Loading) | ✓ file-uploader 651:3945 · 5/5<br>file-uploader-item 651:3999 · 4/4<br>loading 675:5644 · 2/2 | ✓ | ✓ 11/11 / 11/11 / 11/11 | ✓ play 2 · 스토리 18 | ✓ 경고 0 | ✓ |
| input (Input) | ✓ input 76:2945 · 21/21 · password_field 1440:8466 · 24/24 (2026-10-28) | ✓ | ✓ 45/45 / 45/45 / 45/45 — Firefox 비밀번호 마스킹 글자(U+25CF) 12건은 기록(knownDifferences) | ✓ play 6 · 스토리 18 | ✓ 경고 0 | ✓ |
| link (Link) | ✓ link 111:1509 · 21/21 (2026-10-28 Type 축) | ✓ | ✓ 21/21 / 21/21 / 21/21 | ✓ play 3 · 스토리 9 | ✓ 경고 0 | ✓ |
| metric-card (MetricCard) | ✓ metric-card 697:4487 · 1/1 | ✓ | ✓ 1/1 / 1/1 / 1/1 | ✓ play 1 · 스토리 5 | ✓ 경고 0 | ✓ |
| metric-trend (MetricTrend) | ✓ metric-trend 697:4482 · 12/12 | ✓ | ✓ 12/12 / 12/12 / 12/12 | ✓ play 1 · 스토리 6 | ✓ 경고 0 | ✓ |
| navigation (Navigation) | ✓ item_parent 180:5246 · 4/4<br>item_link 180:6174 · 4/4<br>item_child 180:6249 · 4/4 | ✓ | ✓ 12/12 / 12/12 / 12/12 | ✓ play 2 · 스토리 9 | ✓ 경고 0 | ✓ |
| pagination (Pagination) | ✓ pagination 132:871 · 3/3<br>pagination_item 132:520 · 24/24<br>pagination_control 132:604 · 48/48 | ✓ | ✓ 75/75 / 75/75 / 75/75 | ✓ play 2 · 스토리 11 | ✓ 경고 0 | ✓ |
| progress (Progress) | ✓ progress 185:6518 · 1/1 | ✓ | ✓ 1/1 / 1/1 / 1/1 | ✓ play 2 · 스토리 7 | ✓ 경고 0 | ✓ |
| radio (Radio) | ✓ radio 102:2677 · 24/24 (2026-10-28 재대조, 변경 없음) | ✓ | ✓ 24/24 / 24/24 / 24/24 | ✓ play 4 · 스토리 12 | ✓ 경고 0 | ✓ |
| search-field (SearchField) | ✓ search-field 216:6570 · 36/36 (2026-10-28 `solid/border/*` 재대조, 변경 없음) | ✓ | ✓ 36/36 / 36/36 / 36/36 | ✓ play 3 · 스토리 10 | ✓ 경고 0 | ✓ |
| segmented-control (SegmentedControl) | ✓ segmented-control 531:24471 · 3/3<br>segmented-item 524:24397 · 18/18 (2026-10-29 선택 이동 모션) | ✓ | ✓ 21/21 / 21/21 / 21/21 | ✓ play 4 · 스토리 12 | ✓ 경고 0 | ✓ |
| select (Select) | ✓ select 95:4740 · 24/24<br>listbox 97:2665 · 3/3<br>option 97:2286 · 15/15<br>select_message 95:2960 · 3/3 (2026-10-29 펼침 · 닫힘 모션) | ✓ | ✓ 45/45 / 45/45 / 45/45 | ✓ play 6 · 스토리 21 | ✓ 경고 0 | ✓ |
| skeleton (Skeleton) | ✓ skeleton 697:4486 · 4/4 | ✓ | ✓ 4/4 / 4/4 / 4/4 | ✓ play 1 · 스토리 5 | ✓ 경고 0 | ✓ |
| slider (Slider) | ✓ slider 391:1988 · 2/2<br>handle 391:2013 · 5/5 (2026-10-29 레이어 이름 정리) | ✓ | ✓ 7/7 / 7/7 / 7/7 | ✓ play 3 · 스토리 10 | ✓ 경고 0 | ✓ |
| stepper (Stepper) | ✓ stepper_indicator_horizontal 179:1621 · 5/5<br>stepper_indicator_vertical 203:3708 · 5/5<br>stepper_connector_horizontal 179:1614 · 2/2<br>stepper_connector_vertical 203:4253 · 2/2<br>stepper_horizontal 179:2043 · 3/3<br>stepper_vertical 203:3949 · 3/3 (2026-10-28 재대조: 합성 세트의 Completed 아이콘 Check로 정리, 참조 이미지 갱신) (2026-10-29 연결선 채움 모션) | ✓ | ✓ 20/20 / 20/20 / 20/20 | ✓ play 2 · 스토리 10 | ✓ 경고 0 | ✓ |
| switch (Switch) | ✓ switch 107:409 · 16/16 | ✓ | ✓ 16/16 / 16/16 / 16/16 | ✓ play 3 · 스토리 10 | ✓ 경고 0 | ✓ |
| table (Table) | ✓ table_header 351:3452 · 3/3<br>table_body 355:3739 · 8/8<br>table_key 355:4193 · 2/2<br>table_value 355:4460 · 2/2<br>table_value_editable 503:23264 · 52/52 (2026-10-28 Date Range Picker 7개 변형 단일 필드로 재구성) | ✓ | ✓ 64/67 (수동 검토 3) / 64/67 (수동 검토 3) / 64/67 (수동 검토 3) | ✓ play 3 · 스토리 12 | ✓ 경고 0 | ✓ |
| tabs (Tabs) | ✓ tab_filled 91:5000 · 60/60<br>tab_line 91:5241 · 30/30 (2026-10-28 `line/underline/*` 재대조: 2026-10-27 동기화 값과 동일) | ✓ | ✓ 90/90 / 90/90 / 90/90 | ✓ play 3 · 스토리 10 | ✓ 경고 0 | ✓ |
| textarea (Textarea) | ✓ textarea 86:2597 · 14/14 (2026-10-29 카운터 토큰 바인딩, Disabled 카운터 counter/disabled) | ✓ | ✓ 14/14 / 14/14 / 14/14 | ✓ play 4 · 스토리 13 | ✓ 경고 0 | ✓ |
| toast (Toast) | ✓ toast 91:5927 · 4/4 (2026-10-28 재설계 동기화: 제목 + 설명 + "닫기" 버튼) (2026-10-30 표시 규칙 스토리 상호작용형으로) | ✓ | ✓ 4/4 / 4/4 / 4/4 | ✓ play 4 · 스토리 8 | ✓ 경고 0 | ✓ |
| tooltip (Tooltip) | ✓ tooltip 149:1111 · 4/4 (2026-10-29 거리 10px = 화살표 8 + 2, 사용 예시 1668:7954) | ✓ | ✓ 4/4 / 4/4 / 4/4 | ✓ play 4 · 스토리 8 | ✓ 경고 0 | ✓ |

요약: 37개 검증 단위 — Figma 정의 37 · 구현 37 · 시각 3 엔진 37(수동 검토 변형 제외 모두 통과) · 인터랙션 37 · 접근성 37 · 문서 37. 스토리 테스트 408개(실패 0, a11y 경고 0).

## 문서 점검 (2026-10-20 문서 · 정책 간소화)

| 열 | 기준 |
| --- | --- |
| 사용 방법 문서 | 쉬운 한국어 구성(언제 사용하나요 · 사용 방법 · Props 절)이고, 원문에 노드 · 변수 ID · 버전명 · 날짜 · 정책 항목 ID · 내부 파일 경로 · MCP가 없음(코드 예제 · 예시 데이터 제외) |
| 화면 문구 검사 | 렌더링된 문서 페이지와 모든 스토리 화면에서 노드 ID · 버전명 · 날짜 · 파일 경로 · 정책 ID · 영어 문장(단어 6개 이상)이 나온 횟수 — Storybook 자체 UI 문구 · 예시 데이터 제외 |
| 개발 노트 | `docs/components/<Name>.md`가 있고 Figma 속성 ↔ Props 대응이 모두 있음 |

| 컴포넌트 | 사용 방법 문서 | 화면 문구 검사 | 개발 노트 |
| --- | --- | --- | --- |
| button | ✓ | ✓ 0 | ✓ |
| accordion | ✓ | ✓ 0 | ✓ |
| alert | ✓ | ✓ 0 | ✓ |
| badge | ✓ | ✓ 0 | ✓ |
| breadcrumb | ✓ | ✓ 0 | ✓ |
| card | ✓ | ✓ 0 | ✓ |
| chart | ✓ | ✓ 0 | ✓ |
| checkbox | ✓ | ✓ 0 | ✓ |
| chip | ✓ | ✓ 0 | ✓ |
| dashboard-filter-bar | ✓ | ✓ 0 | ✓ |
| data-freshness | ✓ | ✓ 0 | ✓ |
| data-state | ✓ | ✓ 0 | ✓ |
| date-picker | ✓ | ✓ 0 | ✓ |
| dialog | ✓ | ✓ 0 | ✓ |
| dropdown-menu | ✓ | ✓ 0 | ✓ |
| empty-state | ✓ | ✓ 0 | ✓ |
| file-uploader | ✓ | ✓ 0 | ✓ |
| input | ✓ | ✓ 0 | ✓ |
| link | ✓ | ✓ 0 | ✓ |
| metric-card | ✓ | ✓ 0 | ✓ |
| metric-trend | ✓ | ✓ 0 | ✓ |
| navigation | ✓ | ✓ 0 | ✓ |
| pagination | ✓ | ✓ 0 | ✓ |
| progress | ✓ | ✓ 0 | ✓ |
| radio | ✓ | ✓ 0 | ✓ |
| search-field | ✓ | ✓ 0 | ✓ |
| segmented-control | ✓ | ✓ 0 | ✓ |
| select | ✓ | ✓ 0 | ✓ |
| skeleton | ✓ | ✓ 0 | ✓ |
| slider | ✓ | ✓ 0 | ✓ |
| stepper | ✓ | ✓ 0 | ✓ |
| switch | ✓ | ✓ 0 | ✓ |
| table | ✓ | ✓ 0 | ✓ |
| tabs | ✓ | ✓ 0 | ✓ |
| textarea | ✓ | ✓ 0 | ✓ |
| toast | ✓ | ✓ 0 | ✓ |
| tooltip | ✓ | ✓ 0 | ✓ |

요약: 사용 방법 문서 37/37 · 화면 문구 37/37 · 개발 노트 37/37. 화면 검사 대상: Storybook의 모든 문서 페이지와 스토리(렌더링 결과).

검증 설정에 따로 없는 Figma 세트 3개: `input_message` 83:3009 — `input` 변형 안의 인스턴스로 검증(부모 변형에 나오는 유형만) · `textarea_message` 86:2733 — `textarea` 변형 안의 인스턴스로 검증(부모 변형에 나오는 유형만) · `date-picker_header` 144:1377 — `date-picker_calendar` 변형 안의 인스턴스로 검증(부모 변형에 나오는 유형만).

**자동으로 검증하지 못한 부분(미검증)**: 실제 화면 낭독기(NVDA · JAWS · VoiceOver)의 낭독 내용, 실제 터치 기기 · 모바일 브라우저,
Figma 프로토타입 연결(대조 대상 아님 — Figma 쪽 동작 기준은 변형 · Design System Rules이며 문서 대조로만 확인),
Figma Rules 문구와 Storybook 설명의 의미 일치 · 한국어 표현의 자연스러움(사람 검토 — 자동 검사는 기술 정보 · 영어 문장 유무만 판정).
시각 정합성은 검증 설정이 매핑한 레이어 · 픽셀 범위 안에서만 판정합니다.
