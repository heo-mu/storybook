# Card — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Card / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Card** 프레임(185:6512)의 card_header(218:7173) · card_content · card_footer(218:7174)와 예시 카드(185:8050)를 구현했습니다.
"header, content, footer의 조합"입니다.

> Figma의 Card 프레임은 **숨김** 상태입니다. 레이어 값(크기 · 간격 · 변수)으로 구현하고 위치 · 크기를 검증했지만, 숨긴 프레임은
> 이미지로 렌더링되지 않아 픽셀 비교는 하지 못했습니다(figma-issues F61 — 사용 여부 확인 필요).

## 사용 예

```tsx
import { Button, Card, CardHeader, CardContent, CardFooter } from 'platform-design-system';

<Card>
  <CardHeader title="이번 달 사용량" description="10월 1일 – 16일"
    action={<Button variant="tertiary" appearance="outline" size="sm">상세</Button>} />
  <CardContent>…</CardContent>
  <CardFooter>
    <Button size="md">보고서 보기</Button>
    <Button variant="tertiary" appearance="outline" size="md">닫기</Button>
  </CardFooter>
</Card>
```

## Figma → Props

| Figma | 코드 | 비고 |
| --- | --- | --- |
| card_header Card Text · Sub · Sub Text · Button | `CardHeader title` · `description` · `action` | 제목은 `<h3>`(`headingLevel`) |
| card_content | `CardContent` | 좌우 p-5 |
| card_footer | `CardFooter` | 버튼이 너비를 채움 |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774, 02–09장 — 2026-10-28 확인)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `CARD-01` **그림자**: 효과 스타일 `elevation-1`(0 1 3 / 12%). 2026-10-19 Figma Card 예시의 원격 그림자(shadow-sm)를 로컬 `elevation-1`로 바꿔 디자인과 코드가 같습니다(F60 해소).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `CARD-02` **너비**: 부모 너비를 채웁니다. Figma의 320px은 예시 폭입니다(Rules 08).
- `CARD-04` **테두리 두께 토큰**(2026-10-28 QA): Figma `card` 루트의 네 변 테두리 두께가 외부 라이브러리 변수(`border-width` = 1)에 묶여 있어 디자인 시스템 토큰 `border-width/border`(1px)로 다시 연결했습니다(QA 승인 작업, Z절). 값 · 코드 변화 없음. Content 자리의 회색 예시 상자(#ededed, 하드코딩)는 예시 그래픽이라 그대로 두고 기록만 했습니다(figma-issues F106).
- `CARD-03` **설명 길이**: 줄바꿈하며 자르지 않습니다(예시 문구의 "최대 2줄"은 권장 길이, Rules 08).

## Props

### CardHeader

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc(Storybook Props 표)을 한국어 사용 설명으로 바꾸면서 옮긴 기술 정보입니다.

- `Card`: 위아래 padding `p-5`, 부분 사이 `m-4`, `border-radius/rounded-lg`, 배경 `colors/card/background`, 1px 안쪽 테두리 `colors/card/border`, 그림자(figma-issues F60, `CARD-01`).
- `CardHeader`: Figma card_header(218:7173) — 제목 · 설명 · 버튼 아래에 구분선. 제목은 Figma "Card Text", 설명은 "Sub" · "Sub Text", 버튼은 "Button"(Figma에서 Button Tertiary · Outline · sm).
- `CardContent`: Figma card_content — 좌우 padding `p-5`.
- `CardFooter`: Figma card_footer(218:7174) — 너비를 채우는 버튼 `m-2` 간격(Figma: Primary · Solid · md와 Tertiary · Outline · md).


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Card.showcase.stories.tsx / Figma`: The Figma parts on their own and the Figma example card (320px wide).
