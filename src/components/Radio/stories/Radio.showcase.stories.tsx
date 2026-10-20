import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Radio } from '../Radio';
import { RadioGroup } from '../RadioGroup';
import { CHOICE_SIZES, type ChoiceSize } from '../../Choice';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';
import { koLabel } from '../../../storybook/koLabel';

// Visual verification (not in the MCP manifest). Variant Matrix cells carry data-figma names
// checked by `node scripts/verify-figma.mjs radio`.
const meta = {
  title: '컴포넌트/Radio/전체 보기',
  id: 'components-radio-showcase',
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
  name: '개요',
  render: () => (
    <div>
      <StorySection title="Size (sm · md · lg)">
        {CHOICE_SIZES.map((size) => (
          <Radio key={size} size={size} name={`overview-${size}`} value={size} label={`라디오 ${size}`} defaultChecked />
        ))}
      </StorySection>
      <StorySection title="RadioGroup (vertical · horizontal)">
        <RadioGroup aria-label="결제 수단" defaultValue="card" size="md">
          <Radio value="card" label="카드" />
          <Radio value="bank" label="계좌이체" />
          <Radio value="phone" label="휴대폰" disabled />
        </RadioGroup>
        <RadioGroup aria-label="기간" defaultValue="7d" orientation="horizontal" size="md">
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
  name: '모든 변형',
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
  name: '상태별 보기',
  render: () => (
    <div>
      {SELECTIONS.map((selection) => (
        <StorySection key={selection} title={selection}>
          {STATES.map((state) => (
            <Radio key={state} {...figmaVariant(selection, 'md', state, `states-${selection}-${state}`)} label={koLabel(state)} />
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
      <RadioGroup aria-label="배송 방법" value={value} onChange={setValue} size="md">
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
  name: '동작',
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

/** Design System Rules 08: items 8px apart when stacked; 16px apart in a row, 8px between wrapped rows (the group's own CSS — no `style`). */
export const GroupSpacing: Story = {
  name: '그룹 간격',
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <RadioGroup aria-label="세로" name="spacing-v" defaultValue="a">
        {['a', 'b', 'c'].map((v) => <Radio key={v} value={v} label={`라디오 ${v}`} />)}
      </RadioGroup>
      <div style={{ width: 200 }}>
        <RadioGroup aria-label="가로" orientation="horizontal" name="spacing-h" defaultValue="a">
          {['a', 'b', 'c', 'd', 'e'].map((v) => <Radio key={v} value={v} label={`라디오 ${v}`} />)}
        </RadioGroup>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const boxes = (name: string) =>
      [...canvas.getByRole('radiogroup', { name }).children].map((c) => c.getBoundingClientRect());
    const v = boxes('세로');
    await expect(v.slice(1).map((r, i) => Math.round(r.top - v[i].bottom))).toEqual([8, 8]);
    const h = boxes('가로');
    await expect(Math.round(h[1].left - h[0].right)).toBe(16);
    const wrapped = h.find((r) => r.top > h[0].bottom)!;
    await expect(Math.round(wrapped.top - h[0].bottom)).toBe(8);
  },
};

/** radiogroup role with an accessible name; radios share one generated name. */
export const Accessibility: Story = {
  name: '접근성',
  render: () => (
    <RadioGroup aria-label="공개 범위" defaultValue="team" required>
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

/** Rules 04 "묶음 오류": input_message Error 6px under the group, the items carry aria-invalid and read the message; a
 * message without `invalid` is the grey help text. */
export const GroupMessage: Story = {
  name: '묶음 메시지',
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      <RadioGroup aria-label="오류 묶음" invalid message="하나 이상 고르세요." orientation="horizontal">
        <Radio value="v0" label="일반" />
        <Radio value="v1" label="긴급" />
      </RadioGroup>
      <RadioGroup aria-label="도움말 묶음" message="여러 개 고를 수 있습니다." orientation="horizontal">
        <Radio value="v0" label="일반" />
        <Radio value="v1" label="긴급" />
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const color = (token: string) => { const p = document.createElement('span'); p.style.color = `var(${token})`; document.body.append(p); const c = getComputedStyle(p).color; p.remove(); return c; };
    const [errorField, helpField] = canvasElement.querySelectorAll<HTMLElement>('.ds-choice-field');
    const group = within(errorField).getByRole('radiogroup', { name: '오류 묶음' });
    const message = errorField.querySelector<HTMLElement>('.ds-field-message')!;
    await expect(message).toHaveAttribute('data-type', 'error');
    await expect(message.querySelector('svg')).toBeTruthy();
    await expect(getComputedStyle(message).color).toBe(color('--colors-input-outline-helper-error'));
    await expect(Math.abs(message.getBoundingClientRect().top - group.getBoundingClientRect().bottom - 6)).toBeLessThan(0.5);
    for (const input of within(errorField).getAllByRole('radio')) {
      await expect(group).toHaveAttribute('aria-invalid', 'true');
      await expect(input).toHaveAccessibleDescription('하나 이상 고르세요.');
    }
    const help = helpField.querySelector<HTMLElement>('.ds-field-message')!;
    await expect(help).toHaveAttribute('data-type', 'helper');
    await expect(help.querySelector('svg')).toBeNull();
    await expect(getComputedStyle(help).color).toBe(color('--colors-input-outline-helper-default'));
    for (const input of within(helpField).getAllByRole('radio')) await expect(input).not.toHaveAttribute('aria-invalid');
  },
};
