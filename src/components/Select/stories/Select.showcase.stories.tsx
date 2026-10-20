import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListBox, type Key } from 'react-aria-components';
import { expect, waitFor, within } from 'storybook/test';
import { Select } from '../Select';
import { SelectOption } from '../SelectOption';
import { SelectSizeContext } from '../SelectContext';
import { FieldMessage, FIELD_SIZES, type FieldSize } from '../../Field';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';
import { koLabel } from '../../../storybook/koLabel';

// Visual verification (not in the MCP manifest). Cells carry data-figma names checked by
// `node scripts/verify-figma.mjs select` (sets select, listbox, option, select_message).
const meta = {
  title: '컴포넌트/Select/전체 보기',
  id: 'components-select-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const STATES = ['Default', 'Hover', 'Focus', 'Completed', 'Error', 'Disabled', 'Read-only'] as const;
type State = (typeof STATES)[number] | 'Open';

/** Figma "Display Text" shown in every variant; filled variants select an option with that text. */
const FIGMA_OPTIONS = (
  <>
    <SelectOption id="figma">내용 선택</SelectOption>
    <SelectOption id="other">다른 옵션</SelectOption>
  </>
);

/** Props reproducing one Figma select variant. */
function figmaVariant(size: FieldSize, state: State) {
  const base = { size, label: '라벨명' } as const;
  const filled = { defaultValue: 'figma' as Key };
  switch (state) {
    case 'Default': return { ...base };
    case 'Hover': return { ...base, className: PSEUDO.hover };
    case 'Focus': return { ...base };
    case 'Open': return { ...base, ...filled, open: true };
    case 'Completed': return { ...base, ...filled };
    case 'Error': return { ...base, ...filled, invalid: true };
    case 'Disabled': return { ...base, disabled: true };
    case 'Read-only': return { ...base, ...filled, readOnly: true };
  }
}

/**
 * One Figma select variant. State=Focus (2026-10-19) is the keyboard-focus look: react-aria marks the root
 * `data-focus-visible` while the trigger has keyboard focus, so the static cell sets that attribute (real keyboard focus
 * is asserted in Foundations/Focus).
 */
function SelectVariant({ size, state }: { size: FieldSize; state: State }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state === 'Focus') ref.current?.querySelector('.ds-select')?.setAttribute('data-focus-visible', 'true');
  }, [state]);
  return (
    <div ref={ref} style={{ display: 'contents' }}>
      <Select {...figmaVariant(size, state)}>{FIGMA_OPTIONS}</Select>
    </div>
  );
}

const FRUITS = ['사과', '바나나', '체리', '포도', '키위', '망고', '복숭아', '자두', '수박', '참외', '딸기', '레몬'];

export const Overview: Story = {
  name: '개요',
  render: () => (
    <div>
      <StorySection title="Size (sm · md · lg)">
        {FIELD_SIZES.map((size) => (
          <div key={size} style={{ width: 320 }}>
            <Select size={size} label="과일">
              {FRUITS.slice(0, 5).map((f) => (
                <SelectOption key={f} id={f}>{f}</SelectOption>
              ))}
            </Select>
          </div>
        ))}
      </StorySection>
      <StorySection title="Message · Error · Disabled · Read-only">
        <div style={{ width: 320 }}>
          <Select label="부서" defaultValue="design" message="소속 부서를 선택하세요." messageType="info">
            <SelectOption id="design">디자인</SelectOption>
            <SelectOption id="dev">개발</SelectOption>
          </Select>
        </div>
        <div style={{ width: 320 }}>
          <Select label="지역" invalid message="지역을 선택하세요.">
            <SelectOption id="seoul">서울</SelectOption>
          </Select>
        </div>
        <div style={{ width: 320 }}>
          <Select label="비활성" disabled>
            <SelectOption id="a">항목</SelectOption>
          </Select>
        </div>
        <div style={{ width: 320 }}>
          <Select label="읽기 전용" defaultValue="a" readOnly>
            <SelectOption id="a">고정 값</SelectOption>
          </Select>
        </div>
      </StorySection>
    </div>
  ),
};

