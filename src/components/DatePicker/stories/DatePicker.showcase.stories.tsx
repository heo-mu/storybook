import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { DatePicker } from '../DatePicker';
import { FieldMessage, FIELD_SIZES, type FieldSize } from '../../Field';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';
import { koLabel } from '../../../storybook/koLabel';
import { expectRequiredMark } from '../../../storybook/requiredMark';
import { expectHelperMessage } from '../../../storybook/helperMessage';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs date-picker` (sets date-picker_trigger, date-picker_message; the calendar
// sets are in Calendar/Showcase).
const meta = {
  title: '컴포넌트/DatePicker/전체 보기',
  id: 'components-datepicker-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const STATES = ['Default', 'Hover', 'Focus', 'Completed', 'Error', 'Disabled', 'Read-only'] as const;
type State = (typeof STATES)[number];

/**
 * Props reproducing one Figma variant. Figma shows the "YYYY.MM.DD" pattern in every state; states with a
 * date use a real date here (the text is compared as a box, not glyph by glyph — figma/verify/date-picker.json).
 */
function figmaVariant(size: FieldSize, state: State) {
  const base = { size, label: '라벨명' } as const;
  const filled = { defaultValue: '2026-07-30' };
  switch (state) {
    case 'Default': return { ...base };
    case 'Hover': return { ...base, className: PSEUDO.hover };
    case 'Focus': return { ...base, ...filled, className: PSEUDO.focus, message: 'Alert 내용', messageType: 'info' as const };
    case 'Completed': return { ...base, ...filled, message: 'Alert 내용', messageType: 'success' as const };
    case 'Error': return { ...base, ...filled, invalid: true, message: 'Alert 내용', messageType: 'error' as const };
    case 'Disabled': return { ...base, disabled: true };
    case 'Read-only': return { ...base, ...filled, readOnly: true };
  }
}

export const Overview: Story = {
  name: '개요',
  render: () => (
    <div>
      <StorySection title="Size (sm · md · lg)">
        {FIELD_SIZES.map((size) => (
          <div key={size} style={{ width: 320 }}>
            <DatePicker size={size} label="시작일" />
          </div>
        ))}
      </StorySection>
      <StorySection title="Message · Error · Disabled · Read-only">
        <div style={{ width: 320 }}><DatePicker label="신청일" defaultValue="2026-07-30" message="평일만 선택할 수 있습니다." messageType="info" /></div>
        <div style={{ width: 320 }}><DatePicker label="마감일" defaultValue="2026-07-01" invalid message="시작일 이후여야 합니다." /></div>
        <div style={{ width: 320 }}><DatePicker label="비활성" disabled /></div>
        <div style={{ width: 320 }}><DatePicker label="읽기 전용" defaultValue="2026-07-30" readOnly /></div>
      </StorySection>
    </div>
  ),
};

/** All 21 Figma trigger variants: Size (rows) × State (columns). */
export const VariantMatrix: Story = {
  name: '모든 변형',
  render: () => (
    <FigmaMatrix
      cellWidth={320}
      columns={[...STATES]}
      rows={FIELD_SIZES.map((size) => ({
        label: size,
        cells: STATES.map((state) => ({ figma: `Size=${size}, State=${state}`, node: <DatePicker {...figmaVariant(size, state)} /> })),
      }))}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(21);
  },
};

/** Figma `date-picker_message` (Info · Success · Error · Helper; Helper also in a disabled field — State=Disabled). */
export const MessageMatrix: Story = {
  name: '메시지 모든 변형',
  render: () => (
    <div className="ds-date-picker">
      <FigmaMatrix
        columns={['date-picker_message']}
        rows={[
          ...(['info', 'success', 'error', 'helper'] as const).map((type) => ({
            label: type,
            cells: [{ figma: `Type=${type.charAt(0).toUpperCase() + type.slice(1)}, State=Default`, node: <FieldMessage type={type}>Alert 내용</FieldMessage> }],
          })),
          {
            label: 'helper · Disabled',
            cells: [
              {
                figma: 'Type=Helper, State=Disabled',
                node: (
                  <div className="ds-date-picker" data-disabled="">
                    <FieldMessage type="helper">Alert 내용</FieldMessage>
                  </div>
                ),
              },
            ],
          },
        ]}
      />
    </div>
  ),
};

/** Every state at size sm. */
export const States: Story = {
  name: '상태별 보기',
  render: () => (
    <StorySection title="State">
      {STATES.map((state) => (
        <div key={state} style={{ width: 320 }}>
          <div style={{ font: '500 11px/16px sans-serif', marginBottom: 8, color: 'var(--colors-text-secondary)' }}>{koLabel(state)}</div>
          <DatePicker {...figmaVariant('sm', state)} />
        </div>
      ))}
    </StorySection>
  ),
};

/** The field with its calendar open (Figma example "Calendar Container"). */
export const Open: Story = {
  name: '열림',
  render: () => (
    // Padding keeps the popover clear of react-aria's 12px viewport margin, so it can align with the field.
    <div style={{ width: 296, padding: 24, paddingBottom: 300 }}>
      <DatePicker aria-label="날짜" defaultValue="2026-07-30" open />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole('dialog');
    const control = canvasElement.querySelector('.ds-field__control')!.getBoundingClientRect();
    await waitFor(() => {
      const box = dialog.querySelector('.ds-calendar')!.getBoundingClientRect();
      expect(Math.round(box.top - control.bottom)).toBe(4);
      expect(Math.round(box.left - control.left)).toBe(0);
    });
  },
};

function Controlled() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div style={{ width: 320, display: 'grid', gap: 12, paddingBottom: 300 }}>
      <DatePicker label="방문일" value={value} onChange={setValue} name="visit" minValue="2026-07-01" />
      <output style={{ font: '12px sans-serif' }}>값: {value ?? '없음'}</output>
    </div>
  );
}

/** Typing a date, invalid text, choosing from the calendar. */
export const Interaction: Story = {
  name: '동작',
  render: () => <Controlled />,
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const input = canvas.getByRole('textbox', { name: '방문일' });
    const root = canvasElement.querySelector('.ds-date-picker')!;
    await step('typed date is committed on Enter and formatted', async () => {
      await userEvent.type(input, '20260715{Enter}');
      await expect(canvas.getByText('값: 2026-07-15')).toBeInTheDocument();
      await expect(input).toHaveValue('2026.07.15');
    });
    await step('an impossible or out-of-range date shows the Error state', async () => {
      await userEvent.clear(input);
      await userEvent.type(input, '2026.02.30{Enter}');
      await expect(root).toHaveAttribute('data-invalid');
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await userEvent.clear(input);
      await userEvent.type(input, '2026.06.30{Enter}');
      await expect(root).toHaveAttribute('data-invalid');
      await expect(canvas.getByText('값: 2026-07-15')).toBeInTheDocument();
    });
    await step('the calendar button opens the calendar; choosing a day fills the field', async () => {
      await userEvent.clear(input);
      await userEvent.type(input, '2026.07.15{Enter}');
      await userEvent.click(canvas.getByRole('button', { name: '달력 열기' }));
      const dialog = await within(canvasElement.ownerDocument.body).findByRole('dialog', { name: '방문일' });
      await userEvent.click(within(dialog).getByRole('button', { name: /7월 20일/ }));
      await expect(canvas.getByText('값: 2026-07-20')).toBeInTheDocument();
      await expect(input).toHaveValue('2026.07.20');
      await waitFor(() => expect(within(canvasElement.ownerDocument.body).queryByRole('dialog')).not.toBeInTheDocument());
    });
    await step('Alt + ↓ opens the calendar from the field', async () => {
      input.focus();
      await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
      await within(canvasElement.ownerDocument.body).findByRole('dialog');
      await userEvent.keyboard('{Escape}');
    });
  },
};

/** Field label, invalid state and message; the hidden input submits ISO dates. */
export const Accessibility: Story = {
  name: '접근성',
  render: () => (
    <form aria-label="예약" style={{ width: 320 }}>
      <DatePicker label="예약일" name="date" defaultValue="2026-07-30" invalid message="예약할 수 없는 날짜입니다." />
    </form>
  ),
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole('textbox', { name: '예약일' });
    await expect(input).toHaveAccessibleDescription('예약할 수 없는 날짜입니다.');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('button', { name: '달력 열기' })).toHaveAttribute('aria-expanded', 'false');
    await expect(new FormData(canvasElement.querySelector('form')!).get('date')).toBe('2026-07-30');
  },
};

/** Figma Required on (every size): the dot after the label; the date input is required for assistive technology and form checks. */
export const RequiredMark: Story = {
  name: '필수 표시',
  render: () => (
    <div style={{ width: 320, display: 'grid', gap: 24 }}>
      {FIELD_SIZES.map((size) => (
        <DatePicker key={size} size={size} label={`방문일 (${size})`} required />
      ))}
      <DatePicker label="종료일" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    for (const size of FIELD_SIZES) {
      const input = canvas.getByRole('textbox', { name: `방문일 (${size})` });
      await expect(input).toBeRequired();
      await expectRequiredMark(input.closest('.ds-field')!, '--colors-date-picker-trigger-outline-required-default');
    }
    await expect(canvas.getByRole('textbox', { name: '종료일' })).not.toBeRequired();
    await expect(canvasElement.querySelectorAll('.ds-field__required')).toHaveLength(3);
  },
};

/** Rules 04 "도움말": grey help text without an icon (Figma Type=Helper); helper/disabled in a disabled field. */
export const HelperMessage: Story = {
  name: '도움말',
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <DatePicker label="방문일" message="평일만 고를 수 있습니다." />
      <DatePicker label="방문일" message="평일만 고를 수 있습니다." disabled />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [field, disabled] = canvasElement.querySelectorAll<HTMLElement>('.ds-date-picker');
    await expectHelperMessage(field, '--colors-date-picker-trigger-outline-helper-default');
    await expectHelperMessage(disabled, '--colors-date-picker-trigger-outline-helper-disabled');
  },
};
