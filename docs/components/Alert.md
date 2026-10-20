# Alert — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Alert / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Alert** 프레임(179:5471)의 `alert`(3개)를 구현했습니다. 화면 안에 머무는 안내 메시지입니다(잠시 떴다 사라지는 알림은 Toast).

## 사용 예

```tsx
import { Alert, Button } from 'platform-design-system';

<Alert status="information" title="점검 예정" description="7월 30일 02:00 – 04:00에 서비스를 점검합니다." />

<Alert
  status="error"
  title="업로드 실패"
  description="파일 크기를 확인하세요."
  action={<Button variant="tertiary" appearance="outline" size="xs" onClick={retry}>재시도</Button>}
/>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Status Information · Success · Warning · Error | `status` | 상태 아이콘(20px)과 색. Warning(2026-10-20 V-3): `warning-fill`(라이브러리 Warning Fill, `WarningFillIcon`) · `colors/alert/status-icon/warning` → `brand-status/warning/strong`, `role="status"` |
| Alert Text | `title` | |
| Sub · Sub Text | `description` | |
| Icon | `showIcon` | |
| Button | `action` | Figma: Button Tertiary · Outline · xs |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `ALER-01` **너비**: 부모 너비를 채웁니다. Figma의 320px은 예시 폭입니다(Rules 08).
- `ALER-02` **설명 길이**: 줄바꿈하며 자르지 않습니다. 길면 문구를 줄이는 것이 원칙입니다(Figma 예시의 "최대 2줄"은 권장 길이, Rules 08).
- `ALER-03` **역할(role)**: 오류는 `role="alert"`(바로 읽음), 안내 · 성공은 `role="status"`. `role` prop으로 바꿀 수 있습니다(Rules 03 · alert 주석).
- `ALER-04` **닫기 버튼**: 없습니다 — Alert는 화면 상태를 설명하는 고정 메시지입니다. 사용자가 닫아야 하는 알림은 Toast를 쓰고, 필요한 동작은 `action`에 넣으세요(Rules 06).

## Props

## 구현 메모 (Storybook에서 옮김)

- Figma 컴포넌트 세트: `alert`(179:6087). Figma 속성 `Sub`가 켜졌을 때의 `Sub Text`가 `description`입니다.
- 상태 아이콘은 `statusIcon.ts`의 `STATUS_ICON`(info-fill · check-circle-fill · x-circle-fill)을 Toast와 함께 씁니다.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Alert.showcase.stories.tsx / Matrix`: Figma `alert` (3): Status, with Icon · Sub · Button on (Figma defaults), 320px wide.
