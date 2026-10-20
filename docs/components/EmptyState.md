# EmptyState — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / EmptyState / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Empty State** 프레임(174:1480)의 `empty-state`(724:14963)를 구현했습니다. 목록 · 차트 등이 비어 있을 때 가운데에 보여 줍니다.

## 사용 예

```tsx
import { EmptyState, TextButton, CaretRightIcon, DatabaseIcon } from 'platform-design-system';

<EmptyState
  icon={<DatabaseIcon />}
  title="아직 수집된 데이터가 없습니다"
  description="수집 설정과 데이터 연결을 확인하세요."
  action={<TextButton rightIcon={<CaretRightIcon />} onClick={openSettings}>수집 설정 확인</TextButton>}
/>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Title Text | `title` | |
| Description · Description Text | `description` | 가운데 정렬, 줄바꿈 |
| Icon | `icon` | 16px, 장식 |
| 버튼(button_text) | `action` | Figma: TextButton Primary sm + CaretRight |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `EMPT-01` **버튼 유무**: Figma 속성 `Show Button`(2026-10-19 추가)과 같이 `action`은 선택입니다 — 할 일이 없는 빈 상태에는 버튼을 두지 않습니다(Rules 07).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `EMPT-02` **너비**: 최대 320px(Figma와 같음), 부모가 더 좁으면 그 너비로 줄어듭니다(Rules 08).

## Props

## 구현 메모 (Storybook에서 옮김)

- 세로 가운데 정렬입니다. 아이콘 · 제목 · 설명은 `m-1` 간격으로 붙고, `action`은 글 묶음 아래 `m-3` 간격에 놓입니다.
- 아이콘은 16px이며 Figma 자리 표시 아이콘은 Database입니다. `aria-hidden`으로 감싸 장식으로 처리합니다.
- 너비는 CSS `width: 320px; max-width: 100%`입니다.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `EmptyState.showcase.stories.tsx / Figma`: Figma `empty-state` with its default content (Icon and Description on).
