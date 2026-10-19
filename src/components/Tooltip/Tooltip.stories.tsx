import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { TOOLTIP_PLACEMENTS } from './Tooltip.options';
import { Button } from '../Button';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Tooltip.showcase.stories.tsx
const meta = {
  title: 'Components/Tooltip/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **tooltip** (149:1111). Wrap the trigger: `<Tooltip content="…"><Button>…</Button></Tooltip>`. ' +
          'Message Text → `content`, Placement → `placement`, Arrow → `showArrow`. Shown on hover (after `delay`) and keyboard ' +
          'focus, hidden with Escape (react-aria-components TooltipTrigger: role="tooltip", aria-describedby).',
      },
    },
  },
  args: { content: '변경 사항을 저장합니다', placement: 'top', showArrow: true, children: <Button>저장</Button> },
  argTypes: {
    placement: { control: 'inline-radio', options: TOOLTIP_PLACEMENTS, description: 'Figma "Placement"', table: { defaultValue: { summary: 'top' } } },
    children: { control: false },
  },
  decorators: [(Story) => <div style={{ padding: 64 }}>{Story()}</div>],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = {
  args: { defaultOpen: true, placement: 'right' },
};

export const WithoutArrow: Story = {
  args: { defaultOpen: true, showArrow: false },
};
