# 배포 전 체크리스트

npm 배포 · Storybook 배포 전에 위에서부터 차례로 확인합니다. 명령은 저장소 루트에서 실행하고, 정합성 검증(`verify:*`)은
`npm run storybook`을 띄워 둔 채 **다른 무거운 작업과 동시에 돌리지 않습니다**(부하로 인한 오탐).

상태 표시는 2026-10-19 최종 배포 준비 실행 결과입니다(✅ 통과 · ⏳ 결정 · 승인 대기 · ⛔ 아직 하지 않음).

## 1. 결정 · 원본

| # | 확인 | 상태 |
| --- | --- | --- |
| 1-1 | 첫 배포 버전 결정(D2 — 0.1.0 권장, [breaking-changes.md](./breaking-changes.md)) | ⏳ |
| 1-2 | Primary · Outline 테두리 변수 결정(D1). 결정 전 배포 시 Figma에 남은 색 #004a38로 배포됨을 승인 | ⏳ |
| 1-3 | 남은 디자인 결정([final-report.md 8절](./final-report.md#결정이-필요한-항목), [triage 1절](./figma-issue-triage.md#1-디자인-결정-필요))을 이번 배포에서 "현재 코드 정책"으로 승인할지 | ⏳ |
| 1-4 | 스냅샷 = Figma 원본: Figma에서 `figma/checksum.figma.js` 실행 ↔ `npm run figma:checksum` 8그룹 일치 | ✅ 2026-10-19 |
| 1-5 | 노드 단위 변경 없음: 기준 이미지 세트를 `get_screenshot`으로 다시 캡처해 `figma/reference`와 비교(개발자 가이드 7절) | ✅ 68세트 — 변경 2세트 반영 |
| 1-6 | Figma 원본 수정 요청 전달([figma-fix-requests.md](./figma-fix-requests.md) R1 – R8) | ⏳ |
| 1-7 | 등록 대기 토큰(`figma-pending/primitive.txt`)이 아직 Figma에 없는지 — 등록되었다면 해당 줄 삭제 후 `npm run tokens` | ✅ 1개(`rounded-[12px]`) 대기 중 |

## 2. 코드 품질

| # | 명령 | 기대 결과 | 상태 |
| --- | --- | --- | --- |
| 2-1 | `npm run typecheck` | 오류 0 | ✅ |
| 2-2 | `npm run lint` | 경고 · 오류 0 | ✅ |
| 2-3 | `npm test` | 전 스토리 테스트 통과 | ✅ 86 파일 · 376개 |
| 2-4 | `npm run build` | `dist/` 생성, 실행 후 `git status`에 `src/tokens` 변경 없음(토큰 = 스냅샷) | ✅ |
| 2-5 | `npm run build-storybook` | `storybook-static/` 생성(청크 크기 경고만) | ✅ |
| 2-6 | `npm run docs:api` | `docs/api.md` · `docs/public-api.md` 변경 없음(분류 누락 시 실패) | ✅ export 308 |

## 3. Figma 정합성 · 접근성

| # | 명령 | 기대 결과 | 상태 |
| --- | --- | --- | --- |
| 3-1 | `npm run verify:all` | 전 컴포넌트 × Chromium · Firefox · WebKit 통과 | ✅ 36 컴포넌트 × 3 엔진 = 108/108 |
| 3-2 | `npm run verify:button` (+ `-- --browser=firefox` · `webkit`) | 192 · 144 · 16 = 352, 실제 포인터 36/36 | ✅ 352/352 · 36/36, 3 엔진 |
| 3-3 | `npm run verify:a11y` | `other violations: 0`(색 대비 포함 — 알려진 대비 목록 없음) | ✅ 378 스토리, 색 대비 0 · 그 밖의 위반 0(A-1 · A-2 수정, [accessibility.md](./accessibility.md)) |
| 3-4 | 수동 검토 항목([final-report.md 3절](./final-report.md#수동-검토-항목-자동-비교에서-일부-제외)) 눈으로 확인 | 기록된 차이만 | ⏳ 배포 직전 확인(이번 변경이 닿은 항목은 없음) |

## 4. 패키지

| # | 확인 | 상태 |
| --- | --- | --- |
| 4-1 | `npm pack` → 새 Vite + React 19 + TS 프로젝트에 설치: strict 타입 검사 · 빌드 · 브라우저 실행, 콘솔 오류 0 | ✅ strict · `skipLibCheck: false` 타입 검사, 빌드, 실행 — Secondary · Solid 색, 12px 토큰, `closeToast`, 차트 툴팁, 콘솔 오류 0 |
| 4-2 | 패키지 내용: `dist/`만(`files`), `exports` = `.` · `styles.css` · `fonts.css` · `tokens.css` · `tokens/*` · `package.json` | ✅ |
| 4-3 | `peerDependencies` react · react-dom 18.2+ / 19, `dependencies` react-aria-components · @internationalized/date · pretendard | ✅ |
| 4-4 | `package.json` `version`을 결정한 버전으로(현재 0.1.0), `"private": true` 해제와 `publishConfig`(레지스트리 · 접근 범위) 추가 | ⛔ 배포 승인 후 |
| 4-5 | 라이선스 · 저장소 URL(`license`, `repository`) — 사내 정책에 맞게 | ⛔ |

## 5. 문서

| # | 확인 | 상태 |
| --- | --- | --- |
| 5-1 | `CHANGELOG.md` `[Unreleased]` → `[버전] — 날짜`, 호환성 변경 · 화면 변경 구분 | ⏳ 버전 결정 후 |
| 5-2 | [public-api.md](./public-api.md) — 공개 49 · 보조 32 · 사용 금지 목록을 개발팀과 공유 | ✅ |
| 5-3 | [developer-guide.md](./developer-guide.md) · [usage.md](./usage.md) · 각 컴포넌트 Usage 문서가 현재 API와 일치 | ✅ |
| 5-4 | 문서 안 상대 링크 · 앵커 확인 | ✅ |

## 6. 배포 실행 (승인 후)

| # | 단계 | 상태 |
| --- | --- | --- |
| 6-1 | 원격 저장소 Push, `v<버전>` 태그 | ⛔ 하지 않음(지시) |
| 6-2 | `npm publish` | ⛔ 하지 않음(지시) |
| 6-3 | Storybook 정적 사이트(`storybook-static/`) 호스팅 — MCP는 개발 서버에서만 동작함을 안내 | ⛔ 하지 않음(지시) |
| 6-4 | 배포 후: 레지스트리에서 설치해 4-1 반복, 개발팀 공지(CHANGELOG · public-api 링크) | ⛔ |
