import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent, CardFooter, CardHeader } from './Card';
import { Button } from '../Button';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Card.showcase.stories.tsx
const meta = {
  title: 'Components/Card/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma Card (185:6512) — "header, content, footer의 조합": `Card` > `CardHeader` (card_header: Card Text → `title`, ' +
          'Sub Text → `description`, Button → `action`) + `CardContent` + `CardFooter` (card_footer: full-width buttons). ' +
          'Note: the Figma Card frame is hidden (figma-issues F61).',
      },
    },
  },
  args: { children: null },
  argTypes: { children: { control: false } },
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

export const Playground: Story = {};

export const HeaderOnly: Story = {
  render: () => (
    <Card style={{ width: 320 }}>
      <CardHeader title="설비 상태" description="정상 12 · 점검 1" />
      <CardContent>최근 점검 2026.10.10</CardContent>
    </Card>
  ),
};
