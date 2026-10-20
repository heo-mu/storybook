import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading } from './Loading';
import { LOADING_SIZES } from './Loading.options';

// 사용 예 스토리(매니페스트 포함). 검증용 스토리는 FileUploader/stories(LoadingMatrix)에 있습니다.
const meta = {
  title: '컴포넌트/Loading/Loading',
  id: 'components-loading-loading',
  component: Loading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '불러오거나 처리하는 중임을 알리는 회전 표시입니다. 크기는 `size`로 고르고, 아래 글자는 `label`로 붙입니다. 글자가 없으면 `aria-label`로 이름을 붙입니다.',
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

export const Playground: Story = { name: '직접 체험' };

export const Small: Story = {
  name: '작은 크기',
  args: { size: 'sm' },
};

export const SpinnerOnly: Story = {
  name: '스피너만',
  args: { label: undefined, 'aria-label': '불러오는 중' },
};
