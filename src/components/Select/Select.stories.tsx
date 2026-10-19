import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import { Select } from './Select';
import { SelectOption } from './SelectOption';
import { FIELD_MESSAGE_TYPES, FIELD_SIZES } from '../Field';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Select.showcase.stories.tsx
const meta = {
  title: 'Components/Select/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **select** (95:4740, 24 variants — State=Focus is keyboard focus) with **listbox** (97:2665), **option** (97:2286) and ' +
          '**select_message** (95:2960). Size → `size`, Label → `label`, Display Text → selected option / `placeholder`, ' +
          'Alert → `message` / `messageType`. State: Hover = :hover, Open = list open (`open` / `defaultOpen`), Completed = has ' +
          'a value, Error = `invalid`, Disabled = `disabled`, Read-only = `readOnly`. Options are `SelectOption` children ' +
          '(`id`, `disabled`, `checkIcon` = Figma option "Check Icon"). Value: `value` / `defaultValue` / `onChange` (option id). Built on react-aria-components.',
      },
    },
  },
  args: {
    label: '라벨명',
    placeholder: '내용 선택',
    size: 'sm',
    invalid: false,
    disabled: false,
    readOnly: false,
    onChange: fn(),
    onOpenChange: fn(),
    children: null,
  },
  argTypes: {
    size: { control: 'inline-radio', options: FIELD_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'sm' } } },
    label: { control: 'text', description: 'Figma "Label Text"' },
    placeholder: { control: 'text', description: 'Figma "Display Text" while empty' },
    message: { control: 'text', description: 'Figma select_message text' },
    messageType: { control: 'inline-radio', options: FIELD_MESSAGE_TYPES, description: 'Figma select_message "Type"' },
    invalid: { control: 'boolean', description: 'Figma State "Error"' },
    disabled: { control: 'boolean', description: 'Figma State "Disabled"' },
    readOnly: { control: 'boolean', description: 'Figma State "Read-only"' },
    children: { control: false },
  },
  render: (args) => (
    <Select {...args}>
      <SelectOption id="apple">사과</SelectOption>
      <SelectOption id="banana">바나나</SelectOption>
      <SelectOption id="cherry" disabled>
        체리 (품절)
      </SelectOption>
      <SelectOption id="grape">포도</SelectOption>
    </Select>
  ),
  decorators: [(Story) => <div style={{ width: 320, paddingBottom: 200 }}><Story /></div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithValue: Story = {
  args: { defaultValue: 'banana' },
};

export const WithMessage: Story = {
  args: { defaultValue: 'apple', message: '하나를 선택하세요.', messageType: 'info' },
};

export const Invalid: Story = {
  args: { invalid: true, message: '필수 항목입니다.' },
};

export const Sizes: Story = {
  args: { size: 'lg' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'grape' },
};

/** Dynamic options from data: `items` + a render function. */
export const DynamicItems: Story = {
  render: (args) => (
    <Select
      {...args}
      items={[
        { id: 'kr', name: '대한민국' },
        { id: 'jp', name: '일본' },
        { id: 'us', name: '미국' },
      ]}
    >
      {(item: { id: string; name: string }) => <SelectOption id={item.id}>{item.name}</SelectOption>}
    </Select>
  ),
};

/** Figma option "Check Icon" off: the selected option is marked by its semibold brand text only. */
export const WithoutCheckIcon: Story = {
  args: { defaultValue: 'banana' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button'));
    const selected = await within(document.body).findByRole('option', { name: '바나나' });
    await expect(selected).toHaveAttribute('aria-selected', 'true');
    await expect(selected.querySelector('.ds-option__check')).toBeNull();
    await userEvent.keyboard('{Escape}');
  },
  render: (args) => (
    <div style={{ minHeight: 200 }}>
      <Select {...args}>
        <SelectOption id="apple" checkIcon={false}>
          사과
        </SelectOption>
        <SelectOption id="banana" checkIcon={false}>
          바나나
        </SelectOption>
        <SelectOption id="grape" checkIcon={false}>
          포도
        </SelectOption>
      </Select>
    </div>
  ),
};
