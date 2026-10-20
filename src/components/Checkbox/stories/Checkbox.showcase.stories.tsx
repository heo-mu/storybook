import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Checkbox } from '../Checkbox';
import { CheckboxGroup } from '../CheckboxGroup';
import { CHOICE_SIZES, type ChoiceSize } from '../../Choice';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';
import { koLabel } from '../../../storybook/koLabel';

// Visual verification (not in the MCP manifest). Variant Matrix cells carry data-figma names
// checked by `node scripts/verify-figma.mjs checkbox`.
const meta = {
  title: "Components/Checkbox/Gallery",
  id: 'components-checkbox-showcase',
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
  name: "Overview",
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

/** 크기와 상태별 표현을 비교합니다. */
export const VariantMatrix: Story = {
  name: "Variants",
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
  name: "States",
  render: () => (
    <div>
      {SELECTIONS.map((selection) => (
        <StorySection key={selection} title={selection}>
          {STATES.map((state) => (
            <Checkbox key={state} {...figmaVariant(selection, 'md', state)} label={koLabel(state)} />
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
      <CheckboxGroup aria-label="수신 채널" value={selected} onChange={setSelected} name="channel" size="md" style={{ paddingLeft: 22 }}>
        {options.map((o) => (
          <Checkbox key={o} value={o} label={o} />
        ))}
      </CheckboxGroup>
    </div>
  );
}

/** Click and Space toggle; a parent checkbox shows Indeterminate while only some children are checked. */
export const Interaction: Story = {
  name: "Interaction",
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

/** 세로·가로 그룹의 항목 간격과 줄바꿈을 비교합니다. */
export const GroupSpacing: Story = {
  name: '그룹 간격',
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <CheckboxGroup aria-label="세로" name="spacing-v">
        {['a', 'b', 'c'].map((v) => <Checkbox key={v} value={v} label={`체크 ${v}`} />)}
      </CheckboxGroup>
      <div style={{ width: 200 }}>
        <CheckboxGroup aria-label="가로" orientation="horizontal" name="spacing-h">
          {['a', 'b', 'c', 'd', 'e'].map((v) => <Checkbox key={v} value={v} label={`체크 ${v}`} />)}
        </CheckboxGroup>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const boxes = (name: string) =>
      [...canvas.getByRole('group', { name }).children].map((c) => c.getBoundingClientRect());
    const v = boxes('세로');
    await expect(v.slice(1).map((r, i) => Math.round(r.top - v[i].bottom))).toEqual([8, 8]);
    const h = boxes('가로');
    await expect(Math.round(h[1].left - h[0].right)).toBe(16);
    const wrapped = h.find((r) => r.top > h[0].bottom)!;
    await expect(Math.round(wrapped.top - h[0].bottom)).toBe(8);
  },
};

/** Native checkbox semantics: name from the label, disabled state, group role. */
export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <CheckboxGroup aria-label="알림 설정" defaultValue={['news']}>
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

/** Rules 04 "그룹 오류": input_message Error 6px under the group, the items carry aria-invalid and read the message; a
 * message without `invalid` is the grey help text. */
export const GroupMessage: Story = {
  name: "그룹 메시지",
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      <CheckboxGroup aria-label="오류 묶음" invalid message="하나 이상 고르세요." orientation="horizontal">
        <Checkbox value="v0" label="디자인" />
        <Checkbox value="v1" label="개발" />
      </CheckboxGroup>
      <CheckboxGroup aria-label="도움말 묶음" message="여러 개 고를 수 있습니다." orientation="horizontal">
        <Checkbox value="v0" label="디자인" />
        <Checkbox value="v1" label="개발" />
      </CheckboxGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const color = (token: string) => { const p = document.createElement('span'); p.style.color = `var(${token})`; document.body.append(p); const c = getComputedStyle(p).color; p.remove(); return c; };
    const [errorField, helpField] = canvasElement.querySelectorAll<HTMLElement>('.ds-choice-field');
    const group = within(errorField).getByRole('group', { name: '오류 묶음' });
    const message = errorField.querySelector<HTMLElement>('.ds-field-message')!;
    await expect(message).toHaveAttribute('data-type', 'error');
    await expect(message.querySelector('svg')).toBeTruthy();
    await expect(getComputedStyle(message).color).toBe(color('--colors-input-outline-helper-error'));
    await expect(Math.abs(message.getBoundingClientRect().top - group.getBoundingClientRect().bottom - 6)).toBeLessThan(0.5);
    for (const input of within(errorField).getAllByRole('checkbox')) {
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(input).toHaveAccessibleDescription('하나 이상 고르세요.');
    }
    const help = helpField.querySelector<HTMLElement>('.ds-field-message')!;
    await expect(help).toHaveAttribute('data-type', 'helper');
    await expect(help.querySelector('svg')).toBeNull();
    await expect(getComputedStyle(help).color).toBe(color('--colors-input-outline-helper-default'));
    for (const input of within(helpField).getAllByRole('checkbox')) await expect(input).not.toHaveAttribute('aria-invalid');
  },
};
