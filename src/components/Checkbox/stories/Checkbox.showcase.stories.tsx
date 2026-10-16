import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Checkbox } from '../Checkbox';
import { CheckboxGroup } from '../CheckboxGroup';
import { CHOICE_SIZES, type ChoiceSize } from '../../Choice';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Variant Matrix cells carry data-figma names
// checked by `node scripts/verify-figma.mjs checkbox`.
const meta = {
  title: 'Components/Checkbox/Showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const SELECTIONS = ['Unchecked', 'Checked', 'Indeterminate'] as const;
const STATES = ['Default', 'Hover', 'Pressed', 'Disabled'] as const;
type Selection = (typeof SELECTIONS)[number];
type State = (typeof STATES)[number];

/** Props reproducing one Figma variant. */
function figmaVariant(selection: Selection, size: ChoiceSize, state: State) {
  return {
    size,
    label: '라벨명',
    defaultChecked: selection === 'Checked',
    indeterminate: selection === 'Indeterminate',
    disabled: state === 'Disabled',
    className: state === 'Hover' ? PSEUDO.hover : state === 'Pressed' ? PSEUDO.pressed : undefined,
  };
}

export const Overview: Story = {
  render: () => (
    <div>
      <StorySection title="Size (sm · md · lg)">
        {CHOICE_SIZES.map((size) => (
          <Checkbox key={size} size={size} label={`체크박스 ${size}`} defaultChecked />
        ))}
      </StorySection>
      <StorySection title="Selection (Unchecked · Checked · Indeterminate)">
        <Checkbox label="선택 안 함" />
        <Checkbox label="선택" defaultChecked />
        <Checkbox label="일부 선택" indeterminate />
      </StorySection>
      <StorySection title="Disabled">
        <Checkbox label="선택 안 함" disabled />
        <Checkbox label="선택" defaultChecked disabled />
        <Checkbox label="일부 선택" indeterminate disabled />
      </StorySection>
    </div>
  ),
};

/** All 36 Figma variants: Selection × Size (rows) × State (columns). */
export const VariantMatrix: Story = {
  render: () => (
    <FigmaMatrix
      columns={[...STATES]}
      rows={SELECTIONS.flatMap((selection) =>
        CHOICE_SIZES.map((size) => ({
          label: `${selection} · ${size}`,
          cells: STATES.map((state) => ({
            figma: `Selection=${selection}, Size=${size}, State=${state}`,
            node: <Checkbox {...figmaVariant(selection, size, state)} />,
          })),
        })),
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(36);
  },
};

/** Every state at size md. */
export const States: Story = {
  render: () => (
    <div>
      {SELECTIONS.map((selection) => (
        <StorySection key={selection} title={selection}>
          {STATES.map((state) => (
            <Checkbox key={state} {...figmaVariant(selection, 'md', state)} label={state} />
          ))}
        </StorySection>
      ))}
    </div>
  ),
};

function SelectAll() {
  const options = ['이메일', 'SMS', '앱 푸시'];
  const [selected, setSelected] = useState<string[]>(['이메일']);
  const all = selected.length === options.length;
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox
        size="md"
        label="전체 동의"
        checked={all}
        indeterminate={selected.length > 0 && !all}
        onChange={(e) => setSelected(e.target.checked ? options : [])}
      />
      <CheckboxGroup aria-label="수신 채널" value={selected} onChange={setSelected} name="channel" size="md" style={{ gap: 8, paddingLeft: 22 }}>
        {options.map((o) => (
          <Checkbox key={o} value={o} label={o} />
        ))}
      </CheckboxGroup>
    </div>
  );
}

/** Click and Space toggle; a parent checkbox shows Indeterminate while only some children are checked. */
export const Interaction: Story = {
  render: () => <SelectAll />,
  play: async ({ canvas, userEvent, step }) => {
    const parent = canvas.getByRole('checkbox', { name: '전체 동의' });
    const sms = canvas.getByRole('checkbox', { name: 'SMS' });
    await step('partially selected → indeterminate (aria-checked="mixed")', async () => {
      await expect(parent).toHaveProperty('indeterminate', true);
      await expect(parent).toBePartiallyChecked();
    });
    await step('clicking the label toggles a child', async () => {
      await userEvent.click(canvas.getByText('SMS'));
      await expect(sms).toBeChecked();
    });
    await step('Space toggles the focused checkbox', async () => {
      const push = canvas.getByRole('checkbox', { name: '앱 푸시' });
      push.focus();
      await userEvent.keyboard(' ');
      await expect(push).toBeChecked();
      await expect(parent).toBeChecked();
      await expect(parent).toHaveProperty('indeterminate', false);
    });
    await step('parent unchecks every child', async () => {
      await userEvent.click(parent);
      await expect(sms).not.toBeChecked();
    });
  },
};

/** Native checkbox semantics: name from the label, disabled state, group role. */
export const Accessibility: Story = {
  render: () => (
    <CheckboxGroup aria-label="알림 설정" defaultValue={['news']} style={{ gap: 8 }}>
      <Checkbox value="news" label="소식 받기" />
      <Checkbox value="ads" label="광고 수신" disabled />
      <Checkbox value="hidden" aria-label="라벨 없는 체크박스" />
    </CheckboxGroup>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: '알림 설정' })).toBeInTheDocument();
    await expect(canvas.getByRole('checkbox', { name: '소식 받기' })).toBeChecked();
    await expect(canvas.getByRole('checkbox', { name: '광고 수신' })).toBeDisabled();
    await expect(canvas.getByRole('checkbox', { name: '라벨 없는 체크박스' })).not.toBeChecked();
    // Figma Checked/Default: colors/checkbox/background/checked/default (#004a38)
    const box = canvas.getByRole('checkbox', { name: '소식 받기' });
    await expect(getComputedStyle(box).backgroundColor).toBe('rgb(0, 74, 56)');
  },
};
