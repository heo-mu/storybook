import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading } from './Loading';
import { LOADING_SIZES } from './Loading.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 FileUploader/stories(LoadingMatrix)에 있습니다.
const meta = {
  title: "Components/Loading/Loading",
  id: 'components-loading-loading',
  component: Loading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "데이터를 불러오거나 작업을 처리 중임을 표시합니다. 진행률을 알 수 있는 작업에는 Progress를 사용합니다.",
      },
    },
  },
  args: {
    size: 'md',
    label: '무엇하는 중...',
  },
  argTypes: {
    size: { control: 'inline-radio', options: LOADING_SIZES, description: '크기', table: { defaultValue: { summary: 'md' } } },
    label: { control: 'text', description: '회전 표시 아래 글자' },
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "Playground" };

export const Small: Story = {
  name: "Small",
  args: { size: 'sm' },
};

export const SpinnerOnly: Story = {
  name: "Spinner Only",
  args: { label: undefined, 'aria-label': '불러오는 중' },
};
