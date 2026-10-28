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

- `SWIT-02` **전환 애니메이션**: 썸이 즉시 이동합니다(Rules 09).

## 상태

## Props

## 구현 메모 (Storybook에서 옮김)

Storybook 컴포넌트 설명 · Props 주석에서 옮긴 내용입니다.

- Figma 컴포넌트 세트: `switch`(107:409).


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Switch.showcase.stories.tsx / VariantMatrix`: All 16 Figma variants: Checked × Size (rows) × State (columns).
