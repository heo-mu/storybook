import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';
import { ALERT_STATUSES } from './Alert.options';
import { Button } from '../Button';

// 사용 예 스토리(컴포넌트 매니페스트 포함). 검증용 스토리는 ./stories/Alert.showcase.stories.tsx에 있고 !manifest 태그.
const meta = {
  title: "Components/Alert/Alert",
  id: 'components-alert-alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "현재 화면에서 알아야 할 상태나 안내를 지속적으로 표시합니다. 일시적인 작업 결과는 Toast를 사용합니다.",
      },
    },
  },
  args: { status: 'information', title: '점검 예정', description: '7월 30일 02:00 – 04:00에 서비스를 점검합니다.', showIcon: true },
  argTypes: {
    status: { control: 'inline-radio', options: ALERT_STATUSES, description: '종류 — 안내 · 성공 · 주의 · 오류', table: { defaultValue: { summary: 'information' } } },
    action: { control: false },
  },
  decorators: [(Story) => <div style={{ width: 360 }}>{Story()}</div>],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 모든 Props를 직접 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: "Playground" };

export const WithAction: Story = {
  name: "Action",
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
  name: "Title Only",
  args: { status: 'success', title: '저장했습니다', description: undefined },
};

/** 작업은 계속할 수 있지만 확인이 필요할 때 씁니다. 작업을 막는 문제는 오류(`error`)로 알립니다. */
export const Warning: Story = {
  name: '주의',
  args: { status: 'warning', title: '일부 데이터만 표시됩니다', description: '설비 3대의 데이터가 늦게 들어오고 있습니다.' },
};
