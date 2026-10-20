import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within, type Mock } from 'storybook/test';
import { Dialog } from '../Dialog';
import { Button } from '../../Button';

// Visual verification (not in the MCP manifest). The open dialog carries the data-figma name checked by
// `node scripts/verify-figma.mjs dialog` (single component `dialog`).
const meta = {
  title: '컴포넌트/Dialog/전체 보기',
  id: 'components-dialog-showcase',
  tags: ['!manifest'],
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Figma `dialog` with its default content, open. */
export const Figma: Story = {
  name: '모든 변형',
  render: () => (
    <div style={{ height: 400 }}>
      <Dialog
        open
        data-figma="dialog"
        title="무엇을 하시겠어요?"
        description="무엇을 안내해 주세요."
        actions={
          <>
            <Button variant="tertiary" appearance="solid" size="lg">
              취소
            </Button>
            <Button size="lg">사용자 행동</Button>
          </>
        }
      />
    </div>
  ),
};

/** Opening moves focus into the dialog, Tab stays inside, Escape closes and focus returns to the trigger. */
export const Interaction: StoryObj<{ onConfirm: Mock<() => void> }> = {
  name: '동작',
  args: { onConfirm: fn() },
  render: (args) => (
    <div style={{ padding: 24, height: 400 }}>
      <Dialog
        trigger={<Button>삭제</Button>}
        role="alertdialog"
        title="파일을 삭제할까요?"
        description="삭제한 파일은 되돌릴 수 없습니다."
        actions={(close) => (
          <>
            <Button variant="tertiary" appearance="solid" size="lg" onClick={close}>
              취소
            </Button>
            <Button
              size="lg"
              onClick={() => {
                args.onConfirm();
                close();
              }}
            >
              삭제
            </Button>
          </>
        )}
      />
    </div>
  ),
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: '삭제' });
    await step('the trigger opens the dialog and focus moves into it', async () => {
      await userEvent.click(trigger);
      const dialog = await body.findByRole('alertdialog', { name: '파일을 삭제할까요?' });
      await expect(dialog).toHaveAccessibleDescription('삭제한 파일은 되돌릴 수 없습니다.');
      await waitFor(() => expect(dialog.contains(canvasElement.ownerDocument.activeElement)).toBe(true));
    });
    await step('the modal backdrop is colors/dialog/scrim/default (black 50%, Design System Rules 05)', async () => {
      const overlay = canvasElement.ownerDocument.querySelector('.ds-dialog-overlay')!;
      const token = getComputedStyle(canvasElement.ownerDocument.documentElement).getPropertyValue('--colors-dialog-scrim-default').trim();
      await expect(token).toBe('#00000080');
      await expect(getComputedStyle(overlay).backgroundColor).toBe('rgba(0, 0, 0, 0.5)');
    });
    await step('Tab stays inside the dialog', async () => {
      const dialog = body.getByRole('alertdialog');
      for (let i = 0; i < 4; i++) {
        await userEvent.tab();
        await expect(dialog.contains(canvasElement.ownerDocument.activeElement)).toBe(true);
      }
    });
    await step('Escape closes it and focus returns to the trigger', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
    });
    await step('the confirm button runs its action and closes the dialog', async () => {
      await userEvent.click(trigger);
      const dialog = await body.findByRole('alertdialog');
      await userEvent.click(within(dialog).getByRole('button', { name: '삭제' }));
      await expect(args.onConfirm).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument());
    });
  },
};
