import type { CSSProperties, ReactNode } from 'react';

const caption: CSSProperties = {
  font: '500 11px/16px var(--font-family-basic), sans-serif',
  // text/secondary: 4.5:1+ contrast on the page surface (text/tertiary is 3.87:1).
  color: 'var(--colors-text-secondary)',
  whiteSpace: 'nowrap',
  textAlign: 'left',
  padding: '4px 12px 4px 0',
};

/** Plain table used by the matrix / state stories. */
export function MatrixTable({ columns, rows }: { columns: string[]; rows: Array<{ label: string; cells: ReactNode[] }> }) {
  return (
    <table style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
      <thead>
        <tr>
          <td style={caption} />
          {columns.map((c) => (
            <th key={c} style={caption} scope="col">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th style={caption} scope="row">
              {row.label}
            </th>
            {row.cells.map((cell, i) => (
              <td key={i} style={{ padding: '0 16px 0 0', verticalAlign: 'middle' }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ ...caption, fontSize: 12, padding: '0 0 8px', color: 'var(--colors-text-secondary)' }}>{title}</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>{children}</div>
    </section>
  );
}
