import { useState, type FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Button } from '../components/Button';
import { Checkbox, CheckboxGroup } from '../components/Checkbox';
import { DatePicker } from '../components/DatePicker';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';
import { Radio, RadioGroup } from '../components/Radio';
import { Select, SelectOption } from '../components/Select';
import { Textarea } from '../components/Textarea';

// Mirrors the Figma usage example "Form 사용 예시" (section 사용 예시 화면) with the library components.
const meta = {
  title: "Examples/Form",
  id: 'patterns-form',
  tags: ['autodocs', '!manifest'],
  parameters: {
    controls: { disable: true },
    layout: 'padded',
    docs: {
      description: {
        component:
          '입력 화면을 만드는 방법입니다. 필수 항목은 `required`로 라벨 옆에 점을 붙이고, 입력 방법은 `message`로 칸 아래 회색 도움말로 알려 줍니다. ' +
          '형식이 틀리면 `invalid`와 `message`로 그 자리에 오류를 보여 주고, 필수 동의처럼 묶음에서 고르지 않은 것은 `CheckboxGroup`의 `invalid` · `message`로 묶음 아래에 알려 줍니다. ' +
          '저장하는 동안에는 버튼을 `disabled`로 바꾸고 옆에 `Loading`(sm)을 보여 줍니다.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const AGREE_ERROR = '개인정보 수집 · 이용에 동의해야 저장할 수 있습니다.';

const formBox = {
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-margin-m-5)',
  width: 500,
  maxWidth: '100%',
  padding: 'var(--spacing-padding-p-6)',
  border: 'var(--border-width-border) solid var(--colors-border-gray-subtler)',
  borderRadius: 'var(--border-radius-rounded-lg)',
  backgroundColor: 'var(--colors-surface-page)',
} as const;

const actions = { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--spacing-margin-m-2)' } as const;

function FormExample() {
  const [email, setEmail] = useState('hong@');
  const [department, setDepartment] = useState<string | null>(null);
  const [agree, setAgree] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const emailError = email === '' ? (submitted ? '이메일을 입력하세요.' : null) : EMAIL.test(email) ? null : '이메일 형식이 올바르지 않습니다. 예: name@company.com';
  const departmentError = submitted && department === null ? '부서를 선택하세요.' : null;
  const agreeError = submitted && !agree ? AGREE_ERROR : null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const form = event.currentTarget;
    if (emailError || department === null || !agree || !form.checkValidity()) {
      // Move focus to the first field to fix.
      const first = emailError
        ? form.querySelector('input[name="email"]')
        : department === null
          ? form.querySelector('.ds-select__trigger')
          : !agree
            ? form.querySelector('input[name="agree"]')
            : form.querySelector(':invalid');
      (first as HTMLElement | null)?.focus();
      return;
    }
    setSaving(true);
    window.setTimeout(() => setSaving(false), 1500);
  };

  return (
    <form style={formBox} noValidate onSubmit={submit} aria-label="담당자 등록">
      <Input size="md" label="이름" name="name" defaultValue="홍길동" required />
      <Input
        size="md"
        label="이메일"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        invalid={emailError !== null}
        message={emailError}
      />
      <Select
        size="md"
        label="부서"
        name="department"
        placeholder="부서 선택"
        value={department}
        onChange={(key) => setDepartment(key as string | null)}
        required
        invalid={departmentError !== null}
        message={departmentError ?? '인사 정보에 등록된 부서를 고릅니다.'}
      >
        <SelectOption id="energy">에너지관리팀</SelectOption>
        <SelectOption id="facility">시설운영팀</SelectOption>
        <SelectOption id="support">고객지원팀</SelectOption>
      </Select>
      <DatePicker size="md" label="시작일" name="start" defaultValue="2026-10-20" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-margin-m-1_5)' }}>
        <span id="form-kind" className="ds-typography-sm-leading-normal-normal" style={{ color: 'var(--colors-text-secondary)' }}>
          구분
        </span>
        <RadioGroup aria-labelledby="form-kind" name="kind" size="md" orientation="horizontal" defaultValue="normal">
          <Radio value="normal" label="일반" />
          <Radio value="urgent" label="긴급" />
        </RadioGroup>
      </div>
      <Textarea size="md" label="메모" name="memo" placeholder="전달할 내용을 입력하세요" maxLength={100} />
      <CheckboxGroup
        aria-label="개인정보 동의"
        name="agree"
        size="md"
        value={agree ? ['yes'] : []}
        onChange={(v) => setAgree(v.includes('yes'))}
        invalid={agreeError !== null}
        message={agreeError}
      >
        <Checkbox value="yes" label="개인정보 수집 · 이용에 동의합니다" />
      </CheckboxGroup>
      <div style={actions}>
        {saving && <Loading size="sm" aria-label="저장 중" />}
        <Button type="button" variant="tertiary" appearance="solid" size="md" disabled={saving}>
          취소
        </Button>
        <Button type="submit" variant="primary" appearance="solid" size="md" disabled={saving}>
          저장
        </Button>
      </div>
    </form>
  );
}

/** 필수 표시 · 도움말 · 오류 메시지 · 선택 · 날짜 · 라디오 · 메모 · 동의, 저장 중 · 필수 동의 오류 상태까지 한 화면에 모은 예시입니다. */
export const Form: Story = {
  name: '담당자 등록',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-margin-m-8)', width: 500, maxWidth: '100%' }}>
      <FormExample />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-margin-m-2)' }}>
        <span className="ds-typography-sm-leading-normal-normal" style={{ color: 'var(--colors-text-tertiary)' }}>
          저장 중일 때
        </span>
        <div style={actions}>
          <Loading size="sm" aria-label="저장 중" />
          <Button variant="tertiary" appearance="solid" size="md" disabled>
            취소
          </Button>
          <Button variant="primary" appearance="solid" size="md" disabled>
            저장
          </Button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-margin-m-2)' }}>
        <span className="ds-typography-sm-leading-normal-normal" style={{ color: 'var(--colors-text-tertiary)' }}>
          필수 동의를 하지 않고 저장했을 때
        </span>
        <CheckboxGroup aria-label="개인정보 동의(예시)" size="md" invalid message={AGREE_ERROR}>
          <Checkbox value="yes" label="개인정보 수집 · 이용에 동의합니다" />
        </CheckboxGroup>
      </div>
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const form = canvas.getByRole('form', { name: '담당자 등록' });
    await step('필수 표시 · 도움말 · 처음 오류', async () => {
      await expect(form.querySelectorAll('.ds-field__required')).toHaveLength(3);
      await expect(canvas.getByText('인사 정보에 등록된 부서를 고릅니다.').closest('.ds-field-message')).toHaveAttribute('data-type', 'helper');
      await expect(canvas.getByRole('textbox', { name: '이메일' })).toHaveAttribute('aria-invalid', 'true');
      await expect(canvas.getByRole('textbox', { name: '이메일' })).toHaveAccessibleDescription('이메일 형식이 올바르지 않습니다. 예: name@company.com');
    });
    await step('저장 — 부서를 고르지 않으면 오류', async () => {
      await userEvent.click(canvas.getAllByRole('button', { name: '저장' })[0]);
      await expect(canvas.getByText('부서를 선택하세요.')).toBeInTheDocument();
      // the error takes the help text's place
      await expect(canvas.queryByText('인사 정보에 등록된 부서를 고릅니다.')).toBeNull();
      await expect(within(form).queryByRole('status', { name: '저장 중' })).toBeNull();
    });
    await step('고치기 — 이메일 형식 · 부서 선택', async () => {
      const email = canvas.getByRole('textbox', { name: '이메일' });
      await userEvent.clear(email);
      await userEvent.type(email, 'hong@company.com');
      await expect(email).not.toHaveAttribute('aria-invalid');
      await userEvent.click(canvas.getByRole('button', { name: /부서/ }));
      await userEvent.click(await waitFor(() => within(document.body).getByRole('option', { name: '에너지관리팀' })));
      await expect(canvas.queryByText('부서를 선택하세요.')).toBeNull();
    });
    await step('필수 동의를 끄고 저장 — 묶음 아래 오류, 다시 동의하면 사라짐', async () => {
      const agree = within(form).getByRole('checkbox', { name: '개인정보 수집 · 이용에 동의합니다' });
      await userEvent.click(agree);
      await userEvent.click(within(form).getByRole('button', { name: '저장' }));
      await waitFor(() => expect(agree).toHaveAttribute('aria-invalid', 'true'));
      await expect(agree).toHaveAccessibleDescription(AGREE_ERROR);
      await expect(agree).toHaveFocus();
      await userEvent.click(agree);
      await expect(within(form).queryByText(AGREE_ERROR)).toBeNull();
    });
    await step('저장 — 처리 중에는 버튼 비활성 · 로딩', async () => {
      await userEvent.click(canvas.getAllByRole('button', { name: '저장' })[0]);
      await expect(within(form).getByRole('status', { name: '저장 중' })).toBeInTheDocument();
      await expect(within(form).getByRole('button', { name: '저장' })).toBeDisabled();
      await waitFor(() => expect(within(form).queryByRole('status', { name: '저장 중' })).toBeNull(), { timeout: 3000 });
    });
    // The static rows below the form: the processing state and the required-consent error.
    const rows = (canvasElement.firstElementChild as HTMLElement).children;
    await expect(within(rows[1] as HTMLElement).getAllByRole('status', { name: '저장 중' }).length).toBeGreaterThanOrEqual(1);
    await expect(within(rows[2] as HTMLElement).getByRole('checkbox')).toHaveAccessibleDescription(AGREE_ERROR);
  },
};
