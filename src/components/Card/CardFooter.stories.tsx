import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { CardFooter } from './Card';
import { Button } from '../Button';

const onConfirm = fn();
const meta = {
  title: 'Components/Card/CardFooter',
  component: CardFooter,
  tags: ['autodocs'],
  args: { layout: 'vertical', style: { width: 320 } },
  argTypes: { layout: { control: 'inline-radio', options: ['vertical', 'horizontal'] } },
  render: (args) => (
    <CardFooter {...args}>
      <Button size="md" onClick={onConfirm}>확인</Button>
      <Button size="md" variant="tertiary" appearance="outline">취소</Button>
    </CardFooter>
  ),
} satisfies Meta<typeof CardFooter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {};
export const Horizontal: Story = {
  args: { layout: 'horizontal' },
  play: async ({ canvas }) => {
    const confirm = canvas.getByRole('button', { name: '확인' });
    const cancel = canvas.getByRole('button', { name: '취소' });
    const first = confirm.getBoundingClientRect();
    const second = cancel.getBoundingClientRect();
    await expect(first.y).toBe(second.y);
    await expect(first.width).toBe(second.width);
    await expect(second.x - first.right).toBe(8);
    await userEvent.click(confirm);
    await expect(onConfirm).toHaveBeenCalledTimes(1);
  },
};
export const Single: Story = {
  render: (args) => <CardFooter {...args}><Button size="md">확인</Button></CardFooter>,
};
