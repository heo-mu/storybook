# Toast — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Toast / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Toast** 프레임(91:5557)의 `toast`(3개)를 구현했습니다. 잠시 나타났다 사라지는 알림입니다(화면에 머무는 안내는 Alert).

## 사용 예

```tsx
import { ToastRegion, showToast, closeToast } from 'platform-design-system';

// 앱에 한 번
<ToastRegion />

// 어디서든
showToast('저장했습니다', { status: 'success' });
showToast('저장하지 못했습니다', { status: 'error', timeout: null }); // 닫을 때까지 유지

// 코드에서 닫기: showToast가 돌려준 key
const key = showToast('업로드 중입니다', { timeout: null });
closeToast(key);
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Status Information · Success · Warning · Error | `status` | 테두리 · 아이콘 색. Warning(V-3): `colors/toast/border/warning` · `status-icon/warning`, `showToast`의 기본 시간 없음(오류처럼 닫을 때까지) |
| Alert Text | 메시지(`showToast` 첫 인자 / `children`) | 한 줄, 넘치면 말줄임 |
| Close Icon | `showClose`(정적 `Toast`), 영역의 토스트는 항상 닫기 버튼 | 이름 "알림 닫기". F95(2026-10-20): Figma 속성이 레이어에 연결되지 않던 것을 연결 |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `TOAS-01` **표시 위치 · 개수**: 화면 아래 가운데(아래 여백 20px `p-5`), 토스트 사이 8px(`m-2`). 한 번에 최대 3개 — 새 토스트가 보이고 오래된 것은 대기했다가 앞의 토스트가 닫히면 다시 나타납니다. 위치는 `ToastRegion`의 `className`으로 바꿀 수 있습니다(Rules 06 · toast 주석).
- `TOAS-02` **자동으로 닫히는 시간**: 안내 · 성공은 5초(읽을 시간을 위해 최소 5초), 오류는 닫을 때까지 유지합니다(`showToast`에서 `status: 'error'`의 기본 `timeout`은 `null`). 마우스를 올리거나 포커스가 있는 동안에는 멈춥니다(Rules 06).
- `TOAS-03` **중복 표시**: 같은 문구 · 상태를 다시 보내면 보이는 토스트를 닫고 새로 표시해 겹쳐 쌓이지 않습니다(문자열 · 숫자 메시지, Rules 06).
- `TOAS-04` **긴 메시지**: 높이 36px 고정이라 한 줄로 두고 말줄임합니다(Rules 08).
- `TOAS-06` **닫기 아이콘 포커스**: 키보드 포커스일 때 닫기 아이콘 바깥 2px에 2px `colors/border/focus` 링(Design System Rules 02 — Toast에는 Figma `Focus` 속성이 없어 규칙이 기준).

### 개발 구현 세부 사항

디자인 컴포넌트에 넣지 않는 기술 구현입니다(Design System Rules 10).

- `TOAS-05` **react-aria Toast**: react-aria-components 1.22에서 UNSTABLE API입니다. 이 패키지의 `ToastRegion` · `showToast` · `closeToast`가 감싸므로 라이브러리가 바뀌어도 사용하는 쪽 코드는 그대로입니다. `toastQueue`(react-aria 큐 자체)는 내부 API이니 직접 쓰지 마세요.

## 키보드

| 키 | 동작 |
| --- | --- |
| Tab | 알림 영역의 알림 · 닫기 버튼으로 이동 |
| Enter · Space (닫기) | 알림 닫기 |

## Props

### ToastRegion

## 구현 메모 (Storybook에서 옮김)

- Figma 컴포넌트 세트: `toast`(91:5927).
- `ToastRegion`은 react-aria-components Toast(UNSTABLE_ToastRegion · UNSTABLE_Toast)로 이름 있는 영역(landmark), 토스트 낭독, 마우스 오버 · 포커스 중 타이머 정지를 제공합니다.
- 기본 큐는 `new UNSTABLE_ToastQueue({ maxVisibleToasts: 3 })`이고, `showToast`는 `timeout`을 `Math.max(5000, timeout)`으로 보정합니다.
- 정적 `Toast`는 `role="status"`로 렌더링됩니다(`role` prop으로 덮어쓸 수 있음).
