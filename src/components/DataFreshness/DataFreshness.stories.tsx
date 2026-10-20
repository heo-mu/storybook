import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataFreshness } from './DataFreshness';
import { DATA_FRESHNESS_STATES } from './DataFreshness.options';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/DataFreshness.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/DataFreshness/DataFreshness',
  id: 'components-datafreshness-datafreshness',
  component: DataFreshness,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '데이터가 얼마나 최신인지 상태 배지, 마지막 수신 시각, 갱신 주기로 보여 줍니다. 상태는 `state`, 시각은 `timestamp`, ' +
          '갱신 주기는 `interval`로 넣습니다.',
      },
    },
  },
  args: { state: 'fresh', timestamp: '2026.10.14 09:30', dateTime: '2026-10-14T09:30', interval: '자동 갱신 1분' },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: DATA_FRESHNESS_STATES,
      description: '상태 — 최근 수신(fresh) · 수신 지연(stale) · 연결 끊김(offline)',
      table: { defaultValue: { summary: 'fresh' } },
    },
  },
} satisfies Meta<typeof DataFreshness>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 상태와 글자를 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: '직접 체험' };

/** 데이터 수신이 늦어진 상태입니다. */
export const Stale: Story = { name: '지연', args: { state: 'stale' } };

/** 연결이 끊긴 상태입니다. 갱신 주기 없이 표시한 예입니다. */
export const Offline: Story = { name: '연결 끊김', args: { state: 'offline', interval: undefined } };
