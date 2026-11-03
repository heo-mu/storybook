# Switch — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Switch / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Switch** 프레임(107:188)의 `switch` 세트(16개)를 구현한 토글 스위치입니다.
`<input type="checkbox" role="switch">`이므로 Space 키로 전환되고, 스크린리더에는 "켜짐 / 꺼짐"으로 전달됩니다.

## 사용 예

```tsx
import { Switch } from 'platform-design-system';

<Switch label="알림 받기" name="notify" defaultChecked />

// 제어 컴포넌트
<Switch label="자동 저장" checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} size="md" />
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Checked False · True | `checked` / `defaultChecked` | |
| Size sm · md | `size` | 트랙 32×16 · 36×18px. 기본 `'sm'` |
| Label / Label Text | `label` | 생략하면 `aria-label` 지정 |
| State Hover · Pressed | 브라우저 `:hover` · `:active` | |
| State Disabled | `disabled` | |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `SWIT-01` **포커스**: 키보드 포커스(`:focus-visible`)일 때 트랙 바깥 2px에 2px `colors/border/focus` 링, 마우스 클릭에는 그리지 않습니다(Figma 속성 `Focus` — switch).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `SWIT-02` **전환 움직임**(2026-11-02 사용자 요청 — HeroUI Native Switch 참고, 이전에는 썸이 즉시 이동. Figma Rules 09 "Switch 켜기·끄기" 행 1807:8746 — 2026-11-02에는 행이 없어 [figma-fix-requests AM절](../figma-fix-requests.md)로 요청했고 2026-11-03 전체 QA에서 추가(AQ절)). ① **누름**: 포인터를 누르는 동안(스위치 · 라벨 위에 있을 때만 — 놓으면 켜지는 범위) 그리고 포커스된 스위치에서 Space를 누르고 있는 동안 라벨에 `data-pressed`가 붙고, 트랙과 썸이 트랙 중심을 기준으로 `scale: 0.96`(HeroUI `[1, 0.96]`, 150ms `cubic-bezier(0.45, 0, 0.55, 1)` — Reanimated `withTiming` 기본 `Easing.inOut(Easing.quad)`)으로 줄어듭니다. 놓기 · 포인터가 밖으로 나감 · `pointercancel`(터치가 스크롤로 바뀜) · 창 포커스 잃음 · Space 놓기 · blur에서 돌아옵니다. 리스너는 누르는 순간 붙여 같은 작업 안의 놓기도 놓치지 않습니다. Figma Pressed 변형은 색(`:active`)이며 축소는 그리지 않습니다(정합성 매트릭스는 축소 없음). ② **썸**: HeroUI `withSpring({ damping: 120, stiffness: 1600, mass: 2 })`. 감쇠비 120 / (2√(1600·2)) ≈ 1.06 ≥ 1이라 Reanimated는 ω0 = √(1600 / 2) ≈ 28.3 rad/s의 임계 감쇠 해로 계산합니다 — 남은 거리 비율 e^(−ω0·t)·(1 + ω0·t), 오버슈트 없음, 에너지가 처음의 6e-9가 되면 끝(≈437ms, 0.5px 안까지 ≈180ms, 절반 ≈50ms — 거리와 무관). 웹에서는 수치를 그대로 옮긴 것이 아니라 이 해를 240Hz로 샘플링한 Web Animations `transform: translateX` 키프레임(선형 보간 오차 0.03px 이하)으로 재현합니다: 정지 위치는 CSS `left`(Figma 정수 px)가 정하고, 바뀌는 순간 이전 위치에서 0까지 움직이는 FLIP — 끝나면 transform이 없어 정적 디자인과 같습니다. 방향이 바뀌면 지금 그려진 자리에서 정지 상태로 다시 출발합니다(Reanimated는 새 목표 반대쪽을 향한 속도를 0으로 자름). 첫 렌더는 움직이지 않고(HeroUI 마운트 처리), 클릭 · Space(비제어 — 이벤트가 끝난 뒤 마이크로태스크에서 확인해 React가 되돌린 제어 입력은 움직이지 않음)와 밖에서 바꾼 `checked`(레이아웃 효과) 모두 같은 움직임입니다. ③ **트랙 색**: HeroUI 175ms `Easing.bezier(0.25, 0.1, 0.25, 1)`(= CSS `ease`). 등록 속성 `--ds-switch-on`(꺼짐 0 · 켜짐 1)만 전환하고, 그 값이 0과 1 사이인 동안만 꺼짐 · 켜짐 색을 선형 광으로 섞은 색(`color-mix(in srgb-linear, …)` — Reanimated가 색을 선형 공간에서 보간)을 덧칠합니다. Hover · Pressed · Disabled 색은 Rules 09대로 즉시 바뀌고, 정지 상태의 `background-color`는 토큰 그대로입니다. `prefers-reduced-motion: reduce`면 축소하지 않고 썸 · 색이 바로 바뀝니다. 크기 · 색 · 여백 · 반경 · 토큰 · Props 변화 없음.

## 상태

## Props

## 구현 메모 (Storybook에서 옮김)

Storybook 컴포넌트 설명 · Props 주석에서 옮긴 내용입니다.

- Figma 컴포넌트 세트: `switch`(107:409).


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Switch.showcase.stories.tsx / VariantMatrix`: All 16 Figma variants: Checked × Size (rows) × State (columns).
