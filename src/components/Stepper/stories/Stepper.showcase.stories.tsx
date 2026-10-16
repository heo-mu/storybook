import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stepper, StepperConnector, StepperIndicator, type StepperStep } from '../Stepper';
import { STEPPER_STATUSES, type StepperOrientation, type StepperStatus } from '../Stepper.options';
import { Button } from '../../Button';
import { FigmaMatrix } from '../../../storybook/FigmaMatrix';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs stepper` (6 sets: steppers, indicators, connectors).
const meta = {
  title: 'Components/Stepper/Showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const VARIANT_NAME: Record<StepperStatus, string> = { upcoming: 'Upcoming', current: 'Current', completed: 'Completed', locked: 'Locked', error: 'Error' };
/** Numbers shown in the Figma indicator variants. */
const FIGMA_NUMBER: Record<StepperStatus, number> = { upcoming: 1, current: 2, completed: 1, locked: 2, error: 1 };
const steps = (n: number): StepperStep[] => Array.from({ length: n }, () => ({ label: '라벨명', description: '서브 라벨명' }));
const capital = (o: StepperOrientation) => (o === 'horizontal' ? 'Horizontal' : 'Vertical');

export const Overview: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 40, padding: '0 24px' }}>
      <Stepper
        aria-label="가입 절차"
        currentStep={1}
        steps={[
          { label: '약관 동의', description: '필수 항목' },
          { label: '정보 입력', description: '이름 · 연락처' },
          { label: '본인 확인', description: '휴대폰 인증' },
          { label: '완료', description: '가입 완료' },
        ]}
      />
      <Stepper
        aria-label="설비 등록"
        orientation="vertical"
        currentStep={2}
        steps={[
          { label: '기본 정보', description: '설비 이름' },
          { label: '위치', description: '건물 · 층', status: 'error' },
          { label: '센서 연결', description: '게이트웨이' },
          { label: '승인', description: '관리자 승인', status: 'locked' },
        ]}
      />
    </div>
  ),
};

/** Figma `stepper_indicator_horizontal` and `stepper_indicator_vertical` (5 each). */
export const IndicatorMatrix: Story = {
  render: () => (
    <div style={{ padding: '0 24px' }}>
      <FigmaMatrix
        columns={STEPPER_STATUSES.map((s) => VARIANT_NAME[s])}
        rows={(['horizontal', 'vertical'] as const).map((orientation) => ({
          label: orientation,
          cells: STEPPER_STATUSES.map((status) => ({
            figma: `${orientation}:Variant=${VARIANT_NAME[status]}`,
            node: <StepperIndicator orientation={orientation} status={status} step={FIGMA_NUMBER[status]} label="라벨명" description="서브 라벨명" />,
          })),
        }))}
      />
    </div>
  ),
};

/** Figma `stepper_connector_horizontal` and `stepper_connector_vertical` (Default / Completed). */
export const ConnectorMatrix: Story = {
  render: () => (
    <FigmaMatrix
      columns={['Default', 'Completed']}
      rows={(['horizontal', 'vertical'] as const).map((orientation) => ({
        label: orientation,
        cells: [false, true].map((completed) => ({
          figma: `${orientation}:State=${completed ? 'Completed' : 'Default'}, Type=${capital(orientation)}`,
          node: <StepperConnector orientation={orientation} completed={completed} />,
        })),
      }))}
    />
  ),
};

/** Figma `stepper_horizontal` and `stepper_vertical`: Steps 3 · 4 · 5 (current step 2; vertical 5 steps: step 4). */
export const StepperMatrix: Story = {
  render: () => (
    <div style={{ padding: '12px 24px' }}>
      <FigmaMatrix
        columns={['Steps=3', 'Steps=4', 'Steps=5']}
        rows={(['horizontal', 'vertical'] as const).map((orientation) => ({
          label: orientation,
          cells: [3, 4, 5].map((n) => ({
            figma: `${orientation}:Type=${capital(orientation)}, Steps=${n}`,
            node: <Stepper aria-label={`${n}단계`} orientation={orientation} steps={steps(n)} currentStep={orientation === 'vertical' && n === 5 ? 3 : 1} />,
          })),
        }))}
      />
    </div>
  ),
};

/** The current step moves with `currentStep`: earlier steps become completed, connectors follow. */
export const Interaction: Story = {
  render: function Render() {
    const [current, setCurrent] = useState(0);
    const items = [{ label: '약관 동의' }, { label: '정보 입력' }, { label: '완료' }];
    return (
      <div style={{ display: 'grid', gap: 40, padding: '0 24px' }}>
        <Stepper aria-label="가입 절차" steps={items} currentStep={current} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" appearance="outline" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
            이전
          </Button>
          <Button disabled={current === items.length - 1} onClick={() => setCurrent((c) => c + 1)}>
            다음
          </Button>
        </div>
      </div>
    );
  },
  play: async ({ canvas, userEvent, step }) => {
    const list = canvas.getByRole('list', { name: '가입 절차' });
    const current = () => within(list).getAllByRole('listitem').findIndex((li) => li.getAttribute('aria-current') === 'step');
    await expect(current()).toBe(0);
    await step('next: step 1 completed, step 2 current', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '다음' }));
      await expect(current()).toBe(1);
      await expect(within(list).getAllByRole('listitem')[0]).toHaveTextContent('1단계, 완료');
    });
    await step('previous: back to step 1', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '이전' }));
      await expect(current()).toBe(0);
    });
  },
};

/** Ordered list, aria-current="step", status text for icon-only states. */
export const Accessibility: Story = {
  render: () => (
    <div style={{ padding: '0 24px' }}>
      <Stepper
        aria-label="설비 등록"
        currentStep={1}
        steps={[{ label: '기본 정보' }, { label: '위치', status: 'error' }, { label: '승인', status: 'locked' }]}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const items = within(canvas.getByRole('list', { name: '설비 등록' })).getAllByRole('listitem');
    await expect(items).toHaveLength(3);
    await expect(items[0]).toHaveTextContent('1단계, 완료');
    await expect(items[1]).toHaveTextContent('2단계, 오류');
    await expect(items[2]).toHaveTextContent('3단계, 잠김');
  },
};
