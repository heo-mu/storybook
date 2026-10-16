import type { CSSProperties, ReactNode } from 'react';

const caption: CSSProperties = {
  font: '500 11px/16px var(--font-family-basic), sans-serif',
  color: 'var(--colors-text-secondary)',
  whiteSpace: 'nowrap',
  textAlign: 'left',
  padding: '4px 16px 4px 0',
  verticalAlign: 'top',
};

/**
 * Story-only grid for Variant Matrix stories. Each cell is wrapped in an element carrying
 * `data-figma="<exact Figma variant name>"` (used by scripts/verify-figma.mjs) and sized like the
 * Figma variant when `cellWidth` is given; without it the cell hugs its content (like a Figma hug layout).
 */
export function FigmaMatrix({
  columns,
  rows,
  cellWidth,
}: {
  columns: string[];
  rows: Array<{ label: string; cells: Array<{ figma: string; node: ReactNode } | null> }>;
  cellWidth?: number;
}) {
  return (
    <table style={{ borderCollapse: 'separate', borderSpacing: '0 16px' }}>
      <thead>
        <tr>
          <td style={caption} />
          {columns.map((c) => (
            <th key={c} scope="col" style={caption}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row" style={caption}>
              {row.label}
            </th>
            {row.cells.map((cell, i) => (
              <td key={i} style={{ padding: '0 24px 0 0', verticalAlign: 'top' }}>
                {cell && (
                  <div data-figma={cell.figma} style={cellWidth === undefined ? { display: 'flex', width: 'fit-content' } : { width: cellWidth }}>
                    {cell.node}
                  </div>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function StorySection({ title, children, direction = 'row' }: { title: string; children: ReactNode; direction?: 'row' | 'column' }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h3 style={{ ...caption, fontSize: 12, padding: '0 0 12px' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: direction, flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>{children}</div>
    </section>
  );
}
