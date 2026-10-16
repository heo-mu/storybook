import { useCallback, useState } from 'react';

/** Value that is controlled when `value` is defined, otherwise kept internally from `defaultValue`. */
export function useControllableState<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void) {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;
  const setValue = useCallback(
    (next: T) => {
      if (!controlled) setInternal(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [current, setValue] as const;
}
