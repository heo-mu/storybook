import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricTrend } from './MetricTrend';
import { METRIC_TREND_DIRECTIONS, METRIC_TREND_TONES } from './MetricTrend.options';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/MetricTrend.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/MetricTrend/MetricTrend",
  id: 'components-metrictrend-metrictrend',
  component: MetricTrend,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "지표의 증감과 그 의미를 함께 표시합니다. 증가·감소 방향과 긍정·부정 평가는 별도로 지정합니다.",
      },
    },
  },
  args: { children: '4.8%p', direction: 'up', tone: 'positive' },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: METRIC_TREND_DIRECTIONS,
      description: '방향 — 증가(up) · 감소(down) · 변동 없음(flat) · 비교 없음(disabled)',
      table: { defaultValue: { summary: 'up' } },
    },
    tone: {
      control: 'inline-radio',
      options: METRIC_TREND_TONES,
      description: '긍정·부정 의미 — 좋음(positive) · 나쁨(negative) · 중립(neutral)',
      table: { defaultValue: { summary: 'positive' } },
    },
  },
} satisfies Meta<typeof MetricTrend>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 방향과 긍정·부정 의미를 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: "Playground" };

/** 에너지 사용량처럼 줄어드는 것이 좋은 지표의 감소입니다. */
export const DecreaseIsGood: Story = {
  name: "감소 · 긍정",
  args: { direction: 'down', tone: 'positive', children: '4.8%p' },
};

/** 늘어나는 것이 나쁜 지표의 증가입니다. */
export const Increase: Story = {
  name: "증가 · 부정",
  args: { direction: 'up', tone: 'negative', children: '12%' },
};

/** 비교할 값이 없을 때입니다. */
export const Disabled: Story = {
  name: "비교 데이터 없음",
  args: { direction: 'disabled', children: '-' },
};
