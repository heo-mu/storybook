# Design Token Diff — 2026-10-16 재추출

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
