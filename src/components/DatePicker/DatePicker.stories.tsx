import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import { DatePicker } from './DatePicker';
import { FIELD_MESSAGE_TYPES } from '../Field';

const meta = {
  title: 'Components/DatePicker/DatePicker', id: 'components-datepicker-datepicker',
  component: DatePicker, tags: ['autodocs'],
  parameters: { docs: { description: { component: '입력창 없이 달력에서 단일 날짜 또는 기간을 선택합니다.' } } },
  args: { label: '방문일', defaultFocusedValue: '2026-07-15', onChange: fn(), onRangeChange: fn() },
  argTypes: {
    selectionMode: { control: 'inline-radio', options: ['single', 'range'] },
    messageType: { control: 'inline-radio', options: FIELD_MESSAGE_TYPES },
    disabled: { control: 'boolean' }, readOnly: { control: 'boolean' },
    minValue: { control: 'text' }, maxValue: { control: 'text' },
  },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = { name: 'Playground' };
export const SingleDate: Story = { name: 'Single Date', play: async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole('button', { name: /7월 20일/ }));
  await expect(args.onChange).toHaveBeenCalledWith('2026-07-20');
  await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
} };
export const Required: Story = { args: { required: true } };
export const WithValue: Story = { name: 'Selected Date', args: { defaultValue: '2026-07-30' } };
export const Helper: Story = { name: 'Helper Text', args: { message: '날짜를 선택해 주세요.' } };
export const WithMessage: Story = { name: 'Status Message', args: { message: '예약 가능한 날짜를 확인해 주세요.', messageType: 'info' } };
export const Range: Story = { name: 'Date Limits', args: { minValue: '2026-07-06', maxValue: '2026-07-24' } };
export const WeekdaysOnly: Story = { name: 'Disabled Dates', args: { isDateUnavailable: (iso: string) => [0, 6].includes(new Date(iso + 'T12:00:00').getDay()) } };
export const Invalid: Story = { name: 'Error', args: { invalid: true, message: '예약할 수 없는 날짜예요.' } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { name: 'Read Only', args: { readOnly: true, defaultValue: '2026-07-30' } };
export const DateRange: Story = { name: 'Date Range', args: { selectionMode: 'range', label: '이용 기간' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /7월 16일/ }));
    await userEvent.click(canvas.getByRole('button', { name: /7월 10일/ }));
    await expect(args.onRangeChange).toHaveBeenLastCalledWith({ start: '2026-07-10', end: '2026-07-16' });
    await userEvent.click(canvas.getByRole('button', { name: /7월 20일/ }));
    await userEvent.click(canvas.getByRole('button', { name: /7월 20일/ }));
    await expect(args.onRangeChange).toHaveBeenLastCalledWith({ start: '2026-07-20', end: '2026-07-20' });
  },
};
export const RangeHoverPreview: Story = { name: 'Range Hover Preview', args: { selectionMode: 'range', label: '이용 기간' },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /7월 10일/ }));
    await userEvent.hover(canvas.getByRole('button', { name: /7월 16일/ }));
    await expect(canvasElement.querySelector('.ds-calendar--preview')).toBeInTheDocument();
    await expect(canvasElement.querySelector('[data-date="2026-07-13"]')).toHaveAttribute('data-selected');
    await expect(args.onRangeChange).not.toHaveBeenCalled();
  },
};
export const YearMonthSelection: Story = { name: 'Year / Month Selection',
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    // The calendar retains its Select behavior while sharing TextButton md typography and spacing.
    const year = canvas.getByRole('button', { name: /연도/ });
    await expect(year.getBoundingClientRect().height).toBe(32);
    await expect(getComputedStyle(year).fontSize).toBe('14px');
    await userEvent.click(canvas.getByRole('button', { name: /연도/ }));
    await expect(year).toHaveAttribute('data-pressed');
    const pressedStyle = getComputedStyle(year);
    await expect(pressedStyle.getPropertyValue('--ds-button-bg').trim()).toBe(pressedStyle.getPropertyValue('--ds-button-bg-pressed').trim());
    await userEvent.click(await body.findByRole('option', { name: '2028년' }));
    await userEvent.click(canvas.getByRole('button', { name: /월 월$/ }));
    await userEvent.click(await body.findByRole('option', { name: '2월' }));
    await expect(canvas.getByRole('button', { name: /2028년 2월 29일/ })).toBeInTheDocument();
  },
};
export const KeyboardInteraction: Story = { name: 'Keyboard Interaction',
  play: async ({ canvas, userEvent, args }) => {
    canvas.getByRole('button', { name: /7월 15일/ }).focus();
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await expect(args.onChange).toHaveBeenCalledWith('2026-07-16');
    const year = canvas.getByRole('button', { name: /연도/ });
    year.focus(); await userEvent.keyboard('{ArrowDown}{Escape}');
    await expect(year).toHaveFocus();
  },
};
