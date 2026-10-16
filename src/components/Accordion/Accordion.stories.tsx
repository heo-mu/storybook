import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Accordion, AccordionItem } from './Accordion';
import { ACCORDION_SIZES } from './Accordion.options';

// Usage stories (Storybook MCP manifest). Verification stories: ./stories/Accordion.showcase.stories.tsx
const meta = {
  title: 'Components/Accordion/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma component set **accordion-item** (796:6071, 10 variants). `Accordion` > `AccordionItem` (react-aria-components ' +
          'DisclosureGroup / Disclosure). Size → `size`, Expanded → `expandedKeys` / `defaultExpandedKeys` (or `expanded` on a ' +
          'single item), Disabled → `disabled`, Title Text → `title`, Show Description → `description`, Show Divider → ' +
          '`divider`, Body → children. One item open at a time unless `allowsMultipleExpanded`.',
      },
    },
  },
  args: { size: 'md', allowsMultipleExpanded: false, defaultExpandedKeys: ['advanced'], onExpandedChange: fn(), children: null },
  argTypes: {
    size: { control: 'inline-radio', options: ACCORDION_SIZES, description: 'Figma "Size"', table: { defaultValue: { summary: 'md' } } },
    children: { control: false },
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Accordion {...args}>
        <AccordionItem id="basic" title="기본 설정">
          수집 주기와 대상 설비를 고릅니다.
        </AccordionItem>
        <AccordionItem id="advanced" title="고급 설정" description="알림과 수집 조건을 설정합니다.">
          조건을 변경하면 다음 수집 주기부터 적용됩니다. 현재 화면의 조회 결과는 변경되지 않습니다.
        </AccordionItem>
        <AccordionItem id="lab" title="실험 기능" disabled>
          준비 중입니다.
        </AccordionItem>
      </Accordion>
    </div>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const MultipleOpen: Story = {
  args: { allowsMultipleExpanded: true, defaultExpandedKeys: ['basic', 'advanced'] },
};
