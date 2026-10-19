# F31 — 최신 Figma Button 변경 재분석과 영향 (2026-10-19)

Figma 원본은 읽기 전용으로만 조회했고, 코드 · 토큰 스냅샷은 **바꾸지 않았습니다**. 이 문서는 동기화 여부를 결정하기 위한 자료입니다.

## 요약

| 항목 | 결과 |
| --- | --- |
| 원본 변경 범위 | 2026-10-16 감지 내용과 같음(그 뒤 추가 변경 없음). 단, Accordion Disabled 변수 2개가 함께 바뀐 것을 이번에 확인 |
| 기존 296 Variant의 크기 · 간격 · 모서리 · 글꼴 | **296/296 동일**(Size × Shape별 전 Variant 일치) |
| 기존 296 Variant의 색 | **260 동일, 36 다름**(Hover 배경 #f9fafb → #f5f6f7 30개, TextButton Secondary 글자 · 아이콘 6개) |
| 새 Variant | **56개**: Secondary · Solid — button_basic 32, button_icon 24 (Button 192 · IconButton 144 · TextButton 16 = 352) |
| Public API | 타입 확장(추가)만 필요. 단, 토큰 CSS 변수 이름 변경 · 삭제는 **호환성이 깨지는 변경** |
| 결정 필요 | Primary · Outline 테두리가 Figma에서 변수 없이 색만 남음(바인딩할 변수 결정), 동기화 버전 정책 |

## 확인 방법

1. 체크섬 비교(`figma/checksum.figma.js` ↔ `npm run figma:checksum`): Semantic · Component(Button) · Component(그 외) 3개 그룹이 다름.
2. 줄 단위 비교: 스냅샷 각 줄의 해시를 원본 변수와 대조해 바뀐 줄만 추출.
3. Button 세트 3개를 스펙(`figma/button-spec.json`)과 같은 구조로 다시 추출해 크기 · 색 비교.
4. **실측**: 원본 최신 스크린샷 · 위치 · 색으로 만든 임시 기준(`.verify/f31/`, git 제외)으로 현재 코드를 `verify-button`에 돌림.
   저장소의 기준 이미지 · 스펙은 그대로 둠.

## 1. 원본 변경 내용 (스냅샷 대비)

| 구분 | 변경 |
| --- | --- |
| Semantic | `colors/fill/primary/subtle/hover`: `gray/50`(#f9fafb) → `gray/75`(#f5f6f7) |
| Button — 신설 · 재정의 | `colors/button/secondary/solid/{background/default·hover·pressed, label/default, icon/default}`가 회색(`surface/container-*`, `text/secondary`)에서 녹색 채움(`fill/secondary/strong/*` #007c56 · #009b68 · #02bb7b)과 흰 글자(`text/inverse`, `icon/inverse`)로 |
| Button — 삭제 | `colors/button/primary/outline/border/default` · `/disabled`, `colors/button/primary/solid/border/default` · `/disabled` |
| Button — 별칭 변경(값 같음) | `colors/button/primary/solid/icon/default`: `text/inverse` → `icon/inverse` |
| TextButton — 분리 | `colors/button_text/*`(16) → `colors/button_text/primary/*` · `colors/button_text/secondary/*`(32). Secondary는 글자 `text/tertiary`, 아이콘 `icon/placeholder` 등 Primary보다 한 단계 연한 색 |
| Accordion | `colors/accordion/border/focus` → `border/hover`(이름만), `background/disabled`: `fill/transparent` → `fill/disabled/default`, `title/disabled`: `text/disabled` → `text/placeholder` |
| 세트 배치 | button_basic 1087×1080 → 1087×1292, button_icon 440×704 → 880×432, button_text 424×263 → 424×212 (기준 이미지 재캡처 필요) |

## 2. 기존 296 Variant 영향 (실측)

| 세트 | 비교 | 통과 | 다른 Variant | 차이 |
| --- | --- | --- | --- | --- |
| button_basic | 160 | 144 | Primary · Outline · Hover 8, Secondary · Outline · Hover 8 | 배경 #f9fafb → #f5f6f7 |
| button_icon | 120 | 108 | Primary · Outline · Hover 6, Secondary · Outline · Hover 6 | 배경 #f9fafb → #f5f6f7 |
| button_text | 16 | 8 | Primary · Hover 2 | 배경 #f9fafb → #f5f6f7 |
| | | | Secondary · Default 2 | 글자 #404b5d → #778191, 아이콘 #778191 → #a1a8b5 |
| | | | Secondary · Hover 2 · Pressed 2 | 글자 #131c2b → #404b5d, 아이콘 #404b5d → #778191 (Hover는 배경도) |
| **합계** | **296** | **260** | **36** | 크기 · 위치 · 글꼴 차이 없음 |

- 실제 포인터 상태 검사 27개 중 24개 일치. 다른 3개는 위 Hover 배경과 같은 항목입니다.
- Primary · Outline 테두리(#004a38)와 Secondary · Outline 테두리(#007c56)는 색이 같습니다. 다만 Primary는 변수가 삭제되어 **바인딩 없는 색**으로 남았고,
  Secondary의 Hover · Pressed는 Square는 `secondary/solid/border`, Rounded는 `secondary/outline/border`로 서로 다르게 바인딩되어 있습니다(값은 같음, 기존 A5 · A6).

## 3. Public API 영향

| 대상 | 영향 | 호환성 |
| --- | --- | --- |
| `Button` · `IconButton` | `variant="secondary"`에 `appearance="solid"` 허용(현재 타입은 `'outline'`만). `BUTTON_TONES`에 한 항목 추가 | 추가 — 호환. 단 **`variant="secondary"`의 기본 appearance는 `'outline'` 유지**가 필요(바꾸면 기존 화면이 녹색 채움으로 바뀜) |
| `TextButton variant="secondary"` | API 같음, 색이 Primary와 달라짐 | 화면 변경(시각적 변경) |
| 토큰 CSS 변수 | `--colors-button_text-*`(16) 이름 변경 → `--colors-button_text-primary-*` · `-secondary-*`, `--colors-button-primary-outline-border-*` · `--colors-button-primary-solid-border-*` 삭제 | **호환 깨짐** — `tokens.css` · `tokens.json`을 직접 쓰는 앱에 영향(별칭을 남기면 완화 가능) |
| `Button.css` 내부 | 삭제된 테두리 변수를 참조 — 재생성 시 테두리가 사라짐 | 동기화 때 수정 필요(Primary · Outline 테두리 변수 결정 후) |

## 4. 다른 컴포넌트 영향 (Semantic hover 변경)

`fill/primary/subtle/hover`를 참조하는 Component 변수 18개의 Hover 배경이 #f9fafb → #f5f6f7(채널당 4단계)로 바뀝니다.
Button(Primary · Secondary Outline) · TextButton · Tab(filled 2) · Select option · Checkbox · Radio · Link · Pagination(item · control) ·
Date Picker(navigation · day) · Chip · Chip Filter · Table 행 · Accordion, 그리고 이름에 경로가 빠진 `hover` 변수 1개.
기존 검증은 픽셀 임계값(0.1) 안이라 통과했으며, 동기화하면 색 값 검사가 있는 Button 계열만 실패로 드러납니다.

## 5. 동기화하려면 (제안 절차 — 실행하지 않음)

1. **디자인 결정**: ① Primary · Outline 테두리에 바인딩할 변수(현재 변수 없음) ② Secondary · Outline 테두리 바인딩 통일
   ③ `variant="secondary"` 기본 appearance(유지 권장) ④ 토큰 이름 변경을 다음 버전에서 어떻게 알릴지(메이저 또는 별칭 유지)
2. 스냅샷 재추출: Semantic · Component 그룹(`figma/variables/*`) → `npm run tokens` → 체크섬 일치 확인
3. 코드: `Button.options.ts`에 Secondary · Solid 추가, `Button.css` 토큰 참조 수정(TextButton primary/secondary 분리)
4. 기준 재캡처: `figma/button-variants.json` · `figma/reference/button_*.png` · `figma/button-spec.json` → `npm run verify:button`(352)
5. 전 컴포넌트 회귀: `npm run verify:all`, 테스트, 접근성, 외부 import → [버전 관리 절차](../developer-guide.md#7-버전-관리와-업데이트-절차)

## 결론

현재 패키지는 동결 스냅샷 기준으로 일관되게 동작합니다(296/296). 최신 원본과의 차이는 **색 36개 + 새 Variant 56개**로 크기 · 배치에는 영향이 없습니다.
Primary · Outline 테두리 변수가 원본에서 사라진 상태라 지금 동기화하면 코드가 임의의 값을 정해야 하므로, ① 결정 후 동기화를 권장합니다.
