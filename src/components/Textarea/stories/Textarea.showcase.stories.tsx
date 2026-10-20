import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Textarea } from '../Textarea';
import { TEXTAREA_SIZES, type TextareaSize } from '../Textarea.options';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';
import { koLabel } from '../../../storybook/koLabel';
import { expectRequiredMark } from '../../../storybook/requiredMark';
import { expectHelperMessage } from '../../../storybook/helperMessage';

// Visual verification (not in the MCP manifest): `node scripts/verify-figma.mjs textarea`.
const meta = {
  title: '컴포넌트/Textarea/전체 보기',
  id: 'components-textarea-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const STATES = ['Default', 'Hover', 'Focus', 'Completed', 'Error', 'Disabled', 'Read-only'] as const;
type State = (typeof STATES)[number];

/** Props reproducing one Figma variant. The counter shows the real length (Figma's 1 / 50 / 200 are mock values). */
function figmaVariant(size: TextareaSize, state: State) {
  const base = { size, label: '라벨명', maxLength: 100 } as const;
  const value = { defaultValue: '내용 입력' };
  const empty = { placeholder: '내용 입력' };
  switch (state) {
    case 'Default': return { ...base, ...empty };
    case 'Hover': return { ...base, ...empty, className: PSEUDO.hover };
    case 'Focus': return { ...base, ...value, className: PSEUDO.focus, message: 'Alert 내용', messageType: 'info' as const };
    case 'Completed': return { ...base, ...value, message: 'Alert 내용', messageType: 'success' as const };
    case 'Error': return { ...base, ...value, invalid: true, message: 'Alert 내용', messageType: 'error' as const };
    case 'Disabled': return { ...base, ...empty, disabled: true };
    case 'Read-only': return { ...base, ...value, readOnly: true };
  }
}

export const Overview: Story = {
  name: '개요',
  render: () => (
    <StorySection title="Size (sm · md) · message · counter">
      <div style={{ width: 320 }}><Textarea label="요청 사항" placeholder="내용 입력" maxLength={100} /></div>
      <div style={{ width: 320 }}><Textarea size="md" label="요청 사항" defaultValue="배송 전 연락 부탁드립니다." maxLength={100} message="최대 100자" messageType="info" /></div>
      <div style={{ width: 320 }}><Textarea label="사유" defaultValue="짧음" maxLength={100} invalid message="10자 이상 입력하세요." /></div>
    </StorySection>
  ),
};

/** All 14 Figma variants: Size (rows) × State (columns). */
export const VariantMatrix: Story = {
  name: '모든 변형',
  render: () => (
    <FigmaMatrix
      cellWidth={320}
      columns={[...STATES]}
      rows={TEXTAREA_SIZES.map((size) => ({
        label: size,
        cells: STATES.map((state) => ({ figma: `Size=${size}, State=${state}`, node: <Textarea {...figmaVariant(size, state)} /> })),
      }))}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(14);
  },
};

export const States: Story = {
  name: '상태별 보기',
  render: () => (
    <StorySection title="State (sm)">
      {STATES.map((state) => (
        <div key={state} style={{ width: 320 }}>
          <div style={{ font: '500 11px/16px sans-serif', marginBottom: 8, color: 'var(--colors-text-secondary)' }}>{koLabel(state)}</div>
          <Textarea {...figmaVariant('sm', state)} />
        </div>
      ))}
    </StorySection>
  ),
};

/** Typing updates the counter and the Completed state. */
export const Interaction: Story = {
  name: '동작',
  render: () => (
    <div style={{ width: 320 }}>
      <Textarea label="메모" placeholder="내용 입력" maxLength={20} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const textarea = canvas.getByLabelText('메모');
    await userEvent.type(textarea, '안녕하세요');
    await expect(textarea).toHaveValue('안녕하세요');
    await expect(textarea.closest('.ds-textarea')).toHaveAttribute('data-filled');
    await expect(canvas.getByText('5')).toHaveClass('ds-textarea__count-current');
    await userEvent.type(textarea, '가'.repeat(30));
    await expect((textarea as HTMLTextAreaElement).value).toHaveLength(20); // native maxLength
  },
};

export const Accessibility: Story = {
  name: '접근성',
  render: () => (
    <div style={{ width: 320 }}>
      <Textarea label="사유" defaultValue="짧음" maxLength={100} invalid message="10자 이상 입력하세요." />
    </div>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole('textbox', { name: '사유' });
    await expect(textarea).toHaveAttribute('aria-invalid', 'true');
    // The message and the counter are both announced as the description.
    await expect(textarea).toHaveAccessibleDescription('10자 이상 입력하세요. 2 / 100');
  },
};

/** Figma Required on (every size): the dot after the label; the textarea is required for assistive technology and form checks. */
export const RequiredMark: Story = {
  name: '필수 표시',
  render: () => (
    <div style={{ width: 320, display: 'grid', gap: 24 }}>
      {TEXTAREA_SIZES.map((size) => (
        <Textarea key={size} size={size} label={`신청 사유 (${size})`} placeholder="신청 사유 입력" required />
      ))}
      <Textarea label="메모" placeholder="메모 입력" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    for (const size of TEXTAREA_SIZES) {
      const textarea = canvas.getByRole('textbox', { name: `신청 사유 (${size})` });
      await expect(textarea).toBeRequired();
      await expectRequiredMark(textarea.closest('.ds-field')!, '--colors-textarea-outline-required-default');
    }
    await expect(canvas.getByRole('textbox', { name: '메모' })).not.toBeRequired();
    await expect(canvasElement.querySelectorAll('.ds-field__required')).toHaveLength(TEXTAREA_SIZES.length);
  },
};

/** Rules 04 "도움말": grey help text without an icon (Figma Type=Helper); helper/disabled in a disabled field. */
export const HelperMessage: Story = {
  name: '도움말',
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <Textarea label="메모" message="받는 분께 전할 내용을 적어 주세요." maxLength={100} showCount />
      <Textarea label="메모" message="받는 분께 전할 내용을 적어 주세요." disabled />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [field, disabled] = canvasElement.querySelectorAll<HTMLElement>('.ds-textarea');
    await expectHelperMessage(field, '--colors-textarea-outline-helper-default');
    await expectHelperMessage(disabled, '--colors-textarea-outline-helper-disabled');
    // the counter stays beside the help text (Figma: helper and counter share the message row)
    await expect(field.querySelector('.ds-textarea__count')).toBeTruthy();
  },
};
