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
