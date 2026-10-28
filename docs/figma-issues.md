# Figma 원본 이슈 — 토큰 · Variant 네이밍 (Ver 0.4)

Button 구현 중 **[Platform] Web Design System** (`Ry3WecA6sP6lKPop1vXrTp`, 페이지 `🔵 Ver 0.4`)에서 발견한 항목입니다.
모두 Figma MCP로 읽기 전용 조회해 확인했고, Figma 원본은 수정하지 않았습니다. (확인일 2026-10-16)
2026-10-19 이후 허용된 Figma 수정(R1 – R8, 정합성 작업, 코드 정책의 Figma 공식 정책화)으로 해결 · 정책화된 항목은 각 행의 **코드 처리**에 표시했습니다.

각 항목에 **코드 처리**(현재 구현이 어떻게 대응하는지)와 **제안**(디자인 쪽 정리안)을 적었습니다.
우선순위: **높음** = 의도와 다르게 보일 가능성이 있음 · **중간** = 혼동·유지보수 위험 · **낮음** = 정리 권장.

**분류(2026-10-19)**: 전 항목을 디자인 결정 필요 / 개발 개선 필요 / 허용 가능한 차이로 나눈 표는 [figma-issue-triage.md](./figma-issue-triage.md),
재분석 문서는 [F31 Button 동기화](./analysis/F31-button-sync.md) · [F65 차트 비교 색](./analysis/F65-chart-compare-color.md) · [F69 12px 모서리](./analysis/F69-radius-12.md).

## 요약

| # | 항목 | 우선순위 |
| --- | --- | --- |
| C1 | tracking 변수가 px로 적용됨 (−2.5px) — % 의도로 보임 | 높음 |
| C3 | **`sm/leading-normal/underline`이 삭제된 변수 2개에 바인딩**: `font/tracking/normal`(VariableID:359:7941), `font/weight/font-500`(VariableID:359:7905). 줄 높이도 다른 sm 스타일(20px)과 달리 140% | **2026-10-19 Figma 수정 완료** — `font/tracking/tracking-normal` · `font/weight/font-medium`(같은 값)으로. 줄 높이도 **2026-10-19** `font/line-height/leading-5`(20px)로(A-4 결정) | — |
| A1 | `button_text` Type 값 `SecondarySecondary`, Primary와 동일 | 중간 |
| A5 · A6 | Button 색 바인딩이 다른 Variant 토큰을 참조 | 중간 |
| A12 | Disabled 라벨이 `text/disabled`가 아닌 `text/placeholder` 사용 | 중간 |
| B2 · B3 | 변수 이름의 공백 · 대괄호 (`gray 2`, `rounded-[5px]`) | 중간 |
| B10 | WEB code syntax가 다른 변수를 가리킴 — **해결(2026-10-19)** | — |
| 그 외 | 아래 표 | 낮음 |

## A. Button 컴포넌트 · Variant

