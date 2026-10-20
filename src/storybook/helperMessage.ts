import { expect } from 'storybook/test';

/**
 * Story-only check of a field's help text against Figma `*_message` Type=Helper (Rules 04 "도움말"): no status icon,
 * the field's …/helper/default colour (…/helper/disabled when the field is disabled — State=Disabled), and the text is
 * the description of the control that screen readers read with it.
 */
export async function expectHelperMessage(field: HTMLElement, token: string) {
  const message = field.querySelector<HTMLElement>('.ds-field-message');
  await expect(message).toBeTruthy();
  await expect(message).toHaveAttribute('data-type', 'helper');
  await expect(message!.querySelector('svg')).toBeNull();

  const probe = document.createElement('span');
  probe.style.color = `var(${token})`;
  document.body.append(probe);
  const expected = getComputedStyle(probe).color;
  probe.remove();
  await expect(expected).not.toBe('rgba(0, 0, 0, 0)');
  await expect(getComputedStyle(message!).color).toBe(expected);

  await expect(message!.id).not.toBe('');
  await expect(field.querySelector(`[aria-describedby~="${message!.id}"]`)).toBeTruthy();
}
