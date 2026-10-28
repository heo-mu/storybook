import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';
import { DatePicker } from './DatePicker';
import { FIELD_MESSAGE_TYPES } from '../Field';

const meta = {
  title: 'Components/DatePicker/DatePicker', id: 'components-datepicker-datepicker',
  component: DatePicker, tags: ['autodocs'],
  parameters: { docs: { description: { component: '날짜 또는 기간을 선택합니다. 필드를 누르면 달력이 열리고(input), 달력만 둘 수도 있습니다(inline).' } } },
  args: { label: '방문일', defaultFocusedValue: '2026-07-15', onChange: fn(), onRangeChange: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['input', 'inline'], description: '필드를 눌러 여는 달력(input) 또는 항상 보이는 달력(inline)' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], description: '필드 크기(input)' },
    selectionMode: { control: 'inline-radio', options: ['single', 'range'] },
    messageType: { control: 'inline-radio', options: FIELD_MESSAGE_TYPES },
    disabled: { control: 'boolean' }, readOnly: { control: 'boolean' }, required: { control: 'boolean' },
    minValue: { control: 'text' }, maxValue: { control: 'text' }, placeholder: { control: 'text' },
  },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

const calendar = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);

export const Playground: Story = { name: 'Playground' };

/** 필드를 누르면 달력이 열리고, 날짜를 고르면 필드에 표시된 뒤 닫힙니다. 포커스는 필드로 돌아옵니다. */
export const SingleDate: Story = { name: 'Single Date', play: async ({ canvas, canvasElement, userEvent, args }) => {
  const trigger = canvas.getByRole('button', { name: /방문일/ });
  await expect(trigger).toHaveTextContent('YYYY.MM.DD');
  await userEvent.click(trigger);
  const body = calendar(canvasElement);
  await userEvent.click(await body.findByRole('button', { name: /7월 20일/ }));
  await expect(args.onChange).toHaveBeenCalledWith('2026-07-20');
  await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  await expect(trigger).toHaveTextContent('2026.07.20');
  await expect(trigger).toHaveFocus();
} };

/** 시작일과 종료일을 고르면 "시작일 ~ 종료일"로 표시되고 닫힙니다. */
export const DateRange: Story = { name: 'Date Range', args: { selectionMode: 'range', label: '이용 기간' },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const trigger = canvas.getByRole('button', { name: /이용 기간/ });
    await expect(trigger).toHaveTextContent('YYYY.MM.DD ~ YYYY.MM.DD');
    await userEvent.click(trigger);
    const body = calendar(canvasElement);
    await userEvent.click(await body.findByRole('button', { name: /7월 16일/ }));
    await expect(body.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(body.getByRole('button', { name: /7월 10일/ }));
    await expect(args.onRangeChange).toHaveBeenLastCalledWith({ start: '2026-07-10', end: '2026-07-16' });
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveTextContent('2026.07.10 ~ 2026.07.16');
  },
};

/** 달력만 보여 줍니다. 기존 Calendar와 같은 달력입니다. */
export const InlineCalendar: Story = { name: 'Inline Calendar', args: { variant: 'inline' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /7월 20일/ }));
    await expect(args.onChange).toHaveBeenCalledWith('2026-07-20');
    await expect(canvas.queryByRole('button', { name: /방문일/ })).not.toBeInTheDocument();
  } };

/** 달력만 두고 기간을 고릅니다. 앞선 날짜를 두 번째로 고르면 순서대로 정렬하고, 같은 날짜를 두 번 고르면 하루짜리 기간이 됩니다. */
export const InlineDateRange: Story = { name: 'Inline Date Range', args: { variant: 'inline', selectionMode: 'range', label: '이용 기간' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /7월 16일/ }));
    await userEvent.click(canvas.getByRole('button', { name: /7월 10일/ }));
    await expect(args.onRangeChange).toHaveBeenLastCalledWith({ start: '2026-07-10', end: '2026-07-16' });
    await userEvent.click(canvas.getByRole('button', { name: /7월 20일/ }));
    await userEvent.click(canvas.getByRole('button', { name: /7월 20일/ }));
    await expect(args.onRangeChange).toHaveBeenLastCalledWith({ start: '2026-07-20', end: '2026-07-20' });
  },
};

