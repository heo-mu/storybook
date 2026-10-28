import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Input } from '../Input';
import { FIELD_SIZES, type FieldSize } from '../../Field';
import { FigmaMatrix, StorySection } from '../../../storybook/FigmaMatrix';
import { PSEUDO, PSEUDO_STORY_PARAMETERS } from '../../../storybook/pseudo';
import { koLabel } from '../../../storybook/koLabel';
import { expectRequiredMark } from '../../../storybook/requiredMark';
import { expectHelperMessage } from '../../../storybook/helperMessage';

// Visual verification (not in the MCP manifest). Variant Matrix cells carry data-figma names
// checked by `node scripts/verify-figma.mjs input`.
const meta = {
  title: "Components/Input/Gallery",
  id: 'components-input-showcase',
  tags: ['!manifest'],
  parameters: { ...PSEUDO_STORY_PARAMETERS, controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const STATES = ['Default', 'Hover', 'Focus', 'Completed', 'Error', 'Disabled', 'Read-only'] as const;
type State = (typeof STATES)[number];
// Figma `password_field` (1440:8466, 2026-10-27): the input states plus Focus-on (Focus with the value revealed).
const PASSWORD_STATES = ['Default', 'Hover', 'Focus', 'Focus-on', 'Completed', 'Error', 'Disabled', 'Read-only'] as const;
type PasswordState = (typeof PASSWORD_STATES)[number];

/** Props reproducing one Figma variant ("Icon-eye" is off by default since 2026-10-20 — F90; the eye is for password fields only). */
function figmaVariant(size: FieldSize, state: State) {
  const base = { size, label: '라벨명' } as const;
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

/** Props reproducing one Figma `password_field` variant: the masked text is "•••••••••" (9 characters → 9 mask dots in the
 * browser), the placeholder of the empty states is the same dots, Focus-on shows "ABCDEFG" with the eye-slash icon. */
function figmaPasswordVariant(size: FieldSize, state: PasswordState) {
  const base = { size, label: '라벨명', type: 'password' } as const;
  const masked = { defaultValue: '•••••••••' };
  const empty = { placeholder: '•••••••••' };
  switch (state) {
    case 'Default': return { ...base, ...empty };
    case 'Hover': return { ...base, ...empty, className: PSEUDO.hover };
    case 'Focus': return { ...base, ...masked, className: PSEUDO.focus, message: 'Alert 내용', messageType: 'info' as const };
    case 'Focus-on': return { ...base, defaultValue: 'ABCDEFG', defaultRevealed: true, className: PSEUDO.focus, message: 'Alert 내용', messageType: 'info' as const };
    case 'Completed': return { ...base, ...masked, message: 'Alert 내용', messageType: 'success' as const };
    case 'Error': return { ...base, ...masked, invalid: true, message: 'Alert 내용', messageType: 'error' as const };
    case 'Disabled': return { ...base, ...empty, disabled: true };
    case 'Read-only': return { ...base, ...masked, readOnly: true };
  }
}

export const Overview: Story = {
  name: "Overview",
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

/** 크기와 상태별 표현을 비교합니다. */
export const VariantMatrix: Story = {
  name: "Variants",
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

/** Figma `password_field` (1440:8466) — 8 states × 3 sizes, checked by `node scripts/verify-figma.mjs input` (set password_field). */
export const PasswordMatrix: Story = {
  name: "Password Variants",
  render: () => (
    <FigmaMatrix
      cellWidth={320}
      columns={[...PASSWORD_STATES]}
      rows={FIELD_SIZES.map((size) => ({
        label: size,
        cells: PASSWORD_STATES.map((state) => ({ figma: `Type=Outline, Size=${size}, State=${state}`, node: <Input {...figmaPasswordVariant(size, state)} /> })),
      }))}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-figma]')).toHaveLength(24);
    // Figma password_field has no clear (X) icon in any state; the eye-slash icon is shown only while revealed (Focus-on).
    await expect(canvasElement.querySelectorAll('.ds-input__clear')).toHaveLength(0);
    await expect(canvasElement.querySelectorAll('.ds-input__reveal[aria-pressed="true"]')).toHaveLength(3);
    await expect(canvasElement.querySelectorAll('.ds-input__reveal[aria-pressed="true"] svg[viewBox="0 0 24 24"]')).toHaveLength(3);
  },
};

/** Every password state at size sm. */
export const PasswordStates: Story = {
  name: "Password States",
  render: () => (
    <StorySection title="State">
      {PASSWORD_STATES.map((state) => (
        <div key={state} style={{ width: 320 }}>
          <div style={{ font: '500 11px/16px sans-serif', marginBottom: 8, color: 'var(--colors-text-secondary)' }}>{koLabel(state)}</div>
          <Input {...figmaPasswordVariant('sm', state)} />
        </div>
      ))}
    </StorySection>
  ),
};

/** Every state at size sm. */
export const States: Story = {
  name: "States",
  render: () => (
    <StorySection title="State">
      {STATES.map((state) => (
        <div key={state} style={{ width: 320 }}>
          <div style={{ font: '500 11px/16px sans-serif', marginBottom: 8, color: 'var(--colors-text-secondary)' }}>{koLabel(state)}</div>
          <Input {...figmaVariant('sm', state)} />
        </div>
      ))}
    </StorySection>
  ),
};

/** Typing fills the field (Completed), the clear button empties it, the eye toggles password visibility. */
export const Interaction: Story = {
  name: "Interaction",
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
    await step('password reveal toggle — eye ↔ eye-slash icon, no clear button (Figma password_field)', async () => {
      const password = canvas.getByLabelText('비밀번호');
      await expect(password.closest('.ds-input')!.querySelector('.ds-input__clear')).toBeNull();
      await userEvent.type(password, 'secret');
      await expect(password).toHaveAttribute('type', 'password');
      const toggle = canvas.getByRole('button', { name: '비밀번호 표시' });
      await expect(toggle.querySelector('svg')).toHaveAttribute('viewBox', '0 0 16 16');
      await userEvent.click(toggle);
      await expect(password).toHaveAttribute('type', 'text');
      const hide = canvas.getByRole('button', { name: '비밀번호 숨기기' });
      await expect(hide).toHaveAttribute('aria-pressed', 'true');
      await expect(hide.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
      await userEvent.keyboard('{Enter}');
      await expect(password).toHaveAttribute('type', 'password');
      await expect(canvas.getByRole('button', { name: '비밀번호 표시' })).toHaveAttribute('aria-pressed', 'false');
    });
  },
};

/** Label, error and message wiring for assistive technology. */
export const Accessibility: Story = {
  name: "Accessibility",
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

/** 라벨의 필수 표시와 입력 요소의 필수 상태를 확인합니다. */
export const RequiredMark: Story = {
  name: "Required",
  render: () => (
    <form style={{ width: 320, display: 'grid', gap: 24 }} onSubmit={(event) => event.preventDefault()}>
      {FIELD_SIZES.map((size) => (
        <Input key={size} size={size} label={`이름 (${size})`} placeholder="이름 입력" required />
      ))}
      <Input label="메모" placeholder="메모 입력" />
    </form>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    for (const size of FIELD_SIZES) {
      const input = canvas.getByRole('textbox', { name: `이름 (${size})` });
      await expect(input).toBeRequired();
      await expectRequiredMark(input.closest('.ds-field')!, '--colors-input-outline-required-default');
    }
    await expect(canvas.getByRole('textbox', { name: '메모' })).not.toBeRequired();
    await expect(canvasElement.querySelectorAll('.ds-field__required')).toHaveLength(3);
    // Native form check: empty required fields block the form until they are filled.
    const form = canvasElement.querySelector('form')!;
    await expect(form.checkValidity()).toBe(false);
    for (const size of FIELD_SIZES) await userEvent.type(canvas.getByRole('textbox', { name: `이름 (${size})` }), '홍길동');
    await expect(form.checkValidity()).toBe(true);
  },
};

/** 도움말과 오류 메시지, 비활성 필드의 표시를 비교합니다. */
export const HelperMessage: Story = {
  name: "Helper Text",
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <Input label="비밀번호" message="8자 이상, 영문과 숫자를 섞어 입력하세요." />
      <Input label="비밀번호" message="8자 이상, 영문과 숫자를 섞어 입력하세요." disabled />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [field, disabled] = canvasElement.querySelectorAll<HTMLElement>('.ds-input');
    await expectHelperMessage(field, '--colors-input-outline-helper-default');
    await expectHelperMessage(disabled, '--colors-input-outline-helper-disabled');
  },
};
