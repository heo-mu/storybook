import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Accordion, AccordionItem } from './Accordion';
import { ACCORDION_SIZES } from './Accordion.options';

// 사용 예 스토리(컴포넌트 매니페스트 포함). 검증용 스토리는 ./stories/Accordion.showcase.stories.tsx에 있고 !manifest 태그.
const meta = {
  title: '컴포넌트/Accordion/Accordion',
  id: 'components-accordion-accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '제목을 눌러 내용을 펼치거나 접는 아코디언입니다. `Accordion` 안에 `AccordionItem`을 넣고, 크기는 `size`, 처음 펼칠 항목은 `defaultExpandedKeys`, 여러 개 펼침은 `allowsMultipleExpanded`로 정합니다.',
      },
    },
  },
  args: { size: 'md', allowsMultipleExpanded: false, defaultExpandedKeys: ['advanced'], onExpandedChange: fn(), children: null },
  argTypes: {
    size: { control: 'inline-radio', options: ACCORDION_SIZES, description: '크기 — 모든 항목에 적용', table: { defaultValue: { summary: 'md' } } },
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

/** 모든 Props를 직접 바꿔 볼 수 있습니다. */
export const Playground: Story = { name: '직접 체험' };

export const Small: Story = {
  name: '작은 크기',
  args: { size: 'sm' },
};

export const MultipleOpen: Story = {
  name: '여러 개 펼침',
  args: { allowsMultipleExpanded: true, defaultExpandedKeys: ['basic', 'advanced'] },
};
