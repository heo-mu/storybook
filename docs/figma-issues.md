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

## D. 작업 중 관찰된 원본 변경

같은 날 작업 시작 시점과 비교해 원본이 바뀌었습니다.

| 항목 | 시작 시점 | 이후 |
| --- | --- | --- |
| Component 컬렉션 변수 수 | 825 | 755 |
| WEB code syntax 지정 변수 수 | 115 | 45 |

Button에 쓰인 토큰(Primitive · Theme · Semantic · `colors/button*`)과 Text / Effect Style은 체크섬이 그대로 일치합니다
(`npm run figma:checksum` ↔ `figma/checksum.figma.js`). 다른 컴포넌트를 구현하기 전에 해당 그룹을 다시 추출해야 합니다.
