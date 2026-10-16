import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { MetricTrend } from '../MetricTrend';
import { METRIC_TREND_DIRECTIONS, METRIC_TREND_TONES } from '../MetricTrend.options';

// Visual verification (not in the MCP manifest). Elements carry data-figma names checked by
// `node scripts/verify-figma.mjs metric-trend`.
const meta = {
  title: 'Components/MetricTrend/Showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Direction × Tone (12 Figma variants). */
export const Figma: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, max-content)', gap: 24 }}>
      {METRIC_TREND_TONES.map((tone) =>
        METRIC_TREND_DIRECTIONS.map((direction) => (
          <MetricTrend key={`${direction}-${tone}`} data-figma={`Direction=${cap(direction)}, Tone=${cap(tone)}`} direction={direction} tone={tone}>
            4.8%p
          </MetricTrend>
        )),
      )}
    </div>
  ),
};

/** The icon is decorative; the direction is read before the change. */
export const Accessibility: Story = {
  render: () => (
    <p>
      전력 사용량{' '}
      <MetricTrend direction="down" tone="positive">
        4.8%p
      </MetricTrend>
    </p>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('p')).toHaveTextContent('전력 사용량 감소 4.8%p');
    await expect(canvasElement.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
};
