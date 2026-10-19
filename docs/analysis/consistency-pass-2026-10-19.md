# Figma · Storybook 정합성 개선 기록 (2026-10-19)

Figma 원본 수정 · 변수 생성 · 바인딩 변경 · 코드 수정이 모두 허용된 작업의 변경 이력입니다. 그룹별로 수정 → 검증 → 커밋했습니다.
원격 Push · npm 배포 · Storybook 배포는 하지 않았습니다. 시작 시점: Git 태그 `checkpoint/pre-consistency-pass`(71e4f7a).

## 0. 시작 시 원본 재조회

- 변수 · 스타일 체크섬 8그룹: 직전 커밋의 스냅샷과 일치(변수 변경 없음).
- 세트 지문: `chart`(698:4399)가 직전 수정 이후 다시 바뀜(다른 편집), Accordion이 새 ID로 재등록(프레임 1035:15645, `accordion-item` 1035:15648, 예시 1035:15744). 그 밖의 73개 세트는 그대로.

## 1. F81 — 모서리 토큰 이름 (완료)

| 항목 | 이전 | 이후 |
| --- | --- | --- |
| 원인 | 토큰 생성기가 Figma 이름의 `[` `]`를 CSS 이스케이프로 옮김: `--border-radius-rounded-\[2px\]` | 생성 규칙 개선 — `[값]`은 대괄호를 빼고 값만: `--border-radius-rounded-2px` (`scripts/build-tokens.mjs` `cssVarName`) |
| CSS 변수 | `--border-radius-rounded-\[2px\]` · `\[5px\]` · `\[12px\]` | `--border-radius-rounded-2px` · `-5px` · `-12px` |
| Figma WEB code syntax | 2px `var(--radius-2px)`(코드에 없는 이름) · 5px 없음 · 12px `var(--border-radius-rounded-\[12px\])` | 3개 모두 `var(--border-radius-rounded-<값>)` — `VariableID:873:4798` · `17:1961` · `1033:6620` |
| 컴포넌트 참조 | Chart(2px) · MetricCard · DashboardFilterBar(12px) | 새 이름으로 |

- Figma 변수 이름(`rounded-[2px]` 등)은 기존 네이밍 그대로 둡니다 — 바뀐 것은 코드 쪽 변환 규칙과 code syntax 표기입니다.
- 같은 패턴 전수 조사: 이스케이프가 필요한 이름은 이 3개뿐(`colors/gray 2`는 공백 → `-`로 문제 없음).
- 호환성: CSS 변수 3개 이름 변경 — 배포 전이라 별칭 없음([breaking-changes.md](../breaking-changes.md)). 공개 TS API 영향 없음.
- 검증: Chart · MetricCard · DashboardFilterBar 정합성 통과(Chromium).

## 2. F80 — Accordion 복구본 토큰 연결 (완료)

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 색 바인딩 | 원격 라이브러리의 `colors/accordion/*` 사본 11종(58곳) | 로컬 `colors/accordion/*`(789:5702 – 826:9584) — 값 동일 |
| 레이아웃 | 원격 `spacing/padding/*` · `border-radius/rounded-none` · `border-width/border` 사본, 원격 accordion 토큰(442곳) | 로컬 같은 이름 변수, 아래 신규 Component 토큰 |
| 신규 Component 토큰 | 없음(원격에만) | `spacing/accordion/trigger-padding-x/md`(→p-3) · `/sm`(→p-2_5) · `spacing/accordion/padding/md`(→p-2_5) · `/sm`(→p-2) · `spacing/accordion/body-padding`(→p-3) · `size/accordion/trigger-height/md`(→p-11) · `/sm`(→p-9) · `border-radius/accordion/default`(→rounded) · `border-width/accordion/default`(→border) — `VariableID:1042:6697` – `6705`, scopes · WEB code syntax 지정 |
| 텍스트 | 원격 텍스트 스타일 사본(24개 노드) | 같은 이름의 로컬 스타일 — 글꼴 · 크기 · 줄 높이 · 자간 같음 |
| 배치(R5) | 1035:15685 y 40 | y 20 |

