import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Dialog } from './Dialog';
import { Button } from '../Button';

// 사용 예 스토리(컴포넌트 매니페스트 포함). 검증용 스토리는 ./stories/Dialog.showcase.stories.tsx에 있고 !manifest 태그.
const meta = {
  title: "Components/Dialog/Dialog",
  id: 'components-dialog-dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "사용자의 확인이나 선택이 필요할 때 여는 모달 대화상자입니다. 열린 동안 배경 화면의 조작을 제한합니다.",
      },
    },
  },
  args: {
    title: '무엇을 하시겠어요?',
    description: '무엇을 안내해 주세요.',
    trigger: <Button>대화상자 열기</Button>,
    onOpenChange: fn(),
    actions: (close: () => void) => (
      <>
        <Button variant="tertiary" appearance="solid" size="lg" onClick={close}>
          취소
        </Button>
        <Button size="lg" onClick={close}>
          확인
        </Button>
      </>
    ),
  },
  argTypes: { trigger: { control: false }, actions: { control: false }, children: { control: false } },
  decorators: [(Story) => <div style={{ minHeight: 320 }}>{Story()}</div>],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 모든 Props를 직접 바꿔 볼 수 있습니다. 버튼을 눌러 대화상자를 열어 보세요. */
export const Playground: Story = { name: "Playground" };

/** 삭제처럼 사용자의 흐름을 멈추고 확인받는 대화상자입니다(`role="alertdialog"`). */
export const Confirm: Story = {
  name: '확인 대화상자',
  args: { role: 'alertdialog', title: '파일을 삭제할까요?', description: '삭제한 파일은 되돌릴 수 없습니다.', trigger: <Button>삭제</Button> },
};

/** 제목과 버튼 사이에 내용을 넣은 예입니다. */
export const WithContent: Story = {
  name: "본문 콘텐츠",
  args: { children: <p style={{ margin: 0, textAlign: 'center' }}>추가 안내 내용</p> },
};
