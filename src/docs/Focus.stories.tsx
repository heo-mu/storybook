import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Accordion, AccordionItem } from '../components/Accordion';
import { BreadcrumbItem } from '../components/Breadcrumb';
import { Button, IconButton, TextButton } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { Chip } from '../components/Chip';
import { Link } from '../components/Link';
import { NavLink, Navigation } from '../components/Navigation';
import { Radio } from '../components/Radio';
import { Select, SelectOption } from '../components/Select';
import { Slider } from '../components/Slider';
import { Switch } from '../components/Switch';
import { Tab, TabList, TabPanel, Tabs } from '../components/Tabs';
import { PlusIcon } from '../icons';

// Design System Rules 02 · Focus (Figma component property "Focus", token colors/border/focus).
const meta = {
  title: 'Foundations/Focus',
  tags: ['!manifest'],
  parameters: {
    controls: { disable: true },
    pseudo: { focusVisible: ['[data-pseudo="focus"]'] },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const focus = { 'data-pseudo': 'focus' } as const;
const row = { display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', padding: 8 } as const;

/**
 * The keyboard focus ring (`:focus-visible`, Figma "Focus" = true): 2px `colors/border/focus` 2px outside the control,
 * following its corners. Full-width rows (navigation, accordion, table) draw it inside their edge. Text fields and
 * Select show focus with their border (Figma State=Focus). Shown here with storybook-addon-pseudo-states.
 */
export const Rings: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={row}>
        <Button {...focus}>라벨명</Button>
        <Button {...focus} variant="secondary" appearance="outline" shape="rounded">
          라벨명
        </Button>
        <IconButton {...focus} icon={<PlusIcon />} aria-label="추가" />
        <TextButton {...focus}>라벨명</TextButton>
      </div>
      <div style={row}>
        <Checkbox {...focus} label="체크박스" />
        <Radio {...focus} label="라디오" value="a" />
        <Switch {...focus} label="스위치" />
        <Chip {...focus}>칩</Chip>
        <Link {...focus} href="#focus">
          링크
        </Link>
        <BreadcrumbItem {...focus} href="#focus">
          상위 경로
        </BreadcrumbItem>
      </div>
      <div style={{ width: 240 }}>
        <Navigation aria-label="메뉴">
          <NavLink {...focus} href="#focus">
            대시보드
          </NavLink>
        </Navigation>
      </div>
    </div>
  ),
};

const ring = (el: Element) => {
  const s = getComputedStyle(el);
  return { width: s.outlineWidth, style: s.outlineStyle, color: s.outlineColor, offset: s.outlineOffset };
};
const focusColor = () => {
  const probe = document.createElement('i');
  probe.style.color = 'var(--colors-border-focus)';
  document.body.append(probe);
  const c = getComputedStyle(probe).color;
  probe.remove();
  return c;
};

/** Tab through real controls: each focused control shows the same ring (react-aria controls through data-focus-visible). */
export const Keyboard: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, width: 360 }}>
      <div style={row}>
        <Button>버튼</Button>
        <Checkbox label="체크박스" />
        <Switch label="스위치" />
      </div>
      <Tabs>
        <TabList aria-label="탭">
          <Tab id="a">전체</Tab>
          <Tab id="b">진행 중</Tab>
        </TabList>
        <TabPanel id="a">
          <Button>패널 버튼</Button>
        </TabPanel>
        <TabPanel id="b">진행 중 목록</TabPanel>
      </Tabs>
      <Select label="선택" placeholder="내용 선택">
        <SelectOption id="a">사과</SelectOption>
      </Select>
      <Slider aria-label="인원" defaultValue={50} showInput={false} />
      <Accordion>
        <AccordionItem id="x" title="설정">
          내용
        </AccordionItem>
      </Accordion>
    </div>
  ),
  play: async ({ canvasElement, userEvent, step }) => {
    const blue = focusColor();
    const expectRing = (el: Element | null, offset: string) => {
      if (!el) throw new Error('no element');
      expect(ring(el)).toEqual({ width: '2px', style: 'solid', color: blue, offset });
    };
    await step('button, checkbox, switch: 2px outside', async () => {
      await userEvent.tab();
      expectRing(document.activeElement, '2px');
      await userEvent.tab();
      expectRing(document.activeElement, '2px');
      await userEvent.tab();
      expectRing(document.activeElement, '2px');
    });
    await step('tab (react-aria): data-focus-visible ring', async () => {
      await userEvent.tab();
      expectRing(canvasElement.querySelector('.ds-tab[data-focus-visible]'), '2px');
    });
    await step('select: the focus border (no ring), Figma State=Focus', async () => {
      await userEvent.tab(); // button inside the panel
      await userEvent.tab();
      const select = canvasElement.querySelector('.ds-select');
      await expect(select).toHaveAttribute('data-focus-visible');
      const border = getComputedStyle(select!).getPropertyValue('--ds-field-border-color').trim();
      const focusBorder = getComputedStyle(document.documentElement).getPropertyValue('--colors-select-outline-outline-border-focus').trim();
      await expect(border).toBe(focusBorder);
    });
    await step('slider handle: ring 1px from the 20px thumb (2px from the knob)', async () => {
      await userEvent.tab();
      expectRing(canvasElement.querySelector('.ds-slider__thumb[data-focus-visible]'), '1px');
    });
    await step('accordion trigger: ring inside the row edge', async () => {
      await userEvent.tab();
      expectRing(canvasElement.querySelector('.ds-accordion__trigger[data-focus-visible]'), '-2px');
    });
  },
};
