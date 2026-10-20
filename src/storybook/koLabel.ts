const TITLES: Record<string, string> = {
  State: 'States',
  'State (sm)': 'States (sm)',
  'InputChip (chip-input) — remove': 'InputChip — 삭제',
  'FilterChip (chip-filter) — opens a filter': 'FilterChip — 필터 열기',
  'Chip (chip-multi) — toggle': 'Chip — 다중 선택',
  'Calendar (date-picker_calendar)': 'Calendar',
  'RadioGroup (vertical · horizontal)': 'RadioGroup — Vertical / Horizontal',
  'Message (info · success · error)': 'Messages',
  'Message · Error · Disabled · Read-only': 'Messages · Error · Disabled · Read Only',
  'Password · Disabled · Read-only': 'Password · Disabled · Read Only',
  'Default · Hover (value label) · Disabled': 'Default · Hover · Disabled',
  'Size (sm · md) · message · counter': 'Sizes · Messages · Character Count',
  'Item (Default · Hover · Pressed · Current) · Control (Default · Hover · Pressed · Disabled)': 'Page Numbers · Controls',
};

/** Keep component state names intact and clarify explanatory gallery captions. */
export function koLabel(label: string): string {
  return TITLES[label] ?? label;
}
