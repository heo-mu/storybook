import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';
import { STEPPER_ORIENTATIONS } from './Stepper.options';
import { Button } from '../Button';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 ./stories/Stepper.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Stepper/Stepper",
  id: 'components-stepper-stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "여러 단계로 이루어진 과정의 현재 위치와 진행 상태를 표시합니다. 단계 이동 버튼으로 사용하지 않습니다.",
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

export const Playground: Story = { name: "Playground" };

export const Vertical: Story = {
  name: "Vertical",
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
  name: "Label Only",
  args: { steps: [{ label: '장바구니' }, { label: '배송 정보' }, { label: '결제' }] },
};

/**
 * 단계를 옮기면 연결선이 한 단계씩 채워지며 현재 단계가 이동합니다. 여러 단계를 건너뛰면 차례로 채워지고, 이전으로 가면 거꾸로 비워집니다.
 * 동작 줄이기 설정에서는 바로 바뀝니다.
 */
export const Motion: Story = {
  name: '단계 이동',
  render: function Render(args) {
    const [current, setCurrent] = useState(0);
    const last = args.steps.length - 1;
    return (
      <div style={{ display: 'grid', gap: 24 }}>
        <Stepper {...args} currentStep={current} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" appearance="outline" onClick={() => setCurrent(0)} disabled={current === 0}>
            처음
          </Button>
          <Button variant="secondary" appearance="outline" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
            이전
          </Button>
          <Button onClick={() => setCurrent((c) => Math.min(last, c + 1))} disabled={current === last}>
            다음
          </Button>
          <Button variant="secondary" appearance="outline" onClick={() => setCurrent(last)} disabled={current === last}>
            마지막
          </Button>
        </div>
      </div>
    );
  },
};
