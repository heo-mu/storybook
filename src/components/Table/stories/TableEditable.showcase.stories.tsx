import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { KeyValueGroup, KeyValueItem, KeyValueTable } from '../Table';
import { Button, TextButton } from '../../Button';
import { FilterChip } from '../../Chip';
import { DatePicker } from '../../DatePicker';
import { ImageUploadPreview } from '../../FileUploader';
import { Input } from '../../Input';
import { Select, SelectOption } from '../../Select';
import { Switch } from '../../Switch';
import { ArrowCounterClockwiseIcon } from '../../../icons';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Value cells carry data-figma names checked by
// `node scripts/verify-figma.mjs table` (set table_value_editable).
const meta = {
  title: 'Components/Table/Editable Showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type State = 'Default' | 'Hover' | 'Editing' | 'Disabled';
type Content = 'Empty' | 'Filled';
type Type = 'Input' | 'Select' | 'Textarea' | 'Date Picker' | 'Date Range Picker' | 'Phone Number' | 'Filter' | 'Switch' | 'File Upload';

/** Story-only stand-in for an uploaded image: the Figma placeholder (grey square with crossed lines). */
const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#d9d9d9"/><path d="M0 0L100 100M100 0L0 100" stroke="#b1b8be"/></svg>',
  );

/** One Figma `table_value_editable` variant as a key-value row (Figma sample texts per state). */
function EditCell({ type, state, content }: { type: Type; state: State; content: Content }) {
  const filled = content === 'Filled';
  const disabled = state === 'Disabled';
  const active = state === 'Hover' || state === 'Editing';
  const cell = state === 'Hover' ? PSEUDO.hover : state === 'Editing' ? PSEUDO.focus : undefined;
  const field = state === 'Editing' ? PSEUDO.focus : undefined;
  const valueProps = { 'data-figma': `Type=${type}, State=${state}, Content=${content}`, className: cell };
  const row = (children: ReactNode, opts: { editable?: boolean; unit?: boolean; stack?: boolean } = {}) => (
    <KeyValueItem label="항목명" editable={opts.editable} disabled={disabled} unit={opts.unit ? '단위' : undefined} stack={opts.stack} valueProps={valueProps}>
      {children}
    </KeyValueItem>
  );
  const text = active ? '내용 텍스트' : '내용 입력';
  switch (type) {
    case 'Input':
      return row(<Input size="sm" aria-label="항목명" placeholder="내용 입력" defaultValue={filled ? text : undefined} disabled={disabled} className={field} />, { editable: true, unit: true });
    case 'Phone Number':
      return row(
        <Input size="sm" type="tel" aria-label="전화번호" placeholder="-를 제외하고 번호만 입력" defaultValue={filled ? '010-1234-7806' : undefined} disabled={disabled} className={field} />,
        { editable: true },
      );
    case 'Textarea':
      return row(<Input size="sm" aria-label="항목명" placeholder="내용 입력" defaultValue={filled ? '내용 텍스트' : undefined} disabled={disabled} className={field} />, { editable: true });
    case 'Select':
      return row(
        <Select size="sm" aria-label="항목명" placeholder={state === 'Hover' ? '내용 선택' : '내용 입력'} defaultValue={filled ? 'value' : null} disabled={disabled} className={field}>
          <SelectOption id="value">{text}</SelectOption>
          <SelectOption id="a">옵션명</SelectOption>
        </Select>,
        { editable: true, unit: true },
      );
    case 'Date Picker':
      return row(<DatePicker size="sm" aria-label="날짜" defaultValue={filled ? '2026-10-01' : null} disabled={disabled} className={field} />, { editable: true });
    case 'Date Range Picker':
      return row(
        <>
          <DatePicker size="sm" aria-label="시작일" defaultValue={filled ? '2026-10-01' : null} disabled={disabled} className={field} />
          <span className="ds-kv__unit">~</span>
          <DatePicker size="sm" aria-label="종료일" defaultValue={filled ? '2026-10-10' : null} disabled={disabled} className={field} />
        </>,
        { editable: true },
      );
    // Figma (since 2026-10-19): one chip-filter — Unselected "텍스트 선택" when empty, Selected with the summary when
    // filled; Hover · Empty shows the chip's Hover state, Hover · Filled adds 초기화, Editing is the Selected · Expanded chip
    // (fixed in Figma 2026-10-19, R6) whose multi-select listbox is not drawn here (no such list in the library — decision item).
    case 'Filter':
      if (!filled) {
        return row(
          <FilterChip size="md" disabled={disabled} className={state === 'Hover' ? PSEUDO.hover : undefined}>
            텍스트 선택
          </FilterChip>,
        );
      }
      return row(
        <KeyValueGroup>
          <FilterChip size="md" selected expanded={state === 'Editing' || undefined} disabled={disabled}>
            선택유형: 옵션명, 옵션명
          </FilterChip>
          {state === 'Hover' && <TextButton rightIcon={<ArrowCounterClockwiseIcon />}>초기화</TextButton>}
        </KeyValueGroup>,
      );
    case 'Switch':
      return row(
        <>
          <Switch size="md" aria-label="사용" disabled={disabled} />
          <span className="ds-kv__hint">설명</span>
        </>,
      );
    case 'File Upload':
      return row(
        <>
          <KeyValueGroup>
            {/* Figma: the button instance has a minimum width of 80px. */}
            <Button variant="tertiary" appearance="outline" size="xs" style={{ minWidth: 80 }}>
              파일 선택
            </Button>
            <span className="ds-kv__hint">권장 비율 1:1, JPG/PNG, 최대 5MB </span>
          </KeyValueGroup>
          <ImageUploadPreview src={PLACEHOLDER} alt="업로드한 이미지" onRemove={() => {}} />
        </>,
        { stack: true },
      );
  }
}

