import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Tab, TabList, TabPanel, Tabs } from '../Tabs';
import { TABS_SIZES, type TabsAppearance, type TabsShape, type TabsSize, type TabsVariant } from '../Tabs.options';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs tabs` (sets tab_filled, tab_line).
const meta = {
  title: "Components/Tabs/Gallery",
  id: 'components-tabs-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const STATES = ['Default', 'Hover', 'Pressed', 'Selected', 'Disabled'] as const;
type State = (typeof STATES)[number];

/** One tab in a Figma state (a hidden second tab holds the selection when the cell is not Selected). */
function FigmaTab({ appearance, variant, size, shape, state }: { appearance: TabsAppearance; variant: TabsVariant; size: TabsSize; shape?: TabsShape; state: State }) {
  return (
    <Tabs appearance={appearance} variant={variant} size={size} shape={shape} defaultSelectedKey={state === 'Selected' ? 'tab' : 'other'}>
      <TabList aria-label={`${variant} ${size} ${state}`}>
        <Tab id="tab" disabled={state === 'Disabled'} className={state === 'Hover' ? PSEUDO.hover : state === 'Pressed' ? PSEUDO.pressed : undefined}>
          라벨명
        </Tab>
        <Tab id="other" style={{ display: 'none' }}>
          -
        </Tab>
      </TabList>
      {/* Panels exist so aria-controls resolves; hidden — the cell shows the tab only. */}
      <TabPanel id="tab" style={{ display: 'none' }}>
        -
      </TabPanel>
      <TabPanel id="other" style={{ display: 'none' }}>
        -
      </TabPanel>
    </Tabs>
  );
}

export const Overview: Story = {
  name: "Overview",
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {(['line', 'filled'] as const).map((appearance) => (
        <Tabs key={appearance} appearance={appearance} defaultSelectedKey="all">
          <TabList aria-label={`${appearance} 탭`}>
            <Tab id="all">전체</Tab>
            <Tab id="open">진행 중</Tab>
            <Tab id="done">완료</Tab>
            <Tab id="hold" disabled>
              보류
            </Tab>
          </TabList>
          <TabPanel id="all">전체 목록</TabPanel>
          <TabPanel id="open">진행 중 목록</TabPanel>
          <TabPanel id="done">완료 목록</TabPanel>
          <TabPanel id="hold">보류 목록</TabPanel>
        </Tabs>
      ))}
      <Tabs appearance="filled" shape="rounded" variant="secondary" size="md" defaultSelectedKey="w">
        <TabList aria-label="기간">
          <Tab id="d">일간</Tab>
          <Tab id="w">주간</Tab>
          <Tab id="m">월간</Tab>
        </TabList>
        <TabPanel id="d">일간 데이터</TabPanel>
        <TabPanel id="w">주간 데이터</TabPanel>
        <TabPanel id="m">월간 데이터</TabPanel>
      </Tabs>
    </div>
  ),
};

/** 배경으로 선택 상태를 구분하는 탭입니다. */
export const FilledMatrix: Story = {
  name: "Filled",
  render: () => (
    <FigmaMatrix
      columns={[...STATES]}
      rows={(['Square', 'Rounded'] as const).flatMap((shape) =>
        (['Primary', 'Secondary'] as const).flatMap((variant) =>
          TABS_SIZES.map((size) => ({
            label: `${variant} · ${shape} · ${size}`,
            cells: STATES.map((state) => ({
              figma: `Variant=${variant}, Size=${size}, Shape=${shape}, State=${state}`,
              node: <FigmaTab appearance="filled" variant={variant.toLowerCase() as TabsVariant} size={size} shape={shape.toLowerCase() as TabsShape} state={state} />,
            })),
          })),
        ),
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(60);
  },
};

/** 밑줄로 선택 상태를 구분하는 탭입니다. */
export const LineMatrix: Story = {
  name: "Line",
  render: () => (
    <FigmaMatrix
      columns={[...STATES]}
      rows={(['Primary', 'Secondary'] as const).flatMap((variant) =>
        TABS_SIZES.map((size) => ({
          label: `${variant} · ${size}`,
          cells: STATES.map((state) => ({
            figma: `Variant=${variant}, Size=${size}, State=${state}`,
            node: <FigmaTab appearance="line" variant={variant.toLowerCase() as TabsVariant} size={size} state={state} />,
          })),
        })),
      )}
    />
  ),
};

/** Every state, both appearances, size md. */
export const States: Story = {
  name: "States",
  render: () => (
    <div>
      {(['line', 'filled'] as const).map((appearance) => (
        <StorySection key={appearance} title={appearance}>
          {STATES.map((state) => (
            <FigmaTab key={state} appearance={appearance} variant="primary" size="md" state={state} />
          ))}
        </StorySection>
      ))}
    </div>
  ),
};

/** Arrow keys move and select (automatic activation), disabled tabs are skipped, panels follow. */
export const Interaction: Story = {
  name: "Interaction",
  render: () => (
    <Tabs defaultSelectedKey="a">
      <TabList aria-label="섹션">
        <Tab id="a">개요</Tab>
        <Tab id="b" disabled>
          설정
        </Tab>
        <Tab id="c">기록</Tab>
      </TabList>
      <TabPanel id="a">개요 내용</TabPanel>
      <TabPanel id="b">설정 내용</TabPanel>
      <TabPanel id="c">기록 내용</TabPanel>
    </Tabs>
  ),
  play: async ({ canvas, userEvent, step }) => {
    await step('click selects', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: '기록' }));
      await expect(canvas.getByRole('tab', { name: '기록' })).toHaveAttribute('aria-selected', 'true');
      await expect(canvas.getByRole('tabpanel')).toHaveTextContent('기록 내용');
    });
    await step('ArrowLeft skips the disabled tab', async () => {
      await userEvent.keyboard('{ArrowLeft}');
      await expect(canvas.getByRole('tab', { name: '개요' })).toHaveAttribute('aria-selected', 'true');
      await expect(canvas.getByRole('tabpanel')).toHaveTextContent('개요 내용');
    });
  },
};

/** tablist / tab / tabpanel with aria-controls and labelled panels. */
export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <Tabs defaultSelectedKey="x">
      <TabList aria-label="보기">
        <Tab id="x">목록</Tab>
        <Tab id="y">카드</Tab>
      </TabList>
      <TabPanel id="x">목록 보기</TabPanel>
      <TabPanel id="y">카드 보기</TabPanel>
    </Tabs>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('tablist', { name: '보기' })).toBeInTheDocument();
    const tab = canvas.getByRole('tab', { name: '목록' });
    const panel = canvas.getByRole('tabpanel', { name: '목록' });
    await expect(tab).toHaveAttribute('aria-controls', panel.id);
  },
};
