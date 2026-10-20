import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { SearchField } from '../SearchField';
import { SEARCH_FIELD_APPEARANCES, type SearchFieldAppearance } from '../SearchField.options';
import { FIELD_SIZES, type FieldSize } from '../../Field';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS, figmaCase } from '../../../storybook/pseudo';
import { koLabel } from '../../../storybook/koLabel';

// Visual verification (not in the MCP manifest): `node scripts/verify-figma.mjs search-field`.
const meta = {
  title: "Components/SearchField/Gallery",
  id: 'components-searchfield-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const STATES = ['Default', 'Hover', 'Focus', 'Completed', 'Error', 'Disabled'] as const;
type State = (typeof STATES)[number];

function figmaVariant(size: FieldSize, appearance: SearchFieldAppearance, state: State) {
  const base = { size, appearance, label: '라벨명' } as const;
  const value = { defaultValue: '검색어 입력' };
  const empty = { placeholder: '검색어 입력' };
  switch (state) {
    case 'Default': return { ...base, ...empty };
    case 'Hover': return { ...base, ...empty, className: PSEUDO.hover };
    case 'Focus': return { ...base, ...value, className: PSEUDO.focus };
    case 'Completed': return { ...base, ...value };
    case 'Error': return { ...base, ...value, invalid: true };
    case 'Disabled': return { ...base, ...empty, disabled: true };
  }
}

export const Overview: Story = {
  name: "Overview",
  render: () => (
    <div>
      {SEARCH_FIELD_APPEARANCES.map((appearance) => (
        <StorySection key={appearance} title={`Type ${figmaCase(appearance)} — Size sm · md · lg`}>
          {FIELD_SIZES.map((size) => (
            <div key={size} style={{ width: 320 }}>
              <SearchField size={size} appearance={appearance} label="검색" placeholder="검색어 입력" />
            </div>
          ))}
        </StorySection>
      ))}
    </div>
  ),
};

/** 크기와 상태별 표현을 비교합니다. */
export const VariantMatrix: Story = {
  name: "Variants",
  render: () => (
    <FigmaMatrix
      cellWidth={320}
      columns={[...STATES]}
      rows={SEARCH_FIELD_APPEARANCES.flatMap((appearance) =>
        FIELD_SIZES.map((size) => ({
          label: `${figmaCase(appearance)} / ${size}`,
          cells: STATES.map((state) => ({ figma: `Size=${size}, State=${state}, Type=${figmaCase(appearance)}`, node: <SearchField {...figmaVariant(size, appearance, state)} /> })),
        })),
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(36);
  },
};

export const States: Story = {
  name: "States",
  render: () => (
    <div>
      {SEARCH_FIELD_APPEARANCES.map((appearance) => (
        <StorySection key={appearance} title={`Type ${figmaCase(appearance)} (sm)`}>
          {STATES.map((state) => (
            <div key={state} style={{ width: 320 }}>
              <div style={{ font: '500 11px/16px sans-serif', marginBottom: 8, color: 'var(--colors-text-secondary)' }}>{koLabel(state)}</div>
              <SearchField {...figmaVariant('sm', appearance, state)} />
            </div>
          ))}
        </StorySection>
      ))}
    </div>
  ),
};

const onSearch = fn();
/** Enter submits the query; the clear button empties the field and keeps focus. */
export const Interaction: Story = {
  name: "Interaction",
  render: () => (
    <div style={{ width: 320 }}>
      <SearchField label="검색" placeholder="검색어 입력" onSearch={onSearch} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('searchbox', { name: '검색' });
    await userEvent.type(input, '입주민{Enter}');
    await expect(onSearch).toHaveBeenCalledWith('입주민');
    await expect(input.closest('.ds-search-field')).toHaveAttribute('data-filled');
    await userEvent.click(canvas.getByRole('button', { name: '검색어 지우기', hidden: true }));
    await expect(input).toHaveValue('');
    await expect(input).toHaveFocus();
  },
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div style={{ width: 320, display: 'grid', gap: 16 }}>
      <SearchField label="주소 검색" />
      <SearchField aria-label="전체 검색" appearance="solid" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('searchbox', { name: '주소 검색' })).toBeInTheDocument();
    await expect(canvas.getByRole('searchbox', { name: '전체 검색' })).toBeInTheDocument();
  },
};
