/**
 * Story `beforeEach`: fixes "today" (react-aria / @internationalized/date read Date.now()) so calendar
 * stories render the same month and Today cell as the Figma example. Only for static verification stories.
 */
export const mockToday = (iso: string) => () => {
  const realNow = Date.now;
  const fixed = new Date(`${iso}T12:00:00`).getTime();
  Date.now = () => fixed;
  return () => {
    Date.now = realNow;
  };
};
