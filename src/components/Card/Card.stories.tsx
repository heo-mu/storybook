import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent, CardFooter, CardHeader } from './Card';
import { Button } from '../Button';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Card.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Card/Card",
  id: 'components-card-card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "관련 정보와 동작을 하나의 영역으로 묶습니다. 헤더·본문·푸터를 필요한 만큼 조합합니다." +
          '`CardFooter`(아래쪽 버튼)를 필요한 만큼 조합해 씁니다.',
      },
    },
  },
  args: { children: null },
  argTypes: { children: { control: false, description: '카드 안에 넣을 `CardHeader` · `CardContent` · `CardFooter`' } },
  render: () => (
    <Card style={{ width: 320 }}>
      <CardHeader
        title="이번 달 사용량"
        description="10월 1일 – 16일"
        action={
          <Button variant="tertiary" appearance="outline" size="sm">
            상세
          </Button>
        }
      />
      <CardContent>1,284 kWh · 지난달보다 4% 적음</CardContent>
      <CardFooter>
        <Button size="md">보고서 보기</Button>
        <Button variant="tertiary" appearance="outline" size="md">
          닫기
        </Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 헤더 · 본문 · 푸터를 모두 넣은 카드입니다. */
export const Playground: Story = { name: "Playground" };

/** 푸터 없이 헤더와 본문만 넣은 카드입니다. */
export const HeaderOnly: Story = {
  name: "Header Only",
  render: () => (
    <Card style={{ width: 320 }}>
      <CardHeader title="설비 상태" description="정상 12 · 점검 1" />
      <CardContent>최근 점검 2026.10.10</CardContent>
    </Card>
  ),
};
