/** 필터 칩 글자를 만듭니다. 필터 이름 뒤에 적용된 값(목록이 열려 있으면 고른 값)을 붙입니다. 예: "나이대: 10대, 20대, 30대 외 2" */
export function filterChipText(label: string, names: string[], maxDisplayed = 3) {
  if (!names.length) return label;
  const shown = names.slice(0, Math.max(1, maxDisplayed)).join(', ');
  const rest = names.length - Math.max(1, maxDisplayed);
  return `${label}: ${shown}${rest > 0 ? ` 외 ${rest}` : ''}`;
}
