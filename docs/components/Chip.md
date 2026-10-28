# Chip — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Chip / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Chip** 프레임(180:11829)의 세 세트를 용도별 컴포넌트로 구현했습니다.

| Figma 세트 | 컴포넌트 | 용도 | 요소 |
| --- | --- | --- | --- |
| `chip-multi` (24) | `Chip` | 여러 개를 켜고 끄는 필터 | `<button aria-pressed>` |
| `chip-input` (12) | `InputChip` | 입력된 값(태그) — 삭제 가능 | `<button>` (이름: 라벨 + "삭제") |
| `chip-filter` (48) | `FilterChip` | 필터 메뉴 · 패널 열기(트리거만) | react-aria `Button` (`aria-expanded`) |
| `chip-filter` + `listbox` · `option` sm | `FilterChipSelect` | 필터 칩 + 선택 패널(다중 · 단일) — Figma "chip-filter 다중 · 단일 선택 예시" | react-aria Select(버튼 + `listbox`) |

## 사용 예

```tsx
import { Chip, InputChip, FilterChip } from 'platform-design-system';

// 다중 선택 필터
<div role="group" aria-label="상태">
  {statuses.map((s) => (
    <Chip key={s} size="sm" selected={selected.includes(s)} onSelectedChange={(on) => toggle(s, on)}>{s}</Chip>
  ))}
</div>

// 입력된 태그
{tags.map((t) => <InputChip key={t} size="sm" onRemove={() => remove(t)}>{t}</InputChip>)}

// 필터 메뉴 트리거 (react-aria MenuTrigger가 aria-expanded와 화살표 방향을 관리)
<MenuTrigger>
  <FilterChip size="sm" selected={!!owner}>{owner ? `담당자: ${owner}` : '담당자'}</FilterChip>
  <Popover>…</Popover>
</MenuTrigger>
```

## Chip Filter 적용 — FilterChipSelect

Figma **chip-filter 다중 선택 예시**(1011:12956)와 **단일 선택 예시**(1149:6756)를 그대로 구현한 컴포넌트입니다. 칩을 누르면 칩 아래 4px에
`listbox` · `option`(Size=sm, 최소 160px)이 열리고, 적용된 값이 있으면 칩이 Selected(브랜드 테두리 · 글자)이며 글자가 "필터명: 값" 또는 "필터명: 첫 값 외 n개"가 됩니다.

| 선택 방식 | 쓰는 곳 | 동작 |
| --- | --- | --- |
| 다중(`selectionMode="multiple"`, 기본) | 동 · 설비 종류처럼 여러 값을 함께 거르는 필터 | 옵션을 켜고 끄는 동안 패널 유지, 칩 글자가 따라 바뀜. **닫을 때**(Esc · 바깥 · 칩) 적용 → `onChange` · Selected. 모두 끄고 닫으면 해제 |
| 단일(`selectionMode="single"`) | 기간 · 상태처럼 하나만 고르는 필터 | 고르면 바로 적용 · 닫힘. 첫 옵션 "전체"(`clearLabel`)를 고르면 해제(`null`) |

실제 필터 영역 — 다중 2개 · 단일 1개가 목록을 거르고, 결과 수(`role="status"`)와 "필터 초기화"를 함께 둡니다.

```tsx
import { FilterChipSelect } from 'platform-design-system';

const [buildings, setBuildings] = useState<Key[]>([]);   // 다중: Key[]
const [status, setStatus] = useState<Key | null>(null);  // 단일: Key | null

<div role="group" aria-label="필터" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-margin-m-1)' }}>
  <FilterChipSelect label="동" options={[{ id: '101동', label: '101동' }, …]} value={buildings} onChange={setBuildings} />
  <FilterChipSelect label="상태" selectionMode="single" options={…} value={status} onChange={setStatus} />
</div>
```

