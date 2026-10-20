# Accordion — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / Accordion / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Accordion** 프레임(1035:15645)의 `accordion-item`(10개)을 구현했습니다. 제목 버튼으로 내용을 펼치고 접습니다.

## 사용 예

```tsx
import { Accordion, AccordionItem } from 'platform-design-system';

<Accordion defaultExpandedKeys={['advanced']}>
  <AccordionItem id="basic" title="기본 설정">…</AccordionItem>
  <AccordionItem id="advanced" title="고급 설정" description="알림과 수집 조건을 설정합니다.">…</AccordionItem>
  <AccordionItem id="lab" title="실험 기능" disabled>…</AccordionItem>
</Accordion>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Size md · sm | `Accordion size` | 제목 16 · 14px, 높이 44 · 36px |
| Expanded | `expandedKeys` · `defaultExpandedKeys` / 단독 항목 `expanded` · `defaultExpanded` | 화살표 위 · 아래, 제목 semibold |
| State Hover | 브라우저 `:hover` | |
| State Disabled | `disabled` | |
| Title Text | `title` | |
| Show Description · Description Text | `description` | |
| Show Divider | `divider` | 기본 켜짐 |
| Body (accordion-content) | `children` | |
| Expanded True · False | 펼침 — `Accordion expandedKeys` / `defaultExpandedKeys` | |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `ACCO-01` **Hover · Expanded**: Hover는 모든 크기에서 배경 `background/hover`와 진한 구분선 `border/hover`, 펼친 항목은 진한 구분선(Figma State=Hover · Expanded).
- `ACCO-02` **Disabled**: 배경 `background/disabled`(fill/disabled), 제목 `title/disabled`(text/inactive — 비활성 라벨).
- `ACCO-06` **포커스**: 키보드 포커스일 때 트리거 안쪽 가장자리에 2px `colors/border/focus` 링(Figma 속성 `Focus`, 안쪽형) — 폭을 채우는 행이라 이웃 항목에 가려지지 않도록 안쪽에 그립니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `ACCO-03` **여러 개 열기**: 기본은 한 항목만 펼칩니다(다른 항목을 열면 이전 항목이 닫힘). 비교가 필요한 화면만 `allowsMultipleExpanded`로 여러 개(Rules 07 · accordion-item 주석).
- `ACCO-04` **애니메이션**: 펼침 · 접힘은 즉시 바뀝니다(Rules 09).
- `ACCO-05` **너비**: 부모 너비를 채웁니다. Figma의 320px은 예시 폭입니다(Rules 08).

## 키보드

| 키 | 동작 |
| --- | --- |
| Tab | 제목 버튼 사이 이동(비활성 제외) |
| Enter · Space | 펼치기 · 접기 |

## Props

### AccordionItem

## 구현 메모 (Storybook에서 옮김)

- Figma 컴포넌트 세트: `accordion-item`(1035:15648).
- react-aria-components 기반입니다. `Accordion`은 `DisclosureGroup`, `AccordionItem`은 `Disclosure`이며 제목 버튼에 `aria-expanded` · `aria-controls`가 붙습니다.
- Figma State Hover는 CSS `:hover`, Expanded는 펼침, Disabled는 `disabled` prop입니다.


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `Accordion.showcase.stories.tsx / Matrix`: Figma `accordion-item` (10): Size × State × Expanded, 320px wide.
