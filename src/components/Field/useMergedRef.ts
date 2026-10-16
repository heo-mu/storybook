import { useCallback, type Ref, type RefObject } from 'react';

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) (ref as RefObject<T | null>).current = node;
}

/** Combines a forwarded ref with a local ref. */
export function useMergedRef<T>(first: Ref<T> | undefined, second: Ref<T> | undefined) {
  return useCallback(
    (node: T | null) => {
      assignRef(first, node);
      assignRef(second, node);
    },
    [first, second],
  );
}
