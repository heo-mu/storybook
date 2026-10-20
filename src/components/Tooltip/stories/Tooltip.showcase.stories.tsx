import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Tooltip } from '../Tooltip';
import { TOOLTIP_PLACEMENTS } from '../Tooltip.options';
import { Button } from '../../Button';

// Visual verification (not in the MCP manifest). Open tooltips carry data-figma names checked by
// `node scripts/verify-figma.mjs tooltip` (set tooltip).
const meta = {
  title: '컴포넌트/Tooltip/전체 보기',
  id: 'components-tooltip-showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export const Overview: Story = {
  name: '개요',
  render: () => (
    <div style={{ padding: 64 }}>
      <Tooltip content="툴팁 내용" defaultOpen>
        <Button variant="secondary" appearance="outline">
          도움말
        </Button>
      </Tooltip>
    </div>
  ),
};

/** Figma `tooltip` (4): Placement with the arrow, each tooltip open next to its trigger. */
export const Matrix: Story = {
  name: '모든 변형',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 200px)', gap: 24, padding: 80 }}>
      {TOOLTIP_PLACEMENTS.map((placement) => (
        <div key={placement} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120 }}>
          <Tooltip content="툴팁 내용" placement={placement} open data-figma={`Placement=${cap(placement)}`}>
            <Button size="sm">{placement}</Button>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};

/** Keyboard focus shows the tooltip immediately, Escape hides it; hover shows it after the delay. */
export const Interaction: Story = {
  name: '동작',
  render: () => (
    <div style={{ padding: 64 }}>
      <Tooltip content="변경 사항을 저장합니다" delay={0}>
        <Button>저장</Button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: '저장' });
    await step('Tab focuses the trigger and shows the tooltip', async () => {
      await userEvent.tab();
      await expect(trigger).toHaveFocus();
      const tip = await body.findByRole('tooltip');
      await expect(tip).toHaveTextContent('변경 사항을 저장합니다');
      await expect(trigger).toHaveAttribute('aria-describedby', tip.id);
    });
    await step('Escape hides it', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByRole('tooltip')).not.toBeInTheDocument());
    });
  },
};
