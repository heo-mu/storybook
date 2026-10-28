/**
 * 필터 칩 글자를 만듭니다(표시 규칙 2026-10-28). 값이 없으면 필터 이름, 하나면 "필터명: 값", 둘 이상이면
 * "필터명: 첫 값 외 n개" — n은 보여 준 값을 뺀 나머지 수. `maxDisplayed`로 이름을 나열할 값의 수를 늘릴 수 있습니다.
 * 예: "지역", "지역: 서울", "지역: 서울 외 2개"; maxDisplayed 3이면 "지역: 서울, 경기, 인천 외 1개".
 */
export function filterChipText(label: string, names: string[], maxDisplayed = 1) {
  if (!names.length) return label;
  const count = Math.max(1, maxDisplayed);
  const shown = names.slice(0, count).join(', ');
  const rest = names.length - count;
  return `${label}: ${shown}${rest > 0 ? ` 외 ${rest}개` : ''}`;
}
