import type { MouseEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Link } from '../Link';
import { LINK_SIZES } from '../Link.options';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';
import { koLabel } from '../../../storybook/koLabel';
import { cx } from '../../../utils/cx';

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

// Figma `link` (111:1509, 2026-10-28): State Default · Hover · Pressed · Disabled × Type Default · Visited (Visited has no Disabled).
const STATES = ['Default', 'Hover', 'Pressed', 'Disabled'] as const;
const TYPES = ['Default', 'Visited'] as const;
const stateClass = { Hover: PSEUDO.hover, Pressed: PSEUDO.pressed } as Record<string, string | undefined>;
/** Every rendered state (States story): the four Default-type states, then the visited link in its three states. */
const STATE_LIST = ['Default', 'Hover', 'Pressed', 'Disabled', 'Visited', 'Visited · Hover', 'Visited · Pressed'] as const;
const stateProps = (state: (typeof STATE_LIST)[number]) => ({
  disabled: state === 'Disabled',
  className: [state.startsWith('Visited') ? PSEUDO.visited : '', state.endsWith('Hover') ? PSEUDO.hover : '', state.endsWith('Pressed') ? PSEUDO.pressed : ''].filter(Boolean).join(' ') || undefined,
});

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

/** 크기 · 종류(기본 · 방문) · 상태별 표현을 비교합니다. Figma `link` 21개 변형. */
export const VariantMatrix: Story = {
  name: "Variants",
  render: () => (
    <FigmaMatrix
      columns={[...STATES]}
      rows={LINK_SIZES.flatMap((size) =>
        TYPES.map((type) => ({
          label: type === 'Visited' ? `${size} · Visited` : size,
          cells: STATES.map((state) =>
            type === 'Visited' && state === 'Disabled'
              ? null
              : {
                  figma: `Size=${size}, State=${state}, Type=${type}`,
                  node: (
                    <Link size={size} href="#matrix" showIcon disabled={state === 'Disabled'} className={cx(stateClass[state], type === 'Visited' && PSEUDO.visited)}>
                      라벨명
                    </Link>
                  ),
                },
          ),
        })),
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(21);
    // Hover · Pressed · Visited are CSS pseudo-classes: the test user-event is synthetic (no :hover) and browsers hide :visited
    // from getComputedStyle, so the rules are checked here and the rendered colours by the Figma parity check
    // (scripts/verify-figma.mjs link, pseudo-states classes in the matrix cells).
    const rules = [...document.styleSheets]
      .flatMap((sheet) => { try { return [...sheet.cssRules]; } catch { return []; } })
      .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText.includes('.ds-link:'));
    const colourOf = (selector: string) => rules.find((rule) => rule.selectorText.split(',').map((part) => part.trim()).includes(selector))?.style.color;
    await expect(colourOf('.ds-link:hover')).toBe('var(--colors-link-label-hover)');
    await expect(colourOf('.ds-link:active')).toBe('var(--colors-link-label-pressed)');
    // Figma Type=Visited keeps colors/link/label/visited on Hover and Pressed (only the background changes).
    await expect(colourOf('.ds-link:visited:hover')).toBe('var(--colors-link-label-visited)');
    await expect(colourOf('.ds-link:visited:active')).toBe('var(--colors-link-label-visited)');
    await expect(colourOf('.ds-link:visited:hover .ds-link__icon')).toBe('var(--colors-link-icon-visited)');
    await expect(colourOf('.ds-link:visited:active .ds-link__icon')).toBe('var(--colors-link-icon-visited)');
  },
};

/** Every state at size md — the visited link (Figma Type=Visited) keeps its colour while hovered or pressed. */
export const States: Story = {
  name: "States",
  render: () => (
    <StorySection title="State">
      {STATE_LIST.map((state) => (
        <Link key={state} size="md" href="#states" showIcon {...stateProps(state)}>
          {koLabel(state)}
        </Link>
      ))}
    </StorySection>
  ),
};

// Spies record whether the browser was about to follow the link (defaultPrevented false), then cancel the navigation so the
// test page keeps its URL — the Link itself calls onClick before the default action.
const followed: boolean[] = [];
const onFirst = fn((event: MouseEvent<HTMLAnchorElement>) => { followed.push(event.defaultPrevented); event.preventDefault(); });
const onThird = fn((event: MouseEvent<HTMLAnchorElement>) => { followed.push(event.defaultPrevented); event.preventDefault(); });
const onDisabled = fn();

/** Keyboard: Tab focuses the link, a disabled link is skipped; clicking navigates (onClick runs, the disabled link does nothing). */
export const Interaction: Story = {
  name: "Interaction",
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Link href="#first" onClick={onFirst}>첫 번째</Link>
      <Link href="#second" disabled onClick={onDisabled}>
        비활성
      </Link>
      <Link href="#third" onClick={onThird}>세 번째</Link>
    </div>
  ),
  play: async ({ canvas, userEvent, step }) => {
    onFirst.mockClear();
    onThird.mockClear();
    onDisabled.mockClear();
    followed.length = 0;
    await step('keyboard: Tab skips the disabled link', async () => {
      await userEvent.tab();
      await expect(canvas.getByRole('link', { name: '첫 번째' })).toHaveFocus();
      await userEvent.tab();
      await expect(canvas.getByRole('link', { name: '세 번째' })).toHaveFocus();
    });
    await step('click navigates to the href; a disabled link does not', async () => {
      await userEvent.click(canvas.getByRole('link', { name: '첫 번째' }));
      await expect(onFirst).toHaveBeenCalledTimes(1);
      await expect(followed).toEqual([false]);
      await userEvent.click(canvas.getByRole('link', { name: '비활성' }));
      await expect(onDisabled).not.toHaveBeenCalled();
      await expect(followed).toEqual([false]);
    });
    await step('Enter on a focused link navigates', async () => {
      canvas.getByRole('link', { name: '세 번째' }).focus();
      await userEvent.keyboard('{Enter}');
      await expect(onThird).toHaveBeenCalledTimes(1);
      await expect(followed).toEqual([false, false]);
    });
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
