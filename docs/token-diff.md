# Design Token Diff — 2026-10-16 재추출

> **2026-10-19**: 아래 "원본 변경 감지" 내용은 F31 동기화로 반영되어 스냅샷이 원본과 다시 같습니다(체크섬 8그룹 일치).
> 반영 결과와 토큰 변경 목록은 [analysis/F31-button-sync.md](./analysis/F31-button-sync.md) · [breaking-changes.md](./breaking-changes.md).

Figma **[Platform] Web Design System** (`Ry3WecA6sP6lKPop1vXrTp`)의 Variables / Styles를 다시 추출해,
Button 구현 시점의 스냅샷(`figma/`)과 비교한 결과입니다. 비교는 정렬된 `name=value [scopes]` 줄의 체크섬
(`npm run figma:checksum` ↔ `figma/checksum.figma.js`)과 그룹별 변수 개수로 했습니다.

## 요약

| 구분 | Button 구현 시점 | 현재 Figma | 코드 |
| --- | --- | --- | --- |
| Primitive | 615 | 615 (체크섬 동일) | 변경 없음 |
| Theme | 44 | 44 (체크섬 동일) | 변경 없음 |
| Semantic | 68 | 68 (체크섬 동일) | 변경 없음 |
| Component — `colors/button*` | 73 | 73 (체크섬 동일) | 변경 없음 (`components/button.css` 바이트 동일) |
| Component — 그 외 | 752 (미반영) | 682 | **신규 반영** — 그룹별 `src/tokens/components/<group>.css` |
| Text Styles | 46 | 46 (체크섬 동일) | 변경 없음 |
| Effect Styles | 4 | 4 (체크섬 동일) | 변경 없음 |
| 합계 | 1,552 | 1,482 | 1,475 생성 (아래 7개 제외) |

**Button 영향: 없음.** Button이 참조하는 Primitive · Theme · Semantic · `colors/button*` 변수와 Text Style이 모두 동일하므로
`npm run verify:button` 결과(296/296)가 그대로 유지됩니다.

## Figma에서 삭제된 변수 (825 → 755, −70)

Button 구현 이후 같은 날 Figma에서 삭제되었습니다. 코드는 이 변수들을 생성한 적이 없으므로 삭제로 인한 참조 깨짐은 없습니다.
삭제된 컴포넌트(Popover · Combobox · Drawer)와 일치합니다 — [component-inventory.md](./component-inventory.md) 참고.

| 그룹 | 삭제 수 |
| --- | --- |
| `colors/popover/*` · `spacing/popover/*` · `border-radius/popover` · `border-width/popover` · `size/popover` | 5 + 3 + 1 + 1 + 1 = 11 |
| `colors/combobox/*` · `spacing/combobox/*` · `border-radius/combobox` · `border-width/combobox` · `size/combobox/*` | 28 + 5 + 1 + 1 + 2 = 37 |
| `colors/drawer/*` · `spacing/drawer/*` · `border-radius/drawer` · `border-width/drawer` · `size/drawer/*` | 6 + 4 + 1 + 1 + 3 = 15 |
| `spacing/accordion/*` · `border-radius/accordion` · `border-width/accordion` · `size/accordion/*` | 4 + 1 + 1 + 2 = 8 |
| `colors/accordion/*` | 10 → 11 (+1) |
| 순변화 | −70 |

그 밖의 Component 그룹은 변수 개수가 Button 구현 시점과 같습니다(값은 당시 코드에 반영하지 않았으므로 비교 대상 없음).

## 코드에서 생성하지 않은 변수 (7)

Component 컬렉션 최상위의 그룹 없는 변수 — `default`, `hover`, `pressed`, `disabled`, `active`, `selected`, `disabled-selected`.
CSS로 만들면 `--default`, `--hover` 같은 전역 이름이 되어 다른 CSS와 충돌할 수 있어 제외했습니다
([figma-issues.md](./figma-issues.md) B1). `src/tokens/tokens.json`의 `skipped`에 기록됩니다.
어떤 컴포넌트가 이 변수에 바인딩되어 있으면 해당 컴포넌트 구현 시 다시 판단합니다.

## Component 토큰 파일

`npm run tokens`가 `colors/<group>/…` 기준으로 34개 파일을 만듭니다(`button_text`는 `button.css`에 포함).

`accordion` `alert` `badge` `breadcrumb` `button` `card` `checkbox` `chip` `chip-filter` `dashboard` `date-picker` `dialog`
`dropdown-menu` `empty-state` `file-uploader` `input` `link` `loading` `navigation` `pagination` `progress` `radio`
`search-field` `segmented-control` `select` `skeleton` `slider` `stepper` `switch` `tab` `table` `textarea` `toast` `tooltip`

별칭은 `var()` 참조로 유지됩니다. Component → Component 별칭(예: `colors/link/icon/default` → `colors/link/label/default`,
`colors/progress/border/indicator/default` → `colors/button/primary/solid/background/pressed`)도 그대로 보존됩니다.

## 기타 메타데이터 변화

