import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Dialog } from './Dialog';
import { Button } from '../Button';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Dialog.showcase.stories.tsx
const meta = {
  title: 'Components/Dialog/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component **dialog** (149:2838): a modal panel. `title`, `description`, `actions` (the footer buttons — Figma ' +
          'uses Button Tertiary · Solid · lg and Primary · Solid · lg; a function receives `close`). Open it with `trigger` or ' +
          '`open` / `onOpenChange`. Focus moves into the dialog, stays inside and returns to the trigger; Escape closes ' +
          '(react-aria-components Modal + Dialog).',
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
          사용자 행동
        </Button>
      </>
    ),
  },
  argTypes: { trigger: { control: false }, actions: { control: false }, children: { control: false } },
  decorators: [(Story) => <div style={{ minHeight: 320 }}>{Story()}</div>],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** A confirmation that interrupts the user (role="alertdialog"). */
export const Confirm: Story = {
  args: { role: 'alertdialog', title: '파일을 삭제할까요?', description: '삭제한 파일은 되돌릴 수 없습니다.', trigger: <Button>삭제</Button> },
};

/** Content between the header and the buttons (Design System Rules 08: the same m-8 gap — not a part of the Figma component). */
export const WithContent: Story = {
  args: { children: <p style={{ margin: 0, textAlign: 'center' }}>추가 안내 내용</p> },
};
