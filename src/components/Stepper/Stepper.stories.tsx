import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';
import { STEPPER_ORIENTATIONS } from './Stepper.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Stepper.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Stepper/Stepper',
  id: 'components-stepper-stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '여러 단계로 된 과정에서 지금 몇 번째 단계인지 보여 줍니다(누를 수 없음). 단계는 `steps`, 지금 단계는 `currentStep`(0부터), 방향은 `orientation`으로 정합니다.',
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
    orientation: { control: 'inline-radio', options: STEPPER_ORIENTATIONS, description: '방향 — 가로(horizontal) · 세로(vertical)', table: { defaultValue: { summary: 'horizontal' } } },
    currentStep: { control: { type: 'number', min: 0, max: 3 } },
  },
  decorators: [(Story) => <div style={{ padding: '16px 24px' }}>{Story()}</div>],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const Vertical: Story = {
  name: '세로',
  args: { orientation: 'vertical' },
};

/** 단계의 `status`로 오류 단계와 잠긴 단계를 표시합니다. */
export const ErrorAndLocked: Story = {
  name: '오류 · 잠김',
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

/** 설명 없이 제목만 있는 단계입니다. */
export const LabelsOnly: Story = {
  name: '라벨만',
  args: { steps: [{ label: '장바구니' }, { label: '배송 정보' }, { label: '결제' }] },
};