- WEB code syntax가 지정된 변수 수: 115 → 45 (코드 이름은 code syntax가 아니라 변수 경로에서 생성하므로 영향 없음)

## Figma 원본 변경 감지 (Phase 3 진행 중, 2026-10-16)

File Uploader 구현 중 Loading이 바인딩한 `spacing/padding/p-px`가 스냅샷에 없어, 스냅샷과 원본의 체크섬을 다시 비교했습니다
(`npm run figma:checksum` ↔ `figma/checksum.figma.js`, 줄 단위 해시 비교로 변경 줄 특정).

| 그룹 | 스냅샷 | 현재 원본 | 내용 |
| --- | --- | --- | --- |
| Primitive 색 · Theme · Text Style · Effect Style | — | 동일 | 변화 없음 |
| Primitive 스칼라 | 159 | 166 | **추가 7개만**: `border-radius/rounded-[2px]`, `border-width/border-0` · `border-2_5` · `border-3`, `spacing/gap/overlap-0_5`(−2), `spacing/padding/p-13`(52), `spacing/padding/p-px`(1) |
| Semantic | 68 | 68 | `colors/fill/primary/subtle/hover`: `gray/50`(#f9fafb) → `gray/75`(#f5f6f7) |
| Component — Button 계열 | 73 | 81 | 아래 표 |
| Component — 그 외 | 682 | 682 | `colors/accordion/border/focus` → `colors/accordion/border/hover`(이름 변경, 값 동일) |

### Button 계열 변경

| 변경 | 내용 |
| --- | --- |
| **Secondary Solid 신설** | `button_basic` 160 → 192 Variant, `button_icon` 120 → 144 (Variant=Secondary, Appearance=Solid 추가). `colors/button/secondary/solid/background/*`가 `surface/container-*`(회색)에서 `fill/secondary/strong/*`(녹색 #007c56 · #009b68 · #02bb7b)로, label · icon이 `text/secondary`에서 `text/inverse` · `icon/inverse`(#fdfdfd)로 |
| 삭제 | `colors/button/primary/outline/border/default` · `/disabled`, `colors/button/primary/solid/border/default` · `/disabled` |
| alias 변경(값 동일) | `colors/button/primary/solid/icon/default`: `text/inverse` → `icon/inverse` |
| **TextButton 분리** | `colors/button_text/*`(16) → `colors/button_text/primary/*` + `colors/button_text/secondary/*`(32). Secondary는 label `text/tertiary`, icon `icon/placeholder` 등 Primary와 다른 색 — figma-issues A1("Secondary가 Primary와 동일")이 원본에서 해소됨 |
| 세트 배치 | `button_basic` 1087×1080 → 1087×1292, `button_icon` 440×704 → 880×432, `button_text` 424×263 → 424×212 |

### 처리 — 스냅샷 동결 (추가분만 반영)

- **반영함**: Primitive 스칼라 추가 7개(기존 값 변경 없음). `primScalars` 체크섬이 원본과 일치(`833ae02f`), 생성 CSS는 변수 7개 추가뿐.
- **반영하지 않음**: Semantic · Component 변경. 이유
  1. Button 계열은 원본에서 개정되어(새 Variant 56개, 색 변경, 변수 삭제) 반영하면 Button 구현과 296개 검증 결과가 바뀝니다 —
     "기존 Button 3종의 구현과 검증 결과를 유지" 지시에 따라 임의로 바꾸지 않습니다.
  2. 삭제된 `colors/button/primary/outline/border/default`는 `Button.css`가 참조합니다(figma-issues A5 · A6: 다른 Variant 토큰 참조).
     재생성하면 해당 CSS 변수가 사라져 테두리가 깨집니다.
  3. `fill/primary/subtle/hover` 변경은 Hover 배경 17개 Component 변수(Button outline · TextButton · Checkbox · Radio · Select option ·
     Chip · Chip filter · Date Picker day · navigation, 이후 Accordion · Link · Navigation · Pagination · Tab · Table)에 영향을 줍니다.
     차이는 채널당 4 단계(#f9fafb → #f5f6f7)입니다.
- **영향 — 검증 기준**: 오늘 원본 변경 이후 받은 기준 이미지(Select option · Chip · Date Picker · File Uploader · Loading 등)의 Hover 배경은
  #f5f6f7, 코드(동결 스냅샷)는 #f9fafb입니다. 기존 픽셀 비교(pixelmatch 임계 0.1)는 이 정도 차이를 실패로 잡지 않으므로,
  해당 Hover 상태는 "원본 변경 이전 토큰 기준"으로 통과한 것입니다.
- **결정 필요**: 원본 최신 버전으로 동기화할지(→ Button에 Secondary Solid 추가 · TextButton Secondary 색 · 삭제 변수 대응,
  Hover 배경 #f5f6f7로 전 컴포넌트 재검증) 여부. 동기화 절차: 그룹별 재추출 → `npm run tokens` → `npm run verify:all` ·
  `npm run verify:button`(기준 이미지 재캡처 포함).
