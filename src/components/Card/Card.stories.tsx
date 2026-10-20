import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent, CardFooter, CardHeader } from './Card';
import { Button } from '../Button';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Card.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Card/Card',
  id: 'components-card-card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '관련된 내용과 버튼을 한 상자로 묶어 보여 주는 카드입니다. `CardHeader`(제목 · 설명 · 버튼), `CardContent`(본문), ' +
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

/** 머리글 · 본문 · 바닥글을 모두 넣은 카드입니다. */
export const Playground: Story = { name: '직접 체험' };

/** 바닥글 없이 머리글과 본문만 넣은 카드입니다. */
export const HeaderOnly: Story = {
  name: '머리글만',
  render: () => (
    <Card style={{ width: 320 }}>
      <CardHeader title="설비 상태" description="정상 12 · 점검 1" />
      <CardContent>최근 점검 2026.10.10</CardContent>
    </Card>
  ),
};
