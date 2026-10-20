import { CalendarDate } from '@internationalized/date';
import type { ISODate } from '../Calendar';

/** 'YYYY-MM-DD' 값을 화면에 보이는 'YYYY.MM.DD' 형식으로 바꿉니다. */
export function formatDateText(value: ISODate | null | undefined): string {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  return `${y}.${m}.${d}`;
}

/**
 * Parses typed text: 'YYYY.MM.DD', 'YYYY-MM-DD', 'YYYY/MM/DD' (one- or two-digit month and day) or 'YYYYMMDD'.
 * Returns the ISO date, or null when the text is not a real calendar date.
 */
export function parseDateText(text: string): ISODate | null {
  const match = /^(\d{4})[.\-/]?(\d{1,2})[.\-/]?(\d{1,2})\.?$/.exec(text.replace(/\s+/g, ''));
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  if (month < 1 || month > 12 || day < 1) return null;
  const date = new CalendarDate(year, month, day);
  // CalendarDate constrains out-of-range days (2026-02-31 → 02-28): reject those.
  return date.month === month && date.day === day ? date.toString() : null;
}
