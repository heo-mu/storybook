# Stepper — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Stepper / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Stepper** 프레임(151:697)의 `stepper_horizontal` · `stepper_vertical`(각 3개), `stepper_indicator_*`(각 5개),
`stepper_connector_*`(각 2개)를 구현했습니다. 진행 상황 표시용이며 클릭할 수 없습니다.

## 사용 예

```tsx
import { Stepper } from 'platform-design-system';

<Stepper
  aria-label="가입 절차"
  currentStep={step}          // 0부터 — 앞 단계는 완료, 뒤 단계는 예정
  steps={[
    { label: '약관 동의', description: '필수 항목' },
    { label: '정보 입력', description: '이름 · 연락처', status: hasError ? 'error' : undefined },
    { label: '완료' },
  ]}
/>

<Stepper orientation="vertical" steps={steps} currentStep={2} />
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Type Horizontal · Vertical | `orientation` | |
| Steps 3 · 4 · 5 | `steps` 개수 | 개수 제한 없음 |
| indicator Variant Upcoming · Current · Completed | `currentStep`에서 계산 | 현재 단계 `aria-current="step"` |
| indicator Variant Locked · Error | 단계의 `status` | |
| Label · Label Text | 단계의 `label` | |
| Sub-Label · Sub-Label Text | 단계의 `description` | |
| connector State Completed | 완료된 단계 뒤에서 자동 | |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `STEP-01` **연결선 길이**: 가로 기본 180px(Figma), Stepper에 너비를 주면 연결선이 남는 폭을 채웁니다. 세로 연결선은 48px 고정입니다(Rules 08).
- `STEP-02` **스크린 리더 문구**: 완료 · 오류 · 잠김은 색과 아이콘으로만 보이므로 "N단계, 완료"처럼 숨은 문구를 함께 읽습니다(Rules 03).
- `STEP-03` **애니메이션**: 없습니다 — Figma에는 참고 링크(heroui stepper)만 있고 값이 없습니다(Rules 09).
- `STEP-04` **텍스트 넘침**: 표시기 루트는 원 크기(20px)이고 라벨이 양옆(가로) 또는 위아래(세로)로 넘칩니다. 가로 Stepper 양 끝 라벨이 잘리지 않도록 바깥에 라벨 폭의 절반만큼 여백을 두세요(Rules 08).

## 상태

## Props

### StepperIndicator · StepperConnector

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc · 스토리 설명에서 사용자 문서로 옮기지 않은 내용입니다.

- Figma 컴포넌트 세트: `stepper_horizontal`(179:2043) · `stepper_vertical`(203:3949), `stepper_indicator_horizontal`(179:1621) · `stepper_indicator_vertical`(203:3708), `stepper_connector_horizontal`(179:1614) · `stepper_connector_vertical`(203:4253).
- 표시기는 20px 원(번호, 완료이면 CheckCircle, 오류이면 WarningCircle)과 라벨 · 서브 라벨입니다. 루트는 원과 같은 너비(가로) 또는 높이(세로)이고, 글자는 Figma처럼 가운데 맞춰 넘칩니다.
- 연결선은 SVG rect로 그려 Figma 기하(1px 선이 띠 가운데 = 반 픽셀 위치)를 그대로 따릅니다.
- 예전 스토리 설명은 "`StepperIndicator` · `StepperConnector`는 직접 배치용으로 export"라고 했지만, 지금 분류는 내부 부품(사용 금지, `@internal`)입니다.
