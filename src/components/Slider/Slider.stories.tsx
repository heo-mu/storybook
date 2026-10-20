import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Slider } from './Slider';

// 사용 예 스토리(Storybook MCP 매니페스트 포함). 검증용 스토리는 ./stories/Slider.showcase.stories.tsx에 있습니다.
const meta = {
  title: '컴포넌트/Slider/Slider',
  id: 'components-slider-slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '정해진 범위 안에서 숫자 값을 고르는 슬라이더입니다. 범위는 `minValue` · `maxValue` · `step`으로 정하고, 보이는 라벨이 없으므로 `aria-label`을 꼭 붙입니다.',
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
    showInput: { control: 'boolean', description: '오른쪽 숫자 입력 칸 표시' },
    valueLabel: { control: 'boolean', description: '마우스를 올리거나 드래그하거나 키보드로 선택하면 손잡이 위에 값 표시' },
    disabled: { control: 'boolean', description: '비활성 — 값을 바꿀 수 없음' },
    unit: { control: 'text' },
  },
  decorators: [(Story) => <div style={{ width: 320, paddingTop: 28 }}><Story /></div>],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: '직접 체험' };

export const WithoutInput: Story = {
  name: '입력 칸 없음',
  args: { showInput: false },
};

export const Percent: Story = {
  name: '백분율',
  args: { 'aria-label': '투명도', minValue: 0, maxValue: 100, defaultValue: 40, step: 10, unit: '%' },
};

export const Disabled: Story = {
  name: '비활성',
  args: { disabled: true },
};
