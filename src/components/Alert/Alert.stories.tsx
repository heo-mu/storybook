import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';
import { ALERT_STATUSES } from './Alert.options';
import { Button } from '../Button';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Alert.showcase.stories.tsx
const meta = {
  title: 'Components/Alert/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **alert** (179:6087): an inline message. Status → `status` (status icon colour), Alert Text → ' +
          '`title`, Sub Text → `description`, Icon → `showIcon`, Button → `action` (Figma uses Button Tertiary · Outline · xs). ' +
          'Error alerts have role="alert", the others role="status". The width follows the layout (320px in Figma).',
      },
    },
  },
  args: { status: 'information', title: '점검 예정', description: '7월 30일 02:00 – 04:00에 서비스를 점검합니다.', showIcon: true },
  argTypes: {
    status: { control: 'inline-radio', options: ALERT_STATUSES, description: 'Figma "Status"', table: { defaultValue: { summary: 'information' } } },
    action: { control: false },
  },
  decorators: [(Story) => <div style={{ width: 360 }}>{Story()}</div>],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithAction: Story = {
  args: {
    status: 'error',
    title: '연결이 끊겼습니다',
    description: '네트워크를 확인한 뒤 다시 시도하세요.',
    action: (
      <Button variant="tertiary" appearance="outline" size="xs">
        재시도
      </Button>
    ),
  },
};

export const TitleOnly: Story = {
  args: { status: 'success', title: '저장했습니다', description: undefined },
};
