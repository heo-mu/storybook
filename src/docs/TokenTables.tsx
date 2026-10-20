import type { CSSProperties } from 'react';
import tokens from '../tokens/tokens.json';

type Variable = (typeof tokens.variables)[number];

const mono: CSSProperties = { fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', fontSize: 12 };
const cell: CSSProperties = { padding: '6px 12px 6px 0', borderBottom: '1px solid var(--colors-border-gray-subtler)', verticalAlign: 'middle', textAlign: 'left' };

function Swatch({ cssVar }: { cssVar: string }) {
  return (
    <span
      style={{ display: 'inline-block', width: 28, height: 28, borderRadius: 4, background: `var(${cssVar})`, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }}
    />
  );
}

/** Variables of one collection, optionally filtered by name prefix. */
export function VariableTable({ collection, prefix }: { collection: string; prefix?: string }) {
  const list = tokens.variables.filter((v) => v.collection === collection && (!prefix || v.name.startsWith(prefix)));
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={cell} />
          <th style={cell}>Figma 변수</th>
          <th style={cell}>CSS 변수</th>
          <th style={cell}>값</th>
          <th style={cell}>실제 값</th>
        </tr>
      </thead>
      <tbody>
        {list.map((v: Variable) => (
          <tr key={v.cssVar}>
            <td style={cell}>{v.type === 'color' ? <Swatch cssVar={v.cssVar} /> : null}</td>
            <td style={{ ...cell, ...mono }}>{v.name}</td>
            <td style={{ ...cell, ...mono }}>{v.cssVar}</td>
            <td style={{ ...cell, ...mono }}>{v.aliasOf ?? v.value}</td>
            <td style={{ ...cell, ...mono }}>{v.resolved}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Primitive colour ramps as swatch rows. */
export function PrimitivePalette() {
  const colors = tokens.variables.filter((v) => v.collection === 'Primitive' && v.type === 'color');
  const groups = new Map<string, Variable[]>();
  for (const v of colors) {
    const key = v.name.split('/').slice(0, -1).join('/') || v.name;
    groups.set(key, [...(groups.get(key) ?? []), v]);
  }
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {[...groups].map(([group, list]) => (
        <div key={group}>
          <div style={{ ...mono, marginBottom: 4 }}>{group}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {list.map((v) => (
              <div key={v.cssVar} title={`${v.name} ${v.resolved}`} style={{ width: 56 }}>
                <div style={{ height: 32, borderRadius: 4, background: `var(${v.cssVar})`, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }} />
                <div style={{ ...mono, fontSize: 10 }}>{v.name.split('/').pop()}</div>
                <div style={{ ...mono, fontSize: 10, color: 'var(--colors-text-tertiary)' }}>{v.resolved}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** One sample line per Figma text style, rendered with the generated utility class. */
export function TextStyleTable() {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <tbody>
        {tokens.textStyles.map((s) => (
          <tr key={s.name}>
            <td style={{ ...cell, ...mono, whiteSpace: 'nowrap' }}>{s.name}</td>
            <td style={cell}>
              <span className={s.className}>디자인 시스템 Aa 123</span>
            </td>
            <td style={{ ...cell, ...mono }}>
              {s.font} · {Object.values(s.props).slice(1, 5).join(' · ')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Effect styles previewed as box-shadows. */
export function EffectStyleTable() {
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {tokens.effectStyles.map((e) => (
        <div key={e.name} style={{ textAlign: 'center' }}>
          <div style={{ width: 96, height: 64, borderRadius: 8, background: 'var(--colors-surface-page)', boxShadow: `var(${e.cssVar})` }} />
          <div style={{ ...mono, marginTop: 8 }}>{e.cssVar}</div>
          <div style={{ ...mono, fontSize: 10, color: 'var(--colors-text-tertiary)' }}>{e.value}</div>
        </div>
      ))}
    </div>
  );
}
