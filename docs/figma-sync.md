# Figma 동기화 · 재매핑 절차

Figma 파일은 버전별로 따로 관리합니다. 코드와 Figma의 대응은 **이름**으로 잡고, 노드 ID는 특정 버전의 보조 정보로만 씁니다.

## 대응 기준

| Figma | 코드 | 규칙 |
| --- | --- | --- |
| 컴포넌트 세트 이름(`button_basic`, `chip-filter` …) | React 컴포넌트 | 표: [component-inventory.md](./component-inventory.md) · [sync-status.md](./sync-status.md) |
| Variant 속성(`Size=md` …) | Props(`size="md"`) | 컴포넌트별 표: [components/](./components/) |
| 변수 경로(`colors/button/primary/solid/background/default`) | CSS 변수(`--colors-button-primary-solid-background-default`) | `/` → `-`, 대괄호 값은 괄호를 뺌(`rounded-[2px]` → `rounded-2px`) — `scripts/build-tokens.mjs` |
| 텍스트 · 효과 스타일 이름 | `--typography-*` · `--effect-*` | 같은 생성기 |

사용자 문서(Storybook)에는 노드 ID · 변수 ID · Figma 버전명을 쓰지 않습니다. 이름과 역할로만 설명합니다.

## 버전에 속한 정보 (새 버전 · 복제 파일에서 다시 받음)

| 위치 | 내용 | 다시 받는 방법 |
| --- | --- | --- |
| `figma/variables/*.txt` · `styles/` | 변수 · 스타일 스냅샷 | 변수 내보내기 → `npm run tokens` · `npm run figma:checksum` |
| `figma/metadata/*.xml` | 섹션의 노드 트리(변형 위치) | MCP `get_metadata`(Component · Dashboard components 섹션) |
| `figma/geometry/<set>.json` | 변형별 레이어 위치 · 크기, `id`는 그 버전의 노드 ID | `figma/scripts/export-geometry.figma.js`를 `SET_NAME`으로 실행 |
| `figma/reference/<set>.png` | 기준 이미지 | MCP `get_screenshot`(세트) |
| `docs/components/*.md` · `docs/figma-*.md` | 노드 · 변수 ID가 적힌 기록 | 참고용(검증에는 쓰지 않음) |

검증(`scripts/verify-figma.mjs`)은 메타데이터에서 세트를 노드 ID로 찾고, 없으면 **세트 이름**으로 찾습니다(이름이 겹치면 오류).
그래서 복제 · 새 버전 파일에서도 메타데이터만 다시 받으면 같은 설정(`figma/verify/*.json` — 레이어 이름 → DOM 선택자)으로 검증할 수 있습니다.

## 새 Figma 버전으로 옮기는 순서

1. 새 파일 키를 `scripts/build-tokens.mjs`(`source.fileKey`) · `package.json`(`description`) · `figma/checksum.figma.js` 머리 주석에 반영합니다(MCP 호출의 `fileKey`도 새 키).
2. 변수 · 스타일 스냅샷을 다시 받고 `npm run tokens` → `git diff src/tokens`로 바뀐 토큰을 확인합니다. 이름이 바뀌면 [breaking-changes.md](./breaking-changes.md)에 기록합니다.
3. `npm run figma:checksum` 결과와 Figma에서 실행한 `figma/checksum.figma.js` 결과(8그룹)가 같은지 봅니다.
4. 섹션 메타데이터(`get_metadata`) · 바뀐 세트의 geometry(`SET_NAME`) · 기준 이미지를 다시 받습니다.
5. `npm run verify:all`(3 엔진) · `npm run verify:button` · `npm test`로 확인합니다.
6. 바뀐 점을 [token-diff.md](./token-diff.md) · [figma-issues.md](./figma-issues.md)에 남기고 `docs/sync-status.md`를 다시 만듭니다.

공동 편집 파일이므로 수정 · 비교 직전에 대상을 다시 읽고, 체크섬과 세트 지문을 확인한 뒤 스냅샷을 믿습니다.
