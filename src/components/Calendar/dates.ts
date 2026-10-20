import { parseDate, type CalendarDate } from '@internationalized/date';

/** 'YYYY-MM-DD' 형식의 날짜 문자열입니다. */
export type ISODate = string;

/** Parses 'YYYY-MM-DD'; returns null for anything else. */
export function toCalendarDate(value: ISODate | null | undefined): CalendarDate | null {
  if (!value) return null;
  try {
    return parseDate(value);
  } catch {
    return null;
  }
}

export const toISODate = (date: CalendarDate | null | undefined): ISODate | null => (date ? date.toString() : null);
