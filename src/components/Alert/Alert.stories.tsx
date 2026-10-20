import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';
import { ALERT_STATUSES } from './Alert.options';
import { Button } from '../Button';

// 사용 예 스토리(컴포넌트 매니페스트 포함). 검증용 스토리는 ./stories/Alert.showcase.stories.tsx에 있고 !manifest 태그.
const meta = {
  title: '컴포넌트/Alert/Alert',
  id: 'components-alert-alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '화면 안에 머물며 상태나 안내를 전하는 알림입니다. 종류는 `status`로 고르고, 필요한 동작은 `action`에 버튼으로 넣습니다.',
      },
    },
  },
  args: { status: 'information', title: '점검 예정', description: '7월 30일 02:00 – 04:00에 서비스를 점검합니다.', showIcon: true },
  argTypes: {
    status: { control: 'inline-radio', options: ALERT_STATUSES, description: '종류 — 안내 · 성공 · 오류', table: { defaultValue: { summary: 'information' } } },
    action: { control: false },
  },
  decorators: [(Story) => <div style={{ width: 360 }}>{Story()}</div>],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 모든 Props를 직접 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: '직접 체험' };

export const WithAction: Story = {
  name: '버튼 있음',
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
  name: '제목만',
  args: { status: 'success', title: '저장했습니다', description: undefined },
};
