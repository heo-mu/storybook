# Changelog

[Semantic Versioning](https://semver.org/)을 따릅니다. 버전 규칙과 업데이트 절차는 [docs/developer-guide.md](docs/developer-guide.md#7-버전-관리와-업데이트-절차).
아직 레지스트리에 배포하지 않았습니다(`"private": true`).

## [Unreleased]

첫 배포 버전 제안: **0.1.0**(외부 배포 전이므로 아래 변경을 첫 버전에 포함) — [docs/breaking-changes.md](docs/breaking-changes.md).

### Password Field — Figma 눈 아이콘 동기화 (2026-10-30)

- **Figma 변경 확인**: `password_field`(1440:8466)의 눈 아이콘이 아이콘 라이브러리 인스턴스(`icon_size` › `icon/Eye` · `icon/Eye-close`)로 바뀌었습니다.
  값을 숨긴 상태의 `icon/Eye`는 벡터가 이전과 같고(내보낸 SVG가 코드 경로와 일치), **값을 보이는 상태(Focus-on)의 아이콘이 `icon/visibility_off`(24 그리드)에서
  `icon/Eye-close`(16 그리드)로 바뀌었습니다**. 크기 · 위치(16 · 20 · 24px 칸, 오른쪽 끝)는 그대로이고, 20 · 24px은 16px 벡터를 그대로 키운 것입니다.
- **코드**: `EyeSlashIcon`의 경로를 Figma `icon/Eye-close` 내보내기(16 × 16)로 바꿨습니다. Input의 눈 버튼 구조 · 크기 · 색 토큰 · 동작(클릭 · 키보드 · `aria-pressed` ·
  "비밀번호 표시 / 숨기기")은 그대로이고 공개 이름 · Props도 같습니다. 단독으로 쓰는 `EyeSlashIcon`의 기본 크기는 24 → 16px(`EyeIcon`과 같음).
- **Figma 색 바인딩(보고, Figma 수정 안 함)**: 새 아이콘의 채움이 로컬 `colors/input/outline/icon/*`가 아니라 **외부 라이브러리 변수 `colors/icon/secondary`**(#404b5d)에
  묶여, Disabled · Read-only 눈도 #404b5d로 그려집니다(이전 #a1a8b5). 같은 파일의 Input 지우기(X) 아이콘은 로컬 상태 토큰에 묶여 있고, 요청이 상태 유지였으므로
  코드는 상태 색(Disabled · Read-only #a1a8b5)을 유지합니다 — figma-issues F117, 재연결 요청은 figma-fix-requests AH절.
- **스냅샷 · 검증**: 기하(층 이름 `Container/icon_size` › `icon/Eye` · `icon/Eye-close`, 상자 변화 없음) · 참조 이미지 재추출(바뀐 픽셀은 Focus-on 3칸의 아이콘 모양과
  Disabled · Read-only 6칸의 아이콘 색뿐), 정합성 매핑을 새 층 이름으로, 스토리 검사는 아이콘 모양(경로)이 바뀌고 돌아오는지로(24 그리드 검사 대체).

### Button Secondary / Solid — 상태가 진행될수록 한 단계씩 밝게 (2026-10-30)

- **Figma 먼저(사용자 승인)**: Semantic `colors/fill/secondary/strong/hover` 별칭 brand/800 → **brand/600**, `pressed` brand/900 → **brand/500**.
  Default(brand/700), Component `button/secondary/solid/*`의 이름 · 별칭 · 노드 바인딩은 그대로입니다(Primitive emerald → Theme brand → Semantic → Component 구조 유지,
  새 색 · HEX 없음). 체크섬은 semantic 그룹만 바뀌고(38439d42 → efc7719c) 나머지 7개 그룹은 같습니다.
- **색**: Default #007c56 → Hover **#009b68** → Pressed **#02bb7b**(이전 Hover #006247 · Pressed #004a38). 명도 L* 45.8 → 56.5 → 67.3(+10.7 · +10.8, 같은 간격),
  Primary / Solid(900 → 800 → 700)와 같은 방향. Button · IconButton의 모든 크기 · 모양에 적용되고, TextButton · Outline · Primary · Tertiary는 변화 없음.
- **전경색**: 라벨 · 아이콘은 모든 상태에서 Default와 같은 흰색(`text/inverse` · `icon/inverse` #fdfdfd). Hover · Pressed Component 토큰도 같은 Semantic을 가리켜 바꿀 것이 없었습니다.
- **대비(흰색 #fdfdfd)**: Default 5.14:1, Hover **3.51:1**(글자 4.5:1 미달, 아이콘 3:1 충족), Pressed **2.46:1**(글자 · 아이콘 모두 미달). 요청대로 밝기 정책을 유지하고
  기준은 낮추지 않았습니다 — axe 감사 색 대비 위반 18건, `KNOWN_CONTRAST`에 넣지 않음([docs/accessibility.md](docs/accessibility.md)).
- **코드**: 스냅샷 · `src/tokens` 재생성(Button.css 변경 없음), `figma/button-spec.json` Secondary / Solid Hover · Pressed 4항목, 참조 이미지 재내보내기
  (바뀐 픽셀은 button_basic 16칸 · button_icon 12칸뿐), 사용 문서의 대비 설명. 352/352 · 실제 포인터 36/36 세 엔진.

### Badge Count — 숫자 가운데 정렬 (2026-10-30)

- **원인**: 숫자 글자 상자가 왼쪽 정렬이었습니다(Figma · 코드 같음). 글자 상자는 정수 픽셀로 올림되므로(Figma 자동 폭, 코드 `calc-size`) 올림한 나머지가
  모두 오른쪽에 남아 숫자가 왼쪽으로 치우쳤습니다 — Chromium 1배 화면에서 최대 1px, 2배에서 0.75px.
- **Figma 먼저**: `badge_count` 숫자 글자 14개의 가로 정렬 Left → Center(상자 · 텍스트 스타일 · 색 · 크기 그대로, [figma-fix-requests AF절](docs/figma-fix-requests.md)).
  참조 이미지 다시 내보냄(바뀐 픽셀은 모두 글자 상자 안).
- **코드**: `.ds-badge-count__label { text-align: center }` — 나머지가 양쪽으로 나뉩니다. 고정 여백 · 이동 보정 없음. 배지 폭 · 높이 · 색 · 글꼴 · 모서리 · 상태와
  공개 Props는 그대로입니다. Firefox · WebKit은 `calc-size`가 없어 글자 상자가 원래 글자 폭이므로 전과 같습니다.
- **결과**(1 · 3 · 9 · 10 · 99 · 99+ · 999+, Danger · Basic · Gray, 잉크 기준 최대 치우침): Chromium 1배 1.00 → 0.50px(99+ · 999+는 홀수 폭의 픽셀 한계),
  2배 0.75 → 0.25px, 4배 0.75 → 0.38px("1"의 글리프 옆 여백 — Figma도 0.25px). Figma 대비 글자 위치 |dx| 0.31 → 0.03px.
  세로는 12px 줄 상자가 정확히 가운데(위 2 · 아래 2)이고, 숫자는 Pretendard 기준선 때문에 0.4–0.5px 아래 — Figma(0.375px)와 같아 바꾸지 않았습니다(figma-issues F116).
- **스토리**: Badge Gallery "Count Digits" — play가 라벨 상자와 글자의 가운데(엔진 배치 단위 1/60px 이내), 높이 16, `calc-size` 지원 시 정수 폭을 검사합니다.
  가운데 정렬을 빼면 실패하는 것을 확인했습니다.

### Storybook 빈 화면 전수 검사 — Toast 표시 규칙 예시, 가시 콘텐츠 검사, 메뉴 정리 (2026-10-30)

- **Toast Gallery "표시 규칙(개수 · 시간 · 중복)"**: 열면 빈 화면이던 스토리를 규칙별 버튼과 "지금 보이는 알림: n개" 표시가 있는 상호작용 예시로 다시 만들었습니다(기존 Toast · ToastRegion · 전역 큐 그대로). play는 버튼으로 같은 규칙(중복 교체 · 최대 3개 · 5초 · 닫을 때까지)을 검사하고 마지막 토스트를 남깁니다.
- **`verify:render` 보강**: 실제로 보이는 요소(크기 · display · visibility · opacity, 포털 포함)를 세고, 처음에 비어 있으면 첫 조작 요소를 눌러 확인하며, 1초 · 6초 뒤 콘텐츠가 남아 있는지와 문서의 Canvas 가시 여부를 검사합니다. 4개 탭 병렬. 전체 532개 항목에서 빈 화면은 Toast 표시 규칙 1건뿐이었고 수정 뒤 Chromium · Firefox · WebKit 모두 0건입니다. 문서의 Canvas는 늦게 채워지는 경우(WebKit)를 위해 최대 8초 기다린 뒤 판정하고, Firefox의 외부 글꼴 진단 메시지(Storybook 문서 테마 글꼴 · Pretendard 이름 표)는 콘텐츠 결함이 아니라 제외 목록에 이유와 함께 둡니다.
- **Storybook 메뉴**: "Components/Chip/FilterChipSelect/Gallery"(4단계) → "Components/Chip/FilterChipSelect Gallery", Button의 Overview · States · Variants · Surface Comparison · Checks 다섯 그룹 → "Components/Button/Gallery" 하나(스토리 이름에 접두어, ID 변화 없음). 삭제한 스토리 없음.

### Motion — Rules 09 개정에 맞춘 실제 움직임 (2026-10-29)

디자이너가 다시 쓴 Design System Rules 09장 "움직임"을 Figma에서 읽고 해당 컴포넌트에만 움직임을 넣었습니다. 쉬는 모양은 Figma와 그대로이고(정합성 세 엔진 통과), 색 · 펼침 · 열림 같은 나머지 상태 변화는 계속 즉시입니다. 기기의 동작 줄이기 설정에서는 이동 · 채움 · 펼침 움직임이 없고, 반복 움직임은 느려집니다(Rules 03).

- **SegmentedControl**: 선택 배경이 새 항목으로 미끄러져 이동(HeroUI Segment — 250ms `cubic-bezier(0.32, 0.72, 0, 1)`). 선택 표시 요소 하나가 선택 항목 상자를 재서 옮기고, 쉬는 위치는 항목과 같은 상자. 빠른 연속 클릭 · 방향키 · 크기 변경에도 마지막 선택에 맞음. 공개 Props 변화 없음.
- **Stepper**: 한 단계씩 연결선이 채워지며 이동(HeroUI Stepper) — 완료 → 연결선 300ms 채움 → 다음 단계 현재, 건너뛰면 차례로, 뒤로 가면 거꾸로. 화면 낭독기는 실제 상태를 즉시 읽음. `StepperIndicator`에 그림 전용 `displayStatus`(보조 API) 추가.
- **Select · DatePicker(달력 · 연/월 목록) · Breadcrumb 메뉴 · FilterChipSelect**: 펼칠 때 150ms(투명 · 0.9배 · 트리거 쪽 4px에서), 닫을 때 100ms(0.95배로 흐려짐, 닫히는 동안 누를 수 없음) — HeroUI Dropdown 값. 위치 · 너비 · 간격은 그대로(`src/styles/overlay-motion.css`, styles.css에 포함).
- **DropdownMenu 하위 메뉴(2단계)**: 새 `DropdownMenuSub` — 마우스 · → · Enter로 옆에 140px 글자 메뉴가 열리고 ← · Esc로 닫힘, 비스듬히 옮겨 가는 동안 유지, 여는 항목은 열린 동안 hover 모양. 메뉴는 Rules 09에 애니메이션이 없어 즉시 열림 · 닫힘. Rules 05 "하위 메뉴 없음"과 충돌해 결정 대기(figma-issues F114).
- **Loading · Skeleton**: 이미 09장과 같음(스피너 1초/바퀴 · 스켈레톤 2초 맥동, 동작 줄이기 3초 · 6초) — 변경 없음.
- **움직임 토큰**: 추가하지 않음 — Figma에 시간 · 곡선 변수가 없어 참고 링크 값을 컴포넌트 CSS에 직접 둠(figma-issues F115).
- **스토리 · 검증**: SegmentedControl Gallery "선택 이동" · Stepper "단계 이동"(문서 · Gallery) · DropdownMenu "하위 메뉴"(문서 · Gallery) 스토리, `verify:interaction`에 움직임 흐름 5개(선택 이동 · 단계 채움 · 펼침/닫힘 · 하위 메뉴 · 동작 줄이기, 세 엔진). 펼침 움직임 중에 위치를 재던 스토리 검사 6곳은 움직임이 끝난 뒤의 쉬는 위치를 재도록 기다림을 넣음(값은 그대로).

### Tooltip — 트리거와 2px 더 띄움, Figma 사용 예시 (2026-10-29)

- **거리**: 화살표 끝이 트리거에 닿던 8px에서 화살표 8px + 2px = 10px로(Rules 05 개정, Figma 먼저). 네 방향 같고, 위치는 트리거의 실제 경계 기준(react-aria `offset`)이라 다른 값은 그대로입니다. 공개 Props 변화 없음.
- **Figma**: Tooltip 프레임에 "Tooltip 사용 예시"(1668:7954) — 기본(2px 간격 표시) · Top · Bottom · Left · Right · Hover · Focus · 화면 가장자리(반대쪽에 열림) · 여러 툴팁(한 번에 하나) — 기존 tooltip · button_basic · button_icon 인스턴스로, DatePicker 사용 예시와 같은 머리글 · 격자 형식.
- **Storybook**: Gallery Variants 스토리의 play가 네 방향의 화살표 끝 ~ 트리거 2px를 검사하고, 화면 가장자리(뒤집힘 · 화면 안) · 여러 툴팁(빠른 이동에도 하나만) 스토리 추가. `verify:interaction`에 간격 · 크기 변경 · 스크롤 · 가장자리 · 깜빡임 흐름 추가(세 엔진). 문서 · 정책 표 갱신.

### F112 · F113 — SearchField 토큰 이름 구조화, 상태 토큰 바인딩 수정 (2026-10-29)

- **SearchField 토큰 이름(F112)**: `search-field/{outline,solid}/label/*`가 입력 글자를 뜻하던 것을 다른 필드와 같은 구조로 바꿨습니다 — `label/default · hover · disabled` → `placeholder/default · hover · disabled`, `label/completed · error` → `value/completed · error`(이름만 변경, 변수 ID · 노드 바인딩 유지). input처럼 `value/default`(Focus) · `value/disabled`를 추가했고 Focus 변형 6곳 · solid Hover 변형 3곳을 알맞은 토큰에 묶었습니다(색 동일). CSS 변수 이름이 바뀌었습니다: `--colors-search-field-*-label-*` → `--colors-search-field-*-placeholder-*` · `-value-*`(배포 전 0.1.0, SearchField.css 외 참조 없음). 공개 Props 변화 없음.
- **Textarea 비활성 카운터(F113 ①)**: Figma Disabled 변형의 카운터가 `counter/disabled`(text/disabled)로 바뀌어 코드도 비활성 상태에서 카운터 전체를 같은 색으로 보입니다(이전: 현재 수 brand · 나머지 tertiary). 비활성 카운터 요소에 `aria-disabled`(비활성 컨트롤의 일부 — 대비 예외, 라벨 · 메시지와 같은 처리). 참조 이미지 갱신, 14/14 세 엔진.
- **Navigation 링크 Hover 아이콘(F113 ②, F36)**: Unselected Hover 변형 아이콘이 `…/icon/hover`(icon/secondary)로 묶여 코드도 hover에서 아이콘이 한 단계 진해집니다(item_parent와 같은 규칙). 참조 이미지 갱신, item_link 4/4 세 엔진.
- **Table 행 아이콘(F113 ③)**: `table/data/icon/hover` 별칭을 icon/tertiary(기본보다 연함) → icon/primary로 고치고, 행 hover · pressed에서 끌기 손잡이 아이콘에 `data/icon/hover` · `pressed`를 적용했습니다(세트에 Hover 변형은 없음; 손잡이는 react-aria가 포인터 이벤트를 행에 넘기므로 행 상태를 따름).
- Slider handle 토큰 2개(`slider/background/handle/outline` · `border/handle/brand`)는 legacy 페이지 slider-outline 대안이 24곳에서 쓰고 있어 유지 — [docs/components/Slider.md](docs/components/Slider.md) SLID 노트.

### Figma 변수 · 구조 정리 — Component 변수 56개 삭제 · 바인딩 6 · 레이어 이름 370 · Rules 06 주의 행 (2026-10-29)

디자인 시스템의 뜻과 확장성을 지키면서 쓰이지 않는 구조를 정리했습니다([docs/figma-fix-requests.md AC절](docs/figma-fix-requests.md)). 색 · 크기 · 배치는 바뀌지 않았고, 공개 API · 컴포넌트 동작도 그대로입니다.

- **잘못 만들어진 Component 변수 7개 삭제**(`default` · `hover` · `pressed` · `disabled` · `active` · `selected` · `disabled-selected`): legacy 페이지 화면 시안이 쓰던 `hover` · `default` 8곳은 같은 색의 Semantic으로 옮긴 뒤 삭제. 토큰 생성기가 건너뛰던 항목이라 CSS 변화 없음.
- **노드에 묶이지 않은 Component 변수 67개 정리**: 폐기 · 중복 49개 삭제(Solid 버튼 테두리 · 필드 라벨 상태 토큰 16개 — 디자인은 라벨을 `text/secondary`로 통일 — · search-field value · helper · 달력 날짜 테두리 · 로딩 스피너 · 카드 구분선 · 브레드크럼 포커스 등, 모두 두 페이지 바인딩 0 · 별칭 0 · 코드 0 확인), 역할이 있는 6개는 Figma 노드에 바인딩하고 코드도 같은 토큰을 씀 — Button Tertiary · Solid 배경 `button/tertiary/solid/background/*`(이전 Semantic 직접 참조), Textarea 카운터 `counter/completed` · `counter/error`(이전 `text/brand` · input helper/error), EmptyState 아이콘 `empty-state/icon/default` — 색 변화 없음; 12개는 향후 상태 · 시리즈 3 · 4 · legacy 대안용으로 유지. Component 819 → 763, `src/tokens` 재생성(1548 → 1499 변수).
- **같은 값의 Semantic 토큰 11묶음**: 뜻 · 적용 대상 · 독립 변경 가능성을 검토해 모두 별도 토큰으로 유지(통합 없음, 잘못된 별칭 없음) — figma-issues F108.
- **이름 없는 레이어 370개 이름 정리**(컴포넌트 48 · 사용 예시 57 · Rules 표 265): 크기 · 배치 · 인스턴스 연결 변경 없음. 기하 · 검증 설정의 부품 이름을 같이 바꿔 정합성 검사는 그대로 통과(alert · empty-state · data-state · table · card · slider · file-uploader · chart · dashboard-filter-bar · data-freshness).
- **Design System Rules 06 "주의" 행 추가**: 언제 쓰는지(작업은 이어갈 수 있지만 확인이 필요한 일), 어떻게 보이는지(주황 삼각형, 다른 상태와 같은 자리), 무엇을 안내하는지(확인할 것 한 문장 · 버튼), 오류 · 성공 · 안내와의 차이. Alert · Toast 사용 문서와 docs/policy-details.md 06에 같은 내용.
- 보고만: search-field 토큰 이름이 다른 필드와 반대(F112), 상태 토큰은 있으나 변형이 다른 색을 쓰는 3건(F113).

### 잔여 이슈 통합 개선 — Button 대비 · Figma 구조 정리 · 정합성 재검사 (2026-10-28 저녁)

Figma 쪽 오류는 Figma에서, Storybook 쪽 오류는 코드에서 고쳤습니다([docs/figma-fix-requests.md AB절](docs/figma-fix-requests.md)). 변수 삭제는 하지 않았습니다.

- **Button Secondary / Solid 대비(F100)**: Semantic `fill/secondary/strong/hover` · `pressed` → brand/800 · 900(흰 라벨 7.42:1 · 10.2:1, 이전 brand/600 · 500은 3.51:1 · 2.46:1). `src/tokens` 재생성, `figma/button-spec.json` · 참조 이미지(button_basic 16칸 · button_icon 12칸) 갱신, 352/352 세 엔진, axe 색 대비 0건.
- **Figma 정리**: accordion-item sm Default Expanded 트리거의 외톨이 `elevation-3` 제거(F102, 픽셀 동일); Design System Rules 06 "처리 중" · 09 Segmented Control · Stepper · dropdown-menu-sub · 펼침 · 닫힘 · 반복 움직임 행을 구현과 같은 쉬운 말로 고침(F103, 코드 변화 없음); password_field 눈 아이콘 3곳 · slider handle 값 라벨 2곳의 외부 라이브러리 인스턴스 분리(F105); card Content 예시 상자 이름 지정 · `surface/container` 바인딩(F106); Primitive 55개의 ALL_SCOPES 해제(F108 — 스냅샷 `primitive-scalars.txt` 동기화, CSS 변화 없음); table_value_editable Date Range Picker 7개 변형을 통합 DatePicker 구조(필드 하나 "시작 ~ 종료")로 재구성(F110).
- **정합성 재검사(이전 실패 4개)**: dashboard-filter-bar 1/1 · empty-state 1/1 · data-state 6/6 · table_value_editable 49/49(수동 검토 3) — Chromium · Firefox · WebKit 통과. 원인은 Figma 변경 뒤 다시 추출하지 않은 기하 · 참조 이미지와 스토리 예시의 옛 구성(F111). 실제 코드 수정은 DataState Loading 상하 12px(`spacing/padding/p-3`, Figma 높이 66 → 90)뿐이고, FilterBarSample 기간 입력을 `DashboardFilterRange` + 136px `DatePicker` 두 개로, "편집 칸 목록 열림 · Date Picker" 스토리는 `defaultOpen`으로 실제 열린 상태를, Card 스토리 자리표시 상자는 `var(--colors-surface-container)`로 바꿨습니다.
- **DatePicker 잔여**: `DatePickerVariant` 타입은 `dist/components/DatePicker/*.d.ts`로 내보내지며 소비 프로젝트 타입 검사(`DatePickerVariant` · `DatePickerProps` · `FieldSize` import, tsc strict) 통과. Figma Open 사용 예시 필드는 이미 메시지 줄 없는 70px라 변경 없음.
- 보고만(결정 대기): 노드에 적용되지 않은 Component 변수 90개(코드가 쓰는 상태 토큰 23 · 미사용 67)와 이름이 잘못 만들어진 변수 7개(F107), 같은 값의 Semantic 쌍 9개(F108), 이름 없는 프레임(F109), Rules 06 "주의" 행 누락(F103 ④).

### DatePicker 통합 — Input · Inline, Select형 날짜 필드, Examples · Calendar 그룹 제거 (2026-10-28)

**Breaking(배포 전 0.1.0)**: `DatePicker`가 기본으로 날짜 필드(`variant="input"`)를 그립니다. 이전의 달력만 그리던 동작은 `variant="inline"`입니다. `Calendar` export는 그대로입니다(호환, `DatePicker variant="inline"` 권장).

- **Input**: Figma `date-picker_trigger`(Select와 같은 Field 레이아웃 + calendar-dots 아이콘, `colors/date-picker/trigger/outline/*` 토큰)를 버튼으로 구현 — 필드 · 아이콘 클릭 또는 Enter · Space · ↓로 아래 4px에 달력 팝오버, Single은 고르면 닫힘, Range는 종료일까지 고르면 "시작 ~ 종료"로 표시 후 닫힘, Esc · 바깥 클릭은 고르지 않고 닫힘, 포커스는 필드로 복귀, 비활성 · 읽기 전용은 열리지 않음(읽기 전용은 아이콘 없음), 여러 필드는 독립. 새 Props `variant` · `size` · `placeholder` · `open` · `defaultOpen` · `onOpenChange` · `autoFocus`. 직접 입력(텍스트) 기능은 두지 않습니다.
- **Figma**: 숨겨져 있던 `date-picker_trigger` 세트 복귀 · 설명 교체, State=Open 3개 추가(Select Open과 같은 테두리 · 아이콘), 사용 예시 프레임 재구성(Input Single · Range · Open, Inline) — [figma-fix-requests AA절](docs/figma-fix-requests.md). 변수 · 스타일 변화 없음.
- **Storybook**: 최상위 `Examples`(Form · Dashboard · Table List)와 `Calendar` 그룹 제거. DatePicker 아래에 Playground · Single Date · Date Range · Inline Calendar · Inline Date Range · Sizes · 상태 스토리 · Keyboard Interaction · Inline Keyboard, Gallery에 Input Variants(21) · Open(3) · Calendar · Day States · Navigation · Outside Click · Independent 등. 정합성 검사 설정 `figma/verify/date-picker.json`에 트리거 세트 복귀(24/24 세 엔진 통과), 기하 · 참조 이미지 갱신. `verify:interaction`의 DatePicker 흐름 5개를 필드 기준으로 교체, Form 예시 흐름 삭제.
- 문서: DatePicker 사용 문서 · 개발 노트 재작성, API 문서 재생성.

### 전체 품질 감사 — Figma × Storybook 독립 QA (2026-10-28)

기존 테스트 결과에 기대지 않고 Figma 68개 세트와 Storybook 531개 항목(스토리 444 · 문서 87)을 처음부터 다시 검사했습니다.

- **런타임 오류 수정**: DashboardFilterBar 사용 문서가 `DashboardFilterRange`를 import 없이 `<ArgTypes of>`에 써서 배포 사이트에서 ReferenceError로 비어 있었습니다 — import 추가. 38개 MDX의 같은 유형(참조만 있고 import 없는 식별자)을 스크립트로 검사해 다른 문서에는 없음을 확인.
- **실제 브라우저에서만 드러난 동작 오류**: Table 전체 선택 체크박스가 실제 클릭에서 반대로 표시되고 해제되지 않음(react-aria 머리글 press가 클릭 기본 동작을 막아 네이티브 체크박스가 되돌아감) — `TableCheckbox` 클릭 전파 차단으로 수정(TABL-11).
- **Figma 설계 오류 수정(브리프 승인)**: accordion-item Trigger 모서리가 삭제된 변수에 묶여 0으로 그려지던 것을 복구 변수(4px)로 재연결 — 코드 · 참조 이미지 동기화(ACCO-07); card 테두리 두께 · password_field 눈 아이콘의 외부 라이브러리 변수 바인딩을 로컬 토큰으로 교체(시각 변화 없음). 기록만 한 항목: F105–F109(외부 인스턴스, 하드코딩 예시 상자, 미사용 Component 변수 97개, ALL_SCOPES · 중복 역할 토큰, 이름 없는 프레임).
- **SearchField Esc**: 값이 있을 때 Esc로 지우기를 코드로 통일 — Chromium · Firefox는 `type="search"`를 기본으로 지우지만 WebKit은 지우지 않아 세 엔진 동작이 달랐습니다(실제 브라우저 감사). 빈 값이면 Esc를 바깥으로 전달.
- **QA 스크립트 추가**: `npm run verify:render`(모든 스토리 · 문서 페이지의 실제 렌더링 — 페이지 오류 · 콘솔 · 오류 화면 · 빈 렌더 · 깨진 이미지 · 폰트 · 가로 넘침, 배포 사이트도 검사), `npm run verify:interaction`(29개 실제 포인터 · 키보드 흐름). Accordion 스토리의 모서리 기대값 갱신.
- 보고서: [docs/final-report.md](docs/final-report.md).

### Button Secondary / Solid Hover · Pressed — Figma 결정값 동기화 (2026-10-28)

Figma Semantic `colors/fill/secondary/strong/hover` · `pressed`가 brand/800 · 900에서 **brand/600(#009b68) · brand/500(#02bb7b)** 로 확정되었습니다(별칭 변경, 기본 brand/700 · 라벨 · 아이콘 · 테두리 · Component 별칭은 그대로, 다른 변수 변화 없음 — 체크섬 8그룹 일치, F100 종결).

- 스냅샷 `figma/variables/semantic.txt` · `src/tokens/semantic.css` · `tokens.json` 재생성(CSS 하드코딩 없음). 영향: Button · IconButton Secondary / Solid의 Hover · Pressed 배경만(TextButton · 다른 Variant 무관).
- 정합성: `figma/button-spec.json` 기대 색 4곳, 참조 이미지 button_basic(16칸) · button_icon(12칸) 재내보내기 — 352개 변형 + 실제 포인터 Hover · Pressed 36/36이 Chromium · Firefox · WebKit에서 통과.
- 접근성: 흰 라벨 대비 Hover 3.51:1 · Pressed 2.46:1로 axe 색 대비 **18건**(States · Variant Matrix의 pseudo 상태 칸)이 남음 — 색은 Figma 값 그대로, [docs/accessibility.md](docs/accessibility.md)에 기록. Props · 공개 API 변화 없음.

### Design System Rules 동기화 (2026-10-28)

Figma Design System Rules(02–09장 — "(계속)" 프레임과 10장은 없어짐)를 다시 읽어 뜻이 바뀐 행만 반영했습니다.

- **Skeleton 맥동**(Rules 09 "반복 움직임" 개정, 이전 "정적"): 참고 링크(shadcn/ui Skeleton)대로 불투명도 1 → 0.5 → 1, 2초, `cubic-bezier(0.4, 0, 0.6, 1)` 반복, 움직임 줄이기 설정에서 6초. 색 · 크기 · Props 변화 없음. Motion 스토리 추가.
- **정합성 검사**: 스크린샷을 애니메이션을 멈춘 상태(`animations: 'disabled'`)로 찍어 Skeleton · 스피너가 들어간 변형의 비교가 흔들리지 않게 했습니다.
- **문서**: policy-details 04장(일부 선택 체크박스는 해제 · 필터 칩 "첫 값 외 n개" — 이미 구현), 06장(토스트 하단 오른쪽 · 모두 5초 — 이미 구현, "주의" 행 삭제, "처리 중" 행과 Form 예시 충돌), 09장(참고 링크 행 5개와 구현 상태), 장 제목(06 알림 · 진행 표시, 07 데이터 표시, 09 움직임), 컴포넌트 노트의 Rules 프레임 참조 정리. Segmented Control · Stepper · 열림 · 닫힘 애니메이션과 하위 메뉴 행은 Figma에 값이 없고 다른 행과 충돌해 미구현(figma-issues F103).

### Button `loading` — Form 사용 예시 "저장 중" 동기화 (2026-10-28)

Figma Form 사용 예시(1216:5172)의 "저장 중"(1216:7451)은 저장 버튼(Primary · Solid · md) 안에 `loading` size=sm · Type=Inverse(16px, 2px 흰 호 `colors/border/inverse`)를 두고 배경은 Default(`button/primary/solid/background/default`)를 유지하며, 취소 버튼은 Default 그대로입니다. 기존 코드는 버튼을 `disabled`로 바꾸고 옆에 `Loading`을 두었습니다.

- **Button `loading` · `loadingLabel` Props 추가**(기존 Props · 기본 모양 변화 없음): 글자 · 아이콘은 자리만 남기고 투명, 가운데 16px 회전 표시(버튼 글자색), Default 팔레트 고정, `aria-busy` · `aria-disabled`, 포커스 유지, 클릭 · Enter · Space 무시(중복 제출 방지), `role="status"` 상태 글자. 버튼 너비는 유지합니다(Figma 예시는 글자를 지워 40px — 레이아웃 흔들림 방지를 위해 49px 유지).
- **Loading**: 호 색을 `--ds-loading-color`(기본 `colors/border/brand`)로 빼내 버튼 안에서 Inverse로 재사용(시각 변화 없음).
- **Form 예시**: 저장 중 버튼에 `loading`, 취소는 Default(Figma), 완료 시 "저장했습니다" 상태 메시지; play에 회전 표시 · 크기 유지 · 중복 제출 차단 · 완료 복귀 검사. Button 스토리 "처리 중" 추가, 사용 문서 · 개발 노트(BUTT-03) 갱신.

### Chip Filter — 선택값 표시 규칙 "첫 값 외 n개" (2026-10-28)

`FilterChipSelect`의 칩 글자가 선택 개수에 따라 바뀝니다 — 0개 "필터명", 1개 "필터명: 값", 2개 이상 "필터명: 첫 값 외 n개"(n은 보여 준 값을 뺀 나머지). 예: 지역 → 지역: 서울 → 지역: 서울 외 1개 → 지역: 서울 외 2개. 첫 값은 선택 순서가 아니라 옵션 목록 순서를 따르고, 선택 · 해제 · 초기화 시 즉시 갱신됩니다.

- `filterChipText`: "외 n" → "외 n개", `maxDisplayed` 기본 3 → **1**(Prop은 그대로 — 늘리면 이름을 더 나열). 디자인 · 상태 · 선택/해제 · 단일 선택 · Disabled · 키보드 동작은 변화 없음.
- 스토리: 표시 규칙 스토리(0 · 1 · 2 · 3개, 순서 일관성, 해제) 추가, 기존 play 기대값 갱신. 표 편집 예시는 Figma 표 변형과 같은 "옵션명, 옵션명"을 `maxDisplayed={2}`로 유지.
- Figma: `chip-filter 다중 선택 예시`(1011:12956)의 인스턴스 글자 5개를 새 규칙으로 수정([figma-fix-requests Y절](docs/figma-fix-requests.md)). 세트 · 변수 변경 없음.

### Checkbox — Indeterminate 상태에서 누르면 해제 (2026-10-28)

일부 선택(`indeterminate`) 체크박스를 클릭하거나 Space로 누르면 브라우저 기본(선택됨) 대신 **해제(Unchecked)** 로 바뀝니다. `Checkbox`가 `onChange` 전에 `event.target.checked`를 `false`로 바꾸므로, 전체 선택 체크박스는 하위 항목을 모두 해제하고 `CheckboxGroup` 안의 항목도 같은 규칙을 따릅니다. 단순 Checked ↔ Unchecked 전환, Disabled 차단, Props · 공개 API · Figma 디자인은 그대로입니다. 사용 문서 · 개발 노트(CHEC-03) · Interaction 스토리(클릭 · Space로 전체 해제) 갱신.

### Accordion 동기화 — 펼친 항목의 하단 구분선 (2026-10-28)

Figma `accordion-item`(1035:15648, 10개)을 최신 원본으로 다시 읽었습니다. 트리거 높이 44 · 36, 패딩 · 간격 · 제목 · 본문 글자 · 아이콘 · 포커스 링 · `colors/accordion/*` 등 변수 20개(별칭 포함)는 스냅샷과 같고, 바뀐 것은 **Expanded=True 변형 4개에 내용 아래 두 번째 Divider(`colors/accordion/border/default`, Show Divider에 연결)가 추가**된 것입니다.

- **AccordionItem**: 펼친 항목의 패널 마지막 픽셀 행에 1px `border/default` 구분선(`.ds-accordion__panel::after`, `divider` Prop으로 함께 끄고 켬). Props · 공개 API · 펼침/접힘 · 키보드 동작 변화 없음.
- **검증 자산**: `figma/geometry/accordion-item.json`에 하단 Divider 추가, `figma/reference/accordion-item.png` 재추출. Variants play에 펼친 항목 하단 구분선(1px, #d6dae0) · 접힌 항목 없음 검사 추가.
- **보고**: sm Default Expanded 트리거에만 `elevation-3` 효과가 있어(다른 Expanded 변형에는 없음, 화면 차이 없음) F102로 기록하고 코드에는 넣지 않았습니다.

### Toast 재설계 동기화 — Figma `toast` 제목 + 설명 + "닫기" 버튼, Rules 06 개정 (2026-10-28)

Figma `toast` 세트(91:5927, F101)가 320×36 한 줄 + X 아이콘에서 **320×54(내용에 맞춰 높이, 최소 36)의 제목 + 설명 + "닫기" `button_text`** 구조로 바뀐 것을 반영했습니다. 패딩 p-2/p-2_5 · 간격 p-2 · radius 4 · 1px 테두리 `colors/toast/border/<status>` · elevation-3 그림자 · 20px 종류 아이콘은 그대로이고, 제목은 `colors/toast/label/title/default`(sm/medium), 새 설명은 `colors/toast/label/body/default`(xs/normal, 2px 아래)입니다.

- **Toast / ToastRegion**: `description` · `showIcon` Props 추가(Figma Sub Text · Show Icon), 닫기는 "닫기" 글자 + 원형 X 아이콘의 `TextButton`(Primary sm, 영역에서는 react-aria 닫기 버튼에 같은 클래스 · 구조). 기존 Props(`status` · `children` · `showClose` · `onClose` · `closeLabel`)와 `showToast` · `closeToast` · `toastQueue`는 그대로 — `showToast` 옵션에 `description` · `showIcon` 추가.
- **표시 규칙(Design System Rules 06, Figma 개정)**: 화면 아래 **오른쪽**(이전 가운데), 최신 토스트가 아래에 붙고 위로 쌓임, **모든 종류 5초 뒤 닫힘**(이전에는 오류 · 주의가 닫을 때까지 유지 — `timeout: null`로 여전히 가능), 한 번에 3개 — **네 번째가 오면 가장 오래된 토스트가 밀려 나가 사라짐**(이전에는 대기열). 마우스 오버 · 포커스 중 일시 정지와 중복 교체는 유지. Figma에 진행 표시줄 · 애니메이션은 없어 추가하지 않았습니다.
- **검증 자산**: `figma/geometry/toast.json` · `figma/reference/toast.png`(362×318) 재추출, `figma/verify/toast.json` 부품 매핑 갱신(설명 글자 12px 1% 자간의 0.7px 중심 차이는 사유와 함께 기록). 스토리 · Usage · 개발 노트 갱신.

### Tab underline 토큰 재대조 — 이미 동기화된 값 (2026-10-28)

`colors/tab/primary/line/underline/*` · `colors/tab/secondary/line/underline/*`를 최신 Figma에서 다시 읽었습니다. 현재 값은 `default` = `@S:colors/border/gray-subtler`(#d6dae0), `hover` = `@S:colors/border/gray-subtle`(#a1a8b5), `pressed` = `@S:colors/border/gray`(#778191), `selected` = `fill/primary|secondary/strong/default`(#004a38 · #007c56), `disabled` = `fill/disabled/default`(#d6dae0), 모드 1개 — **2026-10-27 커밋 21c053a(F99 드리프트 정리)에서 이미 동기화한 값과 같고** 스냅샷 · 생성 토큰 · 코드 · Component 체크섬(733 · 89299fb3)이 모두 일치해 반영할 변경이 없습니다. 그 전 값(2026-10-16 스냅샷)은 default gray-subtle #a1a8b5 · hover gray #778191 · pressed gray-dark #596475였습니다. `tab_line` 30개 변형의 하단 스트로크만 이 변수를 쓰고(`tab_filled`에는 밑줄 없음), 세트 화면은 픽셀 동일, 세 엔진 90/90 통과.

### Stepper 동기화 — Figma 합성 세트의 Completed 아이콘 (2026-10-28)

Figma Stepper 프레임(151:697)의 세트 6개(indicator 5+5 · connector 2+2 · stepper 3+3)를 최신 원본으로 다시 읽었습니다. 변형 · 기하 · 패딩 · 간격 · 텍스트 스타일 · `colors/stepper/*` 18개 변수는 스냅샷과 같고, 바뀐 것은 `stepper_horizontal` · `stepper_vertical` 세트 안 Completed 표시기 인스턴스의 아이콘이 check-circle에서 표시기 세트와 같은 12px `icon/Check`로 정리된 것뿐입니다(indicator · connector 세트 화면은 픽셀 동일).

- 코드는 이미 `CheckIcon`(12px)을 그리고 있어 **컴포넌트 · 토큰 변경 없음**. `figma/reference/stepper_horizontal.png` · `stepper_vertical.png`를 최신 화면으로 갱신하고 세 엔진 20/20을 다시 통과했습니다(이전 참조 이미지의 check-circle은 23px 차이로 허용치 안에 있었음).
- 개발 노트의 아이콘 설명(CheckCircle · WarningCircle → Check · ExclamationMark) 수정.

### SearchField Solid border 재대조 — Figma 변수 변경 없음 (2026-10-28)

`colors/search-field/solid/border/*`를 최신 Figma에서 다시 읽었습니다 — `hover` · `focus` = `@S:colors/border/gray-subtle`(brand-gray/400 #a1a8b5), `error` = `@T:colors/brand-status/error/strong`(#c10007), 모드 1개, Solid Default · Completed · Disabled 변형에는 테두리 없음. 스냅샷 · 생성 토큰(`src/tokens/components/search-field.css`) · 코드와 모두 같고, Component 체크섬(733 · 89299fb3)과 세트 스크린샷(2060×568 픽셀 동일)도 일치해 **반영할 변경이 없습니다**(세 엔진 36/36). 같은 Semantic `border/gray-subtle`를 쓰는 다른 변수(tab 밑줄 hover · dialog · chip · file-uploader 테두리)도 변화 없음. Semantic `fill/secondary/strong/hover · pressed` 드리프트(F100)는 그대로 남아 있습니다.

### Radio 재대조 — Figma `radio` 변경 없음 (2026-10-28)

Figma `radio` 세트(102:2677, 24개)를 최신 원본으로 다시 읽어 변형 · 기하 · 바인딩 · `colors/radio/*` 22개 · 화면(344×252 픽셀 동일)을 스냅샷과 대조했습니다 — **차이 없음**, 세 엔진 24/24 통과. 코드 변경 없이 개발 노트(md 점 8px, 포커스 링 기하)와 동기화 상태만 갱신했습니다.

- **발견한 공통 토큰 드리프트(Radio 무관)**: Figma Semantic `fill/secondary/strong/hover` · `pressed`가 A-1 수정(brand/800 · 900, 2026-10-27 승인)에서 다시 brand/600 · 500으로 돌아감 — Button Secondary · Solid Hover · Pressed 흰 라벨 대비 3.51 · 2.46:1. 코드 · 스냅샷은 그대로 두고 F100에 기록(의도 확인 전까지 동기화하지 않음).

### Link 동기화 — Figma `link` Type 축 (2026-10-28)

Figma `link` 세트(111:1509)가 State=Visited 변형을 **Type 축(Default · Visited)** 으로 분리했습니다(15 → 21개: Size 3 × State 4 + Visited 3, Visited Disabled 없음). 크기 · 패딩 · 간격 · 아이콘 · 텍스트 스타일 · 토큰 값은 바뀌지 않았습니다.

- **방문한 링크의 Hover · Pressed**: 글자 · 아이콘이 `colors/link/label/visited` · `icon/visited`를 유지하고 배경만 `background/hover · pressed`로 바뀝니다(이전 코드는 Hover · Pressed 글자색으로 덮어썼음). Props · 공개 API 변화 없음.
- **검증 자산**: `figma/geometry/link.json` 재추출(21개, 위치 포함) · `figma/reference/link.png`(460×282) · `figma/verify/link.json` 변형 이름 갱신. 스토리 Variants 21칸(Size × Type 행), States에 방문 Hover · Pressed 추가, Interaction play에 클릭 이동 · Enter · 비활성 클릭 무시 검사 추가.

### Password Field 동기화 — Figma `password_field` (2026-10-27)

새 Figma 세트 `password_field`(1440:8466, Type=Outline · Size sm/md/lg · State 8종)를 최신 Figma 기준으로 분석해 `Input type="password"`에 반영했습니다. 라벨 · 테두리 · 배경 · 메시지 · 간격은 `input` 세트와 같은 토큰 · 규칙이어서 일반 Input 쪽은 바뀐 것이 없습니다.

- **눈 아이콘 교체**: 비밀번호를 보이는 동안(Figma State=Focus-on)은 `icon/visibility_off`(새 `EyeSlashIcon`, 24px 그리드)로 바뀝니다. 숨긴 상태는 기존 눈 아이콘 그대로, 색은 `colors/input/outline/icon/*` 상태 토큰.
- **지우기 버튼(X) 없음**: `password_field`에는 어떤 상태에도 지우기 아이콘이 없어 `type="password"`이면 `clearable`의 기본값이 꺼집니다(`clearable`을 명시하면 그대로 동작, Props 타입 변화 없음).
- **검증 자산**: `figma/geometry/password_field.json` · `figma/reference/password_field.png` · `figma/verify/input.json`에 `password_field` 세트 추가(스토리 `Components/Input/Gallery › Password Variants`, 24개 변형). 스토리 `Password States` · 문서 "비밀번호" 절 추가, Interaction play에 아이콘 전환 · 키보드(Enter) · 지우기 버튼 없음 검사 추가.

### 접근성 전체 해결 — Figma 토큰 수정 · 전체 동기화 (2026-10-27, Figma 수정 승인 작업)

앞선 플레이스홀더 동기화(825335a)에서 미해결로 남긴 axe 색 대비 위반 105건을 Figma 원본에서 토큰 단위로 고치고 다시 동기화했습니다. 코드는 바인딩을 그대로 따르므로 컴포넌트 CSS 변경은 제거된 토큰을 쓰던 두 곳(Breadcrumb · Toast)뿐입니다.
Figma 변경 기록: [docs/figma-fix-requests.md X절](docs/figma-fix-requests.md).

- **플레이스홀더 · 안내 · 비활성 구분**: Semantic `text/placeholder` → brand-gray/600(#596475, 흰 바탕 5.89:1 · #f5f6f7 5.54:1)로 복귀(A-1). 안내 글자는 `text/tertiary`, 비활성 라벨은 `text/inactive`(gray/400)로 역할을 나눴습니다 —
  `breadcrumb/label/default` · `file-uploader/helper/default` · `stepper/label/title/locked` · `stepper/label/description/locked` → `text/tertiary`(R9–R11 적용). Select · Table 빈 값 안내는 placeholder 유지.
- **Button · IconButton Secondary Solid**: `fill/secondary/strong/hover` → brand/800(#006247, 흰 라벨 7.27:1), `pressed` → brand/900(#004a38, 10.14:1) — Primary Solid(900 → 800 → 700)와 같은 한 단계씩 어두워지는 규칙, 라벨 · 아이콘 흰색 유지. IconButton은 같은 `button/secondary/solid/*` 토큰을 씁니다.
- **F99 드리프트 12개 정리**: Checkbox · Radio 선택 안 함 테두리 `border/gray`(#778191, 비텍스트 3.87:1) · Hover `border/gray-dark`로 복구(A-2, Figma의 gray-subtle 2.35:1은 오류). Tab 밑줄 한 단계 연하게 · Stepper 현재 단계 배경 `fill/primary/strong/default`는 의도된 변경으로 동기화. Toast `label/title` · `label/body` 변수 추가(코드는 title 사용, `label/default` · `close-icon/default`는 삭제됨 → 닫기 아이콘 `icon/tertiary`).
- **Accordion 크기 토큰 복구(F80)**: Figma에서 지워져 바인딩이 끊겨 있던 `spacing·size·border-radius·border-width/accordion/*` 9개를 Component 컬렉션에 다시 만들고 accordion-item 10개 변형의 여백 · 최소 높이 · 구분선 두께 94곳에 다시 연결(값 변화 없음).
- **Breadcrumb**: Figma가 Role=Open 변형과 `label/focus` · `home-icon/current`를 없애 8개 변형만 남음 — 열린 트리거는 `label/pressed`, 현재 항목 아이콘은 라벨 색, 갤러리 Items 행에서 Open 칸 제거, 기하 · 참조 이미지 재내보내기.
- **스냅샷**: `figma/variables/semantic.txt` · `component-others.txt`가 Figma 체크섬과 전 그룹 일치(semantic 38439d42, compOthers 733 89299fb3). 참조 이미지 재내보내기 — button_basic · button_icon · checkbox · radio · tab_line · tab_filled · stepper_indicator(가로 · 세로) · breadcrumb · breadcrumb-item · input · select · textarea · search-field · file-uploader · file-uploader-item · table_value_editable(+4).
- **접근성 결과**: axe 438 스토리 색 대비 위반 105 → **0건**(438 스토리, 알려진 목록 없이 통과) — [docs/accessibility.md](docs/accessibility.md).
- **남은 항목**: Toast가 Figma에서 제목 + 본문 · "닫기" 텍스트 버튼 구조로 바뀜(F101, 별도 구현), `password_field` 새 세트(F99 — 위 "Password Field 동기화" 절에서 구현), empty-state · data-state · dashboard-filter-bar · table Date Range Picker의 기존 기하 불일치(이번 변경과 무관).

### 플레이스홀더 색 — Semantic `text/placeholder` 전체 동기화 (2026-10-27)

Figma Semantic 컬렉션(모드 1개)의 `colors/text/placeholder`가 brand-gray/**600 #596475 → 400 #a1a8b5**로 바뀌어(2026-10-19 A-1 대비 개선 이전 값) 스냅샷 · 토큰 · 참조 이미지를 갱신했습니다.
Figma MCP로 별칭 관계를 추적한 영향 범위 — Component 변수 13개(모두 직접 별칭, 간접 별칭 없음): `input/outline/placeholder/default` · `input/outline/label/default` ·
`textarea/outline/placeholder/default` · `select/outline/outline/placeholder/default` · `search-field/{outline,solid}/label/{default,hover}` · `date-picker/trigger/outline/placeholder/default` ·
`breadcrumb/label/default` · `file-uploader/helper/default` · `stepper/label/title/locked` · `table/key-value/value/label/default`.
연결된 Figma 컴포넌트: input · password_field(신규 세트, 코드 미구현) · select · textarea · date-picker_trigger(코드 없음) · search-field · breadcrumb · breadcrumb-item ·
file-uploader(안내 문구 5개 상태) · file-uploader-item(파일 정보) · stepper_indicator Locked · table_value_editable.

- **토큰**: `figma/variables/semantic.txt` 한 줄, `npm run tokens` 결과 `src/tokens/semantic.css`(`--colors-text-placeholder`) · `tokens.json`(해석값 16곳). 컴포넌트 CSS는 모두 토큰을 참조하므로 개별 수정 없음.
  FileUploader Disabled 안내 문구는 앞선 임시 규칙(`label/disabled`)을 걷어내고 Figma 바인딩 그대로 `helper/default`.
- **참조 이미지**: file-uploader · file-uploader-item · input · select · textarea · search-field · breadcrumb · breadcrumb-item · stepper_indicator(가로 · 세로) · table_value_editable(+ 변형 4개).
- **접근성(미해결 — 보고만, 색 재조정 없음)**: axe 감사 438 스토리에서 색 대비 위반 **105건**. 플레이스홀더 용도가 맞는 44건(Select 플레이스홀더 29, Table 편집 칸 빈 값 안내 15)은 Figma 결정으로 기록,
  **용도 오류 43건**(Breadcrumb 상위 경로 링크 27 · FileUploaderItem 파일 정보 11 · Stepper 잠긴 단계 제목 5)은 플레이스홀더 토큰에 잘못 묶인 일반 글자라 Figma 바인딩 수정 요청 R9–R11,
  나머지 18건은 Button Secondary Solid Hover · Pressed 흰 라벨(brand/600 · 500)로 이번 변경과 무관(F100). `KNOWN_CONTRAST`에는 넣지 않음 — [docs/accessibility.md](docs/accessibility.md).

### FileUploader Disabled — Figma 동기화 · 드롭 차단 (2026-10-27)

Figma `file-uploader`(651:3945) State=Disabled를 다시 읽어 비교: 배경 `background/disabled`(surface/container #eff0f3) · 점선 테두리 `border/disabled`(#c9ced6) ·
제목 `label/disabled`(text/inactive #a1a8b5) · 아이콘 `icon/default` · 불투명도 없음 — 구조와 여백은 다른 상태와 같고 코드도 이미 같았습니다.
유일한 차이는 안내 문구: Figma는 `helper/default`(= `text/placeholder`)인데 **Figma 파일의 `text/placeholder`가 brand-gray/400(#a1a8b5)으로 되돌아가 있어**
2026-10-19 승인된 A-1 대비 결정(gray/600 #596475, 5.89:1)과 충돌합니다(9개 컴포넌트 플레이스홀더 · 정보 글자가 2.35:1로 내려감 — [docs/figma-issues.md F98](docs/figma-issues.md)).

- **화면 변경 — Disabled 안내 문구**: 비활성일 때 안내 문구를 `label/disabled`(text/inactive, #a1a8b5)로 — Figma Disabled와 같은 색이며 비활성 컨트롤이라 대비 예외.
  공유 토큰 `text/placeholder`는 A-1 값(gray/600)을 유지해 다른 상태 · 다른 컴포넌트는 변화 없음(토큰 되돌림 여부는 결정 필요, 되돌릴 경우 작업 트리의 미커밋 내보내기 사용).
- **Fixed — 비활성 드롭 차단**: 전에는 비활성 영역에 파일을 놓으면 브라우저 기본 동작(파일 열기)이 그대로였음. 이제 비활성 버튼은 포인터를 받지 않고(`pointer-events: none`)
  바깥 `.ds-file-uploader__root`가 dragenter · dragover · drop을 막아(`dropEffect = 'none'`) "놓을 수 없음" 커서만 보입니다. 클릭 · Enter · Space · Tab 순서 제외 · 파일 선택 창은 기존대로 막힘.
  DOM에 래퍼 `div.ds-file-uploader__root`가 하나 추가됨(`className` · `style` · `id` · ref는 그대로 버튼 · 입력에).
- **스토리 · 문서**: `Disabled` 스토리에 상태 · 차단 검사(play), 사용 방법 문서의 상태 · 접근성 설명. 참조 이미지는 Disabled 변형만 현재 Figma로(나머지 4개는 A-1 상태 유지 — verify 설정 `//reference`).

### DropdownMenu — Figma 메뉴 패널 컴포넌트 동기화 (2026-10-27)

Figma Dropdown Menu(179:2465)에서 예시 프레임이던 메뉴 패널이 컴포넌트 `dropdown-menu`(1440:8454, 200px: 제목 · 아이콘 항목 · 구분선 · 화살표 항목)와
`dropdown-menu-sub`(1440:8455, 140px, 글자만 · "더보기...")로 바뀌었습니다. Figma MCP로 다시 읽어 비교한 결과 `dropdownmenu_item` 5개 변형 · `dropdownmenu_line` ·
`colors/dropdown-menu/*` 변수 20개 · 글자 스타일 · 여백(항목 8/4/8/10 · gap 8 · 모서리 4, 제목 8/8/2/8, 패널 p-1 · 테두리 1px · elevation-3)은 스냅샷과 같아 **컴포넌트 코드와 토큰은 변경 없음**.

- **검증 추가**: 두 패널 컴포넌트를 parity 검사에 포함 — `figma/geometry/dropdown-menu*.json` · `figma/reference/dropdown-menu*.png`(그림자 때문에 원점 8, 7) ·
  `figma/verify/dropdown-menu.json` 세트 2개(`figmaPrefix` menu: · sub:), 갤러리 스토리 `Menu`(components-dropdownmenu-showcase--menu-matrix). 항목 · 제목 · 구분선 · 아이콘 · 화살표 위치와 픽셀이 세 엔진에서 일치.
- **문서**: sync-status · component-inventory에 패널 컴포넌트 반영, Figma 관찰 사항 F97.

### DatePicker 연도 · 월 버튼 — Figma button_text 동기화 (2026-10-27)

Figma `date-picker_header`(144:1377)의 연도 · 월 `button_text` 인스턴스가 **Type=Primary, Size=md, Right Icon(CaretDown)만**으로 바뀌어(이전 Secondary) 그대로 반영했습니다.
Figma MCP로 원본을 다시 읽어 확인: 변수 체크섬(Primitive · Theme · Semantic · Component colors/button*)과 글자 · 효과 스타일은 스냅샷과 같고, button_text 변형 16개의 여백(sm 4/2 · gap 2, md 6/2 · gap 4) · 모서리 4px · 글자 스타일(xs · sm medium) · 토큰 바인딩도 변함없음.

- **화면 변경 — `DatePicker` · `Calendar` 헤더**: 연도 · 월 버튼 글자 `colors/button_text/primary/label/*`(기본 #404b5d, Hover · Pressed #131c2b),
  아이콘 `primary/icon/*`(기본 #778191, Hover · Pressed #404b5d). 전에는 secondary(글자 #596475, 아이콘 #a1a8b5). 배경 Hover · Pressed 토큰은 두 Type이 같아 변화 없음.
  Props · 공개 API · 연도 · 월 선택 동작 · 키보드 조작은 그대로이며, 공통 `TextButton`은 바꾸지 않음(헤더의 `data-variant`만 변경).
- **Focus**: Figma button_text에 새로 추가된 `Focus` 속성(포커스 테두리 — `colors/border/focus` 2px, 버튼 밖 2px, 모서리 8px)은 기존
  `.ds-button-base:focus-visible` 규칙(outline 2px · offset 2px)과 같은 모습이라 코드 변경 없음.
- **스냅샷 · 검증**: `figma/reference/date-picker_calendar.png`를 현재 Figma(세트 1339:6880)로 다시 내보냄(기하 스냅샷은 동일해 그대로). `Year / Month Selection` 스토리에 Primary 색 검사 추가.
  Figma 컴포넌트 설명 "Year/month use Secondary TextButton"은 이제 원본과 다름 — [docs/figma-issues.md F96](docs/figma-issues.md).

### 검수 준비 (2026-10-20, Figma와 함께 · 배포하지 않음)

디자이너 검수 전 남은 핵심 사항 — 디자인 결정 V-1 – V-5를 기존 Figma 디자인 시스템 기준으로 확정해 Figma에 먼저 만들고 코드에 반영했습니다.
Figma 기록: [docs/figma-fix-requests.md W절](docs/figma-fix-requests.md#w-검수-준비--v-1--v-5-디자인-정책-확정-2026-10-20-사용자-승인-작업).

- **Added — 도움말(V-1)**: `messageType` `'helper'`(아이콘 없는 회색 글자, 비활성 칸은 흐린 색) — `Input` · `Textarea` · `Select` · `DatePicker`.
  `FIELD_MESSAGE_TYPES`에 `'helper'` 추가.
- **화면 변경 — 메시지 기본 종류**: `messageType`을 정하지 않은 메시지는 이제 회색 도움말(`helper`)입니다(전에는 파란 `info`). 파란 안내가 필요하면
  `messageType="info"`. 오류(`invalid`)는 그대로 `error`.
- **Added — 주의(V-3)**: `Alert` · `Toast`의 `status="warning"`(주황 삼각형), `ALERT_STATUSES`에 `'warning'`, 아이콘 `WarningFillIcon`,
  토큰 `--colors-alert-status-icon-warning` · `--colors-toast-border-warning` · `--colors-toast-status-icon-warning`. `showToast(…, { status: 'warning' })`는 오류처럼 닫을 때까지 남습니다.
- **Added — 묶음 오류(V-5)**: `CheckboxGroup` · `RadioGroup`의 `invalid` · `message` — 묶음 아래 오류 메시지(메시지만 있으면 도움말), 항목에 `aria-invalid` · 설명.
- **정책 확정(코드 변화 없음)**: 처리 중은 Disabled 버튼 + 옆 `Loading`(sm)(V-2), `Dialog`는 한 가지 크기 420px · 입력이 많으면 화면으로(V-4) — 사용 방법 문서에 반영.
- **Fixed — 접근성**: `BadgeCount`에 `aria-label`이 있으면 `role="img"`(일반 `<span>`의 이름은 읽히지 않을 수 있었음), `FilterChipSelect` 칩 이름이
  라벨을 두 번 읽던 문제("상태 상태" → "상태").
- **Fixed — 콜백**: `DataState onAction` · `FileUploaderItem onRemove` · `onDownload` · `ImageUploadPreview onRemove` · `Toast onClose`에 클릭 이벤트가 넘어가던 문제
  (타입은 인자 없음 — 선택 인자가 있는 함수를 넘기면 이벤트가 들어갔음).
- **스토리**: 도움말 · 주의 · 묶음 오류 사용 예와 검사, 입력 화면 예시에 도움말 · 필수 동의 오류(Figma 예시와 같음).

### v1.0 테스트 후보 rc.1 (2026-10-20, Figma와 함께 · 배포하지 않음)

개발팀 검토용 후보입니다(로컬 태그 `checkpoint/v1.0-candidate`). npm · Storybook 배포와 정식 `1.0.0` 출시는 하지 않았고, `package.json` 버전도 바꾸지 않았습니다(버전 번호는 D2 결정). 후보 범위 · 시험 결과 · 남은 결정: [docs/v1.0-candidate.md](docs/v1.0-candidate.md).
Figma 변경 기록: [docs/figma-fix-requests.md V절](docs/figma-fix-requests.md#v-v10-후보--figma-디자인-시스템-독립-점검--보완-2026-10-20-사용자-승인-작업).

- **Added — 필수 입력**: `Input` · `Textarea` · `Select` · `DatePicker`의 `required` — 라벨 뒤 4px 점(Figma `Required`, 토큰
  `--colors-<칸>-…-required-default`) + 입력 요소 `required`. `Select`는 버튼 설명으로 "필수"를 전달합니다.
- **Added — 업로드 실패**: `FileUploaderItem status="error"`(Figma `State=Error`) — 파일 정보 오류 색, "삭제" 버튼 유지, 버튼 설명에 실패 이유.
  `FILE_UPLOADER_ITEM_STATUSES`에 `'error'` 추가.
- **Added — 사용 예시**: Storybook `사용 예시/입력 화면 · 대시보드 화면 · 목록 화면`(Figma 사용 예시 화면과 같은 구성).
- **Added — 토큰**: 필수 표시 4개 · `--colors-file-uploader-helper-error`, 효과 `--effect-elevation-segmented-selected` · `--effect-elevation-slider-handle`
  (기존 그림자와 같은 값).
- **화면 변경 — 표**: `Table` 머리글 · 본문 칸 내용을 가운데 정렬(모든 Figma 표 칸 · 예시와 같음). 열마다 다른 정렬(긴 글 왼쪽 · 숫자 오른쪽) 옵션은 검토 항목입니다(V-13).
- **Added — 표 `id`**: `TableProps`에 `id`(실행 시에는 이미 `<table>`에 전달됐지만 타입이 막고 있었음 — 외부 프로젝트 점검에서 발견). `aria-controls` 대상 등에 씁니다.
- **Fixed**: `BreadcrumbItem open`에 마우스를 올리거나 누를 때 글자 색이 기본 색으로 바뀌던 문제(Figma Role=Open Hover · Pressed는 `label/focus`).
- **내부**: 입력 칸 글자 색이 Figma가 연결한 `…-value-*` · `…-placeholder-*` 토큰을 씁니다(값 같음, 화면 변화 없음).
- **스토리**: 상호작용 테스트 3개(DropdownMenu 접근성 · Table 동작 · 목록 화면)가 React Aria 목록이 그려질 때까지 기다립니다 — Storybook 화면에서 실패로 표시되던 문제(테스트 실행은 통과).
- **검증 도구**: `verify-figma`가 글자 색도 비교합니다(글자 상자의 가장 진한 픽셀. Chromium은 채널 차 ≤ 40, Firefox · WebKit은 같은 색의 안티에일리어싱
  농도 차이만 허용). Figma 기준 이미지 전체(71세트) 재캡처.

### 문서 · 정책 간소화 (2026-10-20, Figma와 함께)
처음 보는 사람도 바로 이해할 수 있게 Figma · Storybook의 설명을 정리하고, 기술 정보는 개발 문서로 옮겼습니다([docs/README.md](docs/README.md)).
컴포넌트 · Props · 타입 · 토큰은 바뀌지 않았습니다.
- **Storybook**: 사이드바 · 스토리 이름 한국어(`컴포넌트/<Name>/사용 방법` · `전체 보기` · `직접 체험` · `비활성` …). 스토리 ID는 그대로(`id` 고정) —
  자동 생성 컴포넌트 문서 페이지만 `…--docs` → `…--문서`. 사용 방법 37쪽 · 디자인 토큰 페이지를 쉬운 한국어로 다시 썼고 Figma 노드 · 변수 ID,
  버전명, 변형 수, 작업 이력, 정책 항목 ID, 내부 파일 경로를 뺐습니다. Props 설명 · 컴포넌트 설명(JSDoc)도 한국어.
- **개발 문서**: 컴포넌트별 개발 노트 [docs/components/](docs/components/)(Figma ↔ Props, 토큰, 정책 항목, 구현 세부), 정책 상세 기준
  [docs/policy-details.md](docs/policy-details.md), Figma 동기화 · 재매핑 절차 [docs/figma-sync.md](docs/figma-sync.md).
- **Figma**: Design System Rules 02–09장을 짧은 규칙(정책 · 적용 대상 / 사용 규칙 / 디자인 기준)으로, 10장(개발 구현 세부) 삭제, 기술 주석 17개 삭제,
  컴포넌트 설명 정리 — [docs/figma-fix-requests.md T절](docs/figma-fix-requests.md#t-정책--설명-간소화-2026-10-20-사용자-승인-작업).
- **검증 도구**: Figma 세트를 노드 ID가 없으면 이름으로 찾음(복제 · 새 버전 파일), `figma/component-map.json`(컴포넌트 ↔ 세트 이름), Figma 내보내기 스크립트 `SET_NAME`.

### Figma × Storybook 전체 동기화 (2026-10-19 밤, Figma와 함께)
Figma 변경 기록: [docs/figma-fix-requests.md S절](docs/figma-fix-requests.md#s-figma--storybook-전체-동기화-2026-10-19-밤-사용자-승인-작업),
호환성: [docs/breaking-changes.md](docs/breaking-changes.md), 컴포넌트별 상태: [docs/sync-status.md](docs/sync-status.md).
- **Fixed — Chart 툴팁**: 화면 밖 차트의 툴팁이 화면 가장자리로 밀려 다른 차트 위에 남던 문제. 툴팁을 `<body>` 포털 대신 자기 그림 영역 안에 그리고,
  보이는 부분(화면 · 잘림 조상 ∩ 그림 영역) 안에 배치합니다(CHAR-01 · CHAR-08). 다중 차트 스토리 `MultipleCharts` 추가.
- **Added — `FilterChipSelect`**: 필터 칩 + 선택 목록(다중: 닫을 때 적용 / 단일: 고르면 적용 · "전체"로 해제), 칩 글자 "필터명: 값, 값"(`filterChipText`).
  Table 편집 칸 Filter 목록도 이 컴포넌트(F76).
- **Added**: `SelectOption checkIcon`(Figma Check Icon), `TableEmptyColumn aria-label`.
- **접근성**: Storybook 사이드바 경고 25개 스토리 → 0(원인 수정 — 달력 날짜 칸 이름, 메뉴 항목 이름, 빈 표 머리글, 아이콘 `role="img"`, 고유 nav 이름 등).
  `npm run verify:a11y`가 애드온과 같은 axe 기본 규칙 · 제외 없음.
- **화면**: Select 옵션 md Disabled 글자(F6), Search Field Solid 오류 테두리(E8, 새 토큰 `--colors-search-field-solid-border-error`).
- **Chart 토큰 개편 동기화(F84)** — **호환성 변경**: `--colors-chart-bar-*` → `-gradient-start/end-default`, `--colors-chart-line-*` → `-default`,
  `--colors-chart-legend-label-default` → `--colors-chart-label-legend-default`, Semantic `--colors-chart-grid-default` · `--colors-chart-simple-*` 삭제,
  계열 02 · 03 · 04 토큰 추가. 격자 · 기준선 #d6dae0, 툴팁 배경 불투명, 툴팁 계열 이름 최소 40 · 최대 80px. 토큰 생성기가 Figma 투명도 별칭을
  `color-mix()`로 생성.
- **Lint**: `npm run lint`가 CSS 주석이 `*/`로 일찍 닫히는 경우를 찾습니다(`scripts/check-css-comments.mjs` — 차트 그라디언트 규칙이 버려졌던 원인).

### 코드 정책 → Figma 공식 정책 (2026-10-19, Figma와 함께)
코드에만 있던 정책 152개를 Figma에 정의하거나(변형 · 속성 · 변수 · 스타일 39개, Design System Rules 02–09장 · 주석 96개) 개발 구현(15개)으로
나누었습니다. 남은 Figma 반영 대기 2개. 목록 · 출처 · 상태: [docs/code-policy-audit.md](docs/code-policy-audit.md).
- **Added**: 토큰 `--colors-border-focus`(brand/700) · `--colors-dialog-scrim-default`(→ `surface/scrim`). Storybook **Foundations / Focus**.
- **포커스 표시**: 모든 포커스 가능한 컨트롤에 키보드 포커스 링(2px `colors/border/focus`, 바깥 2px — 폭을 채우는 행은 안쪽) — Figma 속성 `Focus`.
  Select 닫힌 상태는 Figma State=Focus 테두리. 마우스 클릭에는 그리지 않습니다.
- **Dialog**: 모달 덮개 검정 50%(`colors/dialog/scrim/default`). 토큰 `--colors-surface-scrim` 검정 90% → 50%.
- **Toast**: 한 번에 최대 3개(이전 5), `showToast`의 `status: 'error'` 기본 `timeout`이 `null`(닫을 때까지 유지), 같은 문구 · 상태는 보이는 토스트를 대체.
- **Tooltip**: `delay` 기본값 1500 → 500ms(키보드 포커스는 그대로 즉시).
- **CheckboxGroup · RadioGroup**: 항목 간격 세로 8px · 가로 16px(이전 0 — `style` · `className`으로 준 간격은 그대로 우선).
- **토큰 값**: `--typography-sm-leading-normal-underline-line-height` 140% → 20px(`leading-5`, Link md — 화면은 이미 20px 줄).
- 문서: 모든 Usage의 "코드 정책" 절을 **정책** 절(Figma 정의 · Figma 문서화 · 개발 구현 세부 · Figma 반영 대기)로 재분류.

### 호환성 변경 (Figma 동기화 2026-10-19 — F31)
- **토큰 CSS 변수 삭제 · 이름 변경 17개**: `--colors-button_text-*` 12개 → `--colors-button_text-primary-*`(Secondary는 `-secondary-*` 새로 추가),
  `--colors-accordion-border-focus` → `--colors-accordion-border-hover`, `--colors-button-primary-solid-border-{default,disabled}` · `--colors-button-primary-outline-border-disabled` 3개 삭제
  (`--colors-button-primary-outline-border-default`는 Figma 복구로 유지)
  (Figma에서 변수 삭제). 별칭은 두지 않습니다.
- `BUTTON_TONES`에 Secondary · Solid 추가(3번째) — 이제 내부 API.

### 호환성 변경 — 토큰 이름 규칙 (F81)
- 대괄호가 들어간 Figma 변수 이름은 대괄호를 뺀 CSS 변수로 생성합니다(이스케이프 불필요):
  `--border-radius-rounded-\[2px\]` → `--border-radius-rounded-2px`, `\[5px\]` → `5px`, `\[12px\]` → `12px`. 별칭은 두지 않습니다(배포 전).

### Chart — Component 토큰 · hover 변형 (F78 · F79, 2026-10-19 정합성 개선)
- **Added**: Chart Component 토큰 19개 `--colors-chart-{bar,line,point,plot,label,legend,tooltip}-*`(`src/tokens/components/chart.css`, Figma
  `colors/chart/*` Component 변수). `Chart` · `ChartLegendItem` · `ChartTooltip`의 모든 색이 이 토큰을 씁니다.
- **동작 변경**: 간단 스타일(`variant="simple"`)도 호버 · 탭 · 키보드로 항목을 표시합니다(Figma hover=yes) — 그림 영역이 초점을 받는
  `role="group"`이 됨. 기본 스타일 포함 감지 영역은 데이터 영역만(값 눈금 열 · 가로 막대 눈금 줄 제외), 터치로 탭하면 표시되고 바깥을 누르면 닫힘.
- **화면 변경**: 간단 막대 현재 기간 비교 #0086d3 → #d6dae0(Figma `series/compare`), 간단 세로 막대 Group=no 지난 기간 #d6dae0 → #e2e5e9
  (가로와 같은 `bar/history`), 간단 선 마지막 점은 일반 점(빈 원은 활성 항목), 강조 영역 크기 Figma대로(세로 막대 Group=no 40px · 가로 막대
  32 · 46px 높이 · 간단 48 · 28px).
- `ChartLegendItem type="dash-line"`의 `color` 기본값 `brand` → `02`(Figma 메인 컴포넌트 `line/compare`).

### 접근성 — 색 대비 (A-1 · A-2, 2026-10-19, Figma와 함께 수정)
- **토큰 값 변경**: Theme `brand-status/{point,success,warning,danger,error,information}/strong` 600 → 700, Semantic `text/tertiary` ·
  `text/placeholder` gray/500 · 400 → gray/600, `fill/secondary/strong/hover` · `pressed` brand/600 · 500 → brand/800 · 900.
- **Added**: Semantic `--colors-text-inactive`(gray/400) — 비활성 라벨(Button · TextButton · Chip · Table 편집 칸 · FileUploader · Accordion).
- **Component 토큰 별칭 변경**: 입력 칸(Input · Textarea · Select · DatePicker · SearchField Outline) · Checkbox · Radio 테두리 default/completed/read-only
  `border/gray` · hover `border/gray-dark`, Switch 꺼짐 트랙 500 · 600 · 700, Switch Disabled 라벨 `text/disabled`, EmptyState 제목 `text/secondary` ·
  설명 `text/tertiary`, Stepper 잠긴 설명 `text/tertiary`. MetricTrend Disabled 글자 `text/secondary`, 필터 막대 `|` `border/gray-subtle`.
- 결과: axe 색 대비 423 → 0(알려진 대비 목록 삭제 — 이제 실패로 처리), 컨트롤 경계 2.35 → 3.87:1. 전후 표: [docs/accessibility.md](docs/accessibility.md).

### Fixed
- Component 토큰 파일 머리 주석이 `*/`로 일찍 닫혀 Button 외 Component 토큰 `:root` 규칙이 브라우저에서 버려지던 문제(F81 작업에서 생김, 같은 날 수정).

### Figma 수정 반영 (2026-10-19, [docs/figma-fix-requests.md](docs/figma-fix-requests.md))
- 화면 변화 없는 바인딩 복구: Button Primary · Outline 테두리가 `--colors-button-primary-outline-border-default` 사용(리터럴 #004a38 제거),
  12px 모서리는 Figma 변수에서 생성(등록 대기 목록 비움), `sm/leading-normal/underline`의 자간 · 굵기가 변수 참조(값 같음).
- Table 편집 칸 Filter · Editing 칩이 Selected(쇼케이스 · 기준 이미지).
- Chart 가로 막대 비교 막대: 원본이 `chart/series/compare`로 고쳐져 코드와 일치(개별 기준 이미지).

### 화면 변경
- **Button · IconButton Tertiary / Solid 배경**(Figma 2026-10-19 수정): 새 Semantic 토큰 `colors/fill/tertiary/*` — Default #f5f6f7 → #e9ebee,
  Hover #eff0f3 → #dcdfe4, Pressed #e9ebee → #d0d4db(Disabled 그대로). 페이지 대비 1.06 → 1.17:1 — [docs/analysis/tertiary-fill-2026-10-19.md](docs/analysis/tertiary-fill-2026-10-19.md).
- `fill/secondary/subtle/hover` #f9fafb → #f5f6f7(Figma에서 변경됨) — Button Tertiary / Outline Hover, Navigation 항목 Hover.
- Hover 배경(`fill/primary/subtle/hover`) #f9fafb → #f5f6f7 — Button Outline · TextButton · Checkbox · Radio · Chip · DatePicker · Link · Pagination · Select · Tabs · Table · Accordion.
- **TextButton** `variant="secondary"`: 글자 · 아이콘이 Primary보다 한 단계 연함(Figma `button_text/secondary`).
- **Accordion**: 모든 크기 Hover 배경, 펼친 항목 구분선 `border/hover`, Disabled 배경 `fill/disabled` · 제목 `text/placeholder`(F50 해소).
- **Chart**: 가로 막대 기본 스타일 비교 막대를 범례 · 툴팁과 같은 `chart/series/compare`로(F65 — Figma 수정 요청).

### Added
- 토큰 `--colors-fill-tertiary-default` · `-hover` · `-pressed`(Figma Semantic, Primitive gray/150 · 225 · 275 별칭).
  `--colors-button-tertiary-solid-background-{default,hover,pressed}`는 이 토큰의 별칭으로 바뀜(이름 그대로).
- Storybook **Components / Button / Tertiary Background** — Tertiary 배경 변경 전후 비교.
- **Button · IconButton**: Secondary · Solid(Figma 56개 변형, 352개 전체). `appearance`를 생략하면 Secondary는 이전처럼 Outline.
- `closeToast(key)` — `showToast()`가 돌려준 토스트를 코드에서 닫기.
- 공통 토큰 `--border-radius-rounded-12px`(F69, Figma `border-radius/rounded-[12px]`). MetricCard · DashboardFilterBar가 사용.
- 문서: `docs/public-api.md`(공개 49 · 보조 32 · 사용 금지 내부 API, 자동 생성), `docs/breaking-changes.md`, `docs/figma-fix-requests.md`,
  `docs/release-checklist.md`. `api.md`에 분류 표시.

### Deprecated
- 내부 API로 분류(`@internal`, export는 유지 — 1.0 전 제거 여부 결정): `toastQueue` · `resolveAppearance` · `BUTTON_STATES` · `BUTTON_TONES` ·
  `ButtonToneProps` · `ButtonDisabledProp`, 내부 부품 `PaginationItem` · `PaginationControl` · `BreadcrumbItem` · `BreadcrumbSeparator` ·
  `StepperIndicator` · `StepperConnector` · `NavParentItem`과 그 Props 타입.

### Changed
- **Chart**: 툴팁을 `<body>`로 포털(`position: fixed`)하고, 보이는 그림 영역과 화면 안으로 자동 배치(넘치면 뒤집기 · 가장자리에서 이동, 스크롤 · 창 크기 변경 추적). — 2026-10-19 밤 그림 영역 안 배치로 대체(위 "전체 동기화" 절).
  `overflow: hidden` 부모 안에서도 잘리지 않습니다. 테스트에서 툴팁을 찾을 때는 `document`에서 조회하세요.
- **SegmentedControl**: 라벨이 항목 내용 상자보다 넓으면 Figma처럼 좌우 padding까지 쓰고, 항목 전체보다 넓을 때만 말줄임
  (DashboardFilterBar의 "최근 30일"이 잘리던 문제).

### Added
- 개발자 문서: `docs/developer-guide.md`, 자동 생성 API 문서 `docs/api.md`(`npm run docs:api`), Figma 이슈 분류 `docs/figma-issue-triage.md`,
  재분석 `docs/analysis/`(F31 Button 동기화 영향, F65 차트 비교 색, F69 12px 모서리).

## [0.1.0] — 2026-10-16

첫 구현(배포 전). Figma Component 섹션(58:5174)과 Dashboard components 섹션(728:25472) 전체.

### Added
- 디자인 토큰(Figma Variables · Text · Effect Style 스냅샷에서 생성).
- 컴포넌트: Button · IconButton · TextButton, Input · Textarea · SearchField, Select · Checkbox · Radio · Switch · Slider · SegmentedControl ·
  Chip · InputChip · FilterChip, DatePicker · Calendar · FileUploader · Loading, Link · Navigation · Tabs · Pagination · Breadcrumb · Stepper ·
  DropdownMenu, Badge · Progress · Alert · Toast · Tooltip · EmptyState, Dialog · Accordion, Table · KeyValueTable · Card · Chart,
  Skeleton · MetricTrend · DataFreshness · MetricCard · DataState · DashboardFilterBar.
- Figma 정합성 검증(Button 296 + 842 변형, Chromium · Firefox · WebKit), 스토리 테스트, axe 접근성 감사, Storybook MCP.
