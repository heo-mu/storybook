# Table — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Table / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Table** 프레임(351:3340)의 `table_header`(3개) · `table_body`(8개) · `table_key`(2개) · `table_value`(2개) ·
`table_value_editable`(관리 모드 52개)을 구현했습니다. 데이터 표는 react-aria-components Table(키보드 칸 이동 · 선택 · 정렬 · 행 동작)을 씁니다.

## 사용 예

```tsx
import { Table, TableHeader, TableColumn, TableSelectionColumn, TableBody, TableRow, TableCell, TableSelectionCell } from 'platform-design-system';

<Table aria-label="설비 목록" selectionMode="multiple" onRowAction={(id) => open(id)}
  sortDescriptor={sort} onSortChange={setSort}>
  <TableHeader>
    <TableSelectionColumn />
    <TableColumn id="name" isRowHeader allowsSorting>설비명</TableColumn>
    <TableColumn id="site" info="설비가 설치된 건물">위치</TableColumn>
  </TableHeader>
  <TableBody items={rows}>
    {(row) => (
      <TableRow id={row.id}>
        <TableSelectionCell />
        <TableCell variant="strong">{row.name}</TableCell>
        <TableCell>{row.site}</TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>

<KeyValueTable>
  <KeyValueItem label="설비명" required>1호기 공조</KeyValueItem>
  <KeyValueItem label="상태"><Badge size="md" dot={false}>운영</Badge></KeyValueItem>
</KeyValueTable>
```

## Figma 속성 → Props

| Figma | 코드 | 비고 |
| --- | --- | --- |
| table_header Type Text · Title | `TableColumn` children | |
| table_header Info | `TableColumn info` | 정보 아이콘 + 툴팁 |
| table_header Filter | `TableColumn allowsSorting` | CaretUpDown, 정렬 중 `…/icon/active`, 순서는 `aria-sort` |
| table_header Type Checkbox · Empty | `TableSelectionColumn` · `TableEmptyColumn` | |
| table_body Type Text · Strong Text | `TableCell variant` | |
| table_body Type Badge · Button · Switch · Icon | 셀 안의 `Badge` · `Button` · `Switch` · 아이콘 | |
| table_body Type Checkbox · Reorder | `TableSelectionCell` · `TableDragHandle` | 끌어서 순서 바꾸기는 `dragAndDropHooks` |
| 예시 행 Hover · Pressed | `onRowAction`이 있는 행 | `table/data/background/hover · pressed` |
| table_key Type Required | `KeyValueItem required` | 빨간 점, "필수"로 읽힘 |
| table_value Type Text · Badge | `KeyValueItem` children | |
| table_value Text · Picture | — | Figma 속성은 있으나 바인딩된 레이어가 없음(정리 요청, figma-issues) |
| table_value_editable Show unit | `KeyValueItem unit` | 단위가 있을 때만 |
| table_value_editable State Default · Hover · Editing · Disabled · Content Empty · Filled | 편집 칸 상태(Hover · 포커스 · 열린 목록 = Editing) · 값 유무 | Filter 유형은 `FilterChipSelect`(Editing = 목록 열림, 2026-10-19) |

## 관리 모드 (table_value_editable)

값 칸에 실제 입력 컴포넌트를 넣고 `editable`을 주면, 평소에는 테두리 없이 글자처럼 보이고(Default) 마우스를 올리거나
편집 중일 때 입력 상자가 나타납니다(Hover · Editing). `disabled`는 칸 배경, `unit`은 뒤 단위 글자입니다.

```tsx
<KeyValueTable>
  <KeyValueItem label="정격 용량" editable unit="kW"><Input size="sm" aria-label="정격 용량" /></KeyValueItem>
  <KeyValueItem label="종류" editable><Select size="sm" aria-label="종류">…</Select></KeyValueItem>
  <KeyValueItem label="점검 기간" editable>
    <DatePicker size="sm" aria-label="시작일" /><span className="ds-kv__unit">~</span><DatePicker size="sm" aria-label="종료일" />
  </KeyValueItem>
  <KeyValueItem label="유형">
    <KeyValueGroup><FilterChip size="md" selected>선택유형: 옵션명, 옵션명</FilterChip><TextButton rightIcon={<ArrowCounterClockwiseIcon />}>초기화</TextButton></KeyValueGroup>
  </KeyValueItem>
  <KeyValueItem label="사용"><Switch size="md" aria-label="사용" /><span className="ds-kv__hint">설명</span></KeyValueItem>
  <KeyValueItem label="대표 이미지" stack>
    <KeyValueGroup><Button variant="tertiary" appearance="outline" size="xs" style={{ minWidth: 80 }}>파일 선택</Button>
      <span className="ds-kv__hint">권장 비율 1:1, JPG/PNG, 최대 5MB</span></KeyValueGroup>
    <ImageUploadPreview src={url} alt="대표 이미지" onRemove={…} />
  </KeyValueItem>
</KeyValueTable>
```

