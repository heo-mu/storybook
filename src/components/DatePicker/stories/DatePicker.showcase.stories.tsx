import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { DatePicker } from '../DatePicker';
import { FieldMessage, type FieldSize } from '../../Field';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { expectRequiredMark } from '../../../storybook/requiredMark';
import { expectHelperMessage } from '../../../storybook/helperMessage';
import { mockToday } from '../../../storybook/mockToday';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs date-picker` (sets date-picker_trigger, date-picker_message, date-picker_calendar,
// date-picker_day, date-picker_navigation).
const meta = { title: 'Components/DatePicker/Gallery', id: 'components-datepicker-showcase', tags: ['!manifest'], parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Overview: Story = { render: () => <StorySection title="Input · Inline">
  <div style={{ display: 'grid', gap: 24, width: 320 }}>
    <DatePicker label="방문일" defaultValue="2026-07-30" />
    <DatePicker label="이용 기간" selectionMode="range" defaultRangeValue={{ start: '2026-07-10', end: '2026-07-16' }} />
  </div>
  <DatePicker variant="inline" label="방문일" defaultValue="2026-07-30" />
</StorySection> };

/* ---------- date-picker_trigger: the field (Select-shaped, calendar icon) ---------- */
const STATES = ['Default', 'Hover', 'Focus', 'Completed', 'Error', 'Disabled', 'Read-only'] as const;
type State = (typeof STATES)[number];
const SIZES: FieldSize[] = ['sm', 'md', 'lg'];

/** Props that put a field into one Figma variant (the Open state has its own story — the calendar would cover the matrix). */
function figmaVariant(size: FieldSize, state: State) {
  const base = { size, label: '라벨명', defaultFocusedValue: '2026-07-15' } as const;
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

/** 필드의 상태를 비교합니다(Figma date-picker_trigger, Open 제외). */
export const VariantMatrix: Story = {
  name: 'Input Variants',
  render: () => (
    <FigmaMatrix
      cellWidth={320}
      columns={[...STATES]}
      rows={SIZES.map((size) => ({
        label: size,
        cells: STATES.map((state) => ({ figma: `Size=${size}, State=${state}`, node: <DatePicker {...figmaVariant(size, state)} /> })),
      }))}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(21);
  },
};

/** 열린 필드(Figma State=Open): 포커스 테두리와 진한 아이콘, 달력은 필드 아래 4px. */
export const Open: StoryObj<{ size: FieldSize }> = {
  name: 'Open',
  args: { size: 'sm' },
  argTypes: { size: { control: 'inline-radio', options: SIZES } },
  parameters: { controls: { disable: false } },
  render: (args) => (
    <div style={{ width: 320, height: 400 }}>
      <div data-figma={`Size=${args.size}, State=Open`} style={{ width: 320 }}>
        <DatePicker size={args.size} label="라벨명" defaultValue="2026-07-30" defaultOpen />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await body.findByRole('dialog');
    const field = canvasElement.querySelector('.ds-date-picker')!;
    await expect(field).toHaveAttribute('data-open');
    const trigger = field.querySelector('.ds-date-picker__trigger')!;
    const dialog = body.getByRole('dialog');
    // react-aria positions the popover after layout: 4px (spacing/margin/m-1) below the field. Start alignment is measured in a
    // real browser by scripts/interaction-audit.mjs (the Vitest browser frame offsets absolutely positioned overlays by its own margin).
    await waitFor(() => expect(Math.round(dialog.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom)).toBe(4));
  },
};

export const States: Story = { render: () => <StorySection title="States">
  <div style={{ display: 'grid', gap: 24, width: 320 }}>
    <DatePicker label="선택" defaultValue="2026-07-30" />
    <DatePicker label="오류" defaultValue="2026-07-30" invalid message="예약할 수 없는 날짜예요." />
    <DatePicker label="비활성" disabled defaultValue="2026-07-30" />
    <DatePicker label="읽기 전용" readOnly defaultValue="2026-07-30" />
  </div>
</StorySection> };

function Controlled() {
  const [value, setValue] = useState<string | null>(null);
  return <><DatePicker label="방문일" value={value} onChange={setValue} name="visit" minValue="2026-07-01" defaultFocusedValue="2026-07-15" /><output>값: {value ?? '없음'}</output></>;
}
/** 제어 컴포넌트: 필드를 열어 고른 값이 바깥 상태와 필드에 반영되고 달력이 닫힙니다. */
export const Interaction: Story = { render: () => <Controlled />, play: async ({ canvas, canvasElement, userEvent }) => {
  const body = within(canvasElement.ownerDocument.body);
  await userEvent.click(canvas.getByRole('button', { name: /방문일/ }));
  await userEvent.click(await body.findByRole('button', { name: /7월 20일/ }));
  await expect(canvas.getByText('값: 2026-07-20')).toBeInTheDocument();
  await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  await expect(canvas.getByRole('button', { name: /방문일/ })).toHaveTextContent('2026.07.20');
} };

/** 바깥 클릭으로 닫히고, 여러 필드는 서로 독립입니다. */
export const OutsideClick: Story = { name: 'Outside Click · Independent', render: () => <div style={{ display: 'flex', gap: 24 }}>
  <DatePicker label="첫 번째" defaultFocusedValue="2026-07-15" />
  <DatePicker label="두 번째" selectionMode="range" defaultFocusedValue="2026-07-15" />
</div>, play: async ({ canvas, canvasElement, userEvent }) => {
  const body = within(canvasElement.ownerDocument.body);
  const first = canvas.getByRole('button', { name: /첫 번째/ });
  const second = canvas.getByRole('button', { name: /두 번째/ });
  await userEvent.click(first);
  await userEvent.click(await body.findByRole('button', { name: /7월 20일/ }));
  await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  await expect(first).toHaveTextContent('2026.07.20');
  await expect(second).toHaveTextContent('YYYY.MM.DD ~ YYYY.MM.DD');
  await userEvent.click(second);
  await body.findByRole('dialog');
  await userEvent.click(canvasElement.ownerDocument.body);
  await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  await expect(second).toHaveTextContent('YYYY.MM.DD ~ YYYY.MM.DD');
  await expect(first).toHaveTextContent('2026.07.20');
} };

/** 필드 이름은 "값 + 라벨", 메시지는 설명으로 연결되고, 폼 전송 값은 ISO 날짜입니다. */
export const Accessibility: Story = { render: () => <form aria-label="예약"><DatePicker label="예약일" name="date" defaultValue="2026-07-30" invalid message="예약할 수 없는 날짜입니다." /></form>,
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole('button', { name: '2026.07.30 예약일' });
    await expect(trigger).toHaveAccessibleDescription('예약할 수 없는 날짜입니다.');
    await expect(trigger).toHaveAttribute('aria-invalid', 'true');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false'); // react-aria dialog triggers expose aria-expanded (no aria-haspopup for type dialog)
    await expect(new FormData(canvasElement.querySelector('form')!).get('date')).toBe('2026-07-30');
  } };

export const RequiredMark: Story = { name: 'Required', render: () => <><DatePicker label="방문일" required /><DatePicker variant="inline" label="종료일" required /><DatePicker label="선택" /></>,
  play: async ({ canvas, canvasElement }) => {
    const fields = canvasElement.querySelectorAll('.ds-date-picker');
    await expect(canvas.getByRole('button', { name: /방문일/ })).toHaveAccessibleDescription('필수');
    await expectRequiredMark(fields[0], '--colors-date-picker-trigger-outline-required-default');
    await expect(fields[1].querySelector('[role="application"]')).toHaveAccessibleDescription('필수 선택');
    await expectRequiredMark(fields[1], '--colors-date-picker-trigger-outline-required-default');
    await expect(fields[2].querySelector('.ds-field__required')).not.toBeInTheDocument();
  } };

export const MessageMatrix: Story = {
  name: 'Messages',
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
  name: 'Helper Text',
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

/* ---------- date-picker_calendar · _day · _navigation: the calendar (inline, shared by the popover) ---------- */

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

/** 오늘과 선택한 날짜를 표시하는 달력입니다(Figma date-picker_calendar). */
export const CalendarMatrix: Story = {
  name: 'Calendar',
  beforeEach: mockToday('2026-07-29'),
  render: () => (
    <div style={{ padding: 16, display: 'flex', gap: 40 }}>
      <div data-figma="Mode=Single, State=Selected" style={{ display: 'flex', width: 'fit-content' }}>
        <DatePicker variant="inline" aria-label="2026년 7월" defaultValue="2026-07-30" />
      </div>
      {(['Default', 'Start', 'Selected', 'Preview'] as const).map((state) => <div key={state} data-figma={`Mode=Range, State=${state}`} style={{ display: 'flex', width: 'fit-content' }}>
        <DatePicker variant="inline" aria-label={`Range ${state}`} selectionMode="range" defaultFocusedValue="2026-07-10"
          defaultRangeValue={state === 'Selected' ? { start: '2026-07-10', end: '2026-07-16' } : undefined} />
      </div>)}
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const start = canvasElement.querySelector('[data-figma="Mode=Range, State=Start"]')!;
    const preview = canvasElement.querySelector('[data-figma="Mode=Range, State=Preview"]')!;
    await userEvent.click(start.querySelector('[data-date="2026-07-10"]')!);
    await userEvent.click(preview.querySelector('[data-date="2026-07-10"]')!);
    await userEvent.hover(preview.querySelector('[data-date="2026-07-16"]')!);
    await waitFor(() => expect(preview.querySelectorAll('[data-selected]')).toHaveLength(7));
    canvasElement.setAttribute('data-baseline-ready', 'true');
  },
};

/** 오늘 · 선택 · 비활성 등 날짜 칸의 상태를 비교합니다(Figma date-picker_day). */
export const DayMatrix: Story = {
  name: 'Day States',
  beforeEach: mockToday('2026-07-01'),
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: 16 }}>
      <Annotate marks={[['State=Default', dayOne(false)]]}>
        <DatePicker variant="inline" aria-label="Default" defaultFocusedValue="2026-08-10" />
      </Annotate>
      <Annotate marks={[['State=Hover', dayOne(false)]]}>
        <div className={PSEUDO.hoverAll}>
          <DatePicker variant="inline" aria-label="Hover" defaultFocusedValue="2026-08-10" />
        </div>
      </Annotate>
      <Annotate marks={[['State=Pressed', dayOne(false)]]}>
        <div className={PSEUDO.pressedAll}>
          <DatePicker variant="inline" aria-label="Pressed" defaultFocusedValue="2026-08-10" />
        </div>
      </Annotate>
      <Annotate marks={[['State=Today', dayOne(false)]]}>
        <DatePicker variant="inline" aria-label="Today" defaultFocusedValue="2026-07-10" />
      </Annotate>
      <Annotate marks={[['State=Selected', dayOne(false)]]}>
        <DatePicker variant="inline" aria-label="Selected" defaultValue="2026-09-01" />
      </Annotate>
      <Annotate marks={[['State=Outside', dayOne(true)]]}>
        <DatePicker variant="inline" aria-label="Outside" defaultFocusedValue="2026-05-10" />
      </Annotate>
      <Annotate marks={[['State=Disabled', dayOne(false)]]}>
        <DatePicker variant="inline" aria-label="Disabled" defaultFocusedValue="2026-10-10" minValue="2026-10-02" />
      </Annotate>
    </div>
  ),
};

const navButtons = (direction: 'Previous' | 'Next', state: string): [string, (root: HTMLElement) => Element | undefined] => [
  `Direction=${direction}, State=${state}`,
  (root) => root.querySelectorAll('.ds-calendar__nav-button')[direction === 'Previous' ? 0 : 1] ?? undefined,
];

/** 이전 · 다음 달 이동 버튼의 상태를 비교합니다(Figma date-picker_navigation). */
export const NavigationMatrix: Story = {
  name: 'Navigation',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: 16 }}>
      <Annotate marks={[navButtons('Previous', 'Default'), navButtons('Next', 'Default')]}>
        <DatePicker variant="inline" aria-label="Default" defaultFocusedValue="2026-07-15" />
      </Annotate>
      <Annotate marks={[navButtons('Previous', 'Hover'), navButtons('Next', 'Hover')]}>
        <div className={PSEUDO.hoverAll}>
          <DatePicker variant="inline" aria-label="Hover" defaultFocusedValue="2026-07-15" />
        </div>
      </Annotate>
      <Annotate marks={[navButtons('Previous', 'Pressed'), navButtons('Next', 'Pressed')]}>
        <div className={PSEUDO.pressedAll}>
          <DatePicker variant="inline" aria-label="Pressed" defaultFocusedValue="2026-07-15" />
        </div>
      </Annotate>
      <Annotate marks={[navButtons('Previous', 'Disabled'), navButtons('Next', 'Disabled')]}>
        <DatePicker variant="inline" aria-label="Disabled" defaultFocusedValue="2026-07-15" minValue="2026-07-01" maxValue="2026-07-31" />
      </Annotate>
    </div>
  ),
};

/** 달력 안: 방향키로 이동, Page Down으로 다음 달, Enter로 선택, 이전 · 다음 버튼. */
export const InlineInteraction: Story = {
  name: 'Inline Interaction',
  render: () => <DatePicker variant="inline" aria-label="일정" defaultFocusedValue="2026-07-15" />,
  play: async ({ canvas, userEvent, step }) => {
    await step('next month button', async () => {
      await userEvent.click(canvas.getAllByRole('button', { name: '다음' }).find((button) => button.classList.contains('ds-calendar__nav-button'))!);
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

/** 달력은 role="application" 격자이며 날짜 버튼에 이름이 있고, 고를 수 없는 날은 표시됩니다. */
export const InlineAccessibility: Story = {
  name: 'Inline Accessibility',
  render: () => <DatePicker variant="inline" aria-label="예약일" defaultFocusedValue="2026-07-15" minValue="2026-07-10" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('grid')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: /이전/ })).toBeInTheDocument();
    const day5 = canvas.getByRole('button', { name: /7월 5일/ });
    await expect(day5).toHaveAttribute('aria-disabled', 'true');
  },
};