export const Sizes: Story = { render: (args) => <div style={{ display: 'grid', gap: 24, width: 320 }}>
  <DatePicker {...args} size="sm" label="sm" />
  <DatePicker {...args} size="md" label="md" />
  <DatePicker {...args} size="lg" label="lg" />
</div> };
export const Required: Story = { args: { required: true } };
export const WithValue: Story = { name: 'Selected Date', args: { defaultValue: '2026-07-30' } };
export const Helper: Story = { name: 'Helper Text', args: { message: '날짜를 선택해 주세요.' } };
export const WithMessage: Story = { name: 'Status Message', args: { message: '예약 가능한 날짜를 확인해 주세요.', messageType: 'info' } };
export const Range: Story = { name: 'Date Limits', args: { minValue: '2026-07-06', maxValue: '2026-07-24', defaultOpen: true } };
export const WeekdaysOnly: Story = { name: 'Disabled Dates', args: { defaultOpen: true, isDateUnavailable: (iso: string) => [0, 6].includes(new Date(iso + 'T12:00:00').getDay()) } };
export const Invalid: Story = { name: 'Error', args: { invalid: true, message: '예약할 수 없는 날짜예요.' } };
/** 비활성 필드는 누르거나 키보드로 열 수 없습니다. */
export const Disabled: Story = { args: { disabled: true }, play: async ({ canvas, canvasElement, userEvent }) => {
  const trigger = canvas.getByRole('button', { name: /방문일/ });
  await expect(trigger).toBeDisabled();
  await userEvent.click(trigger);
  await expect(calendar(canvasElement).queryByRole('dialog')).not.toBeInTheDocument();
} };
/** 읽기 전용은 값만 보여 주고 달력이 열리지 않습니다(달력 아이콘 없음). */
export const ReadOnly: Story = { name: 'Read Only', args: { readOnly: true, defaultValue: '2026-07-30' }, play: async ({ canvas, canvasElement, userEvent }) => {
  const trigger = canvas.getByRole('button', { name: /방문일/ });
  await expect(trigger).toHaveTextContent('2026.07.30');
  await expect(trigger).toHaveAccessibleDescription(/읽기 전용/);
  await userEvent.click(trigger);
  await expect(calendar(canvasElement).queryByRole('dialog')).not.toBeInTheDocument();
  await expect(trigger.querySelector('.ds-date-picker__icon')).toBeNull();
} };

/** 시작일을 고른 뒤 마우스를 올리거나 키보드로 이동하면 임시 범위가 보입니다. */
export const RangeHoverPreview: Story = { name: 'Range Hover Preview', args: { variant: 'inline', selectionMode: 'range', label: '이용 기간' },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /7월 10일/ }));
    await userEvent.hover(canvas.getByRole('button', { name: /7월 16일/ }));
    await expect(canvasElement.querySelector('.ds-calendar--preview')).toBeInTheDocument();
    await expect(canvasElement.querySelector('[data-date="2026-07-13"]')).toHaveAttribute('data-selected');
    await expect(args.onRangeChange).not.toHaveBeenCalled();
  },
};

/** 연도와 월을 각각 골라 이동합니다. */
export const YearMonthSelection: Story = { name: 'Year / Month Selection', args: { variant: 'inline' },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    // The calendar retains its Select behavior while sharing TextButton md typography and spacing.
    const year = canvas.getByRole('button', { name: /연도/ });
    await expect(year.getBoundingClientRect().height).toBe(32);
    await expect(getComputedStyle(year).fontSize).toBe('14px');
    // Figma date-picker_header (2026-10-27): button_text Type=Primary — label colors/button_text/primary/label/default, icon primary/icon/default.
    await expect(year).toHaveAttribute('data-variant', 'primary');
    await expect(getComputedStyle(year).color).toBe('rgb(64, 75, 93)');
    await expect(getComputedStyle(year.querySelector('.ds-button__icon')!).color).toBe('rgb(119, 129, 145)');
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

/** 필드: Enter · Space · ↓로 열고, 달력 안에서 방향키로 이동해 Enter로 고르면 닫히고 포커스가 필드로 돌아옵니다. Esc는 고르지 않고 닫습니다. */
export const KeyboardInteraction: Story = { name: 'Keyboard Interaction',
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const trigger = canvas.getByRole('button', { name: /방문일/ });
    const body = calendar(canvasElement);
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await body.findByRole('dialog');
    await waitFor(() => expect(body.getByRole('button', { name: /7월 15일/ })).toHaveFocus());
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await expect(args.onChange).toHaveBeenCalledWith('2026-07-16');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await body.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

/** 달력 안 키보드: 방향키로 이동, Enter로 선택, 연도 목록은 ↓로 열고 Esc로 닫습니다. */
export const InlineKeyboard: Story = { name: 'Inline Keyboard', args: { variant: 'inline' },
  play: async ({ canvas, userEvent, args }) => {
    canvas.getByRole('button', { name: /7월 15일/ }).focus();
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await expect(args.onChange).toHaveBeenCalledWith('2026-07-16');
    const year = canvas.getByRole('button', { name: /연도/ });
    year.focus(); await userEvent.keyboard('{ArrowDown}{Escape}');
    await expect(year).toHaveFocus();
  },
};
