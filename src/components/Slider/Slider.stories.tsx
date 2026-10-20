import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Slider } from './Slider';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Slider.showcase.stories.tsx에 있습니다.
const meta = {
  title: "Components/Slider/Slider",
  id: 'components-slider-slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "정해진 범위에서 수치를 조절합니다. 드래그와 키보드를 지원하며 숫자 입력 필드를 함께 사용할 수 있습니다.",
      },
    },
  },
  args: {
    'aria-label': '인원',
    minValue: 1,
    maxValue: 200,
    defaultValue: 100,
    step: 1,
    unit: '명',
    showInput: true,
    valueLabel: true,
    disabled: false,
    onChange: fn(),
    onChangeEnd: fn(),
  },
  argTypes: {
    showInput: { control: 'boolean', description: '오른쪽 숫자 입력 필드 표시' },
    valueLabel: { control: 'boolean', description: '마우스를 올리거나 드래그하거나 키보드 포커스를 받으면 손잡이 위에 값 표시' },
    disabled: { control: 'boolean', description: '비활성 — 값을 바꿀 수 없음' },
    unit: { control: 'text' },
  },
  decorators: [(Story) => <div style={{ width: 320, paddingTop: 28 }}><Story /></div>],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "Playground" };

export const WithoutInput: Story = {
  name: "Without Input",
  args: { showInput: false },
};

export const Percent: Story = {
  name: '백분율',
  args: { 'aria-label': '투명도', minValue: 0, maxValue: 100, defaultValue: 40, step: 10, unit: '%' },
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true },
};