- 결과: `accordion-item` 안의 로컬이 아닌 변수 · 스타일 참조 0개. 스냅샷 Component 그룹 체크섬 Figma와 일치(691 · 3c79a700).
- 코드: `Accordion.css`가 새 Component 토큰 사용(트리거 padding · min-height · 모서리, 본문 padding, 구분선 두께). 값이 같아 화면 변화 없음.
  Figma ID를 1035:15648 · 1035:15645로 갱신(문서 · JSDoc · geometry), 기준 이미지 재캡처.
- 검증: 정합성 3 엔진 통과. 실제 브라우저(3 엔진): 기본 투명 · 구분선 #d6dae0, 마우스 Hover 배경 #f5f6f7 · 구분선 #131c2b, Tab 포커스 링, Enter 펼침(패널 표시) · Space 접힘. 스토리 테스트 7개 통과.

## 3. 회귀 수정 — Component 토큰 파일 머리 주석 (F81 작업에서 생긴 결함, 완료)

- 원인: F81 커밋(41c5276)에서 토큰 생성기의 그룹 설명을 `*/<그룹>/*`로 바꿔, 모든 `components/<그룹>.css`(Button 제외 33개)의 머리
  주석이 중간에서 닫혔습니다. 나머지 글자가 `:root` 선택자 앞에 붙어 브라우저가 규칙 전체를 버렸고, Button 외 Component 토큰이
  모두 정의되지 않은 상태였습니다(F80 확인은 이전 CSS가 남아 있던 개발 서버에서 한 것으로 보임).
- 수정: 설명을 `<kind>/<그룹>/…`로, 생성기가 `*/`가 든 주석을 만들지 않도록 검사 추가(`scripts/build-tokens.mjs`). 브라우저에서
  `--colors-accordion-background-hover` #f5f6f7 · `--colors-badge-status-outline-border-basic` #007c56 등 다시 정의됨 확인, `:root` 규칙 6 → 40.
- 이후 전체 회귀(정합성 3 엔진 · 스토리 · 접근성)를 이 수정 위에서 다시 실행합니다.

## 4. F78 — Chart Component Variables (완료)

| Component 토큰 | Alias(Semantic / Primitive) | 연결한 노드 |
| --- | --- | --- |
| `colors/chart/bar/primary` | `chart/series/brand` | 막대 첫 계열 · 간단 현재 기간, Bar 범례 표시, 막대 차트 툴팁 첫 표시 |
| `colors/chart/bar/compare` | `chart/series/compare` | 비교 막대(Group=yes) · 간단 현재 기간 비교, 범례 · 툴팁 두 번째 표시 |
| `colors/chart/bar/history` · `history-compare` | `chart/simple/history` · `history-compare` | 간단 스타일 지난 기간 |
| `colors/chart/line/primary` · `compare` | `chart/series/brand` · `series/02` | 선 · 점 · 아래 면 · 빈 원 테두리, 선 범례, 선 차트 툴팁 표시 |
| `colors/chart/point/border/default` · `point/background/hover` | `border/inverse` · `surface/page` | 점 테두리(기본 `border/inverse` · 간단 `surface/page` 두 가지였던 것 통일, 값 같음) · 빈 원 안쪽 |
| `colors/chart/plot/grid/default` · `axis/default` · `baseline/default` | `chart/grid/default` · `border/gray-subtler` · `chart/grid/default` | 값 격자 · 가로 막대 축 · 간단 기준선(이전 `chart/simple/history` — 계열 색을 기준선에 쓰던 것, 값 같음) |
| `colors/chart/plot/guide/hover` · `highlight/hover` | `border/gray` · `fill/transparent/hover` | 호버 안내선 · 호버 강조 영역(이전 Primitive `alpha/black/50` 직접, 값 같음) |
| `colors/chart/label/default` · `legend/label/default` | `text/secondary` | 축 이름 · 눈금 · 항목 이름 208곳 · 범례 글자 |
| `colors/chart/tooltip/background · title · label · value/default` | `alpha/white/800` · `text/tertiary` · `text/secondary` · `text/primary` | chart-tooltip(제목 · 값은 원격 변수였음 — F66) |

- 생성: `VariableID:1052:6697` – `6715`, scopes 지정(막대 SHAPE_FILL, 선 SHAPE_FILL · STROKE_COLOR, 선 계열 STROKE_COLOR, 글자 TEXT_FILL,
  툴팁 배경 FRAME_FILL), WEB code syntax `var(--colors-chart-…)`, 설명 "Alias → …". 기존 Semantic 이름과 CSS 이름이 겹치지 않게
  격자는 `plot/grid`(Semantic `chart/grid/default`와 구분).
