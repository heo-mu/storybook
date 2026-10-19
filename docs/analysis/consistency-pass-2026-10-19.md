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
