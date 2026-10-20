import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Card, CardContent, CardFooter, CardHeader } from '../Card';
import { Button } from '../../Button';

// Visual verification (not in the MCP manifest). Elements carry data-figma names checked by
// `node scripts/verify-figma.mjs card` (card_header, card_footer, card — geometry only: the Figma frame is hidden).
const meta = {
  title: "Components/Card/Gallery",
  id: 'components-card-showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Story-only stand-in for the content (the grey 280 × 100 rectangle of the Figma example). */
const Placeholder = () => <div style={{ height: 100, background: 'var(--colors-surface-container)' }} />;

/** 지원하는 구성과 상태를 비교합니다. */
export const Figma: Story = {
  name: "Variants",
  render: () => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
      <div style={{ display: 'grid', gap: 24, width: 320 }}>
        <CardHeader
          data-figma="header:card_header"
          title="제목"
          description="서브 내용 최대 2줄"
          action={
            <Button variant="tertiary" appearance="outline" size="sm">
              라벨명
            </Button>
          }
        />
        <CardFooter data-figma="footer:card_footer">
          <Button size="md">버튼</Button>
          <Button variant="tertiary" appearance="outline" size="md">
            버튼
          </Button>
        </CardFooter>
      </div>
      <Card data-figma="card:card" style={{ width: 320 }}>
        <CardHeader
          title="제목"
          description="서브 내용 최대 2줄"
          action={
            <Button variant="tertiary" appearance="outline" size="sm">
              라벨명
            </Button>
          }
        />
        <CardContent>
          <Placeholder />
        </CardContent>
        <CardFooter>
          <Button size="md">버튼</Button>
          <Button variant="tertiary" appearance="outline" size="md">
            버튼
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

/** The title is a heading (level 3 by default); actions are ordinary buttons. */
export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <Card style={{ width: 320 }}>
      <CardHeader title="에너지 사용량" description="이번 달 누적" headingLevel={2} />
      <CardContent>1,284 kWh</CardContent>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: '에너지 사용량' })).toBeInTheDocument();
  },
};
