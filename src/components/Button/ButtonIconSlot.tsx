import type { ReactNode } from 'react';

/** Figma "icon_size" frame: a fixed 16/20px square that the icon fills. */
export function ButtonIconSlot({ children }: { children: ReactNode }) {
  return (
    <span className="ds-button__icon" aria-hidden="true">
      {children}
    </span>
  );
}
