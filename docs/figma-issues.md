# Figma 원본 이슈 — 토큰 · Variant 네이밍 (Ver 0.4)

Button 구현 중 **[Platform] Web Design System** (`Ry3WecA6sP6lKPop1vXrTp`, 페이지 `🔵 Ver 0.4`)에서 발견한 항목입니다.
모두 Figma MCP로 읽기 전용 조회해 확인했고, Figma 원본은 수정하지 않았습니다. (확인일 2026-10-16)

각 항목에 **코드 처리**(현재 구현이 어떻게 대응하는지)와 **제안**(디자인 쪽 정리안)을 적었습니다.
우선순위: **높음** = 의도와 다르게 보일 가능성이 있음 · **중간** = 혼동·유지보수 위험 · **낮음** = 정리 권장.

## 요약

| # | 항목 | 우선순위 |
| --- | --- | --- |
| C1 | tracking 변수가 px로 적용됨 (−2.5px) — % 의도로 보임 | 높음 |
| C3 | `sm/leading-normal/underline`이 삭제된 변수 2개에 바인딩 | 높음 |
| A1 | `button_text` Type 값 `SecondarySecondary`, Primary와 동일 | 중간 |
| A5 · A6 | Button 색 바인딩이 다른 Variant 토큰을 참조 | 중간 |
| A12 | Disabled 라벨이 `text/disabled`가 아닌 `text/placeholder` 사용 | 중간 |
| B2 · B3 | 변수 이름의 공백 · 대괄호 (`gray 2`, `rounded-[5px]`) | 중간 |
| B10 | WEB code syntax가 다른 변수를 가리킴 (4건) | 중간 |
| 그 외 | 아래 표 | 낮음 |

## A. Button 컴포넌트 · Variant

