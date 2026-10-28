# DataState — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / DataState / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **data-state**(698:4359, 6개 변형)를 구현했습니다. 데이터 영역이 내용 대신 보여 주는 상태 — 불러오는 중, 비어 있음, 결과 없음, 오류,
권한 없음, 일부 누락입니다. Loading은 스켈레톤 막대 3개와 문구, 나머지는 EmptyState(아이콘 · 제목 · 설명 · TextButton)입니다.

## 사용 예

```tsx
import { DataState } from 'platform-design-system';

{isLoading ? <DataState state="loading" />
  : error ? <DataState state="error" onAction={refetch} />
  : rows.length === 0 ? <DataState state="no-results" onAction={resetFilters} />
  : <Table … />}
```

## Figma → Props

| Figma State | 아이콘 | 기본 제목 · 설명 · 버튼(오른쪽 아이콘) |
| --- | --- | --- |
| Loading | 스켈레톤 Line · Shape4 · Block | "데이터를 불러오는 중입니다"(`loadingLabel`) |
| Empty | Database | 아직 수집된 데이터가 없습니다 · 수집 설정과 데이터 연결을 확인하세요. · 수집 설정 확인 › |
| No-results | Info | 조회 결과가 없습니다 · 기간이나 조회 대상을 변경해 보세요. · 조건 초기화 ↺ |
| Error | WarningCircle | 데이터를 불러오지 못했습니다 · 연결 상태를 확인한 뒤 다시 시도하세요. · 다시 시도 ↺ |
| No-access | Info | 조회 권한이 없습니다 · 관리자에게 데이터 접근 권한을 요청하세요. · 권한 안내 › |
| Partial | Warning | 일부 데이터가 누락되었습니다 · (설명 기본값 없음) · 누락 내역 확인 › |
| Empty Title · Empty Description · No-results Title · No-results Description · Error Title · Error Description · No-access Title · No-access Description · Partial Title · Partial Description | `title` · `description` | 상태별 기본 문구(Partial Description은 기본값 없음 — 사용처의 실제 수치) |

`title` · `description` · `actionLabel`로 바꿀 수 있고, `description={null}`은 설명을 숨깁니다.

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `DSTA-04` **배경 · 너비**: 2026-10-19 Figma 배경이 원격 `color/background/white` 대신 `colors/surface/page`에 연결되어 코드와 같습니다(F69). 폭은 부모를 채웁니다(Figma 460px은 예시, Rules 08).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `DSTA-01` **버튼**: `onAction`(또는 `action`)이 있을 때만 그립니다 — 할 일이 없으면 버튼을 두지 않습니다(Rules 07).
- `DSTA-02` **Partial 설명**: Figma 기본 문구에 실제 수치("130대 중 128대")가 있어 기본값으로 쓰지 않습니다. 사용처의 실제 수치로 쓰세요(Rules 07).
- `DSTA-03` **접근성**: 상태가 바뀌면 읽어 주도록 `role="status"`(Loading은 `aria-busy`)입니다. 스켈레톤 · 아이콘은 장식입니다(Rules 03 · 06).

## Props

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc(Storybook Props 표)을 한국어 사용 설명으로 바꾸면서 옮긴 기술 정보입니다.

- 버튼은 `TextButton` Primary · sm이며, 상태별 오른쪽 아이콘(위 표의 › · ↺)이 붙습니다.
- `title` · `description` · `actionLabel`의 기본값은 Figma의 상태별 텍스트 속성("Empty Title" · "Error Description" …) 값입니다.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `DataState.showcase.stories.tsx / Figma`: The 6 Figma variants (460px).
