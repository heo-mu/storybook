# AGENTS.md — 검증 · 작업 완료 정책 (Codex · Claude 공통)

이 파일은 `CLAUDE.md`(Figma 원칙 · 명령 · 문서 위치)를 보완합니다. 충돌하면 `CLAUDE.md`의 Figma 원칙이 우선하고, 검증 범위와
작업 완료 방식은 이 파일을 따릅니다. 2026-10-28에 반복된 "백그라운드 테스트 대기 중 작업 종료"를 막기 위해 정했습니다.

## 1. 검증 범위 — 영향 범위 기준

**작은 컴포넌트 수정(기본)** — 변경한 컴포넌트와 그 토큰을 쓰는 곳만 검증합니다.

1. 변경한 컴포넌트의 스토리 테스트: `npx vitest run --project=storybook src/components/<Name>`
2. `npm run typecheck` · `npm run lint`
3. `npm run build` · `npm run build-storybook`
4. 변경한 부분의 접근성: 해당 스토리를 Storybook MCP `test-run`(a11y 포함)으로, 또는 `npm run verify:a11y`
5. 영향받은 Figma 세트의 정합성: `node scripts/verify-figma.mjs <component>`(Chromium), 상태 · 색이 바뀌었으면 `--browser=firefox` · `webkit`까지

**전체 QA** — 공통 토큰(Primitive · Theme · Semantic) 변경, 여러 컴포넌트가 공유하는 CSS · 스크립트 변경, 릴리스 직전에만:
`npm test` → `npm run verify:a11y` → `npm run verify:render`(모든 스토리 · 문서 페이지 실제 렌더링) → `npm run verify:interaction`(실제 포인터 · 키보드 흐름) → `npm run verify:all`(세 엔진 전체) → 빌드 2종 → 외부 소비자 스모크 → 배포 후 `STORYBOOK_URL`로 render · interaction 재실행.
공통 토큰 변경은 `figma/variables/*.txt`에서 참조 관계(`@S:` · `@C:` 별칭)를 grep해 실제 영향 컴포넌트를 먼저 확인하고 범위를 정합니다.

검증 범위를 줄였다면 완료 보고에 **검사하지 않은 항목**을 명시합니다. 테스트 기준(허용치 · knownDifferences)은 사유를 적지 않고 완화하지 않습니다.

## 2. 순차 실행 · Storybook 서버 보호

- 같은 Storybook 서버(:6006)를 쓰는 브라우저 검증(`verify-figma`, a11y, Playwright 스크립트)과 `npm run build` · `build-storybook`
  (토큰 재생성 → 서버 리로드)은 **동시에 실행하지 않습니다**. 순서: 테스트 → 검증 → 빌드.
- WebKit 검증은 다른 검증과 겹치지 않게 순차로 실행합니다.
- 시작 전 `git status`, 실행 중인 node 프로세스(`vitest` · `a11y-audit` · `storybook build`), `:6006` 리스닝 PID를 확인하고,
  다른 세션의 검증이 진행 중이면 끝날 때까지 같은 서버에 검증을 올리지 않습니다.

## 3. 백그라운드 작업 규칙

- 검증 명령은 **가능하면 전면(foreground)에서 순차 실행**하고 종료 결과를 바로 읽습니다.
- 백그라운드로 돌렸다면: PID · 로그 경로를 기록하고, 종료 코드(`[exited with code N]`)를 확인한 뒤에만 다음 단계로 갑니다.
  로그 갱신이 5분 이상 없으면 프로세스 상태(CPU · 메모리 · 자식 브라우저)를 조사하고, 멈춘 것이 확인될 때만 종료 후 그 단계만 다시 실행합니다.
- 이미 끝난 검증은 결과를 재사용하고, 같은 검증을 중복 실행하지 않습니다.
- **"테스트 대기 중"이라는 보고만 남기고 턴을 끝내지 않습니다.** 결과를 수집하고 커밋 → Push → 배포 확인까지 같은 턴에서 이어갑니다.
  한 세션에서 끝낼 수 없으면 완료 · 미완료 단계와 재개에 필요한 상태(PID · 로그 · Stage 목록)를 보고에 남깁니다.
- 2026-10-28 보강(반복된 "완료되면 이어서" 종료 방지): 긴 검사(verify:all · 전체 a11y · 배포 대기)는 ① 시작 전 같은 검사가 이미 돌고 있는지 로그 · 프로세스로 확인하고(돌고 있으면 그 결과를 기다려 재사용), ② 로그 파일에 종료 코드를 쓰게 하며(`(npm run verify:all > log 2>&1; echo "EXIT $?" >> log) &`), ③ 종료 코드 행이 생길 때까지 until 루프(Monitor)로 기다린 뒤 결과를 읽고 다음 단계로 갑니다. 완료 보고는 로그의 실제 종료 코드 · 통과 수치를 인용합니다. 로그 갱신이 5분 넘게 멈추면 프로세스를 조사하고 그 검사만 다시 실행합니다.

### 3-1. 장시간 테스트 실행 원칙 (2026-10-28, 사용자 지시)

장시간 테스트는 가능한 한 종료 상태를 직접 수집할 수 있는 방식으로 실행한다. 백그라운드 실행 시에는 프로세스 ID, 로그, 종료 코드를 기록하고, 중간 보고만으로 작업을 완료하지 않는다. 작은 변경은 영향 범위 중심으로 검증한다.

- 백그라운드 모니터가 작업을 자동으로 재개시킨다고 가정하지 않는다. 같은 턴 안에서 전면(foreground) 대기 루프로 종료 코드를 직접 회수한다(한 번의 대기는 10분 이내, 넘으면 상태를 확인하고 다시 대기).
- 이미 실행 중인 검사는 새로 시작하지 않고 그 로그의 결과를 회수한다. 빌드와 브라우저 테스트는 동시에 실행하지 않는다.
- 실제 종료 코드가 확인되지 않은 검사는 통과로 보고하지 않는다. 실패하면 원인을 고치고 그 범위만 다시 검증한다.

## 4. 커밋 · 배포 흐름

1. 변경 파일만 Stage(다른 세션의 미커밋 변경은 보존, 공유 문서는 "HEAD + 이번 헝크"만 index에 올림)
2. 격리 검증: `git stash push --keep-index` → typecheck · lint · 해당 컴포넌트 검증 → `git stash pop`
3. 로컬 커밋(관련 파일만) → `git push https://heo-mu@github.com/heo-mu/storybook.git main`(자격 증명 관리자 계정 선택 창 회피)
4. Vercel 자동 배포: `https://storybook-heo-mu.vercel.app/index.json`의 `last-modified`가 커밋 시각보다 새로워질 때까지 확인한 뒤,
   실제 배포된 스토리(iframe)에서 변경 사항을 측정합니다. 새 Vercel 프로젝트 · npm 배포는 하지 않습니다.
5. 끝나지 않은 테스트를 통과로 보고하지 않습니다.

## 5. 보고 형식

변경 전후 차이(Figma ↔ 코드) · 수정 파일 · 검증 결과(통과 수치 · 기록한 차이와 사유 · 생략한 검사) · 커밋 ID · Push · 배포 URL · 남은 문제.
