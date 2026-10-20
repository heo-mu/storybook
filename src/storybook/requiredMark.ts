import { expect } from 'storybook/test';

/**
 * Story-only check of a field's required mark against Figma's "Label row" (input · textarea · select ·
 * date-picker_trigger, Required on): a 4 × 4 dot, spacing/margin/m-2 (8px) after the label, centred on the label line,
 * filled with the field's …/required/default token and hidden from assistive technology.
 */
export async function expectRequiredMark(field: Element, token: string) {
  const row = field.querySelector('.ds-field__label-row');
  const label = row?.querySelector('.ds-field__label');
  const dot = row?.querySelector<HTMLElement>('.ds-field__required');
  await expect(label).toBeTruthy();
  await expect(dot).toBeTruthy();
  const l = label!.getBoundingClientRect();
  const d = dot!.getBoundingClientRect();
  await expect([d.width, d.height]).toEqual([4, 4]);
  await expect(Math.abs(d.left - l.right - 8)).toBeLessThan(0.5);
  await expect(Math.abs(d.top + d.height / 2 - (l.top + l.height / 2))).toBeLessThan(0.5);
  await expect(dot).toHaveAttribute('aria-hidden', 'true');

  const probe = document.createElement('span');
  probe.style.backgroundColor = `var(${token})`;
  document.body.append(probe);
  const expected = getComputedStyle(probe).backgroundColor;
  probe.remove();
  await expect(expected).not.toBe('rgba(0, 0, 0, 0)');
  await expect(getComputedStyle(dot!).backgroundColor).toBe(expected);
}
