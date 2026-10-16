import { useCallback, useState, type ChangeEvent } from 'react';

type Value = string | number | readonly string[] | undefined;

/**
 * Tracks whether a native input/textarea has a value (Figma State "Completed") for both controlled
 * and uncontrolled use, without taking ownership of the value.
 */
export function useFieldValue<E extends HTMLInputElement | HTMLTextAreaElement>(value: Value, defaultValue: Value, onChange?: (event: ChangeEvent<E>) => void) {
  const [uncontrolled, setUncontrolled] = useState(() => String(defaultValue ?? ''));
  const current = value !== undefined ? String(value) : uncontrolled;
  const handleChange = useCallback(
    (event: ChangeEvent<E>) => {
      if (value === undefined) setUncontrolled(event.target.value);
      onChange?.(event);
    },
    [value, onChange],
  );
  return { current, filled: current !== '', handleChange };
}

/**
 * Sets a native input's value the way a user edit would, so React's onChange fires for both
 * controlled and uncontrolled inputs (used by the clear buttons).
 */
export function setNativeValue(element: HTMLInputElement | HTMLTextAreaElement, next: string) {
  const proto = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(element, next);
  element.dispatchEvent(new Event('input', { bubbles: true }));
}