키보드: Tab으로 칩, Enter · Space · ↓로 열기, 방향키 · 글자 입력으로 이동, Space · Enter로 선택(다중은 켜고 끄기), Esc로 닫으면 적용되고 포커스가 칩으로
돌아갑니다. 칩의 이름은 지금 글자("동: 101동, 103동"), 패널은 `listbox`(다중이면 `aria-multiselectable`)입니다.
react-aria는 버튼 이름을 "값 + 라벨"로 붙여 "상태 상태" · "상태: 주의 상태"처럼 라벨이 두 번 읽혔습니다 — 2026-10-20부터 칩의 `aria-labelledby`를 `SelectValue`(보이는 글자) 하나로 지정합니다.

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Size xs · sm · md | `size` | 높이 24 · 28 · 36px. 기본 `'xs'`(Figma 기본값) |
| Label Text | children | |
| chip-multi Variant Selected | `selected` / `defaultSelected` / `onSelectedChange` | 체크 아이콘 표시 |
| chip-filter Variant Selected | `selected` | 필터 값이 적용됨 (브랜드 테두리 · 글자) |
| chip-filter Expanded | `expanded` | 위쪽 화살표, `aria-expanded`. react-aria 트리거 안에서는 자동 |
| State Hover · Pressed | 브라우저 `:hover` · `:active` | |
| State Disabled | `disabled` | |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `CHIP-05` **열린 필터 칩**: Figma처럼 State=Default · Expanded=True(위쪽 화살표)로 그립니다 — react-aria가 열린 동안 트리거를 눌림으로 두지만 실제로 누르는 동안만 Pressed입니다.
- `CHIP-06` **선택 패널**: `listbox` · `option` Size=sm, 칩 아래 4px · 시작 정렬 · 최소 160px(Figma 선택 예시의 배치).
- `CHIP-02` **포커스**: 키보드 포커스(`:focus-visible`)일 때 칩 바깥 2px에 2px `colors/border/focus` 링, 마우스 클릭에는 그리지 않습니다(Figma 속성 `Focus` — chip-multi · chip-input · chip-filter).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `CHIP-01` **InputChip 삭제 대상**: X 아이콘(12px)만이 아니라 칩 전체가 삭제 버튼입니다(터치 대상 크기 확보). 키보드는 Enter · Space · Delete · Backspace(Rules 04 · chip-input 주석).
- `CHIP-03` **Chip 그룹**: 칩 사이 4px(`spacing/margin/m-1` — Figma 예시와 같음), 줄바꿈 시 같은 간격(Rules 08). 그룹 컴포넌트는 없으므로 사용처에서 `role="group"`(이름 포함)과 `gap: var(--spacing-margin-m-1)`를 지정합니다.
- `CHIP-04` **필터 칩 선택**: 다중(기본)은 패널을 연 채 켜고 끄며 닫을 때 적용, 단일은 고르면 적용 · 닫힘, "전체"로 해제. 칩 글자는 0개 "필터명" · 1개 "필터명: 값" · 2개 이상 "필터명: 첫 값 외 n개"(2026-10-28 개정, 첫 값은 옵션 목록 순서, `maxDisplayed`로 나열 수 조정) — Figma 다중 · 단일 선택 예시(1011:12956 · 1149:6756), Rules 04 · chip-filter 주석.
- `CHIP-07` **패널 열림 · 닫힘 애니메이션**: 없습니다 — 즉시 열리고 닫힙니다. Rules 09(2026-10-28 추가 행)는 "참고 링크(heroui dropdown)의 애니메이션"이지만 Figma에 값이 없고 "상태 변화는 바로" 행과 충돌해 미구현입니다(결정 대기, figma-issues F103).

## 상태

## Props

### Chip

### InputChip

### FilterChip

### FilterChipSelect

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc · 스토리 설명에서 사용자 문서로 옮기지 않은 내용입니다.

- Figma 컴포넌트 세트: `chip-multi`(201:12711, 24개) → `Chip`, `chip-input`(558:26017, 12개) → `InputChip`, `chip-filter`(558:25704, 48개) → `FilterChip`.
- `Chip`은 `<button aria-pressed>`, State Hover · Pressed는 `:hover` · `:active`, Disabled는 `disabled`.
- `InputChip`은 칩 전체가 삭제 버튼이라 누르는 대상이 칩 높이 전체입니다. 접근성 이름은 라벨 + `removeLabel`("삭제").
- `FilterChip`은 react-aria `Button` 기반이라 react-aria 오버레이(`MenuTrigger`, `DialogTrigger`)의 트리거가 될 수 있고, 그 안에서는 `aria-expanded`가 자동입니다. 활성화는 `onPress`(또는 `onClick`).
- `FilterChipSelect`는 Figma `chip-filter` + `listbox` · `option` Size=sm("chip-filter 선택 예시", Design System Rules 04 · 07)입니다. 키보드 · 화면 낭독기 동작은 react-aria Select(버튼 + listbox)를 따릅니다.
- `FilterChipSelect`의 `name`은 숨겨진 네이티브 select가 값을 폼에 실어 보냅니다.
- `FilterChipSelect`의 `defaultOpen`은 편집 중인 표 필터처럼 Figma Expanded 상태를 처음부터 보여 줄 때 씁니다.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Chip.showcase.stories.tsx / MultiMatrix`: Figma `chip-multi` (24): Variant × Size (rows) × State (columns).
- `Chip.showcase.stories.tsx / InputMatrix`: Figma `chip-input` (12): Size (rows) × State (columns).
- `Chip.showcase.stories.tsx / FilterMatrix`: Figma `chip-filter` (48): Variant × Expanded × Size (rows) × State (columns).
- `FilterChipSelect.showcase.stories.tsx / Basic`: Figma "기본": the four filters of the Figma example, nothing applied.
- `FilterChipSelect.showcase.stories.tsx / MultipleSelection`: Multiple selection — the Figma flow 기본 → 기본 열림 → 선택 중 → 선택 완료 → 다시 열림 → 다시 선택 중 → 다시 선택 완료, then turning every option off removes the filter.
