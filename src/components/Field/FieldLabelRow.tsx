import type { ReactNode } from 'react';

/**
 * Figma "Label row" (input · textarea · select · date-picker_trigger): the label and, for a required field, a 4px dot
 * spacing/margin/m-2 after it. The dot is decorative — the control itself carries `required` / `aria-required`.
 */
export function FieldLabelRow({ required = false, children }: { required?: boolean; children: ReactNode }) {
  return (
    <div className="ds-field__label-row">
      {children}
      {required && <span className="ds-field__required" aria-hidden="true" />}
    </div>
  );
}
