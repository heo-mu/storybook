import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { DataState } from '../DataState';

// Visual verification (not in the MCP manifest). Elements carry data-figma names checked by
// `node scripts/verify-figma.mjs data-state`.
const meta = {
  title: "Components/DataState/Gallery",
  id: 'components-datastate-showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const noop = () => {};

/** 지원하는 구성과 상태를 비교합니다. */
export const Figma: Story = {
  name: "Variants",
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 460px)', gap: 20, alignItems: 'start' }}>
      <DataState data-figma="State=Loading" state="loading" />
      <DataState data-figma="State=Empty" state="empty" onAction={noop} />
      <DataState data-figma="State=No-results" state="no-results" onAction={noop} />
      <DataState data-figma="State=Error" state="error" onAction={noop} />
      <DataState data-figma="State=No-access" state="no-access" onAction={noop} />
      <DataState data-figma="State=Partial" state="partial" description="130대 중 128대 수신 · 누락된 2대를 확인하세요." onAction={noop} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const state of canvasElement.querySelectorAll<HTMLElement>('[data-figma]')) {
      const loading = state.dataset.figma === 'State=Loading';
      await expect(state.getBoundingClientRect().height).toBe(loading ? 66 : 120);
      const content = state.querySelector<HTMLElement>('.ds-empty-state');
      if (content) {
        await expect(getComputedStyle(content).paddingTop).toBe('12px');
        await expect(getComputedStyle(content).paddingBottom).toBe('12px');
        const text = content.querySelector<HTMLElement>('.ds-empty-state__text')!;
        await expect(text.getBoundingClientRect().top - content.getBoundingClientRect().top).toBe(12);
      }
    }
  },
};

/** A polite live region; the button calls `onAction`. */
export const Accessibility: StoryObj<{ onAction: () => void }> = {
  name: "Accessibility",
  args: { onAction: fn() },
  render: (args) => (
    <div style={{ width: 460 }}>
      <DataState state="error" onAction={args.onAction} />
    </div>
  ),
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('데이터를 불러오지 못했습니다');
    await userEvent.click(canvas.getByRole('button', { name: '다시 시도' }));
    await expect(args.onAction).toHaveBeenCalledOnce();
  },
};

/** Loading: the label is announced, the skeletons are hidden. */
export const LoadingAccessibility: Story = {
  name: '로딩 접근성',
  render: () => <DataState state="loading" />,
  play: async ({ canvas }) => {
    const status = canvas.getByRole('status');
    await expect(status).toHaveAttribute('aria-busy', 'true');
    await expect(status).toHaveTextContent('데이터를 불러오는 중입니다');
  },
};
