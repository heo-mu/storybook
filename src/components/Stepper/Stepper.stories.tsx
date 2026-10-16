import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';
import { STEPPER_ORIENTATIONS } from './Stepper.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Stepper.showcase.stories.tsx
const meta = {
  title: 'Components/Stepper/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component sets **stepper_horizontal** (179:2043) and **stepper_vertical** (203:3949) built from ' +
          '**stepper_indicator_*** (Variant Upcoming / Current / Completed / Locked / Error) and **stepper_connector_*** ' +
          '(Default / Completed). Pass `steps` and `currentStep` (0-based): earlier steps are Completed, later ones Upcoming; ' +
          '`status` on a step overrides it (Locked, Error). Type → `orientation`. `StepperIndicator` and `StepperConnector` are ' +
          'exported for custom layouts. Progress display only — not interactive.',
      },
    },
  },
  args: {
    'aria-label': '가입 절차',
    orientation: 'horizontal',
    currentStep: 1,
    steps: [
      { label: '약관 동의', description: '필수 항목' },
      { label: '정보 입력', description: '이름 · 연락처' },
      { label: '본인 확인', description: '휴대폰 인증' },
      { label: '완료', description: '가입 완료' },
    ],
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: STEPPER_ORIENTATIONS, description: 'Figma "Type"', table: { defaultValue: { summary: 'horizontal' } } },
    currentStep: { control: { type: 'number', min: 0, max: 3 } },
  },
  decorators: [(Story) => <div style={{ padding: '16px 24px' }}>{Story()}</div>],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};

/** Step-level status: an error and a locked step. */
export const ErrorAndLocked: Story = {
  args: {
    currentStep: 2,
    steps: [
      { label: '기본 정보', description: '설비 이름' },
      { label: '위치', description: '건물 · 층', status: 'error' },
      { label: '센서 연결', description: '게이트웨이' },
      { label: '승인', description: '관리자 승인', status: 'locked' },
    ],
  },
};

/** Labels only (Figma "Sub-Label" off). */
export const LabelsOnly: Story = {
  args: { steps: [{ label: '장바구니' }, { label: '배송 정보' }, { label: '결제' }] },
};
