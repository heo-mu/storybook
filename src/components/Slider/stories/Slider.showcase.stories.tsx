import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Slider } from '../Slider';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs slider` (sets slider, handle).
const meta = {
  title: 'Components/Slider/Showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * The Figma unit text box is 24px wide for the single glyph "명" (a stale auto-width, docs/figma-issues.md
 * F14). The matrix gives the unit that width so the rest of the layout can be compared exactly.
 */
const FIGMA_UNIT = <span style={{ display: 'inline-block', width: 24 }}>명</span>;

const figmaSlider = { minValue: 1, maxValue: 200, defaultValue: 100, unit: FIGMA_UNIT, 'aria-label': '인원' } as const;

export const Overview: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32, width: 360 }}>
      <Slider aria-label="인원" minValue={1} maxValue={200} defaultValue={100} unit="명" />
      <Slider aria-label="투명도" defaultValue={40} unit="%" />
      <Slider aria-label="볼륨" defaultValue={70} showInput={false} />
      <Slider aria-label="비활성" defaultValue={30} unit="%" disabled />
    </div>
  ),
};

/**
 * Figma `slider` (State Default · Disabled), 288px wide. The Figma field hugs the example value "100" (23px);
 * the component reserves room for the longest value instead (docs/figma-issues.md F15), so the matrix sets
 * the field to the Figma width to compare the rest of the layout exactly.
 */
export const VariantMatrix: Story = {
  render: () => (
    <div className="figma-slider">
      <style>{'.figma-slider .ds-slider__input .ds-field__input { width: 23px; }'}</style>
      <FigmaMatrix
        cellWidth={288}
        columns={['slider']}
        rows={(['Default', 'Disabled'] as const).map((state) => ({
          label: state,
          cells: [{ figma: `State=${state}`, node: <Slider {...figmaSlider} disabled={state === 'Disabled'} /> }],
        }))}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(2);
  },
};

const HANDLES = [
  { figma: 'State=Default, Value Label=no', valueLabel: false, className: undefined, disabled: false },
  { figma: 'State=Hover, Value Label=yes', valueLabel: true, className: PSEUDO.hoverAll, disabled: false },
  { figma: 'State=Hover, Value Label=no', valueLabel: false, className: PSEUDO.hoverAll, disabled: false },
  { figma: 'State=Pressed, Value Label=yes', valueLabel: true, className: PSEUDO.pressedAll, disabled: false },
  { figma: 'State=Disabled, Value Label=no', valueLabel: false, className: undefined, disabled: true },
] as const;

/**
 * Figma `handle` (5): each cell is a 20×20 box holding the handle of a slider at its minimum value; the
 * rail and range row are hidden so the handle is compared on its own, as in the Figma set.
 */
export const HandleMatrix: Story = {
  render: () => (
    <div className="handle-matrix" style={{ paddingTop: 32 }}>
      <style>{'.handle-matrix .ds-slider__rail, .handle-matrix .ds-slider__range { visibility: hidden; }'}</style>
      <FigmaMatrix
        cellWidth={20}
        columns={['handle']}
        rows={HANDLES.map((h) => ({
          label: h.figma,
          cells: [
            {
              figma: h.figma,
              node: (
                <div style={{ position: 'relative', height: 20, marginBottom: 32 }}>
                  <Slider
                    aria-label={h.figma}
                    className={h.className}
                    style={{ position: 'absolute', left: 10, top: 0, width: 120 }}
                    minValue={100}
                    maxValue={200}
                    unit="명"
                    showInput={false}
                    valueLabel={h.valueLabel}
                    disabled={h.disabled}
                  />
                </div>
              ),
            },
          ],
        }))}
      />
    </div>
  ),
};

/** Default and Disabled with the value label shown (hover). */
export const States: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <StorySection title="Default · Hover (value label) · Disabled" direction="column">
        <Slider aria-label="기본" minValue={1} maxValue={200} defaultValue={100} unit="명" />
        <div style={{ paddingTop: 24 }}>
          <Slider aria-label="호버" minValue={1} maxValue={200} defaultValue={100} unit="명" className={PSEUDO.hoverAll} />
        </div>
        <Slider aria-label="비활성" minValue={1} maxValue={200} defaultValue={100} unit="명" disabled />
      </StorySection>
    </div>
  ),
};

function Controlled() {
  const [value, setValue] = useState(20);
  return (
    <div style={{ width: 320, display: 'grid', gap: 12, paddingTop: 24 }}>
      <Slider aria-label="인원" inputLabel="인원 입력" value={value} onChange={setValue} minValue={0} maxValue={50} step={5} unit="명" />
      <output style={{ font: '12px sans-serif' }}>값: {value}</output>
    </div>
  );
}

/** Keyboard on the handle, typing in the field (committed on Enter, clamped and snapped to the step). */
export const Interaction: Story = {
  render: () => <Controlled />,
  play: async ({ canvas, userEvent, step }) => {
    const slider = canvas.getByRole('slider', { name: '인원' });
    const field = canvas.getByRole('textbox', { name: '인원 입력' });
    await step('arrow keys move by one step', async () => {
      slider.focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(canvas.getByText('값: 25')).toBeInTheDocument();
      await expect(field).toHaveValue('25');
    });
    await step('End / Home jump to the ends', async () => {
      await userEvent.keyboard('{End}');
      await expect(canvas.getByText('값: 50')).toBeInTheDocument();
      await userEvent.keyboard('{Home}');
      await expect(canvas.getByText('값: 0')).toBeInTheDocument();
    });
    await step('typing a value and pressing Enter moves the handle (snapped, clamped)', async () => {
      await userEvent.clear(field);
      await userEvent.type(field, '33{Enter}');
      await expect(canvas.getByText('값: 35')).toBeInTheDocument();
      await userEvent.clear(field);
      await userEvent.type(field, '999{Enter}');
      await expect(canvas.getByText('값: 50')).toBeInTheDocument();
    });
    await step('invalid text reverts on blur', async () => {
      await userEvent.clear(field);
      await userEvent.type(field, 'abc');
      await userEvent.tab();
      await waitFor(() => expect(field).toHaveValue('50'));
    });
  },
};

/** Native range input (role slider) with min, max and value; the number field has its own name. */
export const Accessibility: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Slider aria-label="인원" inputLabel="인원 입력" minValue={1} maxValue={200} defaultValue={100} unit="명" />
    </div>
  ),
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider', { name: '인원' });
    await expect(slider).toHaveAttribute('min', '1');
    await expect(slider).toHaveAttribute('max', '200');
    await expect(slider).toHaveValue('100');
    await expect(canvas.getByRole('textbox', { name: '인원 입력' })).toHaveValue('100');
  },
};
