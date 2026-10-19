import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { BUTTON_STATES } from '../Button.options';
import { CaretLeftIcon, CaretRightIcon, PlusIcon } from './figma-icons';
import { MatrixTable } from './StoryLayout';
import { PSEUDO_PARAMETERS, figmaCase, stateProps } from './story-helpers';

// Before / after of the Tertiary / Solid background (Figma 2026-10-19): the old palette is the Semantic surface
// tokens the Component variables used before (surface/container-subtle · container · overlay, still in Figma),
// the new one is colors/fill/tertiary/*. Story-only comparison — the component itself always uses the new tokens.
const meta = {
  title: 'Components/Button/Tertiary Background',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const BEFORE = {
  '--ds-button-bg-default': 'var(--colors-surface-container-subtle)',
  '--ds-button-bg-hover': 'var(--colors-surface-container)',
  '--ds-button-bg-pressed': 'var(--colors-surface-overlay)',
} as CSSProperties;

const SWATCHES = [
  { state: 'Default', before: ['surface/container-subtle', 'gray/75', '#f5f6f7', '1.06'], after: ['fill/tertiary/default', 'gray/150', '#e9ebee', '1.17'] },
  { state: 'Hover', before: ['surface/container', 'gray/100', '#eff0f3', '1.12'], after: ['fill/tertiary/hover', 'gray/225', '#dcdfe4', '1.31'] },
  { state: 'Pressed', before: ['surface/overlay', 'gray/150', '#e9ebee', '1.17'], after: ['fill/tertiary/pressed', 'gray/275', '#d0d4db', '1.46'] },
];

const cell: CSSProperties = { font: '400 12px/16px var(--font-family-basic), sans-serif', color: 'var(--colors-text-secondary)', padding: '4px 16px 4px 0', textAlign: 'left', whiteSpace: 'nowrap' };
const chip = (token: string): CSSProperties => ({ display: 'inline-block', width: 40, height: 24, borderRadius: 4, background: `var(--colors-${token.replace(/\//g, '-')})`, verticalAlign: 'middle', marginRight: 8 });

function Row({ label, style, id }: { label: string; style?: CSSProperties; id: string }) {
  return (
    <MatrixTable
      columns={BUTTON_STATES.map(figmaCase)}
      rows={[
        {
          label: `${label} · Button`,
          cells: BUTTON_STATES.map((state) => (
            <Button key={state} variant="tertiary" appearance="solid" size="md" style={style} data-testid={`${id}-${state}`} {...stateProps(state)} leftIcon={<CaretLeftIcon />} rightIcon={<CaretRightIcon />}>
              라벨명
            </Button>
          )),
        },
        {
          label: `${label} · IconButton`,
          cells: BUTTON_STATES.map((state) => (
            <IconButton key={state} variant="tertiary" appearance="solid" size="md" style={style} icon={<PlusIcon />} aria-label="추가" {...stateProps(state)} />
          )),
        },
      ]}
    />
  );
}

/** Tertiary / Solid on the page surface (#fdfdfd): before and after the Figma change, with the token values and their contrast to the page. */
export const BeforeAfter: Story = {
  name: 'Before / After',
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Row label="이전" style={BEFORE} id="before" />
      <Row label="현재" id="after" />
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['State', '이전 토큰', '값', '대비(page)', '현재 토큰', '값', '대비(page)'].map((h, i) => (
              <th key={i} style={{ ...cell, fontWeight: 500 }} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SWATCHES.map((s) => (
            <tr key={s.state}>
              <th style={{ ...cell, fontWeight: 500 }} scope="row">
                {s.state}
              </th>
              <td style={cell}>
                <span style={chip(`${s.before[0].startsWith('surface') ? 'surface/' + s.before[0].split('/')[1] : s.before[0]}`)} />
                {s.before[0]} → {s.before[1]}
              </td>
              <td style={cell}>{s.before[2]}</td>
              <td style={cell}>{s.before[3]}:1</td>
              <td style={cell}>
                <span style={chip(s.after[0])} />
                {s.after[0]} → {s.after[1]}
              </td>
              <td style={cell}>{s.after[2]}</td>
              <td style={cell}>{s.after[3]}:1</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  // Pseudo-state classes only apply in the Storybook UI and play events are synthetic (no CSS :hover / :active), so
  // Hover / Pressed are checked on the resolved palette slots; real-pointer colours are covered by `npm run verify:button`.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const style = (id: string) => getComputedStyle(canvas.getByTestId(id));
    const slot = (id: string, name: string) => style(id).getPropertyValue(name).trim().toLowerCase();
    await expect(style('after-default').backgroundColor).toBe('rgb(233, 235, 238)'); // fill/tertiary/default = gray/150 #e9ebee
    await expect(slot('after-default', '--ds-button-bg-hover')).toBe('#dcdfe4'); // fill/tertiary/hover = gray/225
    await expect(slot('after-default', '--ds-button-bg-pressed')).toBe('#d0d4db'); // fill/tertiary/pressed = gray/275
    await expect(style('after-disabled').backgroundColor).toBe('rgb(214, 218, 224)'); // Disabled unchanged: fill/disabled #d6dae0
    await expect(style('before-default').backgroundColor).toBe('rgb(245, 246, 247)'); // previous surface/container-subtle #f5f6f7
  },
};
