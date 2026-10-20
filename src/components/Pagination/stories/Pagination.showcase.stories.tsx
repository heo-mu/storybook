import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Pagination, PaginationControl, PaginationItem } from '../Pagination';
import { PAGINATION_SIZES, type PaginationShape } from '../Pagination.options';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs pagination` (sets pagination, pagination_item, pagination_control).
const meta = {
  title: "Components/Pagination/Gallery",
  id: 'components-pagination-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const pseudo = (state: string) => (state === 'Hover' ? PSEUDO.hover : state === 'Pressed' ? PSEUDO.pressed : undefined);

export const Overview: Story = {
  name: "Overview",
  render: () => (
    <div>
      <StorySection title="Size (sm · md · lg)" direction="column">
        {PAGINATION_SIZES.map((size) => (
          <Pagination key={size} size={size} totalPages={12} defaultPage={6} aria-label={`페이지 — ${size}`} />
        ))}
      </StorySection>
      <StorySection title="Rounded" direction="column">
        <Pagination shape="rounded" size="md" totalPages={3} aria-label="페이지 — rounded" />
      </StorySection>
    </div>
  ),
};

/** 크기와 상태별 표현을 비교합니다. */
export const VariantMatrix: Story = {
  name: "Variants",
  render: () => (
    <FigmaMatrix
      columns={['pagination']}
      rows={PAGINATION_SIZES.map((size) => ({
        label: size,
        cells: [{ figma: `Size=${size}`, node: <Pagination size={size} totalPages={5} defaultPage={1} aria-label={`페이지 — ${size}`} /> }],
      }))}
    />
  ),
};

/** 항목의 크기와 상태별 표현을 비교합니다. */
export const ItemMatrix: Story = {
  name: "Items",
  render: () => (
    <FigmaMatrix
      columns={['Default', 'Hover', 'Pressed', 'Current']}
      rows={(['Square', 'Rounded'] as const).flatMap((shape) =>
        PAGINATION_SIZES.map((size) => ({
          label: `${shape} · ${size}`,
          cells: (['Default', 'Hover', 'Pressed', 'Current'] as const).map((state) => ({
            figma: `Size=${size}, Shape=${shape}, State=${state}`,
            node: <PaginationItem page={1} size={size} shape={shape.toLowerCase() as PaginationShape} current={state === 'Current'} className={pseudo(state)} />,
          })),
        })),
      )}
    />
  ),
};

/** 이전·다음 페이지 버튼의 크기와 상태를 비교합니다. */
export const ControlMatrix: Story = {
  name: "Controls",
  render: () => (
    <FigmaMatrix
      columns={['Default', 'Hover', 'Pressed', 'Disabled']}
      rows={(['Previous', 'Next'] as const).flatMap((direction) =>
        (['Square', 'Rounded'] as const).flatMap((shape) =>
          PAGINATION_SIZES.map((size) => ({
            label: `${direction} · ${shape} · ${size}`,
            cells: (['Default', 'Hover', 'Pressed', 'Disabled'] as const).map((state) => ({
              figma: `Direction=${direction}, Size=${size}, Shape=${shape}, State=${state}`,
              node: (
                <PaginationControl
                  direction={direction === 'Previous' ? 'previous' : 'next'}
                  size={size}
                  shape={shape.toLowerCase() as PaginationShape}
                  disabled={state === 'Disabled'}
                  className={pseudo(state)}
                />
              ),
            })),
          })),
        ),
      )}
    />
  ),
};

/** Items and controls in every state at size md. */
export const States: Story = {
  name: "States",
  render: () => (
    <StorySection title="Item (Default · Hover · Pressed · Current) · Control (Default · Hover · Pressed · Disabled)">
      <PaginationItem page={1} size="md" />
      <PaginationItem page={2} size="md" className={PSEUDO.hover} />
      <PaginationItem page={3} size="md" className={PSEUDO.pressed} />
      <PaginationItem page={4} size="md" current />
      <PaginationControl direction="previous" size="md" />
      <PaginationControl direction="previous" size="md" className={PSEUDO.hover} />
      <PaginationControl direction="next" size="md" className={PSEUDO.pressed} />
      <PaginationControl direction="next" size="md" disabled />
    </StorySection>
  ),
};

function Controlled() {
  const [page, setPage] = useState(1);
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Pagination totalPages={9} page={page} onPageChange={setPage} />
      <output style={{ font: '12px sans-serif' }}>페이지: {page}</output>
    </div>
  );
}

/** Page numbers, previous / next, the window follows the current page; bounds disable the controls. */
export const Interaction: Story = {
  name: "Interaction",
  render: () => <Controlled />,
  play: async ({ canvas, userEvent, step }) => {
    const prev = canvas.getByRole('button', { name: '이전 페이지' });
    const next = canvas.getByRole('button', { name: '다음 페이지' });
    await step('page 1: previous is disabled', async () => {
      await expect(prev).toBeDisabled();
      await expect(canvas.getByRole('button', { name: '1 페이지' })).toHaveAttribute('aria-current', 'page');
    });
    await step('choosing page 5 moves the window', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '5 페이지' }));
      await expect(canvas.getByText('페이지: 5')).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: '7 페이지' })).toBeInTheDocument();
    });
    await step('next until the end disables next', async () => {
      for (let i = 0; i < 4; i++) await userEvent.click(next);
      await expect(canvas.getByText('페이지: 9')).toBeInTheDocument();
      await expect(next).toBeDisabled();
    });
  },
};

/** nav landmark with labelled buttons; the current page is aria-current="page". */
export const Accessibility: Story = {
  name: "Accessibility",
  render: () => <Pagination totalPages={3} defaultPage={2} aria-label="검색 결과 페이지" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('navigation', { name: '검색 결과 페이지' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: '2 페이지' })).toHaveAttribute('aria-current', 'page');
  },
};
