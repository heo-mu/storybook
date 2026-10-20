import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { SegmentedControl } from '../SegmentedControl';
import { SegmentedControlItem } from '../SegmentedControlItem';
import { SEGMENTED_CONTROL_SIZES } from '../SegmentedControl.options';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs segmented-control` (sets segmented-control, segmented-item).
const meta = {
  title: '컴포넌트/SegmentedControl/전체 보기',
  id: 'components-segmentedcontrol-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const ITEMS = ['a', 'b', 'c', 'd'];

export const Overview: Story = {
  name: '개요',
  render: () => (
    <div>
      <StorySection title="Size (md · sm · xs)" direction="column">
        {SEGMENTED_CONTROL_SIZES.map((size) => (
          <SegmentedControl key={size} size={size} aria-label={`기간 ${size}`} defaultValue="week">
            <SegmentedControlItem value="day">일간</SegmentedControlItem>
            <SegmentedControlItem value="week">주간</SegmentedControlItem>
            <SegmentedControlItem value="month">월간</SegmentedControlItem>
          </SegmentedControl>
        ))}
      </StorySection>
      <StorySection title="Fixed width · Disabled" direction="column">
        <SegmentedControl aria-label="보기" defaultValue="list" style={{ width: 316 }}>
          <SegmentedControlItem value="list">목록</SegmentedControlItem>
          <SegmentedControlItem value="card">카드</SegmentedControlItem>
          <SegmentedControlItem value="map" disabled>
            지도
          </SegmentedControlItem>
        </SegmentedControl>
        <SegmentedControl aria-label="비활성" defaultValue="a" disabled>
          <SegmentedControlItem value="a">켜기</SegmentedControlItem>
          <SegmentedControlItem value="b">끄기</SegmentedControlItem>
        </SegmentedControl>
      </StorySection>
    </div>
  ),
};

/** Figma `segmented-control` (md · sm · xs): 316px wide, four items, the first selected. */
export const VariantMatrix: Story = {
  name: '모든 변형',
  render: () => (
    <FigmaMatrix
      cellWidth={316}
      columns={['segmented-control']}
      rows={SEGMENTED_CONTROL_SIZES.map((size) => ({
        label: size,
        cells: [
          {
            figma: `Size=${size}`,
            node: (
              <SegmentedControl size={size} aria-label={`segmented ${size}`} defaultValue="a" style={{ width: '100%' }}>
                {ITEMS.map((v) => (
                  <SegmentedControlItem key={v} value={v}>
                    텍스트
                  </SegmentedControlItem>
                ))}
              </SegmentedControl>
            ),
          },
        ],
      }))}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(3);
  },
};

const ITEM_VARIANTS = [
  ['Selected', 'Default'],
  ['Selected', 'Disabled'],
  ['Unselected', 'Default'],
  ['Unselected', 'Hover'],
  ['Unselected', 'Pressed'],
  ['Unselected', 'Disabled'],
] as const;

/**
 * Figma `segmented-item` (18): each item on its own (the control's padding and background are removed
 * in this story so the item is compared as in the Figma set).
 */
export const ItemMatrix: Story = {
  name: '항목 모든 변형',
  render: () => (
    <div className="segmented-item-matrix">
      <style>{'.segmented-item-matrix .ds-segmented { padding: 0; background: none; }'}</style>
      <FigmaMatrix
        columns={ITEM_VARIANTS.map(([v, s]) => `${v} · ${s}`)}
        rows={SEGMENTED_CONTROL_SIZES.map((size) => ({
          label: size,
          cells: ITEM_VARIANTS.map(([variant, state]) => ({
            figma: `Variant=${variant}, Size=${size}, State=${state}`,
            node: (
              <SegmentedControl size={size} aria-label={`${variant} ${size} ${state}`} defaultValue={variant === 'Selected' ? 'x' : null}>
                <SegmentedControlItem
                  value="x"
                  disabled={state === 'Disabled'}
                  className={state === 'Hover' ? PSEUDO.hover : state === 'Pressed' ? PSEUDO.pressed : undefined}
                >
                  텍스트
                </SegmentedControlItem>
              </SegmentedControl>
            ),
          })),
        }))}
      />
    </div>
  ),
};

/** Unselected Hover / Pressed, Selected and Disabled at size md. */
export const States: Story = {
  name: '상태별 보기',
  render: () => (
    <StorySection title="State" direction="column">
      <SegmentedControl aria-label="상태" defaultValue="selected">
        <SegmentedControlItem value="selected">선택</SegmentedControlItem>
        <SegmentedControlItem value="default">기본</SegmentedControlItem>
        <SegmentedControlItem value="hover" className={PSEUDO.hover}>Hover</SegmentedControlItem>
        <SegmentedControlItem value="pressed" className={PSEUDO.pressed}>Pressed</SegmentedControlItem>
        <SegmentedControlItem value="disabled" disabled>비활성</SegmentedControlItem>
      </SegmentedControl>
    </StorySection>
  ),
};

function Controlled() {
  const [value, setValue] = useState('week');
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <SegmentedControl aria-label="기간" value={value} onChange={setValue} name="period">
        <SegmentedControlItem value="day">일간</SegmentedControlItem>
        <SegmentedControlItem value="week">주간</SegmentedControlItem>
        <SegmentedControlItem value="month" disabled>
          월간
        </SegmentedControlItem>
        <SegmentedControlItem value="year">연간</SegmentedControlItem>
      </SegmentedControl>
      <output style={{ font: '12px sans-serif' }}>선택: {value}</output>
    </div>
  );
}

/** Click selects; arrow keys move the selection and skip disabled items. */
export const Interaction: Story = {
  name: '동작',
  render: () => <Controlled />,
  play: async ({ canvas, userEvent, step }) => {
    await step('click selects', async () => {
      await userEvent.click(canvas.getByText('일간'));
      await expect(canvas.getByRole('radio', { name: '일간' })).toBeChecked();
      await expect(canvas.getByText('선택: day')).toBeInTheDocument();
    });
    await step('arrow keys move the selection, skipping the disabled item', async () => {
      canvas.getByRole('radio', { name: '일간' }).focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(canvas.getByText('선택: week')).toBeInTheDocument();
      await userEvent.keyboard('{ArrowRight}');
      await expect(canvas.getByText('선택: year')).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: '연간' })).toHaveFocus();
    });
  },
};

/** role="radiogroup" with a name; each segment is a radio named by its label. */
export const Accessibility: Story = {
  name: '접근성',
  render: () => (
    <SegmentedControl aria-label="정렬" defaultValue="new">
      <SegmentedControlItem value="new">최신순</SegmentedControlItem>
      <SegmentedControlItem value="popular">인기순</SegmentedControlItem>
    </SegmentedControl>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radiogroup', { name: '정렬' })).toBeInTheDocument();
    await expect(canvas.getByRole('radio', { name: '최신순' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: '인기순' })).not.toBeChecked();
  },
};

/**
 * Narrow segments (the Figma dashboard filter bar: 220px, sm): a label wider than the content box runs into the
 * segment's padding like in Figma; only a label wider than the whole segment is truncated.
 */
export const LabelOverflow: Story = {
  name: '긴 라벨',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <SegmentedControl data-testid="fits" size="sm" aria-label="조회 기간" defaultValue="7d" style={{ width: 220 }}>
        <SegmentedControlItem value="today">오늘</SegmentedControlItem>
        <SegmentedControlItem value="7d">최근 7일</SegmentedControlItem>
        <SegmentedControlItem value="30d">최근 30일</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl data-testid="long" size="sm" aria-label="긴 라벨" defaultValue="a" style={{ width: 220 }}>
        <SegmentedControlItem value="a">오늘</SegmentedControlItem>
        <SegmentedControlItem value="b">지난 분기 전체 기간</SegmentedControlItem>
      </SegmentedControl>
    </div>
  ),
  play: async ({ canvas }) => {
    const label = (root: HTMLElement, text: string) => [...root.querySelectorAll<HTMLElement>('.ds-segmented__label')].find((l) => l.textContent === text)!;
    const fits = label(canvas.getByTestId('fits'), '최근 30일');
    await expect(fits.scrollWidth).toBeLessThanOrEqual(fits.clientWidth);
    const segment = fits.closest('.ds-segmented__segment')!.getBoundingClientRect();
    const box = fits.getBoundingClientRect();
    await expect(box.left).toBeGreaterThanOrEqual(segment.left);
    await expect(box.right).toBeLessThanOrEqual(segment.right);
    const long = label(canvas.getByTestId('long'), '지난 분기 전체 기간');
    await expect(long.scrollWidth).toBeGreaterThan(long.clientWidth);
    await expect(long.getBoundingClientRect().width).toBeLessThanOrEqual(long.closest('.ds-segmented__segment')!.getBoundingClientRect().width + 0.5);
  },
};
