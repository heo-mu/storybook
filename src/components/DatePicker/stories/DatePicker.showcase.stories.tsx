import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { DatePicker } from '../DatePicker';
import { FieldMessage } from '../../Field';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { expectRequiredMark } from '../../../storybook/requiredMark';
import { expectHelperMessage } from '../../../storybook/helperMessage';

const meta = { title: 'Components/DatePicker/Gallery', id: 'components-datepicker-showcase', tags: ['!manifest'], parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj;
export const Overview: Story = { render: () => <StorySection title="Single / Range">
  <DatePicker label="방문일" defaultValue="2026-07-30" />
  <DatePicker label="이용 기간" selectionMode="range" defaultRangeValue={{ start: '2026-07-10', end: '2026-07-16' }} />
</StorySection> };
export const VariantMatrix: Story = { name: 'Variants', render: () => <StorySection title="Selection">
  <DatePicker label="Single" defaultFocusedValue="2026-07-15" />
  <DatePicker label="Range" selectionMode="range" defaultFocusedValue="2026-07-15" />
</StorySection> };
export const States: Story = { render: () => <StorySection title="States">
  <DatePicker label="선택" defaultValue="2026-07-30" />
  <DatePicker label="오류" defaultValue="2026-07-30" invalid message="예약할 수 없는 날짜예요." />
  <DatePicker label="비활성" disabled defaultValue="2026-07-30" />
  <DatePicker label="읽기 전용" readOnly defaultValue="2026-07-30" />
</StorySection> };
export const Open: Story = { name: 'Calendar', render: () => <DatePicker aria-label="날짜" defaultValue="2026-07-30" />,
  play: async ({ canvas }) => { await expect(canvas.getByRole('grid')).toBeVisible(); await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument(); } };
function Controlled() {
  const [value, setValue] = useState<string | null>(null);
  return <><DatePicker label="방문일" value={value} onChange={setValue} name="visit" minValue="2026-07-01" defaultFocusedValue="2026-07-15" /><output>값: {value ?? '없음'}</output></>;
}
export const Interaction: Story = { render: () => <Controlled />, play: async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('button', { name: /7월 20일/ }));
  await expect(canvas.getByText('값: 2026-07-20')).toBeInTheDocument();
  await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
} };
export const Accessibility: Story = { render: () => <form aria-label="예약"><DatePicker label="예약일" name="date" defaultValue="2026-07-30" invalid message="예약할 수 없는 날짜입니다." /></form>,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('application', { name: /예약일/ })).toHaveAccessibleDescription('예약할 수 없는 날짜입니다.');
    await expect(new FormData(canvasElement.querySelector('form')!).get('date')).toBe('2026-07-30');
  } };
export const RequiredMark: Story = { name: 'Required', render: () => <><DatePicker label="방문일" required /><DatePicker label="종료일" /></>,
  play: async ({ canvasElement }) => {
    const fields = canvasElement.querySelectorAll('.ds-date-picker');
    await expect(fields[0].querySelector('[role="application"]')).toHaveAccessibleDescription('필수 선택');
    await expectRequiredMark(fields[0], '--colors-date-picker-trigger-outline-required-default');
    await expect(fields[1].querySelector('.ds-field__required')).not.toBeInTheDocument();
  } };

export const MessageMatrix: Story = {
  name: "Messages",
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
                  <div className="ds-date-picker" data-disabled="" aria-disabled="true">
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


export const HelperMessage: Story = {
  name: "Helper Text",
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