- 연결: 세트 24변형 노드 색 바인딩 — 글자 208 · 격자 52 · 점 테두리 54 · 선 · 점 72 · 막대 그라디언트 109 · 축 8 · 기준선 8 · 안내선 4 ·
  강조 8 · 빈 원 6, 인스턴스 재정의 13(나머지는 메인 컴포넌트 상속). 감사 결과 보이는 색 778곳이 Chart 토큰, 예외는 F77 5노드와 배지 자체 토큰.
- 그라디언트 끝 색(40% · 0%)은 값으로 둠: 정지점에 변수를 묶으면 투명도가 변수 값(1)으로 바뀜(임시 노드로 확인 후 삭제).
- 색 규칙 통일: 세로 · 가로 막대가 같은 토큰. 간단 세로 막대 Group=no 지난 기간 8노드 `series/compare`(#d6dae0) → `bar/history`(#e2e5e9,
  끝 색도 #e2e5e9 40%) — 가로 · Group=yes와 같은 규칙. 선의 두 번째 계열은 의미가 다른 지표(전기 · 가스)라 `series/02` 유지.
- 원본에서 바뀐 것(다른 편집, 이번에 확인): 간단 Group=yes 현재 기간 비교 막대 `series/02` → `series/compare`(세로 · 가로 · hover 모두),
  간단 선 마지막 점 빈 원 → 일반 점(빈 원은 hover=yes), 간단 선 점이 기간 가운데로(F64), 간단 선 기간 이름 동 이름으로.
- 코드: `components/chart.css` 생성, `Chart.css`가 모든 색을 Chart 토큰으로(표시별 막대 / 선 토큰, 별도 범례 · 툴팁에서 해당 토큰이
  없는 색만 Semantic). `markColor`가 간단 현재 기간 비교 `compare` · 지난 기간 `history`(세로 · 가로 같음), `ChartLegendItem` dash-line
  기본 색 `02`. 비교 대상 노드 값이 같은 바인딩 교체는 화면 변화 없음.

## 5. F79 — Chart hover 변형 · 선 차트 Hover (완료)

| 항목 | 이전 | 이후 |
| --- | --- | --- |
| 지원 변형 | 12개(호버 표시는 기본 스타일만, Group=yes 막대 · 선 그림 기준) | 24개 — hover=no · yes, 간단 스타일 호버(안내선 · 빈 원 / 강조 영역 · 툴팁) |
| 강조 영역 | 세로 막대 64px 고정, 가로 막대 행 전체 높이(37.6 · 45.6px), 간단 없음 | Figma: 세로 40 · 64px(막대 + p-3 양쪽), 간단 48px(위부터 기준선까지) / 가로 32 · 46px(막대 + p-2 위아래), 간단 28px |
| 간단 선 마지막 점 | 항상 빈 원 | 일반 점(빈 원은 활성 항목만 — Figma hover=no / yes) |
| 감지 영역 | 값 눈금 열(왼쪽 32px) 위에서도 첫 항목 표시, 가로 막대 눈금 줄 위에서 마지막 항목 | 데이터 영역만(밖이면 닫힘) |
| 터치 | 탭해도 툴팁이 나오지 않음 — `pointermove`만 쓰고(탭은 발생 안 함) 손가락을 떼면 `pointerleave`로 닫힘(근본 원인) | `pointerdown`으로 선택, 터치의 `pointerleave`는 무시, 그림 밖을 누르면 닫힘(WebKit은 탭으로 초점이 빠지지 않아 blur만으로는 못 닫음) |
| 중복 알림 | — | blur와 바깥 누름이 한 이벤트에서 겹쳐도 `onActiveIndexChange` 한 번 |
| 원본 정리 | 1011:14912 막대 간격 · 데이터가 짝과 다름(y 7/19 · 너비 · 이름), 1011:14987 위치 (30, 1334), 빈 원 아래 중복 흰 테두리(값 없음) 5개 | 짝 762:5833과 같게(y 5/21, 너비 · 이름), (20, 1324), 삭제 |

- 원인 분석: 선 차트 호버 자체(가장 가까운 항목, 안내선 · 빈 원, 툴팁 위치 갱신, 깜빡임)는 실제 포인터 측정에서 정상(3 엔진, 85단계 이동 중
  사라짐 0). 결함은 위 두 가지(감지 영역, 터치)였고 CSS가 아니라 입력 처리에서 고쳤습니다.
- 검증: 정합성 chart 24/24 · legend 3/3 · tooltip 1/1(Chromium · Firefox · WebKit). 간단 선의 바깥 22px 띠만 제외(F64). 실제 브라우저 상호작용
  6종 × 3 엔진(이동 순서 · 깜빡임 · 눈금 열 · 이탈 · 키보드 · 툴팁/범례/표 값 · 색 일치, 터치는 Chromium · WebKit) 통과. 스토리 테스트 추가:
  눈금 열 · 터치 탭 · 바깥 누름 · 간단 스타일 키보드.

## 6. A-1 · A-2 — 색 대비 (완료)

전후 HEX · 대비는 [accessibility.md](../accessibility.md#색-대비--해결-a-1--a-2-2026-10-19)에 정리했습니다. 원칙: 기준을 넘는 가장 가까운 팔레트 단계로 한 번만 이동,
같은 의미(위험 · 오류)는 함께, 장식용 선 · 비활성 라벨은 그대로, 상태 · 텍스트 위계 유지.

| Figma 변경 | 내용 |
| --- | --- |
| Theme 6 | `brand-status/{point,success,warning,danger,error,information}/strong` → `{rose,green,orange,red,red,sky}/700` |
| Semantic 4 + 신규 1 | `text/tertiary` · `text/placeholder` → brand-gray/600, `fill/secondary/strong/hover` · `pressed` → brand/800 · 900, 신규 `text/inactive`(brand-gray/400, TEXT_FILL, `VariableID:1061:4692`) |
| Component 별칭 45 | 비활성 라벨 15 → `text/inactive`, 입력 칸 5종 테두리 default · completed · read-only → `border/gray` · hover → `border/gray-dark`(19), Checkbox · Radio 테두리 4, Switch 트랙 3 · Disabled 라벨, EmptyState 제목 · 설명, Stepper 잠긴 설명 |
| 노드 8 | metric-trend Disabled 글자 3(705:12062 · 12065 · 12068) → `text/secondary`, empty-state 제목 · 설명(724:14951 · 14952) → 자기 Component 토큰, 필터 막대 `|` 3(705:11648 · 11652 · 11712) → `border/gray-subtle`(값 그대로) |

- 쓰기 전 모든 대상의 현재 별칭을 확인하고(다르면 쓰지 않음) 쓴 뒤 다시 읽어 55개 모두 일치 확인. 스냅샷 8그룹 체크섬 Figma와 일치(theme 0f323395 · semantic 72 d570f01a · compButton ab12f8bc · compOthers 5d9a6f44).
- 코드: 토큰 재생성, MetricTrend Disabled · EmptyState(Component 토큰 사용) · 필터 막대 구분선, Input 오류 테두리 테스트 기대값(#c10007).
- 검증: axe 378 스토리 색 대비 423 → **0**, 그 밖의 위반 0. `KNOWN_CONTRAST` 목록 삭제(이후 대비 위반은 실패). 컨트롤 경계 실제 측정 3.87:1(8종).
  Button 352 + 실제 포인터 36 통과(Figma 사양 갱신: Secondary · Solid Hover #006247 · Pressed #004a38, TextButton Secondary 글자 #596475).
  기준 이미지 22세트 · 변형 13개 재캡처 후 정합성 Chromium 전체 통과.
- 검증 허용치 변경 2건(숨기지 않고 기록): metric-trend Flat · Negative 아이콘 막대 12×2px — 같은 벡터를 Figma와 Chromium이 다르게 래스터화(다른 Tone은 0.00%),
  색은 Up · Down Negative에서 비교. data-freshness Stale 배지 글자 dx 0.8 → 0.9px — 잉크 열 13–56 · 질량 같음, 진한 주황에서 무게 중심만 0.86px.
- 남은 결정(3): 차트 보조 계열 막대(1.24 · 1.38:1), SearchField Solid 채움 경계(1.06:1), Segmented 선택 표시 — accessibility.md.
