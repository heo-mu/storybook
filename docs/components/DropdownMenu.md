# DropdownMenu — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / DropdownMenu / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **Dropdown Menu** 프레임(179:2465)의 `dropdownmenu_item`(5개) · `dropdownmenu_line`과 예시의 메뉴 패널을 구현했습니다.
키보드 · 포커스 복귀 · ARIA(menu / menuitem / group / separator)는 react-aria-components가 담당합니다.

## 사용 예

```tsx
import { Button, DropdownMenu, DropdownMenuItem, DropdownMenuSection, DropdownMenuSeparator } from 'platform-design-system';

<DropdownMenu trigger={<Button>작업</Button>} aria-label="작업" onAction={(key) => run(key)}>
  <DropdownMenuSection title="파일">
    <DropdownMenuItem id="new" icon={<FolderIcon />}>새 폴더</DropdownMenuItem>
    <DropdownMenuItem id="move" icon={<FolderIcon />} chevron description="다른 위치로">이동</DropdownMenuItem>
    <DropdownMenuItem id="lock" disabled>잠금</DropdownMenuItem>
  </DropdownMenuSection>
  <DropdownMenuSeparator />
  <DropdownMenuItem id="delete" danger>삭제</DropdownMenuItem>
</DropdownMenu>
```

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| Type Content | `DropdownMenuItem` | |
| Type Title | `DropdownMenuSection title` | 그룹 제목 (`group` 이름) |
| State Hover | 포인터 hover · 키보드 포커스 | |
| State Alert | `danger` | 삭제 등 위험한 작업 |
| State Disabled | `disabled` | 화살표 키 이동에서 제외 |
| Item · Sub · Sub Text | `children` · `description` | `description`이 있으면 서브 텍스트 표시 |
| Left Icon · Instance | `icon` | 16px 아이콘 |
| Right Icon | `chevron` | CaretRight |
| `dropdownmenu_line` | `DropdownMenuSeparator` | |
| State None | Type=Title 행(상태 없음) — `DropdownMenuSection title` | |

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `DROP-01` **트리거**: 열려도 트리거 모양은 바뀌지 않고(트리거 컴포넌트 그대로) 열림 여부는 `aria-expanded`로 전달됩니다(Rules 05).
- `DROP-02` **키보드 포커스**: 포커스된 항목은 Hover와 같은 모양입니다(Rules 02 — 목록 항목 포커스).
- `DROP-03` **패널 위치**: 트리거 아래 4px(`offset`, Select · Date Picker와 같음 — Breadcrumb은 2px), 시작 정렬. 화면 밖으로 나가면 위치를 뒤집습니다(Rules 05).
- `DROP-04` **패널 너비**: 내용에 맞춥니다(Figma의 200 · 140px은 예시 폭). 필요하면 `className`으로 지정합니다(Rules 05).
- `DROP-05` **하위 메뉴**: 지원하지 않습니다. `chevron`은 다른 화면으로 이동한다는 표시입니다(Rules 05).
- `DROP-06` **설명이 있는 항목의 이름**: 라벨과 설명(`description`) 전체가 항목 이름입니다 — 보이는 글자가 모두 이름에 들어갑니다(WCAG 2.5.3, Rules 03).

## 키보드

| 키 | 동작 |
| --- | --- |
| Enter · Space · ↓ (트리거) | 메뉴 열기, 첫 항목에 포커스 (↑는 마지막 항목) |
| ↑ · ↓ · Home · End | 항목 이동 (Disabled 건너뜀) |
| 문자 입력 | 해당 글자로 시작하는 항목으로 이동 |
| Enter · Space | 항목 실행 후 닫기 |
| Esc | 닫고 트리거로 포커스 복귀 |
| 바깥 클릭 | 닫기 |

## Props

### DropdownMenuItem · DropdownMenuSection
