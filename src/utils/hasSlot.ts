import type { ReactNode } from 'react';

/** True when a slot value would render something (false/null/undefined/'' render nothing). */
export function hasSlot(node: ReactNode): boolean {
  return node !== undefined && node !== null && node !== false && node !== '';
}
