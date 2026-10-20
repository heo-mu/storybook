import { useLayoutEffect, type RefObject } from 'react';

/**
 * Story-only: rounds the width of every caption cell (`th`) of a matrix table up to a whole pixel. A caption's text
 * width is fractional, and the table would place the variant cells after it between pixels — the Figma parity check
 * compares glyph positions to the pixel, so the cells must start on whole pixels.
 */
export function useWholePixelCaptions(table: RefObject<HTMLTableElement | null>) {
  useLayoutEffect(() => {
    const el = table.current;
    if (!el) return;
    for (const th of el.querySelectorAll<HTMLTableCellElement>('th')) {
      const range = document.createRange();
      range.selectNodeContents(th);
      const text = range.getBoundingClientRect().width;
      th.style.width = `${Math.ceil(text)}px`;
    }
  });
}
