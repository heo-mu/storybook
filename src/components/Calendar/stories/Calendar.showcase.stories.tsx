import { useLayoutEffect, useRef, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Calendar } from '../Calendar';
import { StorySection } from '../../../storybook/FigmaMatrix';
import { mockToday } from '../../../storybook/mockToday';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs date-picker` (sets date-picker_calendar, date-picker_day, date-picker_navigation).
const meta = {
  title: 'Components/Calendar/Showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * Story-only: marks elements inside a rendered calendar with data-figma names (the day and navigation
 * variants are parts of the calendar, so they are verified in place).
 */
function Annotate({ marks, children }: { marks: Array<[figma: string, find: (root: HTMLElement) => Element | undefined]>; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    for (const [figma, find] of marks) find(ref.current!)?.setAttribute('data-figma', figma);
  });
  return <div ref={ref}>{children}</div>;
}

const dayOne = (outside: boolean) => (root: HTMLElement) =>
  [...root.querySelectorAll('.ds-calendar__day')].find((el) => el.textContent === '1' && el.hasAttribute('data-outside-month') === outside);

export const Overview: Story = {
  render: () => (
    <StorySection title="Calendar (date-picker_calendar)">
      <Calendar aria-label="일정" defaultValue="2026-07-30" />
      <Calendar aria-label="기간 제한" defaultFocusedValue="2026-07-15" minValue="2026-07-06" maxValue="2026-07-24" />
    </StorySection>
  ),
};

/** Figma `date-picker_calendar`: July 2026, today the 29th, the 30th selected (today fixed for the story). */
export const CalendarMatrix: Story = {
  beforeEach: mockToday('2026-07-29'),
  render: () => (
    <div style={{ padding: 16 }}>
      <div data-figma="date-picker_calendar" style={{ display: 'flex', width: 'fit-content' }}>
        <Calendar aria-label="2026년 7월" defaultValue="2026-07-30" />
      </div>
    </div>
  ),
};

/**
 * Figma `date-picker_day` (7): the day "1" of a calendar in each state (today fixed to 2026-07-01; Hover /
 * Pressed forced on the whole calendar).
 */
export const DayMatrix: Story = {
  beforeEach: mockToday('2026-07-01'),
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: 16 }}>
      <Annotate marks={[['State=Default', dayOne(false)]]}>
        <Calendar aria-label="Default" defaultFocusedValue="2026-08-10" />
      </Annotate>
      <Annotate marks={[['State=Hover', dayOne(false)]]}>
        <div className={PSEUDO.hoverAll}>
          <Calendar aria-label="Hover" defaultFocusedValue="2026-08-10" />
        </div>
      </Annotate>
      <Annotate marks={[['State=Pressed', dayOne(false)]]}>
        <div className={PSEUDO.pressedAll}>
          <Calendar aria-label="Pressed" defaultFocusedValue="2026-08-10" />
        </div>
      </Annotate>
      <Annotate marks={[['State=Today', dayOne(false)]]}>
        <Calendar aria-label="Today" defaultFocusedValue="2026-07-10" />
      </Annotate>
      <Annotate marks={[['State=Selected', dayOne(false)]]}>
        <Calendar aria-label="Selected" defaultValue="2026-09-01" />
      </Annotate>
      <Annotate marks={[['State=Outside', dayOne(true)]]}>
        <Calendar aria-label="Outside" defaultFocusedValue="2026-05-10" />
      </Annotate>
      <Annotate marks={[['State=Disabled', dayOne(false)]]}>
        <Calendar aria-label="Disabled" defaultFocusedValue="2026-10-10" minValue="2026-10-02" />
      </Annotate>
    </div>
  ),
};

const navButtons = (direction: 'Previous' | 'Next', state: string): [string, (root: HTMLElement) => Element | undefined] => [
  `Direction=${direction}, State=${state}`,
  (root) => root.querySelectorAll('.ds-calendar__nav-button')[direction === 'Previous' ? 0 : 1] ?? undefined,
];

/** Figma `date-picker_navigation` (8): previous / next buttons of calendars in each state. */
export const NavigationMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: 16 }}>
      <Annotate marks={[navButtons('Previous', 'Default'), navButtons('Next', 'Default')]}>
        <Calendar aria-label="Default" defaultFocusedValue="2026-07-15" />
      </Annotate>
      <Annotate marks={[navButtons('Previous', 'Hover'), navButtons('Next', 'Hover')]}>
        <div className={PSEUDO.hoverAll}>
          <Calendar aria-label="Hover" defaultFocusedValue="2026-07-15" />
        </div>
      </Annotate>
      <Annotate marks={[navButtons('Previous', 'Pressed'), navButtons('Next', 'Pressed')]}>
        <div className={PSEUDO.pressedAll}>
          <Calendar aria-label="Pressed" defaultFocusedValue="2026-07-15" />
        </div>
      </Annotate>
      <Annotate marks={[navButtons('Previous', 'Disabled'), navButtons('Next', 'Disabled')]}>
        <Calendar aria-label="Disabled" defaultFocusedValue="2026-07-15" minValue="2026-07-01" maxValue="2026-07-31" />
      </Annotate>
    </div>
  ),
};

/** Arrow keys move between days, Page Down changes month, Enter selects; previous / next buttons. */
export const Interaction: Story = {
  render: () => <Calendar aria-label="일정" defaultFocusedValue="2026-07-15" />,
  play: async ({ canvas, userEvent, step }) => {
    await step('next month button', async () => {
      await userEvent.click(canvas.getAllByRole('button')[1]);
      await expect(canvas.getByRole('heading')).toHaveTextContent('2026년 8월');
    });
    await step('keyboard: focus a day, arrows, Enter selects', async () => {
      const day10 = canvas.getByRole('button', { name: /8월 10일/ });
      await userEvent.click(day10);
      await expect(day10.closest('[data-selected]') ?? day10).toHaveAttribute('data-selected');
      await userEvent.keyboard('{ArrowRight}{ArrowDown}{Enter}');
      await waitFor(() => expect(canvas.getByRole('button', { name: /8월 18일/ })).toHaveAttribute('data-selected'));
    });
    await step('Page Up goes to the previous month', async () => {
      await userEvent.keyboard('{PageUp}');
      await expect(canvas.getByRole('heading')).toHaveTextContent('2026년 7월');
    });
  },
};

/** role="application" grid with labelled day buttons; disabled days are marked. */
export const Accessibility: Story = {
  render: () => <Calendar aria-label="예약일" defaultFocusedValue="2026-07-15" minValue="2026-07-10" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('grid')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: /이전/ })).toBeInTheDocument();
    const day5 = canvas.getByRole('button', { name: /7월 5일/ });
    await expect(day5).toHaveAttribute('aria-disabled', 'true');
  },
};
