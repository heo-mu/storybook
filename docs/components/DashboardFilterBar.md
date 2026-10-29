# DashboardFilterBar — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / DashboardFilterBar / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **dashboard-filter-bar**(698:4163)를 구현했습니다. 대시보드의 조회 조건 묶음과 오른쪽 버튼을 흰 카드에 배치하는 레이아웃 컴포넌트입니다.
안의 컨트롤은 디자인 시스템의 Select · FilterChip · SegmentedControl · DatePicker(sm)를 그대로 씁니다.

## 사용 예

```tsx
import { Button, DashboardFilterBar, DashboardFilterGroup, DashboardFilterRange, DatePicker, Select, SelectOption } from 'platform-design-system';

<DashboardFilterBar actions={<Button size="md">조회</Button>}>
  <DashboardFilterGroup label="조회 대상">
    <Select size="sm" aria-label="조회 대상" defaultValue="all"><SelectOption id="all">전체 단지</SelectOption></Select>
  </DashboardFilterGroup>
  <DashboardFilterGroup label="조회 기간">
    <DashboardFilterRange
      from={<DatePicker size="sm" aria-label="시작일" />}
      to={<DatePicker size="sm" aria-label="종료일" />} />
  </DashboardFilterGroup>
</DashboardFilterBar>
```

## Figma → 컴포넌트

| Figma | 코드 | 값 |
| --- | --- | --- |
| 바 (흰 카드) | `DashboardFilterBar` | padding 16 · 모서리 12 · 그림자 0 1 8 / 12%, 필터와 버튼 사이 `m-4` |
| Controls · Applied filters · … (그룹) | `DashboardFilterGroup label` | 라벨 sm medium `text/tertiary`, 컨트롤 `p-2` 간격 |
| "\|" | 그룹 사이에 자동 | sm normal `border/gray-subtle`(장식, 화면 낭독기에서 숨김 — A-1 이후 플레이스홀더 글자와 분리), 그룹과 `m-6` 간격 |
| 날짜 ~ 날짜 | `DashboardFilterRange from to` | "~" `text/tertiary`, `m-2` 간격 |
| 오른쪽 버튼 | `actions` | `p-3` 간격 |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `DFBR-02` **padding · 배경 · 모서리**: 2026-10-19 Figma가 원격 변수(`padding/6`, `color/background/white`) 대신 로컬 `p-4` · `colors/surface/page`에 연결되어 코드와 같습니다. 모서리는 `border-radius/rounded-[12px]`(F69).
- `DFBR-04` **그림자**: 효과 스타일 `elevation-3`(0 1 8 / 12%). 2026-10-19 Figma에서도 같은 값의 효과 스타일로 연결했습니다.
- `DFBR-03` **초기화 버튼**: Figma 예시대로 `IconButton variant="secondary" appearance="solid"`(2026-10-19 F31 동기화로 추가된 변형).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `DFBR-01` **좁은 화면**: 그룹 단위로 다음 줄로 넘어갑니다(줄 간격도 `m-6`). Figma는 1616px 한 줄만 있습니다(Rules 08).
- `DFBR-05` **접근성**: 바는 `role="search"` 랜드마크(`aria-label`, 기본 "조회 조건"), 그룹은 라벨로 이름 붙은 `role="group"`. 각 컨트롤에도 `aria-label`을 주세요(Figma 컨트롤에는 보이는 라벨이 없음). "|" · "~"는 장식입니다(Rules 03).
- `DFBR-06` **조회 기간 날짜 범위 예시**(2026-10-28 저녁): Figma 예시의 기간은 136px 날짜 필드 두 개를 "~"로 이은 구성입니다. 스토리 예시(FilterBarSample)를 `DashboardFilterRange` + `DatePicker size="sm"` 두 개로 맞춰 정합성 1/1(세 엔진) — 컴포넌트 코드 변화 없음(figma-issues F111).
- `DFBR-07` **레이어 이름 · 토큰**(2026-10-29): `Filters` · `Date range` · `Interval` · `Actions`로 기본 이름 프레임을 정리했고(검증 설정 갱신), 구분선이 `border/gray-subtle`을 써서 `dashboard/border/default`를 삭제했습니다([figma-fix-requests AC절](../figma-fix-requests.md)).

## Props

### DashboardFilterGroup

### DashboardFilterRange


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `DashboardFilterBar.showcase.stories.tsx / Figma`: The Figma filter bar (1616px) with the Figma sample controls.
