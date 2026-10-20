# 개발 문서 안내

세 곳의 역할이 다릅니다. 같은 내용을 반복하지 않고, 필요한 곳을 아래에서 찾습니다.

| 어디 | 무엇 |
| --- | --- |
| **Figma** | 컴포넌트 디자인 · 상태별 모양 · 디자인 토큰 · 짧은 사용 규칙(Design System Rules) · 디자인 예시 |
| **Storybook** | 컴포넌트 미리보기 · 실제 동작 · 상태별 예시 · Props · 코드 예제 · 간단한 사용 가이드 |
| **이 폴더(docs/)** | 구현 상세 · Figma와 코드 매핑 · 노드 · 변수 ID · 예외 처리 · 테스트 · 검증 · 동기화 절차 |

## 컴포넌트를 쓸 때

| 문서 | 내용 |
| --- | --- |
| [usage.md](./usage.md) | 다른 React 프로젝트에서 설치 · import |
| [public-api.md](./public-api.md) · [api.md](./api.md) | 공개 컴포넌트 · Props · 타입(자동 생성) |
| [components/](./components/) | 컴포넌트별 개발 노트 — Figma 속성 ↔ Props, 토큰, 구현 세부, 정책 항목 |
| [policy-details.md](./policy-details.md) | 정책 상세 기준 — Figma Rules의 수치 · 조건 · 예외, 키보드 · 접근성 · 오버레이 · 모션 |
| [accessibility.md](./accessibility.md) | 접근성 기준 · 색 대비 측정 |
| [browser-support.md](./browser-support.md) | 브라우저별 차이 · 대체 처리 |
| [breaking-changes.md](./breaking-changes.md) · [../CHANGELOG.md](../CHANGELOG.md) | 호환성 변경 · 변경 이력 |

## 유지 · 검증할 때

| 문서 | 내용 |
| --- | --- |
| [developer-guide.md](./developer-guide.md) | 개발 환경 · 토큰 생성 · 버전 관리 · 명령어 |
| [figma-sync.md](./figma-sync.md) | Figma 대응 기준 · 새 버전으로 옮기는 순서(재매핑) |
| [sync-status.md](./sync-status.md) | 컴포넌트별 Figma ↔ Storybook 검증 상태 |
| [code-policy-audit.md](./code-policy-audit.md) | 정책 항목 목록(ID · 출처 · 처리 상태) |
| [figma-issues.md](./figma-issues.md) · [figma-issue-triage.md](./figma-issue-triage.md) · [figma-fix-requests.md](./figma-fix-requests.md) | Figma 원본 이슈 · 분류 · 수정 기록 |
| [token-diff.md](./token-diff.md) | 토큰 스냅샷 변경 기록 |
| [release-checklist.md](./release-checklist.md) | 배포 전 점검 |
| [component-inventory.md](./component-inventory.md) · [progress.md](./progress.md) · [final-report.md](./final-report.md) | 구현 현황 · 작업 기록 |
