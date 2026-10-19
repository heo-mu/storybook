# Tertiary 배경 Semantic Token 신설 (2026-10-19)

Button Tertiary / Solid 배경이 너무 연해 구분이 어려운 문제를 고치기 위해 **Figma 원본을 수정**(사용자 승인 작업)하고 코드에 반영한 기록입니다.

## 결과 요약

| State | 이전 바인딩 → 값 | 신규 Semantic Token → Primitive | 값 | 페이지 대비 | 라벨(#404b5d) 대비 |
| --- | --- | --- | --- | --- | --- |
| Default | `button/tertiary/solid/background/default` → `surface/container-subtle` → gray/75 | `colors/fill/tertiary/default` → `colors/gray/150` | **#e9ebee** (이전 #f5f6f7) | 1.06 → **1.17**:1 | 7.38:1 |
| Hover | `…/hover` → `surface/container` → gray/100 | `colors/fill/tertiary/hover` → `colors/gray/225` | **#dcdfe4** (이전 #eff0f3) | 1.12 → **1.31**:1 | 6.60:1 |
| Pressed | `…/pressed` → `surface/overlay` → gray/150 | `colors/fill/tertiary/pressed` → `colors/gray/275` | **#d0d4db** (이전 #e9ebee) | 1.17 → **1.46**:1 | 5.93:1 |
| Disabled | `…/disabled` → `fill/disabled` → gray/250 | 변경 없음 | #d6dae0 | — | — |

- Figma: Semantic 변수 3개 생성, `button_basic` 24 · `button_icon` 18 = **42개 변형**의 배경 채우기를 신규 토큰에 바인딩, 쓰이지 않게 된 Component 변수 3개를 신규 토큰의 별칭으로.
- 코드: 토큰 재생성(`--colors-fill-tertiary-*`), `Button.css`가 신규 토큰 사용, 검증 기준 갱신, 전후 비교 스토리 추가.
- Light / Dark: 모든 컬렉션이 모드 1개("Mode 1")라 모드별 값은 없습니다.

## 1. 원인

- 바인딩 구조: 변형 채우기 → Component `colors/button/tertiary/solid/background/*` → Semantic `colors/surface/container-subtle · container · overlay`
  → Primitive `gray/75 · 100 · 150`. 이 `surface/*` 토큰은 Figma에서 게시 숨김(hidden from publishing)이고 설명이 "disabled"로 되어 있어,
  채우기용 의미 토큰이 아닌 면(surface) 토큰을 빌려 쓰고 있었습니다.
- 수치: 페이지 배경 `surface/page`(#fdfdfd, L\* 99.3) 위에서 Default #f5f6f7은 L\* 96.8(차이 2.5), 대비 **1.06:1** — 사실상 구분되지 않습니다.
  상태 간 차이도 L\* 약 2(한 단계)씩이라 Hover · Pressed 변화가 작습니다.

## 2. 색 결정

같은 Neutral 팔레트(Primitive `gray/*`, Theme `brand-gray/*`와 같은 값)의 단계 안에서 골랐습니다. 기존 관계(상태마다 같은 간격으로 진해짐)를 유지하면서
간격을 한 단계 → 두 단계로 넓혔고, Default는 기존 Pressed 값(gray/150)에서 시작합니다.

| 안 | Default · Hover · Pressed | 판단 |
| --- | --- | --- |
| A | gray/150 · 200 · 225 (한 단계씩) | 가시성은 좋아지나 상태 차이가 여전히 L\* 약 2 |
| B | gray/200 · 225 · 250 | Pressed가 Disabled 배경(`fill/disabled` = gray/250)과 같아짐 |
| **C (적용)** | **gray/150 · 225 · 275** (두 단계씩) | Default 가시성 2.5배(L\* 차이 6.3), 상태 차이 L\* 4.3 · 3.9, Disabled(gray/250)와 겹치지 않음, 라벨 대비 5.9:1 이상 |

## 3. Figma 변경 내역

**신규 Semantic 변수**(컬렉션 Semantic `VariableCollectionId:28:6597`) — 기존 최신 Semantic 변수(`surface/scrim`)의 규칙을 따랐습니다.

| 변수 | ID | 값 | Scopes | WEB code syntax |
| --- | --- | --- | --- | --- |
| `colors/fill/tertiary/default` | `VariableID:1023:4620` | Alias → `colors/gray/150` (`VariableID:58:4790`) | FRAME_FILL, SHAPE_FILL | `var(--colors-fill-tertiary-default)` |
| `colors/fill/tertiary/hover` | `VariableID:1023:4621` | Alias → `colors/gray/225` (`VariableID:58:4792`) | FRAME_FILL, SHAPE_FILL | `var(--colors-fill-tertiary-hover)` |
| `colors/fill/tertiary/pressed` | `VariableID:1023:4622` | Alias → `colors/gray/275` (`VariableID:58:4794`) | FRAME_FILL, SHAPE_FILL | `var(--colors-fill-tertiary-pressed)` |

기존 Semantic 변수의 이름 · 값은 바꾸지 않았습니다. 같은 역할의 기존 토큰은 없었습니다(`tertiary` 이름은 텍스트 · 아이콘 색과 Component 변수뿐).

**바인딩 변경** — 변형 루트의 배경 채우기 1개만(크기 · 모양 · 여백 · 글꼴 · 테두리 · 아이콘 · Auto Layout은 그대로)

| 세트 | 변형 | 기존 변수 → 신규 변수 | 노드 |
| --- | --- | --- | --- |
| `button_basic` (54:2904) | Tertiary / Solid × Size 4 × Shape 2 × Default · Hover · Pressed | `colors/button/tertiary/solid/background/{default,hover,pressed}` → `colors/fill/tertiary/{default,hover,pressed}` | 24 — 67:1963 · 67:1969 · 67:1975 · 67:2095 · 67:2101 · 67:2107 · 57:2435 · 57:2441 · 57:2447 · 57:2608 · 57:2614 · 57:2620 · 57:2405 · 57:2411 · 57:2417 · 57:2578 · 57:2584 · 57:2590 · 57:2429 · 57:2459 · 57:2465 · 57:2602 · 57:2632 · 57:2638 |
| `button_icon` (67:2368) | Tertiary / Solid × Size 3 × Shape 2 × Default · Hover · Pressed | 같음 | 18 — 855:8973 · 855:8976 · 855:8979 · 855:8985 · 855:8988 · 855:8991 · 855:8997 · 855:9000 · 855:9003 · 855:9009 · 855:9012 · 855:9015 · 855:9021 · 855:9024 · 855:9027 · 855:9033 · 855:9036 · 855:9039 |

- Tertiary / **Outline**(배경 `fill/secondary/subtle/*`, 테두리 있는 흰 면)과 Disabled, Primary · Secondary는 바꾸지 않았습니다.
- 인스턴스: Ver 0.4의 2개(Dialog 149:2763 등) · legacy 11개가 메인을 따라 신규 토큰을 씁니다. 옛 변수에 직접 바인딩된 노드는 0개입니다.
- 쓰이지 않게 된 Component 변수 `colors/button/tertiary/solid/background/{default,hover,pressed}`(`VariableID:464:14796 · 14803 · 14804`)는
  `colors/fill/tertiary/*`의 별칭으로 바꿨습니다(이름 · scopes 그대로) — 이 변수를 쓰는 앱 CSS도 같은 색이 됩니다.

## 4. 같은 배경을 쓰는 컴포넌트 조사

Component · Dashboard 섹션 전체(76개 세트)의 채우기를 #f5f6f7 · #eff0f3 · #e9ebee 또는 해당 변수 기준으로 조사했습니다. 이름이 아니라 **상태별 실제 배경과 용도**로 판단했습니다.

| 컴포넌트 | 상태별 배경 | 판단 |
| --- | --- | --- |
| Button · IconButton Tertiary / Solid | 기본부터 채워진 면, Default → Hover → Pressed로 진해짐(#f5f6f7 → #eff0f3 → #e9ebee) | **통합(변경)** |
| Chip(multi · input · filter) | 기본 흰색 #fdfdfd + 테두리, Hover · Pressed만 옅은 틴트 | 색만 같고 용도 다름(상호작용 틴트) — 유지 |
| TextButton, Button Outline 전부, Pagination, Tabs(filled), Link, Option, Checkbox · Radio, Navigation, Date Picker day | 기본 투명 · 흰색, Hover · Pressed 틴트 | 유지 |
| SegmentedControl 트랙(#eff0f3), Skeleton · Progress(#e9ebee), Badge gray, Table 헤더 · 키 | 상태 없는 정적 면 | 용도 다름 — 유지 |
| SearchField Solid, FileUploader | 입력 면 · 드롭 영역(상태 패턴 다름) | 유지 |
| Date Picker navigation | Default #e9ebee, Hover #f5f6f7(반대 방향) | 유지 |

## 5. 검증

- 변경 전후 지문(76개 세트의 크기 · 위치 · Auto Layout · 모든 채우기 · 테두리 · 모서리 · 효과 · 글자, 대상 채우기 제외): **바뀐 세트는 `dialog` 1개**
  — 안의 Tertiary 버튼 인스턴스가 신규 토큰을 따라감(의도된 변화). Button 두 세트는 대상 42개 채우기 외 동일.
- 변경 후 재조회: 신규 변수 3개(별칭 · scopes · code syntax), 42개 바인딩, 해석 값 #e9ebee · #dcdfe4 · #d0d4db 확인.
- 스냅샷 체크섬 8그룹이 Figma와 일치(semantic `e1b7f7e8`, compButton `1d143330`).
- 기준 이미지: `button_basic` · `button_icon` · `dialog`(+ 아래 외부 변경으로 Navigation `item_*`)를 원본에서 다시 캡처해 교체.

## 6. 이 작업 중 관찰된 다른 Figma 변경 (이 작업이 한 것 아님)

| 변경 | 시점 | 처리 |
| --- | --- | --- |
| Semantic `colors/fill/secondary/subtle/hover`: gray/50(#f9fafb) → gray/75(#f5f6f7) | 오전 동기화 이후 ~ 이 작업 시작 전 | 토큰이라 동기화(Button Tertiary · Outline Hover, Navigation 항목 Hover가 #f5f6f7). Navigation 기준 이미지 교체 |
| Accordion 프레임(796:5813) 삭제 — `accordion-item`(796:6071)이 페이지에서 분리됨 | 이 작업의 변경 · 검증 이후 | **반영하지 않음**(진행 중인 편집으로 보임). 코드 · 검증 기준은 이전 Accordion 그대로 |
| `chart`(698:4399) 세트 재배치(1324×1728 → 2620×1704, 상호작용 상태 열 추가로 보임) | 이 작업 중 | **반영하지 않음**. 기준은 이전 Chart 그대로 |
