import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Input } from '../Input';
import { FIELD_SIZES, type FieldSize } from '../../Field';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';

// Visual verification (not in the MCP manifest). Variant Matrix cells carry data-figma names
// checked by `node scripts/verify-figma.mjs input`.
const meta = {
  title: 'Components/Input/Showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const STATES = ['Default', 'Hover', 'Focus', 'Completed', 'Error', 'Disabled', 'Read-only'] as const;
type State = (typeof STATES)[number];

/** Props reproducing one Figma variant (all Figma variants have "Icon-eye" on → password field, revealed). */
function figmaVariant(size: FieldSize, state: State) {
  const base = { size, label: '라벨명', type: 'password', defaultRevealed: true } as const;
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
  render: () => (
    <div>
      <StorySection title="Size (sm · md · lg)">
        {FIELD_SIZES.map((size) => (
          <div key={size} style={{ width: 320 }}>
            <Input size={size} label="라벨명" placeholder="내용 입력" />
          </div>
        ))}
      </StorySection>
      <StorySection title="Message (info · success · error)">
        <div style={{ width: 320 }}><Input label="이메일" defaultValue="user@example.com" message="업무용 메일을 입력하세요." messageType="info" /></div>
        <div style={{ width: 320 }}><Input label="아이디" defaultValue="platform" message="사용할 수 있는 아이디입니다." messageType="success" /></div>
        <div style={{ width: 320 }}><Input label="전화번호" defaultValue="010-12" invalid message="전화번호 형식이 아닙니다." /></div>
      </StorySection>
      <StorySection title="Password · Disabled · Read-only">
        <div style={{ width: 320 }}><Input type="password" label="비밀번호" defaultValue="secret123" /></div>
        <div style={{ width: 320 }}><Input label="비활성" placeholder="입력 불가" disabled /></div>
        <div style={{ width: 320 }}><Input label="읽기 전용" defaultValue="수정 불가 값" readOnly /></div>
      </StorySection>
    </div>
  ),
};

/** All 21 Figma variants: Size (rows) × State (columns). */
export const VariantMatrix: Story = {
  render: () => (
    <FigmaMatrix
      cellWidth={320}
      columns={[...STATES]}
      rows={FIELD_SIZES.map((size) => ({
        label: size,
        cells: STATES.map((state) => ({ figma: `Type=Outline, Size=${size}, State=${state}`, node: <Input {...figmaVariant(size, state)} /> })),
      }))}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(21);
  },
};

/** Every state at size sm. */
export const States: Story = {
  render: () => (
    <StorySection title="State">
      {STATES.map((state) => (
        <div key={state} style={{ width: 320 }}>
          <div style={{ font: '500 11px/16px sans-serif', marginBottom: 8, color: 'var(--colors-text-secondary)' }}>{state}</div>
          <Input {...figmaVariant('sm', state)} />
        </div>
      ))}
    </StorySection>
  ),
};

/** Typing fills the field (Completed), the clear button empties it, the eye toggles password visibility. */
export const Interaction: Story = {
  render: () => (
    <div style={{ width: 320, display: 'grid', gap: 24 }}>
      <Input label="이름" placeholder="이름 입력" />
      <Input label="비밀번호" type="password" placeholder="비밀번호 입력" />
    </div>
  ),
  play: async ({ canvas, userEvent, step }) => {
    const name = canvas.getByLabelText('이름');
    const root = name.closest('.ds-input')!;
    await step('typing → Completed', async () => {
      await userEvent.type(name, '홍길동');
      await expect(name).toHaveValue('홍길동');
      await expect(root).toHaveAttribute('data-filled');
    });
    await step('clear button empties the field and keeps focus', async () => {
      await userEvent.click(canvas.getAllByRole('button', { name: '입력 내용 지우기', hidden: true })[0]);
      await expect(name).toHaveValue('');
      await expect(root).not.toHaveAttribute('data-filled');
      await expect(name).toHaveFocus();
    });
    await step('password reveal toggle', async () => {
      const password = canvas.getByLabelText('비밀번호');
      await userEvent.type(password, 'secret');
      await expect(password).toHaveAttribute('type', 'password');
      const toggle = canvas.getByRole('button', { name: '비밀번호 표시' });
      await userEvent.click(toggle);
      await expect(password).toHaveAttribute('type', 'text');
      await expect(canvas.getByRole('button', { name: '비밀번호 숨기기' })).toHaveAttribute('aria-pressed', 'true');
    });
  },
};

/** Label, error and message wiring for assistive technology. */
export const Accessibility: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Input label="전화번호" defaultValue="010-12" invalid message="전화번호 형식이 아닙니다." />
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: '전화번호' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('전화번호 형식이 아닙니다.');
    // Figma Error: 2px colors/input/outline/border/error (status/danger/strong — red/700 #c10007 since A-1, 2026-10-19)
    const control = input.closest('.ds-field__control')!;
    await expect(getComputedStyle(control).boxShadow).toBe('rgb(193, 0, 7) 0px 0px 0px 2px inset');
  },
};