| # | 내용 | 코드 처리 | 제안 |
| --- | --- | --- | --- |
| A1 | `button_text`의 Type 값이 `Primary` / **`SecondarySecondary`**. 두 Type은 같은 `colors/button_text/*` 변수에 바인딩되어 화면상 차이가 없음 | Prop은 `'primary' \| 'secondary'`로 정규화, 같은 스타일 | 값 이름을 `Secondary`로 수정하고, 두 Type의 차이를 정의하거나 하나로 통합 |
| A2 | 속성 이름 불일치: `button_basic`·`button_icon`은 **Variant**, `button_text`는 **Type** | 코드에서는 모두 `variant` | 속성 이름 통일 |
| A3 | Variant 옵션 순서: `button_icon` Size `sm, md, xs`, `button_text` Type `SecondarySecondary, Primary` | 영향 없음 | 작은 것 → 큰 것, Primary 우선으로 정렬 |
| A4 | `button_basic`·`button_icon`에 **Secondary / Solid 조합이 없음**. 그런데 `colors/button/secondary/solid/*` 토큰은 존재 | 타입으로 Secondary/Solid 금지 | 조합을 추가하거나, 아래 A5 정리 후 토큰 정리 |
| A5 | `button_icon` **Tertiary / Solid** 배경이 `colors/button/secondary/solid/background/*`에 바인딩 (`button_basic`은 `tertiary/solid`) | Figma 바인딩 그대로 구현 (값은 동일) | `colors/button/tertiary/solid/background/*`로 바인딩 |
| A6 | `button_basic` **Secondary / Outline Hover·Pressed** 테두리가 Shape마다 다름: Square → `secondary/solid/border/default`, Rounded → `secondary/outline/border/default` | `secondary/outline/border/default`로 통일 (값 동일 #007c56) | Square 변형도 `secondary/outline/border/default`로 |
| A7 | 쓰이지 않는 토큰: `*/solid/border/*`(Solid에는 테두리 없음), `*/outline/border/disabled`(Disabled에는 테두리 없음), `colors/button/progress/border`(대응 Variant 없음, 별칭이 아닌 원시값 #ffffff) | 토큰은 생성, 컴포넌트에서는 미사용 | 의도 확인 후 삭제 또는 적용 |
| A8 | `button_text`에 테두리 두께 변수(`border-width/border`)가 바인딩되어 있지만 테두리 색(stroke)이 없음 | 테두리 없음으로 구현 | 바인딩 제거 |
| A9 | `button_text` Variant들이 컴포넌트 세트 안에서 x=24.5 같은 반 픽셀 위치에 배치 | 영향 없음 (Figma 스크린샷이 반 픽셀로 흐리게 렌더링되어 비교 시 참고) | 정수 위치로 정렬 |
| A10 | `button_icon`은 숨겨진 `Label` 텍스트 레이어를 가짐. 한 Variant(Primary/Solid/xs/Rounded/Default)만 숨김 레이어 위치가 다름 | 숨김 Label → 필수 `aria-label` | 영향 없음 (참고) |
| A11 | **Focus 상태가 정의되지 않음** (State: Default · Hover · Pressed · Disabled) | 브라우저 기본 포커스 표시 유지 | 키보드 접근성을 위해 Focus 스타일 정의 |
| A12 | Disabled 라벨·아이콘이 `colors/text/placeholder`·`colors/icon/disabled`(#a1a8b5)를 사용. Semantic에는 별도 `colors/text/disabled`(#c9ced6)가 있음 | Figma 바인딩 그대로 | 의도 확인 (`text/disabled`를 쓸지) |

## B. 변수 이름 · 구조

| # | 내용 | 코드 처리 | 제안 |
| --- | --- | --- | --- |
| B1 | Component 컬렉션 최상위에 그룹 없는 변수 7개: `default`, `hover`, `pressed`, `disabled`, `active`, `selected`, `disabled-selected` | 생성하지 않음 (Button 범위 밖, 이름 충돌 위험) | 어느 컴포넌트용인지 그룹 경로 부여 |
| B2 | `colors/gray`(단계 없음)와 **`colors/gray 2`(공백 포함)**가 같은 값 #f2f2f3 | `--colors-gray`, `--colors-gray-2`로 생성 | 하나로 통합하고 공백 제거 |
| B3 | **`border-radius/rounded-[5px]`** — 이름에 대괄호 | CSS 변수 이스케이프 필요: `--border-radius-rounded-\[5px\]` | `rounded-5` 같은 이름으로 변경 |
| B4 | Radius 크기 순서와 이름 불일치: `rounded`(4) < `rounded-[5px]`(5) < **`rounded-sm`(6)** < `rounded-md`(8) | 값 그대로 | `sm`이 기본보다 크지 않도록 이름 정리 |
| B5 | `colors/white` = #fdfdfd, `colors/black` = #222222 (순백·순흑 아님). 반면 `alpha/white/*`, `button/progress/border`는 #ffffff | 값 그대로 | 이름이 값과 맞는지 확인 |
| B6 | Theme `brand-status/danger`와 `brand-status/error`가 같은 값 (red/600, red/100) | 둘 다 생성 | 용도 구분 또는 통합 |
| B7 | 레이어 건너뛰기·역할 혼용: `colors/button/tertiary/outline/border/default` → Theme 직접 참조, `colors/button_text/background/*` → Primitive 직접 참조, `primary/outline/label/default` → **fill** 토큰, `primary/solid/icon/default` → **text** 토큰 | 별칭 체인을 그대로 보존 | Component → Semantic → Theme → Primitive 순서와 역할(text / icon / fill / border) 일치 |
| B8 | 모든 컬렉션이 모드 1개(`Mode 1`) | 단일 테마로 생성 | 다크 모드 등 계획 시 모드 추가 |
| B9 | `meta/library-version` = `"0.1"`, 페이지 이름은 `Ver 0.4` | 값 그대로 | 버전 동기화 |
| B10 | WEB code syntax가 지정된 변수 45개 중 4개가 **다른 변수 이름**을 가리킴: `file-uploader/icon/drag-over` → `--colors-file-uploader-icon-success`, `file-uploader/background/focus` → `…-background-hover`, `dashboard/background/disabled` → `…-background-default`, `breadcrumb/background/focus` → `…-background-current-subtle` | 코드 이름은 code syntax가 아니라 변수 경로에서 생성 (Button 범위 밖) | code syntax 수정 또는 제거, 전체 변수에 일관 적용 |

## C. 타이포그래피 · 효과

| # | 내용 | 코드 처리 | 제안 |
| --- | --- | --- | --- |
| C1 | **tracking 변수(−5, −2.5, 0, 2.5, 5, 10)가 px로 적용**됨. 예: `3xl/leading-normal/medium` 자간 −2.5px. 바인딩되지 않은 스타일은 % 기준 값을 씀: `3xl/leading-normal/normal` −0.75px(= 30px의 −2.5%), `5xl` −1.2px(= 48px의 −2.5%). 같은 3xl인데 굵기에 따라 자간이 3배 이상 차이 | Figma 실제 적용값(px) 그대로 생성 | 변수 값을 %로 해석하도록 수정하거나 px 값으로 재정의 |
| C2 | 변수에 바인딩되지 않은 자간 값: `xs/normal` 1%, `xl`·`2xl` −0.6px, `3xl/normal` −0.75px, `5xl` −1.2px | 값 그대로 생성 | tracking 변수로 바인딩 |
| C3 | **`sm/leading-normal/underline`이 삭제된 변수 2개에 바인딩**: `font/tracking/normal`(VariableID:359:7941), `font/weight/font-500`(VariableID:359:7905). 줄 높이도 다른 sm 스타일(20px)과 달리 140% | 실제 적용값(자간 0, Medium, 140%)으로 생성 | 현재 변수(`font/tracking/tracking-normal`, `font/weight/font-medium`, `leading-5`)로 다시 바인딩 |
| C4 | 모든 스타일 이름에 `leading-normal`이 붙지만 실제 줄 높이는 고정 px(`leading-3`~`leading-12`) | 이름 그대로 | 이름 규칙 정리 |
| C5 | `file-uploader/label`, `file-uploader/helper`는 **Noto Sans KR**이며 변수 바인딩 없음 (나머지는 Pretendard Variable) | 값 그대로 생성 | 의도 확인 후 Pretendard·변수로 통일 |
| C6 | Effect Style `elevation-1/2/3/6`이 `shadows/*` 변수에 바인딩되지 않음. 색 #0000001f(12%)는 `shadows/color`(5 · 10 · 25%)에 없음. 4·5 단계 없음 | 값 그대로 `--effect-elevation-*` 생성. `shadows/scale/*`은 조합 규칙이 없어 합성하지 않음 | 그림자 변수로 바인딩하고 스케일 정리 |

## E. 입력 필드 (Input · Textarea · Search Field)

| # | 내용 | 코드 처리 | 제안 |
| --- | --- | --- | --- |
| E1 | 값 텍스트가 `colors/input/outline/label/*`에 바인딩(이름은 label). `…/value/*`, `…/placeholder/*` 변수는 쓰이지 않음 | 바인딩 그대로(label 토큰 = 값/플레이스홀더 색) | 값 텍스트를 `value/*`, 빈 상태를 `placeholder/*`에 바인딩 |
| E2 | 필드 라벨이 Component 변수가 아닌 Semantic `colors/text/secondary`에 직접 바인딩(세 필드 공통) | 바인딩 그대로 | Rules 03에 따라 Component 변수 경유 |
| E3 | Textarea 빈 텍스트가 Semantic `colors/text/placeholder`에 직접 바인딩(Input은 Component 변수) | 바인딩 그대로 | Component 변수로 통일 |
| E4 | Textarea Error 카운터가 Input 변수 `colors/input/outline/helper/error`에 바인딩, 현재 글자 수는 Semantic `colors/text/brand`(같은 값의 `textarea/outline/counter/completed` 미사용) | 바인딩 그대로 | `textarea/outline/counter/*`로 통일 |
| E5 | Textarea 카운터 숫자(1 · 50 · 200)는 예시 값 — Error 예시는 최대값(100)을 넘음 | 실제 길이 표시, `maxLength`는 브라우저가 강제 | — |
| E6 | Input 눈 아이콘(`Icon-eye`)이 Default를 뺀 모든 상태에 표시, 아이콘은 하나뿐(숨김/표시 구분 없음) | 비밀번호 표시 토글로 해석(`type="password"`), 상태는 `aria-pressed` | 용도와 숨김 상태 아이콘 정의 |
| E7 | 지우기(X)가 Input은 Hover · Focus, Search Field는 Focus · Error에 표시 — 컴포넌트마다 규칙이 다름 | 각 Figma 규칙 그대로 | 규칙 통일 |
| E8 | **Search Field Solid / Error에 테두리가 없음** — 값 색도 Completed와 같아 오류가 시각적으로 구분되지 않음 | Figma 그대로 | 오류 표현 추가 |
| E9 | Search Field Default · Hover는 `icon_size/icon/MagnifyingGlass`, 나머지 상태는 `MagnifyingGlass` 인스턴스 직접 사용(같은 위치·크기) | 구조 차이 무시, 같은 아이콘 | 인스턴스 구조 통일 |
| E10 | Search Field Solid의 지우기 아이콘이 Outline 변수(`search-field/outline/icon/default`)에 바인딩 | 바인딩 그대로 | Solid 변수 사용 |
| E11 | Search Field에 `helper/*` 변수가 있지만 메시지 Variant 없음, Read-only 상태 없음 | 메시지 · Read-only 스타일 미구현 | 필요 시 Variant 추가 |
| E12 | 메시지 info 색(#0086d3)과 tertiary 텍스트(#778191)가 WCAG AA 미만 | 값 그대로 — [accessibility.md](./accessibility.md) | 대비 4.5:1 이상으로 조정 |

## F. 선택 컨트롤 (Checkbox · Radio · Switch · Select)

| # | 내용 | 코드 처리 | 제안 |
| --- | --- | --- | --- |
| F1 | Checkbox · Radio · Switch · Select(닫힌 상태)에 Focus 상태가 없음 | 브라우저 기본 포커스 링(`:focus-visible`) 유지 | 키보드 포커스 표현 정의 |
| F2 | Switch Disabled 라벨은 `text/tertiary`(#778191), Checkbox · Radio Disabled 라벨은 `text/disabled`(#c9ced6) | 각 바인딩 그대로 | 비활성 라벨 색 통일 |
| F3 | Checkbox · Radio 그룹(여러 항목 배치) 컴포넌트와 항목 간격이 없음 | `CheckboxGroup` · `RadioGroup`은 간격 없는 시맨틱 래퍼, 간격은 사용처에서 지정 | 그룹 간격 · 방향 정의 |
| F4 | Radio md 점이 9px이고 위치가 3.5px(반 픽셀) — 가장자리가 흐리게 렌더링됨 | 값 그대로 | 8 / 10px처럼 짝수 크기 |
| F5 | Select Open의 화살표 색 #404b5d가 변수에 바인딩되지 않음 | 같은 값의 Semantic `colors/icon/secondary` 사용 | Component 변수(`select/…/icon/focus` 등) 바인딩 |
| F6 | **option md Disabled만 `base/leading-normal/underline`(Medium, 밑줄)** — sm · lg Disabled는 Regular, 밑줄 없음 | Figma 그대로 재현(Medium + 밑줄). 밑줄 위치는 엔진 폰트 지표에 따라 Figma보다 약 1.5px 위 | sm · lg와 같은 텍스트 스타일로 통일 |
| F7 | Select 빈 Display Text가 Semantic `colors/text/placeholder`에 직접 바인딩, 값은 `…/label/*` — `…/placeholder/default` · `…/value/*` 변수 미사용 (E1 · E3과 같은 패턴) | 바인딩 그대로 | 값 → `value/*`, 빈 상태 → `placeholder/*` |
| F8 | option Selected에 배경이 없음(`…/option/background/selected` 변수 미사용) | 투명 배경 | 의도 확인 |
| F9 | listbox `scroll`(4×100px 막대)이 옵션 5개로 넘치지 않는 상태에서도 고정 레이어로 표시 | 브라우저 스크롤바 스타일(4px, 둥근 모서리, 토큰 색)로 구현 — 내용이 넘칠 때만 표시, 자동 비교에서 제외(수동 검토) | 스크롤 상태 예시임을 명시 |
| F10 | listbox 최대 높이, 위로 열릴 때의 배치가 정의되지 않음 | 화면 남은 공간에 맞춰 높이 제한 · 위로 뒤집기(react-aria 기본) | 최대 높이 정의 |
| F11 | 옵션의 Hover와 Selected가 겹칠 때, 키보드 이동 중 표현이 정의되지 않음 | 키보드 이동 = Hover 모양, Selected + Hover = Hover 배경 + Selected 글자 | 조합 상태 정의 |
| F12 | Checkbox · Radio 테두리와 Switch 꺼짐 트랙(#a1a8b5)이 배경 대비 2.35:1 — WCAG 1.4.11(비텍스트 3:1) 미만 | 값 그대로 — [accessibility.md](./accessibility.md) | 3:1 이상으로 조정 |
| F13 | **Slider가 다른 라이브러리(원격) 변수에 바인딩** — 간격 `spacing/margin/m-2_5` · `m-2`, radius `radius/max`(100), 그림자 효과 스타일 `md-3,10`(`color/shadow/shadow-3` #051b3c33, 0 4 6 −1), 단위 · 값 라벨 글꼴 변수 | 같은 이름 · 역할의 로컬 토큰 사용(`radius/max` → `rounded-full`), 그림자는 Figma 값을 그대로 재현 | 이 파일의 변수 · 효과 스타일로 교체 |
| F14 | Slider 단위 텍스트 "명" 상자가 글자 1개인데 24px(auto-width가 갱신되지 않은 값) | 실제 글자 너비. 검증 스토리에서만 24px로 맞춰 나머지 배치를 비교 | 텍스트 상자 크기 갱신 |
| F15 | Slider 숫자 필드가 예시 값 "100"에 맞춘 너비(43px) | 가장 긴 값(최솟값 · 최댓값 자릿수)에 맞춘 고정 너비 — 값이 바뀌어도 트랙 길이 유지. 검증 스토리에서만 Figma 너비로 맞춤 | 필드 너비 규칙 정의 |
| F16 | Slider 핸들이 채움 끝보다 2px 오른쪽(x 93, 채움 끝 100.5)에 수동 배치 | 핸들 중심을 값 위치에 맞춤 — 핸들 x는 비교에서 제외, 영역 픽셀 마스크 | — |
| F17 | Slider 채움 막대가 8px 높이로 4px 트랙에 잘려 보임, Pressed 원(#007c5633)이 변수 미바인딩 | 구조 그대로 재현(8px 채움 + 트랙 clip), 원은 핸들 색 20%(`color-mix`) | 채움 높이 정리, 변수 바인딩 |
| F18 | Segmented Control 선택 항목 그림자(#00000017, 0 1 2)가 변수 · 효과 스타일 미연결, md 가로 여백이 `spacing/margin/m-1_5`(padding이 아닌 margin 변수) | 값 그대로 재현 | 효과 스타일 · padding 변수 사용 |
| F19 | Segmented Control 선택 항목의 Hover · Pressed Variant는 없지만 변수(`…/selected/background/hover` 등)는 있음 | 변수 사용(값이 Default와 같아 시각 변화 없음) | Variant 추가 또는 변수 정리 |
| F20 | Chip 아이콘 크기가 세트마다 다름 — sm: chip-multi 16px, chip-input · chip-filter 12px | 각 세트 그대로 | 통일 |
| F21 | chip-filter Selected 배경이 투명, Disabled 배경도 투명(chip-multi는 회색 채움) | 각 세트 그대로 | 의도 확인 |
| F22 | Chip · Segmented Control · Slider에 Focus 상태 없음 (F1과 같음) | 브라우저 기본 포커스 링 | 키보드 포커스 표현 정의 |
| F23 | 성공 메시지 녹색(#00a63e)이 대비 3.16:1 — WCAG AA 미만 | 값 그대로 — [accessibility.md](./accessibility.md) | 4.5:1 이상으로 조정 |
| F24 | Date Picker 빈 상태가 Semantic `colors/text/placeholder` · `colors/icon/placeholder`에 직접 바인딩(`…/placeholder/default` 미사용) | 바인딩 그대로 | Component 변수 경유 |
| F25 | 달력 요일이 영어 자리표시(Su Mo …)인데 월 제목은 한국어(2026년 7월), 요일은 `colors/text/tertiary`에 직접 바인딩(`date-picker/weekday/label/default` 미사용) | 요일 · 월 이름 모두 로캘(ko-KR: 일 월 …), 색은 바인딩 그대로 | 언어 통일, Component 변수 사용 |
| F26 | file-uploader의 "Show Button" 속성이 어떤 레이어에도 연결되지 않음 | 미구현 | 속성 삭제 또는 버튼 추가 |
| F27 | file-uploader-item이 Semantic `surface/page` · `border/gray-subtler`에 직접 바인딩, 다운로드 아이콘이 미바인딩 #404b5d | 바인딩 그대로, 아이콘은 같은 값의 `colors/icon/secondary` | Component 변수 정의 |
| F28 | Loading 간격이 다른 라이브러리(원격) 변수, 그라데이션이 `border/transparency` → `border/brand`(Semantic)에 바인딩 — `loading/spinner/indicator/*` 미사용 | 같은 이름의 로컬 `spacing/margin/m-2_5`, 그라데이션은 바인딩 그대로 | 로컬 · Component 변수 사용 |
| F29 | file-uploader Drag-over 아이콘이 `…/icon/default`(`…/icon/drag-over` 변수 미사용), Pressed가 `…/focus` 변수 사용 | 바인딩 그대로 | 이름 · 바인딩 정리 |
| F30 | **점선 테두리가 변마다 대시 간격을 맞춤**(9.85 ~ 10.25px) — CSS · SVG는 외곽선을 따라 이어 그림 | SVG 6 / 4 대시, 위상만 맞춤 — 테두리 픽셀은 수동 검토 | — |
| F31 | **작업 중 원본 변경**: Button Secondary Solid 신설 · TextButton Secondary 색 분리 · 변수 삭제, `fill/primary/subtle/hover` 값 변경 | 스냅샷 동결(Primitive 추가분만 반영) — [token-diff.md](./token-diff.md) | 동기화 여부 결정 필요 |

## D. 작업 중 관찰된 원본 변경

같은 날 작업 시작 시점과 비교해 원본이 바뀌었습니다.

| 항목 | 시작 시점 | 이후 |
| --- | --- | --- |
| Component 컬렉션 변수 수 | 825 | 755 |
| WEB code syntax 지정 변수 수 | 115 | 45 |

Button에 쓰인 토큰(Primitive · Theme · Semantic · `colors/button*`)과 Text / Effect Style은 체크섬이 그대로 일치합니다
(`npm run figma:checksum` ↔ `figma/checksum.figma.js`). 다른 컴포넌트를 구현하기 전에 해당 그룹을 다시 추출해야 합니다.
