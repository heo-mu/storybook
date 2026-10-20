import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { FilterBarSample } from './FilterBarSample';

// Visual verification (not in the MCP manifest). Elements carry data-figma names checked by
// `node scripts/verify-figma.mjs dashboard-filter-bar`.
const meta = {
  title: "Components/DashboardFilterBar/Gallery",
  id: 'components-dashboardfilterbar-showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** 지원하는 구성과 상태를 비교합니다. */
export const Figma: Story = {
  name: "Variants",
  render: () => <FilterBarSample data-figma="dashboard-filter-bar" style={{ width: 1616 }} />,
};

/** A search landmark of named groups; the "|" dividers are hidden. */
export const Accessibility: Story = {
  name: "Accessibility",
  render: () => <FilterBarSample style={{ width: 1616 }} />,
  play: async ({ canvas, canvasElement }) => {
    const bar = canvas.getByRole('search', { name: '조회 조건' });
    await expect(bar).toBeInTheDocument();
    for (const name of ['조회 대상', '적용 조건', '조회 기간', '집계']) await expect(canvas.getByRole('group', { name })).toBeInTheDocument();
    await expect(canvasElement.querySelectorAll('.ds-filter-bar__divider[aria-hidden="true"]')).toHaveLength(3);
    await expect(canvas.getByRole('button', { name: '조회' })).toBeInTheDocument();
  },
};
