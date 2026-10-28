# Toast — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Toast / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Toast** 프레임(91:5557)의 `toast`(4개, 2026-10-27 재설계 · 2026-10-28 동기화)를 구현했습니다. 잠시 나타났다 사라지는 알림입니다(화면에 머무는 안내는 Alert).
320px 너비에 높이는 내용에 맞춰(제목만 40px, 설명 포함 54px, 최소 36px) 늘어나고, 오른쪽에 "닫기" 텍스트 버튼(`button_text` Primary sm + 원형 X 아이콘)이 있습니다.

## 사용 예

```tsx
import { ToastRegion, showToast, closeToast } from 'platform-design-system';

// 앱에 한 번
<ToastRegion />

// 어디서든
showToast('저장했습니다', { status: 'success' });
showToast('저장하지 못했습니다', { status: 'error', description: '네트워크 연결을 확인하세요' });

// 닫을 때까지 유지하고 코드에서 닫기: showToast가 돌려준 key
const key = showToast('업로드 중입니다', { timeout: null });
closeToast(key);
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Status Information · Success · Warning · Error | `status` | 테두리 `colors/toast/border/<status>` · 아이콘 `status-icon/<status>`. 모든 종류가 5초 뒤 닫힘(Rules 06, 2026-10-28) |
| Alert Text | 제목(`showToast` 첫 인자 / `children`) | sm/leading-normal/medium `colors/toast/label/title/default`, 한 줄 · 말줄임 |
| Sub Text · Show Sub Text | `description`(없으면 제목만) | xs/leading-normal/normal `colors/toast/label/body/default`, 제목 아래 2px(`p-0_5`), 한 줄 · 말줄임 |
| Show Icon | `showIcon` (기본 true) | 20px 종류 아이콘 |
| `button_text` "닫기" (Primary sm, Right Icon XCircle fill 16px) | `showClose`(정적 `Toast`), 영역의 토스트는 항상 | 보이는 글자 "닫기", 낭독 이름 `closeLabel`(기본 "알림 닫기"). 정적 `Toast`는 `TextButton`, 영역은 react-aria 닫기 버튼에 같은 클래스 · 구조 |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `TOAS-01` **표시 위치 · 개수**: 화면 아래 오른쪽(오른쪽 · 아래 여백 20px `p-5`), 토스트 사이 8px(`m-2`), 가장 최신 토스트가 아래에 붙고 먼저 온 토스트가 위로 밀려 올라갑니다. 한 번에 최대 3개 — 네 번째가 오면 가장 오래된 토스트가 밀려 나가 사라집니다(`showToast`가 가장 오래된 것을 닫음). 위치는 `ToastRegion`의 `className`으로 바꿀 수 있습니다(Rules 06, 2026-10-28 개정).
- `TOAS-02` **자동으로 닫히는 시간**: 모든 종류가 5초(`TOAST_TIMEOUT`, 더 짧게 정할 수 없음) 뒤 닫힙니다. `timeout: null`이면 닫을 때까지 유지합니다. 마우스를 올리거나 포커스가 있는 동안에는 멈춥니다(react-aria, Figma에 별도 규정 없음 — 유지).
- `TOAS-03` **중복 표시**: 같은 문구 · 상태를 다시 보내면 보이는 토스트를 닫고 새로 표시해 겹쳐 쌓이지 않습니다(문자열 · 숫자 메시지, Rules 06).
- `TOAS-04` **긴 메시지**: 제목 · 설명을 각각 한 줄로 두고 말줄임합니다(Rules 08 "토스트는 한 줄로 줄입니다"). 높이는 내용에 맞춰 40 · 54px.
- `TOAS-06` **닫기 버튼 포커스**: 키보드 포커스일 때 "닫기" 버튼 바깥 2px에 2px `colors/border/focus` 링(`button_text`의 Focus 속성 · Rules 02).
- `TOAS-07` **진행 표시줄 없음**: Figma 토스트에는 남은 시간 표시(progress bar)가 없어 만들지 않았습니다(2026-10-28 확인).

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
- 기본 큐는 `new UNSTABLE_ToastQueue({ maxVisibleToasts: 3 })`이고, `showToast`는 `timeout`을 `Math.max(5000, timeout)`으로 보정하며 보이는 토스트가 3개면 가장 오래된 것을 먼저 닫습니다. react-aria는 최신 토스트를 DOM 앞에 두므로 영역은 `flex-direction: column-reverse`로 최신을 아래에 둡니다. 등장 · 퇴장 애니메이션은 Figma에 없어 두지 않았습니다(reduced-motion 영향 없음).
- 정적 `Toast`는 `role="status"`로 렌더링됩니다(`role` prop으로 덮어쓸 수 있음).


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Toast.showcase.stories.tsx / Matrix`: Figma `toast` (4): Status × title + Sub Text, Show Icon on, "닫기" button — 320 × 54.
- `Toast.showcase.stories.tsx / Policy`: Design System Rules 06 (2026-10-28): every toast closes after 5 s, at most 3 on screen — a 4th pushes the oldest out, the same message is not stacked.