| Figma Type | 넣는 컴포넌트 |
| --- | --- |
| Input · Phone Number · Textarea | `Input size="sm"` (+ `editable`, Input은 `unit`) |
| Select | `Select size="sm"` |
| Date Picker · Date Range Picker | `DatePicker size="sm"` 1개 · 2개(사이 `~`) |
| Filter | `FilterChip size="md"` 1개 — 비어 있으면 "텍스트 선택", 선택하면 `selected` + 요약 라벨, 편집 중 `expanded`; 값이 있을 때 `TextButton`(초기화, ArrowCounterClockwise) in `KeyValueGroup` (Figma 2026-10-19). 편집 중에는 칩 아래 다중 선택 목록을 `FilterChipSelect`로 엽니다(F76 해결, `TABL-10`) |
| Switch | `Switch size="md"` + `.ds-kv__hint` |
| File Upload | `stack` + 버튼(최소 너비 80px) · 안내 + `ImageUploadPreview` |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `TABL-03` **안내 글자 색**: `colors/text/tertiary`. 2026-10-19 Figma 안내 글자도 삭제된 변수 대신 같은 변수에 연결되어 같습니다(F57 해소).
- `TABL-04` **행 Hover · Pressed 색**: 컴포넌트 변수 `table/data/background/hover · pressed`. 2026-10-19 Figma 예시 행도 이 변수에 연결되어 같습니다(F54 해소).
- `TABL-10` **Filter 편집 칸의 목록**: Editing은 칩 아래 다중 선택 목록이 열린 상태(Figma) — `FilterChipSelect`로 그립니다. 초기화는 값 전체 해제(2026-10-19, R7 · D3 결정).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `TABL-01` **관리 모드 상태**: 칸에 마우스가 있거나 포커스 · 열린 목록이 있으면 입력 상자를 보여 줍니다. Hover에서는 입력 상자의 기본(Default · Completed) 테두리를 씁니다(Rules 07 · table_value_editable 주석).
- `TABL-05` **선택된 행**: 배경 강조 없이 체크박스로만 표시합니다(Rules 07).
- `TABL-06` **정렬 방향 아이콘**: 아이콘은 CaretUpDown 하나 — 방향은 `aria-sort`로 전달하고 활성 열 아이콘만 `header/icon/active` 색입니다(Rules 07).
- `TABL-07` **편집 아이콘(Type Icon)**: 누를 수 있게 하려면 버튼으로 감싸고 이름을 주세요(Rules 03).
- `TABL-08` **포커스**: 행 · 칸 · 열 머리글은 키보드 포커스일 때 안쪽 가장자리에 2px `colors/border/focus` 링(Rules 02 — Table에는 Figma `Focus` 속성이 없어 규칙이 기준).
- `TABL-09` **Empty 머리글**: `TableEmptyColumn`의 `aria-label`은 화면 낭독기용 글자로도 머리글 칸에 들어갑니다(화면에는 Figma처럼 비어 있음). 아이콘만 있는 칸의 아이콘은 `aria-label`로 이름을 주세요(Rules 03).

### Figma 반영 대기

Figma 정리를 기다리는 항목입니다. 정리될 때까지 아래처럼 구현합니다.

- `TABL-02` **Textarea 유형**: Figma는 편집 시 한 줄 Input을 쓰면서 채워진 값은 두 줄로 그려 둘을 함께 구현할 수 없습니다. 한 줄 Input으로 구현했고, 두 줄 변형 3개의 Figma 정리를 기다립니다(F58).

## Props

### TableColumn · TableCell · KeyValueItem

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc(Storybook Props 표)을 한국어 사용 설명으로 바꾸면서 옮긴 기술 정보입니다.

- `Table`은 Figma `table_header`(351:3452) · `table_body`(355:3739) 칸을 Figma table_data 예시처럼 조합한 것입니다.
- 칸 내용은 가로 가운데 정렬입니다 — 모든 `table_header` · `table_body` 변형이 auto layout CENTER이고, table_data 예시 · 목록 화면 예시가 칸을 160px로 늘려도 가운데에 둡니다(2026-10-20 동기화 전에는 왼쪽 정렬이었음). 긴 글 · 숫자 열의 정렬 규칙은 Figma에 없습니다(v1.0-candidate.md 검토 항목).
- `TableColumn`의 정렬 아이콘은 CaretUpDown 하나이며, 정렬 중에는 `…/icon/active` 색입니다(TABL-06).
- `TableEmptyColumn`의 `aria-label`을 머리글 칸 안에 화면 낭독기용 글자로도 넣는 이유: 보조 기술에서 머리글이 비지 않게 하려는 것(axe `empty-table-header`)이며, 화면에는 Figma처럼 비어 있습니다.
- `TableDragHandle`은 List 아이콘을 씁니다(Figma `table_body` Type Reorder).
- `KeyValueTable`은 Figma table_key-value 예시(855:9118)이며 `<dl>` 두 열 목록입니다. 키 열은 하나의 열을 공유(최소 160px)하고 값이 나머지를 채우며, 첫 행만 위 테두리가 있습니다.
- `KeyValueItem`은 Figma `table_key`(355:4193) + `table_value`(355:4460) 한 행입니다. `stack`은 값 내용을 `m-2` 간격으로 세로로 쌓고(Figma File Upload 칸), `KeyValueGroup`은 내용을 `m-2` 간격으로 가로로 둡니다.
- Filter 편집 칸: 편집 칸 Showcase는 비어 있으면 `FilterChip`("텍스트 선택"), 값이 있으면 `FilterChipSelect`와 초기화 `TextButton`(`KeyValueGroup`)을 씁니다. 목록은 `FilterChipSelect`로 엽니다(`TABL-10`).
