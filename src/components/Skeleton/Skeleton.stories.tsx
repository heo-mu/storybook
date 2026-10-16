import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';
import { SKELETON_SHAPES } from './Skeleton.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Skeleton.showcase.stories.tsx
const meta = {
  title: 'Components/Skeleton/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **skeleton** (697:4486, 4 variants): Shape → `shape` (line 60 × 8 · shape4 100 × 10 · block 140 × 12 · ' +
          'circle 24). A static placeholder (no animation in Figma), hidden from assistive technology — announce loading on the ' +
          'surrounding region (e.g. `DataState state="loading"`). Resize with `style` width / height.',
      },
    },
  },
  args: { shape: 'line' },
  argTypes: { shape: { control: 'inline-radio', options: SKELETON_SHAPES, description: 'Figma "Shape"', table: { defaultValue: { summary: 'line' } } } },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** A list row placeholder built from the shapes. */
export const ListRow: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Skeleton shape="circle" />
      <div style={{ display: 'grid', gap: 4 }}>
        <Skeleton shape="block" />
        <Skeleton shape="line" />
      </div>
    </div>
  ),
};

/** Custom size through `style` (the colour and radius stay). */
export const CustomSize: Story = {
  args: { shape: 'block', style: { width: 240, height: 12 } },
};
