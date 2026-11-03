# Tooltip — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Tooltip / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Tooltip** 프레임(149:780)의 `tooltip`(4개)을 구현했습니다. 마우스를 올리거나 키보드로 포커스하면 짧은 설명을 보여 줍니다.

## 사용 예

```tsx
import { Button, IconButton, Tooltip } from 'platform-design-system';

<Tooltip content="변경 사항을 저장합니다">
  <Button>저장</Button>
</Tooltip>

<Tooltip content="설정" placement="bottom">
  <IconButton aria-label="설정" icon={<GearIcon />} />
</Tooltip>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Placement Top · Right · Bottom · Left | `placement` | 공간이 없으면 반대쪽으로 |
| Arrow | `showArrow` | 10 × 8 삼각형 |
| Message Text | `content` | |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `TOOL-01` **트리거와의 거리**: 화살표(8px) + 2px = 10px 띄워 화살표 끝이 트리거에서 2px 떨어집니다(Rules 05, 2026-10-29 개정 — 이전: 화살표 끝이 닿는 8px). 네 방향 모두 같고, 위치는 트리거의 실제 경계 기준(react-aria `offset`, portal 좌표)입니다. 공간이 없으면 반대쪽으로 뒤집고 화면 안으로 밀며, 크기가 바뀌어도 위치를 다시 잡습니다. Figma "Tooltip 사용 예시"(1668:7954)와 같은 배치이며, Gallery Variants 스토리의 play가 네 방향의 2px를, 화면 가장자리 · 여러 툴팁 스토리와 `verify:interaction`이 뒤집힘 · 한 번에 하나 · 빠른 이동 · 크기 변경을 검사합니다.
- `TOOL-02` **나타나는 지연**: 마우스는 0.5초(`delay` 기본 500), 키보드 포커스는 즉시. 포인터 · 포커스가 떠나거나 Esc로 닫힙니다. `delay` · `closeDelay`로 조정할 수 있습니다(Rules 05 · tooltip 주석).

- `TOOL-05` **나타남 · 사라짐 움직임**(2026-11-02 사용자 요청 — shadcn/ui Base Tooltip 참고, 이전에는 즉시. Figma Rules 09 "툴팁 나타남·사라짐" 행 1807:8754 — 2026-11-02에는 행이 없어 [figma-fix-requests AN절](../figma-fix-requests.md)로 요청했고 2026-11-03 전체 QA에서 추가(AQ절)). 나타남 150ms `ease`(opacity 0 → 1, `scale` 0.95 → 1), 사라짐 100ms `ease`(1 → 0, 1 → 0.95, `forwards`, 그동안 `pointer-events: none`). 기준점은 react-aria `--trigger-anchor-point` — 실제 열린 쪽(뒤집힘 포함)의 트리거를 향한 가장자리, 화살표 위치(top → 아래 가장자리, bottom → 위, left → 오른쪽, right → 왼쪽). shadcn 소스(registry `bases/base/ui/tooltip.tsx` · `bases/aria/ui/tooltip.tsx`, 스타일 `cn-tooltip-content` · `cn-tooltip-content-aria` = tw-animate-css `fade-in-0 zoom-in-95` / `fade-out-0 zoom-out-95`)의 실제 값은 열림 · 닫힘 모두 150ms `ease`, 0.95, 열릴 때 트리거 쪽에서 0.5rem(8px) 미끄러짐입니다. 닫힘 100ms는 요청 권장값이자 이 디자인 시스템의 오버레이 닫힘(overlay-motion.css)과 같고, 미끄러짐은 넣지 않았습니다(툴팁은 트리거에서 2px라 8px 미끄러지면 트리거에 겹쳐 시작 — 요청의 시작 상태는 페이드 + 크기). react-aria-components 1.22 `Tooltip`의 `data-entering` · `data-exiting`(useEnterAnimation · useExitAnimation — 닫힘 애니메이션이 끝날 때까지 DOM 유지)에 CSS `@keyframes`만 더했고, 위치는 변형 전 상자 기준(top · left)이라 정지 위치 · 간격은 그대로입니다. **연속 이동**: react-stately `useTooltipTriggerState`가 툴팁 하나가 뜬 뒤(워밍업) 다른 트리거로 옮기면 지연 없이 열고, 이전 툴팁을 즉시 닫으며 둘 다 `shouldSkipAnimation`으로 애니메이션을 건너뜁니다(`data-entering` · `data-exiting` 없음) — Base UI Provider의 instant 단계(`data-instant="delay"`, 문서 데모 `[data-instant] { transition: none }`)와 같은 동작이라 깜빡임 · 겹침이 없습니다. 마지막 툴팁이 닫힌 뒤 0.5초(쿨다운)가 지나면 다음 툴팁은 다시 지연과 애니메이션으로 나타납니다. shadcn CSS는 `data-instant`를 쓰지 않아 옮길 때도 두 툴팁이 함께 흐려졌다 나타납니다 — 요청(중복 표시 방지)에 따라 Base UI 방식. 지연(마우스 0.5초 · 포커스 즉시, `TOOL-02`)은 바꾸지 않았습니다. `prefers-reduced-motion: reduce`면 두 애니메이션 모두 없음(react-aria는 실행 중인 애니메이션이 없으면 바로 제거). 닫히는 순간 트리거의 `aria-describedby`가 빠지고, 사라짐이 끝나면 `role="tooltip"` 요소도 DOM에서 빠집니다.

### 개발 구현 세부 사항

디자인 컴포넌트에 넣지 않는 기술 구현입니다(Design System Rules 10).

- `TOOL-03` **그림자**: Figma는 말풍선과 화살표에 함께 그림자(elevation-3)를 줍니다. CSS 토큰(box-shadow)은 화살표 모양을 따를 수 없어 말풍선에만 적용합니다(화살표 그림자 생략 — F47).
- `TOOL-04` **트리거 요소**: ref와 props를 전달하는 요소여야 합니다(`Button`, `IconButton`, `TextButton`, `Link` 등).

## 키보드

| 키 | 동작 |
| --- | --- |
| Tab (트리거로 포커스) | 툴팁 표시 |
| Esc | 툴팁 닫기 |

## Props

## 구현 메모 (Storybook에서 옮김)

- Figma 컴포넌트 세트: `tooltip`(149:1111).
- react-aria-components `TooltipTrigger` · `Tooltip` 기반입니다(나타남 · 사라짐 움직임은 `data-entering` · `data-exiting`에 Tooltip.css `@keyframes`, `TOOL-05`). 말풍선은 `role="tooltip"`이고 트리거에 `aria-describedby`가 붙습니다. 트리거는 `Focusable`로 감쌉니다.
- `closeDelay`는 값을 넘기지 않으면 react-aria 기본값(500ms)을 씁니다.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Tooltip.showcase.stories.tsx / Matrix`: Figma `tooltip` (4): Placement with the arrow, each tooltip open next to its trigger.
