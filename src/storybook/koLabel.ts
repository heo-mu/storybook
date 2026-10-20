// Story-only: Korean captions for the "전체 보기" matrices. Only state names are translated — prop values
// (primary, solid, sm …) and component names stay as they are, because developers type them in code.
const STATE: Record<string, string> = {
  Default: '기본',
  Hover: '마우스 올림',
  Pressed: '누름',
  Disabled: '비활성',
  Selected: '선택됨',
  Unselected: '선택 안 됨',
  Focus: '포커스',
  Error: '오류',
  Completed: '입력 완료',
  'Read-only': '읽기 전용',
  Open: '열림',
  Expanded: '펼침',
  Collapsed: '접힘',
  Checked: '선택됨',
  Unchecked: '선택 안 됨',
  Indeterminate: '일부 선택',
  Current: '현재',
  Today: '오늘',
  Outside: '다른 달',
  'Drag-over': '끌어다 놓는 중',
  Visited: '방문함',
  Editing: '편집 중',
};

const WORDS = Object.keys(STATE).sort((a, b) => b.length - a.length);
const RE = new RegExp(`(^|[\\s(·/,=])(${WORDS.map((w) => w.replace(/[-]/g, '\\-')).join('|')})(?=$|[\\s)·/,])`, 'g');

/** Section titles that read better rewritten than word-by-word. */
const TITLE: Record<string, string> = {
  State: '상태',
  'State (sm)': '상태 (sm)',
  Rounded: '둥근 모양',
  InputChip: 'InputChip',
  'InputChip (chip-input) — remove': 'InputChip — 삭제',
  'FilterChip (chip-filter) — opens a filter': 'FilterChip — 필터 열기',
  'FilterChip · Selected': 'FilterChip · 선택됨',
  'Chip (chip-multi) — toggle': 'Chip — 선택 켜고 끄기',
  'Calendar (date-picker_calendar)': '달력',
  'RadioGroup (vertical · horizontal)': 'RadioGroup (세로 · 가로)',
  'Fixed width · Disabled': '고정 너비 · 비활성',
  'Message (info · success · error)': '메시지 (안내 · 성공 · 오류)',
  'Message · Error · Disabled · Read-only': '메시지 · 오류 · 비활성 · 읽기 전용',
  'Password · Disabled · Read-only': '비밀번호 · 비활성 · 읽기 전용',
  'External · Disabled': '새 창 링크 · 비활성',
  'Default · Hover (value label) · Disabled': '기본 · 마우스 올림(값 표시) · 비활성',
  'Size (sm · md) · message · counter': '크기 (sm · md) · 메시지 · 글자 수',
  'Loading (md · sm)': '로딩 (md · sm)',
  'Item (Default · Hover · Pressed · Current) · Control (Default · Hover · Pressed · Disabled)': '페이지 번호 (기본 · 마우스 올림 · 누름 · 현재) · 이전 · 다음 (기본 · 마우스 올림 · 누름 · 비활성)',
};

/** Korean caption for a matrix row / column label or a section title. */
export function koLabel(label: string): string {
  if (TITLE[label]) return TITLE[label];
  return label
    .replace(/^Size\b/, '크기')
    .replace(/^Selection\b/, '선택')
    .replace(/^Variant × Appearance\b/, '종류 × 모양')
    .replace(RE, (_, pre: string, word: string) => pre + STATE[word]);
}
