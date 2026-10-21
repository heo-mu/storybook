import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import { DatePicker } from '../DatePicker';

const meta = {
  title: 'Components/DatePicker/Regression', id: 'components-datepicker-regression', component: DatePicker,
  tags: ['!manifest'], args: { label: '기간', selectionMode: 'range', onRangeChange: fn(), onChange: fn() },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const YearBoundary: Story = { args: { defaultFocusedValue: '2026-12-30' },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /12월 30일/ }));
    await userEvent.click(canvasElement.querySelector<HTMLButtonElement>('.ds-calendar__nav-button[slot="next"]')!);
    await userEvent.click(canvas.getByRole('button', { name: /2027년 1월 3일/ }));
    await expect(args.onRangeChange).toHaveBeenLastCalledWith({ start: '2026-12-30', end: '2027-01-03' });
  },
};
export const UnavailableGap: Story = { args: { defaultFocusedValue: '2026-07-10', isDateUnavailable: (d: string) => d === '2026-07-12' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /7월 10일/ }));
    await userEvent.click(canvas.getByRole('button', { name: /7월 14일/ }));
    await expect(args.onRangeChange).not.toHaveBeenCalled();
    await expect(canvas.getByRole('button', { name: /7월 12일/ })).toHaveAttribute('aria-disabled', 'true');
  },
};
export const LimitsAndDismissal: Story = { args: { selectionMode: 'single', minValue: '2026-07-06', maxValue: '2026-08-24', defaultFocusedValue: '2026-07-15' },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: /월 월$/ }));
    const list = await body.findByRole('listbox');
    await expect(within(list).getAllByRole('option')).toHaveLength(2);
    await expect(within(list).queryByRole('option', { name: '6월' })).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('listbox')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /연도/ }));
    await expect(within(await body.findByRole('listbox')).getAllByRole('option')).toHaveLength(1);
    await userEvent.click(canvas.getByText('기간'));
    await expect(body.queryByRole('listbox')).not.toBeInTheDocument();
  },
};
export const LeapAndMonthEnd: Story = { args: { selectionMode: 'single', defaultFocusedValue: '2028-01-31' },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const day = canvas.getByRole('button', { name: /1월 31일/ }); day.focus();
    await userEvent.keyboard('{PageDown}{Enter}');
    await expect(args.onChange).toHaveBeenLastCalledWith('2028-02-29');
    await userEvent.click(canvas.getByRole('button', { name: /연도/ }));
    await userEvent.click(await within(canvasElement.ownerDocument.body).findByRole('option', { name: '2027년' }));
    await expect(canvas.queryByRole('button', { name: /2월 29일/ })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /2월 28일/ }));
    await expect(args.onChange).toHaveBeenLastCalledWith('2027-02-28');
  },
};
export const IndependentInstances: Story = {
  render: () => <div style={{ display: 'flex', gap: 24 }}>
    <DatePicker label="첫 번째" defaultFocusedValue="2026-07-15" />
    <DatePicker label="두 번째" selectionMode="range" defaultFocusedValue="2026-07-15" />
  </div>,
  play: async ({ canvas, userEvent }) => {
    const first = within(canvas.getByRole('application', { name: /첫 번째/ }));
    const second = within(canvas.getByRole('application', { name: /두 번째/ }));
    await userEvent.click(first.getByRole('button', { name: /7월 20일/ }));
    await expect(second.getByRole('button', { name: /7월 20일/ })).not.toHaveAttribute('data-selected');
    await userEvent.click(second.getByRole('button', { name: /7월 10일/ }));
    await userEvent.click(second.getByRole('button', { name: /7월 16일/ }));
    await expect(first.getByRole('button', { name: /7월 20일/ })).toHaveAttribute('data-selected');
  },
};
