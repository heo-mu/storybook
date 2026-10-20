import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DataState } from './DataState';
import { DATA_STATES } from './DataState.options';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/DataState.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/DataState/DataState',
  id: 'components-datastate-datastate',
  component: DataState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '데이터 영역에 내용 대신 불러오는 중 · 빈 상태 · 결과 없음 · 오류 · 권한 없음 · 일부만 표시를 보여 줍니다. ' +
          '상태는 `state`로 고르고, 버튼은 `onAction`을 넘길 때만 나타납니다.',
      },
    },
  },
  args: { state: 'empty', onAction: fn() },
  argTypes: {
    state: {
      control: 'select',
      options: DATA_STATES,
      description: '상태 — 불러오는 중(loading) · 빈 상태(empty) · 결과 없음(no-results) · 오류(error) · 권한 없음(no-access) · 일부만 표시(partial)',
    },
  },
  render: (args) => (
    <div style={{ width: 460, maxWidth: '100%' }}>
      <DataState {...args} />
    </div>
  ),
} satisfies Meta<typeof DataState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 상태를 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: '직접 체험' };

/** 데이터를 불러오는 동안 보여 줍니다. */
export const Loading: Story = { name: '불러오는 중', args: { state: 'loading' } };

/** 데이터를 불러오지 못했을 때 보여 줍니다. 다시 시도 버튼이 있습니다. */
export const ErrorState: Story = { name: '오류', args: { state: 'error' } };

/** 일부만 표시 상태에는 기본 설명이 없으므로 실제 수치를 넣습니다. */
export const Partial: Story = {
  name: '일부만 표시',
  args: { state: 'partial', description: '130대 중 128대 수신 · 누락된 2대를 확인하세요.' },
};

/** `onAction`이 없으면 버튼도 없습니다. */
export const WithoutAction: Story = {
  name: '버튼 없음',
  args: { state: 'no-results', onAction: undefined },
};
