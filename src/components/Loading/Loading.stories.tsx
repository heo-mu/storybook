import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading } from './Loading';
import { LOADING_SIZES } from './Loading.options';

// Usage stories (Storybook MCP manifest). Verification stories: FileUploader/stories (LoadingMatrix).
const meta = {
  title: 'Components/Loading/Loading',
  component: Loading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **loading** (675:5644): spinning arc with an optional label. size → `size` (md · sm), ' +
          'text → `label`. Renders `role="status"`; without a label set `aria-label` (default "로딩 중").',
      },
    },
  },
  args: {
    size: 'md',
    label: '무엇하는 중...',
  },
  argTypes: {
    size: { control: 'inline-radio', options: LOADING_SIZES, description: 'Figma "size"', table: { defaultValue: { summary: 'md' } } },
    label: { control: 'text', description: 'Figma "text"' },
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const SpinnerOnly: Story = {
  args: { label: undefined, 'aria-label': '불러오는 중' },
};
