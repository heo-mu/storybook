# Figma 원본 이슈 — 토큰 · Variant 네이밍 (Ver 0.4)

Button 구현 중 **[Platform] Web Design System** (`Ry3WecA6sP6lKPop1vXrTp`, 페이지 `🔵 Ver 0.4`)에서 발견한 항목입니다.
모두 Figma MCP로 읽기 전용 조회해 확인했고, Figma 원본은 수정하지 않았습니다. (확인일 2026-10-16)

각 항목에 **코드 처리**(현재 구현이 어떻게 대응하는지)와 **제안**(디자인 쪽 정리안)을 적었습니다.
우선순위: **높음** = 의도와 다르게 보일 가능성이 있음 · **중간** = 혼동·유지보수 위험 · **낮음** = 정리 권장.

**분류(2026-10-19)**: 전 항목을 디자인 결정 필요 / 개발 개선 필요 / 허용 가능한 차이로 나눈 표는 [figma-issue-triage.md](./figma-issue-triage.md),
재분석 문서는 [F31 Button 동기화](./analysis/F31-button-sync.md) · [F65 차트 비교 색](./analysis/F65-chart-compare-color.md) · [F69 12px 모서리](./analysis/F69-radius-12.md).

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
| F32 | `dropdownmenu_line` 세로 padding(`py-1`)과 구분선 두께(`border-width`)가 원격 라이브러리 변수에 바인딩 | 같은 값의 로컬 `spacing/padding/p-1` · `border-width/border` | 로컬 변수 사용 |
| F33 | **breadcrumb Expanded=True**: 메뉴를 여는 … 버튼은 Link Default인데 현재 페이지 항목이 Role=Open(브랜드 색 · semibold), 메뉴는 경로 오른쪽 끝에 정렬(md x 89 · sm x 60) | 메뉴는 … 버튼 아래 2px(시작 정렬), 현재 페이지는 Current 유지, Role=Open은 `BreadcrumbItem open`으로 제공 | 의도 확인 (결정 필요) |
| F34 | breadcrumb-item Hover · Pressed · Open · Current Variant의 아이콘 슬롯이 비어 있음(Link Default만 House) — `breadcrumb/home-icon/hover · pressed · current`, `background/focus` · `border/focus` · `border/menu` 변수는 어디에도 바인딩되지 않음 | 아이콘 색은 같은 이름의 변수 사용, focus · menu 변수는 미사용 | 아이콘 슬롯 채우기, 변수 정리 |
| F35 | breadcrumb "Show Parent"가 Full에서도 상위 페이지를 숨김(경로가 끊김) | Collapsed에만 적용 | 의도 확인 |
| F36 | item_link Unselected Hover 아이콘이 `…/link/unselected/icon/default`에 바인딩 — `…/icon/hover`(icon/secondary) 미사용(item_parent Hover는 `…/icon/hover` 사용) | 바인딩 그대로(Hover에도 기본 색) | 의도 확인 |
| F37 | LNB 예시의 하위 목록 선 · Stepper 연결선이 1px CENTER 선(정수 좌표)이라 반 픽셀(예: 15.5–16.5)에 걸쳐 흐리게 렌더링 | 같은 기하의 SVG rect로 그려 Figma와 같은 픽셀(CSS 배경은 정수 픽셀로 맞춰짐) | 선명한 선을 원하면 0.5px 이동 |
| F38 | Stepper 변수 이름 오타 `colors/stepper/label/title/dafault`(default) | 이름 그대로(토큰은 Figma 이름) | 이름 수정 |
| F39 | Stepper 안의 connector 인스턴스가 padding p-1을 0으로 덮어씀(컴포넌트 자체는 양 끝 p-1) | 컴포넌트는 p-1, Stepper 안에서는 0 | — |
| F40 | Stepper Current 원(`fill/primary/strong/pressed` #007c56)이 Completed(`…/strong/default` #004a38)보다 밝음 | 바인딩 그대로 | 의도 확인 |
| F41 | Stepper 프레임에 애니메이션 참고 링크(heroui.pro stepper)만 있고 시간 · 곡선 값 없음 | 미구현 | 값 정의 |
| F42 | badge_status Outline sm(Basic 제외 12개)에 바인딩되지 않은 흰색(#ffffff) 채움, 나머지 Outline은 채움 없음 | 모두 배경 없음(흰 배경에서 동일) | 채움 제거 또는 변수 바인딩 |
| F43 | badge_count 최소 너비 16 · 높이 16이 변수에 바인딩되지 않음, 텍스트 `xxs`(10px) 스타일 사용 | 값 그대로(16px) | — |
| F44 | Toast 표시 위치 · 여러 개일 때 간격 · 자동 닫힘 시간이 정의되지 않음 | 화면 아래 가운데(아래 `p-5`), 간격 `m-2`, 5초 — 코드 정책 | 정의 필요 |
| F45 | toast 변수 이름 오타 `colors/toast/border/succeess` · `…/status-icon/succeess` | 이름 그대로 | 이름 수정 |
| F46 | toast 높이 36 고정인데 세로 padding p-3(12 + 12 + 내용 20 = 44) — 내용이 가운데로 넘침 | 높이 36 · padding 그대로(같은 위치), 한 줄 말줄임 | padding 정리 |
| F47 | tooltip 그림자(elevation-3)가 채움 없는 루트에 있어 말풍선 + 화살표 전체에 적용 — CSS box-shadow 토큰은 화살표 모양을 따를 수 없음 | 말풍선에만 적용(화살표 그림자 생략) | — |
| F48 | tooltip 트리거와의 거리 · 표시 지연이 정의되지 않음 | 거리 = 화살표 길이 8px, 지연 react-aria 기본 | 정의 필요 |
| F49 | empty-state의 버튼을 끄는 속성이 없음(아이콘 · 설명은 Boolean 있음) | `action` 선택 | 속성 추가 |
| F50 | accordion-item Hover 표현이 변형마다 다름 — 구분선은 모든 Hover에서 `border/hover`, 배경 `background/hover`는 sm · Expanded Hover에만 | Figma 그대로(sm Expanded만 배경) | 통일 여부 결정 |
| F51 | Dialog 뒤 덮개(scrim) 색이 없음 — `dialog/body/default`(검정 90%)는 쓰임이 정의되지 않고 어디에도 바인딩되지 않음 | 덮개 투명 | 덮개 정의 (결정 필요) |
| F52 | accordion 트리거 · 본문 padding과 구분선 두께가 원격 라이브러리 변수에 바인딩 | 같은 값의 로컬 `p-2` · `p-2_5` · `p-3` · `border-width/border` | 로컬 변수 사용 |
| F53 | 작업 중 accordion-item이 14 → 10개로 바뀜(Focus 상태 삭제, `border/focus` → `border/hover` 이름 변경 — F31) | 현재 10개 구현, 토큰은 스냅샷 이름(`border/focus`, 값 동일) | — |
| F54 | table_data 예시 행의 Hover · Pressed가 의미 변수(`fill/secondary/subtle/hover` · `fill/primary/subtle/pressed`)에 직접 바인딩 — 컴포넌트 변수 `table/data/background/hover · pressed`는 미사용 | 컴포넌트 변수 사용 | 바인딩 정리 |
| F55 | table_header Type Empty가 자식 없이 48px 너비로 남아 있음(auto layout 잔여 크기) | 최소 너비 48px | — |
| F56 | table_body · table_value 내용이 반 픽셀 위치(테두리 포함 높이 45 · 51의 가운데)에 놓임 — 브라우저는 글자 · 상자를 정수 픽셀에 그림 | 같은 레이아웃, 글자 위치 0.5px 차이는 알려진 차이로 기록 | — |
| F57 | table_value_editable 안내 글자가 `colors/table/key-value/value/label/hover`(스냅샷 이후 추가)에 바인딩 | 같은 값 `colors/text/tertiary` | 스냅샷 동기화 시 반영 |
| F58 | table_value_editable 샘플 불일치 — Textarea 유형은 편집 시 한 줄 Input인데 채움 값은 두 줄, Date Picker 채움 값이 자리표시("YYYY.MM.DD"), Filter Disabled Empty만 chip-input, 상태마다 예시 문구가 다름 | 한 줄 Input · 실제 날짜, 두 줄 변형 3개는 수동 검토 | 의도 확인 |
| F59 | table_value_editable File Upload 버튼 인스턴스 최소 너비 80px, 이미지 자리표시(#d9d9d9 + 대각선)가 변수 없는 값 · 원격 변수 | 최소 너비는 사용 예에 명시, 자리표시는 스토리 전용 이미지 | — |
| F60 | 카드 그림자가 원격 라이브러리 스타일 `Box Shadow/shadow-sm`(0 1 3 / 10%) — 로컬 효과 스타일에 같은 값 없음(elevation-1은 12%) | `elevation-1` 사용 | 로컬 스타일 추가 또는 elevation-1 사용 (결정 필요) |
| F61 | Card 프레임(185:6512)이 숨김 — 스크린샷 · 내보내기가 1×1로 렌더링되어 픽셀 기준 이미지를 만들 수 없음 | 레이어 값으로 구현, 위치 · 크기만 검증(`geometryOnly`) | 숨김 이유 · 사용 여부 확인 (결정 필요) |
| F62 | chart 샘플 데이터 불일치 — 막대 레이어 이름이 모두 자리표시 값("Bar / 101동 / current / 384"), 툴팁 값 324 · 332가 막대 · 축과 맞지 않음(선 차트 축 최대 240), 날짜 축 선 차트 툴팁 제목이 "104동", 가로 막대 툴팁 "103동"이 102동 행에 표시, 툴팁 계열 이름(이번달/저번달, 전기/가스)과 범례(조회 기간/이전 기간)가 다름 | 데이터로 그림 — 툴팁 · 범례 · 표 모두 `series.label`과 실제 값. 검증 스토리는 그려진 크기에서 값을 역산 | 샘플 정리 |
| F63 | chart 툴팁 위치가 변형마다 손으로 배치됨 — 선: 점 오른쪽 13.09px · 점 높이 가운데, 세로 막대: 항목 가운데(0.2px 차이) · 그림 영역 위, 가로 막대: 막대 위에 겹침. 호버 상태는 막대 Group=yes · 선 변형에만 그려짐 | 선 · 가로 막대: 기준점(점 · 가장 긴 막대 끝) 오른쪽 `p-3` · 세로 가운데, 세로 막대: 항목 가운데 · 그림 영역 위, 넘치면 왼쪽으로 — 코드 정책. 호버 강조는 Group=no에도 적용 — **2026-10-19**: 툴팁을 <body>로 포털, 보이는 그림 영역 · 화면 안으로 자동 조정(뒤집기 · 이동) | 위치 규칙 정의 (결정 필요) |
| F64 | chart 간단 선 차트의 점이 기간 이름 가운데에 있지 않고 간격이 고르지 않음(x 14.5 · 82 · 160 · 238 · 302.5, 이름 가운데 27.2 · 93.6 · 160 · 226.4 · 292.8), 선은 프레임 밖(−2.7 · 320.96)까지 그려져 잘림 | 점은 각 기간 가운데, 선은 첫 · 마지막 구간 기울기로 양 끝까지 이어 그림. 그림 영역은 픽셀 비교 제외(수동 검토) | 점 위치 정리 |
| F65 | chart 비교 계열 색이 변형마다 다름 — 가로 막대 기본 Group=yes 비교 막대 `chart/simple/history`(#e2e5e9)인데 범례 · 툴팁 표시는 `chart/series/compare`(#d6dae0), 세로 막대는 막대 · 범례 모두 compare. 간단 스타일 지난 기간도 세로(Group=no) compare · 가로 simple/history | Figma 변형별 그대로 | 색 통일 (결정 필요) |
| F66 | chart-tooltip 제목 · 값 글자색이 원격 라이브러리 변수 `color/text/tertiary`(#6d7882) · `color/text/primary`(#131416), padding 10 · radius 6도 원격 변수. 차트 안 인스턴스에만 배경 흐림 12가 추가됨(메인 컴포넌트는 그림자만) | 같은 이름의 로컬 `colors/text/tertiary`(#778191) · `colors/text/primary`(#131c2b), 같은 값의 `p-2_5` · `rounded-sm`. 흐림은 `Chart` 안 툴팁에만(`blur(6px)` = 반경 12 / 2) | 로컬 변수 바인딩 |
| F67 | chart 선 모양 — 기본 선 차트 첫 계열만 꼭짓점 모서리 반경 8, 두 번째 계열은 없음. 간단 선 차트 꼭짓점 이음이 섞여 있음(2개 MITER · 나머지 ROUND). 선 · 영역 꼭짓점이 0.3–2.6px 어긋나고 점(마커) 위치도 선과 0.4–0.8px 다름 | 첫 계열 반경 8 · 두 번째 직선(Figma 그대로), 간단 선 이음 둥글게, 점은 선 꼭짓점에 | 통일 |
| F68 | chart-legend-item — 선 차트 Group=yes 두 번째 범례가 Dash Line 인스턴스인데 점선을 지워 실선(series/02), Dash Line 메인 컴포넌트 색은 `chart/series/compare`. 숨김 레이어 "Current values"(간단 스타일 현재 값 칩), "Axis unit"(가로 막대 단위) | 선 차트 범례는 실선 `line`, `ChartLegendItem type="dash-line"`은 메인 컴포넌트대로(Figma가 20px 선에 맞춘 대시 간격 재현). 숨김 레이어는 구현하지 않음 | 의도 확인 |
| F69 | 대시보드 컴포넌트가 원격 라이브러리 변수 사용 — metric-card · dashboard-filter-bar의 padding `padding/6`(16) · 모서리 `radius/xlarge1`(12) · 배경 `color/background/white`(#ffffff), data-state 배경 `color/background/white`. 그림자(0 1 8 / 12%)는 효과 스타일 없이 값만 지정 | 같은 값 `p-4`, 모서리 12px(로컬 모서리 토큰에 12 없음: rounded-lg 10 · rounded-xl 14), `colors/surface/page`(#fdfdfd), 그림자 `elevation-3`(같은 값) | 로컬 변수 · 모서리 토큰 정의 (결정 필요) |
| F70 | skeleton Shape 값 이름 "Shape4"(100 × 10, 이름 없는 변형), Circle 모서리 `rounded-xl`(14)이 24px 원보다 큼 | `shape="shape4"` 그대로, 원은 모서리가 잘려 원형 | 이름 정리 |
| F71 | dashboard-filter-bar 예시 — segmented-control 220px가 라벨보다 좁음(항목 70.67 − 좌우 padding 16 < "최근 30일" 58, Figma는 padding 위로 넘쳐 그림), 초기화 버튼이 스냅샷 이후 추가된 button_icon Secondary · Solid(F31), 컨트롤에 보이는 라벨 없음(Label=false) | **2026-10-19 해결**: SegmentedControl 라벨이 Figma처럼 항목 padding까지 사용(항목보다 길 때만 말줄임) — 해당 라벨 검증 재개. 초기화 버튼은 Secondary · Outline으로 대체(F31), 컨트롤에 `aria-label` 필요 | 예시 크기 · 버튼 정리 |
| F72 | metric-trend Direction에 상태 값 "Disabled"가 섞여 있고, Disabled 3개(Tone별)는 모양이 같음 | `direction="disabled"`(Tone 무시) | Disabled를 별도 속성으로 |
| F73 | data-state Partial 설명 기본값에 실제 수치("130대 중 128대 수신 · 누락된 2대…")가 들어 있음. data-freshness 배지 인스턴스에 변수 없는 흰 배경(#ffffff)이 채워져 있음(Badge Outline은 투명) | Partial 설명 기본값 없음, 배지는 Badge 그대로(흰 배경 위에서 같음) | 샘플 정리 |

## D. 작업 중 관찰된 원본 변경

같은 날 작업 시작 시점과 비교해 원본이 바뀌었습니다.

| 항목 | 시작 시점 | 이후 |
| --- | --- | --- |
| Component 컬렉션 변수 수 | 825 | 755 |
| WEB code syntax 지정 변수 수 | 115 | 45 |

Button에 쓰인 토큰(Primitive · Theme · Semantic · `colors/button*`)과 Text / Effect Style은 체크섬이 그대로 일치합니다
(`npm run figma:checksum` ↔ `figma/checksum.figma.js`). 다른 컴포넌트를 구현하기 전에 해당 그룹을 다시 추출해야 합니다.
