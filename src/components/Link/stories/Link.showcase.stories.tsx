import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Link } from '../Link';
import { LINK_SIZES } from '../Link.options';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';
import { koLabel } from '../../../storybook/koLabel';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs link`.
const meta = {
  title: "Components/Link/Gallery",
  id: 'components-link-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const STATES = ['Default', 'Hover', 'Pressed', 'Visited', 'Disabled'] as const;
const stateClass = { Hover: PSEUDO.hover, Pressed: PSEUDO.pressed, Visited: PSEUDO.visited } as Record<string, string>;

export const Overview: Story = {
  name: "Overview",
  render: () => (
    <div>
      <StorySection title="Size (sm · md · lg)">
        {LINK_SIZES.map((size) => (
          <Link key={size} size={size} href="#overview">
            이용약관
          </Link>
        ))}
      </StorySection>
      <StorySection title="External · Disabled">
        <Link href="https://www.figma.com" external>
          Figma 열기
        </Link>
        <Link href="#disabled" disabled>
          비활성 링크
        </Link>
      </StorySection>
    </div>
  ),
};

/** 크기와 상태별 표현을 비교합니다. */
export const VariantMatrix: Story = {
  name: "Variants",
  render: () => (
    <FigmaMatrix
      columns={[...STATES]}
      rows={LINK_SIZES.map((size) => ({
        label: size,
        cells: STATES.map((state) => ({
          figma: `Size=${size}, State=${state}`,
          node: (
            <Link size={size} href="#matrix" showIcon disabled={state === 'Disabled'} className={stateClass[state]}>
              라벨명
            </Link>
          ),
        })),
      }))}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(15);
  },
};

/** Every state at size md. */
export const States: Story = {
  name: "States",
  render: () => (
    <StorySection title="State">
      {STATES.map((state) => (
        <Link key={state} size="md" href="#states" showIcon disabled={state === 'Disabled'} className={stateClass[state]}>
          {koLabel(state)}
        </Link>
      ))}
    </StorySection>
  ),
};

/** Keyboard: Tab focuses the link, a disabled link is skipped. */
export const Interaction: Story = {
  name: "Interaction",
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Link href="#first">첫 번째</Link>
      <Link href="#second" disabled>
        비활성
      </Link>
      <Link href="#third">세 번째</Link>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: '첫 번째' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: '세 번째' })).toHaveFocus();
  },
};

/** External links announce the new tab; disabled links keep the link role with aria-disabled. */
export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Link href="https://www.figma.com" external>
        Figma
      </Link>
      <Link href="#x" disabled>
        준비 중
      </Link>
    </div>
  ),
  play: async ({ canvas }) => {
    const ext = canvas.getByRole('link', { name: 'Figma (새 창)' });
    await expect(ext).toHaveAttribute('target', '_blank');
    await expect(ext).toHaveAttribute('rel', 'noopener noreferrer');
    const off = canvas.getByRole('link', { name: '준비 중' });
    await expect(off).toHaveAttribute('aria-disabled', 'true');
    await expect(off).not.toHaveAttribute('href');
  },
};