/** 21 Figma select variants: Size (rows) × State (columns). "Open" needs an open list → see `Open`. */
export const VariantMatrix: Story = {
  name: '모든 변형',
  render: () => (
    <FigmaMatrix
      cellWidth={320}
      columns={[...STATES]}
      rows={FIELD_SIZES.map((size) => ({
        label: size,
        cells: STATES.map((state) => ({
          figma: `Size=${size}, State=${state}`,
          node: <SelectVariant size={size} state={state} />,
        })),
      }))}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(21);
  },
};

/** Figma State "Open" for one size (`size` arg): the field with its list open below it. */
export const Open: StoryObj<{ size: FieldSize }> = {
  name: '열림',
  args: { size: 'sm' },
  argTypes: { size: { control: 'inline-radio', options: FIELD_SIZES } },
  parameters: { controls: { disable: false } },
  render: ({ size }) => (
    <div style={{ padding: 16, height: 320 }}>
      <div data-figma={`Size=${size}, State=Open`} style={{ width: 320 }}>
        <Select {...figmaVariant(size, 'Open')}>{FIGMA_OPTIONS}</Select>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const listbox = await within(canvasElement.ownerDocument.body).findByRole('listbox');
    const trigger = canvasElement.querySelector('.ds-select__trigger')!;
    const t = trigger.getBoundingClientRect();
    await waitFor(() => {
      const l = listbox.getBoundingClientRect();
      // Figma select_example: list 4px (spacing/margin/m-1) below the field, same width
      expect(Math.round(l.top - t.bottom)).toBe(4);
      expect(Math.round(l.width)).toBe(Math.round(t.width));
    });
  },
};

const SELECTED_ROW = 2;

/** Figma `listbox` (3 sizes): five options, the third selected. */
export const ListboxMatrix: Story = {
  name: '목록 모든 변형',
  render: () => (
    <FigmaMatrix
      cellWidth={332}
      columns={['listbox']}
      rows={FIELD_SIZES.map((size) => ({
        label: size,
        cells: [
          {
            figma: `Size=${size}`,
            node: (
              <SelectSizeContext.Provider value={size}>
                <ListBox aria-label={`listbox ${size}`} className="ds-listbox" data-size={size} selectionMode="single" defaultSelectedKeys={[String(SELECTED_ROW)]}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <SelectOption key={i} id={String(i)}>옵션명</SelectOption>
                  ))}
                </ListBox>
              </SelectSizeContext.Provider>
            ),
          },
        ],
      }))}
    />
  ),
};

const OPTION_STATES = ['Default', 'Hover', 'Pressed', 'Selected', 'Disabled'] as const;

/** Figma `option` (15): Size (rows) × State (columns). */
export const OptionMatrix: Story = {
  name: '옵션 모든 변형',
  render: () => (
    <FigmaMatrix
      cellWidth={320}
      columns={[...OPTION_STATES]}
      rows={FIELD_SIZES.map((size) => ({
        label: size,
        cells: OPTION_STATES.map((state) => ({
          figma: `Size=${size}, State=${state}`,
          node: (
            <SelectSizeContext.Provider value={size}>
              <ListBox aria-label={`option ${size} ${state}`} selectionMode="single" defaultSelectedKeys={state === 'Selected' ? ['o'] : []}>
                <SelectOption
                  id="o"
                  disabled={state === 'Disabled'}
                  className={state === 'Hover' ? PSEUDO.hover : state === 'Pressed' ? PSEUDO.pressed : undefined}
                >
                  옵션명
                </SelectOption>
              </ListBox>
            </SelectSizeContext.Provider>
          ),
        })),
      }))}
    />
  ),
};

/** Figma `select_message` (Info · Success · Error). */
export const MessageMatrix: Story = {
  name: '메시지 모든 변형',
  render: () => (
    <div className="ds-select">
      <FigmaMatrix
        columns={['select_message']}
        rows={(['info', 'success', 'error'] as const).map((type) => ({
          label: type,
          cells: [{ figma: `Type=${type.charAt(0).toUpperCase() + type.slice(1)}`, node: <FieldMessage type={type}>Alert 내용</FieldMessage> }],
        }))}
      />
    </div>
  ),
};