| # | 내용 | 코드 처리 | 제안 |
| --- | --- | --- | --- |
| A1 | `button_text`의 Type 값이 `Primary` / **`SecondarySecondary`**. 두 Type은 같은 `colors/button_text/*` 변수에 바인딩되어 화면상 차이가 없음 | Prop은 `'primary' \| 'secondary'`로 정규화, 같은 스타일 | 값 이름을 `Secondary`로 수정하고, 두 Type의 차이를 정의하거나 하나로 통합 |
| A2 | 속성 이름 불일치: `button_basic`·`button_icon`은 **Variant**, `button_text`는 **Type** | 코드에서는 모두 `variant` | 속성 이름 통일 |
| A3 | Variant 옵션 순서: `button_icon` Size `sm, md, xs`, `button_text` Type `SecondarySecondary, Primary` | 영향 없음 | 작은 것 → 큰 것, Primary 우선으로 정렬 |
| A4 | `button_basic`·`button_icon`에 **Secondary / Solid 조합이 없음**. 그런데 `colors/button/secondary/solid/*` 토큰은 존재 | **2026-10-19 해소**: Figma에 Secondary / Solid 56개 추가 → 동기화로 구현(F31) | — |
| A5 | `button_icon` **Tertiary / Solid** 배경이 `colors/button/secondary/solid/background/*`에 바인딩 (`button_basic`은 `tertiary/solid`) | **2026-10-19 해소**: Figma가 `tertiary/solid`로 다시 바인딩 → 코드도 tertiary 토큰 | `colors/button/tertiary/solid/background/*`로 바인딩 |
| A6 | `button_basic` **Secondary / Outline Hover·Pressed** 테두리가 Shape마다 다름: Square → `secondary/solid/border/default`, Rounded → `secondary/outline/border/default` | **2026-10-19 Figma 수정 완료**(R2) — Square 8개를 `secondary/outline/border/default`로, 값 같음 | — |
| A7 | 쓰이지 않는 토큰: `*/solid/border/*`(Solid에는 테두리 없음), `*/outline/border/disabled`(Disabled에는 테두리 없음), `colors/button/progress/border`(대응 Variant 없음, 별칭이 아닌 원시값 #ffffff) | 토큰은 생성, 컴포넌트에서는 미사용 | 의도 확인 후 삭제 또는 적용 |
| A8 | `button_text`에 테두리 두께 변수(`border-width/border`)가 바인딩되어 있지만 테두리 색(stroke)이 없음 | 테두리 없음으로 구현 | 바인딩 제거 |
| A9 | `button_text` Variant들이 컴포넌트 세트 안에서 x=24.5 같은 반 픽셀 위치에 배치 | 영향 없음 (Figma 스크린샷이 반 픽셀로 흐리게 렌더링되어 비교 시 참고) | 정수 위치로 정렬 |
| A10 | `button_icon`은 숨겨진 `Label` 텍스트 레이어를 가짐. 한 Variant(Primary/Solid/xs/Rounded/Default)만 숨김 레이어 위치가 다름 | 숨김 Label → 필수 `aria-label` | 영향 없음 (참고) |
| A11 | **Focus 상태가 정의되지 않음** (State: Default · Hover · Pressed · Disabled) | **2026-10-19 해결**: Figma 속성 `Focus`(숨김 2px 링, `colors/border/focus`) — 코드는 키보드 포커스 링(Design System Rules 02) | — |
| A12 | Disabled 라벨·아이콘이 `colors/text/placeholder`·`colors/icon/disabled`(#a1a8b5)를 사용. Semantic에는 별도 `colors/text/disabled`(#c9ced6)가 있음 | Figma 바인딩 그대로 | 의도 확인 (`text/disabled`를 쓸지) |

## B. 변수 이름 · 구조

| # | 내용 | 코드 처리 | 제안 |
| --- | --- | --- | --- |
| B1 | Component 컬렉션 최상위에 그룹 없는 변수 7개: `default`, `hover`, `pressed`, `disabled`, `active`, `selected`, `disabled-selected` | 생성하지 않음 (Button 범위 밖, 이름 충돌 위험) | 어느 컴포넌트용인지 그룹 경로 부여 |
| B2 | `colors/gray`(단계 없음)와 **`colors/gray 2`(공백 포함)**가 같은 값 #f2f2f3 | `--colors-gray`, `--colors-gray-2`로 생성 | 하나로 통합하고 공백 제거 |
| B3 | **`border-radius/rounded-[5px]`** — 이름에 대괄호 | **해결(2026-10-19, F81)** — 토큰 생성기가 대괄호를 빼고 생성: `--border-radius-rounded-5px` (이스케이프 없음) | — |
| B4 | Radius 크기 순서와 이름 불일치: `rounded`(4) < `rounded-[5px]`(5) < **`rounded-sm`(6)** < `rounded-md`(8) | 값 그대로 | `sm`이 기본보다 크지 않도록 이름 정리 |
| B5 | `colors/white` = #fdfdfd, `colors/black` = #222222 (순백·순흑 아님). 반면 `alpha/white/*`, `button/progress/border`는 #ffffff | 값 그대로 | 이름이 값과 맞는지 확인 |
| B6 | Theme `brand-status/danger`와 `brand-status/error`가 같은 값 (red/600, red/100) | 둘 다 생성 | 용도 구분 또는 통합 |
| B7 | 레이어 건너뛰기·역할 혼용: `colors/button/tertiary/outline/border/default` → Theme 직접 참조, `colors/button_text/background/*` → Primitive 직접 참조, `primary/outline/label/default` → **fill** 토큰, `primary/solid/icon/default` → **text** 토큰 | 별칭 체인을 그대로 보존 | Component → Semantic → Theme → Primitive 순서와 역할(text / icon / fill / border) 일치 |
| B8 | 모든 컬렉션이 모드 1개(`Mode 1`) | 단일 테마로 생성 | 다크 모드 등 계획 시 모드 추가 |
| B9 | `meta/library-version` = `"0.1"`, 페이지 이름은 `Ver 0.4` | 값 그대로 | 버전 동기화 |
| B10 | WEB code syntax가 실제 CSS 변수와 다른 이름을 가리킴 — 원래 4건(`file-uploader/icon/drag-over` · `file-uploader/background/focus` · `dashboard/background/disabled` · `breadcrumb/background/focus`) + 전체 점검에서 7건 더(`accordion/border/hover` → 이전 이름 `…-border-focus`, `spacing/padding/p-px` · `p-13` · `spacing/gap/overlap-0_5` · `border-width/border-0` · `border-3` · `border-2_5`의 이름 누락 · 변형) | **해결(2026-10-19)** — 11개 모두 생성기 이름(`var(--…)`)으로 수정, 코드 syntax가 있는 86개 전부 일치 | — |

## C. 타이포그래피 · 효과

| # | 내용 | 코드 처리 | 제안 |
| --- | --- | --- | --- |
| C1 | **tracking 변수(−5, −2.5, 0, 2.5, 5, 10)가 px로 적용**됨. 예: `3xl/leading-normal/medium` 자간 −2.5px. 바인딩되지 않은 스타일은 % 기준 값을 씀: `3xl/leading-normal/normal` −0.75px(= 30px의 −2.5%), `5xl` −1.2px(= 48px의 −2.5%). 같은 3xl인데 굵기에 따라 자간이 3배 이상 차이 | Figma 실제 적용값(px) 그대로 생성 | 변수 값을 %로 해석하도록 수정하거나 px 값으로 재정의 |
| C2 | 변수에 바인딩되지 않은 자간 값: `xs/normal` 1%, `xl`·`2xl` −0.6px, `3xl/normal` −0.75px, `5xl` −1.2px | 값 그대로 생성 | tracking 변수로 바인딩 |
| C3 | **`sm/leading-normal/underline`이 삭제된 변수 2개에 바인딩**: `font/tracking/normal`(VariableID:359:7941), `font/weight/font-500`(VariableID:359:7905). 줄 높이도 다른 sm 스타일(20px)과 달리 140% | **2026-10-19 해결**: 같은 값 변수로 다시 바인딩, 줄 높이 `leading-5`(20px) — 토큰 재생성(자간 0, Medium, 20px) | — |
| C4 | 모든 스타일 이름에 `leading-normal`이 붙지만 실제 줄 높이는 고정 px(`leading-3`~`leading-12`) | 이름 그대로 | 이름 규칙 정리 |
| C5 | `file-uploader/label`, `file-uploader/helper`는 **Noto Sans KR**이며 변수 바인딩 없음 (나머지는 Pretendard Variable) | **해결 확인(2026-10-19 밤)**: Figma 글꼴이 Pretendard 텍스트 스타일 | — |
| C6 | Effect Style `elevation-1/2/3/6`이 `shadows/*` 변수에 바인딩되지 않음. 색 #0000001f(12%)는 `shadows/color`(5 · 10 · 25%)에 없음. 4·5 단계 없음 | 값 그대로 `--effect-elevation-*` 생성. `shadows/scale/*`은 조합 규칙이 없어 합성하지 않음 | 그림자 변수로 바인딩하고 스케일 정리 |

## E. 입력 필드 (Input · Textarea · Search Field)

| # | 내용 | 코드 처리 | 제안 |
| --- | --- | --- | --- |
| E1 | 값 텍스트가 `colors/input/outline/label/*`에 바인딩(이름은 label). `…/value/*`, `…/placeholder/*` 변수는 쓰이지 않음 | **해결(2026-10-20 v1.0 후보 점검)** — 입력 칸 값 · 빈 글자를 `value/*` · `placeholder/*` 토큰으로 다시 연결(input · textarea · select · date-picker 72곳, 값 같음). `label/*` 토큰은 이제 값 글자에 쓰이지 않음(이름 정리는 결정 V-8) | 값 텍스트를 `value/*`, 빈 상태를 `placeholder/*`에 바인딩 |
| E2 | 필드 라벨이 Component 변수가 아닌 Semantic `colors/text/secondary`에 직접 바인딩(세 필드 공통) | 바인딩 그대로 | Rules 03에 따라 Component 변수 경유 |
| E3 | Textarea 빈 텍스트가 Semantic `colors/text/placeholder`에 직접 바인딩(Input은 Component 변수) | **해결(2026-10-20 v1.0 후보 점검)** — Textarea 빈 글자 → `colors/textarea/outline/placeholder/default`(값 같음) | Component 변수로 통일 |
| E4 | Textarea Error 카운터가 Input 변수 `colors/input/outline/helper/error`에 바인딩, 현재 글자 수는 Semantic `colors/text/brand`(같은 값의 `textarea/outline/counter/completed` 미사용) | 바인딩 그대로 | `textarea/outline/counter/*`로 통일 |
| E5 | Textarea 카운터 숫자(1 · 50 · 200)는 예시 값 — Error 예시는 최대값(100)을 넘음 | 실제 길이 표시, `maxLength`는 브라우저가 강제 | — |
| E6 | Input 눈 아이콘(`Icon-eye`)이 Default를 뺀 모든 상태에 표시, 아이콘은 하나뿐(숨김/표시 구분 없음) | **2026-10-19 정책화**(Rules 04): 비밀번호 칸에서만 표시, 상태는 `aria-pressed` | 숨김 상태 아이콘은 필요 시 추가 |
| E7 | 지우기(X)가 Input은 Hover · Focus, Search Field는 Focus · Error에 표시 — 컴포넌트마다 규칙이 다름 | **2026-10-19 정책화**(Rules 04): 컴포넌트별 Figma 규칙을 공식 정책으로 — Input Hover · Focus, Search Field Focus · Error, 둘 다 Tab 순서 제외 | — |
| E8 | **Search Field Solid / Error에 테두리가 없음** — 값 색도 Completed와 같아 오류가 시각적으로 구분되지 않음 | **2026-10-19 밤 해결**: Solid Error에 2px 안쪽 오류 테두리(새 변수 `colors/search-field/solid/border/error`) — Figma · 코드 | — |
| E9 | Search Field Default · Hover는 `icon_size/icon/MagnifyingGlass`, 나머지 상태는 `MagnifyingGlass` 인스턴스 직접 사용(같은 위치·크기) | 구조 차이 무시, 같은 아이콘 | 인스턴스 구조 통일 |
| E10 | Search Field Solid의 지우기 아이콘이 Outline 변수(`search-field/outline/icon/default`)에 바인딩 | 바인딩 그대로 | Solid 변수 사용 |
| E11 | Search Field에 `helper/*` 변수가 있지만 메시지 Variant 없음, Read-only 상태 없음 | 메시지 · Read-only 스타일 미구현 | 필요 시 Variant 추가 |
| E12 | 메시지 info 색(#0086d3)과 tertiary 텍스트(#778191)가 WCAG AA 미만 | **해결(2026-10-19, A-1)** — `brand-status/information/strong` sky/700 #006cab(5.53:1), `text/tertiary` gray/600 #596475(5.89:1) — [accessibility.md](./accessibility.md) | — |

## F. 선택 컨트롤 (Checkbox · Radio · Switch · Select)

| # | 내용 | 코드 처리 | 제안 |
| --- | --- | --- | --- |
| F1 | Checkbox · Radio · Switch · Select(닫힌 상태)에 Focus 상태가 없음 | **2026-10-19 해결**: Figma 속성 `Focus`(숨김 2px 링, `colors/border/focus`) — 코드는 키보드 포커스 링(Design System Rules 02), Select는 State=Focus 변형(테두리) | — |
| F2 | Switch Disabled 라벨은 `text/tertiary`(#778191), Checkbox · Radio Disabled 라벨은 `text/disabled`(#c9ced6) | **해결 확인**: Checkbox · Radio · Switch 모두 `text/disabled` | — |
| F3 | Checkbox · Radio 그룹(여러 항목 배치) 컴포넌트와 항목 간격이 없음 | **2026-10-19 정책화**(Rules 08): 그룹 간격 세로 8px · 가로 16px(`m-2` · `m-4`)을 `CheckboxGroup` · `RadioGroup`에 적용 | — |
| F4 | Radio md 점이 9px이고 위치가 3.5px(반 픽셀) — 가장자리가 흐리게 렌더링됨 | 값 그대로 | 8 / 10px처럼 짝수 크기 |
| F5 | Select Open의 화살표 색 #404b5d가 변수에 바인딩되지 않음 | 같은 값의 Semantic `colors/icon/secondary` 사용 | Component 변수(`select/…/icon/focus` 등) 바인딩 |
| F6 | **option md Disabled만 `base/leading-normal/underline`(Medium, 밑줄)** — sm · lg Disabled는 Regular, 밑줄 없음 | **2026-10-19 밤 해결**: Figma 텍스트 스타일 `base/leading-normal/normal`로, 코드 밑줄 재현 삭제 | — |
| F7 | Select 빈 Display Text가 Semantic `colors/text/placeholder`에 직접 바인딩, 값은 `…/label/*` — `…/placeholder/default` · `…/value/*` 변수 미사용 (E1 · E3과 같은 패턴) | 바인딩 그대로 | 값 → `value/*`, 빈 상태 → `placeholder/*` |
| F8 | option Selected에 배경이 없음(`…/option/background/selected` 변수 미사용) | 투명 배경 | 의도 확인 |
| F9 | listbox `scroll`(4×100px 막대)이 옵션 5개로 넘치지 않는 상태에서도 고정 레이어로 표시 | 브라우저 스크롤바 스타일(4px, 둥근 모서리, 토큰 색)로 구현 — 내용이 넘칠 때만 표시, 자동 비교에서 제외(수동 검토) | 스크롤 상태 예시임을 명시 |
| F10 | listbox 최대 높이, 위로 열릴 때의 배치가 정의되지 않음 | **2026-10-19 정책화**(Rules 05 · select 주석): 화면에 맞춰 높이 제한 · 내부 스크롤, 공간이 없으면 위로 | — |
| F11 | 옵션의 Hover와 Selected가 겹칠 때, 키보드 이동 중 표현이 정의되지 않음 | **2026-10-19 정책화**(Rules 02): 키보드 이동 = Hover 모양, 선택 표시(글자 · 체크)가 Hover보다 우선 | — |
| F12 | Checkbox · Radio 테두리와 Switch 꺼짐 트랙(#a1a8b5)이 배경 대비 2.35:1 — WCAG 1.4.11(비텍스트 3:1) 미만 | **해결(2026-10-19, A-2)** — 테두리 `border/gray`(#778191, 3.87:1, hover `border/gray-dark`), 트랙 brand-gray 500 · 600 · 700. 입력 칸 테두리도 같은 규칙 | — |
| F13 | **Slider가 다른 라이브러리(원격) 변수에 바인딩** — 간격 `spacing/margin/m-2_5` · `m-2`, radius `radius/max`(100), 그림자 효과 스타일 `md-3,10`(`color/shadow/shadow-3` #051b3c33, 0 4 6 −1), 단위 · 값 라벨 글꼴 변수 | **해결(2026-10-20 v1.0 후보 점검)** — 손잡이 그림자 → 로컬 효과 스타일 `elevation-slider-handle`(같은 값), 값 라벨 글꼴 변수 → 로컬 같은 이름 변수, 누름 원 → `colors/slider/background/handle/default` 20% | 손잡이 그림자 로컬 효과 스타일 등록 여부 |
| F14 | Slider 단위 텍스트 "명" 상자가 글자 1개인데 24px(auto-width가 갱신되지 않은 값) | 실제 글자 너비. 검증 스토리에서만 24px로 맞춰 나머지 배치를 비교 | 텍스트 상자 크기 갱신 |
| F15 | Slider 숫자 필드가 예시 값 "100"에 맞춘 너비(43px) | 가장 긴 값(최솟값 · 최댓값 자릿수)에 맞춘 고정 너비 — 값이 바뀌어도 트랙 길이 유지. 검증 스토리에서만 Figma 너비로 맞춤 | 필드 너비 규칙 정의 |
| F16 | Slider 핸들이 채움 끝보다 2px 오른쪽(x 93, 채움 끝 100.5)에 수동 배치 | 핸들 중심을 값 위치에 맞춤 — 핸들 x는 비교에서 제외, 영역 픽셀 마스크 | — |
| F17 | Slider 채움 막대가 8px 높이로 4px 트랙에 잘려 보임, Pressed 원(#007c5633)이 변수 미바인딩 | 구조 그대로 재현(8px 채움 + 트랙 clip), 원은 핸들 색 20%(`color-mix`) | 채움 높이 정리, 변수 바인딩 |
| F18 | Segmented Control 선택 항목 그림자(#00000017, 0 1 2)가 변수 · 효과 스타일 미연결, md 가로 여백이 `spacing/margin/m-1_5`(padding이 아닌 margin 변수) | **해결(2026-10-20 v1.0 후보 점검)** — 선택 항목 그림자 → 로컬 효과 스타일 `elevation-segmented-selected`(같은 값) | 효과 스타일 등록 · padding 변수 사용 |
| F19 | Segmented Control 선택 항목의 Hover · Pressed Variant는 없지만 변수(`…/selected/background/hover` 등)는 있음 | 변수 사용(값이 Default와 같아 시각 변화 없음) | Variant 추가 또는 변수 정리 |
| F20 | Chip 아이콘 크기가 세트마다 다름 — sm: chip-multi 16px, chip-input · chip-filter 12px | 각 세트 그대로 | 통일 |
| F21 | chip-filter Selected 배경이 투명, Disabled 배경도 투명(chip-multi는 회색 채움) | 각 세트 그대로 | 의도 확인 |
| F22 | Chip · Segmented Control · Slider에 Focus 상태 없음 (F1과 같음) | **2026-10-19 해결**: Figma 속성 `Focus`(숨김 2px 링, `colors/border/focus`) — 코드는 키보드 포커스 링(Design System Rules 02) | — |
| F23 | 성공 메시지 녹색(#00a63e)이 대비 3.16:1 — WCAG AA 미만 | **해결(2026-10-19, A-1)** — `brand-status/success/strong` green/700 #008236(4.86:1, 옅은 배경 위 4.50) | — |
| F24 | Date Picker 빈 상태가 Semantic `colors/text/placeholder` · `colors/icon/placeholder`에 직접 바인딩(`…/placeholder/default` 미사용) | 바인딩 그대로 | Component 변수 경유 |
| F25 | 달력 요일이 영어 자리표시(Su Mo …)인데 월 제목은 한국어(2026년 7월), 요일은 `colors/text/tertiary`에 직접 바인딩(`date-picker/weekday/label/default` 미사용) | **2026-10-19 해결**: Figma 요일도 한국어(일 월 …)로 — 코드는 로캘 | 요일 색 Component 변수 사용(정리 권장) |
| F26 | file-uploader의 "Show Button" 속성이 어떤 레이어에도 연결되지 않음 | 미구현 | 속성 삭제 또는 버튼 추가 |
| F27 | file-uploader-item이 Semantic `surface/page` · `border/gray-subtler`에 직접 바인딩, 다운로드 아이콘이 미바인딩 #404b5d | 바인딩 그대로, 아이콘은 같은 값의 `colors/icon/secondary` | Component 변수 정의 |
| F28 | Loading 간격이 다른 라이브러리(원격) 변수, 그라데이션이 `border/transparency` → `border/brand`(Semantic)에 바인딩 — `loading/spinner/indicator/*` 미사용 | 간격 **해결(2026-10-19)** — 로컬 `spacing/margin/m-2_5`로. 그라데이션 바인딩은 그대로 | Component 변수 사용 여부 |
| F29 | file-uploader Drag-over 아이콘이 `…/icon/default`(`…/icon/drag-over` 변수 미사용), Pressed가 `…/focus` 변수 사용 | 바인딩 그대로 | 이름 · 바인딩 정리 |
| F30 | **점선 테두리가 변마다 대시 간격을 맞춤**(9.85 ~ 10.25px) — CSS · SVG는 외곽선을 따라 이어 그림 | SVG 6 / 4 대시, 위상만 맞춤 — 테두리 픽셀은 수동 검토 | — |
| F31 | **작업 중 원본 변경**: Button Secondary Solid 신설 · TextButton Secondary 색 분리 · 변수 삭제, `fill/primary/subtle/hover` 값 변경 | **2026-10-19 동기화** — Button 352/352. Primary · Outline 테두리 변수는 Figma에 복구(R1, `VariableID:1033:4608`)되어 코드도 토큰 사용 | — |
| F32 | `dropdownmenu_line` 구분선 두께(`border-width`)가 원격 라이브러리 변수에 바인딩 | **해결(2026-10-19)** — 로컬 `border-width/border`(1)로(Breadcrumb 구분선 8곳도 같이) | — |
| F33 | **breadcrumb Expanded=True**: 메뉴를 여는 … 버튼은 Link Default인데 현재 페이지 항목이 Role=Open(브랜드 색 · semibold), 메뉴는 경로 오른쪽 끝에 정렬(md x 89 · sm x 60) | **해결(2026-10-20)** — 정책(Rules 05)대로 Figma 고침: 현재 페이지 항목 Role=Current, 메뉴는 … 항목 아래 2px 시작 정렬. 새 글자 색 검사가 현재 페이지 글자 색 차이를 찾아 발견 | — |
| F34 | breadcrumb-item Hover · Pressed · Open · Current Variant의 아이콘 슬롯이 비어 있음(Link Default만 House) — `breadcrumb/home-icon/hover · pressed · current`, `background/focus` · `border/focus` · `border/menu` 변수는 어디에도 바인딩되지 않음 | 아이콘 색은 같은 이름의 변수 사용, focus · menu 변수는 미사용 | 아이콘 슬롯 채우기, 변수 정리 |
| F35 | breadcrumb "Show Parent"가 Full에서도 상위 페이지를 숨김(경로가 끊김) | **2026-10-19 정책화**(Rules 07): Show Parent는 Collapsed에만, Full은 전체 경로 | — |
| F36 | item_link Unselected Hover 아이콘이 `…/link/unselected/icon/default`에 바인딩 — `…/icon/hover`(icon/secondary) 미사용(item_parent Hover는 `…/icon/hover` 사용) | 바인딩 그대로(Hover에도 기본 색) | 의도 확인 |
| F37 | LNB 예시의 하위 목록 선 · Stepper 연결선이 1px CENTER 선(정수 좌표)이라 반 픽셀(예: 15.5–16.5)에 걸쳐 흐리게 렌더링 | 같은 기하의 SVG rect로 그려 Figma와 같은 픽셀(CSS 배경은 정수 픽셀로 맞춰짐) | 선명한 선을 원하면 0.5px 이동 |
| F38 | Stepper 변수 이름 오타 `colors/stepper/label/title/dafault`(default) | 이름 그대로(토큰은 Figma 이름) | 이름 수정 |
| F39 | Stepper 안의 connector 인스턴스가 padding p-1을 0으로 덮어씀(컴포넌트 자체는 양 끝 p-1) | 컴포넌트는 p-1, Stepper 안에서는 0 | — |
| F40 | Stepper Current 원(`fill/primary/strong/pressed` #007c56)이 Completed(`…/strong/default` #004a38)보다 밝음 | 바인딩 그대로 | 의도 확인 |
| F41 | Stepper 프레임에 애니메이션 참고 링크(heroui.pro stepper)만 있고 시간 · 곡선 값 없음 | **2026-10-19 정책화**(Rules 09): 상태 전환은 즉시(애니메이션 없음) | — |
| F42 | badge_status Outline sm(Basic 제외 12개)에 바인딩되지 않은 흰색(#ffffff) 채움, 나머지 Outline은 채움 없음 | 모두 배경 없음(흰 배경에서 동일) | 채움 제거 또는 변수 바인딩 |
| F43 | badge_count 최소 너비 16 · 높이 16이 변수에 바인딩되지 않음, 텍스트 `xxs`(10px) 스타일 사용 | 값 그대로(16px) | — |
| F44 | Toast 표시 위치 · 여러 개일 때 간격 · 자동 닫힘 시간이 정의되지 않음 | **2026-10-19 정책화**(Rules 06 · toast 주석): 아래 가운데(`p-5`), 간격 `m-2`, 최대 3개, 안내 · 성공 5초 · 오류는 닫을 때까지, 같은 문구 중복 대체 | — |
| F45 | toast 변수 이름 오타 `colors/toast/border/succeess` · `…/status-icon/succeess` | 이름 그대로 | 이름 수정 |
| F46 | toast 높이 36 고정인데 세로 padding p-3(12 + 12 + 내용 20 = 44) — 내용이 가운데로 넘침 | 높이 36 · padding 그대로(같은 위치), 한 줄 말줄임 | padding 정리 |
| F47 | tooltip 그림자(elevation-3)가 채움 없는 루트에 있어 말풍선 + 화살표 전체에 적용 — CSS box-shadow 토큰은 화살표 모양을 따를 수 없음 | 말풍선에만 적용(화살표 그림자 생략) | — |
| F48 | tooltip 트리거와의 거리 · 표시 지연이 정의되지 않음 | **2026-10-19 정책화**(Rules 05 · tooltip 주석): 거리 = 화살표 8px, 마우스 0.5초 · 키보드 포커스 즉시 | — |
| F49 | empty-state의 버튼을 끄는 속성이 없음(아이콘 · 설명은 Boolean 있음) | `action` 선택 | 속성 추가 |
| F50 | accordion-item Hover 표현이 변형마다 다름 — 구분선은 모든 Hover에서 `border/hover`, 배경 `background/hover`는 sm · Expanded Hover에만 | **2026-10-19 해소**: Figma가 모든 Hover에 배경을 칠하도록 바뀜 → 코드 반영(펼친 항목 구분선 `border/hover`, Disabled 배경도 함께) | md Hover Expanded 위치 정렬(F74) |
| F51 | Dialog 뒤 덮개(scrim) 색이 없음 — `dialog/body/default`(검정 90%)는 쓰임이 정의되지 않고 어디에도 바인딩되지 않음 | **2026-10-19 해결**: `colors/surface/scrim`(검정 50%) → `colors/dialog/scrim/default` 변수와 덮개가 있는 Dialog 예시 추가, 코드 덮개 적용 | `dialog/body/default`(쓰임 없음) 정리 권장 |
| F52 | accordion 트리거 · 본문 padding과 구분선 두께가 원격 라이브러리 변수에 바인딩 | 같은 값의 로컬 `p-2` · `p-2_5` · `p-3` · `border-width/border` | 로컬 변수 사용 |
| F53 | 작업 중 accordion-item이 14 → 10개로 바뀜(Focus 상태 삭제, `border/focus` → `border/hover` 이름 변경 — F31) | 10개 구현, 토큰 `border/hover`(2026-10-19 동기화) | — |
| F54 | table_data 예시 행의 Hover · Pressed가 의미 변수(`fill/secondary/subtle/hover` · `fill/primary/subtle/pressed`)에 직접 바인딩 — 컴포넌트 변수 `table/data/background/hover · pressed`는 미사용 | 컴포넌트 변수 사용 | 바인딩 정리 |
| F55 | table_header Type Empty가 자식 없이 48px 너비로 남아 있음(auto layout 잔여 크기) | 최소 너비 48px | — |
| F56 | table_body · table_value 내용이 반 픽셀 위치(테두리 포함 높이 45 · 51의 가운데)에 놓임 — 브라우저는 글자 · 상자를 정수 픽셀에 그림 | 같은 레이아웃, 글자 위치 0.5px 차이는 알려진 차이로 기록 | — |
| F57 | table_value_editable 안내 글자(355:4281 · 540:24708 · 355:4223)가 **삭제된 변수** `VariableID:355:4282` `colors/table/key-value/value/label/hover`에 바인딩 | **2026-10-19 Figma 수정 완료**(R8) — 원래 연결 대상 `colors/text/tertiary`로, #778191 그대로 | 전용 컴포넌트 토큰 여부([A-3](./figma-fix-requests.md#승인이-필요한-값--정책-변경-변경하지-않음)) |
| F58 | table_value_editable 샘플 불일치 — Textarea 유형은 편집 시 한 줄 Input인데 채움 값은 두 줄, Date Picker 채움 값이 자리표시("YYYY.MM.DD"), Filter Disabled Empty만 chip-input, 상태마다 예시 문구가 다름 | 한 줄 Input · 실제 날짜, 두 줄 변형 3개는 수동 검토 — code-policy-audit TABL-02 "Figma 반영 대기" | 의도 확인 |
| F59 | table_value_editable File Upload 버튼 인스턴스 최소 너비 80px, 이미지 자리표시(#d9d9d9 + 대각선)가 변수 없는 값 · 원격 변수 | 최소 너비는 사용 예에 명시, 자리표시는 스토리 전용 이미지 | — |
| F60 | 카드 그림자가 원격 라이브러리 스타일 `Box Shadow/shadow-sm`(0 1 3 / 10%) — 로컬 효과 스타일에 같은 값 없음(elevation-1은 12%) | **2026-10-19 해결**: Figma Card 예시 그림자를 로컬 `elevation-1`로 — 코드와 같음 | — |
| F61 | Card 프레임(185:6512)이 숨김 — 스크린샷 · 내보내기가 1×1로 렌더링되어 픽셀 기준 이미지를 만들 수 없음 | 레이어 값으로 구현, 위치 · 크기만 검증(`geometryOnly`) | 숨김 이유 · 사용 여부 확인 (결정 필요) |
| F62 | chart 샘플 데이터 불일치 — 막대 레이어 이름이 모두 자리표시 값("Bar / 101동 / current / 384"), 툴팁 값 324 · 332가 막대 · 축과 맞지 않음(선 차트 축 최대 240), 날짜 축 선 차트 툴팁 제목이 "104동", 가로 막대 툴팁 "103동"이 102동 행에 표시, 툴팁 계열 이름(이번달/저번달, 전기/가스)과 범례(조회 기간/이전 기간)가 다름 | 데이터로 그림 — 툴팁 · 범례 · 표 모두 `series.label`과 실제 값. 검증 스토리는 그려진 크기에서 값을 역산 | 샘플 정리 |
| F63 | chart 툴팁 위치가 변형마다 손으로 배치됨 — 선: 점 오른쪽 13.09px · 점 높이 가운데, 세로 막대: 항목 가운데(0.2px 차이) · 그림 영역 위, 가로 막대: 막대 위에 겹침. 호버 상태는 막대 Group=yes · 선 변형에만 그려짐 | **2026-10-19 정책화**(Rules 05 · chart-tooltip 주석): 기준점 옆 12px(`p-3`), 그림 영역 · 화면 안으로 뒤집기 · 이동 — 코드 `placeTooltip` | 예시 배치를 규칙에 맞추면 좋음(선택) |
| F64 | chart 간단 선 차트의 점이 기간 이름 가운데에 있지 않고 간격이 고르지 않았음, 선은 프레임 밖까지 그려져 잘림 | **점 위치 해결(2026-10-19, 원본 변경)** — 점이 기간 가운데(27.2 · 93.6 · 160 · 226.4 · 292.8)로 옮겨져 코드와 같음. 첫 · 마지막 기간 바깥 선은 Figma가 손으로 그림(기울기가 이웃 구간의 40–78%) — 코드는 첫 · 마지막 구간 기울기로 이음, 검증은 양 끝 22px만 제외 | 바깥 선 규칙(필요 시) |
| F65 | chart 비교 계열 색이 변형마다 다름 — 가로 막대 기본 비교 막대 `simple/history`, 간단 스타일 지난 기간 세로(Group=no) `compare` · 가로 `simple/history`, 간단 현재 기간 비교 `series/02` | **해결(2026-10-19)** — R3(기본 가로 Group=yes) 수정, 간단 세로 Group=no 지난 기간 8노드를 `colors/chart/bar/history`로 통일(F78), 간단 현재 기간 비교는 원본이 `series/compare`로 바뀜. 세로 · 가로 막대 같은 규칙. 남은 예외는 F77(지시로 제외) | — |
| F66 | chart-tooltip 제목 · 값 글자색, padding 10 · radius 6이 원격 라이브러리 변수(`color/text/tertiary` #6d7882 · `color/text/primary` #131416 · `padding/4` · `radius/medium1`). 차트 안 인스턴스에만 배경 흐림 12 | **해결(2026-10-19)** — 메인 컴포넌트를 `colors/chart/tooltip/*`(→ 로컬 `text/tertiary` #778191 · `text/primary` #131c2b) · `p-2_5` · `rounded-sm`으로(값 같은 padding · radius), 인스턴스 12개는 상속. 흐림은 효과 스타일 없이 값으로 남음(코드 `blur(6px)`) | — |
| F67 | chart 선 모양 — 기본 선 차트 첫 계열만 꼭짓점 모서리 반경 8, 두 번째 계열은 없음. 간단 선 차트 꼭짓점 이음이 섞여 있음(2개 MITER · 나머지 ROUND). 선 · 영역 꼭짓점이 0.3–2.6px 어긋나고 점(마커) 위치도 선과 0.4–0.8px 다름 | 첫 계열 반경 8 · 두 번째 직선(Figma 그대로), 간단 선 이음 둥글게, 점은 선 꼭짓점에 | 통일 |
| F68 | chart-legend-item — Dash Line 메인 컴포넌트 표시 색이 `chart/series/compare`(회색)인데 쓰이는 곳(선 차트 비교 계열)은 모두 `series/02`. 선 차트 Group=yes 두 번째 범례는 Dash Line 인스턴스에서 점선을 지워 실선. 숨김 레이어 "Current values" · "Axis unit" | **색 해결(2026-10-19)** — Dash Line 표시를 `colors/chart/line/compare`로(선 비교 계열 규칙, F78), `ChartLegendItem type="dash-line"` 기본 색 `02`. 선 범례 실선 · 숨김 레이어 미구현은 그대로 | 숨김 레이어 의도 확인 |
| F69 | 대시보드 컴포넌트가 원격 라이브러리 변수 사용 — metric-card · dashboard-filter-bar의 padding `padding/6`(16) · 모서리 `radius/xlarge1`(12) · 배경 `color/background/white`(#ffffff), data-state 배경 `color/background/white`. 그림자(0 1 8 / 12%)는 효과 스타일 없이 값만 지정 | **2026-10-19 해결**: 모서리 `rounded-[12px]`(R4), padding · 배경을 로컬 `p-4` · `colors/surface/page`로(data-state 포함), 그림자를 효과 스타일 `elevation-3`으로 연결 — 코드와 같음 | — |
| F70 | skeleton Shape 값 이름 "Shape4"(100 × 10, 이름 없는 변형), Circle 모서리 `rounded-xl`(14)이 24px 원보다 큼 | `shape="shape4"` 그대로, 원은 모서리가 잘려 원형 | 이름 정리 |
| F71 | dashboard-filter-bar 예시 — segmented-control 220px가 라벨보다 좁음(항목 70.67 − 좌우 padding 16 < "최근 30일" 58, Figma는 padding 위로 넘쳐 그림), 초기화 버튼이 스냅샷 이후 추가된 button_icon Secondary · Solid(F31), 컨트롤에 보이는 라벨 없음(Label=false) | **2026-10-19 해결**: SegmentedControl 라벨이 Figma처럼 항목 padding까지 사용(항목보다 길 때만 말줄임). 초기화 버튼 Secondary · Solid(F31 동기화 후), 컨트롤에 `aria-label` 필요 | — |
| F72 | metric-trend Direction에 상태 값 "Disabled"가 섞여 있고, Disabled 3개(Tone별)는 모양이 같음 | `direction="disabled"`(Tone 무시) | Disabled를 별도 속성으로 |
| F73 | data-state Partial 설명 기본값에 실제 수치가 들어 있음. badge_status Outline 12개 변형(sm Square · Rounded × Gray · Point · Success · Warning · Danger · Information)에 변수 없는 흰 배경(#ffffff) — 나머지 Outline 30개는 투명 | 배경 **해결(2026-10-19)** — 12개 변형의 흰 채움 삭제(data-freshness 인스턴스도 따라 투명). 설명 기본값은 그대로 | 샘플 정리 |
| F74 | accordion-item md · Hover · Expanded가 y 40 — 같은 줄 다른 변형은 y 20 | **해결(2026-10-19)** — 복구된 1035:15685를 y 20으로 | — |
| F75 | table_value_editable Type=Filter — Editing · Filled(693:7165) 칩이 Unselected, Hover · Filled(693:7167) 칩 State=Default, 693:7165 y 1px | **693:7165 Figma 수정 완료**(R6, Selected · Expanded). 693:7167은 다른 Type과 같은 규칙이라 오류 아님. y 1px은 모든 Editing 변형 공통 | Hover · Empty 칩(F82) |
| F76 | table_value_editable Type=Filter · Editing에 칩 아래 **다중 선택 목록**(listbox sm + option Selected 2개) — 라이브러리에 칩 트리거 + 다중 선택 목록 컴포넌트 없음 | **2026-10-19 밤 해결**: `FilterChipSelect`로 칩 + 다중 선택 목록 구현, Editing 칸에 목록 | — |
| F77 | chart 새 변형 `Type=Bar Horizontal, Style=Default, Group=yes, hover=yes`(1011:14261) 비교 막대 5개(1011:14280 · 14288 · 14296 · 14303 · 14310)가 `chart/simple/history` — R3와 같은 오류 | **해결(2026-10-20 v1.0 후보 점검)** — hover=yes 비교 막대 5노드 → `colors/chart/bar/compare/gradient/*`(hover=no 짝 · 범례 · 툴팁과 같은 색) | R3와 같은 수정 |
| F78 | Chart 전용 Component 변수 없음 — 차트 노드가 Semantic(`chart/series/*` 등) · Primitive(`alpha/*`) · 원격 변수에 직접 바인딩. `Type=Bar Vertical, Style=Simple, Group=yes, hover=yes` 1011:14873 색이 hover=no 짝과 달랐음 | **해결(2026-10-19)** — `colors/chart/*` Component 토큰 19개 생성(막대 · 선 · 점 · 그림 영역 · 글자 · 범례 · 툴팁, `VariableID:1052:6697`–`6715`), 차트 세트 24변형 · 범례 · 툴팁의 보이는 색 778곳 연결(F77 5노드 제외). 1011:14873은 원본에서 짝(762:5921)과 함께 `series/compare`로 바뀌어 일치 | — |
| F79 | chart 세트에 `hover` 속성 추가 — 24개 변형. 간단 스타일에도 호버(안내선 · 빈 원 · 강조 영역 · 툴팁) | **해결(2026-10-19)** — 코드 · 스토리 · 검증 24변형(hover=yes = 활성 항목). 두 스타일 모두 호버 · 키보드 · 탭, 강조 영역 크기 Figma대로, 감지 영역 · 터치 결함 수정. 원본 정리: 1011:14912 막대 배치 · 이름을 짝과 같게, 1011:14987 위치(30, 1334 → 20, 1324), 빈 원의 중복 흰 테두리 5개 삭제 | — |
| F80 | Accordion 프레임 삭제 후 **재등록**(1035:15645, `accordion-item` 1035:15648) — 복구본이 원격 라이브러리 변수 · 텍스트 스타일 사본에 바인딩되어 있었음 | **해결(2026-10-19)** — 색 58개 · 레이아웃 442개 · 글자 변수를 로컬 변수로, 텍스트 스타일 24개를 로컬 스타일로 교체(값 동일). 누락된 Component 토큰 9개(`spacing/accordion/*` · `size/accordion/*` · `border-radius/accordion/default` · `border-width/accordion/default`) 생성 | — |
| F81 | `border-radius/rounded-[2px]`(VariableID:873:4798) WEB code syntax `var(--radius-2px)` — 코드의 CSS 변수는 `--border-radius-rounded-\[2px\]` | **해결(2026-10-19)** — 생성 규칙 개선(`[값]` → `값`): `--border-radius-rounded-2px` · `-5px` · `-12px`. Figma WEB code syntax 3개를 같은 이름으로 | — |
| F82 | table_value_editable Filter · Hover · Empty(693:7163) 칩만 State=Hover — 다른 Type의 Hover · Empty는 컨트롤 Default | Figma 그대로 | 의도 확인 |
| F83 | legacy 화면 시안 19개 프레임이 원격 `radius/xlarge1`(12) 사용 | 변경 안 함(DS 컴포넌트 아님) | 로컬 `rounded-[12px]`로(선택) |
| F84 | **차트 토큰 개편(다른 편집자, 2026-10-19 밤)** — Semantic `chart/grid` · `chart/simple/*` 4개 삭제, Component `colors/chart/bar/<계열>` → `bar/<계열>/gradient/start · end/default`(끝 = 시작 색 40% 투명도 별칭), `line/{primary,compare}` → `line/<계열>/default` + `line/02 · 03 · 04`, `legend/label` → `label/legend`, 격자 · 기준선 → `border/gray-subtler`, 툴팁 배경 → `surface/page`. 샘플 글자 "유형" · 간단 선 기간 "10.07–10.11", 툴팁 계열 이름 최소 40 · 최대 80px. 개편 뒤 차트 노드 91곳이 삭제된 변수 5개(`VariableID:1129:5009` · `1129:5011` · `1113:5029` · `1113:5030` · `1052:6698`)를 가리켰고, WEB code syntax 4개(`line/02 · 03 · 04` → `line-compare`, `label/legend` → 이전 이름)가 틀렸음 | **해결(2026-10-19 밤)** — 91곳을 같은 색의 현재 변수로 다시 연결, code syntax 4개 정정(Figma). 스냅샷 · 토큰 생성기(투명도 별칭 → `color-mix()`) · 차트 CSS · 스토리 샘플 · 기준 이미지 · geometry 동기화 — chart 24 · 범례 3 · 툴팁 1 정합성 3 엔진 통과 | — |
| F85 | 개편에서 **점선이 사라짐** — 범례 `Type=Dash Line` 표시선(703:4817), 간단 선 Group=yes 비교 선(762:5858 · 1011:15054)이 실선 | **복원(2026-10-19 밤)** — 범례 5 / 3, 비교 선 3 / 3(변형 이름 "Dash Line" · Rules 03 "색만으로 구분하지 않음" 근거, 개편 전 값). 디자이너 확인 필요 — 실선이 의도였다면 되돌리고 Rules 03 보완 | 의도 확인 |
| F86 | **남은 원격 라이브러리 바인딩** — table_value 이미지 자리표시 벡터 355:4444 · 355:4445(인스턴스 I507:23893 포함)의 `color/border/gray`(로컬 같은 이름 변수와 값이 다름), 손잡이 그림자(F13), 문서 · 예시 프레임. 컴포넌트 안 아이콘 7곳의 원격 `colors/icon/secondary`는 같은 값 로컬 변수로 교체(2026-10-19 밤) | **해결(2026-10-20 v1.0 후보 점검)** — 컴포넌트 안: 이미지 자리표시 → `colors/surface/overlay` · `colors/border/gray-subtle`, 필터 막대 초기화 아이콘(어두운 회색 원격 변수 — 초록 버튼 위에서 거의 안 보였음) → 버튼 아이콘 토큰, 데이터 상태 텍스트 버튼 아이콘 → `button_text` 아이콘 토큰. 남은 원격 바인딩은 문서 · 예시 프레임의 글자 꾸밈뿐(결정 V-11) | 로컬 변수 지정 |
| F87 | table_value(355:4460)의 Boolean 속성 `Text#355:12` · `Picture#355:23`이 어떤 레이어에도 연결되지 않음(바꿔도 화면 변화 없음) | **해결(2026-10-20 v1.0 후보 점검)** — 연결되지 않은 `Text` · `Picture` 속성 삭제(인스턴스 8개 — 동작 변화 없음) | 속성 삭제 또는 레이어 연결 |
| F88 | Card 부품 컴포넌트 이름이 자동 이름("Frame 2147239186" · "Wrapper") | **해결(2026-10-19 밤)** — `card_header`(218:7173) · `card_footer`(218:7174), 설명 추가. 코드 `CardHeader` · `CardFooter`, 검증 이름 동기화 | — |
| F89 | select State=Focus 변형 3개(1081:7873 · 7878 · 7883)에 속성 연결이 빠짐 — Label · Label Text · Display Text가 Focus 상태에서 적용되지 않음 | **해결(2026-10-20)** — Default 변형과 같은 연결로 복구 | — |
| F90 | input `Icon-eye` 기본값이 켜짐 — 인스턴스 58개 중 53개가 직접 끔(눈 아이콘은 비밀번호 칸에서만 — Rules 04) | **해결(2026-10-20)** — 기본값 끔(비밀번호 칸만 켬). Default 변형에는 눈 레이어가 없어 기존 인스턴스 화면 변화 없음 | — |
| F91 | 사용 예시 설명 문구 오류 — Accordion 예시에 Select 설명, Chip 설명에 Table 설명이 복사되어 있음. 예시 프레임 이름이 "Calendar Container" 등으로 내용과 맞지 않음 | **해결(2026-10-20)** — 설명을 실제 내용으로, 예시 프레임 19개 이름을 "<컴포넌트> 사용 예시" 등으로 | — |
| F92 | file-uploader-item `State=Error`(v1.0 후보 점검에서 추가)의 파일 이름 글자가 `File Name` 속성에 연결되지 않음 — 인스턴스를 Error로 바꾸면 지정한 파일 이름이 기본값으로 돌아감 | **해결(2026-10-20 Storybook 동기화 중 발견)** — 다른 변형과 같은 연결. 파일 정보 줄은 오류 문구("업로드 실패")라 일부러 연결하지 않음(공유 속성의 기본값이 "업로드 완료") | — |
| F93 | slider handle Pressed의 누름 원(684:6472) — v1.0 후보 점검에서 색을 `colors/slider/background/handle/default`에 연결할 때 칠 불투명도 20%가 100%로 바뀌어 진한 초록 고리로 보임 | **해결(2026-10-20 전체 검증에서 발견)** — 연결은 두고 불투명도 20% 복구(원래 #007c5633과 같은 모습) | — |
| F94 | textarea Completed · Error 변형의 메시지 줄("Character count", 글자 수 포함)이 `Alert`에 연결 — 메시지를 끄면 글자 수도 사라짐. Focus는 메시지만 `Alert`에 연결 | **해결(2026-10-20 검수 준비)** — 줄 연결을 풀고 메시지만 `Alert`(Focus와 같게). 파일의 textarea 인스턴스 1개는 영향 없음 | — |
| F95 | toast `Close Icon` Boolean 속성이 어느 레이어에도 연결되지 않아 꺼도 닫기 아이콘이 그대로 | **해결(2026-10-20 검수 준비)** — 4개 변형의 닫기 아이콘(icon_size) 표시를 `Close Icon`에 연결. 코드는 이미 `showClose`(기본 true)로 대응 | — |
| F96 | **DatePicker 헤더 button_text Type 변경(2026-10-27 확인)** — `date-picker_header`(144:1377)의 연도 · 월 `button_text` 인스턴스(1338:5926 · 1435:8258)가 **Type=Primary**, Size=md, Right Icon만(CaretDown). 컴포넌트 `date-picker_calendar`(1339:6880) 설명은 아직 "Year/month use Secondary TextButton". button_text(432:8395)에는 `Focus` Boolean 속성(Focus ring: `colors/border/focus` 2px INSIDE, inset −4px, r 8)이 추가됨. 페이지 이름도 `🔵 Ver 0.4` → `🔵 Ver 0.5` | **코드 반영(2026-10-27)** — 헤더 버튼 `data-variant="primary"`, 참조 이미지 재내보내기. Focus ring은 기존 focus-visible outline(2px · offset 2px)과 같은 모습. 설명 문구는 Figma에서 "Primary"로 고쳐야 함(읽기 전용이라 미수정) | 설명을 Primary로 수정 |
| F97 | **Dropdown Menu 패널 컴포넌트화(2026-10-27 확인)** — 예시 프레임 `dropdownmenu`(217:6198 · 217:6008)가 컴포넌트 `dropdown-menu`(1440:8454) · `dropdown-menu-sub`(1440:8455)로 바뀜(설명 없음, 인스턴스 0개). 패널 테두리 두께 1px이 `border-width/border` 변수에 연결되지 않은 값, `dropdownmenu_line` 세로 여백은 여전히 원격 변수(F86과 같은 종류). 사용 예시 프레임 이름 "dropdown-menu 사용 예시"는 아직 프레임 복사본(217:6484 · 217:6600)을 씀 | **코드 변경 없음** — 패널 스타일은 이미 같음(p-1 · 1px 테두리 · elevation-3). 두 컴포넌트를 parity 검사 세트로 추가(갤러리 `Menu`) | 컴포넌트 설명 추가 · 테두리 두께 변수 연결 · 예시 프레임을 인스턴스로 교체 |
| F98 | **`text/placeholder` brand-gray/600 → 400 (#596475 → #a1a8b5, 2026-10-27 확정)** — A-1(2026-10-19)로 올렸던 값을 디자이너가 의도적으로 되돌림. 직접 별칭 Component 변수 13개(input · textarea · select · search-field · date-picker trigger · breadcrumb · file-uploader helper · stepper locked title · table key-value value label), 연결 컴포넌트 12세트 | **코드 동기화(2026-10-27)** — 토큰 · 참조 이미지 갱신. 흰 배경 대비 2.35:1(AA 미달)로 A-5 재발 — axe 색 대비 위반 보고(CHANGELOG), 색 재조정 · 알려진 목록 등록 없음 | **해결(2026-10-27 저녁, X절)** — brand-gray/600 복귀 + 오용 바인딩 3종 `text/tertiary`(R9–R11), 플레이스홀더 · 안내 · 비활성 토큰 역할 분리 유지 | — |
| F99 | **placeholder 외 Component 변수 드리프트(2026-10-27 관찰, 미반영)** — 스냅샷과 값이 다른 변수 12개: `checkbox/border/unchecked/{default,hover}` · `radio/border/unselected/{default,hover}` gray → gray-subtle / gray-dark → gray(A-2 되돌림), `tab/{primary,secondary}/line/underline/{default,hover,pressed}` 한 단계 연하게, `stepper/indicator/current/background/default` pressed → default, `stepper/label/description/locked` text/tertiary → text/disabled(A-1 되돌림, 1.55:1). 새 변수 `toast/label/{title,body}/default`, 삭제 `spacing·size·border-radius·border-width/accordion/*` 9개 · breadcrumb 색 2개. 새 세트 `password_field`(1440:8466) | **정리(2026-10-27 저녁)** — checkbox · radio 테두리는 A-2로 복구(Figma 수정), tab 밑줄 · stepper 현재 배경 · toast label 변수는 의도된 변경으로 동기화, accordion 크기 토큰 9개 재생성(F80), breadcrumb 변수 2개 삭제는 Role=Open 삭제와 함께 코드 반영. `password_field` 세트는 **2026-10-27 구현** — Input `type="password"`(눈 ↔ visibility_off 아이콘, 지우기 버튼 없음), 24/24 변형 3개 엔진 검증 | — |
| F100 | **Button Secondary Solid Hover · Pressed 대비(2026-10-27 axe 감사에서 관찰)** — `fill/secondary/strong/hover` = brand/600 #009b68(흰 라벨 3.2:1), `pressed` = brand/500 #02bb7b(2.4:1). A-1 기록은 brand/800 · 900이나 커밋된 스냅샷(2026-10-16)과 현재 Figma 모두 600 · 500. **재발(2026-10-28 Radio 재대조 중 관찰)**: Figma Semantic이 다시 brand/600 · 500으로 바뀜(체크섬 semantic efc7719c ≠ 스냅샷 38439d42, 그 외 7개 그룹 일치). 참조: `button/secondary/solid/background/hover` · `pressed`만(Radio 무관). 코드 · 스냅샷은 A-1(800 · 900) 유지 — 의도된 변경인지 결정 필요 | **해결(2026-10-27 저녁, X절)** — `fill/secondary/strong/hover` · `pressed` → brand/800 · 900, Button · IconButton 참조 이미지 재내보내기 | — |
| F101 | **toast 구조 변경(2026-10-27 관찰)** — 세트 91:5927가 54px 높이의 제목(`label/title/default`) + 본문(`label/body/default`) + "닫기" `button_text` 구조로 바뀜(기존 36px 한 줄 + X 아이콘). `label/default` · `close-icon/default` 변수 삭제 | **해결(2026-10-28)** — 제목 + `description` + "닫기" `TextButton`(XCircle fill) 구조로 재구현, 기하 · 참조 이미지 재추출(4개, 320×54), Rules 06 개정(하단 우측 · 모두 5초 · 4번째가 오면 가장 오래된 것 제거) 반영 | — |
| F102 | **accordion-item `Size=sm, State=Default, Expanded=True`의 Trigger에만 `elevation-3` 그림자 효과(2026-10-28 관찰)** — 같은 Expanded 변형 3개(md Default · md Hover · sm Hover)에는 없고, 화면에서도 차이가 보이지 않음(세트 스크린샷 픽셀 동일) | **미반영** — 한 변형에만 있는 효과라 코드에 넣지 않음 | 의도 확인 후 효과 제거 또는 4개 변형에 통일 |
| F103 | **Design System Rules 자체 모순 · 값 없는 참고 링크(2026-10-28 재조회, 227:3774)** — ① 09장 "상태 변화는 애니메이션 없이 바로" 행과 같은 장에 새로 추가된 Segmented Control · Stepper · 펼침 · 닫힘(select · date-picker_calendar · breadcrumb · chip-filter) 애니메이션 행이 충돌하고, 참고 링크(heroui.pro · heroui · shadcn)만 있을 뿐 시간 · 곡선 값이 Figma에 없음(세트의 프로토타입 전환도 모두 즉시). ② 05장 "하위 메뉴를 두지 않음"과 09장 "dropdown-menu-sub = 2depth"가 충돌하며 `dropdown-menu-sub` 세트는 없음. ③ 06장 "처리 중: Disabled 버튼과 Loading(sm)"과 Form 사용 예시 "저장 중"(버튼 안 회전 표시, 코드 Button `loading`)이 다름. ④ 06장 "주의" 행이 빠짐 | **부분 반영** — Skeleton 맥동만 구현(shadcn Skeleton의 공개 값: 불투명도 1 → 0.5 → 1, 2초), 나머지는 즉시 전환 · 하위 메뉴 미지원 · Button `loading` 유지, [policy-details 09장](./policy-details.md#09-움직임)에 기록 | 모순 행 정리, 애니메이션 시간 · 곡선 값, 하위 메뉴 · 처리 중 표현 결정 |

## D. 작업 중 관찰된 원본 변경

> 2026-10-19: 스냅샷을 원본과 다시 맞췄습니다(체크섬 8그룹 일치). 노드 단위 변경(Accordion, Table Filter 칸)은 [F31 분석 7절](./analysis/F31-button-sync.md#7-노드-단위-변경-변수-체크섬에-드러나지-않은-원본-변경).

같은 날 작업 시작 시점과 비교해 원본이 바뀌었습니다.

| 항목 | 시작 시점 | 이후 |
| --- | --- | --- |
| Component 컬렉션 변수 수 | 825 | 755 |
| WEB code syntax 지정 변수 수 | 115 | 45 |

Button에 쓰인 토큰(Primitive · Theme · Semantic · `colors/button*`)과 Text / Effect Style은 체크섬이 그대로 일치합니다
(`npm run figma:checksum` ↔ `figma/checksum.figma.js`). 다른 컴포넌트를 구현하기 전에 해당 그룹을 다시 추출해야 합니다.
