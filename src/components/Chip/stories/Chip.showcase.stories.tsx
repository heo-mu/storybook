import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu, MenuItem, MenuTrigger, Popover as AriaPopover } from 'react-aria-components';
import { expect, within } from 'storybook/test';
import { Chip } from '../Chip';
import { InputChip } from '../InputChip';
import { FilterChip } from '../FilterChip';
import { CHIP_SIZES } from '../Chip.options';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs chip` (sets chip-multi, chip-input, chip-filter).
const meta = {
  title: 'Components/Chip/Showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const STATES = ['Default', 'Hover', 'Pressed', 'Disabled'] as const;
type State = (typeof STATES)[number];
const stateProps = (state: State) => ({
  disabled: state === 'Disabled',
  className: state === 'Hover' ? PSEUDO.hover : state === 'Pressed' ? PSEUDO.pressed : undefined,
});

export const Overview: Story = {
  render: () => (
    <div>
      <StorySection title="Chip (chip-multi) — toggle">
        <Chip size="sm" defaultSelected>전체</Chip>
        <Chip size="sm">진행 중</Chip>
        <Chip size="sm">완료</Chip>
        <Chip size="sm" disabled>보류</Chip>
      </StorySection>
      <StorySection title="InputChip (chip-input) — remove">
        <InputChip size="sm">디자인</InputChip>
        <InputChip size="sm">프론트엔드</InputChip>
        <InputChip size="sm" disabled>
          비활성
        </InputChip>
      </StorySection>
      <StorySection title="FilterChip (chip-filter) — opens a filter">
        <FilterChip size="sm">상태</FilterChip>
        <FilterChip size="sm" selected>
          담당자: 김민지
        </FilterChip>
        <FilterChip size="sm" expanded>
          기간
        </FilterChip>
      </StorySection>
      <StorySection title="Size (xs · sm · md)">
        {CHIP_SIZES.map((size) => (
          <Chip key={size} size={size} defaultSelected>
            라벨명
          </Chip>
        ))}
      </StorySection>
    </div>
  ),
};

/** Figma `chip-multi` (24): Variant × Size (rows) × State (columns). */
export const MultiMatrix: Story = {
  render: () => (
    <FigmaMatrix
      columns={[...STATES]}
      rows={(['Unselected', 'Selected'] as const).flatMap((variant) =>
        CHIP_SIZES.map((size) => ({
          label: `${variant} · ${size}`,
          cells: STATES.map((state) => ({
            figma: `Variant=${variant}, Size=${size}, State=${state}`,
            node: (
              <Chip size={size} defaultSelected={variant === 'Selected'} {...stateProps(state)}>
                라벨명
              </Chip>
            ),
          })),
        })),
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(24);
  },
};

/** Figma `chip-input` (12): Size (rows) × State (columns). */
export const InputMatrix: Story = {
  render: () => (
    <FigmaMatrix
      columns={[...STATES]}
      rows={CHIP_SIZES.map((size) => ({
        label: size,
        cells: STATES.map((state) => ({
          figma: `Size=${size}, State=${state}`,
          node: (
            <InputChip size={size} {...stateProps(state)}>
              라벨명
            </InputChip>
          ),
        })),
      }))}
    />
  ),
};

/** Figma `chip-filter` (48): Variant × Expanded × Size (rows) × State (columns). */
export const FilterMatrix: Story = {
  render: () => (
    <FigmaMatrix
      columns={[...STATES]}
      rows={(['Unselected', 'Selected'] as const).flatMap((variant) =>
        (['False', 'True'] as const).flatMap((expanded) =>
          CHIP_SIZES.map((size) => ({
            label: `${variant} · Expanded ${expanded} · ${size}`,
            cells: STATES.map((state) => ({
              figma: `Variant=${variant}, Size=${size}, State=${state}, Expanded=${expanded}`,
              node: (
                <FilterChip size={size} selected={variant === 'Selected'} expanded={expanded === 'True'} {...stateProps(state)}>
                  라벨명
                </FilterChip>
              ),
            })),
          })),
        ),
      )}
    />
  ),
};

/** Every state of each kind at size sm. */
export const States: Story = {
  render: () => (
    <div>
      {(['Unselected', 'Selected'] as const).map((variant) => (
        <StorySection key={variant} title={`Chip · ${variant}`}>
          {STATES.map((state) => (
            <Chip key={state} size="sm" defaultSelected={variant === 'Selected'} {...stateProps(state)}>
              {state}
            </Chip>
          ))}
        </StorySection>
      ))}
      <StorySection title="InputChip">
        {STATES.map((state) => (
          <InputChip key={state} size="sm" {...stateProps(state)}>
            {state}
          </InputChip>
        ))}
      </StorySection>
      <StorySection title="FilterChip · Selected">
        {STATES.map((state) => (
          <FilterChip key={state} size="sm" selected {...stateProps(state)}>
            {state}
          </FilterChip>
        ))}
      </StorySection>
    </div>
  ),
};

function Tags() {
  const [tags, setTags] = useState(['디자인', '개발', '데이터']);
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {tags.map((t) => (
          <InputChip key={t} size="sm" onRemove={() => setTags((all) => all.filter((x) => x !== t))}>
            {t}
          </InputChip>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Chip size="sm">알림 켜짐</Chip>
        <FilterChip size="sm" expanded={open} onPress={() => setOpen((o) => !o)}>
          기간
        </FilterChip>
      </div>
    </div>
  );
}

/** Toggle, remove (click or Delete), filter chip expanded state. */
export const Interaction: Story = {
  render: () => <Tags />,
  play: async ({ canvas, userEvent, step }) => {
    await step('Chip toggles aria-pressed', async () => {
      const chip = canvas.getByRole('button', { name: '알림 켜짐' });
      await userEvent.click(chip);
      await expect(chip).toHaveAttribute('aria-pressed', 'true');
      await userEvent.click(chip);
      await expect(chip).toHaveAttribute('aria-pressed', 'false');
    });
    await step('InputChip removes on click and on Delete', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '디자인 삭제' }));
      await expect(canvas.queryByRole('button', { name: '디자인 삭제' })).not.toBeInTheDocument();
      canvas.getByRole('button', { name: '개발 삭제' }).focus();
      await userEvent.keyboard('{Delete}');
      await expect(canvas.queryByRole('button', { name: '개발 삭제' })).not.toBeInTheDocument();
    });
    await step('FilterChip reports its expanded state', async () => {
      const filter = canvas.getByRole('button', { name: '기간' });
      await expect(filter).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(filter);
      await expect(filter).toHaveAttribute('aria-expanded', 'true');
    });
  },
};

/** Buttons with state: aria-pressed (Chip), "삭제" in the name (InputChip), aria-expanded (FilterChip). */
export const Accessibility: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Chip defaultSelected>선택됨</Chip>
      <InputChip>태그</InputChip>
      <FilterChip expanded={false}>필터</FilterChip>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: '선택됨' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: '태그 삭제' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: '필터' })).toHaveAttribute('aria-expanded', 'false');
  },
};

/**
 * FilterChip as the trigger of a react-aria MenuTrigger (unstyled menu here; the design-system menu is
 * DropdownMenu): the trigger sets aria-expanded, which also flips the caret.
 */
export const InMenuTrigger: Story = {
  render: () => (
    <MenuTrigger>
      <FilterChip size="sm">기간</FilterChip>
      <AriaPopover>
        <Menu aria-label="기간" style={{ background: 'white', border: '1px solid #ccc', padding: 4 }}>
          <MenuItem id="7d">최근 7일</MenuItem>
          <MenuItem id="30d">최근 30일</MenuItem>
        </Menu>
      </AriaPopover>
    </MenuTrigger>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const chip = canvas.getByRole('button', { name: '기간' });
    await expect(chip).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(chip);
    await within(canvasElement.ownerDocument.body).findByRole('menu');
    await expect(chip).toHaveAttribute('aria-expanded', 'true');
    await expect(getComputedStyle(chip.querySelector('.ds-chip__caret-up')!).display).toBe('block');
    await userEvent.keyboard('{Escape}');
  },
};