/** Every state at size sm (Open: see `Open`). */
export const States: Story = {
  name: '상태별 보기',
  render: () => (
    <StorySection title="State">
      {STATES.map((state) => (
        <div key={state} style={{ width: 320 }}>
          <div style={{ font: '500 11px/16px sans-serif', marginBottom: 8, color: 'var(--colors-text-secondary)' }}>{koLabel(state)}</div>
          <SelectVariant size="sm" state={state} />
        </div>
      ))}
    </StorySection>
  ),
};

/** A long list scrolls inside the popover (Figma "scroll" indicator = the styled scrollbar). */
export const LongList: Story = {
  name: '긴 목록',
  render: () => (
    <div style={{ width: 320, paddingBottom: 240 }}>
      <Select label="과일" defaultOpen>
        {FRUITS.map((f) => (
          <SelectOption key={f} id={f}>{f}</SelectOption>
        ))}
      </Select>
    </div>
  ),
};

function Controlled() {
  const [value, setValue] = useState<Key | null>(null);
  return (
    <div style={{ width: 320, display: 'grid', gap: 12, paddingBottom: 240 }}>
      <Select label="과일" value={value} onChange={setValue} name="fruit">
        {FRUITS.slice(0, 5).map((f) => (
          <SelectOption key={f} id={f} disabled={f === '체리'}>{f}</SelectOption>
        ))}
      </Select>
      <output style={{ font: '12px sans-serif' }}>선택: {value ?? '없음'}</output>
    </div>
  );
}

/** Mouse and keyboard: open, move, select, close; focus returns to the field. */
export const Interaction: Story = {
  name: '동작',
  render: () => <Controlled />,
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: /과일/ });
    await step('click opens the list (Open: caret up, focus border)', async () => {
      await userEvent.click(trigger);
      await body.findByRole('listbox');
      await expect(canvasElement.querySelector('.ds-select')).toHaveAttribute('data-open');
    });
    await step('click an option selects it and closes the list', async () => {
      await userEvent.click(body.getByRole('option', { name: '바나나' }));
      await expect(canvas.getByText('선택: 바나나')).toBeInTheDocument();
      await waitFor(() => expect(body.queryByRole('listbox')).not.toBeInTheDocument());
      await expect(canvasElement.querySelector('.ds-select')).toHaveAttribute('data-filled');
    });
    await step('keyboard: ArrowDown opens, disabled option is skipped, Enter selects', async () => {
      trigger.focus();
      await userEvent.keyboard('{ArrowDown}');
      const listbox = await body.findByRole('listbox');
      await expect(within(listbox).getByRole('option', { name: '바나나' })).toHaveAttribute('aria-selected', 'true');
      await expect(within(listbox).getByRole('option', { name: '체리' })).toHaveAttribute('aria-disabled', 'true');
      await userEvent.keyboard('{ArrowDown}{Enter}');
      await expect(canvas.getByText('선택: 포도')).toBeInTheDocument();
      await waitFor(() => expect(trigger).toHaveFocus());
    });
    await step('Escape closes without changing the value', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await body.findByRole('listbox');
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByRole('listbox')).not.toBeInTheDocument());
      await expect(canvas.getByText('선택: 포도')).toBeInTheDocument();
    });
  },
};

/** Label, description and invalid state reach the trigger; the hidden native select carries the form value. */
export const Accessibility: Story = {
  name: '접근성',
  render: () => (
    <form style={{ width: 320 }} aria-label="주문">
      <Select label="배송지" name="region" defaultValue="seoul" invalid message="배송할 수 없는 지역입니다.">
        <SelectOption id="seoul">서울</SelectOption>
        <SelectOption id="jeju">제주</SelectOption>
      </Select>
    </form>
  ),
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole('button', { name: /배송지/ });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    await expect(trigger).toHaveAccessibleDescription(/배송할 수 없는 지역입니다/);
    await expect(canvasElement.querySelector('.ds-select')).toHaveAttribute('data-invalid');
    const form = canvasElement.querySelector('form')!;
    await expect(new FormData(form).get('region')).toBe('seoul');
  },
};
