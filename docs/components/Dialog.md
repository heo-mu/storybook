# Dialog — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Dialog / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Dialog** 프레임(149:1287)의 `dialog`(149:2838)를 구현했습니다. 화면 위에 떠서 응답을 받는 모달입니다.

## 사용 예

```tsx
import { Button, Dialog } from 'platform-design-system';

<Dialog
  trigger={<Button>삭제</Button>}
  role="alertdialog"
  title="파일을 삭제할까요?"
  description="삭제한 파일은 되돌릴 수 없습니다."
  actions={(close) => (
    <>
      <Button variant="tertiary" appearance="solid" size="lg" onClick={close}>취소</Button>
      <Button size="lg" onClick={() => { remove(); close(); }}>삭제</Button>
    </>
  )}
/>

// 직접 열고 닫기
<Dialog open={open} onOpenChange={setOpen} title="…" actions={…} />
```

## Figma → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| title | `title` | 대화상자 이름(`aria-labelledby`) |
| description | `description` | 대화상자 설명(`aria-describedby`) |
| dialog_footer (버튼 2개, 240px) | `actions` | 같은 너비로 채움. 함수면 `close`를 받음 |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `DIAL-01` **배경 덮개(scrim)**: 모달은 `colors/dialog/scrim/default`(→ `colors/surface/scrim`, 검정 50%) 덮개로 뒤 화면을 가리고 조작을 막습니다. 2026-10-19 Figma에 이 변수와 덮개가 있는 Dialog 예시를 추가했습니다(F51 해소).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `DIAL-02` **내용 영역**: `children`은 헤더와 버튼 사이에 같은 간격(`m-8`)으로 놓입니다(Rules 08).
- `DIAL-03` **닫기 · 포커스**: Esc로 닫힘(`keyboardDismissDisabled`로 끔), 바깥 클릭은 `dismissable`일 때만(입력 유실 방지). 열리면 포커스가 안으로 이동해 갇히고, 닫히면 연 요소로 돌아갑니다. 닫기(X) 버튼은 없습니다(Rules 05 · dialog 주석).
- `DIAL-04` **열림 · 닫힘 애니메이션**: 없습니다 — 즉시 나타납니다(Rules 09).

## 키보드

| 키 | 동작 |
| --- | --- |
| Tab · Shift+Tab | 대화상자 안에서만 이동 |
| Esc | 닫고 트리거로 포커스 복귀 |

## Props