/** The Figma variants of one type, in a key-value table 480px wide (the first row only adds the top border). */
function TypeTable({ type, cells }: { type: Type; cells: Array<[State, Content]> }) {
  return (
    <KeyValueTable style={{ width: 480 }}>
      <KeyValueItem label={type}>{type}</KeyValueItem>
      {cells.map(([state, content]) => (
        <EditCell key={`${state}-${content}`} type={type} state={state} content={content} />
      ))}
    </KeyValueTable>
  );
}

const FIELD_CELLS: Array<[State, Content]> = [
  ['Default', 'Empty'],
  ['Disabled', 'Empty'],
  ['Default', 'Filled'],
  ['Disabled', 'Filled'],
  ['Hover', 'Empty'],
  ['Hover', 'Filled'],
];

/** Figma `table_value_editable` (52) without the open list / calendar (see `EditableOpen`). */
export const EditableMatrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 480px)', gap: 40, alignItems: 'start' }}>
      <TypeTable type="Input" cells={[...FIELD_CELLS, ['Editing', 'Filled']]} />
      <TypeTable type="Phone Number" cells={[...FIELD_CELLS, ['Editing', 'Filled']]} />
      <TypeTable type="Textarea" cells={[...FIELD_CELLS, ['Editing', 'Filled']]} />
      <TypeTable type="Date Range Picker" cells={[...FIELD_CELLS, ['Editing', 'Filled']]} />
      <TypeTable type="Select" cells={FIELD_CELLS} />
      <TypeTable type="Date Picker" cells={FIELD_CELLS} />
      <TypeTable type="Filter" cells={[...FIELD_CELLS, ['Editing', 'Filled']]} />
      <TypeTable type="Switch" cells={[['Default', 'Empty'], ['Disabled', 'Empty']]} />
      <TypeTable type="File Upload" cells={[['Default', 'Empty']]} />
    </div>
  ),
};

/** Editing with the list / calendar open (one at a time). */
export const EditableOpen: StoryObj<{ type: 'Select' | 'Date Picker' }> = {
  args: { type: 'Select' },
  render: ({ type }) => (
    <div style={{ paddingBottom: 320 }}>
      <KeyValueTable style={{ width: 480 }}>
        <KeyValueItem label={type}>{type}</KeyValueItem>
        {type === 'Select' ? (
          <KeyValueItem label="항목명" editable unit="단위" valueProps={{ 'data-figma': 'Type=Select, State=Editing, Content=Filled' }}>
            <Select size="sm" aria-label="항목명" defaultValue="value" defaultOpen>
              <SelectOption id="value">내용 텍스트</SelectOption>
              <SelectOption id="a">옵션명</SelectOption>
            </Select>
          </KeyValueItem>
        ) : (
          <KeyValueItem label="항목명" editable valueProps={{ 'data-figma': 'Type=Date Picker, State=Editing, Content=Filled' }}>
            <DatePicker size="sm" aria-label="날짜" defaultValue="2026-10-01" open />
          </KeyValueItem>
        )}
      </KeyValueTable>
    </div>
  ),
};

/** In management mode the values are real fields: labelled, in the Tab order, each with its own keyboard behaviour. */
export const EditableAccessibility: Story = {
  render: () => (
    <KeyValueTable style={{ width: 480 }}>
      <KeyValueItem label="설비명" required editable unit="대">
        <Input size="sm" aria-label="설비명" defaultValue="공조기" />
      </KeyValueItem>
      <KeyValueItem label="점검일" editable>
        <DatePicker size="sm" aria-label="점검일" />
      </KeyValueItem>
    </KeyValueTable>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: '설비명' })).toHaveFocus();
    await expect(canvas.getByText('대')).toBeVisible();
  },
};
