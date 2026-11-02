# Accordion — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Accordion / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Accordion** 프레임(1035:15645)의 `accordion-item`(10개)을 구현했습니다. 제목 버튼으로 내용을 펼치고 접습니다.

## 사용 예

```tsx
import { Accordion, AccordionItem } from 'platform-design-system';

<Accordion defaultExpandedKeys={['advanced']}>
  <AccordionItem id="basic" title="기본 설정">…</AccordionItem>
  <AccordionItem id="advanced" title="고급 설정" description="알림과 수집 조건을 설정합니다.">…</AccordionItem>
  <AccordionItem id="lab" title="실험 기능" disabled>…</AccordionItem>
</Accordion>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Size md · sm | `Accordion size` | 제목 16 · 14px, 높이 44 · 36px |
| Expanded | `expandedKeys` · `defaultExpandedKeys` / 단독 항목 `expanded` · `defaultExpanded` | 화살표 위 · 아래, 제목 semibold |
| State Hover | 브라우저 `:hover` | |
| State Disabled | `disabled` | |
| Title Text | `title` | |
| Show Description · Description Text | `description` | |
| Show Divider | `divider` | 기본 켜짐. 제목 아래 구분선과, 펼쳤을 때 내용 아래 구분선(2026-10-28 Figma 추가, `border/default`)을 함께 켜고 끕니다 |
| Body (accordion-content) | `children` | |
| Expanded True · False | 펼침 — `Accordion expandedKeys` / `defaultExpandedKeys` | |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `ACCO-01` **Hover · Expanded**: Hover는 모든 크기에서 배경 `background/hover`와 진한 구분선 `border/hover`, 펼친 항목은 진한 구분선(Figma State=Hover · Expanded). 펼친 항목은 내용 아래에 두 번째 구분선(`border/default`, Hover에서도 그대로)이 있습니다 — `.ds-accordion__panel::after`(Figma 2026-10-28).
- `ACCO-02` **Disabled**: 배경 `background/disabled`(fill/disabled), 제목 `title/disabled`(text/inactive — 비활성 라벨).
- `ACCO-06` **포커스**: 키보드 포커스일 때 트리거 안쪽 가장자리에 2px `colors/border/focus` 링(Figma 속성 `Focus`, 안쪽형) — 폭을 채우는 행이라 이웃 항목에 가려지지 않도록 안쪽에 그립니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `ACCO-03` **여러 개 열기**: 기본은 한 항목만 펼칩니다(다른 항목을 열면 이전 항목이 닫힘). 비교가 필요한 화면만 `allowsMultipleExpanded`로 여러 개(Rules 07 · accordion-item 주석).
- `ACCO-04` **펼침 · 접힘 움직임**(2026-11-02, Rules 09 "Accordion 펼침·접힘" 1762:8739 — 이전에는 즉시 바뀜): 내용 영역의 높이가 0과 실제 내용 높이 사이를 200ms `cubic-bezier(0.33, 1, 0.68, 1)`(감속, 차트 그리기와 같은 곡선 — 튕김 · 확대 · 흐려짐 없음)로 바뀌고, 아래 항목이 따라 움직이며 화살표가 함께 180° 돕니다. react-aria `Disclosure`가 열고 닫는 동안 `--disclosure-panel-height`를 내용 높이(px)로 두고(열린 뒤 `auto`, 닫힌 뒤 `0px`) 전환이 끝난 뒤에야 패널을 숨기므로(`hidden="until-found"`), `.ds-accordion__panel`은 `height: var(--disclosure-panel-height)` · `overflow-y: clip`(가로 넘침은 그대로) · `transition: height`만 갖습니다 — 상태 · `aria-expanded` · 포커스 · 키보드는 react-aria 그대로. 빠르게 연속으로 누르면 전환이 현재 높이에서 이어져 마지막 상태로 끝나고, 열린 뒤에는 `auto`라 내용이 바뀌거나 안의 아코디언이 열려도 높이가 맞춰집니다. 내용 아래 구분선은 닫히는 동안에도 패널 끝에 남아 함께 올라갑니다(`:not([hidden])`). 화살표는 하나의 `CaretDownIcon`을 펼침 때 `rotate(180deg)` — Figma `icon/CaretUp`은 `icon/CaretDown`을 180° 돌린 모양이라(1× 렌더 차이 9픽셀 · 최대 9/255) 정합성 0.00%. 비활성 항목은 열리지 않아 움직임이 없고, `prefers-reduced-motion: reduce`면 전환 없이 바로 바뀝니다.
- `ACCO-05` **너비**: 부모 너비를 채웁니다. Figma의 320px은 예시 폭입니다(Rules 08).
- `ACCO-07` **트리거 모서리**(2026-11-02 사용자 요청으로 0 — 아래는 2026-10-28 경위): 아코디언은 직각 모서리 디자인입니다. Trigger 네 모서리가 묶인 `border-radius/accordion/default`가 F80 복구 때 `border-radius/rounded`(4px)로 다시 만들어져(삭제 전 원래 값 0), 배경이 칠해지는 Hover · Disabled 트리거가 코드에서 둥글게 보였습니다(Figma는 접힌 Hover · Disabled의 채움이 직각인 변형 프레임에 있어 가려졌고, 펼친 Hover만 둥글었음). 변수를 `border-radius/rounded-none`으로 되돌려 Figma · 코드 모든 상태가 0입니다(코드는 그대로 `var(--border-radius-accordion-default)`, [figma-fix-requests AL절](../figma-fix-requests.md)). 포커스 링은 Figma Focus ring 프레임대로 4px. 2026-10-28 기록: Figma Trigger의 네 모서리는 `border-radius/accordion/default`(→ `border-radius/rounded`, 4px)에 묶여 있습니다. F80 복구 때 Trigger 모서리만 삭제된 옛 변수(값 0)를 가리킨 채 남아 0으로 그려졌고 코드도 0이었습니다 — Figma 바인딩을 복구된 변수로 다시 연결하고(QA 승인 작업, [figma-fix-requests Z절](../figma-fix-requests.md)) 코드는 `var(--border-radius-accordion-default)`를 씁니다. 다른 목록 행(option · dropdownmenu_item · item_parent)과 같은 4px입니다. 참조 이미지 재내보내기, 정합성 10/10.
- `ACCO-08` **sm Default Expanded 트리거 그림자**(2026-10-28 저녁, F102 해결): Figma `Size=sm, State=Default, Expanded=True` 변형의 Trigger에만 붙어 있던 `elevation-3` 효과 스타일을 제거해 다른 Expanded 변형 3개와 같게 했습니다([figma-fix-requests AB절](../figma-fix-requests.md)). 세트 스크린샷 픽셀 동일 — 코드 · 참조 이미지 변화 없음.

## 키보드

| 키 | 동작 |
| --- | --- |
| Tab | 제목 버튼 사이 이동(비활성 제외) |
| Enter · Space | 펼치기 · 접기 |

## Props

### AccordionItem

## 구현 메모 (Storybook에서 옮김)

- Figma 컴포넌트 세트: `accordion-item`(1035:15648).
- react-aria-components 기반입니다. `Accordion`은 `DisclosureGroup`, `AccordionItem`은 `Disclosure`이며 제목 버튼에 `aria-expanded` · `aria-controls`가 붙습니다.
- Figma State Hover는 CSS `:hover`, Expanded는 펼침, Disabled는 `disabled` prop입니다.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Accordion.showcase.stories.tsx / Matrix`: Figma `accordion-item` (10): Size × State × Expanded, 320px wide.
- `Accordion.showcase.stories.tsx / Motion`: ACCO-04 — the play records every frame: height from 0 to the content and back (hidden only at the end), the caret turning, the next item following; nested accordion, content added while open, rapid clicks, a disabled item (square, no motion), a second independent accordion.
