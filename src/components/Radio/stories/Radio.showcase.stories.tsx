import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Radio } from '../Radio';
import { RadioGroup } from '../RadioGroup';
import { CHOICE_SIZES, type ChoiceSize } from '../../Choice';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Variant Matrix cells carry data-figma names
// checked by `node scripts/verify-figma.mjs radio`.
const meta = {
  title: 'Components/Radio/Showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const SELECTIONS = ['Unselected', 'Selected'] as const;
const STATES = ['Default', 'Hover', 'Pressed', 'Disabled'] as const;
type Selection = (typeof SELECTIONS)[number];
type State = (typeof STATES)[number];

/** Props reproducing one Figma variant (standalone radio, its own name so cells don't interact). */
function figmaVariant(selection: Selection, size: ChoiceSize, state: State, name: string) {
  return {
    size,
    name,
    value: 'v',
    label: '라벨명',
    defaultChecked: selection === 'Selected',
    disabled: state === 'Disabled',
    className: state === 'Hover' ? PSEUDO.hover : state === 'Pressed' ? PSEUDO.pressed : undefined,
  };
}

export const Overview: Story = {
  render: () => (
    <div>
      <StorySection title="Size (sm · md · lg)">
        {CHOICE_SIZES.map((size) => (
          <Radio key={size} size={size} name={`overview-${size}`} value={size} label={`라디오 ${size}`} defaultChecked />
        ))}
      </StorySection>
      <StorySection title="RadioGroup (vertical · horizontal)">
        <RadioGroup aria-label="결제 수단" defaultValue="card" size="md" style={{ gap: 8 }}>
          <Radio value="card" label="카드" />
          <Radio value="bank" label="계좌이체" />
          <Radio value="phone" label="휴대폰" disabled />
        </RadioGroup>
        <RadioGroup aria-label="기간" defaultValue="7d" orientation="horizontal" size="md" style={{ gap: 16 }}>
          <Radio value="7d" label="7일" />
          <Radio value="30d" label="30일" />
          <Radio value="90d" label="90일" />
        </RadioGroup>
      </StorySection>
    </div>
  ),
};

/** All 24 Figma variants: Selection × Size (rows) × State (columns). */
export const VariantMatrix: Story = {
  render: () => (
    <FigmaMatrix
      columns={[...STATES]}
      rows={SELECTIONS.flatMap((selection) =>
        CHOICE_SIZES.map((size) => ({
          label: `${selection} · ${size}`,
          cells: STATES.map((state) => ({
            figma: `Selection=${selection}, Size=${size}, State=${state}`,
            node: <Radio {...figmaVariant(selection, size, state, `matrix-${selection}-${size}-${state}`)} />,
          })),
        })),
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(24);
  },
};

/** Every state at size md. */
export const States: Story = {
  render: () => (
    <div>
      {SELECTIONS.map((selection) => (
        <StorySection key={selection} title={selection}>
          {STATES.map((state) => (
            <Radio key={state} {...figmaVariant(selection, 'md', state, `states-${selection}-${state}`)} label={state} />
          ))}
        </StorySection>
      ))}
    </div>
  ),
};

function Controlled() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <RadioGroup aria-label="배송 방법" value={value} onChange={setValue} size="md" style={{ gap: 8 }}>
        <Radio value="normal" label="일반 배송" />
        <Radio value="express" label="빠른 배송" />
        <Radio value="pickup" label="매장 수령" />
      </RadioGroup>
      <output style={{ font: '12px sans-serif' }}>선택: {value ?? '없음'}</output>
    </div>
  );
}

/** Click selects; arrow keys move the selection inside the group (native radio behaviour). */
export const Interaction: Story = {
  render: () => <Controlled />,
  play: async ({ canvas, userEvent, step }) => {
    const normal = canvas.getByRole('radio', { name: '일반 배송' });
    const express = canvas.getByRole('radio', { name: '빠른 배송' });
    await step('click selects', async () => {
      await userEvent.click(canvas.getByText('일반 배송'));
      await expect(normal).toBeChecked();
      await expect(canvas.getByText('선택: normal')).toBeInTheDocument();
    });
    await step('ArrowDown moves to the next radio', async () => {
      normal.focus();
      await userEvent.keyboard('{ArrowDown}');
      await expect(express).toBeChecked();
      await expect(express).toHaveFocus();
      await expect(canvas.getByText('선택: express')).toBeInTheDocument();
    });
  },
};

/** radiogroup role with an accessible name; radios share one generated name. */
export const Accessibility: Story = {
  render: () => (
    <RadioGroup aria-label="공개 범위" defaultValue="team" required style={{ gap: 8 }}>
      <Radio value="all" label="전체 공개" />
      <Radio value="team" label="팀 공개" />
      <Radio value="me" label="나만 보기" disabled />
    </RadioGroup>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: '공개 범위' });
    const radios = canvas.getAllByRole('radio');
    await expect(group).toHaveAttribute('aria-required', 'true');
    await expect(new Set(radios.map((r) => r.getAttribute('name'))).size).toBe(1);
    await expect(canvas.getByRole('radio', { name: '팀 공개' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: '나만 보기' })).toBeDisabled();
  },
};
